"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { saveTestSchema } from "@/lib/validations";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function saveTypingTest(data: z.infer<typeof saveTestSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = saveTestSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid data" };

  // Get test config
  let config = await prisma.testConfig.findFirst();
  if (!config) {
    config = await prisma.testConfig.create({
      data: { minWpm: 35, minAccuracy: 90, maxMistakes: 10 },
    });
  }

  const { wpm, accuracy, mistakes } = parsed.data;
  const passed =
    wpm >= config.minWpm &&
    accuracy >= config.minAccuracy &&
    mistakes <= config.maxMistakes;

  const status = passed ? "PASSED" : "FAILED";

  const test = await prisma.typingTest.create({
    data: {
      userId: session.user.id,
      language: parsed.data.language,
      wpm: parsed.data.wpm,
      accuracy: parsed.data.accuracy,
      mistakes: parsed.data.mistakes,
      correctChars: parsed.data.correctChars,
      incorrectChars: parsed.data.incorrectChars,
      totalChars: parsed.data.totalChars,
      duration: parsed.data.duration,
      status,
      paragraphId: parsed.data.paragraphId || null,
    },
  });

  // Auto-create certificate request if passed
  if (passed) {
    await prisma.certificateRequest.create({
      data: {
        userId: session.user.id,
        testId: test.id,
        status: "PENDING",
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");

  return { success: true, test, passed };
}

export async function getUserTests(userId?: string) {
  const session = await auth();
  const id = userId || session?.user?.id;
  if (!id) return [];

  return prisma.typingTest.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getLeaderboard(
  language?: string,
  period?: "daily" | "weekly" | "all"
) {
  const where: Record<string, unknown> = { status: "PASSED" };
  if (language) where.language = language;

  if (period === "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    where.createdAt = { gte: today };
  } else if (period === "weekly") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    where.createdAt = { gte: weekAgo };
  }

  return prisma.typingTest.findMany({
    where,
    orderBy: { wpm: "desc" },
    take: 50,
    include: { user: { select: { id: true, name: true } } },
  });
}

export async function getParagraph(language: string, difficulty?: string) {
  const where: Record<string, unknown> = { language, isActive: true };
  if (difficulty) where.difficulty = difficulty;

  const paragraphs = await prisma.typingParagraph.findMany({ where });
  if (paragraphs.length === 0) return null;
  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

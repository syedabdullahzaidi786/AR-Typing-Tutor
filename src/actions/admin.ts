"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { paragraphSchema, testConfigSchema } from "@/lib/validations";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

export async function getAdminStats() {
  await requireAdmin();
  const [users, tests, requests, certificates] = await Promise.all([
    prisma.user.count(),
    prisma.typingTest.count(),
    prisma.certificateRequest.count({ where: { status: "PENDING" } }),
    prisma.certificate.count(),
  ]);
  return { users, tests, pendingRequests: requests, certificates };
}

export async function getAllUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
      _count: { select: { typingTests: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function banUser(userId: string, ban: boolean) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { isBanned: ban } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function changeUserRole(userId: string, role: "USER" | "ADMIN") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function addParagraph(data: z.infer<typeof paragraphSchema>) {
  await requireAdmin();
  const parsed = paragraphSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.typingParagraph.create({ data: parsed.data });
  revalidatePath("/admin/paragraphs");
  return { success: true };
}

export async function updateParagraph(
  id: string,
  data: z.infer<typeof paragraphSchema>
) {
  await requireAdmin();
  await prisma.typingParagraph.update({ where: { id }, data });
  revalidatePath("/admin/paragraphs");
  return { success: true };
}

export async function deleteParagraph(id: string) {
  await requireAdmin();
  await prisma.typingParagraph.delete({ where: { id } });
  revalidatePath("/admin/paragraphs");
  return { success: true };
}

export async function toggleParagraph(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.typingParagraph.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/paragraphs");
  return { success: true };
}

export async function getAllParagraphs() {
  await requireAdmin();
  return prisma.typingParagraph.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getTestConfig() {
  let config = await prisma.testConfig.findFirst();
  if (!config) {
    config = await prisma.testConfig.create({
      data: { minWpm: 35, minAccuracy: 90, maxMistakes: 10 },
    });
  }
  return config;
}

export async function updateTestConfig(data: z.infer<typeof testConfigSchema>) {
  await requireAdmin();
  const parsed = testConfigSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.testConfig.findFirst();
  if (existing) {
    await prisma.testConfig.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    await prisma.testConfig.create({ data: parsed.data });
  }
  revalidatePath("/admin");
  return { success: true };
}

export async function getAllTests() {
  await requireAdmin();
  return prisma.typingTest.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function seedParagraphs() {
  await requireAdmin();
  const { defaultParagraphs } = await import("@/lib/paragraphs");

  for (const [lang, paragraphs] of Object.entries(defaultParagraphs)) {
    for (const p of paragraphs) {
      await prisma.typingParagraph.upsert({
        where: {
          id: `${lang}-${p.difficulty}`,
        },
        update: {},
        create: {
          id: `${lang}-${p.difficulty}`,
          language: lang as "english" | "urdu" | "arabic" | "sindhi",
          difficulty: p.difficulty,
          content: p.content,
          isActive: true,
        },
      });
    }
  }
  revalidatePath("/admin/paragraphs");
  return { success: true };
}

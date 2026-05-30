"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { paragraphSchema, testConfigSchema, registerSchema } from "@/lib/validations";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

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

export async function addUser(data: z.infer<typeof registerSchema>) {
  await requireAdmin();
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already registered" };

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, password: hashed } });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateAdminProfile(data: {
  name?: string;
  email?: string;
  password?: string;
}) {
  const session = await requireAdmin();
  const updateData: any = {};

  if (data.name) updateData.name = data.name;
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: session.user.id } },
    });
    if (existing) return { error: "Email already in use" };
    updateData.email = data.email;
  }
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function resetUserPassword(userId: string, newPassword: string) {
  await requireAdmin();
  
  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

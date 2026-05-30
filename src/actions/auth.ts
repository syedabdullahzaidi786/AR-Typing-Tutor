"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { signIn, signOut, auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function registerUser(data: z.infer<typeof registerSchema>) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return { success: true };
}

export async function loginUser(email: string, password: string) {
  // First check user exists and status
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password" };
  }
  if (user.isBanned) {
    return { error: "Your account has been banned. Please contact support." };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  // Then sign in
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  
  return { success: true, role: user.role };
}

export async function logoutUser() {
  await signOut({ redirect: false });
}

export async function updateUserPassword(newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

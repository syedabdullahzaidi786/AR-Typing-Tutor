"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
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
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "Invalid credentials" };
  }
}

export async function logoutUser() {
  await signOut({ redirect: false });
}

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const paragraphSchema = z.object({
  language: z.enum(["english", "urdu", "arabic", "sindhi"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  content: z.string().min(10, "Content must be at least 10 characters"),
  isActive: z.boolean(),
});

export const testConfigSchema = z.object({
  minWpm: z.number().min(1).max(300),
  minAccuracy: z.number().min(1).max(100),
  maxMistakes: z.number().min(0).max(1000),
});

export const saveTestSchema = z.object({
  language: z.enum(["english", "urdu", "arabic", "sindhi"]),
  wpm: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  mistakes: z.number().min(0),
  correctChars: z.number().min(0),
  incorrectChars: z.number().min(0),
  totalChars: z.number().min(0),
  duration: z.number().min(1),
  paragraphId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ParagraphInput = z.infer<typeof paragraphSchema>;
export type TestConfigInput = z.infer<typeof testConfigSchema>;
export type SaveTestInput = z.infer<typeof saveTestSchema>;

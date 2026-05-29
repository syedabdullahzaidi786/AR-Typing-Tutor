import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCertificateNumber(): string {
  const prefix = "ART";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getLanguageLabel(lang: string): string {
  const labels: Record<string, string> = {
    english: "English",
    urdu: "اردو",
    arabic: "العربية",
    sindhi: "سنڌي",
  };
  return labels[lang] || lang;
}

export function isRTL(lang: string): boolean {
  return ["urdu", "arabic", "sindhi"].includes(lang);
}

export function getLanguageFont(lang: string): string {
  const fonts: Record<string, string> = {
    urdu: "'Noto Nastaliq Urdu', serif",
    arabic: "'Amiri', serif",
    sindhi: "'Noto Sans Arabic', sans-serif",
    english: "'Inter', sans-serif",
  };
  return fonts[lang] || "'Inter', sans-serif";
}

export function calculateWPM(correctChars: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  const minutes = timeInSeconds / 60;
  const words = correctChars / 5;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100 * 10) / 10;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: "text-green-400",
    intermediate: "text-yellow-400",
    advanced: "text-red-400",
  };
  return colors[difficulty] || "text-gray-400";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PASSED: "text-green-400",
    FAILED: "text-red-400",
    INCOMPLETE: "text-yellow-400",
    PENDING: "text-yellow-400",
    APPROVED: "text-green-400",
    REJECTED: "text-red-400",
  };
  return colors[status] || "text-gray-400";
}

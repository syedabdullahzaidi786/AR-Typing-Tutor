export type Role = "USER" | "ADMIN";
export type Language = "english" | "urdu" | "arabic" | "sindhi";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type TestStatus = "PASSED" | "FAILED" | "INCOMPLETE";
export type CertificateRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isBanned: boolean;
  createdAt: Date;
}

export interface TypingTest {
  id: string;
  userId: string;
  language: Language;
  wpm: number;
  accuracy: number;
  mistakes: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number;
  status: TestStatus;
  createdAt: Date;
  user?: User;
}

export interface CertificateRequest {
  id: string;
  userId: string;
  testId: string;
  status: CertificateRequestStatus;
  approvedById?: string;
  createdAt: Date;
  user?: User;
  test?: TypingTest;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  testId: string;
  requestId: string;
  imageUrl?: string;
  issuedAt: Date;
  user?: User;
  test?: TypingTest;
}

export interface TypingParagraph {
  id: string;
  language: Language;
  difficulty: Difficulty;
  content: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  correctChars: number;
  incorrectChars: number;
  remainingTime: number;
  totalChars: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  wpm: number;
  accuracy: number;
  language: Language;
  createdAt: Date;
}

export interface TestConfig {
  id: string;
  minWpm: number;
  minAccuracy: number;
  maxMistakes: number;
}

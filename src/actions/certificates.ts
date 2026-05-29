"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateCertificateNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getUserCertificateRequests() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.certificateRequest.findMany({
    where: { userId: session.user.id },
    include: {
      test: true,
      certificate: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllCertificateRequests() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return [];

  return prisma.certificateRequest.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      test: true,
      certificate: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveCertificateRequest(requestId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const request = await prisma.certificateRequest.findUnique({
    where: { id: requestId },
    include: { test: true, certificate: true },
  });

  if (!request) return { error: "Request not found" };

  let certNumber: string;
  
  if (request.certificate) {
    // Already has a certificate, just update request status
    certNumber = request.certificate.certificateNumber;
    await prisma.certificateRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED", approvedById: session.user.id },
    });
  } else {
    // Create new certificate
    certNumber = generateCertificateNumber();
    await prisma.$transaction([
      prisma.certificateRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED", approvedById: session.user.id },
      }),
      prisma.certificate.create({
        data: {
          certificateNumber: certNumber,
          userId: request.userId,
          testId: request.testId,
          requestId: request.id,
        },
      }),
    ]);
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  return { success: true, certNumber };
}

export async function rejectCertificateRequest(requestId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  // Check if there's an existing certificate and delete it if needed
  const request = await prisma.certificateRequest.findUnique({
    where: { id: requestId },
    include: { certificate: true },
  });

  if (!request) return { error: "Request not found" };

  await prisma.$transaction([
    prisma.certificateRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED", approvedById: session.user.id },
    }),
    // Optional: Delete certificate if we want, but maybe keep it for records? User asked for multiple approve/reject, so let's not delete
  ]);

  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  return { success: true };
}

export async function getCertificateByNumber(certNumber: string) {
  return prisma.certificate.findUnique({
    where: { certificateNumber: certNumber },
    include: {
      user: { select: { name: true } },
      test: true,
      request: true,
    },
  });
}

export async function updateCertificateImage(certId: string, imageUrl: string) {
  return prisma.certificate.update({
    where: { id: certId },
    data: { imageUrl },
  });
}

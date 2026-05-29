"use client";

import { useState } from "react";
import { approveCertificateRequest, rejectCertificateRequest } from "@/actions/certificates";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function CertificateActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approveCertificateRequest(requestId);
    router.refresh();
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectCertificateRequest(requestId);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50"
      >
        <CheckCircle className="w-4 h-4" />
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
      >
        <XCircle className="w-4 h-4" />
        Reject
      </button>
    </div>
  );
}

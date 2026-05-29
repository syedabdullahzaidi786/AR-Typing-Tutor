import { getCertificateByNumber } from "@/actions/certificates";
import { Shield, CheckCircle, XCircle, User, Zap, Target, Calendar } from "lucide-react";
import { formatDate, getLanguageLabel } from "@/lib/utils";
import Link from "next/link";
import CertificateCard from "@/components/certificate/CertificateCard";

interface VerifyPageProps {
  params: Promise<{ certificateId: string }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { certificateId } = await params;
  const certificate = await getCertificateByNumber(certificateId);

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Certificate Not Found</h1>
          <p className="text-gray-400 mb-6">
            The certificate{" "}
            <span className="text-red-400 font-mono">{certificateId}</span> does
            not exist or may have been revoked.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const details = [
    { icon: User, label: "Recipient", value: certificate.user.name },
    { icon: Zap, label: "WPM", value: `${Math.round(certificate.test.wpm)} words/min` },
    { icon: Target, label: "Accuracy", value: `${certificate.test.accuracy.toFixed(1)}%` },
    { icon: Shield, label: "Language", value: getLanguageLabel(certificate.test.language) },
    { icon: Calendar, label: "Test Duration", value: `${certificate.test.duration}s` },
    { icon: Calendar, label: "Issued On", value: formatDate(certificate.issuedAt) },
  ];

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verified badge */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Certificate Verified ✓</h1>
          <p className="text-gray-400 mt-1">This certificate is authentic and valid</p>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Left: Details card */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Certificate Number</p>
                <p className="text-violet-400 font-mono font-semibold mt-1">
                  {certificate.certificateNumber}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">VALID</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {details.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{detail.label}</p>
                      <p className="text-sm font-medium text-white mt-0.5">{detail.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                Issued by{" "}
                <span className="text-violet-400 font-medium">AR Typing Tutor</span>
              </p>
            </div>
          </div>

          {/* Right: Certificate preview + download */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Certificate Preview & Download</h2>
            <CertificateCard
              certificate={{
                certificateNumber: certificate.certificateNumber,
                issuedAt: certificate.issuedAt,
                user: { name: certificate.user.name },
                test: {
                  language: certificate.test.language,
                  wpm: certificate.test.wpm,
                  accuracy: certificate.test.accuracy,
                  duration: certificate.test.duration,
                },
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back to AR Typing Tutor
          </Link>
        </div>
      </div>
    </div>
  );
}

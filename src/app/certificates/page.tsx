import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserCertificateRequests } from "@/actions/certificates";
import { Award, Clock, CheckCircle, XCircle, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import CertificateCard from "@/components/certificate/CertificateCard";

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const requests = await getUserCertificateRequests();

  const approved = requests.filter((r) => r.status === "APPROVED" && r.certificate);
  const pending = requests.filter((r) => r.status === "PENDING");
  const rejected = requests.filter((r) => r.status === "REJECTED");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Certificates</h1>
          <p className="text-gray-400 text-sm">Your earned certificates</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/60 border border-gray-800 rounded-2xl">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h2>
          <p className="text-gray-400 mb-6">Pass a typing test to earn your first certificate!</p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Take a Test
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Approved Certificates */}
          {approved.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Approved Certificates ({approved.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {approved.map((req) =>
                  req.certificate ? (
                    <div key={req.id} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                      <CertificateCard
                        certificate={{
                          certificateNumber: req.certificate.certificateNumber,
                          issuedAt: req.certificate.issuedAt,
                          user: { name: session.user.name || "User" },
                          test: {
                            language: req.test.language,
                            wpm: req.test.wpm,
                            accuracy: req.test.accuracy,
                            duration: req.test.duration,
                          },
                        }}
                      />
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>Issued: {formatDate(req.certificate.issuedAt)}</span>
                        <Link
                          href={`/verify/${req.certificate.certificateNumber}`}
                          className="text-violet-400 hover:text-violet-300"
                        >
                          Verify →
                        </Link>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Pending Requests ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-xl"
                  >
                    <div>
                      <p className="text-white font-medium">Certificate Request</p>
                      <p className="text-sm text-gray-400">
                        {req.test.wpm.toFixed(0)} WPM • {req.test.accuracy.toFixed(1)}% accuracy
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(req.createdAt)}</p>
                    </div>
                    <Badge variant="warning">PENDING</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected */}
          {rejected.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Rejected ({rejected.length})
              </h2>
              <div className="space-y-3">
                {rejected.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-xl opacity-60"
                  >
                    <div>
                      <p className="text-white font-medium">Certificate Request</p>
                      <p className="text-xs text-gray-500">{formatDate(req.createdAt)}</p>
                    </div>
                    <Badge variant="danger">REJECTED</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

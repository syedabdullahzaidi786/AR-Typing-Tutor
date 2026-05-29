import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllCertificateRequests } from "@/actions/certificates";
import { Award } from "lucide-react";
import { formatDate, getLanguageLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import CertificateActions from "./CertificateActions";

export default async function AdminCertificatesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const requests = await getAllCertificateRequests();

  const pending = requests.filter((r) => r.status === "PENDING");
  const processed = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Certificate Requests</h1>
          <p className="text-gray-400 text-sm">{pending.length} pending approval</p>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">Pending ({pending.length})</h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
            {pending.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {req.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{req.user.name}</p>
                    <p className="text-gray-400 text-sm">{req.user.email}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-violet-400 font-bold">{Math.round(req.test.wpm)}</p>
                    <p className="text-gray-500 text-xs">WPM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 font-bold">{req.test.accuracy.toFixed(1)}%</p>
                    <p className="text-gray-500 text-xs">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400">{getLanguageLabel(req.test.language)}</p>
                    <p className="text-gray-500 text-xs">Language</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300">{formatDate(req.createdAt)}</p>
                    <p className="text-gray-500 text-xs">Requested</p>
                  </div>
                </div>
                <CertificateActions requestId={req.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed */}
      {processed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-400 mb-4">Processed ({processed.length})</h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
            {processed.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {req.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{req.user.name}</p>
                    <p className="text-gray-400 text-sm">{req.user.email}</p>
                    {req.certificate && (
                      <p className="text-violet-400 font-mono text-xs">{req.certificate.certificateNumber}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={req.status === "APPROVED" ? "success" : "danger"}
                  >
                    {req.status}
                  </Badge>
                  <CertificateActions requestId={req.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="text-center py-16 bg-gray-900/60 border border-gray-800 rounded-2xl">
          <Award className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">No certificate requests yet</p>
        </div>
      )}
    </div>
  );
}

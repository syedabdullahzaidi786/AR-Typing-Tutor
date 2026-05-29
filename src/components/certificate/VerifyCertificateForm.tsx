"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyCertificateForm() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    
    setLoading(true);
    router.push(`/verify/${encodeURIComponent(certId.trim())}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Verify Certificate
              </h2>
              <p className="text-gray-400 text-sm max-w-xl">
                Verify the validity and authenticity of any certificate issued by AR Typing Tutor. Enter the certificate number to instantly view its records.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleVerify} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-stretch shrink-0">
            <input
              type="text"
              placeholder="Enter Certificate ID..."
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="px-4 py-3 bg-gray-950/80 border border-gray-800 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition-colors w-full sm:w-64"
              required
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-violet-500/10 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Verify
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}

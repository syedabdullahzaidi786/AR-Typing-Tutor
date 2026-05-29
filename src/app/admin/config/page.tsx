import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTestConfig } from "@/actions/admin";
import { Settings } from "lucide-react";
import TestConfigForm from "./TestConfigForm";

export default async function AdminConfigPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const config = await getTestConfig();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Test Configuration</h1>
          <p className="text-gray-400 text-sm">Set passing criteria for tests</p>
        </div>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
          Users must meet ALL criteria to pass a test and receive a certificate request.
        </div>
        <TestConfigForm config={config} />
      </div>
    </div>
  );
}

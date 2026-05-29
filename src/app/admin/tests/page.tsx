import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllTests } from "@/actions/admin";
import { BarChart3 } from "lucide-react";
import { formatDate, getLanguageLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default async function AdminTestsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const tests = await getAllTests();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">All Tests</h1>
          <p className="text-gray-400 text-sm">{tests.length} total tests</p>
        </div>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Language</div>
          <div className="col-span-1">WPM</div>
          <div className="col-span-2">Accuracy</div>
          <div className="col-span-1">Mistakes</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Date</div>
        </div>

        {tests.map((test) => (
          <div
            key={test.id}
            className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20 transition-colors items-center text-sm"
          >
            <div className="col-span-3 text-white truncate">{test.user.name}</div>
            <div className="col-span-2 text-gray-400">{getLanguageLabel(test.language)}</div>
            <div className="col-span-1 text-violet-400 font-bold">{Math.round(test.wpm)}</div>
            <div className="col-span-2 text-green-400">{test.accuracy.toFixed(1)}%</div>
            <div className="col-span-1 text-red-400">{test.mistakes}</div>
            <div className="col-span-1">
              <Badge
                variant={
                  test.status === "PASSED"
                    ? "success"
                    : test.status === "FAILED"
                    ? "danger"
                    : "warning"
                }
              >
                {test.status}
              </Badge>
            </div>
            <div className="col-span-2 text-gray-500">{formatDate(test.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

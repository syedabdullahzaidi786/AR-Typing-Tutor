import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard, Trophy, Award, Target, TrendingUp } from "lucide-react";
import { formatDate, getLanguageLabel, getStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [tests, requests] = await Promise.all([
    prisma.typingTest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.certificateRequest.findMany({
      where: { userId: session.user.id },
      include: { certificate: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const passedTests = tests.filter((t) => t.status === "PASSED");
  const bestWpm = tests.length > 0 ? Math.max(...tests.map((t) => t.wpm)) : 0;
  const avgAccuracy =
    tests.length > 0
      ? Math.round(tests.reduce((a, b) => a + b.accuracy, 0) / tests.length * 10) / 10
      : 0;

  const stats = [
    { label: "Total Tests", value: tests.length, icon: Target, color: "from-violet-600 to-indigo-600" },
    { label: "Tests Passed", value: passedTests.length, icon: Trophy, color: "from-green-600 to-emerald-600" },
    { label: "Best WPM", value: Math.round(bestWpm), icon: TrendingUp, color: "from-blue-600 to-cyan-600" },
    { label: "Avg Accuracy", value: `${avgAccuracy}%`, icon: Award, color: "from-yellow-600 to-orange-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, {session.user.name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Tests</h2>
            <Link href="/test" className="text-sm text-violet-400 hover:text-violet-300">
              Take Test →
            </Link>
          </div>
          {tests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tests yet. Take your first test!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tests.slice(0, 6).map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 bg-gray-800/60 rounded-xl"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {Math.round(test.wpm)} WPM
                      </span>
                      <span className="text-xs text-gray-500">
                        {test.accuracy.toFixed(1)}% acc
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getLanguageLabel(test.language)} • {formatDate(test.createdAt)}
                    </p>
                  </div>
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
              ))}
            </div>
          )}
        </div>

        {/* Certificate Requests */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Certificates</h2>
            <Link href="/certificates" className="text-sm text-violet-400 hover:text-violet-300">
              View All →
            </Link>
          </div>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Pass a test to earn certificates!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-gray-800/60 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      Certificate Request
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(req.createdAt)}
                    </p>
                    {req.certificate && (
                      <p className="text-xs text-violet-400 font-mono mt-0.5">
                        {req.certificate.certificateNumber}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      req.status === "APPROVED"
                        ? "success"
                        : req.status === "REJECTED"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {req.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { href: "/practice", label: "Practice", color: "from-violet-600 to-indigo-600" },
          { href: "/test", label: "Take Test", color: "from-blue-600 to-cyan-600" },
          { href: "/leaderboard", label: "Leaderboard", color: "from-yellow-600 to-orange-600" },
          { href: "/certificates", label: "Certificates", color: "from-green-600 to-emerald-600" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`py-3 rounded-xl bg-gradient-to-r ${action.color} text-white text-sm font-medium text-center hover:opacity-90 transition-opacity`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/actions/admin";
import { Settings, Users, FileText, Award, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";
import AdminProfileEdit from "./AdminProfileEdit";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const stats = await getAdminStats();

  const cards = [
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
      value: stats.users,
      color: "from-violet-600 to-indigo-600",
      desc: "Manage all users",
    },
    {
      href: "/admin/tests",
      icon: BarChart3,
      label: "Tests",
      value: stats.tests,
      color: "from-blue-600 to-cyan-600",
      desc: "View all test results",
    },
    {
      href: "/admin/certificates",
      icon: Award,
      label: "Pending Requests",
      value: stats.pendingRequests,
      color: "from-yellow-600 to-orange-600",
      desc: "Approve/reject certificates",
    },
    {
      href: "/admin/certificates",
      icon: FileText,
      label: "Certificates",
      value: stats.certificates,
      color: "from-green-600 to-emerald-600",
      desc: "All issued certificates",
    },
    {
      href: "/admin/paragraphs",
      icon: FileText,
      label: "Paragraphs",
      value: null,
      color: "from-pink-600 to-rose-600",
      desc: "Manage typing content",
    },
    {
      href: "/admin/config",
      icon: Settings,
      label: "Test Config",
      value: null,
      color: "from-teal-600 to-green-600",
      desc: "Configure pass criteria",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Manage the platform</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href + card.label}
              href={card.href}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              {card.value !== null && (
                <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              )}
              <p className="text-white font-semibold">{card.label}</p>
              <p className="text-gray-400 text-sm mt-1">{card.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="mt-8 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/paragraphs"
            className="px-4 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 rounded-lg text-sm hover:bg-violet-600/30 transition-colors"
          >
            + Add Paragraph
          </Link>
          <Link
            href="/admin/certificates"
            className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 rounded-lg text-sm hover:bg-yellow-600/30 transition-colors"
          >
            Review Certificates
          </Link>
          <Link
            href="/admin/config"
            className="px-4 py-2 bg-teal-600/20 border border-teal-500/30 text-teal-300 rounded-lg text-sm hover:bg-teal-600/30 transition-colors"
          >
            Update Pass Criteria
          </Link>
        </div>
      </div>

      {/* Profile Edit */}
      <div className="mt-8">
        <AdminProfileEdit
          currentName={session.user.name}
          currentEmail={session.user.email}
        />
      </div>
    </div>
  );
}

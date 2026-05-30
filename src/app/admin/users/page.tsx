import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/actions/admin";
import { Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import AdminUserActions from "./AdminUserActions";
import AddUserForm from "./AddUserForm";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const users = await getAllUsers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm">{users.length} total users</p>
        </div>
      </div>

      <AddUserForm />

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-1">Role</div>
          <div className="col-span-1">Tests</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20 transition-colors items-center"
          >
            <div className="col-span-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium truncate">{user.name}</span>
            </div>
            <div className="col-span-3 text-gray-400 text-sm truncate">{user.email}</div>
            <div className="col-span-1">
              <Badge variant={user.role === "ADMIN" ? "info" : "default"}>
                {user.role}
              </Badge>
            </div>
            <div className="col-span-1 text-gray-400 text-sm">{user._count.typingTests}</div>
            <div className="col-span-2">
              <Badge variant={user.isBanned ? "danger" : "success"}>
                {user.isBanned ? "Banned" : "Active"}
              </Badge>
            </div>
            <div className="col-span-2">
              <AdminUserActions
                userId={user.id}
                isBanned={user.isBanned}
                role={user.role}
                currentUserId={session.user.id}
                userName={user.name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

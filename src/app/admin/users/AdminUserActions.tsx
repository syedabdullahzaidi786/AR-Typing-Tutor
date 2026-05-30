"use client";

import { useState } from "react";
import { banUser, changeUserRole } from "@/actions/admin";
import { useRouter } from "next/navigation";
import ResetPasswordModal from "./ResetPasswordModal";

interface Props {
  userId: string;
  isBanned: boolean;
  role: string;
  currentUserId: string;
  userName: string;
}

export default function AdminUserActions({ userId, isBanned, role, currentUserId, userName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  if (userId === currentUserId) {
    return <span className="text-xs text-gray-600">You</span>;
  }

  const handleBan = async () => {
    setLoading(true);
    await banUser(userId, !isBanned);
    router.refresh();
    setLoading(false);
  };

  const handleRole = async () => {
    setLoading(true);
    await changeUserRole(userId, role === "ADMIN" ? "USER" : "ADMIN");
    router.refresh();
    setLoading(false);
  };

  return (
    <>
      <div className="flex gap-1">
        <button
          onClick={() => setShowResetModal(true)}
          disabled={loading}
          className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
        >
          Reset PW
        </button>
        <button
          onClick={handleBan}
          disabled={loading}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            isBanned
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          }`}
        >
          {isBanned ? "Unban" : "Ban"}
        </button>
        <button
          onClick={handleRole}
          disabled={loading}
          className="px-2 py-1 rounded text-xs font-medium bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors"
        >
          {role === "ADMIN" ? "→User" : "→Admin"}
        </button>
      </div>
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        userId={userId}
        userName={userName}
      />
    </>
  );
}

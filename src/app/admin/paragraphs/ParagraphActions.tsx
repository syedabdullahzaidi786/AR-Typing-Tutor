"use client";

import { useState } from "react";
import { toggleParagraph, deleteParagraph } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff } from "lucide-react";

export default function ParagraphActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleParagraph(id, !isActive);
    router.refresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this paragraph?")) return;
    setLoading(true);
    await deleteParagraph(id);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-1 shrink-0">
      <button
        onClick={handleToggle}
        disabled={loading}
        className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
        title={isActive ? "Deactivate" : "Activate"}
      >
        {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

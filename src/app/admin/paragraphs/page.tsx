import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllParagraphs } from "@/actions/admin";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import ParagraphForm from "./ParagraphForm";
import ParagraphActions from "./ParagraphActions";

export default async function AdminParagraphsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const paragraphs = await getAllParagraphs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Typing Paragraphs</h1>
          <p className="text-gray-400 text-sm">{paragraphs.length} paragraphs</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add form */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5">Add New Paragraph</h2>
          <ParagraphForm />
        </div>

        {/* List */}
        <div className="space-y-3">
          {paragraphs.length === 0 ? (
            <div className="text-center py-10 bg-gray-900/60 border border-gray-800 rounded-2xl text-gray-500">
              No paragraphs yet
            </div>
          ) : (
            paragraphs.map((p) => (
              <div
                key={p.id}
                className="bg-gray-900/60 border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="info">{p.language}</Badge>
                    <Badge
                      variant={
                        p.difficulty === "beginner"
                          ? "success"
                          : p.difficulty === "intermediate"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {p.difficulty}
                    </Badge>
                    <Badge variant={p.isActive ? "success" : "default"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <ParagraphActions id={p.id} isActive={p.isActive} />
                </div>
                <p
                  className="text-gray-400 text-sm line-clamp-2"
                  dir={["urdu", "arabic", "sindhi"].includes(p.language) ? "rtl" : "ltr"}
                >
                  {p.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

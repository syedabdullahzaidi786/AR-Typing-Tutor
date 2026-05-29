"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paragraphSchema, ParagraphInput } from "@/lib/validations";
import { addParagraph } from "@/actions/admin";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function ParagraphForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParagraphInput>({
    resolver: zodResolver(paragraphSchema),
    defaultValues: {
      language: "english",
      difficulty: "beginner",
      content: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: ParagraphInput) => {
    setLoading(true);
    const result = await addParagraph(data);
    if (result.success) {
      reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Language</label>
          <select
            {...register("language")}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="english">English</option>
            <option value="urdu">Urdu</option>
            <option value="arabic">Arabic</option>
            <option value="sindhi">Sindhi</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Difficulty</label>
          <select
            {...register("difficulty")}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">Content</label>
        <textarea
          {...register("content")}
          rows={5}
          placeholder="Enter paragraph content..."
          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
        {errors.content && (
          <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          defaultChecked
          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-violet-600 focus:ring-violet-500"
        />
        <label htmlFor="isActive" className="text-sm text-gray-400">
          Active (visible to users)
        </label>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {success ? "✓ Added!" : "Add Paragraph"}
      </Button>
    </form>
  );
}

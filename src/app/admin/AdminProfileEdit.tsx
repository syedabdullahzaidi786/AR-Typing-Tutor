"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAdminProfile } from "@/actions/admin";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Settings, User } from "lucide-react";

interface Props {
  currentName: string;
  currentEmail: string;
}

export default function AdminProfileEdit({ currentName, currentEmail }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const result = await updateAdminProfile({
        name: name !== currentName ? name : undefined,
        email: email !== currentEmail ? email : undefined,
        password: password || undefined,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setPassword("");
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-violet-400" />
        Edit Profile
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Input
            label="New Password (leave blank to keep current)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
      {error && (
        <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          Profile updated successfully!
        </p>
      )}
    </div>
  );
}

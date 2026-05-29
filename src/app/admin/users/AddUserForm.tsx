"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { addUser } from "@/actions/admin";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { UserPlus } from "lucide-react";

export default function AddUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const result = await addUser(data);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        reset();
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
    <div className="mb-6 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-violet-400" />
        Add New User
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Input
            label="Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div className="md:col-span-1">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <div className="md:col-span-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        <div className="md:col-span-1 flex items-end">
          <Button type="submit" loading={loading} className="w-full">
            Add User
          </Button>
        </div>
      </form>
      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          User added successfully!
        </p>
      )}
    </div>
  );
}

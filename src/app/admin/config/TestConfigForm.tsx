"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testConfigSchema, TestConfigInput } from "@/lib/validations";
import { updateTestConfig } from "@/actions/admin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Props {
  config: { minWpm: number; minAccuracy: number; maxMistakes: number };
}

export default function TestConfigForm({ config }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestConfigInput>({
    resolver: zodResolver(testConfigSchema),
    defaultValues: config,
  });

  const onSubmit = async (data: TestConfigInput) => {
    setLoading(true);
    const result = await updateTestConfig(data);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Minimum WPM"
        type="number"
        error={errors.minWpm?.message}
        {...register("minWpm", { valueAsNumber: true })}
      />
      <Input
        label="Minimum Accuracy (%)"
        type="number"
        error={errors.minAccuracy?.message}
        {...register("minAccuracy", { valueAsNumber: true })}
      />
      <Input
        label="Maximum Mistakes"
        type="number"
        error={errors.maxMistakes?.message}
        {...register("maxMistakes", { valueAsNumber: true })}
      />
      <Button type="submit" loading={loading} className="w-full">
        {success ? "✓ Saved!" : "Save Configuration"}
      </Button>
    </form>
  );
}

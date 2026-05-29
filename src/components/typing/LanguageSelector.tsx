"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const languages = [
  { value: "english", label: "English", script: "Aa" },
  { value: "urdu", label: "اردو", script: "ا" },
  { value: "arabic", label: "العربية", script: "ع" },
  { value: "sindhi", label: "سنڌي", script: "س" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => (
        <motion.button
          key={lang.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(lang.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
            value === lang.value
              ? "bg-violet-600/20 border-violet-500 text-violet-300"
              : "bg-gray-900/60 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300"
          )}
        >
          <span className="text-lg">{lang.script}</span>
          <span>{lang.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

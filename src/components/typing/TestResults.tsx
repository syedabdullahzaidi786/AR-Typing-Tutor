"use client";

import { motion } from "framer-motion";
import { Trophy, XCircle, RotateCcw, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import { TypingStats } from "@/types";
import { getLanguageLabel } from "@/lib/utils";

interface TestResultsProps {
  stats: TypingStats;
  passed?: boolean;
  language: string;
  duration: number;
  onRetry: () => void;
  onSave?: () => void;
  saving?: boolean;
}

export default function TestResults({
  stats,
  passed,
  language,
  duration,
  onRetry,
  onSave,
  saving,
}: TestResultsProps) {
  const statItems = [
    { label: "WPM", value: stats.wpm, color: "from-violet-600 to-indigo-600", suffix: "" },
    { label: "CPM", value: stats.cpm, color: "from-blue-600 to-cyan-600", suffix: "" },
    { label: "Accuracy", value: stats.accuracy, color: "from-green-600 to-emerald-600", suffix: "%" },
    { label: "Mistakes", value: stats.mistakes, color: "from-red-600 to-rose-600", suffix: "" },
    { label: "Correct", value: stats.correctChars, color: "from-teal-600 to-green-600", suffix: "" },
    { label: "Incorrect", value: stats.incorrectChars, color: "from-orange-600 to-red-600", suffix: "" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Result header */}
      <div className="text-center">
        {passed !== undefined ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {passed ? (
              <div className="inline-flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-green-400">Test Passed!</h2>
                <p className="text-gray-400 text-sm">
                  Certificate request submitted automatically
                </p>
              </div>
            ) : (
              <div className="inline-flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-red-400">Test Failed</h2>
                <p className="text-gray-400 text-sm">Keep practicing and try again!</p>
              </div>
            )}
          </motion.div>
        ) : (
          <h2 className="text-2xl font-bold text-white">Practice Complete!</h2>
        )}
        <p className="text-gray-500 text-sm mt-2">
          {getLanguageLabel(language)} • {duration > 0 ? `${duration}s` : "Custom"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-center"
          >
            <div
              className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
            >
              {item.value}
              {item.suffix}
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={onRetry}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        {onSave && (
          <Button onClick={onSave} loading={saving}>
            <Download className="w-4 h-4 mr-2" />
            Save Result
          </Button>
        )}
      </div>
    </motion.div>
  );
}

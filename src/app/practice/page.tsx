"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingEngine from "@/components/typing/TypingEngine";
import LanguageSelector from "@/components/typing/LanguageSelector";
import TestResults from "@/components/typing/TestResults";
import { TypingStats } from "@/types";
import { defaultParagraphs } from "@/lib/paragraphs";
import { BookOpen, Shuffle, Type, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type PracticeMode = "random" | "custom" | "timed";

const TIMED_OPTIONS = [
  { label: "1 Min", value: 60 },
  { label: "3 Min", value: 180 },
  { label: "5 Min", value: 300 },
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export default function PracticePage() {
  const [language, setLanguage] = useState("english");
  const [mode, setMode] = useState<PracticeMode>("random");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [customText, setCustomText] = useState("");
  const [timedDuration, setTimedDuration] = useState(60);
  const [currentText, setCurrentText] = useState("");
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [started, setStarted] = useState(false);

  const getRandomText = useCallback(() => {
    const langParagraphs = defaultParagraphs[language as keyof typeof defaultParagraphs] || defaultParagraphs.english;
    const filtered = langParagraphs.filter((p) => p.difficulty === difficulty);
    const pool = filtered.length > 0 ? filtered : langParagraphs;
    return pool[Math.floor(Math.random() * pool.length)].content;
  }, [language, difficulty]);

  const handleStart = () => {
    let text = "";
    if (mode === "custom") {
      text = customText.trim();
      if (!text) return;
    } else {
      text = getRandomText();
    }
    setCurrentText(text);
    setStats(null);
    setStarted(true);
  };

  const handleComplete = (s: TypingStats) => {
    setStats(s);
    setStarted(false);
  };

  const handleRetry = () => {
    setStats(null);
    setStarted(false);
    setCurrentText("");
  };

  const modes = [
    { value: "random", label: "Random", icon: Shuffle, desc: "Random paragraphs" },
    { value: "custom", label: "Custom", icon: Type, desc: "Your own text" },
    { value: "timed", label: "Timed", icon: Clock, desc: "Time-based practice" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Practice Mode</h1>
          <p className="text-gray-400 text-sm">Improve your typing skills</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!started && !stats && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Language */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Language</h2>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            {/* Mode */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Practice Mode</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {modes.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value as PracticeMode)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                        mode === m.value
                          ? "bg-violet-600/20 border-violet-500 text-violet-300"
                          : "bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{m.label}</span>
                      <span className="text-xs opacity-70">{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode-specific options */}
            {mode === "random" && (
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm font-medium text-gray-400 mb-4">Difficulty</h2>
                <div className="flex gap-3">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all",
                        difficulty === d
                          ? "bg-violet-600/20 border-violet-500 text-violet-300"
                          : "bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "custom" && (
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm font-medium text-gray-400 mb-4">Custom Text</h2>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter your custom text here..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
            )}

            {mode === "timed" && (
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm font-medium text-gray-400 mb-4">Duration</h2>
                <div className="flex gap-3">
                  {TIMED_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTimedDuration(opt.value)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        timedDuration === opt.value
                          ? "bg-violet-600/20 border-violet-500 text-violet-300"
                          : "bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={mode === "custom" && !customText.trim()}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Practice
            </button>
          </motion.div>
        )}

        {started && currentText && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <TypingEngine
              text={currentText}
              language={language}
              duration={mode === "timed" ? timedDuration : 0}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {stats && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8"
          >
            <TestResults
              stats={stats}
              language={language}
              duration={mode === "timed" ? timedDuration : 0}
              onRetry={handleRetry}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

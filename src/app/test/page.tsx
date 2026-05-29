"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TypingEngine from "@/components/typing/TypingEngine";
import LanguageSelector from "@/components/typing/LanguageSelector";
import TestResults from "@/components/typing/TestResults";
import { TypingStats } from "@/types";
import { defaultParagraphs } from "@/lib/paragraphs";
import { saveTypingTest } from "@/actions/tests";
import { FlaskConical, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const TEST_DURATIONS = [
  { label: "1 Minute", value: 60 },
  { label: "3 Minutes", value: 180 },
  { label: "5 Minutes", value: 300 },
  { label: "Custom", value: -1 },
];

export default function TestPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState("english");
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState(120);
  const [currentText, setCurrentText] = useState("");
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [started, setStarted] = useState(false);
  const [passed, setPassed] = useState<boolean | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const getTestText = useCallback(() => {
    const langParagraphs = defaultParagraphs[language as keyof typeof defaultParagraphs] || defaultParagraphs.english;
    // Use intermediate/advanced for tests
    const pool = langParagraphs.filter(
      (p) => p.difficulty === "intermediate" || p.difficulty === "advanced"
    );
    const selected = pool.length > 0 ? pool : langParagraphs;
    // Combine multiple paragraphs for longer tests
    const combined = selected.map((p) => p.content).join(" ");
    return combined;
  }, [language]);

  const handleStart = () => {
    const text = getTestText();
    setCurrentText(text);
    setStats(null);
    setPassed(undefined);
    setSaved(false);
    setStarted(true);
  };

  const handleComplete = (s: TypingStats) => {
    setStats(s);
    setStarted(false);
  };

  const handleSave = async () => {
    if (!stats || !session) {
      router.push("/login");
      return;
    }
    setSaving(true);
    try {
      const actualDuration = duration === -1 ? customDuration : duration;
      const result = await saveTypingTest({
        language: language as "english" | "urdu" | "arabic" | "sindhi",
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        mistakes: stats.mistakes,
        correctChars: stats.correctChars,
        incorrectChars: stats.incorrectChars,
        totalChars: stats.totalChars,
        duration: actualDuration,
      });
      if (result.success) {
        setPassed(result.passed);
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setStats(null);
    setStarted(false);
    setCurrentText("");
    setPassed(undefined);
    setSaved(false);
  };

  const actualDuration = duration === -1 ? customDuration : duration;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Typing Test</h1>
          <p className="text-gray-400 text-sm">Get certified with a timed test</p>
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
            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Test Requirements</p>
                <p className="text-blue-400/80">
                  Minimum 35 WPM • 90% Accuracy • Max 10 Mistakes to pass and earn a certificate.
                </p>
              </div>
            </div>

            {/* Language */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Language</h2>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            {/* Duration */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Test Duration
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TEST_DURATIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={cn(
                      "py-3 rounded-xl border text-sm font-medium transition-all",
                      duration === opt.value
                        ? "bg-violet-600/20 border-violet-500 text-violet-300"
                        : "bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {duration === -1 && (
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-sm text-gray-400">Duration (seconds):</label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    min={30}
                    max={600}
                    className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              )}
            </div>

            {!session && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-300">
                <strong>Note:</strong> Login to save your results and earn certificates.
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Start Test ({actualDuration}s)
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
              duration={actualDuration}
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
              passed={saved ? passed : undefined}
              language={language}
              duration={actualDuration}
              onRetry={handleRetry}
              onSave={!saved ? handleSave : undefined}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

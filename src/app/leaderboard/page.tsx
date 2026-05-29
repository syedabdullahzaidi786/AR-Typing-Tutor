"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { getLeaderboard } from "@/actions/tests";
import { getLanguageLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Period = "all" | "daily" | "weekly";

const LANGUAGES = [
  { value: "", label: "All Languages" },
  { value: "english", label: "English" },
  { value: "urdu", label: "اردو" },
  { value: "arabic", label: "العربية" },
  { value: "sindhi", label: "سنڌي" },
];

const PERIODS: { value: Period; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "daily", label: "Today" },
  { value: "weekly", label: "This Week" },
];

interface LeaderboardEntry {
  id: string;
  wpm: number;
  accuracy: number;
  language: string;
  createdAt: Date;
  user: { id: string; name: string };
}

export default function LeaderboardPage() {
  const [language, setLanguage] = useState("");
  const [period, setPeriod] = useState<Period>("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(language || undefined, period)
      .then((data) => setEntries(data as LeaderboardEntry[]))
      .finally(() => setLoading(false));
  }, [language, period]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500 font-mono text-sm w-5 text-center">{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 text-sm">Top typists ranked by WPM</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                period === p.value
                  ? "bg-violet-600/20 border-violet-500 text-violet-300"
                  : "bg-gray-900/60 border-gray-700 text-gray-400 hover:border-gray-600"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => setLanguage(l.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                language === l.value
                  ? "bg-violet-600/20 border-violet-500 text-violet-300"
                  : "bg-gray-900/60 border-gray-700 text-gray-400 hover:border-gray-600"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No results yet for this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full scrollbar-thin">
            <div className="min-w-[600px]">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-2">WPM</div>
                <div className="col-span-2">Accuracy</div>
                <div className="col-span-3">Language</div>
              </div>

              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors",
                    i === 0 && "bg-yellow-500/5",
                    i === 1 && "bg-gray-400/5",
                    i === 2 && "bg-amber-600/5"
                  )}
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(i + 1)}
                  </div>
                  <div className="col-span-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                      {entry.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium text-sm truncate">
                      {entry.user.name}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-violet-400 font-bold">{Math.round(entry.wpm)}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-green-400">{entry.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-400 text-sm">
                      {getLanguageLabel(entry.language)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

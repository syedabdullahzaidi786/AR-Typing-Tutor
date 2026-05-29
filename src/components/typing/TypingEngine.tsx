"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, isRTL, getLanguageFont, calculateWPM, calculateAccuracy } from "@/lib/utils";
import { TypingStats } from "@/types";

interface TypingEngineProps {
  text: string;
  language: string;
  duration: number; // seconds, 0 = unlimited
  onComplete: (stats: TypingStats) => void;
  onProgress?: (stats: TypingStats) => void;
}

export default function TypingEngine({
  text,
  language,
  duration,
  onComplete,
  onProgress,
}: TypingEngineProps) {
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const rtl = isRTL(language);
  const font = getLanguageFont(language);

  const getStats = useCallback((): TypingStats => {
    const elapsed = elapsedTime || 1;
    const wpm = calculateWPM(correctChars, elapsed);
    const totalTyped = correctChars + incorrectChars;
    const accuracy = calculateAccuracy(correctChars, totalTyped);
    return {
      wpm,
      cpm: Math.round((correctChars / elapsed) * 60),
      accuracy,
      mistakes: incorrectChars,
      correctChars,
      incorrectChars,
      remainingTime: timeLeft,
      totalChars: text.length,
    };
  }, [correctChars, incorrectChars, elapsedTime, timeLeft, text.length]);

  // Timer
  useEffect(() => {
    if (!started || finished) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedTime(elapsed);

      if (duration > 0) {
        const remaining = duration - elapsed;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setFinished(true);
          clearInterval(timerRef.current!);
        }
      }
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, duration]);

  // Complete when all text typed
  useEffect(() => {
    if (currentIndex >= text.length && started && !finished) {
      setFinished(true);
    }
  }, [currentIndex, text.length, started, finished]);

  // Call onComplete when finished
  useEffect(() => {
    if (finished) {
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(getStats());
    }
  }, [finished]); // eslint-disable-line

  // Progress callback
  useEffect(() => {
    if (started && !finished && onProgress) {
      onProgress(getStats());
    }
  }, [correctChars, incorrectChars, timeLeft]); // eslint-disable-line

  // Handle keys like Tab/Backspace/Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (finished) return;

    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
  };

  // Main input processor
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;

    const newValue = e.target.value;
    const oldLength = typed.length;
    const newLength = newValue.length;

    // Start timer on first character
    if (!started && newLength > 0) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    if (newLength < oldLength) {
      // Characters deleted
      const diff = oldLength - newLength;
      let tempIndex = currentIndex;
      let tempCorrect = correctChars;
      let tempIncorrect = incorrectChars;
      const nextErrors = new Set(errors);

      for (let i = 0; i < diff; i++) {
        if (tempIndex > 0) {
          tempIndex = tempIndex - 1;
          if (nextErrors.has(tempIndex)) {
            nextErrors.delete(tempIndex);
            tempIncorrect = Math.max(0, tempIncorrect - 1);
          } else {
            tempCorrect = Math.max(0, tempCorrect - 1);
          }
        }
      }

      setErrors(nextErrors);
      setCurrentIndex(tempIndex);
      setCorrectChars(tempCorrect);
      setIncorrectChars(tempIncorrect);
      setTyped(newValue);
    } else if (newLength > oldLength) {
      // Characters added
      const addedText = newValue.slice(oldLength);
      let tempIndex = currentIndex;
      let tempCorrect = correctChars;
      let tempIncorrect = incorrectChars;
      const nextErrors = new Set(errors);

      for (let i = 0; i < addedText.length; i++) {
        if (tempIndex < text.length) {
          const char = addedText[i];
          const expected = text[tempIndex];
          const isCorrect = char === expected;

          if (isCorrect) {
            tempCorrect = tempCorrect + 1;
          } else {
            nextErrors.add(tempIndex);
            tempIncorrect = tempIncorrect + 1;
          }
          tempIndex = tempIndex + 1;
        }
      }

      setErrors(nextErrors);
      setCurrentIndex(tempIndex);
      setCorrectChars(tempCorrect);
      setIncorrectChars(tempIncorrect);
      setTyped(newValue.slice(0, text.length));
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const renderText = () => {
    return text.split("").map((char, i) => {
      let className = "text-gray-500";
      if (i < currentIndex) {
        className = errors.has(i) ? "text-red-400 bg-red-500/20" : "text-green-400";
      } else if (i === currentIndex) {
        className = "text-white bg-violet-600/40 animate-pulse";
      }
      return (
        <span key={i} className={`${className} transition-colors duration-100`}>
          {char === " " && i === currentIndex ? "\u00A0" : char}
        </span>
      );
    });
  };

  const progress = (currentIndex / text.length) * 100;

  return (
    <div className="space-y-4 relative">
      {/* Hidden input field for mobile/desktop keyboard integration */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={(e) => e.preventDefault()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Progress bar */}
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Text display */}
      <div
        ref={containerRef}
        className={cn(
          "relative p-6 rounded-2xl bg-gray-900/60 border cursor-text min-h-[160px] select-none transition-all duration-200",
          isFocused ? "border-violet-500/50 ring-2 ring-violet-500/10" : "border-gray-800"
        )}
        style={{
          fontFamily: font,
          direction: rtl ? "rtl" : "ltr",
          textAlign: rtl ? "right" : "left",
          fontSize: language === "urdu" ? "1.4rem" : "1.1rem",
          lineHeight: language === "urdu" ? "2.5" : "2",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Click to start prompt */}
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 rounded-2xl z-10">
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-gray-400 text-sm font-medium"
            >
              Click here and start typing...
            </motion.p>
          </div>
        )}

        {/* Paused Overlay */}
        {started && !isFocused && !finished && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 rounded-2xl z-10 backdrop-blur-sm transition-all border border-gray-800">
            <motion.p
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-violet-400 text-lg font-semibold mb-1"
            >
              Click or Tap to Resume
            </motion.p>
            <p className="text-gray-500 text-xs">Typing is paused</p>
          </div>
        )}

        <div className="leading-loose tracking-wide">{renderText()}</div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "WPM",
            value: started ? calculateWPM(correctChars, elapsedTime || 1) : 0,
            color: "text-violet-400",
          },
          {
            label: "Accuracy",
            value: started
              ? `${calculateAccuracy(correctChars, correctChars + incorrectChars)}%`
              : "100%",
            color: "text-green-400",
          },
          {
            label: "Mistakes",
            value: incorrectChars,
            color: "text-red-400",
          },
          {
            label: duration > 0 ? "Time Left" : "Time",
            value: duration > 0 ? `${timeLeft}s` : `${elapsedTime}s`,
            color: "text-yellow-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center"
          >
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

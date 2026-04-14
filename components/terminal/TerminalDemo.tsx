"use client";

import React, { useState, useEffect, useCallback } from "react";

interface TerminalDemoProps {
  query?: string;
  result?: string;
  typingSpeed?: number;
  loop?: boolean;
}

export function TerminalDemo({
  query = "?? find all python files modified today",
  result = "find . -name '*.py' -mtime -1",
  typingSpeed = 40,
  loop = true,
}: TerminalDemoProps) {
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const startAnimation = useCallback(() => {
    setDisplayedQuery("");
    setShowResult(false);
    setShowCursor(true);

    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < query.length) {
        setDisplayedQuery(query.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // After typing completes, wait then show result
        setTimeout(() => {
          setShowResult(true);
          setShowCursor(false);

          // If loop, restart after pause
          if (loop) {
            setTimeout(() => {
              startAnimation();
            }, 3000);
          }
        }, 800);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [query, typingSpeed, loop]);

  useEffect(() => {
    const cleanup = startAnimation();
    return cleanup;
  }, [startAnimation]);

  return (
    <div className="w-full max-w-2xl rounded overflow-hidden shadow-2xl shadow-black/50 border border-border">
      {/* Window chrome */}
      <div className="bg-terminal-header h-9 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="flex-1 text-center text-xs text-muted/60 font-[family-name:var(--font-jetbrains)]">
          bash — termassist
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-terminal-bg p-5 min-h-[140px] font-[family-name:var(--font-jetbrains)] text-[13px] leading-[1.7]">
        {/* Prompt + typed query */}
        <div className="flex flex-wrap">
          <span className="text-green-muted select-none">user@dev ~ % </span>
          <span className="text-text">{displayedQuery}</span>
          {showCursor && (
            <span
              className="inline-block w-2 h-[18px] bg-text ml-0.5 translate-y-[2px]"
              style={{
                animation: "cursorBlink 1s ease-in-out infinite",
              }}
            />
          )}
        </div>

        {/* Result */}
        {showResult && (
          <div className="mt-2 animate-fade-in">
            <span className="text-pink">{result}</span>
          </div>
        )}
      </div>
    </div>
  );
}

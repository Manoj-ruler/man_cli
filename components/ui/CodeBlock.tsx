"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "bash",
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`relative group bg-terminal-bg border border-border rounded overflow-hidden ${className}`}
    >
      {language && (
        <div className="absolute top-2 left-3 text-[10px] text-muted/60 uppercase tracking-wider font-[family-name:var(--font-jetbrains)]">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-surface/80 border border-border text-muted hover:text-pink hover:border-pink/30 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
      <pre className="p-4 pt-8 overflow-x-auto">
        <code className="text-sm text-pink font-[family-name:var(--font-jetbrains)] leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}

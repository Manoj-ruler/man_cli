"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TERMASSIST_INSTALL_COMMAND } from "@/lib/termassist-npm";
import { Terminal, Menu, X, Check } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(TERMASSIST_INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Terminal className="w-5 h-5 text-pink" />
            <span className="text-lg font-bold text-text font-[family-name:var(--font-syne)] tracking-tight">
              term<span className="text-pink">assist</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm text-muted hover:text-text transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href="https://github.com/manoj/termassist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-text transition-colors duration-200"
            >
              GitHub
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-text transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-text transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Button size="sm" onClick={copyInstallCommand}>
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                "Install Now"
              )}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-muted hover:text-text transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link
              href="#how-it-works"
              className="text-sm text-muted hover:text-text transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="https://github.com/manoj/termassist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-text transition-colors py-2"
            >
              GitHub
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-text transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-text transition-colors py-2"
            >
              Dashboard
            </Link>
            <Button size="sm" className="mt-1 w-full" onClick={copyInstallCommand}>
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                "Install Now"
              )}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

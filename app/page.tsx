"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { HeroVideoBackground } from "@/components/terminal/HeroVideoBackground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { TERMASSIST_INSTALL_COMMAND } from "@/lib/termassist-npm";
import {
  Zap,
  Shield,
  HardDrive,
  Clock,
  Globe,
  Cpu,
  ArrowRight,
  Terminal,
  Sparkles,
  Search,
  Check,
  Copy,
  GitBranch,
} from "lucide-react";

export default function LandingPage() {
  const [copied, setCopied] = useState(false);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(TERMASSIST_INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="min-h-screen bg-bg text-text noise-overlay">
      <Navbar />

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6 relative z-10">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-pink/10 border border-pink/20 rounded text-xs text-pink font-[family-name:var(--font-dm-sans)]">
                  <Sparkles className="w-3 h-3" />
                  100% Offline · 100% Private
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight font-[family-name:var(--font-syne)] animate-fade-up delay-1">
                The Terminal That
                <br />
                <span className="pink-gradient-text">Understands English.</span>
              </h1>

              <p className="text-lg text-muted max-w-lg leading-relaxed animate-fade-up delay-2">
                A local, privacy-first terminal assistant that maps natural
                language to exact shell commands — no cloud AI, no GPU, no wait.
                Matching runs on your machine with BM25 (no vectors needed).
              </p>

              <div className="flex flex-wrap gap-3 animate-fade-up delay-3">
                <Button size="lg" onClick={copyInstallCommand}>{copied ? (<><Check className="w-4 h-4" />Copied!</>) : (<><Terminal className="w-4 h-4" />Install Now</>)}</Button>
                <Link href="/dashboard">
                  <Button variant="ghost" size="lg">
                    Open Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-4 mt-2 animate-fade-up delay-4">
                {[
                  { icon: Zap, label: "< 50ms response" },
                  { icon: Shield, label: "No cloud AI keys" },
                  { icon: HardDrive, label: "~10MB install" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded text-xs text-muted"
                  >
                    <stat.icon className="w-3.5 h-3.5 text-pink" />
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Video Background (Desktop Only) */}
            <div className="relative hidden lg:block animate-fade-up delay-3">
              <HeroVideoBackground videoSrc="/TermAssist_Intent_to_Command_Demo.mp4" />
            </div>
          </div>
        </div>

        {/* Background gradient orb */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-pink/5 rounded-full blur-[150px] pointer-events-none" />
      </section>

      {/* ============================================
          PROBLEM SECTION
          ============================================ */}
      <section className="py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
              The Terminal is Brilliant <span className="text-pink">but Brutal</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Every developer faces these frustrations daily. We built TermAssist
              to eliminate them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Globe,
                title: "Context Switching",
                desc: "Leaving your terminal to search StackOverflow breaks your flow and kills productivity.",
              },
              {
                icon: Clock,
                title: "Cloud Latency",
                desc: "Cloud assistants send every question over the internet, which adds seconds of delay each time.",
              },
              {
                icon: Shield,
                title: "Privacy Risk",
                desc: "Cloud-based copilots may see what you type — including paths, servers, and secrets.",
              },
              {
                icon: Cpu,
                title: "Hardware Cost",
                desc: "Most AI assistants require a GPU or expensive API keys to function. We need neither.",
              },
            ].map((item, i) => (
              <Card
                key={item.title}
                glow
                className={`animate-fade-up delay-${i + 1}`}
              >
                <item.icon className="w-8 h-8 text-pink mb-4" />
                <h3 className="text-base font-semibold text-text font-[family-name:var(--font-syne)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section id="how-it-works" className="py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
              How It <span className="text-pink">Works</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Three steps. All local. No internet required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-[2px] bg-gradient-to-r from-pink/40 via-pink to-pink/40" />

            {[
              {
                step: "01",
                icon: Terminal,
                title: "Type",
                desc: 'Ask in plain English: "find all python files modified today"',
              },
              {
                step: "02",
                icon: Search,
                title: "Match locally",
                desc: "TermAssist scores your words against 250+ built-in commands with BM25 — usually under 50 ms, all offline.",
              },
              {
                step: "03",
                icon: GitBranch,
                title: "Output",
                desc: 'Instantly prints the matching command: find . -name "*.py" -mtime -1',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`flex flex-col items-center text-center animate-fade-up delay-${
                  i + 1
                }`}
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded bg-surface border border-border flex items-center justify-center mb-6">
                    <item.icon className="w-10 h-10 text-pink" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded bg-pink text-white text-xs font-bold flex items-center justify-center font-[family-name:var(--font-jetbrains)]">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-syne)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          WHY IT WINS
          ============================================ */}
      <section className="py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
              Why TermAssist <span className="text-pink">Wins</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stat: "< 50ms",
                title: "Zero Latency",
                desc: "Everything runs locally. No network calls, no waiting, no downtime. Results appear before you finish thinking.",
              },
              {
                stat: "Local",
                title: "Private by default",
                desc: "Finding the right command happens on your computer. Optional dashboard sync is off until you add a token and turn it on.",
              },
              {
                stat: "~10MB",
                title: "Universal Compatibility",
                desc: "Works anywhere you have Node.js (LTS is best). No GPU. No paid AI API for the built-in matcher.",
              },
            ].map((item, i) => (
              <Card
                key={item.title}
                glow
                className={`text-center py-10 animate-fade-up delay-${i + 1}`}
              >
                <div className="text-4xl font-extrabold text-pink font-[family-name:var(--font-syne)] mb-3">
                  {item.stat}
                </div>
                <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-syne)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-sm mx-auto">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          INSTALL CTA
          ============================================ */}
      <section className="py-24 sm:py-32 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
              Add it to your terminal in{" "}
              <span className="text-pink">30 seconds</span>.
            </h2>
            <p className="text-muted mb-8">
              One command. That&apos;s all it takes.
            </p>
          </div>

          <div className="animate-fade-up delay-2 pink-glow-border rounded">
            <CodeBlock code={TERMASSIST_INSTALL_COMMAND} language="bash" />
          </div>
          <p className="text-sm text-muted mt-6 text-center max-w-lg mx-auto leading-relaxed">
            New here? Follow the{" "}
            <Link href="/blog/quick-install-guide" className="text-pink hover:underline underline-offset-2">
              step-by-step install guide
            </Link>{" "}
            (Node.js, one command, then your first question).
          </p>

          <div className="mt-8 flex justify-center gap-4 animate-fade-up delay-3">
            <Button size="lg" onClick={copyInstallCommand}>{copied ? (<><Check className="w-4 h-4" />Copied to Clipboard!</>) : (<><Terminal className="w-4 h-4" />Get Started</>)}</Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Background gradient orb */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* ============================================
          KNOWLEDGE BASE / BLOG
          ============================================ */}
      <section id="blog" className="py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-fade-up">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
                Latest from our <span className="text-pink">Knowledge Base</span>
              </h2>
              <p className="text-muted max-w-xl">
                Deep dives into terminal productivity, security best practices, and 
                the technology behind TermAssist.
              </p>
            </div>
            <Link href="/blog">
              <Button variant="ghost" className="hidden md:flex">
                View All Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                title: "Install TermAssist Step by Step",
                desc: "Where config.json really lives (home .termassist folder), how the dashboard token works, and termassist sync — spelled out for Windows, Mac, and Linux.",
                slug: "quick-install-guide",
                tag: "Setup",
              },
              {
                title: "The Complete Beginner's Guide to TermAssist",
                desc: "Learn everything from scratch: installation, configuration, account setup, and using every feature step-by-step.",
                slug: "mastering-cli",
                tag: "Guide",
              },
              {
                title: "How Does TermAssist Work?",
                desc: "Understand the BM25 algorithm, why it's so fast, how command matching works, and privacy features explained simply.",
                slug: "packages-deep-dive",
                tag: "Technology",
              },
              {
                title: "The Complete Dashboard Guide",
                desc: "Overview, Commands, Snippets, Settings — plus why your API token must live in ~/.termassist/config.json for history and sync.",
                slug: "dashboard-guide",
                tag: "Tutorial",
              },
            ].map((post, i) => (
              <Card
                key={post.slug}
                glow
                className={`animate-fade-up delay-${i + 1} flex flex-col h-full group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-pink uppercase py-1 px-2 bg-pink/10 rounded">
                    {post.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-syne)] mb-3 group-hover:text-pink transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 flex-grow">
                  {post.desc}
                </p>
                <Link href={`/blog/${post.slug}`} className="mt-auto">
                  <Button variant="ghost" size="sm" className="w-full">
                    Read More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <Link href="/blog" className="mt-12 md:hidden block">
            <Button variant="ghost" className="w-full">
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="border-t border-border py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-pink" />
              <span className="text-sm font-semibold text-text font-[family-name:var(--font-syne)]">
                term<span className="text-pink">assist</span>
              </span>
              <span className="text-xs text-muted ml-2">
                The terminal that understands you.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted">
              <Link
                href="/blog"
                className="hover:text-text transition-colors duration-200"
              >
                Docs
              </Link>
              <Link
                href="https://github.com/manoj"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text transition-colors duration-200"
              >
                GitHub
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-text transition-colors duration-200"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

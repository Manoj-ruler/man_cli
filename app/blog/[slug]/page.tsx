"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Terminal, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Calendar, 
  Clock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PostContent {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
}

const POSTS: Record<string, PostContent> = {
  "mastering-cli": {
    title: "Mastering the TermAssist CLI: English to Bash in Seconds",
    category: "Guide",
    date: "Apr 17, 2026",
    readTime: "6 min",
    content: (
      <>
        <p>
          The terminal is one of the most powerful tools in a developer&apos;s
          arsenal, yet it remains one of the most intimidating. How many times
          have you searched for &quot;how to kill process on port 3000&quot; only
          to find a complex <code>lsof</code> command that you forget five
          minutes later?
        </p>

        <h2>Installation</h2>
        <p>Get started by installing the companion CLI globally via NPM:</p>
        <pre>
          <code>npm install -g termassist</code>
        </pre>

        <p>Once installed, you can initialize your local environment with:</p>
        <pre>
          <code>termassist init</code>
        </pre>

        <h2>How to Query</h2>
        <p>
          With TermAssist, you don&apos;t need to remember flags. Just speak your
          mind. Use the <code>-q</code> or <code>--query</code> flag followed by
          your request in plain English.
        </p>
        <pre>
          <code>termassist -q &quot;find all large files in current dir&quot;</code>
        </pre>
        <p>
          TermAssist will instantly output the correct bash command:{" "}
          <code>find . -type f -size +100M</code>.
        </p>

        <blockquote>
          &quot;TermAssist doesn&apos;t just give you commands; it gives you
          context. It matching is based on local vector embeddings, meaning it
          understands intent, not just keywords.&quot;
        </blockquote>

        <h2>Interactive Mode</h2>
        <p>
          Need to refine your query? Enter interactive mode to search and
          preview commands live:
        </p>
        <pre>
          <code>termassist interactive</code>
        </pre>
      </>
    ),
  },
  "packages-deep-dive": {
    title: "NPM Packages Deep Dive: The Tech Behind the Scenes",
    category: "Technology",
    date: "Apr 16, 2026",
    readTime: "8 min",
    content: (
      <>
        <p>
          TermAssist is built on a philosophy of local-first AI. We believe your
          terminal queries shouldn&apos;t require a round-trip to the cloud.
          Here&apos;s how we achieve sub-50ms response times on consumer
          hardware.
        </p>

        <h2>The Embedding Engine</h2>
        <p>
          At the core of our package ecosystem is a highly optimized version of{" "}
          <strong>MiniLM-L6-v2</strong>. We&apos;ve quantized our models to ensure
          they stay under 10MB while maintaining 98%+ accuracy on bash syntax
          mappings.
        </p>

        <h2>FAISS Local Index</h2>
        <p>
          Instead of a remote vector database, we use a local FAISS index
          bundled within the <code>termassist-core</code> package. When you run
          a query, we generate a vector embedding in-memory and perform a
          nearest-neighbor search locally.
        </p>

        <pre>
          <code>
            {`// Internal matching logic
import { matchQuery } from '@termassist/core';

const result = await matchQuery("git undo last commit");
console.log(result.command); // "git reset --soft HEAD~1"`}
          </code>
        </pre>

        <h2>Privacy Guarantee</h2>
        <p>
          Because these packages include the full index and embedding logic,{" "}
          <strong>zero bytes</strong> are transmitted to external servers. Your
          command history and intent stay entirely on your machine.
        </p>
      </>
    ),
  },
  "dashboard-guide": {
    title: "TermAssist Dashboard: Visualizing Your Terminal Analytics",
    category: "Tutorial",
    date: "Apr 15, 2026",
    readTime: "5 min",
    content: (
      <>
        <p>
          While the CLI is where the work happens, the TermAssist Dashboard is
          where you manage your productivity. It provides a visual overview of
          your command usage, success rates, and favorite snippets.
        </p>

        <h2>Connecting your CLI</h2>
        <p>
          To sync your CLI data with the dashboard, you need to generate an API
          token from the <strong>Settings</strong> page.
        </p>
        <ol>
          <li>Navigate to the Dashboard &gt; Settings.</li>
          <li>Click &quot;Generate New Token&quot;.</li>
          <li>
            Run <code>termassist login</code> in your terminal and paste the
            token.
          </li>
        </ol>

        <h2>Command Analytics</h2>
        <p>
          The <strong>Commands</strong> view shows you which categories of
          commands you use most frequently (Git, File System, Networking, etc.).
          This helps you identify areas where you might want to create custom
          aliases or snippets.
        </p>

        <h2>Managing Snippets</h2>
        <p>
          The <strong>Snippets</strong> feature allows you to save frequently
          used commands with natural language descriptions. These snippets are
          instantly available in your CLI via <code>termassist snippets</code>.
        </p>

        <img src="/dashboard-preview.png" alt="TermAssist Dashboard Preview" />

        <p>
          The dashboard is fully responsive and supports both light and dark
          modes, following the same Brutalist design aesthetic as our landing
          page.
        </p>
      </>
    ),
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = POSTS[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg text-text noise-overlay">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-pink transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Knowledge Base
        </Link>

        {/* Global Badge */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-pink/10 border border-pink/20 rounded text-xs text-pink font-[family-name:var(--font-dm-sans)] mb-6">
            <Sparkles className="w-3 h-3" />
            Official {post.category}
          </span>
        </div>

        {/* Header */}
        <header className="mb-16 animate-fade-up delay-1">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-syne)] mb-8 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center">
                <Terminal className="w-5 h-5 text-pink" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold font-[family-name:var(--font-syne)]">
                  TermAssist Team
                </span>
                <span className="text-xs text-muted">Core Contributors</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted font-[family-name:var(--font-dm-sans)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink" />
                {post.readTime} reading
              </div>
              <div className="flex items-center gap-4 ml-4">
                <button className="hover:text-pink transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="hover:text-pink transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="lp-article animate-fade-up delay-2">
          {post.content}
        </article>

        {/* Bottom CTA */}
        <Card glow className="mt-24 p-10 text-center animate-fade-up delay-3">
          <h3 className="text-2xl font-bold font-[family-name:var(--font-syne)] mb-4">
            Master your terminal today.
          </h3>
          <p className="text-muted mb-8 max-w-md mx-auto leading-relaxed">
            Stop searching and start building. Secure your local workflow with 100% private command assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">Get TermAssist</Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <footer className="border-t border-border py-10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-pink" />
              <span className="text-sm font-semibold text-text font-[family-name:var(--font-syne)]">
                term<span className="text-pink">assist</span>
              </span>
            </div>
            <p className="text-xs text-muted">
              © 2026 TermAssist. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

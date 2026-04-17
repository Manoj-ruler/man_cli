"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Terminal, Calendar, Clock, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    title: "Mastering the TermAssist CLI: English to Bash in Seconds",
    description: "Learn how to use TermAssist to supercharge your terminal workflow. From installation to complex natural language queries, this guide covers everything you need to know about the local assistant.",
    date: "Apr 17, 2026",
    readTime: "6 min",
    slug: "mastering-cli",
    category: "Guide",
  },
  {
    title: "NPM Packages Deep Dive: The Tech Behind the Scenes",
    description: "A technical look into our local vector search implementation, FAISS index management, and the optimized NPM packages that make TermAssist lightning fast on any hardware.",
    date: "Apr 16, 2026",
    readTime: "8 min",
    slug: "packages-deep-dive",
    category: "Technology",
  },
  {
    title: "TermAssist Dashboard: Visualizing Your Terminal Analytics",
    description: "Explore the power of the dashboard. Track your command patterns, sync your favorite snippets, and manage your local environment from a sleek, Brutalist-inspired web interface.",
    date: "Apr 15, 2026",
    readTime: "5 min",
    slug: "dashboard-guide",
    category: "Tutorial",
  },
];

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-bg text-text noise-overlay">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-pink/10 border border-pink/20 rounded text-xs text-pink font-[family-name:var(--font-dm-sans)] mb-4">
            Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-syne)] mb-6 tracking-tight">
            Everything <span className="pink-gradient-text">TermAssist.</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Guides, technical deep dives, and expert tutorials to help you master
            your terminal and secure your local development workflow.
          </p>
        </div>

        {/* Featured Card (Latest Post) */}
        <div className="mb-12 animate-fade-up delay-1">
          <Card glow className="!p-0 overflow-hidden group">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-widest text-pink uppercase mb-4 inline-block">
                  LATEST POST · {BLOG_POSTS[0].category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-syne)] mb-4 leading-tight group-hover:text-pink transition-colors">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-muted mb-8 leading-relaxed line-clamp-3">
                  {BLOG_POSTS[0].description}
                </p>
                <div className="flex flex-wrap items-center gap-6 mb-8 text-xs text-muted font-[family-name:var(--font-dm-sans)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink" />
                    {BLOG_POSTS[0].date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink" />
                    {BLOG_POSTS[0].readTime}
                  </div>
                </div>
                <Link href={`/blog/${BLOG_POSTS[0].slug}`}>
                  <Button size="lg" className="w-fit">
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="bg-surface border-l border-border hidden lg:flex items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-pink/5 opacity-50" />
                <div className="relative z-10 w-full max-w-sm aspect-video bg-bg border border-border rounded-lg shadow-2xl flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                  <Terminal className="w-20 h-20 text-pink/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="font-[family-name:var(--font-jetbrains)] text-sm text-pink/80">
                        $ termassist --query "..."
                     </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Grid for other posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(1).map((post, i) => (
            <Card
              key={post.slug}
              glow
              className={`animate-fade-up delay-${i + 2} flex flex-col h-full group`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold tracking-widest text-pink uppercase py-1 px-2 bg-pink/10 rounded">
                  {post.category}
                </span>
                <span className="text-[10px] text-muted font-[family-name:var(--font-dm-sans)]">
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-syne)] mb-3 group-hover:text-pink transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-6 flex-grow line-clamp-3">
                {post.description}
              </p>
              <Link href={`/blog/${post.slug}`} className="mt-auto">
                <Button variant="ghost" size="sm" className="w-full">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-10">
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

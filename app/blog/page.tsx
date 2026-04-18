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
    <div className="min-h-screen bg-bg text-text noise-overlay selection:bg-pink selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-pink/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink/5 blur-[120px] rounded-full -z-10" />

        {/* Header */}
        <div className="mb-20 animate-fade-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-pink" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink font-[family-name:var(--font-jetbrains)]">
              Official Knowledge Base
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold font-[family-name:var(--font-syne)] mb-8 tracking-tighter leading-[0.9]">
            Deep <span className="pink-gradient-text">Insights.</span><br />
            Expert <span className="text-muted">Guides.</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed font-[family-name:var(--font-dm-sans)]">
            Everything you need to master your terminal, secure your productivity, 
            and deep dive into the engineering behind TermAssist.
          </p>
        </div>

        {/* Featured Card */}
        <div className="mb-24 animate-fade-up delay-1">
          <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="group block h-full">
            <Card glow className="!p-0 overflow-hidden bg-surface/40 backdrop-blur-md border-pink/10 group-hover:border-pink/30 transition-all duration-500">
              <div className="grid lg:grid-cols-5 h-full">
                <div className="lg:col-span-3 p-8 sm:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/50">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="px-2 py-1 bg-pink text-white text-[10px] font-bold rounded uppercase tracking-wider">
                      Featured
                    </span>
                    <span className="text-[10px] text-muted uppercase tracking-widest font-bold">
                      {BLOG_POSTS[0].category} · {BLOG_POSTS[0].readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-syne)] mb-6 leading-[1.1] tracking-tight group-hover:pink-gradient-text transition-all duration-300">
                    {BLOG_POSTS[0].title}
                  </h2>
                  
                  <p className="text-lg text-muted mb-10 leading-relaxed line-clamp-3">
                    {BLOG_POSTS[0].description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm font-bold text-pink">
                    <span>Explore Article</span>
                    <div className="w-8 h-[1px] bg-pink group-hover:w-16 transition-all duration-500" />
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </div>

                <div className="lg:col-span-2 bg-terminal-bg/50 p-12 flex flex-col items-center justify-center relative group-hover:bg-terminal-bg/80 transition-colors duration-500">
                  {/* Decorative terminal elements */}
                  <div className="absolute top-4 left-4 flex gap-1.5 opacity-30">
                    <div className="w-2.5 h-2.5 rounded-full bg-red" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green" />
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="h-2 w-3/4 bg-pink/10 rounded group-hover:bg-pink/20 transition-colors" />
                    <div className="h-2 w-1/2 bg-muted/10 rounded" />
                    <div className="h-2 w-2/3 bg-pink/5 rounded" />
                  </div>
                  
                  <Terminal className="w-32 h-32 text-muted/5 absolute group-hover:text-pink/5 transition-colors duration-500" />
                  
                  <div className="mt-12 p-4 bg-bg border border-border rounded-lg font-[family-name:var(--font-jetbrains)] text-[10px] text-pink/60 shadow-2xl group-hover:scale-110 group-hover:border-pink/40 transition-all duration-700">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-pink animate-pulse" />
                       <span className="opacity-50 text-[8px]">LOCAL_MATCH_LOG</span>
                    </div>
                    <span className="text-white">$</span> termassist --analyze "{BLOG_POSTS[0].slug.replace(/-/g, ' ')}"
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-12 animate-fade-up delay-2">
          <h3 className="text-2xl font-bold font-[family-name:var(--font-syne)] flex items-center gap-3">
            <span className="text-pink">#</span> Recent <span className="text-muted">Articles</span>
          </h3>
          <div className="h-[1px] flex-1 mx-8 bg-border hidden sm:block" />
        </div>

        {/* Grid for other posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(1).map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full block">
              <Card
                glow
                className={`animate-fade-up delay-${i + 3} flex flex-col h-full bg-surface/20 border-transparent hover:border-pink/20 transition-all duration-300 relative group`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-pink uppercase py-1.5 px-3 bg-pink/10 rounded-full border border-pink/10">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold font-[family-name:var(--font-jetbrains)]">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold font-[family-name:var(--font-syne)] mb-4 leading-tight group-hover:text-pink transition-colors duration-300">
                  {post.title}
                </h4>
                
                <p className="text-sm text-muted leading-relaxed mb-8 flex-grow line-clamp-3 group-hover:text-text/70 transition-colors">
                  {post.description}
                </p>
                
                <div className="flex items-center gap-3 pt-6 border-t border-border/50 group-hover:border-pink/10 transition-colors mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-pink transition-colors">Read Post</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-pink group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* Styled Footer for Blog context */}
      <footer className="border-t border-border mt-32 py-20 relative overflow-hidden bg-surface/20">
        <div className="absolute inset-0 bg-pink/5 opacity-30 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-pink" />
                <span className="text-xl font-bold font-[family-name:var(--font-syne)] tracking-tight">
                  term<span className="text-pink">assist</span>
                </span>
             </div>
             <p className="text-sm text-muted max-w-sm">
                The terminal assistant that stays local, keeps your data private, 
                and makes bash second nature. Developed by developers, for developers.
             </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-12 text-sm font-bold font-[family-name:var(--font-syne)]">
             <Link href="/" className="hover:text-pink transition-colors uppercase tracking-widest text-[10px]">Home</Link>
             <Link href="/dashboard" className="hover:text-pink transition-colors uppercase tracking-widest text-[10px]">Dashboard</Link>
             <Link href="/auth/signup" className="hover:text-pink transition-colors uppercase tracking-widest text-[10px]">Sign Up</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border/30">
           <p className="text-[10px] text-muted text-center md:text-left font-bold uppercase tracking-widest">
              © 2026 TermAssist. Engineered for the terminal.
           </p>
        </div>
      </footer>
    </div>
  );
}

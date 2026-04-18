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
  Sparkles,
  ArrowRight
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

        <div className="blog-callout blog-callout-info font-[family-name:var(--font-dm-sans)]">
           <Terminal className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>Pro Tip:</strong> You can set up an alias like <code>??</code> in your <code>.zshrc</code> or <code>.bashrc</code> to call termassist with even fewer keystrokes.
           </div>
        </div>

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

        <p>
           In interactive mode, you get a beautiful UI right in your shell, 
           complete with syntax highlighting and instant fuzzy search results.
        </p>
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

        <div className="blog-callout blog-callout-info">
           <Sparkles className="w-5 h-5 mt-1 shrink-0 text-pink" />
           <div>
              <strong>Under the hood:</strong> All embedding generation is handled by <code>ONNX Runtime</code>, allowing us to leverage hardware acceleration without heavy Python dependencies.
           </div>
        </div>

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
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((totalScroll <= 0) ? 0 : (currentScroll / totalScroll) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    notFound();
  }

  // Related posts logic
  const relatedPosts = Object.entries(POSTS)
    .filter(([s]) => s !== slug)
    .map(([s, p]) => ({ slug: s, ...p }))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-bg text-text noise-overlay selection:bg-pink selection:text-white">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-pink z-[100] transition-all duration-150 ease-out shadow-[0_0_10px_var(--color-pink)]" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-40 relative z-10">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink/5 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink/5 blur-[120px] rounded-full" />
        </div>

        {/* Back Link */}
        <div className="animate-fade-up">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-pink transition-all mb-16 group p-2 -ml-2 rounded-lg hover:bg-pink/5"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Knowledge Base
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-20 animate-fade-up delay-1">
          <div className="flex items-center gap-2 mb-8">
            <span className="px-3 py-1 bg-pink text-white text-[10px] font-bold rounded uppercase tracking-wider shadow-lg shadow-pink/20">
              {post.category}
            </span>
            <div className="h-[1px] w-8 bg-border" />
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
              TermAssist Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-[family-name:var(--font-syne)] mb-12 leading-[1.05] tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shadow-lg relative group overflow-hidden">
                <div className="absolute inset-0 bg-pink opacity-0 group-hover:opacity-10 transition-opacity" />
                <Terminal className="w-6 h-6 text-pink" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold font-[family-name:var(--font-syne)] uppercase tracking-tight">
                  TermAssist Team
                </span>
                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
                  Engineering Hub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 text-[11px] font-bold text-muted font-[family-name:var(--font-jetbrains)] uppercase tracking-widest">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-pink/50" />
                {post.date}
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-pink/50" />
                {post.readTime}
              </div>
              <div className="h-6 w-[1px] bg-border hidden sm:block" />
              <div className="flex items-center gap-5">
                <button className="hover:text-pink transition-all hover:scale-110 active:scale-95">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="hover:text-pink transition-all hover:scale-110 active:scale-95">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="lp-article animate-fade-up delay-2 selection:bg-pink/30 selection:text-white">
          {post.content}
        </article>

        {/* Related Posts Section */}
        <div className="mt-32 pt-24 border-t border-border animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-3xl font-extrabold font-[family-name:var(--font-syne)] tracking-tight">
              Related <span className="text-muted">Reading</span>
            </h4>
            <Link href="/blog" className="text-[10px] font-bold uppercase tracking-widest text-pink hover:underline underline-offset-4">
              View all posts
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                <Card glow className="h-full bg-surface/20 border-border group-hover:border-pink/30 p-8 transition-all duration-500">
                  <span className="text-[9px] font-bold text-pink uppercase tracking-widest mb-4 block">
                    {related.category}
                  </span>
                  <h5 className="text-xl font-bold font-[family-name:var(--font-syne)] group-hover:text-pink transition-colors mb-6 leading-tight">
                    {related.title}
                  </h5>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-pink transition-colors mt-auto">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <Card glow className="mt-32 !p-0 overflow-hidden animate-fade-up delay-4 border-pink/10">
          <div className="grid md:grid-cols-2">
            <div className="p-10 sm:p-14 border-b md:border-b-0 md:border-r border-border bg-surface/30 backdrop-blur-sm">
               <h3 className="text-3xl font-extrabold font-[family-name:var(--font-syne)] mb-6 tracking-tight">
                  Master your terminal <span className="pink-gradient-text">today.</span>
               </h3>
               <p className="text-muted mb-10 leading-relaxed font-[family-name:var(--font-dm-sans)]">
                  Stop searching and start building. Secure your local workflow with 
                  the assistant that puts your privacy and productivity first.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full sm:w-auto">Get TermAssist</Button>
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button variant="ghost" size="lg" className="w-full">Dashboard</Button>
                  </Link>
               </div>
            </div>
            <div className="bg-terminal-bg/50 p-10 flex flex-col items-center justify-center relative group">
               <div className="absolute inset-0 bg-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Terminal className="w-32 h-32 text-pink/5 mb-6 group-hover:scale-110 transition-transform duration-700" />
               <div className="text-center font-[family-name:var(--font-jetbrains)] relative z-10">
                  <div className="text-sm text-pink mb-2 font-bold">$ termassist --init</div>
                  <div className="text-[10px] text-muted/60 uppercase tracking-widest font-bold">Local intelligence ready</div>
               </div>
            </div>
          </div>
        </Card>
      </main>

      <footer className="border-t border-border py-20 mt-32 bg-surface/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-pink" />
                    <span className="text-2xl font-bold font-[family-name:var(--font-syne)] tracking-tight">
                      term<span className="text-pink">assist</span>
                    </span>
                  </div>
                  <p className="text-sm text-muted max-w-xs leading-relaxed">
                    Engineering the future of terminal productivity with local-first AI.
                  </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-widest">
                 <Link href="/" className="text-muted hover:text-pink transition-colors">Home</Link>
                 <Link href="/blog" className="text-pink transition-colors underline decoration-2 underline-offset-8">Knowledge</Link>
                 <Link href="/dashboard" className="text-muted hover:text-pink transition-colors">Dashboard</Link>
                 <Link href="/auth/signup" className="text-muted hover:text-pink transition-colors">Join Now</Link>
              </div>
           </div>
           
           <div className="mt-20 pt-10 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                © 2026 TermAssist. Engineered by developers.
              </p>
              <div className="flex gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                 <div className="h-4 w-12 bg-muted rounded-sm" />
                 <div className="h-4 w-12 bg-muted rounded-sm" />
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

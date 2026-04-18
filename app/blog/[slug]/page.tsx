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
  ArrowRight,
  RefreshCw,
  Shield
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
    title: "The Ultimate Getting Started Guide: Zero to ?? in 5 Minutes",
    category: "Guide",
    date: "Apr 17, 2026",
    readTime: "7 min",
    content: (
      <>
        <p>
          Welcome to TermAssist. This guide is built for external developers setting up their terminal for a 100% private, AI-powered workflow. We will cover every minor step to ensure you are up and running immediately.
        </p>

        <h2>Step 1: Web Onboarding</h2>
        <p>
          Before touching the terminal, you need a secure bridge to your snippets.
        </p>
        <ol>
          <li>Create an account at <strong>auth/signup</strong>.</li>
          <li>Navigate to your <strong>Dashboard &gt; Settings</strong>.</li>
          <li>Click &quot;Generate Token&quot; and copy the <code>ta_...</code> key to a safe place.</li>
        </ol>

        <h2>Step 2: CLI Installation</h2>
        <p>Clone the repository to your local machine and install the core dependencies:</p>
        <pre>
          <code>git clone https://github.com/your-username/termassist.git{'\n'}cd termassist{'\n'}npm install</code>
        </pre>

        <h2>Step 3: Manual Configuration</h2>
        <p>
          TermAssist expects a configuration file in your home directory. Create the folder and config file manually:
        </p>
        <ul>
          <li><strong>Windows</strong>: <code>C:\Users\YourName\.termassist\config.json</code></li>
          <li><strong>Mac/Linux</strong>: <code>~/.termassist/config.json</code></li>
        </ul>
        <p>Populate the file with your token and the local dev URL:</p>
        <pre>
          <code>{`{
  "api_token": "YOUR_GENERATED_TOKEN",
  "api_url": "http://localhost:3000",
  "sync_enabled": true
}`}</code>
        </pre>

        <div className="blog-callout blog-callout-info">
           <Terminal className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>No Alias? No Problem.</strong> If you haven’t set up a shortcut yet, you can run TermAssist directly from the root folder: <code>node cli/index.js &quot;query&quot;</code>.
           </div>
        </div>

        <h2>Step 4: Setting Up the ?? Shortcut</h2>
        <p>
          To use the tool from any directory with the <code>??</code> shortcut, follow these steps:
        </p>
        <h3>On Windows (PowerShell)</h3>
        <p>Run <code>notepad $PROFILE</code> and add this function:</p>
        <pre>
          <code>{`function ?? { node "C:/path/to/termassist/cli/index.js" @args }`}</code>
        </pre>
        <h3>On macOS/Linux (Bash/Zsh)</h3>
        <p>Add this to your <code>.zshrc</code> or <code>.bashrc</code>:</p>
        <pre>
          <code>alias ??=&apos;node /path/to/termassist/cli/index.js&apos;</code>
        </pre>
      </>
    ),
  },
  "packages-deep-dive": {
    title: "Under the Hood: Why BM25 Beats Cloud AI for Speed",
    category: "Technology",
    date: "Apr 16, 2026",
    readTime: "8 min",
    content: (
      <>
        <p>
          Privacy is the backbone of TermAssist. To achieve zero-latency matching without sending your data to a cloud LLM, we implemented the **BM25 (Best Matching 25)** algorithm in pure JavaScript.
        </p>

        <h2>The Performance Benchmark</h2>
        <p>
          Most terminal assistants require a network round-trip of 2-5 seconds. TermAssist matches queries in <strong>under 5ms</strong>. Here&apos;s why:
        </p>
        <ul>
          <li><strong>Native TF-IDF Scoring</strong>: We calculate the statistical relevance of your query against local command datasets in real-time.</li>
          <li><strong>No "Boot-up" Penalty</strong>: Unlike Python-based vector search, our JS engine doesn&apos;t need to load gigabytes of AI model weights.</li>
          <li><strong>Independently Secure</strong>: All logic resides in <code>cli/search.js</code>. Your query text never leaves your RAM/CPU during the search.</li>
        </ul>

        <h2>Search Heuristics</h2>
        <p>
          Our engine combines BM25 scores with custom substring heuristics to ensure that even partial flag matches (like <code>-rf</code> or <code>--force</code>) are accurately weighted.
        </p>
      </>
    ),
  },
  "dashboard-guide": {
    title: "Mastering the Dashboard: Sync, Telemetry, and Privacy",
    category: "Tutorial",
    date: "Apr 15, 2026",
    readTime: "5 min",
    content: (
      <>
        <p>
          The Dashboard is the command center that turns TermAssist into a cross-machine intelligence suite.
        </p>

        <h2>Syncing Custom Snippets</h2>
        <p>
          When you add a snippet in the **Web Dashboard**, it doesn&apos;t automatically appear offline. You must trigger a pull:
        </p>
        <pre>
          <code>?? sync</code>
        </pre>
        <p>
          This fetches data from our secure endpoint and updates your local <code>custom_snippets.json</code> in the background.
        </p>

        <h2>Telemetry & Privacy Toggles</h2>
        <p>
          By setting <code>sync_enabled: true</code> in your config, TermAssist sends executed query data to your dashboard for visual analytics. 
        </p>
        <div className="blog-callout blog-callout-warning">
           <Shield className="w-5 h-5 mt-1 shrink-0 text-pink" />
           <div>
              <strong>Go Dark Mode:</strong> If you are working on a highly classified project, set <code>sync_enabled: false</code>. This kills all outgoing traffic, making TermAssist 100% air-gapped.
           </div>
        </div>

        <h2>Managing the Danger Zone</h2>
        <p>
           In **Settings**, you have a &quot;Delete All Data&quot; option. This wipes your tokens, snippets, and query history from our servers instantly, giving you total ownership over your terminal history.
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

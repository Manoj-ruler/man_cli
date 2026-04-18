"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { 
  Terminal, 
  Code2, 
  Settings, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Activity,
  History
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalSnippets: 0,
    userName: "",
    lastQuery: null as string | null,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { count: queriesCount } = await supabase
        .from("command_queries")
        .select("*", { count: 'exact', head: true });
        
      const { count: snippetsCount } = await supabase
        .from("snippets")
        .select("*", { count: 'exact', head: true });

      const { data: lastQueryData } = await supabase
        .from("command_queries")
        .select("query_text")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalQueries: queriesCount || 0,
        totalSnippets: snippetsCount || 0,
        userName: user?.email?.split('@')[0] || "Developer",
        lastQuery: lastQueryData?.query_text || null,
        loading: false
      });
    };
    
    fetchStats();
  }, [supabase]);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <DashboardHeader title="Overview" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
        {/* Welcome Hero */}
        <div className="relative overflow-hidden rounded-xl bg-surface border border-border p-8 lg:p-12">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-pink font-semibold">
              <Zap className="w-5 h-5" />
              <span className="text-sm tracking-wider uppercase">System Ready</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-text font-[family-name:var(--font-syne)]">
              Welcome back, <span className="pink-gradient-text">{stats.userName}</span>.
            </h1>
            <p className="text-muted max-w-2xl leading-relaxed">
              Your terminal intelligence is synchronized across your devices. 
              Track your productivity, manage snippets, and refine your CLI workflow from one command center.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/dashboard/commands">
                <Button>
                  Review Queries
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/snippets">
                <Button variant="ghost">
                  Manage Snippets
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative background terminal icon */}
          <Terminal className="absolute -bottom-10 -right-10 w-64 h-64 text-pink/5 rotate-12 pointer-events-none" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card glow className="flex flex-col gap-4">
            <div className="p-3 w-fit rounded-lg bg-pink/10 border border-pink/20">
              <Activity className="w-6 h-6 text-pink" />
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Total Command Invocations</p>
              <h3 className="text-3xl font-bold text-text font-[family-name:var(--font-syne)]">
                {stats.totalQueries}
              </h3>
            </div>
            <p className="text-xs text-muted/60 mt-auto">Logged from your local CLI</p>
          </Card>

          <Card glow className="flex flex-col gap-4">
            <div className="p-3 w-fit rounded-lg bg-pink/10 border border-pink/20">
              <Code2 className="w-6 h-6 text-pink" />
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Personal Snippets</p>
              <h3 className="text-3xl font-bold text-text font-[family-name:var(--font-syne)]">
                {stats.totalSnippets}
              </h3>
            </div>
            <p className="text-xs text-muted/60 mt-auto">Synced to local index</p>
          </Card>

          <Card glow className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <div className="p-3 w-fit rounded-lg bg-pink/10 border border-pink/20">
              <History className="w-6 h-6 text-pink" />
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Recent Query</p>
              <h3 className="text-lg font-medium text-text font-[family-name:var(--font-dm-sans)] line-clamp-2">
                {stats.lastQuery ? `"${stats.lastQuery}"` : "No activity logged yet"}
              </h3>
            </div>
            <p className="text-xs text-muted/60 mt-auto">Analyzed via local BM25 engine</p>
          </Card>
        </div>

        {/* Next Steps / Tips */}
        <div className="grid lg:grid-cols-3 gap-8 pt-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-text font-[family-name:var(--font-syne)] flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-pink" />
              Productivity Tips
            </h2>
            <div className="grid gap-4">
              {[
                {
                  title: "Setup Shell Aliasing",
                  desc: "Add a function to your profile to invoke the assistant with just ?? for maximum speed.",
                  link: "/blog/mastering-cli"
                },
                {
                  title: "Enable Telemetry",
                  desc: "View your usage patterns and most used command categories by enabling sync in your config.",
                  link: "/dashboard/settings"
                },
                {
                  title: "Privacy First",
                  desc: "Remember, your actual commands never leave your machine during local search. Only execution logs are shared.",
                  link: "/blog/packages-deep-dive"
                }
              ].map((tip, i) => (
                <Link key={i} href={tip.link}>
                  <div className="p-5 rounded-lg border border-border bg-surface-2 hover:border-pink/30 hover:bg-surface transition-all duration-300 group">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-text group-hover:text-pink transition-colors">{tip.title}</h4>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-sm text-muted mt-2">{tip.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text font-[family-name:var(--font-syne)] flex items-center gap-3">
              <Settings className="w-5 h-5 text-pink" />
              Configuration
            </h2>
            <Card className="p-6 bg-surface-2">
              <div className="space-y-4">
                <p className="text-sm text-muted">
                  Your API Token is required to sync your terminal logs with this dashboard.
                </p>
                <Link href="/dashboard/settings" className="block w-full">
                  <Button variant="ghost" className="w-full">
                    Manage Access Tokens
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

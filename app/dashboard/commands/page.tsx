"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { QueryBarChart } from "@/components/charts/QueryBarChart";
import {
  Search,
  Terminal,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Clock,
  Tag,
} from "lucide-react";
import { Database } from "@/types/database";

type CommandQuery = Database["public"]["Tables"]["command_queries"]["Row"];

const ITEMS_PER_PAGE = 20;

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function CommandsPage() {
  const supabase = createClient();
  const [queries, setQueries] = useState<CommandQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      const { data } = await supabase
        .from("command_queries")
        .select("*")
        .order("created_at", { ascending: false });

      setQueries(data || []);
      setLoading(false);
    };
    fetchQueries();
  }, [supabase]);

  const filtered = useMemo(
    () =>
      queries.filter((q) =>
        q.query_text.toLowerCase().includes(search.toLowerCase())
      ),
    [queries, search]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  // Stats
  const totalQueries = queries.length;
  const mostUsedCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    queries.forEach((q) => {
      if (q.category) cats[q.category] = (cats[q.category] || 0) + 1;
    });
    const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "—";
  }, [queries]);
  const avgResponseTime = useMemo(() => {
    const times = queries
      .filter((q) => q.response_time_ms !== null)
      .map((q) => q.response_time_ms!);
    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  }, [queries]);

  // Chart data
  const chartData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days[key] = 0;
    }
    queries.forEach((q) => {
      const key = q.created_at.split("T")[0];
      if (days[key] !== undefined) days[key]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }, [queries]);

  const handleCopy = async (command: string, id: string) => {
    await navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Commands" />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-pink" />
              <div>
                <p className="text-xs text-muted">Total Queries</p>
                <p className="text-2xl font-bold text-pink font-[family-name:var(--font-syne)]">
                  {totalQueries}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-pink" />
              <div>
                <p className="text-xs text-muted">Top Category</p>
                <p className="text-2xl font-bold text-pink font-[family-name:var(--font-syne)] capitalize">
                  {mostUsedCategory}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-pink" />
              <div>
                <p className="text-xs text-muted">Avg Response</p>
                <p className="text-2xl font-bold text-pink font-[family-name:var(--font-syne)]">
                  {avgResponseTime}ms
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <QueryBarChart data={chartData} />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search queries..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface text-text border border-border rounded text-sm font-[family-name:var(--font-dm-sans)] placeholder:text-muted/50 outline-none focus:border-pink focus:ring-2 focus:ring-pink/30 transition-all duration-200"
          />
        </div>

        {/* Table or empty state */}
        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Terminal className="w-12 h-12 text-muted/40 mb-4" />
            <p className="text-muted text-sm">
              No queries yet. Start using{" "}
              <code className="text-pink font-[family-name:var(--font-jetbrains)]">
                ??
              </code>{" "}
              in your terminal.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-border rounded">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-2 text-muted text-left">
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Query</th>
                    <th className="px-4 py-3 font-medium">Matched Command</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Response
                    </th>
                    <th className="px-4 py-3 font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((q) => (
                    <tr
                      key={q.id}
                      className="border-t border-border hover:bg-surface-2/50 transition-colors duration-150 group"
                    >
                      <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                        {timeAgo(q.created_at)}
                      </td>
                      <td className="px-4 py-3 text-text max-w-[300px] truncate">
                        {q.query_text}
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-pink font-[family-name:var(--font-jetbrains)] text-xs bg-terminal-bg px-2 py-1 rounded">
                          {q.matched_command}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs text-right">
                        {q.response_time_ms ? `${q.response_time_ms}ms` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleCopy(q.matched_command, q.id)}
                          className="p-1.5 rounded text-muted hover:text-pink transition-colors cursor-pointer"
                          aria-label="Copy command"
                        >
                          {copiedId === q.id ? (
                            <Check className="w-4 h-4 text-green" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted">
                  Page {page + 1} of {totalPages} ({filtered.length} results)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="p-2 rounded border border-border text-muted hover:text-text disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setPage(Math.min(totalPages - 1, page + 1))
                    }
                    disabled={page >= totalPages - 1}
                    className="p-2 rounded border border-border text-muted hover:text-text disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

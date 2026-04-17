"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { SnippetCard } from "@/components/snippets/SnippetCard";
import { SnippetModal } from "@/components/snippets/SnippetModal";
import { Search, Plus, Code2 } from "lucide-react";
import { Database } from "@/types/database";

type Snippet = Database["public"]["Tables"]["custom_snippets"]["Row"];

export default function SnippetsPage() {
  const supabase = createClient();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    const { data } = await supabase
      .from("custom_snippets")
      .select("*")
      .order("created_at", { ascending: false });

    setSnippets(data || []);
    setLoading(false);
  };

  const filtered = useMemo(
    () =>
      snippets.filter(
        (s) =>
          s.label.toLowerCase().includes(search.toLowerCase()) ||
          s.tags?.some((t) =>
            t.toLowerCase().includes(search.toLowerCase())
          )
      ),
    [snippets, search]
  );

  const handleSave = async (data: {
    label: string;
    command: string;
    description: string;
    tags: string[];
  }) => {
    setSaving(true);

    if (editingSnippet) {
      // Update
      const { data: updated } = await supabase
        .from("custom_snippets")
        .update(data)
        .eq("id", editingSnippet.id)
        .select()
        .single();

      if (updated) {
        setSnippets((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
      }
    } else {
      // Get current user to satisfy RLS
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSaving(false);
        return;
      }

      // Create
      const { data: created } = await supabase
        .from("custom_snippets")
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (created) {
        setSnippets((prev) => [created, ...prev]);
      }
    }

    setSaving(false);
    setModalOpen(false);
    setEditingSnippet(null);
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Optimistic delete
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("custom_snippets").delete().eq("id", id);
  };

  const handleNewSnippet = () => {
    setEditingSnippet(null);
    setModalOpen(true);
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
      <DashboardHeader title="My Snippets">
        <Button size="sm" onClick={handleNewSnippet}>
          <Plus className="w-4 h-4" />
          New Snippet
        </Button>
      </DashboardHeader>

      <div className="p-6 lg:p-8 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by label or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface text-text border border-border rounded text-sm font-[family-name:var(--font-dm-sans)] placeholder:text-muted/50 outline-none focus:border-pink focus:ring-2 focus:ring-pink/30 transition-all duration-200"
          />
        </div>

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Code2 className="w-12 h-12 text-muted/40 mb-4" />
            <p className="text-muted text-sm mb-4">
              {search
                ? "No snippets match your search."
                : "No snippets yet. Create your first one!"}
            </p>
            {!search && (
              <Button size="sm" onClick={handleNewSnippet}>
                <Plus className="w-4 h-4" />
                New Snippet
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <SnippetModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSnippet(null);
        }}
        onSave={handleSave}
        snippet={editingSnippet}
        loading={saving}
      />
    </div>
  );
}

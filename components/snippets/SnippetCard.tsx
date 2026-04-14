"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Edit2, Trash2 } from "lucide-react";
import { Database } from "@/types/database";

type Snippet = Database["public"]["Tables"]["custom_snippets"]["Row"];

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete snippet "${snippet.label}"?`)) {
      onDelete(snippet.id);
    }
  };

  return (
    <div className="bg-surface border border-border rounded p-5 transition-all duration-200 card-glow flex flex-col gap-3">
      {/* Label */}
      <h3 className="text-base font-semibold text-text font-[family-name:var(--font-syne)] leading-tight">
        {snippet.label}
      </h3>

      {/* Command */}
      <div className="bg-terminal-bg rounded px-3 py-2 overflow-x-auto">
        <code className="text-sm text-pink font-[family-name:var(--font-jetbrains)] whitespace-nowrap">
          {snippet.command}
        </code>
      </div>

      {/* Description */}
      {snippet.description && (
        <p className="text-sm text-muted leading-relaxed">
          {snippet.description}
        </p>
      )}

      {/* Tags */}
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border mt-auto">
        <button
          onClick={() => onEdit(snippet)}
          className="p-1.5 rounded text-muted hover:text-text hover:bg-surface-2 transition-colors duration-200 cursor-pointer"
          aria-label="Edit snippet"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded text-muted hover:text-red hover:bg-red/10 transition-colors duration-200 cursor-pointer"
          aria-label="Delete snippet"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";
import { Database } from "@/types/database";

type Snippet = Database["public"]["Tables"]["custom_snippets"]["Row"];

interface SnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    label: string;
    command: string;
    description: string;
    tags: string[];
  }) => void;
  snippet?: Snippet | null;
  loading?: boolean;
}

export function SnippetModal({
  isOpen,
  onClose,
  onSave,
  snippet,
  loading,
}: SnippetModalProps) {
  const [label, setLabel] = useState("");
  const [command, setCommand] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (snippet) {
      setLabel(snippet.label);
      setCommand(snippet.command);
      setDescription(snippet.description || "");
      setTags(snippet.tags || []);
    } else {
      setLabel("");
      setCommand("");
      setDescription("");
      setTags([]);
    }
    setTagInput("");
    setErrors({});
  }, [snippet, isOpen]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!label.trim()) newErrors.label = "Label is required";
    if (!command.trim()) newErrors.command = "Command is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ label: label.trim(), command: command.trim(), description: description.trim(), tags });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={snippet ? "Edit Snippet" : "New Snippet"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Label"
          placeholder="e.g. Undo last commit"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          error={errors.label}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted font-[family-name:var(--font-dm-sans)]">
            Command
          </label>
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="e.g. git reset --soft HEAD~1"
            rows={3}
            className={`w-full px-4 py-2.5 bg-surface text-pink border border-border rounded text-sm font-[family-name:var(--font-jetbrains)] placeholder:text-muted/50 transition-all duration-200 outline-none focus:border-pink focus:ring-2 focus:ring-pink/30 resize-none ${
              errors.command ? "border-red focus:ring-red/30 focus:border-red" : ""
            }`}
          />
          {errors.command && (
            <p className="text-xs text-red">{errors.command}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted font-[family-name:var(--font-dm-sans)]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this command do?"
            rows={2}
            className="w-full px-4 py-2.5 bg-surface text-text border border-border rounded text-sm font-[family-name:var(--font-dm-sans)] placeholder:text-muted/50 transition-all duration-200 outline-none focus:border-pink focus:ring-2 focus:ring-pink/30 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted font-[family-name:var(--font-dm-sans)]">
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {tags.map((tag) => (
              <Badge key={tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-pink cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder="Type tag and press Enter"
            className="w-full px-4 py-2 bg-surface text-text border border-border rounded text-sm font-[family-name:var(--font-dm-sans)] placeholder:text-muted/50 outline-none focus:border-pink focus:ring-2 focus:ring-pink/30 transition-all duration-200"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {snippet ? "Save Changes" : "Create Snippet"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

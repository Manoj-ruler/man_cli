"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Spinner } from "@/components/ui/Spinner";
import { Key, RefreshCw, AlertTriangle, Copy, Check, Terminal } from "lucide-react";
import Link from "next/link";
import { TERMASSIST_INSTALL_COMMAND } from "@/lib/termassist-npm";

export default function SettingsPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
      }

      // Fetch existing API token
      const { data: tokenData } = await supabase
        .from("api_tokens")
        .select("token")
        .limit(1)
        .single();

      if (tokenData) {
        setApiToken(tokenData.token);
      }

      setLoading(false);
    };
    init();
  }, [supabase]);

  const generateToken = async () => {
    setGenerating(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const token = `ta_${crypto.randomUUID().replace(/-/g, "")}`;

    // Delete existing tokens
    await supabase.from("api_tokens").delete().gt("created_at", "2000-01-01");

    // Insert new token
    const { error } = await supabase.from("api_tokens").insert({ 
      token,
      user_id: user.id
    });

    if (!error) {
      setApiToken(token);
      setMessage("New API token generated. Update your CLI config.");
      setTimeout(() => setMessage(""), 5000);
    }
    
    setGenerating(false);
  };

  const copyToken = async () => {
    await navigator.clipboard.writeText(apiToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure? This will permanently delete your account and all associated data."
      )
    ) {
      // Delete all user data
      await supabase.from("command_queries").delete().gt("created_at", "2000-01-01");
      await supabase.from("custom_snippets").delete().gt("created_at", "2000-01-01");
      await supabase.from("api_tokens").delete().gt("created_at", "2000-01-01");
      // Note: actual account deletion requires admin API
      setMessage("Data cleared. Contact support to fully delete your account.");
    }
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
      <DashboardHeader title="Settings" />

      <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
        {/* Success message */}
        {message && (
          <div className="bg-green/10 border border-green/20 rounded px-4 py-3 text-sm text-green animate-fade-in">
            {message}
          </div>
        )}

        {/* Account */}
        <Card>
          <h2 className="text-lg font-semibold text-text font-[family-name:var(--font-syne)] mb-4">
            Account
          </h2>
          <div className="space-y-4">
            <Input
              label="Email"
              value={email}
              disabled
            />
            <p className="text-xs text-muted">
              Email changes are managed through your auth provider.
            </p>
          </div>
        </Card>

        {/* Install CLI */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-pink" />
            <h2 className="text-lg font-semibold text-text font-[family-name:var(--font-syne)]">
              Install TermAssist on your computer
            </h2>
          </div>
          <p className="text-sm text-muted mb-3">
            The dashboard works together with the terminal app. Install it once with Node.js (LTS), then paste the command below in PowerShell, Terminal, or your Linux shell.
          </p>
          <CodeBlock code={TERMASSIST_INSTALL_COMMAND} language="bash" />
          <p className="text-xs text-muted mt-3">
            After installing, run <code className="text-pink">termassist &quot;list files&quot;</code> to try it. Full setup:{" "}
            <Link href="/blog/quick-install-guide" className="text-pink hover:underline">
              quick install guide
            </Link>
            .
          </p>
        </Card>

        {/* API Token */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-pink" />
            <h2 className="text-lg font-semibold text-text font-[family-name:var(--font-syne)]">
              CLI API Token
            </h2>
          </div>
          <p className="text-sm text-muted mb-4">
            This token is the <strong className="text-text/90">password</strong> between your terminal and this dashboard.
            Paste it into <code className="text-pink text-xs">~/.termassist/config.json</code> on your machine (see JSON below) —{" "}
            <strong className="text-text/90">not</strong> into your app&apos;s Git repo. With <code className="text-pink text-xs">&quot;sync_enabled&quot;: true</code>, the CLI
            can log queries here and you can run <code className="text-pink text-xs">termassist sync</code> for snippets.
          </p>

          {apiToken ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-terminal-bg border border-border rounded px-4 py-2.5 text-sm text-pink font-[family-name:var(--font-jetbrains)] truncate">
                  {apiToken}
                </code>
                <button
                  onClick={copyToken}
                  className="p-2.5 rounded border border-border text-muted hover:text-pink transition-colors cursor-pointer"
                  aria-label="Copy token"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <CodeBlock
                code={`# Add to ~/.termassist/config.json\n{\n  "api_token": "${apiToken}",\n  "api_url": "${typeof window !== "undefined" ? window.location.origin : "https://termassist.vercel.app"}",\n  "sync_enabled": true\n}`}
                language="json"
              />
            </div>
          ) : (
            <p className="text-sm text-muted italic mb-3">
              No API token generated yet.
            </p>
          )}

          <Button
            size="sm"
            onClick={generateToken}
            loading={generating}
            className="mt-3"
          >
            <RefreshCw className="w-4 h-4" />
            {apiToken ? "Regenerate Token" : "Generate Token"}
          </Button>
        </Card>

        {/* Sync Settings */}
        <Card>
          <h2 className="text-lg font-semibold text-text font-[family-name:var(--font-syne)] mb-4">
            Sync Preferences
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={syncEnabled}
                onChange={(e) => setSyncEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-border rounded-full peer-checked:bg-pink transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-text rounded-full transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-text">
              Auto-sync snippets to local CLI
            </span>
          </label>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red" />
            <h2 className="text-lg font-semibold text-red font-[family-name:var(--font-syne)]">
              Danger Zone
            </h2>
          </div>
          <p className="text-sm text-muted mb-4">
            Permanently delete all your data and account. This action cannot be
            undone.
          </p>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
            Delete All Data
          </Button>
        </Card>
      </div>
    </div>
  );
}

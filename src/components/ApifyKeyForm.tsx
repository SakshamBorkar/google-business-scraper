"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Key, Loader2, CheckCircle2, Trash2 } from "lucide-react";

interface ApifyKeyFormProps {
  hasKey: boolean;
}

export default function ApifyKeyForm({ hasKey }: ApifyKeyFormProps) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!apiKey.trim()) {
      setError("Please enter your Apify API key");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to save API key");
      } else {
        setSuccess("API key connected successfully!");
        setApiKey("");
        router.refresh();
        setTimeout(() => router.push("/search"), 1200);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    if (!confirm("Remove your Apify API key?")) return;
    setRemoving(true);
    setError("");

    try {
      const res = await fetch("/api/apify-key", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuccess("API key removed");
        router.refresh();
      } else {
        setError(data.error || "Failed to remove key");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-white text-sm">API Key</span>
        </div>
        {hasKey && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Key saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide font-medium">
            {hasKey ? "Enter new key to replace" : "Apify API Token"}
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={hasKey ? "apify_api_••••••••••" : "apify_api_xxxxxxxxxxxx"}
              className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-4 pr-11 py-3 text-white placeholder-slate-600 text-sm font-mono focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-emerald-400 text-sm bg-emerald-400/5 border border-emerald-400/20 rounded-lg px-3 py-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-bg-base font-semibold py-3 rounded-lg transition-all text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                {hasKey ? "Update Key" : "Save Key"}
              </>
            )}
          </button>

          {hasKey && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="p-3 rounded-lg border border-bg-border text-slate-500 hover:text-red-400 hover:border-red-400/30 transition-all"
              title="Remove API key"
            >
              {removing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

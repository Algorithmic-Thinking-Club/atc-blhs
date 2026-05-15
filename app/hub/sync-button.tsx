"use client";

import { useState } from "react";

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleSync() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/hub/sync-classroom", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(`Synced ${data.synced} announcements`);
      } else {
        setResult(data.error || "Sync failed");
      }
    } catch {
      setResult("Sync failed");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      {result && <span className="text-xs text-zinc-400">{result}</span>}
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
      >
        {loading ? "Syncing..." : "Sync Now"}
      </button>
    </div>
  );
}

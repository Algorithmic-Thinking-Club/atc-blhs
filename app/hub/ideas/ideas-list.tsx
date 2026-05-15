"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProjectIdea } from "@/lib/types";

type IdeaWithProfile = ProjectIdea & {
  profiles: { display_name: string } | null;
};

export default function IdeasList({
  initialIdeas,
  isAdmin,
  userId,
}: {
  initialIdeas: IdeaWithProfile[];
  isAdmin: boolean;
  userId: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    await supabase.from("project_ideas").insert({
      title,
      description,
      submitted_by: userId,
    });

    setTitle("");
    setDescription("");
    setSubmitting(false);
    router.refresh();
  }

  async function toggleField(id: string, field: "pinned" | "approved", current: boolean) {
    const supabase = createClient();
    await supabase
      .from("project_ideas")
      .update({ [field]: !current })
      .eq("id", id);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this idea?")) return;

    const res = await fetch("/api/hub/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "project_ideas", id }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete");
    }

    router.refresh();
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Project Ideas</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Idea title"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Idea"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {initialIdeas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center">
            <p className="text-zinc-500">No ideas yet. Be the first.</p>
          </div>
        ) : (
          initialIdeas.map((idea) => (
            <div
              key={idea.id}
              className="flex items-start gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{idea.title}</h3>
                  {idea.pinned && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400">
                      Pinned
                    </span>
                  )}
                  {idea.approved && (
                    <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">
                      Approved
                    </span>
                  )}
                </div>
                {idea.description && (
                  <p className="mt-2 text-sm text-zinc-400">
                    {idea.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-500">
                  by {idea.profiles?.display_name || "Unknown"} &middot;{" "}
                  {new Date(idea.created_at).toLocaleDateString()}
                </p>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleField(idea.id, "approved", idea.approved)}
                    className={`rounded px-2 py-1 text-xs ${
                      idea.approved
                        ? "bg-green-500/20 text-green-400"
                        : "border border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {idea.approved ? "Approved" : "Approve"}
                  </button>
                  <button
                    onClick={() => toggleField(idea.id, "pinned", idea.pinned)}
                    className={`rounded px-2 py-1 text-xs ${
                      idea.pinned
                        ? "bg-amber-500/20 text-amber-400"
                        : "border border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {idea.pinned ? "Pinned" : "Pin"}
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="rounded border border-zinc-700 px-2 py-1 text-xs text-red-400 hover:border-red-500 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

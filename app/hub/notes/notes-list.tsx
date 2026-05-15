"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { MeetingNote } from "@/lib/types";

export default function NotesList({
  initialNotes,
  isAdmin,
}: {
  initialNotes: MeetingNote[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("meeting_notes").insert({
      title,
      content,
      meeting_date: date,
      created_by: user.id,
    });

    setTitle("");
    setDate("");
    setContent("");
    setShowForm(false);
    setSubmitting(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this note?")) return;

    const res = await fetch("/api/hub/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "meeting_notes", id }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete");
    }

    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Meeting Notes</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            {showForm ? "Cancel" : "Add Meeting Note"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-300">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-300">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-300">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Note"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {initialNotes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center">
            <p className="text-zinc-500">No meeting notes yet.</p>
          </div>
        ) : (
          initialNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === note.id ? null : note.id)
                }
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div>
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(note.meeting_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Delete
                    </span>
                  )}
                  <span className="text-zinc-500">
                    {expanded === note.id ? "−" : "+"}
                  </span>
                </div>
              </button>
              {expanded === note.id && (
                <div className="border-t border-zinc-800 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                    {note.content}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

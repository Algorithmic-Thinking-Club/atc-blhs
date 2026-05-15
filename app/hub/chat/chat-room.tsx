"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/types";

const roleBadgeColor: Record<string, string> = {
  owner: "bg-amber-500/20 text-amber-400",
  admin: "bg-blue-500/20 text-blue-400",
  member: "bg-zinc-700/50 text-zinc-400",
};

function isImageType(type: string | null): boolean {
  if (!type) return false;
  return type.startsWith("image/");
}

export default function ChatRoom({
  initialMessages,
  userId,
  userDisplayName,
  userRole,
  isAdmin,
}: {
  initialMessages: ChatMessage[];
  userId: string;
  userDisplayName: string;
  userRole: "member" | "admin" | "owner";
  isAdmin: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const seenIds = useRef(new Set(initialMessages.map((m) => m.id)));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // realtime: INSERT and DELETE
  useEffect(() => {
    const channel = supabase
      .channel("thread-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        async (payload) => {
          const newId = payload.new.id as string;
          if (seenIds.current.has(newId)) return;
          seenIds.current.add(newId);

          const { data } = await supabase
            .from("chat_messages")
            .select("*, profiles(display_name, role)")
            .eq("id", newId)
            .single();

          if (data) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newId)) return prev;
              return [...prev, data as ChatMessage];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          const deletedId = payload.old.id as string;
          seenIds.current.delete(deletedId);
          setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function uploadFile(f: File): Promise<{ url: string; type: string } | null> {
    const ext = f.name.split(".").pop() || "bin";
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("thread-files")
      .upload(path, f);

    if (error) {
      console.error("Upload failed:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("thread-files")
      .getPublicUrl(path);

    return { url: data.publicUrl, type: f.type };
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text && !file) return;

    setSending(true);
    setInput("");

    let fileUrl: string | null = null;
    let fileType: string | null = null;

    if (file) {
      setUploading(true);
      const result = await uploadFile(file);
      if (result) {
        fileUrl = result.url;
        fileType = result.type;
      }
      setFile(null);
      setUploading(false);
    }

    // optimistic message
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: optimisticId,
      user_id: userId,
      content: text || (fileUrl ? "(file)" : ""),
      file_url: fileUrl,
      file_type: fileType,
      created_at: new Date().toISOString(),
      profiles: { display_name: userDisplayName, role: userRole },
    };
    seenIds.current.add(optimisticId);
    setMessages((prev) => [...prev, optimisticMsg]);

    const { data } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        content: text || (fileUrl ? "(file)" : ""),
        file_url: fileUrl,
        file_type: fileType,
      })
      .select("*, profiles(display_name, role)")
      .single();

    if (data) {
      seenIds.current.add(data.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? (data as ChatMessage) : m))
      );
    }

    setSending(false);
  }

  async function handleDelete(msgId: string) {
    const res = await fetch("/api/hub/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "chat_messages", id: msgId }),
    });

    if (res.ok) {
      // optimistic removal (realtime will also fire)
      seenIds.current.delete(msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      // 10MB limit
      if (f.size > 10 * 1024 * 1024) {
        alert("File must be under 10MB");
        return;
      }
      setFile(f);
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 180px)" }}>
      <h1 className="mb-4 text-xl font-bold">Thread</h1>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No messages yet. Say something.
          </p>
        ) : (
          messages.map((msg) => {
            const profile = msg.profiles as
              | { display_name: string; role: string }
              | undefined;
            const isOwn = msg.user_id === userId;

            return (
              <div key={msg.id} className={`group flex ${isOwn ? "justify-end" : ""}`}>
                <div
                  className={`relative max-w-[75%] rounded-lg px-4 py-2.5 ${
                    isOwn
                      ? "bg-accent/20 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {/* admin delete */}
                  {isAdmin && !msg.id.startsWith("optimistic") && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="absolute -right-2 -top-2 hidden rounded-full bg-zinc-800 p-1 text-red-400 hover:bg-red-500/20 hover:text-red-300 group-hover:block"
                      title="Delete message"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {profile?.display_name || "Unknown"}
                    </span>
                    {profile?.role && profile.role !== "member" && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize ${
                          roleBadgeColor[profile.role] || ""
                        }`}
                      >
                        {profile.role}
                      </span>
                    )}
                  </div>

                  {/* text content */}
                  {msg.content && msg.content !== "(file)" && (
                    <p className="mt-1 text-sm">{msg.content}</p>
                  )}

                  {/* file attachment */}
                  {msg.file_url && (
                    <div className="mt-2">
                      {isImageType(msg.file_type) ? (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={msg.file_url}
                            alt="Attachment"
                            width={300}
                            height={200}
                            className="rounded-md object-cover"
                            unoptimized
                          />
                        </a>
                      ) : (
                        <a
                          href={msg.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded border border-zinc-600 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          File
                        </a>
                      )}
                    </div>
                  )}

                  <p className="mt-1 text-right text-[10px] text-zinc-500">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* file preview */}
      {file && (
        <div className="mt-2 flex items-center gap-2 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          <span className="flex-1 truncate text-zinc-300">{file.name}</span>
          <span className="text-xs text-zinc-500">
            {(file.size / 1024).toFixed(0)}KB
          </span>
          <button
            onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="text-zinc-400 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* input bar */}
      <form onSubmit={handleSend} className="mt-2 flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.zip,.txt,.doc,.docx,.py,.js,.ts,.java,.cpp,.c,.html,.css"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-zinc-700 px-3 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
          title="Attach file"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={sending || uploading || (!input.trim() && !file)}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
        >
          {uploading ? "Uploading..." : sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

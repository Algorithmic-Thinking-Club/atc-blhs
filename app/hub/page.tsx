import { createClient } from "@/lib/supabase/server";
import type { Announcement, Profile } from "@/lib/types";
import SyncButton from "./sync-button";

export default async function HubStreamPage() {
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("creation_time", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin" || profile?.role === "owner";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Stream</h1>
        {isAdmin && <SyncButton />}
      </div>

      <div className="mt-6 space-y-4">
        {(!announcements || announcements.length === 0) ? (
          <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center">
            <p className="text-zinc-500">
              No announcements yet. Check back after the next sync.
            </p>
          </div>
        ) : (
          (announcements as Announcement[]).map((a) => (
            <div
              key={a.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5"
            >
              <p className="whitespace-pre-wrap text-sm text-zinc-300">
                {a.text}
              </p>
              {a.creation_time && (
                <p className="mt-3 text-xs text-zinc-500">
                  {new Date(a.creation_time).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

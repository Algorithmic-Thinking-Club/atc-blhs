import { createClient } from "@/lib/supabase/server";
import type { MeetingNote } from "@/lib/types";
import NotesList from "./notes-list";

export default async function NotesPage() {
  const supabase = await createClient();

  const { data: notes } = await supabase
    .from("meeting_notes")
    .select("*")
    .order("meeting_date", { ascending: false });

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
    <NotesList
      initialNotes={(notes as MeetingNote[]) || []}
      isAdmin={isAdmin}
    />
  );
}

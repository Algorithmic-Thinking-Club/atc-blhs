import { createClient } from "@/lib/supabase/server";
import type { ChatMessage } from "@/lib/types";
import ChatRoom from "./chat-room";

export default async function ChatPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*, profiles(display_name, role)")
    .order("created_at", { ascending: true })
    .limit(100);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Unknown";
  let role: "member" | "admin" | "owner" = "member";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, role")
      .eq("id", user.id)
      .single();
    if (profile) {
      displayName = profile.display_name || user.email || "Unknown";
      role = profile.role;
    }
  }

  const isAdmin = role === "admin" || role === "owner";

  return (
    <ChatRoom
      initialMessages={(messages as ChatMessage[]) || []}
      userId={user?.id || ""}
      userDisplayName={displayName}
      userRole={role}
      isAdmin={isAdmin}
    />
  );
}

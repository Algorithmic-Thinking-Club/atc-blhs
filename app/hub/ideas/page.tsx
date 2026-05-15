import { createClient } from "@/lib/supabase/server";
import type { ProjectIdea } from "@/lib/types";
import IdeasList from "./ideas-list";

export default async function IdeasPage() {
  const supabase = await createClient();

  const { data: ideas } = await supabase
    .from("project_ideas")
    .select("*, profiles(display_name)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let userId = "";
  if (user) {
    userId = user.id;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin" || profile?.role === "owner";
  }

  return (
    <IdeasList
      initialIdeas={(ideas as (ProjectIdea & { profiles: { display_name: string } | null })[]) || []}
      isAdmin={isAdmin}
      userId={userId}
    />
  );
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Google env vars (CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN)");
  }

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data.access_token;
}

export async function POST() {
  // verify caller is admin/owner
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const accessToken = await getAccessToken();
    const courseId = process.env.GOOGLE_CLASSROOM_COURSE_ID;
    if (!courseId) {
      return NextResponse.json({ error: "Missing GOOGLE_CLASSROOM_COURSE_ID" }, { status: 500 });
    }

    const res = await fetch(
      `https://classroom.googleapis.com/v1/courses/${courseId}/announcements?orderBy=updateTime+desc&pageSize=20`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const announcements = data.announcements || [];

    // use service role client to bypass RLS for writes
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    for (const a of announcements) {
      await serviceClient.from("announcements").upsert(
        {
          id: a.id,
          text: a.text || "",
          creation_time: a.creationTime,
          update_time: a.updateTime,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }

    return NextResponse.json({ synced: announcements.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

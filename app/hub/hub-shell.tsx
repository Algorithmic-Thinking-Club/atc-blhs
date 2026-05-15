"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const tabs = [
  { label: "Stream", href: "/hub" },
  { label: "Meeting Notes", href: "/hub/notes" },
  { label: "Project Ideas", href: "/hub/ideas" },
  { label: "Thread", href: "/hub/chat" },
];

const roleBadgeColor: Record<string, string> = {
  owner: "bg-amber-500/20 text-amber-400",
  admin: "bg-blue-500/20 text-blue-400",
  member: "bg-zinc-700/50 text-zinc-400",
};

export default function HubShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isAdmin = profile.role === "admin" || profile.role === "owner";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* hub top bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/hub" className="text-lg font-bold tracking-tight">
            ATC Hub
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              {profile.display_name || profile.email}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleBadgeColor[profile.role]}`}
            >
              {profile.role}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* tab nav */}
        <div className="mx-auto max-w-6xl overflow-x-auto px-6">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`whitespace-nowrap border-b-2 pb-2 text-sm transition-colors ${
                  pathname === tab.href
                    ? "border-accent text-white"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/hub/admin"
                className={`whitespace-nowrap border-b-2 pb-2 text-sm transition-colors ${
                  pathname === "/hub/admin"
                    ? "border-accent text-white"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}

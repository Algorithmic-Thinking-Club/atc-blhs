"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/types";

export default function AdminPanel({
  members,
  currentUserId,
}: {
  members: Profile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdating(userId);

    const res = await fetch("/api/hub/update-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to update role");
    }

    setUpdating(null);
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Admin</h1>
      <p className="mt-2 text-sm text-zinc-400">Manage member roles.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-zinc-800/50">
                <td className="py-3 text-zinc-200">
                  {member.display_name || "—"}
                </td>
                <td className="py-3 text-zinc-400">{member.email}</td>
                <td className="py-3">
                  {member.role === "owner" ? (
                    <span className="text-amber-400">Owner</span>
                  ) : (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value)
                      }
                      disabled={
                        updating === member.id || member.id === currentUserId
                      }
                      className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-white focus:border-accent focus:outline-none disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </td>
                <td className="py-3 text-zinc-500">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

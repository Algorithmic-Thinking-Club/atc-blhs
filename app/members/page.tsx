import type { Metadata } from "next";
import Section from "@/components/Section";
import Card from "@/components/Card";
import { members } from "@/data/members";

export const metadata: Metadata = {
  title: "Members",
};

export default function MembersPage() {
  return (
    <Section
      title="Members"
      subtitle="The people behind ATC."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.name} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-lg font-bold text-zinc-400">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-accent">{member.role}</p>
            {member.bio && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {member.bio}
              </p>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}

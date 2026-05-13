import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import Card from "@/components/Card";
import { competitions } from "@/data/competitions";

export const metadata: Metadata = {
  title: "Competitions",
};

export default function CompetitionsPage() {
  return (
    <div className="relative overflow-hidden">
      <Image
        src="/skillsusa-state.jpg"
        alt=""
        fill
        className="object-cover opacity-10 pointer-events-none"
      />
      <Section
        title="Competitions"
        subtitle="ATC members compete in programming competitions at the regional, state, and national level."
        className="relative z-10"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((comp) => (
            <Card key={comp.title} className="flex flex-col">
              {comp.image && (
                <div className="mb-4 aspect-video rounded bg-zinc-800" />
              )}
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                {comp.result}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{comp.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">
                {comp.event} &middot; {comp.date}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {comp.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

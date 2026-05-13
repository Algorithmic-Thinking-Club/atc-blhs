import type { Metadata } from "next";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Join",
};

export default function JoinPage() {
  return (
    <>
      <Section title="Join ATC" subtitle="No experience required. Just show up.">
        <div className="max-w-2xl">
          <p className="text-zinc-400 leading-relaxed">
            ATC is the Algorithmic Thinking Club at Bonney Lake High School.
            We build software, compete in programming competitions, and work on
            projects together.
          </p>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            You don&apos;t need any coding experience to join. We&apos;ll help you
            get started. If you already know how to code, even better.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Build Real Projects",
              description:
                "Work on real software that actually gets used. Websites, tools, games, and more.",
            },
            {
              title: "Compete",
              description:
                "Represent BLHS at SkillsUSA and other programming competitions. We've already won state gold.",
            },
            {
              title: "Learn By Doing",
              description:
                "Pick up skills in programming, web dev, problem solving, and teamwork.",
            },
            {
              title: "Any Skill Level",
              description:
                "Total beginner? That's fine. We'll help you get started. Experienced? Help lead a project.",
            },
            {
              title: "Student-Led",
              description:
                "ATC is built and run by students. Your ideas shape what we work on.",
            },
            {
              title: "Portfolio Material",
              description:
                "Everything you build here is real work you can show on college apps, resumes, and GitHub.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="border-t border-zinc-800 px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">Ready?</h2>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">
          Show up to our next meeting or reach out to a current member. That&apos;s it.
        </p>
        <div className="mt-6">
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </section>
    </>
  );
}

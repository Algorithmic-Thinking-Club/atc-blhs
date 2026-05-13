import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Join",
};

export default function JoinPage() {
  return (
    <>
      <div className="relative flex flex-col lg:flex-row lg:min-h-[70vh]">
        {/* text side */}
        <div className="flex-1 px-6 py-16 sm:px-12 sm:py-20 lg:flex lg:items-center">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Join ATC</h2>
            <p className="mt-2 text-zinc-400">No experience required.</p>
            <div className="mt-8">
              <p className="text-zinc-300 leading-relaxed">
                ATC is the Algorithmic Thinking Club at Bonney Lake High School.
                We build software, compete in programming competitions, and work on
                projects together.
              </p>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                You don&apos;t need any coding experience to join. We&apos;ll help you
                get started. If you already know how to code, even better.
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Ready?</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Fill out the form and show up to a meeting.
              </p>
              <div className="mt-4 flex gap-4">
                <Button href="https://docs.google.com/forms/d/1wPuw8keLqSHSA38l9J5ISKGpPCaf5OhQ2yovKxT9yYs" external>
                  Sign Up
                </Button>
                <Button href="/" variant="secondary">
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* image side */}
        <div className="relative h-72 lg:h-auto lg:flex-1">
          <Image
            src="/club-booth.jpg"
            alt="ATC booth at BLHS club fair"
            fill
            className="object-cover opacity-40 lg:opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent lg:hidden" />
        </div>
      </div>

      <Section>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

    </>
  );
}

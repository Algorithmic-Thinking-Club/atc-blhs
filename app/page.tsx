import Image from "next/image";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { competitions } from "@/data/competitions";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <Image src="/logo.png" alt="ATC Logo" width={96} height={96} className="mb-6" />
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500">
          Bonney Lake High School
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          Algorithmic Thinking Club
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          The CS club at BLHS. We build software, compete in programming
          competitions, and work on real projects together.
        </p>
        <div className="mt-8 flex gap-4">
          <Button href="/join">Join ATC</Button>
          <Button href="/projects" variant="secondary">
            See Our Work
          </Button>
        </div>
      </section>

      {/* achievements */}
      <Section title="What We've Done">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { stat: "WiseGraph", label: "Built for a BLHS Staff" },
            { stat: "Podium Sweep", label: "SkillsUSA Regionals" },
            { stat: "Nationals", label: "Qualified, Atlanta 2026" },
          ].map((item) => (
            <Card key={item.label}>
              <p className="text-2xl font-bold">{item.stat}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.label}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* competitions */}
      <Section
        title="Competitions"
        subtitle="We compete in programming competitions across Washington state."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.slice(0, 3).map((comp) => (
            <Card key={comp.title}>
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                {comp.result}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{comp.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{comp.event}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Button href="/competitions" variant="secondary">
            All Competitions
          </Button>
        </div>
      </Section>

      {/* projects */}
      <Section
        title="Projects"
        subtitle="What we've been working on."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <Card key={project.title}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    project.status === "active"
                      ? "bg-green-500"
                      : project.status === "paused"
                        ? "bg-yellow-500"
                        : "bg-zinc-500"
                  }`}
                />
                <span className="text-xs capitalize text-zinc-500">
                  {project.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">
                {project.description}
              </p>
              {project.tech && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Button href="/projects" variant="secondary">
            All Projects
          </Button>
        </div>
      </Section>

      {/* join cta */}
      <section className="border-t border-zinc-800 px-6 py-20 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Want to build with us?</h2>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">
          ATC is open to all skill levels. No experience required.
        </p>
        <div className="mt-8">
          <Button href="/join">Join ATC</Button>
        </div>
      </section>
    </>
  );
}

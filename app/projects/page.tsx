import type { Metadata } from "next";
import Section from "@/components/Section";
import Card from "@/components/Card";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <Section
      title="Projects"
      subtitle="What we're building and what's next."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col">
            {project.image && (
              <div className="mb-4 aspect-video rounded bg-zinc-800" />
            )}
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
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {project.description}
            </p>
            {project.tech && (
              <div className="mt-4 flex flex-wrap gap-2">
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
    </Section>
  );
}

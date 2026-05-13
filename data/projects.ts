export type Project = {
  title: string;
  status: "active" | "paused" | "planned";
  description: string;
  tech?: string[];
  image?: string;
};

export const projects: Project[] = [
  {
    title: "ATC Club Website",
    status: "active",
    description:
      "The official ATC website. Built by club members to showcase the club and recruit new members.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Adventure Game",
    status: "paused",
    description:
      "A text-based adventure game started earlier in the year. Currently paused, may be picked back up later.",
    tech: ["Python"],
  },
];

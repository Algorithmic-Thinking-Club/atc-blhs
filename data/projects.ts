export type Project = {
  title: string;
  status: "active" | "paused" | "planned";
  description: string;
  tech?: string[];
  link?: string;
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
    title: "WiseGraph",
    link: "https://wisegraph.vercel.app",
    status: "active",
    description:
      "A data visualization tool built for a BLHS student support specialist : David Wiseman. Tracks student progress across terms with 4 dashboard views, 3 chart types, and multi-term comparison. Used internally to support parent-facing discussions.",
    tech: ["TypeScript", "React", "Recharts"],
  },
  {
    title: "Adventure Game",
    status: "planned",
    description:
      "A collaborative BLHS school-life game. The core framework is built over summer 2026, and ATC members build individual modules and minigames during the school year as plugins. Meant to be a fun onboarding project for new students and a long-term club effort.",
    tech: ["TypeScript"],
  },
];

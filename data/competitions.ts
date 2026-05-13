export type Competition = {
  title: string;
  event: string;
  date: string;
  result: string;
  description: string;
  image?: string;
};

export const competitions: Competition[] = [
  {
    title: "SkillsUSA Regionals",
    event: "Computer Programming",
    date: "2026",
    result: "Podium Sweep (1st, 2nd, 3rd)",
    description:
      "ATC took 1st, 2nd, and 3rd at SkillsUSA regionals in Computer Programming. All three qualified for state.",
  },
  {
    title: "SkillsUSA State",
    event: "Computer Programming",
    date: "2026",
    result: "Gold Medal",
    description:
      "Won gold at the Washington state SkillsUSA competition. Qualified for nationals.",
  },
  {
    title: "SkillsUSA Nationals",
    event: "Computer Programming",
    date: "2026",
    result: "Qualified",
    description:
      "Representing Washington state at the national SkillsUSA competition in Atlanta.",
  },
];

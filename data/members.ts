export type Member = {
  name: string;
  role: string;
  grade?: string;
  hobby?: string;
  bio?: string;
  wants?: string;
  image?: string;
};

export const members: Member[] = [
  {
    name: "Ashwath Polali",
    role: "President & Founder",
    grade: "Sophomore",
    hobby: "Instruments, robotics, composing music",
    bio: "Founded ATC in 2025 to build a real project-focused CS club at BLHS.",
  },
  {
    name: "Gavin Krawitz",
    role: "Vice President & Co-Founder",
    grade: "Senior",
    bio: "Co-founded ATC and helped establish the club's early direction. Graduating 2026.",
  },
  {
    name: "Noah Carter",
    role: "Member",
    grade: "Sophomore",
    hobby: "Cross Country",
    bio: "A legendary warrior from an era long past, risen once more to wage a war of honour and tragedy against his mortal enemy: The CollegeBoard.",
    wants: "A small language model",
  },
  {
    name: "Grayson Magner",
    role: "Member",
    grade: "Sophomore",
    hobby: "Studying Geopolitics, Investing, Baseball",
    bio: "Howdy folks, I don't code, but I do enjoy designing, writing, and drawing.",
    wants: "A text adventure program accessible to all that combines adventures created by both ATC, as well as the general public.",
  },
  {
    name: "Jacob Hansen",
    role: "Member",
    grade: "Senior",
    hobby: "Reading",
    bio: "Long-time ATC and former Panther Robotics member.",
    wants: "Connect 4",
  },
];

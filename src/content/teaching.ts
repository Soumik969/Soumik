/** Mentorship and positions of responsibility, from the CV. */

export type TeachingRole = {
  role: string;
  course: string;
  dates: string;
  text: string;
};

export const teaching: TeachingRole[] = [
  {
    role: "Teaching Assistant",
    course: "Introduction to Quantum Mechanics",
    dates: "Jan 2026 – Present",
    text: "Teaching and solving tutorials for 30 undergraduates.",
  },
  {
    role: "Teaching Assistant",
    course: "Electronics Lab",
    dates: "Aug 2025 – Nov 2025",
    text: "Assisted over 60 Masters students in their foundational electronics laboratory.",
  },
  {
    role: "Mentor",
    course: "Introduction to Quantum Computing",
    dates: "May 2025 – Jul 2025",
    text: "Mentored 13 students for 6 weeks during SOC on quantum information and computing.",
  },
];

/**
 * Single source of truth for personal facts. Every value here comes from the CV
 * (public/cv/Soumik_Sahoo_CV.pdf). Update this file when the CV changes.
 */

export const profile = {
  firstName: "Soumik",
  lastName: "Sahoo",
  name: "Soumik Sahoo",
  tagline: "B.Tech in Engineering Physics · IIT Bombay",
  institute: "Indian Institute of Technology Bombay",
  instituteUrl: "https://www.iitb.ac.in/",
  /** Drop a square photo at public/profile.jpg and set this to "/profile.jpg". */
  photo: "/profile.jpg" as string | null,
  emails: {
    personal: "soumiksahoo000@gmail.com",
    academic: "soumik.sahoo@iitb.ac.in",
  },
  github: "https://github.com/Soumik969",
  githubHandle: "Soumik969",
  cvPath: "/cv/Soumik_Sahoo_CV.pdf",
  researchInterests:
    "My research interests lie in experimental quantum devices and quantum transport, particularly semiconductor spin qubits, charge sensing, cryogenic RF reflectometry, and coherent control. I am also interested in non-Hermitian and topological quantum systems, and in combining low-temperature measurements with analytical and numerical modeling for scalable quantum technologies.",
};

/** Dated highlights for the About page, taken from CV entries. */
export const news: { date: string; text: string; href?: string }[] = [
  {
    date: "Summer 2026",
    text: "Began a research internship with Prof. Thomas Schmidt at the University of Luxembourg on induced superconductivity in magnetic topological-insulator thin films. Manuscript in preparation.",
    href: "/projects/mti-superconductivity/",
  },
  {
    date: "Jan 2026",
    text: "Started working on non-Hermitian topological systems with Prof. Lee Ching Hua (National University of Singapore), and became a Teaching Assistant for Introduction to Quantum Mechanics.",
    href: "/projects/non-hermitian-topology/",
  },
  {
    date: "Aug 2025",
    text: "Started low-temperature qubit characterization of semiconductor quantum dots with Prof. Suddhasatta Mahapatra and Prof. Uditendu Mukhopadhyay at IIT Bombay.",
    href: "/projects/quantum-dots/",
  },
];

export type EducationRow = {
  degree: string;
  board: string;
  institute: string;
  year: string;
  score: string;
};

export const education: EducationRow[] = [
  {
    degree: "B.Tech in Engineering Physics",
    board: "IIT Bombay",
    institute: "IIT Bombay",
    year: "2023 – 2027",
    score: "9.28 / 10",
  },
  {
    degree: "Higher Secondary (+2)",
    board: "CHSE, Odisha",
    institute: "Saraswati Vidya Mandir, Neelakanthanagar",
    year: "2022",
    score: "89.66%",
  },
  {
    degree: "Secondary (10th)",
    board: "BSE, Odisha",
    institute: "Saraswati Vidya Mandir, Singhpur",
    year: "2020",
    score: "93.5%",
  },
];

export const programmes = ["Pursuing an Honors degree in the Department of Physics, IIT Bombay"];

export const achievements = [
  { text: "Secured 98.2 percentile out of 0.2 million candidates in the Joint Entrance Examination Advanced.", year: "2023" },
  { text: "Achieved 99.87 percentile out of 1.2 million candidates in the Joint Entrance Examination Main.", year: "2023" },
];

export const extracurricular = [
  { text: "Secured top honors in district-level Vedic mathematics competitions twice.", year: "2020 – 21" },
  { text: "Devoted 80+ hours to NSS Green Campus through planting activities on campus.", year: "2023 – 24" },
];

export const coursework: { area: string; courses: string[] }[] = [
  {
    area: "Physics",
    courses: [
      "Analog and Digital Electronics",
      "Quantum Mechanics I & II",
      "Statistical Mechanics",
      "Electromagnetic Theory",
      "Quantum Information and Computing",
      "Condensed Matter Physics",
      "Magnetism and Superconductivity",
      "Computational Many-Body Physics",
    ],
  },
  {
    area: "Mathematics",
    courses: ["Calculus", "Linear Algebra", "Differential Equations", "Complex Analysis", "Integral Transforms"],
  },
];

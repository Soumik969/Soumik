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
  /** Portrait photo (3:4) at public/profile.jpg; set to null to show initials instead. */
  photo: "/profile.jpg" as string | null,
  emails: {
    personal: "soumiksahoo000@gmail.com",
    academic: "soumik.sahoo@iitb.ac.in",
  },
  github: "https://github.com/Soumik969",
  githubHandle: "Soumik969",
  cvPath: `/cv/Soumik_Sahoo_CV.pdf?v=${process.env.NEXT_PUBLIC_CV_VERSION ?? "1"}`,
  /** The same CV on Google Drive, for viewing in the browser. */
  cvDriveUrl: "https://drive.google.com/file/d/1LyYZcXINcXbTO0qs_Vzu4Grk-0KLugvQ/view?usp=sharing",
  researchInterests:
    "My research interests center on semiconductor spin qubits and superconducting qubits, particularly their design, control, readout, and coherence. I am interested in experimental quantum-device physics and in understanding how device materials and architecture shape qubit performance and scalability. I am particularly interested in how experimental characterization can inform improvements in qubit fidelity and reliable operation.",
};

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
    score: "9.17 / 10",
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

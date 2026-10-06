/**
 * Single source of truth for personal facts. Every value here comes from the CV
 * (public/cv/Soumik_Sahoo_CV.pdf). Update this file when the CV changes.
 */

export const profile = {
  name: "Soumik Sahoo",
  handle: "SOUMIK969",
  degree: "B.Tech in Engineering Physics",
  institute: "Indian Institute of Technology Bombay",
  instituteShort: "IIT Bombay",
  location: "Mumbai / India",
  coordinates: "19.13°N 72.91°E",
  cpi: "9.28",
  cpiScale: "10",
  emails: {
    personal: "soumiksahoo000@gmail.com",
    academic: "soumik.sahoo@iitb.ac.in",
  },
  github: "https://github.com/Soumik969",
  githubLabel: "github.com/Soumik969",
  cvPath: "/cv/Soumik_Sahoo_CV.pdf",
  researchInterests:
    "My research interests lie in experimental quantum devices and quantum transport, particularly semiconductor spin qubits, charge sensing, cryogenic RF reflectometry, and coherent control. I am also interested in non-Hermitian and topological quantum systems, and in combining low-temperature measurements with analytical and numerical modeling for scalable quantum technologies.",
} as const;

export const currentFocus = [
  {
    channel: "CH1",
    label: "Qubit characterization of semiconductor quantum dots",
    where: "IIT Bombay",
    anchor: "r-quantum-dots",
  },
  {
    channel: "CH2",
    label: "Non-Hermitian topological systems",
    where: "NUS",
    anchor: "r-non-hermitian",
  },
  {
    channel: "CH3",
    label: "Induced superconductivity in MTI thin films",
    where: "Uni. Luxembourg",
    anchor: "r-mti",
  },
] as const;

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
    score: "9.28 / 10 CPI",
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

export const programmes = [
  { label: "Honors", detail: "Department of Physics, IIT Bombay" },
  {
    label: "Minor",
    detail: "Centre for Machine Intelligence and Data Science, IIT Bombay",
  },
] as const;

export const achievements = [
  {
    value: "98.2",
    unit: "percentile",
    label: "JEE Advanced",
    detail: "out of 0.2 million candidates",
    year: "2023",
  },
  {
    value: "99.87",
    unit: "percentile",
    label: "JEE Main",
    detail: "out of 1.2 million candidates",
    year: "2023",
  },
] as const;

export const extracurricular = [
  {
    domain: "Science exhibition",
    text: "Secured top honors in district-level Vedic mathematics competitions, twice.",
    year: "2020 – 21",
  },
  {
    domain: "Social",
    text: "Devoted 80+ hours to NSS Green Campus through planting activities on campus.",
    year: "2023 – 24",
  },
] as const;

export const coursework = {
  Physics: [
    "Analog and Digital Electronics",
    "Quantum Mechanics I & II",
    "Statistical Mechanics",
    "Electromagnetic Theory",
    "Quantum Information and Computing",
    "Condensed Matter Physics",
    "Magnetism and Superconductivity",
    "Computational Many-Body Physics",
  ],
  Mathematics: ["Calculus", "Linear Algebra", "Differential Equations", "Complex Analysis", "Integral Transforms"],
} as const;

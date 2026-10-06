/** Research trajectory, assembled from dated CV entries. */

export type Lane = "experiment" | "theory" | "computation" | "teaching";

export type TimelineEntry = {
  when: string;
  title: string;
  detail: string;
  lanes: Lane[];
  milestone?: boolean;
  href?: string;
};

export type TimelineYear = {
  year: string;
  theme: string;
  entries: TimelineEntry[];
};

export const lanes: { id: Lane; label: string; short: string }[] = [
  { id: "experiment", label: "Experiment", short: "EXP" },
  { id: "theory", label: "Theory", short: "THY" },
  { id: "computation", label: "Computation", short: "CMP" },
  { id: "teaching", label: "Teaching", short: "TCH" },
];

export const timeline: TimelineYear[] = [
  {
    year: "2023",
    theme: "Initial state",
    entries: [
      {
        when: "2023",
        title: "IIT Bombay — B.Tech in Engineering Physics",
        detail:
          "Entered through JEE Advanced 2023 (98.2 percentile) and JEE Main 2023 (99.87 percentile). Now pursuing Honors in Physics and a Minor in Machine Intelligence & Data Science.",
        lanes: [],
        milestone: true,
        href: "#record",
      },
    ],
  },
  {
    year: "2024",
    theme: "Computation + nonlinear physics",
    entries: [
      {
        when: "Aug – Dec ’24",
        title: "Chaotic Duffing oscillator",
        detail: "Periodic, bifurcating and chaotic regimes; phase portraits and Poincaré sections (PH 567).",
        lanes: ["theory", "computation"],
        href: "#c-duffing",
      },
      {
        when: "Aug – Dec ’24",
        title: "Physics-informed neural networks",
        detail: "PINNs trained on Schrödinger datasets for harmonic-oscillator wavefunctions (PH 227).",
        lanes: ["computation"],
        href: "#c-pinn",
      },
      {
        when: "Aug – Dec ’24",
        title: "Voice and song recognition",
        detail: "MFCC features and SVM / KNN / random-forest benchmarks (DS 203).",
        lanes: ["computation"],
        href: "#c-voice",
      },
      {
        when: "Dec ’24 – Jan ’25",
        title: "Non-equilibrium Green’s functions",
        detail: "NEGF transport code with a self-consistent field loop.",
        lanes: ["computation", "theory"],
        href: "#r-negf",
      },
    ],
  },
  {
    year: "2025",
    theme: "Transport → quantum information → the lab",
    entries: [
      {
        when: "Jan – Apr ’25",
        title: "Electronic transport and scattering",
        detail: "Boltzmann transport, electron–phonon and Umklapp scattering with Prof. Soumya Bera.",
        lanes: ["theory"],
        href: "#r-transport",
      },
      {
        when: "Jan – Apr ’25",
        title: "Orbital dynamics on an Arduino TFT",
        detail: "Binary-star and satellite–planet orbits, validated below 0.02% error (PH 222).",
        lanes: ["computation", "experiment"],
        href: "#c-orbital",
      },
      {
        when: "May – Jul ’25",
        title: "Mentor — Introduction to Quantum Computing",
        detail: "Mentored 13 students for 6 weeks during SOC on quantum information and computing.",
        lanes: ["teaching"],
        href: "#teaching",
      },
      {
        when: "Aug ’25 →",
        title: "Into the cryostat: quantum-dot qubits",
        detail: "GaAs and Si quantum dots, RF reflectometry and dilution-refrigerator measurements.",
        lanes: ["experiment"],
        milestone: true,
        href: "#r-quantum-dots",
      },
      {
        when: "Aug ’25 →",
        title: "Free fermions in disguise",
        detail: "Spin ↔ Majorana mappings and fermionization with Prof. Sumiran Pujari.",
        lanes: ["theory", "computation"],
        href: "#r-free-fermions",
      },
      {
        when: "Aug – Nov ’25",
        title: "Klein tunnelling · orbital Hall effect · electronics lab TA",
        detail: "Course projects in PH 436 and PH 557; teaching assistant for 60+ Masters students.",
        lanes: ["theory", "teaching"],
        href: "#theory",
      },
    ],
  },
  {
    year: "2026",
    theme: "Devices, topology, superconductivity",
    entries: [
      {
        when: "Jan ’26 →",
        title: "Non-Hermitian topological systems",
        detail: "Skin effect and bosonic caging with Prof. Lee Ching Hua, NUS.",
        lanes: ["theory", "computation"],
        href: "#r-non-hermitian",
      },
      {
        when: "Jan ’26 →",
        title: "TA — Introduction to Quantum Mechanics",
        detail: "Teaching tutorials for 30 undergraduates.",
        lanes: ["teaching"],
        href: "#teaching",
      },
      {
        when: "Summer ’26 →",
        title: "Proximity superconductivity in MTI films",
        detail: "Research internship with Prof. Thomas Schmidt, University of Luxembourg. Manuscript in preparation.",
        lanes: ["theory"],
        milestone: true,
        href: "#r-mti",
      },
      {
        when: "Aug ’26 →",
        title: "Spectra of Kitaev chains",
        detail: "True vs. false Poor Man’s Majorana modes (PH 554).",
        lanes: ["theory", "computation"],
        href: "#c-kitaev",
      },
    ],
  },
  {
    year: "2027",
    theme: "Next state",
    entries: [
      {
        when: "2027",
        title: "B.Tech completion (expected)",
        detail: "Engineering Physics, IIT Bombay — class of 2023–2027.",
        lanes: [],
        milestone: true,
      },
    ],
  },
];

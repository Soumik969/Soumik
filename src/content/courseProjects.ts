/** Course projects ("Theoretical Lab"), from the CV. */

export type CourseProject = {
  id: string;
  title: string;
  course: string;
  professor: string;
  department: string;
  dates: string;
  summary: string;
  tags: string[];
  visual: "kitaev" | "klein" | "orbitalHall" | "binary" | "duffing" | "pinn" | "mfcc";
  link?: { label: string; href: string };
};

export const courseProjects: CourseProject[] = [
  {
    id: "c-kitaev",
    title: "Spectra of Kitaev Chains",
    course: "PH 554",
    professor: "Prof. Soumya Bera",
    department: "Department of Physics, IIT Bombay",
    dates: "Aug ’26 – Present",
    summary:
      "Kitaev chains in the many-body Fock basis and the BdG Nambu basis; Zeeman-dependent spectra, topological invariants and finite-size scaling to tell true from false Poor Man’s Majorana modes.",
    tags: ["Kitaev chain", "BdG / Nambu", "Fock basis", "Poor Man’s Majoranas", "finite-size scaling"],
    visual: "kitaev",
    link: {
      label: "Presentation",
      href: "https://drive.google.com/file/d/1F2xGaOUyQ5_-gXMDi-_sxuzO7E8MRqYQ/view?usp=sharing",
    },
  },
  {
    id: "c-klein",
    title: "Chiral Tunnelling and the Klein Paradox in Graphene",
    course: "PH 436",
    professor: "Prof. Hridish Pal",
    department: "Department of Physics, IIT Bombay",
    dates: "Aug ’25 – Nov ’25",
    summary:
      "Relativistic reflection and transmission across electrostatic barriers; graphene’s tight-binding and Bloch Hamiltonians near the Dirac points, pseudospin conservation and anti-Klein reflection in bilayers.",
    tags: ["Dirac points", "pseudospin", "Klein tunnelling", "chirality", "bilayer graphene"],
    visual: "klein",
    link: {
      label: "Presentation",
      href: "https://drive.google.com/file/d/1036URxQshrjSexFFmPG0Fmv0usoAeZCk/view?usp=sharing",
    },
  },
  {
    id: "c-ohe",
    title: "Orbital Hall Effect",
    course: "PH 557",
    professor: "Prof. Sayantika Bhowal",
    department: "Department of Physics, IIT Bombay",
    dates: "Aug ’25 – Nov ’25",
    summary:
      "Quantum, spin and orbital Hall effects compared through topology and symmetry; orbital-texture-driven transport and charge–orbital conversion without net spin polarization.",
    tags: ["orbital Hall", "spin Hall", "orbital texture", "orbitronics"],
    visual: "orbitalHall",
    link: {
      label: "Presentation",
      href: "https://drive.google.com/file/d/1spXh4TjuaoIHnCPv_p0ujqdGX235sSTH/view?usp=sharing",
    },
  },
  {
    id: "c-orbital",
    title: "Orbital Dynamics of Similar and Dissimilar Objects",
    course: "PH 222",
    professor: "Prof. Pradeep Sarin",
    department: "Department of Physics, IIT Bombay",
    dates: "Jan ’25 – Apr ’25",
    summary:
      "An Arduino Mega–TFT interface simulating binary-star and satellite–planet orbits, validated against analytical trajectories, energies and periods to below 0.02% error.",
    tags: ["Arduino Mega", "TFT display", "two-body problem", "numerical integration"],
    visual: "binary",
  },
  {
    id: "c-duffing",
    title: "Nonlinear Dynamics of the Chaotic Duffing Oscillator",
    course: "PH 567",
    professor: "Prof. Punit Paramananda",
    department: "Department of Physics, IIT Bombay",
    dates: "Aug ’24 – Dec ’24",
    summary:
      "Driven Duffing dynamics across periodic, bifurcating and chaotic regimes: fixed-point linearization, time series, phase portraits, Poincaré sections and an analog circuit.",
    tags: ["nonlinear dynamics", "chaos", "phase portraits", "Poincaré sections", "analog circuit"],
    visual: "duffing",
    link: { label: "Report (PDF)", href: "/reports/duffing-oscillator.pdf" },
  },
  {
    id: "c-pinn",
    title: "Physics-Informed Quantum System Analysis",
    course: "PH 227",
    professor: "Prof. Alok Shukla & Prof. Sadhana Dash",
    department: "Department of Physics, IIT Bombay",
    dates: "Aug ’24 – Dec ’24",
    summary:
      "Generated Schrödinger datasets and trained PINNs to predict quantum harmonic-oscillator wavefunctions — MSE 0.00077, against 0.01295 (random forest) and 0.03213 (XGBoost) on identical data.",
    tags: ["PINNs", "Schrödinger equation", "harmonic oscillator", "random forest", "XGBoost"],
    visual: "pinn",
    link: { label: "Report (PDF)", href: "/reports/pinns-quantum.pdf" },
  },
  {
    id: "c-voice",
    title: "Voice and Song Recognition",
    course: "DS 203",
    professor: "Prof. Vinay Kulkarni",
    department: "C-MInDS, IIT Bombay",
    dates: "Aug ’24 – Dec ’24",
    summary:
      "MFCC features from 100+ vocal clips to identify singers, songs and musical styles; SVM, KNN and random-forest classifiers benchmarked for multiclass recognition.",
    tags: ["MFCC", "SVM", "KNN", "random forest", "multiclass"],
    visual: "mfcc",
  },
];

/** MSE values reported in the CV for the PINN project (lower is better). */
export const pinnBenchmark = [
  { model: "PINN", mse: 0.00077 },
  { model: "Random forest", mse: 0.01295 },
  { model: "XGBoost", mse: 0.03213 },
] as const;

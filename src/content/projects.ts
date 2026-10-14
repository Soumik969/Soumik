/**
 * Research and course projects, from the "Key Projects" and "Course Projects"
 * sections of the CV. Bullets are lightly edited for the web; their factual
 * content is unchanged.
 */

export type ProjectCategory = "Research" | "Course Projects";

export type Project = {
  slug: string;
  category: ProjectCategory;
  title: string;
  /** One-line summary shown on cards and under the page title. */
  summary: string;
  dates: string;
  ongoing: boolean;
  people: string[];
  /** e.g. "Research internship" or a course code. */
  kind?: string;
  institution: string;
  note?: string;
  details: string[];
  keywords: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  // ───────────── Research ─────────────
  {
    slug: "quantum-dots",
    category: "Research",
    title: "Low-Temperature Qubit Characterization of Semiconductor Quantum Dots",
    summary:
      "Tuning GaAs and silicon quantum dots into few-electron regimes, RF-reflectometry charge readout, and pulse protocols for spin relaxation at millikelvin temperatures.",
    dates: "Aug 2025 – Present",
    ongoing: true,
    people: ["Prof. Suddhasatta Mahapatra", "Prof. Uditendu Mukhopadhyay"],
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Performed systematic tuning and electrostatic characterization of GaAs and silicon quantum-dot devices, optimizing gate-voltage configurations to reach the stable few-electron regimes essential for qubit operation.",
      "Implemented RF reflectometry measurement setups using vector network analyzers and lock-in amplifiers for high-sensitivity dispersive readout of quantum-dot charge states, enabling real-time detection of charge transitions.",
      "Developing pulse sequences on an arbitrary waveform generator for 3-level pulsing protocols to probe the spin relaxation time (T₁) in silicon quantum dots, contributing to benchmarking of qubit coherence properties.",
      "Operated a Bluefors dilution refrigerator for sample loading, wiring and cooldown, achieving stable millikelvin-regime measurements of GaAs and silicon quantum-dot devices.",
    ],
    keywords: ["quantum dots", "RF reflectometry", "charge sensing", "spin relaxation", "dilution refrigerator"],
  },
  {
    slug: "mti-superconductivity",
    category: "Research",
    title: "Induced Superconductivity in Magnetic Topological-Insulator Thin Films",
    summary: "A Green’s-function theory of the proximity effect in magnetic topological-insulator thin films coupled to a conventional s-wave superconductor.",
    dates: "Summer 2026 – Present",
    ongoing: true,
    people: ["Prof. Thomas Schmidt"],
    kind: "Research internship",
    institution: "Department of Physics and Materials Science, University of Luxembourg",
    note: "Manuscript in preparation",
    details: [
      "Developed a Green’s-function theory for proximity-induced superconductivity in MTI thin films coupled to a conventional s-wave superconductor, deriving normal and anomalous propagators through fourth order in interface tunneling.",
      "Proved the vanishing of odd perturbative orders through fermion-parity selection, and reduced the connected fourth-order Wick contractions into normal-scattering and Andreev-conversion topologies.",
      "Evaluated the superconducting kernels analytically through k_z contour integration and resummed all even tunneling orders with the Dyson equation, obtaining a frequency-dependent 8 × 8 BdG effective Hamiltonian and its pole equation.",
      "Identified rank-one orbital-selective pairing in the symmetric–antisymmetric basis, and implemented a four-momentum Pfaffian-sign diagnostic for Chern-parity changes in a 50-layer MTI slab.",
    ],
    keywords: ["Green’s functions", "proximity effect", "topological insulators", "BdG Hamiltonian", "Chern parity"],
  },
  {
    slug: "non-hermitian-topology",
    category: "Research",
    title: "Non-Hermitian Topological Systems",
    summary: "Bosonic caging under the non-Hermitian skin effect, extended to 2D lattices and the algebraic skin effect.",
    dates: "Jan 2026 – Present",
    ongoing: true,
    people: ["Prof. Lee Ching Hua"],
    institution: "Department of Physics, National University of Singapore",
    details: [
      "Investigated bosonic system caging governed by the 1D non-Hermitian skin effect (NHSE), analyzing the macroscopic accumulation of localized eigenstates under open boundary conditions.",
      "Expanding the theoretical framework into 2D lattice models, using the algebraic skin effect to map anomalous boundary localization and multidimensional topological phenomena.",
      "Constructed and diagonalized non-reciprocal tight-binding Hamiltonians to computationally verify complex energy spectra, phase transitions and wave-packet dynamics.",
    ],
    keywords: ["non-Hermitian skin effect", "bosonic caging", "algebraic skin effect", "tight-binding models"],
    links: [{ label: "Project materials", href: "https://drive.google.com/drive/folders/1PyJeLWLa_XVr0hy7UhyRCW0L-wq_2rDL?usp=drive_link" }],
  },
  {
    slug: "free-fermions-in-disguise",
    category: "Research",
    title: "Free Fermions in Disguise",
    summary: "Emergent free-fermion behavior in interacting spin chains through Fendley’s “free fermions in disguise” framework.",
    dates: "Aug 2025 – Present",
    ongoing: true,
    people: ["Prof. Sumiran Pujari"],
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Studied emergent free-fermion behavior in interacting spin chains using Fendley’s Free Fermions in Disguise framework, and derived mappings between spin and Majorana representations in 1D quantum models.",
      "Investigated the algebraic structures and symmetries underlying fermionization, connecting Clifford algebras and non-local operators to the emergence of solvable quantum phases.",
      "Implemented numerical simulations and algebraic derivations to validate the free-fermion correspondence, visualizing energy spectra, degeneracies and topological phases arising from non-trivial fermionization.",
    ],
    keywords: ["spin chains", "Majorana fermions", "fermionization", "Clifford algebras"],
    links: [{ label: "Report", href: "https://drive.google.com/file/d/1N7tRzXa1z82nbgbG98B9QJDUtZrYIUlg/view?usp=sharing" }],
  },
  {
    slug: "electronic-transport",
    category: "Research",
    title: "Electronic Transport and Scattering in Conductors",
    summary: "Boltzmann transport, electron–phonon and electron–electron scattering, and the temperature dependence of resistivity.",
    dates: "Jan 2025 – Apr 2025",
    ongoing: false,
    people: ["Prof. Soumya Bera"],
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Analyzed scattering in conductors with the Boltzmann transport equation and the relaxation-time approximation.",
      "Explored electron–phonon and electron–electron interactions, deriving the temperature-dependent resistivity.",
      "Formulated momentum relaxation through impurity and Umklapp scattering processes.",
    ],
    keywords: ["Boltzmann equation", "electron–phonon scattering", "Umklapp scattering", "resistivity"],
  },
  {
    slug: "negf",
    category: "Research",
    title: "Non-Equilibrium Green’s Function Formalism",
    summary: "An NEGF code for coherent electron transport in nanoscale devices, with a self-consistent field loop.",
    dates: "Dec 2024 – Jan 2025",
    ongoing: false,
    people: [],
    kind: "Computational physics project",
    institution: "IIT Bombay",
    details: [
      "Implemented the NEGF formalism to model coherent electron transport in nanoscale systems, producing I–V predictions, capturing conductance-quantization effects and supporting quantum-device simulation.",
      "Integrated a self-consistent field loop, bandstructure analysis and subband modeling, visualizing density of states, local density of states, potential profiles and transmission functions.",
    ],
    keywords: ["NEGF", "quantum transport", "self-consistent field", "conductance quantization"],
    links: [{ label: "Project link", href: "https://drive.google.com/file/d/1cxeUaHOcAXiAoIf0vvqzNrwXRYYv_XZN/view?usp=sharing" }],
  },

  // ───────────── Course projects ─────────────
  {
    slug: "kitaev-chains",
    category: "Course Projects",
    title: "Spectra of Kitaev Chains",
    summary: "Kitaev chains in the Fock and BdG bases, and how to tell true from false Poor Man’s Majorana modes.",
    dates: "Aug 2026 – Present",
    ongoing: true,
    people: ["Prof. Soumya Bera"],
    kind: "PH 554",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Formulated Kitaev-chain models in the many-body Fock basis and the quadratic BdG Nambu basis, comparing Hilbert-space scaling, Hamiltonian structure and low-energy eigenspectra for finite chains.",
      "Computed Zeeman-dependent spectra, topological invariants and finite-size scaling to distinguish true and false Poor Man’s Majorana modes under homogeneous and site-dependent fields.",
    ],
    keywords: ["Kitaev chain", "Majorana modes", "BdG formalism"],
    links: [{ label: "Presentation", href: "https://drive.google.com/file/d/1F2xGaOUyQ5_-gXMDi-_sxuzO7E8MRqYQ/view?usp=sharing" }],
  },
  {
    slug: "klein-paradox-graphene",
    category: "Course Projects",
    title: "Chiral Tunnelling and the Klein Paradox in Graphene",
    summary: "Relativistic tunnelling across electrostatic barriers, pseudospin and chirality near graphene’s Dirac points.",
    dates: "Aug 2025 – Nov 2025",
    ongoing: false,
    people: ["Prof. Hridish Pal"],
    kind: "PH 436",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Derived relativistic reflection and transmission amplitudes across electrostatic barriers, applying wave-vector matching and group-velocity corrections to resolve the Klein paradox at oblique incidence.",
      "Constructed graphene’s tight-binding and Bloch Hamiltonians near the Dirac points, linking pseudospin conservation and chirality to perfect normal-incidence Klein tunnelling and anti-Klein reflection in bilayers.",
    ],
    keywords: ["graphene", "Klein tunnelling", "Dirac points", "pseudospin"],
    links: [{ label: "Presentation", href: "https://drive.google.com/file/d/1036URxQshrjSexFFmPG0Fmv0usoAeZCk/view?usp=sharing" }],
  },
  {
    slug: "orbital-hall-effect",
    category: "Course Projects",
    title: "Orbital Hall Effect",
    summary: "Quantum, spin and orbital Hall effects compared, and how orbital currents arise without net spin polarization.",
    dates: "Aug 2025 – Nov 2025",
    ongoing: false,
    people: ["Prof. Sayantika Bhowal"],
    kind: "PH 557",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Compared quantum, spin and orbital Hall effects through topology, symmetry constraints, characteristic band structures and the mechanisms generating transverse charge and angular-momentum currents.",
      "Analyzed orbital-texture-driven transport and charge–orbital conversion, explaining how orbital currents emerge without net spin polarization and motivate efficient orbitronic and spintronic device concepts.",
    ],
    keywords: ["orbital Hall effect", "spin Hall effect", "orbitronics"],
    links: [{ label: "Presentation", href: "https://drive.google.com/file/d/1spXh4TjuaoIHnCPv_p0ujqdGX235sSTH/view?usp=sharing" }],
  },
  {
    slug: "orbital-dynamics",
    category: "Course Projects",
    title: "Orbital Dynamics of Similar and Dissimilar Objects",
    summary: "An Arduino Mega–TFT simulator of binary-star and satellite–planet orbits, validated against analytical results.",
    dates: "Jan 2025 – Apr 2025",
    ongoing: false,
    people: ["Prof. Pradeep Sarin"],
    kind: "PH 222",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Built an Arduino Mega–TFT interface to simulate binary-star and satellite–planet orbital trajectories.",
      "Validated numerical trajectories, energies and periods against analytical results to below 0.02% error.",
    ],
    keywords: ["Arduino", "orbital mechanics", "numerical integration"],
  },
  {
    slug: "duffing-oscillator",
    category: "Course Projects",
    title: "Nonlinear Dynamics of the Chaotic Duffing Oscillator",
    summary: "Driven Duffing dynamics from periodic motion through bifurcations to chaos.",
    dates: "Aug 2024 – Dec 2024",
    ongoing: false,
    people: ["Prof. Punit Paramananda"],
    kind: "PH 567",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Simulated driven Duffing dynamics across periodic, bifurcating and chaotic regimes under varied forcing.",
      "Linearized fixed points and visualized time series, phase portraits, Poincaré sections and an analog circuit.",
    ],
    keywords: ["nonlinear dynamics", "chaos", "Poincaré sections"],
    links: [{ label: "Report (PDF)", href: "/reports/duffing-oscillator.pdf" }],
  },
  {
    slug: "physics-informed-quantum",
    category: "Course Projects",
    title: "Physics-Informed Quantum System Analysis",
    summary: "Physics-informed neural networks for quantum harmonic-oscillator wavefunctions.",
    dates: "Aug 2024 – Dec 2024",
    ongoing: false,
    people: ["Prof. Alok Shukla", "Prof. Sadhana Dash"],
    kind: "PH 227",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Generated Schrödinger datasets and trained PINNs to predict quantum harmonic-oscillator wavefunctions.",
      "Achieved an MSE of 0.00077, beating random forests (0.01295) and XGBoost (0.03213) on identical data.",
    ],
    keywords: ["PINNs", "machine learning", "Schrödinger equation"],
    links: [{ label: "Report (PDF)", href: "/reports/pinns-quantum.pdf" }],
  },
  {
    slug: "voice-song-recognition",
    category: "Course Projects",
    title: "Voice and Song Recognition",
    summary: "MFCC features and classical classifiers to identify singers, songs and musical styles.",
    dates: "Aug 2024 – Dec 2024",
    ongoing: false,
    people: ["Prof. Vinay Kulkarni"],
    kind: "DS 203",
    institution: "Centre for Machine Intelligence and Data Science, IIT Bombay",
    details: [
      "Extracted MFCC features from 100+ vocal clips to identify singers, songs and associated musical styles.",
      "Benchmarked SVM, KNN and random-forest classifiers for robust multiclass recognition across the dataset.",
    ],
    keywords: ["MFCC", "SVM", "KNN", "random forest"],
  },
];

export const projectCategories: ProjectCategory[] = ["Research", "Course Projects"];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * Research projects, from the "Key Projects" section of the CV.
 * Bullets are lightly edited for the web; their factual content is unchanged.
 */

export type ResearchMode = "Experiment" | "Theory" | "Computation";

export type ResearchLink = { label: string; href: string };

export type ResearchProject = {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  dates: string;
  status: "active" | "completed";
  supervisors: string[];
  role?: string;
  institution: string;
  modes: ResearchMode[];
  note?: string;
  summary: string;
  details: string[];
  keywords: string[];
  links?: ResearchLink[];
  figure: string;
};

export const researchProjects: ResearchProject[] = [
  {
    id: "r-quantum-dots",
    code: "R-01",
    title: "Low-Temperature Qubit Characterization of Semiconductor Quantum Dots",
    shortTitle: "Quantum-dot qubit characterization",
    dates: "Aug ’25 – Present",
    status: "active",
    supervisors: ["Prof. Suddhasatta Mahapatra", "Prof. Uditendu Mukhopadhyay"],
    institution: "Department of Physics, IIT Bombay",
    modes: ["Experiment"],
    summary:
      "Tuning GaAs and silicon quantum-dot devices into stable few-electron regimes, reading out charge states with RF reflectometry, and building pulse protocols to probe spin relaxation at millikelvin temperatures.",
    details: [
      "Performed systematic tuning and electrostatic characterization of GaAs and silicon quantum-dot devices, optimizing gate-voltage configurations to reach the stable few-electron regimes essential for qubit operation.",
      "Implemented RF reflectometry setups using vector network analyzers and lock-in amplifiers for high-sensitivity dispersive readout of quantum-dot charge states, enabling real-time detection of charge transitions.",
      "Developing pulse sequences on an arbitrary waveform generator for 3-level pulsing protocols to probe the spin relaxation time (T₁) in silicon quantum dots, contributing to benchmarking of qubit coherence properties.",
      "Operated a Bluefors dilution refrigerator for sample loading, wiring and cooldown, achieving stable millikelvin-regime measurements of GaAs and silicon quantum-dot devices.",
    ],
    keywords: [
      "GaAs / Si quantum dots",
      "few-electron regime",
      "RF reflectometry",
      "VNA",
      "lock-in",
      "charge sensing",
      "AWG · 3-level pulsing",
      "T₁",
      "dilution refrigerator",
      "mK",
    ],
    figure:
      "Device-scale readout chain: gates define the dot, a charge sensor converts occupation into conductance, and an RF resonator turns conductance into a reflected signal.",
  },
  {
    id: "r-mti",
    code: "R-02",
    title: "Induced Superconductivity in Magnetic Topological-Insulator Thin Films",
    shortTitle: "Proximity superconductivity in MTI films",
    dates: "Summer ’26 – Present",
    status: "active",
    supervisors: ["Prof. Thomas Schmidt"],
    role: "Research internship",
    institution: "Department of Physics and Materials Science, University of Luxembourg",
    modes: ["Theory"],
    note: "Manuscript in preparation",
    summary:
      "A Green’s-function theory of the superconducting proximity effect in magnetic topological-insulator thin films coupled to a conventional s-wave superconductor.",
    details: [
      "Developed a Green’s-function theory for proximity-induced superconductivity in MTI thin films coupled to a conventional s-wave superconductor, deriving normal and anomalous propagators through fourth order in interface tunneling.",
      "Proved the vanishing of odd perturbative orders through fermion-parity selection, and reduced the connected fourth-order Wick contractions into normal-scattering and Andreev-conversion topologies.",
      "Evaluated the superconducting kernels analytically through k_z contour integration and resummed all even tunneling orders with the Dyson equation, obtaining a frequency-dependent 8 × 8 BdG effective Hamiltonian and its pole equation.",
      "Identified rank-one orbital-selective pairing in the symmetric–antisymmetric basis, and implemented a four-momentum Pfaffian-sign diagnostic for Chern-parity changes in a 50-layer MTI slab.",
    ],
    keywords: [
      "Green’s functions",
      "proximity effect",
      "s-wave SC",
      "Wick contractions",
      "Andreev conversion",
      "k_z contours",
      "Dyson resummation",
      "8 × 8 BdG",
      "Pfaffian sign",
      "Chern parity",
    ],
    figure:
      "Conceptual stack: an s-wave superconductor tunnel-coupled to a 50-layer MTI slab. Only even tunneling orders survive; their resummation yields an effective BdG Hamiltonian.",
  },
  {
    id: "r-non-hermitian",
    code: "R-03",
    title: "Non-Hermitian Topological Systems",
    shortTitle: "Non-Hermitian skin effect",
    dates: "Jan ’26 – Present",
    status: "active",
    supervisors: ["Prof. Lee Ching Hua"],
    institution: "Department of Physics, National University of Singapore",
    modes: ["Theory", "Computation"],
    summary:
      "Boundary localization in non-reciprocal lattices: bosonic caging under the 1D non-Hermitian skin effect, extended toward 2D models and the algebraic skin effect.",
    details: [
      "Investigated bosonic system caging governed by the 1D non-Hermitian skin effect (NHSE), analyzing the macroscopic accumulation of localized eigenstates under open boundary conditions.",
      "Expanding the theoretical framework into 2D lattice models, using the algebraic skin effect to map anomalous boundary localization and multidimensional topological phenomena.",
      "Constructed and diagonalized non-reciprocal tight-binding Hamiltonians to computationally verify complex energy spectra, phase transitions and wave-packet dynamics.",
    ],
    keywords: [
      "NHSE",
      "bosonic caging",
      "open vs periodic boundaries",
      "algebraic skin effect",
      "2D lattices",
      "non-reciprocal hopping",
      "complex spectra",
      "wave-packet dynamics",
    ],
    links: [
      {
        label: "Project materials",
        href: "https://drive.google.com/drive/folders/1PyJeLWLa_XVr0hy7UhyRCW0L-wq_2rDL?usp=drive_link",
      },
    ],
    figure: "Live simulation of the textbook Hatano–Nelson chain. Switch between periodic and open boundaries to watch the skin effect appear.",
  },
  {
    id: "r-free-fermions",
    code: "R-04",
    title: "Free Fermions in Disguise",
    shortTitle: "Free fermions in disguise",
    dates: "Aug ’25 – Present",
    status: "active",
    supervisors: ["Prof. Sumiran Pujari"],
    institution: "Department of Physics, IIT Bombay",
    modes: ["Theory", "Computation"],
    summary: "Emergent free-fermion behavior hidden inside interacting spin chains, studied through Fendley’s “free fermions in disguise” framework.",
    details: [
      "Studied emergent free-fermion behavior in interacting spin chains using Fendley’s Free Fermions in Disguise framework, and derived mappings between spin and Majorana representations in 1D quantum models.",
      "Investigated the algebraic structures and symmetries underlying fermionization, connecting Clifford algebras and non-local operators to the emergence of solvable quantum phases.",
      "Implemented numerical simulations and algebraic derivations to validate the free-fermion correspondence, visualizing energy spectra, degeneracies and topological phases arising from non-trivial fermionization.",
    ],
    keywords: ["spin chains", "Majorana representation", "fermionization", "Clifford algebra", "non-local operators", "exact solvability"],
    links: [
      {
        label: "Report",
        href: "https://drive.google.com/file/d/1N7tRzXa1z82nbgbG98B9QJDUtZrYIUlg/view?usp=sharing",
      },
    ],
    figure: "Schematic only: a spin chain, its Majorana representation, and the re-paired (non-local) fermionic modes.",
  },
  {
    id: "r-transport",
    code: "R-05",
    title: "Electronic Transport and Scattering in Conductors",
    shortTitle: "Transport & scattering",
    dates: "Jan ’25 – Apr ’25",
    status: "completed",
    supervisors: ["Prof. Soumya Bera"],
    institution: "Department of Physics, IIT Bombay",
    modes: ["Theory"],
    summary: "Scattering in conductors through the Boltzmann transport equation: from the relaxation-time approximation to temperature-dependent resistivity.",
    details: [
      "Analyzed scattering in conductors with the Boltzmann transport equation and the relaxation-time approximation.",
      "Explored electron–phonon and electron–electron interactions, deriving the temperature-dependent resistivity.",
      "Formulated momentum relaxation through impurity and Umklapp scattering processes.",
    ],
    keywords: ["Boltzmann equation", "relaxation time", "electron–phonon", "electron–electron", "ρ(T)", "impurity scattering", "Umklapp"],
    figure:
      "Schematic k-space: a field displaces the Fermi surface; impurity, phonon and Umklapp processes relax it. Umklapp folds k + q back by a reciprocal-lattice vector G.",
  },
  {
    id: "r-negf",
    code: "R-06",
    title: "Non-Equilibrium Green’s Function Formalism",
    shortTitle: "NEGF device simulation",
    dates: "Dec ’24 – Jan ’25",
    status: "completed",
    supervisors: [],
    role: "Computational physics project",
    institution: "IIT Bombay",
    modes: ["Computation"],
    summary: "An NEGF code for coherent electron transport in nanoscale devices, coupled to a self-consistent field loop.",
    details: [
      "Implemented the NEGF formalism to model coherent electron transport in nanoscale systems, producing I–V predictions, capturing conductance-quantization effects and supporting quantum-device simulation.",
      "Integrated a self-consistent field loop, bandstructure analysis and subband modeling, visualizing density of states, local density of states, potential profiles and transmission functions.",
    ],
    keywords: ["NEGF", "coherent transport", "I–V", "conductance quantization", "self-consistent field", "subbands", "DOS / LDOS", "transmission"],
    links: [
      {
        label: "Project link",
        href: "https://drive.google.com/file/d/1cxeUaHOcAXiAoIf0vvqzNrwXRYYv_XZN/view?usp=sharing",
      },
    ],
    figure: "Schematic Landauer picture: contacts at μ₁ and μ₂, a biased potential profile, and a step-like transmission inside the bias window.",
  },
];

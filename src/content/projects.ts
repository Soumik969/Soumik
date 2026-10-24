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
    title: "Charge Sensing and Qubit Characterization of Gate-Defined Quantum Dots",
    summary:
      "Charge sensing of gate-defined quantum dots at millikelvin temperatures: double-dot tuning, tunnel-coupling extraction, spin-relaxation pulse sequences and RF reflectometry.",
    dates: "Aug 2025 – Present",
    ongoing: true,
    people: ["Prof. Suddhasatta Mahapatra", "Prof. Uditendu Mukhopadhyay"],
    kind: "B.Tech thesis (BTP-1)",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Characterized gate-defined quantum-dot devices at millikelvin temperatures, from initial measurements to forming a single-electron transistor (SET) and observing Coulomb oscillations.",
      "Tuned neighbouring dots into a double quantum dot using SET charge sensing, mapping its charge-stability diagram and tracking charge transitions with high sensitivity.",
      "Extracted interdot tunnel couplings by fitting charge-sensor data across the interdot transition to a two-level model, a key parameter for exchange-based spin-qubit operation.",
      "Developing pulse sequences to measure the spin relaxation time (T₁), and contributing to the lab’s RF-reflectometry setup for fast, single-shot readout.",
      "Operate a dilution refrigerator, from sample loading to cooldowns, and measure with QCoDeS.",
    ],
    keywords: ["quantum dots", "charge sensing", "tunnel coupling", "spin relaxation", "RF reflectometry", "dilution refrigerator"],
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
      "Developed a Green’s-function theory of superconductivity induced in magnetic topological-insulator (MTI) thin films by an s-wave superconductor, deriving normal and anomalous propagators to fourth order in tunneling and proving that odd orders vanish by fermion parity.",
      "Evaluated kernels by k_z contour integration and resummed all even orders via the Dyson equation into a frequency-dependent 8 × 8 BdG Hamiltonian, revealing rank-one, orbital-selective pairing.",
      "Mapped the BdG Chern-number phase diagram, fixing the Chern number from Γ-point states via a rotation symmetry, and cross-checked it with Z2Pack Wilson loops and the Fukui–Hatsugai–Suzuki method.",
      "Identified the chiral topological-superconductor phase (|N| = 1, chiral Majorana edge modes).",
    ],
    keywords: ["Green’s functions", "proximity effect", "topological insulators", "BdG Hamiltonian", "Chern number", "Majorana edge modes"],
  },
  {
    slug: "non-hermitian-topology",
    category: "Research",
    title: "Interaction-Induced Caging in Non-Hermitian Lattices",
    summary:
      "Interaction-driven caging and de-caging of bosons under the non-Hermitian skin effect, from the Hatano–Nelson chain to a 2D hybrid SSH–Hatano–Nelson lattice.",
    dates: "Jan 2026 – Apr 2026",
    ongoing: false,
    people: ["Prof. Lee Ching Hua"],
    institution: "Department of Physics, National University of Singapore",
    details: [
      "Derived the generalized Brillouin zone of the Hatano–Nelson chain and its skin-mode localization length, κ = ln(t_L/t_R)/2, confirmed numerically by root-tracking of the characteristic polynomial.",
      "Built a 2D hybrid SSH–Hatano–Nelson Hamiltonian hosting a spectrally isolated corner trap, and computed the spectral winding number (W = 1) that protects the skin modes.",
      "Built the Bose–Hubbard Hamiltonian in Fock space, reproduced the non-monotonic interaction-driven caging and de-caging of bosonic clusters, and mapped the hard-core limit to a non-Hermitian XXZ chain.",
    ],
    keywords: ["non-Hermitian skin effect", "bosonic caging", "Hatano–Nelson model", "spectral winding", "Bose–Hubbard model"],
    links: [{ label: "Project materials", href: "https://drive.google.com/drive/folders/1PyJeLWLa_XVr0hy7UhyRCW0L-wq_2rDL?usp=drive_link" }],
  },
  {
    slug: "free-fermions-in-disguise",
    category: "Research",
    title: "Free Fermions in Disguise",
    summary:
      "Fendley’s spin chain of four-fermion terms that has an exact free-fermion spectrum, with its conserved charges and raising and lowering operators.",
    dates: "Aug 2025 – Dec 2025",
    ongoing: false,
    people: ["Prof. Sumiran Pujari"],
    kind: "Supervised learning project",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Analyzed Fendley’s spin chain built purely from four-fermion terms, which no Jordan–Wigner transformation reduces to bilinear form yet which has an exact free-fermion spectrum.",
      "Constructed its conserved charges, commuting transfer matrices and explicit free-fermion raising and lowering operators for the open chain, accounting for the exponential degeneracies of the spectrum.",
      "Verified the spectra numerically up to M ≈ 8 and extended the approach to the transverse-field Ising model.",
    ],
    keywords: ["spin chains", "free fermions", "transfer matrices", "transverse-field Ising model"],
    links: [{ label: "Report", href: "https://drive.google.com/file/d/1N7tRzXa1z82nbgbG98B9QJDUtZrYIUlg/view?usp=sharing" }],
  },
  {
    slug: "fqhe-perturbation",
    category: "Research",
    title: "Perturbation Theory for the Fractional Quantum Hall Effect",
    summary: "A perturbative route to the fractional quantum Hall effect from the integer state with continuously attached flux, using the plasma analogy.",
    dates: "2024 – 2025",
    ongoing: false,
    people: ["Prof. Prashant Kumar"],
    kind: "Report",
    institution: "Department of Physics, IIT Bombay",
    details: [
      "Studied a perturbative route to the FQH effect that expands about the integer state in continuously attached flux m, motivated by the universality class of the FQH–insulator transition.",
      "Derived the n-particle distribution functions of the integer state via the plasma analogy (2D one-component plasma at Γ = 2) as determinantal kernels, the inputs needed at each order.",
    ],
    keywords: ["fractional quantum Hall effect", "plasma analogy", "perturbation theory", "determinantal kernels"],
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
      "Modeled impurity and Umklapp scattering via the Boltzmann equation in the relaxation-time approximation.",
      "Derived temperature-dependent resistivity from electron–phonon and electron–electron interactions.",
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
      "Implemented the NEGF formalism to model coherent electron transport in nanoscale devices, computing I–V characteristics and reproducing conductance quantization.",
      "Coupled the NEGF solver to a self-consistent-field loop with band-structure and subband modeling, computing density of states, local density of states, potential profiles and transmission functions.",
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
    dates: "Jan 2026 – Apr 2026",
    ongoing: false,
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

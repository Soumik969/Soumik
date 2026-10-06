/**
 * Technical skills from the CV, arranged as a graph:
 * PHYSICS → {EXPERIMENT, THEORY, COMPUTATION} → TOOLS / SOFTWARE.
 * Every tool and method listed here appears in the CV.
 */

export type DomainId = "physics" | "experiment" | "theory" | "computation" | "tools";

export type ToolGroup = "language" | "library" | "instrument";

export type Tool = {
  symbol: string;
  name: string;
  group: ToolGroup;
  domains: Exclude<DomainId, "physics">[];
};

export type Domain = {
  id: DomainId;
  label: string;
  caption: string;
  methods: string[];
};

export const domains: Domain[] = [
  {
    id: "physics",
    label: "Physics",
    caption: "The common ground: every tool below exists to ask a physical question.",
    methods: ["Quantum devices", "Quantum transport", "Topology", "Superconductivity", "Non-Hermitian systems"],
  },
  {
    id: "experiment",
    label: "Experiment",
    caption: "Cryogenic measurement of semiconductor quantum dots.",
    methods: ["Gate tuning", "Charge sensing", "RF reflectometry", "3-level pulsing", "Cooldown & wiring"],
  },
  {
    id: "theory",
    label: "Theory",
    caption: "Analytical many-body and transport methods.",
    methods: ["Green’s functions", "Wick contractions", "Dyson resummation", "BdG / Nambu", "Tight-binding", "Boltzmann transport"],
  },
  {
    id: "computation",
    label: "Computation",
    caption: "Numerical models, simulations and learning.",
    methods: ["Exact diagonalization", "NEGF + SCF", "ODE integration", "PINNs", "Classical ML"],
  },
  {
    id: "tools",
    label: "Tools / Software",
    caption: "Build, document and communicate.",
    methods: ["Typesetting", "Interfaces", "3D & image work", "Circuit simulation"],
  },
];

export const tools: Tool[] = [
  { symbol: "Py", name: "Python", group: "language", domains: ["computation", "theory", "experiment"] },
  { symbol: "C++", name: "C++", group: "language", domains: ["computation"] },
  { symbol: "Jv", name: "Java", group: "language", domains: ["computation"] },
  { symbol: "Js", name: "JavaScript", group: "language", domains: ["tools"] },
  { symbol: "Ht", name: "HTML", group: "language", domains: ["tools"] },
  { symbol: "Cs", name: "CSS", group: "language", domains: ["tools"] },
  { symbol: "Bl", name: "Blender", group: "language", domains: ["tools"] },
  { symbol: "Ps", name: "Photoshop", group: "language", domains: ["tools"] },
  { symbol: "Qc", name: "QCoDeS", group: "library", domains: ["experiment"] },
  { symbol: "Sk", name: "scikit-learn", group: "library", domains: ["computation"] },
  { symbol: "Mp", name: "Matplotlib", group: "library", domains: ["computation", "theory", "experiment"] },
  { symbol: "Pd", name: "Pandas", group: "library", domains: ["computation", "experiment"] },
  { symbol: "Np", name: "NumPy", group: "library", domains: ["computation", "theory"] },
  { symbol: "Sp", name: "SciPy", group: "library", domains: ["computation", "theory"] },
  { symbol: "Sb", name: "Seaborn", group: "library", domains: ["computation"] },
  { symbol: "Pl", name: "Plotly", group: "library", domains: ["computation"] },
  { symbol: "Tf", name: "TensorFlow", group: "library", domains: ["computation"] },
  { symbol: "Ke", name: "Keras", group: "library", domains: ["computation"] },
  { symbol: "Xg", name: "XGBoost", group: "library", domains: ["computation"] },
  { symbol: "Pt", name: "PyTorch", group: "library", domains: ["computation"] },
  { symbol: "Ml", name: "MATLAB", group: "library", domains: ["computation", "theory"] },
  { symbol: "Lx", name: "LaTeX", group: "library", domains: ["theory", "tools"] },
  { symbol: "Re", name: "ReactJS", group: "library", domains: ["tools"] },
  { symbol: "Ph", name: "PHOEBE", group: "library", domains: ["computation"] },
  { symbol: "Lt", name: "LTspice", group: "library", domains: ["experiment", "tools"] },
  { symbol: "Fg", name: "Figma", group: "library", domains: ["tools"] },
  { symbol: "Aw", name: "Arbitrary waveform generator", group: "instrument", domains: ["experiment"] },
  { symbol: "Dr", name: "Dilution refrigerator", group: "instrument", domains: ["experiment"] },
  { symbol: "Os", name: "Oscilloscope", group: "instrument", domains: ["experiment"] },
  { symbol: "Vn", name: "Vector network analyzer", group: "instrument", domains: ["experiment"] },
  { symbol: "Bb", name: "Breakout box", group: "instrument", domains: ["experiment"] },
];

export const toolGroups: Record<ToolGroup, string> = {
  language: "Programming & scripting",
  library: "Libraries & software",
  instrument: "Laboratory instruments",
};

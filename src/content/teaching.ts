/** Mentorship and positions of responsibility, from the CV. */

export type TeachingRole = {
  id: string;
  role: string;
  course: string;
  dates: string;
  audience: string;
  count: string;
  text: string;
  /** Standard textbook relations written on the board; `_x` / `_{xy}` mark subscripts. */
  board: { eq: string; note: string }[];
};

export const teaching: TeachingRole[] = [
  {
    id: "t-qm",
    role: "Teaching Assistant",
    course: "Introduction to Quantum Mechanics",
    dates: "Jan ’26 – Now",
    audience: "undergraduates",
    count: "30",
    text: "Teaching and solving tutorials for 30 undergraduates.",
    board: [
      { eq: "iħ ∂ₜ|ψ⟩ = Ĥ|ψ⟩", note: "time evolution" },
      { eq: "[x̂, p̂] = iħ", note: "canonical commutator" },
    ],
  },
  {
    id: "t-elec",
    role: "Teaching Assistant",
    course: "Electronics Lab",
    dates: "Aug ’25 – Nov ’25",
    audience: "Masters students",
    count: "60+",
    text: "Assisted over 60 Masters students in their foundational electronics laboratory.",
    board: [
      { eq: "V_{out} = −(R_f / R_{in}) V_{in}", note: "inverting amplifier" },
      { eq: "f_c = 1 / 2πRC", note: "RC cutoff" },
    ],
  },
  {
    id: "t-qc",
    role: "Mentor",
    course: "Introduction to Quantum Computing",
    dates: "May ’25 – Jul ’25",
    audience: "students · 6 weeks",
    count: "13",
    text: "Mentored 13 students for 6 weeks during SOC on quantum information and computing.",
    board: [
      { eq: "|ψ⟩ = α|0⟩ + β|1⟩", note: "qubit state" },
      { eq: "H|0⟩ = (|0⟩ + |1⟩) / √2", note: "Hadamard gate" },
    ],
  },
];

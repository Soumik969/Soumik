/**
 * "Inside the lab": the measurement architecture used for quantum-dot work.
 * Descriptions state what each element does in general terms, plus what the CV
 * says was done with it. No instrument specifications are given on purpose.
 */

export type LabNodeId = "awg" | "dc" | "vna" | "lockin" | "scope" | "fridge" | "device" | "sensor" | "resonator" | "data";

export type LabNode = {
  id: LabNodeId;
  label: string;
  tag: string;
  path: "control" | "readout" | "both";
  role: string;
  practice?: string;
};

export const labNodes: Record<LabNodeId, LabNode> = {
  awg: {
    id: "awg",
    label: "Arbitrary waveform generator",
    tag: "PULSES",
    path: "control",
    role: "Synthesizes fast voltage pulses that are added to the gate voltages.",
    practice: "Developing 3-level pulse sequences to probe the spin relaxation time T₁ in silicon quantum dots.",
  },
  dc: {
    id: "dc",
    label: "DC sources · breakout box",
    tag: "GATE CONTROL",
    path: "control",
    role: "Static gate voltages, routed line-by-line to the device through a breakout box.",
    practice: "Systematic gate tuning of GaAs and Si devices into stable few-electron regimes.",
  },
  vna: {
    id: "vna",
    label: "Vector network analyzer",
    tag: "RF REFLECTOMETRY",
    path: "readout",
    role: "Sends an RF tone to the resonator and measures the amplitude and phase of the reflected signal.",
    practice: "Implemented RF reflectometry setups for dispersive readout of charge states.",
  },
  lockin: {
    id: "lockin",
    label: "Lock-in amplifier",
    tag: "DEMODULATION",
    path: "readout",
    role: "Demodulates the reflected signal to extract a small response buried in noise.",
    practice: "Used alongside the VNA for high-sensitivity, real-time detection of charge transitions.",
  },
  scope: {
    id: "scope",
    label: "Oscilloscope",
    tag: "TIME DOMAIN",
    path: "both",
    role: "Time-domain view of pulses and readout signals.",
  },
  fridge: {
    id: "fridge",
    label: "Dilution refrigerator",
    tag: "T ≈ mK",
    path: "both",
    role: "Cools the sample through successive stages to the millikelvin regime, where charge and spin states are resolvable.",
    practice: "Operated a Bluefors system: sample loading, wiring and cooldown, with stable mK-regime measurements.",
  },
  device: {
    id: "device",
    label: "Quantum-dot device",
    tag: "QUANTUM DOT",
    path: "control",
    role: "Electrostatic gates confine a few electrons in a GaAs or silicon quantum dot.",
    practice: "Electrostatic characterization of GaAs and silicon quantum-dot devices.",
  },
  sensor: {
    id: "sensor",
    label: "Charge sensor",
    tag: "CHARGE READOUT",
    path: "readout",
    role: "A nearby sensing channel whose conductance shifts when an electron enters or leaves the dot.",
  },
  resonator: {
    id: "resonator",
    label: "RF resonator",
    tag: "TANK CIRCUIT",
    path: "readout",
    role: "Converts the sensor’s conductance change into a change in reflected RF amplitude and phase.",
  },
  data: {
    id: "data",
    label: "Data",
    tag: "ANALYSIS",
    path: "readout",
    role: "Charge-stability maps, time traces and relaxation measurements, analyzed in Python.",
  },
};

export const labChain: LabNodeId[] = ["fridge", "device", "sensor", "resonator", "vna", "data"];

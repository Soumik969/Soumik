/** Section registry: drives navigation, the index overlay and the depth rail. */

export type SectionMeta = {
  id: string;
  index: string;
  label: string;
  title: string;
  nav?: boolean;
};

export const sections: SectionMeta[] = [
  { id: "top", index: "··", label: "Index", title: "Soumik Sahoo" },
  { id: "about", index: "00", label: "Identity", title: "Research identity", nav: true },
  { id: "research", index: "01", label: "Research", title: "Research atlas", nav: true },
  { id: "lab", index: "02", label: "Experiment", title: "Inside the lab", nav: true },
  { id: "theory", index: "03", label: "Theory", title: "Theoretical lab", nav: true },
  { id: "toolkit", index: "04", label: "Computation", title: "Computational toolkit" },
  { id: "teaching", index: "05", label: "Teaching", title: "Teaching / mentorship" },
  { id: "timeline", index: "06", label: "Trajectory", title: "Research timeline", nav: true },
  { id: "record", index: "07", label: "Record", title: "Education & achievements" },
  { id: "contact", index: "08", label: "Contact", title: "Let’s talk physics", nav: true },
];

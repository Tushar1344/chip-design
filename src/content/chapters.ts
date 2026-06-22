import type { ComponentType } from "react";
import { Chapter01 } from "./chapters/ch01-logic-gates";
import { Chapter02 } from "./chapters/ch02-multiply-accumulate";
import { Chapter03 } from "./chapters/ch03-systolic-array";

export interface Section {
  id: string;
  label: string;
}

export interface ChapterMeta {
  /** route slug */
  slug: string;
  /** display number, e.g. "1" */
  num: string;
  part: string;
  title: string;
  /** one-line blurb for the home list */
  blurb: string;
  /** small tag shown on the home row */
  tag: string;
  /** in-page sections for the right-rail TOC (ids must match heading ids) */
  sections: Section[];
  Component: ComponentType;
}

export const chapters: ChapterMeta[] = [
  {
    slug: "logic-gates",
    num: "1",
    part: "Part I · The Atoms",
    title: "Logic Gates",
    blurb: "Transistors as switches, and the gates that turn voltage into truth.",
    tag: "foundations",
    sections: [
      { id: "switch", label: "The switch" },
      { id: "gates", label: "From switches to gates" },
      { id: "universal", label: "One gate to rule them all" },
      { id: "playground", label: "Gate playground" },
      { id: "takeaway", label: "Why this matters" },
    ],
    Component: Chapter01,
  },
  {
    slug: "multiply-accumulate",
    num: "2",
    part: "Part I · The Atoms",
    title: "The Multiply-Accumulate",
    blurb: "Adders, multipliers, and the one operation that all of AI runs on.",
    tag: "foundations",
    sections: [
      { id: "adder", label: "Adding with gates" },
      { id: "multiply", label: "Multiplying" },
      { id: "mac", label: "The MAC" },
      { id: "builder", label: "MAC builder" },
      { id: "takeaway", label: "Why this matters" },
    ],
    Component: Chapter02,
  },
  {
    slug: "systolic-array",
    num: "3",
    part: "Part II · Making It Fast",
    title: "The Systolic Array",
    blurb: "Tile thousands of MACs into a grid and pump data through like a heartbeat.",
    tag: "the payoff",
    sections: [
      { id: "problem", label: "The data-movement wall" },
      { id: "idea", label: "The systolic idea" },
      { id: "matmul", label: "Mapping matrix multiply" },
      { id: "array", label: "Array simulator" },
      { id: "takeaway", label: "Why chips look this way" },
    ],
    Component: Chapter03,
  },
];

export function chapterIndex(slug: string): number {
  return chapters.findIndex((c) => c.slug === slug);
}

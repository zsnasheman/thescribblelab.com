import type { FounderChapter } from "./types";
import { SITE } from "@/lib/site";

/** Employers are her personal professional background, never clients or endorsements. Text only, no logos. */
export const background = ["XBD Collective", "Swiss Bureau", "Ellington Properties", "RK Gulf", "Eclat Concept Design"] as const;

export const founderPreview = {
  lead: `${SITE.founder.name} founded The Scribble Lab in ${SITE.founder.established} and leads it as ${SITE.founder.role}.`,
  body: "She came to the studio through practice: interior design and fit-out, FF&E, design support and project management. That grounding is why the studio treats a drawing and a finished space as one continuous piece of work.",
};

export const founderChapters: FounderChapter[] = [
  {
    id: "person",
    title: "The person behind the studio",
    kicker: "01",
    paragraphs: [
      `${SITE.founder.name} is the founder and owner of The Scribble Lab, a Dubai-based design and build studio established in ${SITE.founder.established}. She leads it as ${SITE.founder.role}.`,
      "Her working life has been spent in interior design and fit-out. She brings that practical experience to a studio whose work now runs from interiors, retail and food and beverage spaces to exhibitions, events, pop-ups, brand activations and kinetic displays.",
    ],
    facts: [
      { label: "Role", value: SITE.founder.role },
      { label: "Studio established", value: SITE.founder.established },
      { label: "Based in", value: "Business Bay, Dubai" },
      { label: "Practice", value: "Concept-led design and build" },
    ],
    caption: "The sketch frame, with the forms to come only faintly drawn.",
  },
  {
    id: "roots",
    title: "Roots and creative perspective",
    kicker: "02",
    paragraphs: [
      "The drawing beside this chapter is an interpretation, not a biography: Kashmir-inspired forms, with tiered timber roofs, lattice screens and mountain light, flowing toward the architecture of Dubai.",
      "It stands for an idea the studio returns to often: that a good space carries memory as well as function.",
    ],
    draftNote: "Nasheman's own account of where she comes from and what shaped her eye will go here, in her words.",
    caption: "Kashmir-inspired forms: a tiered roof, a lattice screen and ridge lines.",
  },
  {
    id: "practice",
    title: "Learning through practice",
    kicker: "03",
    paragraphs: [
      "Nasheman's background is in interior design and fit-out. Her experience includes time with XBD Collective, Swiss Bureau, Ellington Properties, RK Gulf and Eclat Concept Design. These companies are part of her personal professional background. They are not clients of The Scribble Lab and do not endorse it.",
      "Across that experience she worked in FF&E, design support and project management. Each teaches something different. FF&E is the discipline of choosing and specifying furniture, fixtures and equipment, so it teaches close attention to materials and suppliers. Design support means producing and coordinating the drawings a project runs on. Project management is sequencing trades and keeping a programme honest.",
      "Together they explain the studio's habit of asking how something will be built while it is still being drawn.",
    ],
    caption: "Plans, elevations and a fit-out grid overlay the skyline.",
  },
  {
    id: "starting",
    title: "Starting The Scribble Lab",
    kicker: "04",
    paragraphs: [
      `The Scribble Lab was established in ${SITE.founder.established} as an independent design practice.`,
      "Since then it has moved toward concept-led work across interiors, retail and food and beverage, exhibitions, events, pop-ups, activations and kinetic displays.",
    ],
    draftNote: "Nasheman's account of why she started the studio, and what the first projects were like, will go here.",
    caption: "A studio table, a plan sheet and the first lines of a practice.",
  },
  {
    id: "approach",
    title: "Her approach today",
    kicker: "05",
    paragraphs: [
      "Concept development, material decisions, spatial experience and delivery are treated as one conversation rather than four hand-offs. A material is chosen with its joint in mind. A concept is tested against how it will be installed.",
      "The studio describes this as going from the first scribble to a finished space.",
    ],
    draftNote: "This chapter is editorial draft copy written from the studio's published approach. It is not a quotation, and Nasheman should review and rewrite it.",
    caption: "From elevation to material study, with each decision annotated.",
  },
  {
    id: "next",
    title: "What comes next",
    kicker: "06",
    paragraphs: [
      "The studio's ambition is international. The Brand Book sets out a vision of a design and build studio with teams on every continent by 2036.",
      "Riyadh is the nearest direction. Sydney and Germany are further-off directions. They are ambitions, not offices, and the studio does not claim completed work in any of them.",
    ],
    caption: "Faint, unlabelled forms suggest where the studio is looking.",
  },
];

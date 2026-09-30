import type { FounderChapter } from "./types";
import { SITE } from "@/lib/site";

/** Employers are her personal professional background, never clients or endorsements. Text only, no logos. */
export const background = ["XBD Collective", "Swiss Bureau", "Ellington Properties", "RK Gulf", "Eclat Concept Design"] as const;

export const founderPreview = {
  lead: `${SITE.founder.name} founded The Scribble Lab in ${SITE.founder.established} and leads it as ${SITE.founder.role}.`,
  body: "She came to the studio through practice: interior design and fit-out, FF&E, design support and project management. That grounding is why the studio treats a drawing and a finished space as one continuous piece of work.",
};

export const founderFacts = [
  { label: "Role", value: SITE.founder.role },
  { label: "Studio established", value: SITE.founder.established },
  { label: "Based in", value: "Business Bay, Dubai" },
] as const;

/** Four chapters, one illustration. Needs for the founder's own words are recorded in docs/CONTENT_CHECKLIST.md, not on the page. */
export const founderChapters: FounderChapter[] = [
  {
    id: "roots",
    title: "Roots",
    kicker: "01",
    paragraphs: [
      "The studio's visual language draws on Kashmiri craft, such as timber roofs, carved lattice screens and mountain light, and on the architecture of Dubai, the city where it works.",
      "The drawing beside this chapter is an interpretation of that conversation, not a biography. It stands for an idea the studio returns to often: a good space carries memory as well as function.",
    ],
    caption: "A tiered timber roof, a lattice screen and ridge lines.",
  },
  {
    id: "practice",
    title: "Professional practice",
    kicker: "02",
    paragraphs: [
      "Nasheman's background is in interior design and fit-out. Her experience includes time with XBD Collective, Swiss Bureau, Ellington Properties, RK Gulf and Eclat Concept Design. These companies are part of her personal professional background. They are not clients of The Scribble Lab and do not endorse it.",
      "Across that experience she worked in FF&E, design support and project management: choosing and specifying furniture, fixtures and equipment; producing and coordinating the drawings a project runs on; and sequencing trades so a programme stays honest. Together they explain the studio's habit of asking how something will be built while it is still being drawn.",
    ],
    caption: "The architectural sketch grows behind the roots: plans, grids and scaffold lines.",
  },
  {
    id: "starting",
    title: "Founding the studio",
    kicker: "03",
    paragraphs: [
      `The Scribble Lab was established in ${SITE.founder.established} as an independent design practice, and Nasheman leads it as ${SITE.founder.role}.`,
      "Since then it has moved toward concept-led work across interiors, retail and food and beverage, exhibitions, events, pop-ups, activations and kinetic displays, with concept, material decisions and delivery kept in one conversation.",
    ],
    caption: "The sketch is painted in, and a material board joins the desk.",
  },
  {
    id: "next",
    title: "Future direction",
    kicker: "04",
    paragraphs: [
      "The studio's ambition is international. The Brand Book sets out a vision of a design and build studio with teams on every continent by 2036.",
      "Riyadh is the nearest direction; Sydney and Germany are further off. They are ambitions, not offices, and the studio does not claim completed work in any of them.",
    ],
    caption: "Faint, unlabelled forms beyond the skyline: where the studio is looking.",
  },
];

import type { ProcessStage } from "./types";

export const processStages: ProcessStage[] = [
  {
    id: "listen",
    name: "Listen",
    line: "We start with your brief, your site and your people.",
    what: [
      "We read the brief and ask about who will use the space and what has to work.",
      "Where possible we visit the site and take measurements.",
      "Constraints are written down early: approvals, access, materials that must stay, and dates that cannot move.",
    ],
    clientSees: ["A short written summary of the brief, with the questions we still have."],
    decisions: ["What the project must achieve.", "What is fixed, and what is open to change."],
    fragment: "plan-interior",
  },
  {
    id: "sketch",
    name: "Sketch",
    line: "Rough lines first, because they are quick to change.",
    what: [
      "We draw plans, elevations and loose sketches to test more than one direction.",
      "Mood boards and references show the intended character of the space.",
      "Ideas are checked against how they would be built, not only how they look.",
    ],
    clientSees: ["Concept sketches and reference boards.", "Two or more directions where the brief allows."],
    decisions: ["Which direction to develop.", "What to drop."],
    fragment: "joinery-section",
  },
  {
    id: "develop",
    name: "Develop",
    line: "Materials, details and drawings that can be built.",
    what: [
      "We choose finishes against real samples and resolve the details: joints, fixings, lighting and services.",
      "Drawings are coordinated so the people building them can read them.",
      "Fabrication and installation partners are brought in where the project needs them.",
    ],
    clientSees: ["Developed drawings.", "Material and finish boards with samples."],
    decisions: ["Materials and finishes.", "Sign-off on the details before anything is fabricated."],
    fragment: "plan-stand",
  },
  {
    id: "build",
    name: "Build",
    line: "Made, finished and installed, with design and delivery kept in step.",
    what: [
      "Pieces are fabricated and finished, then checked against the drawings.",
      "Installation or fit-out is coordinated on site with the trades involved.",
      "Changes that come up are discussed, drawn and agreed rather than improvised.",
    ],
    clientSees: ["Progress updates, as agreed at the start of the project."],
    decisions: ["How any change is handled.", "Approval of work on site."],
    fragment: "kit",
  },
  {
    id: "handover",
    name: "Handover",
    line: "Finished, checked and explained.",
    what: [
      "We walk the finished space with you and record anything that needs attention.",
      "Drawings and care or operating notes are handed over where they apply.",
      "For moving work such as kinetic windows, we show how the mechanism is operated.",
    ],
    clientSees: ["A walk-through and a list of any remaining items."],
    decisions: ["Acceptance of the finished work.", "How remaining items are closed out."],
    fragment: "rail-elevation",
  },
];

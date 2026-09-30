import type { ProcessStage } from "./types";

export const processStages: ProcessStage[] = [
  {
    id: "listen",
    name: "Listen",
    line: "We start with your brief, your site and your people.",
    body: "We read the brief, visit the site where we can, and ask about who will use the space and what has to work. Notes, measurements and references go on one page.",
    visualLabel: "Brief notes and site measurements",
  },
  {
    id: "sketch",
    name: "Sketch",
    line: "Rough lines first, because they are quick to change.",
    body: "Plans, elevations and loose drawings let us test ideas together before anything is priced or cut. You see the thinking, not only the result.",
    visualLabel: "A plan and elevation drawing",
  },
  {
    id: "develop",
    name: "Develop",
    line: "Materials, details and drawings that a workshop can build.",
    body: "We choose finishes against real samples, draw the joints and confirm how each piece is made, fixed and lit. This is where the idea becomes buildable.",
    visualLabel: "A material composition",
  },
  {
    id: "build",
    name: "Build",
    line: "Fabricated by the people who drew it.",
    body: "Pieces are made and finished in the workshop, checked against the drawings, then installed on site. One team keeps design and build in step.",
    visualLabel: "Fabrication details",
  },
  {
    id: "handover",
    name: "Handover",
    line: "Finished, checked and explained.",
    body: "We walk the finished space with you, agree the snag list, and hand over drawings and care notes so it keeps looking the way it should.",
    visualLabel: "The finished space",
  },
];

import type { Service, ServiceSlug } from "./types";
import { PH } from "./placeholders";

export const services: Service[] = [
  {
    slug: "interiors",
    name: "Interiors",
    short: "Residential and commercial design and fit-out.",
    summary:
      "Homes, offices and retail spaces, designed and fitted out by one team. We draw it, specify it and build it.",
    intro:
      "We design residential and commercial interiors and then build them. The person who sketched the joinery detail is the person who checks it on site.",
    covers: [
      "Space planning and concept design",
      "Material, finish and lighting specification",
      "Bespoke joinery and furniture",
      "Fit-out management through to handover",
    ],
    firstQuestions: [
      "Who uses the space, and how does a normal day run?",
      "Which materials do you already love, or already own?",
      "What has to stay, and what can move?",
    ],
    photo: PH.interiors,
  },
  {
    slug: "exhibitions",
    name: "Exhibitions",
    short: "Stands and pavilions, from concept to build.",
    summary:
      "Custom stands and pavilions for trade shows and fairs, designed, fabricated and installed on the show schedule.",
    intro:
      "An exhibition stand has one chance to work. We design it around how visitors walk the hall, then fabricate and install it to the organiser's rules and calendar.",
    covers: [
      "Stand and pavilion concept design",
      "Fabrication in our own workshop",
      "Graphics, lighting and AV coordination",
      "On-site installation and dismantle",
    ],
    firstQuestions: [
      "Which show, and which hall position?",
      "What should a visitor remember after thirty seconds?",
      "What needs to happen on the stand: meetings, demos or both?",
    ],
    photo: PH.exhibitions,
  },
  {
    slug: "events",
    name: "Events",
    short: "Launches, set design and staging.",
    summary:
      "Launches, conferences and private events with sets and staging designed to suit the room and the run of show.",
    intro:
      "Events run on a clock. We design sets and staging that load in quickly, read clearly from the back of the room and come down without fuss.",
    covers: [
      "Set and stage design",
      "Scenic fabrication and props",
      "Lighting and layout planning with the venue",
      "Load-in, show support and strike",
    ],
    firstQuestions: [
      "What is the moment the whole room should see?",
      "What are the venue's load-in limits and hours?",
      "Who speaks, performs or presents, and from where?",
    ],
    photo: PH.events,
  },
  {
    slug: "brand-activations",
    name: "Brand activations",
    short: "Pop-ups and experiences people take part in.",
    summary:
      "Pop-ups, roadshows and participatory experiences that let people handle, try and play with a brand.",
    intro:
      "A good activation gives people something to do. We design the flow, build the structure and plan how it is staffed and serviced.",
    covers: [
      "Pop-up and roadshow design",
      "Interactive and participatory mechanics",
      "Modular builds for moving between sites",
      "Site setup, servicing and removal",
    ],
    firstQuestions: [
      "Where will people meet it, and how long will they stay?",
      "What should they do with their hands?",
      "Does it travel, and how many times does it need to be rebuilt?",
    ],
    photo: PH.activations,
  },
  {
    slug: "kinetic-windows",
    name: "Kinetic windows",
    short: "Retail window displays that move.",
    summary:
      "Window displays with mechanisms that move slowly and precisely, so passers-by catch a full change as they walk past.",
    intro:
      "A kinetic window is part set design and part engineering. We design the scene and the mechanism together, test it in the workshop and install it after hours.",
    covers: [
      "Concept and storyboard of the movement",
      "Mechanism design, control and testing",
      "Fabrication and finishing in the workshop",
      "Installation, servicing and seasonal changes",
    ],
    firstQuestions: [
      "What does the shop sell, and who walks past it?",
      "How wide and how deep is the glass, and what can we fix to?",
      "How long should one full movement take?",
    ],
    photo: PH.windows,
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const serviceSlugs = services.map((s) => s.slug) as ServiceSlug[];

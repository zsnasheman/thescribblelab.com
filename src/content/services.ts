import type { Service, ServiceSlug } from "./types";

export const services: Service[] = [
  {
    slug: "interiors",
    name: "Interiors",
    short: "Residential, commercial, retail and food and beverage interiors.",
    summary:
      "Homes, offices, shops and restaurants, designed and fitted out with the detail resolved on drawings before it is built.",
    intro:
      "We design interiors across residential, commercial, retail and food and beverage work, then carry them through fit-out. The person who draws the joinery is thinking about how it will be made and installed.",
    plate: "interior",
    fragment: "plan-interior",
    materials: ["lacquer", "plaster", "terrazzo", "brass"],
    briefs: [
      "A home or villa that needs a considered layout, materials and joinery.",
      "An office or workplace fit-out for a team that has outgrown its space.",
      "A retail unit that has to show product and move customers through it.",
      "A café, restaurant or bar where service flow and atmosphere must both work.",
    ],
    scope: [
      "Space planning and concept design",
      "Material, finish and lighting specification",
      "Bespoke joinery and furniture design",
      "Fit-out coordination through to handover",
    ],
    deliverables: [
      "Concept plans, sketches and reference boards",
      "Developed drawings and a material and finish schedule",
      "Joinery and detail drawings for fabrication",
      "A handover walk-through with a list of any remaining items",
    ],
    processNotes: [
      { stage: "listen", note: "We ask who uses the space, how a normal day runs, and what has to stay." },
      { stage: "sketch", note: "Layouts are tested as plans first, then as elevations of the key walls." },
      { stage: "develop", note: "Finishes are chosen against samples, and joinery is drawn joint by joint." },
      { stage: "build", note: "Fit-out is coordinated with the trades, with changes drawn and agreed." },
      { stage: "handover", note: "We walk the finished interior with you and record what needs attention." },
    ],
    faqs: [
      {
        q: "Do you design only, or design and build?",
        a: "Both. Some projects need design only, and others carry through fabrication and fit-out. Tell us which you need in the brief and we will say how we would approach it.",
      },
      {
        q: "What should I send with a first inquiry?",
        a: "A few sentences about the space and what it must do, the location, a rough idea of scale and timing, and any plans or references you already have. The brief form asks for exactly this.",
      },
      {
        q: "Will the form give me a price?",
        a: "No. The form does not generate quotes. We respond to each brief individually once we understand the scope.",
      },
    ],
    firstQuestions: [
      "Who uses the space, and how does a normal day run?",
      "Which materials do you already love, or already own?",
      "What has to stay, and what can move?",
    ],
    nextStep: "Share a short brief for a home, office, shop or restaurant.",
  },
  {
    slug: "exhibitions",
    name: "Exhibitions",
    short: "Stands and pavilions, from concept to build.",
    summary:
      "Custom stands and pavilions for trade shows and fairs, designed around how visitors walk the hall.",
    intro:
      "An exhibition stand has one chance to work. We design it around the hall, the organiser's rules and the way visitors move, then fabricate and install it to the show schedule.",
    plate: "stand",
    fragment: "plan-stand",
    materials: ["lacquer", "felt", "coral-paint", "ply"],
    briefs: [
      "A first stand for a company entering a trade show.",
      "A returning stand that needs a fresh design and a more efficient build.",
      "A national or sector pavilion with several exhibitors under one identity.",
      "A stand that must be dismantled, shipped and rebuilt for more than one show.",
    ],
    scope: [
      "Stand and pavilion concept design",
      "Fabrication and finishing",
      "Graphics, lighting and AV coordination",
      "Installation, servicing and dismantle",
    ],
    deliverables: [
      "Concept layouts and views",
      "Construction drawings suitable for the organiser's approval process",
      "Fabricated and finished stand components",
      "Installation and dismantle coordination on site",
    ],
    processNotes: [
      { stage: "listen", note: "We ask which show and which hall position, and read the organiser's stand rules." },
      { stage: "sketch", note: "Plans test how many sides are open to the aisle and where visitors enter." },
      { stage: "develop", note: "Structure, graphics and lighting are resolved into approval drawings." },
      { stage: "build", note: "Components are made off site and installed within the show's build window." },
      { stage: "handover", note: "We walk the stand through with you before the doors open." },
    ],
    faqs: [
      {
        q: "Which stand types can you design?",
        a: "Inline, corner, peninsula and island stands, and larger pavilions. The diagram on this page shows how each one meets the aisle.",
      },
      {
        q: "Do you handle the organiser's approvals?",
        a: "We produce drawings suitable for the organiser's process. Approval rules differ by show, so we confirm them at the start of each project.",
      },
      {
        q: "Can a stand be reused at another show?",
        a: "It can be designed to be dismantled and rebuilt. Tell us in the brief how many times and in which venues.",
      },
    ],
    firstQuestions: [
      "Which show, and which hall position?",
      "What should a visitor remember after thirty seconds?",
      "What needs to happen on the stand: meetings, demonstrations or both?",
    ],
    nextStep: "Tell us the show, the hall and the stand size you have booked.",
  },
  {
    slug: "events",
    name: "Events",
    short: "Launches, set design and staging.",
    summary:
      "Sets and staging for launches, conferences and private events, designed to load in quickly and read from the back of the room.",
    intro:
      "Events run on a clock. We design sets and staging around the venue's limits and the run of show, then fabricate, install and take them down again.",
    plate: "stage",
    fragment: "section-stage",
    materials: ["lacquer", "felt", "coral-paint", "ply"],
    briefs: [
      "A product or brand launch with one moment the room must see.",
      "A conference or summit that needs a stage, a backdrop and breakout spaces.",
      "A private or corporate event with a themed set.",
      "A staged experience that has to fit a venue with strict load-in rules.",
    ],
    scope: [
      "Set and stage design",
      "Scenic fabrication and props",
      "Layout and lighting planning with the venue",
      "Load-in, show support and strike",
    ],
    deliverables: [
      "Stage and set concepts, with sightline checks",
      "Fabrication drawings for scenic elements",
      "Built and finished set pieces",
      "Load-in and strike coordination",
    ],
    processNotes: [
      { stage: "listen", note: "We ask about the venue, the load-in window and who presents from where." },
      { stage: "sketch", note: "Sections and sightlines test the view from every part of the room." },
      { stage: "develop", note: "Scenic pieces are detailed so they assemble quickly and come apart cleanly." },
      { stage: "build", note: "Pieces are made in advance, then installed in the venue's window." },
      { stage: "handover", note: "We run through the set with your team before the event and strike it afterwards." },
    ],
    faqs: [
      {
        q: "How early should we get in touch?",
        a: "As early as you can, ideally before the venue is fixed. Venue limits shape the design. We do not state standard lead times, because they depend on the scope.",
      },
      {
        q: "Can you work with the venue's in-house team?",
        a: "Yes. Load-in rules, rigging points and power are agreed with the venue early, and we coordinate with their team.",
      },
      {
        q: "Do you supply the lighting and AV?",
        a: "We plan the lighting and coordinate AV as part of the set. Who supplies what is agreed project by project.",
      },
    ],
    firstQuestions: [
      "What is the moment the whole room should see?",
      "What are the venue's load-in limits and hours?",
      "Who speaks, performs or presents, and from where?",
    ],
    nextStep: "Send the venue, the date if you have one, and what the moment should be.",
  },
  {
    slug: "brand-activations",
    name: "Brand activations",
    short: "Pop-ups and experiences people take part in.",
    summary:
      "Pop-ups, roadshows and participatory experiences that let people handle, try and play with a brand.",
    intro:
      "A good activation gives people something to do. We design the flow, build the structure and plan how it is set up, staffed and taken away, often as modules that can be rebuilt elsewhere.",
    plate: "popup",
    fragment: "kit",
    materials: ["ply", "coral-paint", "felt", "brass"],
    briefs: [
      "A pop-up shop in a mall, hotel lobby or street market.",
      "A roadshow that has to be rebuilt in several locations.",
      "A participatory experience where visitors try, make or play.",
      "A temporary space that launches a product or a campaign.",
    ],
    scope: [
      "Pop-up and roadshow design",
      "Interactive and participatory mechanics",
      "Modular structures that can be rebuilt",
      "Set-up, servicing and removal",
    ],
    deliverables: [
      "Concept design and a visitor-flow plan",
      "A modular kit of parts, with assembly drawings",
      "Fabricated and finished modules",
      "Set-up and removal coordination",
    ],
    processNotes: [
      { stage: "listen", note: "We ask where people will meet it and how long they will stay." },
      { stage: "sketch", note: "We sketch the visitor flow and the one thing a person does with their hands." },
      { stage: "develop", note: "The design is broken into modules so it can travel and be rebuilt." },
      { stage: "build", note: "Modules are fabricated, test-assembled, then installed on site." },
      { stage: "handover", note: "We hand over assembly notes so the activation can be rebuilt." },
    ],
    faqs: [
      {
        q: "Can an activation move between locations?",
        a: "Yes, if it is designed that way from the start. Tell us how many locations and how often it will be rebuilt.",
      },
      {
        q: "Do you staff the activation?",
        a: "We design, build and install the structure. Staffing and servicing arrangements are agreed project by project.",
      },
      {
        q: "What permissions does a pop-up need?",
        a: "Requirements depend on the site. We confirm them with the venue or landlord at the start. We do not promise approvals.",
      },
    ],
    firstQuestions: [
      "Where will people meet it, and how long will they stay?",
      "What should they do with their hands?",
      "Does it travel, and how many times does it need to be rebuilt?",
    ],
    nextStep: "Tell us where it will be and what visitors should do there.",
  },
  {
    slug: "kinetic-windows",
    name: "Kinetic windows",
    short: "Retail window displays that move.",
    summary:
      "Window displays with mechanisms that move slowly and precisely, so passers-by catch a full change as they walk past.",
    intro:
      "A kinetic window is part set design and part engineering. We design the scene and the mechanism together, test it in the workshop and install it after hours.",
    plate: "window",
    fragment: "rail-elevation",
    materials: ["brass", "lacquer", "coral-paint", "felt"],
    briefs: [
      "A flagship window that should change as people walk past.",
      "A seasonal window that can be refreshed without rebuilding the mechanism.",
      "A product window where one object is revealed or turned.",
      "A window that tells a short story over a repeating cycle.",
    ],
    scope: [
      "Concept and storyboard of the movement",
      "Mechanism design, control and testing",
      "Fabrication and finishing",
      "Installation, servicing and seasonal changes",
    ],
    deliverables: [
      "A storyboard of the movement over one cycle",
      "Mechanism and scene drawings",
      "A tested, finished installation",
      "Operating and servicing notes",
    ],
    processNotes: [
      { stage: "listen", note: "We measure the glass and ask what can be fixed to, and what is passing the window." },
      { stage: "sketch", note: "We storyboard the movement so the full cycle is clear before anything is built." },
      { stage: "develop", note: "Rails, drives and panels are detailed together, with service access." },
      { stage: "build", note: "The mechanism is tested in the workshop, then installed after hours." },
      { stage: "handover", note: "We show your team how it is operated, paused and reset." },
    ],
    faqs: [
      {
        q: "How long is a movement cycle?",
        a: "The Brand Book suggests looping every 8 to 20 seconds so passers-by catch a full cycle. The right length depends on the street and the story.",
      },
      {
        q: "Can the scene change while the mechanism stays?",
        a: "That is a good way to design it: a mechanism built to last, and a scene that can be refreshed.",
      },
      {
        q: "Do you service installations afterwards?",
        a: "Servicing is part of the discussion for each installation. We record what is agreed in the project.",
      },
    ],
    firstQuestions: [
      "What does the shop sell, and who walks past it?",
      "How wide and deep is the glass, and what can we fix to?",
      "How long should one full movement take?",
    ],
    nextStep: "Send the shopfront width, the location and what should move.",
  },
];

export const serviceBySlug = (slug: string): Service | undefined => services.find((s) => s.slug === slug);
export const serviceSlugs = services.map((s) => s.slug) as ServiceSlug[];

export const studioIntro = {
  lead: "The Scribble Lab is a creative design and build agency headquartered in Dubai. We take ideas from the first sketch to finished spaces.",
  serves:
    "We work with homeowners, developers, retailers, restaurateurs, exhibitors, brands and event organisers. Some bring a complete brief. Others arrive with a location and an instinct.",
  evolution: [
    "The studio was established in December 2021 as an independent design practice.",
    "It has developed toward concept-led work: interiors, retail and food and beverage spaces, exhibitions, events, pop-ups, brand activations and kinetic displays.",
    "What connects them is one habit: a space is drawn with its construction in mind, and built with its idea in mind.",
  ],
};

/** Each value from the Brand Book, with the working behaviour it stands for. Draft wording for owner review. */
export const values = [
  {
    name: "Crafted",
    brandLine: "We sweat the joinery, the finish and the last millimetre.",
    behaviour: "Joints, finishes and fixings are resolved on drawings before anything is fabricated, and checked against them afterwards.",
  },
  {
    name: "Bold",
    brandLine: "We pitch the idea that makes people stop walking.",
    behaviour: "We present a clear direction with reasons, and show an alternative when the brief allows.",
  },
  {
    name: "Curious",
    brandLine: "We test materials, mechanisms and new technology.",
    behaviour: "We ask for real samples, build small mock-ups of anything new, and record what we learn.",
  },
  {
    name: "Borderless",
    brandLine: "Creative talent without borders, one studio across many cities.",
    behaviour: "We work in plain international English and respect local customs, calendars and languages in each market.",
  },
] as const;

export const howItConnects = [
  { label: "Concept", text: "An idea is sketched and tested against the brief and the site." },
  { label: "Design development", text: "The chosen idea is drawn, with materials, details and services resolved." },
  { label: "Fabrication", text: "Pieces are made and finished by fabrication partners or the studio's own makers, depending on the project." },
  { label: "Coordination", text: "Drawings, suppliers and trades are kept in step so the site receives what was designed." },
  { label: "Installation", text: "The work is installed or fitted out on site and checked against the drawings." },
] as const;

export const roles = [
  { name: "Designers", text: "Develop the concept and the drawings, and stay involved as it is built." },
  { name: "Makers", text: "Fabricate and finish the pieces. Who makes what is agreed for each project." },
  { name: "Delivery partners", text: "Install, fit out and service the work on site where a project needs them." },
] as const;

export const capabilities = [
  "Interior design and fit-out, including residential, commercial, retail and food and beverage",
  "Exhibition stands and pavilions",
  "Event sets and staging",
  "Brand activations and pop-ups",
  "Kinetic window displays",
] as const;

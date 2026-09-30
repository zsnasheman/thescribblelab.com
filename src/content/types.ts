export type ServiceSlug =
  | "interiors"
  | "exhibitions"
  | "events"
  | "brand-activations"
  | "kinetic-windows";

/** Drawn compositions (original architectural illustrations) used until real photography exists. */
export type PlateKind = "interior" | "villa" | "stand" | "stage" | "popup" | "window";
export type FragmentKind = "plan-interior" | "plan-stand" | "section-stage" | "kit" | "rail-elevation" | "joinery-section";
export type MaterialId =
  | "lacquer"
  | "plaster"
  | "terrazzo"
  | "travertine"
  | "brass"
  | "felt"
  | "coral-paint"
  | "ply";

export type Faq = { q: string; a: string };

export type Service = {
  slug: ServiceSlug;
  name: string;
  short: string;
  summary: string;
  intro: string;
  plate: PlateKind;
  fragment: FragmentKind;
  materials: MaterialId[];
  /** The kinds of brief this service answers. */
  briefs: string[];
  /** What the work covers. */
  scope: string[];
  /** What the client receives. Never promises times, prices or guarantees. */
  deliverables: string[];
  /** How the five stages apply to this discipline. */
  processNotes: { stage: ProcessStage["id"]; note: string }[];
  faqs: Faq[];
  firstQuestions: string[];
  nextStep: string;
};

export type ProjectStatus = "concept" | "completed";

/** A real supplied asset (photograph or video). Empty for illustrative concepts. */
export type MediaItem = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  attribution?: string;
  permissionToPublish: boolean;
};

export type Project = {
  slug: string;
  title: string;
  service: ServiceSlug;
  status: ProjectStatus;
  /** Demo records are illustrative and must be removed before launch. */
  isDemo: boolean;
  summary: string;
  overview: string;
  brief: string;
  response: string;
  materials: MaterialId[];
  development: string;
  execution: string;
  /** Only verified, supplied outcomes. Never invented. */
  outcomes: string[];
  plate: PlateKind;
  drawings: { fragment: FragmentKind; caption: string }[];
  /** Real completed-work media, when supplied. */
  media: MediaItem[];
  /** Only for a genuinely matched render and built photograph. */
  compare?: { before: MediaItem; after: MediaItem; caption: string };
  ratio: "landscape" | "portrait" | "square";
  client?: string;
  location?: string;
  year?: number;
  photographer?: string;
  clientPermission?: boolean;
};

export type ProcessStage = {
  id: "listen" | "sketch" | "develop" | "build" | "handover";
  name: string;
  line: string;
  what: string[];
  clientSees: string[];
  decisions: string[];
  fragment: FragmentKind;
};

export type FounderChapter = {
  id: string;
  title: string;
  kicker: string;
  paragraphs: string[];
  /** Short facts shown beside the prose. */
  facts?: { label: string; value: string }[];
  /** Text that still needs the founder's own words. Shown quietly, once per chapter. */
  draftNote?: string;
  caption: string;
};

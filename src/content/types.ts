export type ServiceSlug =
  | "interiors"
  | "exhibitions"
  | "events"
  | "brand-activations"
  | "kinetic-windows";

export type Service = {
  slug: ServiceSlug;
  name: string;
  /** One line for the studio board. */
  short: string;
  /** Short paragraph for the focused view. */
  summary: string;
  /** Longer copy for the service page. */
  intro: string;
  /** Plain statements of what the work covers. No promises of price or time. */
  covers: string[];
  /** Questions we usually ask first. */
  firstQuestions: string[];
  photo: Photo;
};

/** A photograph. `placeholder` photos are temporary web images, not Scribble Lab work. */
export type Photo = {
  src: string;
  alt: string;
  credit?: string;
  placeholder: boolean;
};

export type ProjectStatus = "concept" | "completed";

export type MediaItem = {
  kind: "image" | "video";
  /** Path or URL. */
  src?: string;
  poster?: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  attribution?: string;
  /** Written permission to publish this media. */
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
  brief: string;
  response: string;
  materials: string[];
  execution: string;
  /** Only verified, supplied outcomes. Never invented. */
  outcomes: string[];
  media: MediaItem[];
  photo: Photo;
  /** Layout hint for the editorial showcase. */
  ratio: "landscape" | "portrait" | "square";
  // Optional verified metadata. Shown only when present.
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
  body: string;
  visualLabel: string;
  photo: Photo;
};

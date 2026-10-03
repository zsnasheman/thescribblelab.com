/**
 * Supplied by the studio as placeholder and general imagery (Oct 2026). Four are 3D design visuals, one is a photograph.
 * They are not yet confirmed as named, permitted Scribble Lab projects, so they are labelled as images, never as completed
 * work with a client, and never given invented facts. Replace with approved project media in src/content/projects.ts.
 */
export type PlaceholderImage = { id: string; src: string; thumb: string; w: number; h: number; alt: string; title: string; kind: "visual" | "photograph" };

export const PLACEHOLDER_IMAGES: PlaceholderImage[] = [
  { id: "cafe", src: "/projects/cafe.webp", thumb: "/projects/cafe-sm.webp", w: 1800, h: 1200, kind: "photograph", title: "Café and dining interior", alt: "A café interior with a pastry counter, hanging planters, pendant lights and a glazed staircase wall." },
  { id: "office-lounge", src: "/projects/office-lounge.webp", thumb: "/projects/office-lounge-sm.webp", w: 1800, h: 900, kind: "visual", title: "Collaboration area", alt: "Design visual of an office collaboration area with a timber ceiling grid, a patterned screen and a travertine counter." },
  { id: "reception", src: "/projects/reception.webp", thumb: "/projects/reception-sm.webp", w: 1800, h: 900, kind: "visual", title: "Reception", alt: "Design visual of a reception with a moss wall, a brass lattice screen and a navy front desk." },
  { id: "open-workspace", src: "/projects/open-workspace.webp", thumb: "/projects/open-workspace-sm.webp", w: 1800, h: 900, kind: "visual", title: "Open workspace", alt: "Design visual of an open workspace with blue desk screens, hanging planters and a timber and planted feature wall." },
  { id: "boardroom", src: "/projects/boardroom.webp", thumb: "/projects/boardroom-sm.webp", w: 1800, h: 900, kind: "visual", title: "Boardroom", alt: "Design visual of a boardroom with a long timber table, brass pendant lights and a lattice screen." },
];

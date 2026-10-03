import { allProjects } from "./index";
import { projectArt } from "./art";
import { PLACEHOLDER_IMAGES } from "./placeholders";

/** What the opening journey's aperture opens onto: a real, permitted project photograph when one exists, otherwise a labelled concept study. */
export type Featured = {
  kind: "built" | "placeholder" | "concept";
  title: string;
  line: string;
  href: string;
  src: string;
  alt: string;
  w: number;
  h: number;
  service: string;
};

export function featuredProject(): Featured {
  const built = allProjects().find((p) => p.status === "completed" && p.media.some((m) => m.kind === "image" && m.permissionToPublish));
  if (built) {
    const m = built.media.find((x) => x.kind === "image" && x.permissionToPublish)!;
    return { kind: "built", title: built.title, line: built.summary, href: `/work/${built.slug}`, src: m.src, alt: m.alt, w: m.width ?? 1600, h: m.height ?? 1000, service: built.service };
  }
  const ph = PLACEHOLDER_IMAGES.find((i) => i.id === "cafe");
  if (ph) return { kind: "placeholder", title: ph.title, line: "Timber, glass, planting and colour, composed around one entrance.", href: "/work?service=interiors", src: ph.src, alt: ph.alt, w: ph.w, h: ph.h, service: "interiors" };
  const c = allProjects().find((p) => p.slug === "concept-launch-stage") ?? allProjects()[0];
  const art = projectArt(c.slug, c.service);
  return { kind: "concept", title: c.title, line: c.summary, href: `/work/${c.slug}`, src: art.color, alt: art.alt, w: art.w, h: art.h, service: c.service };
}

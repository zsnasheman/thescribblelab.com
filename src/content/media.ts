import { PLACEHOLDER_IMAGES, type PlaceholderImage } from "./placeholders";

/** Optional looping hero film. Leave null until a real clip (and poster) is supplied; the reel then uses stills. */
export const HERO_VIDEO: { src: string; poster: string } | null = null;

const byId = (id: string) => PLACEHOLDER_IMAGES.find((i) => i.id === id) as PlaceholderImage;
export const HERO_SLIDES: PlaceholderImage[] = ["cafe", "reception", "office-lounge", "boardroom", "open-workspace"].map(byId);
export const kindLabel = (i: PlaceholderImage) => (i.kind === "photograph" ? "Photograph" : "Design visual");
export const mediaById = byId;

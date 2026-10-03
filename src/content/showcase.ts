import { PORTFOLIO, type PortfolioImage, type PortfolioProject } from "./portfolio";

export type Shot = { project: PortfolioProject; image: PortfolioImage; alt: string };

/** One picture from a portfolio project, by slug and image index. */
export function shot(slug: string, i = 0): Shot {
  const project = PORTFOLIO.find((p) => p.slug === slug) as PortfolioProject;
  const image = project.images[i] ?? project.images[0];
  return { project, image, alt: `${project.title}${project.where ? `, ${project.where}` : ""}` };
}

/** Optional looping hero film. Leave null until a real clip (and poster) is supplied; the reel then uses stills. */
export const HERO_VIDEO: { src: string; poster: string } | null = null;

export const HERO_SLIDES: Shot[] = [
  shot("ahmed-al-maghribi-launch", 3),
  shot("fifa-arab-cup-qatar", 0),
  shot("chopard-kinetic-windows", 0),
  shot("laduree-dubai-hills", 0),
  shot("the-juice-beauty", 0),
  shot("al-hilal-bank-youth-centre", 0),
];

/** Projects shown on the homepage reel, in order. */
export const FEATURED = ["ahmed-al-maghribi-launch", "laduree-ramadan-tent", "fifa-arab-cup-qatar", "chopard-kinetic-windows", "al-haramain-beauty-world", "roche-riyadh", "hitchki-mirdif", "wandr-jlt"];

/** The studio's own description of why clients choose it (company profile). */
export const WHY = [
  { t: "Creative Excellence", d: "We don’t produce work. We produce work that gets remembered. Every project regardless of size or budget gets our full creative force behind it." },
  { t: "Experienced Professionals", d: "Our team has built brands, designed spaces and activated experiences across the MENA region. We bring serious expertise to every brief without the serious attitude." },
  { t: "Tailored Solutions", d: "No two projects get the same answer here. We start every brief from scratch because your space, your brand and your audience are specific and your solution should be too." },
  { t: "Innovative Approach", d: "We question every assumption before we accept it. The expected solution is always the starting point never the destination. We push until we find the version that surprises everyone including us." },
] as const;

/** Selected clients and projects as listed in the company profile: [project, role, place, year]. */
export const CLIENT_LIST: [string, string, string, string][] = [
  ["Roche Office", "Design Consultancy", "Riyadh, KSA", "2020"],
  ["DT1 Residential Tower", "Design Consultancy", "Dubai, UAE", "2020"],
  ["Private Villa", "Design Consultancy", "Dubai, UAE", "2019"],
  ["Dubai Health, Al Jalila Foundation", "Design & Execution", "Dubai, UAE", "2026"],
  ["Private Beach Villa", "Design Consultancy", "Abu Dhabi, UAE", "2018"],
  ["Hitchki Restaurant, Mirdif City Centre", "Built", "Dubai, UAE", "2019"],
  ["Private Emirates Hills Villa", "Design Consultancy", "Dubai, UAE", "2018"],
  ["Energy Plus Gym, Al Forsan Village", "Design & Built", "Abu Dhabi, UAE", "2019"],
  ["Eatopia Global, Wandr", "Design Consultancy", "Dubai, UAE", "2024"],
  ["Entrance Way & Fair Cafe", "Design Consultancy", "Dubai, UAE", "2019"],
  ["Barako Grill Container Restaurant", "Design Consultancy", "Umm Al Quwain, UAE", "2017"],
  ["Ahmed Al Maghribi Launch Event", "Event Design & Execution Consultancy", "Dubai, UAE", "2024–2025"],
  ["Transmed Dubai Hills Office", "Design Consultancy", "Dubai, UAE", "2021"],
  ["Emirates NBD HQ, ICD Brookfield", "Design Consultancy", "Dubai, UAE", "2021"],
  ["Bank ABC HQ, Burj Daman", "Design & Built", "Dubai, UAE", "2021"],
  ["Britishvolt, Al Maryah Island", "Built", "Abu Dhabi, UAE", "2021"],
  ["Al Hilal Bank, Dubai Mall", "Design Consultancy", "Dubai, UAE", "2021"],
  ["French Spirit Coffee Shop LLC (Ladurée)", "Design & Built", "Dubai, UAE and Riyadh, KSA", "2025"],
];

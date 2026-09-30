import { approvedProjects } from "./projects";
import { demoProjects } from "./demo/projects";
import type { Project, ServiceSlug } from "./types";

/** Switch to false (and delete ./demo) before launch. */
export const SHOW_DEMO_CONTENT = true;

export const allProjects = (): Project[] => [
  ...approvedProjects,
  ...(SHOW_DEMO_CONTENT ? demoProjects : []),
];

export const projectBySlug = (slug: string): Project | undefined =>
  allProjects().find((p) => p.slug === slug);

export const projectsForService = (service: ServiceSlug): Project[] =>
  allProjects().filter((p) => p.service === service);

export { services, serviceBySlug, serviceSlugs } from "./services";
export { processStages } from "./process";
export type * from "./types";

import type { Pt } from "./geometry";

/** Isometric (axonometric) projection: x to the right-down, y to the left-down, z up. */
export function makeIso(scale: number, cx: number, cy: number) {
  const c = Math.cos(Math.PI / 6);
  const s = Math.sin(Math.PI / 6);
  const P = (x: number, y: number, z: number): Pt => [cx + (x - y) * c * scale, cy + (x + y) * s * scale - z * scale];
  const box = (x: number, y: number, z: number, w: number, d: number, h: number) => ({
    top: [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)] as Pt[],
    left: [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)] as Pt[],
    right: [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)] as Pt[],
  });
  return { P, box };
}

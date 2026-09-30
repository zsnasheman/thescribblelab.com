// A small perspective toolkit. Objects are described in room coordinates and projected
// through one shared vanishing geometry, so every drawing keeps the same viewpoint and the
// whole scene can respond to the pointer by moving the back wall.
//
//   u: -1 (left wall) .. 1 (right wall)     v: 0 (floor) .. 1 (ceiling)     d: 0 (viewer) .. 1 (back wall)

export type View = { ox: number; oy: number };
export type Pt = [number, number];

const FRONT = { x0: -80, x1: 1280, y0: -30, y1: 730 };
const BACK = { x0: 410, x1: 790, y0: 231, y1: 444 };
const STRENGTH = 0.55;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Equal steps in d read as equal steps in the room: nearer steps look larger.
const zt = (d: number) => (d / (d + STRENGTH)) / (1 / (1 + STRENGTH));

export function makeRoom(view: View = { ox: 0, oy: 0 }) {
  const B = { x0: BACK.x0 + view.ox, x1: BACK.x1 + view.ox, y0: BACK.y0 + view.oy, y1: BACK.y1 + view.oy };
  const proj = (u: number, v: number, d: number): Pt => {
    const t = zt(Math.min(Math.max(d, 0), 1));
    const k = (u + 1) / 2;
    const fx = lerp(FRONT.x0, FRONT.x1, k);
    const bx = lerp(B.x0, B.x1, k);
    const fy = lerp(FRONT.y1, FRONT.y0, v);
    const by = lerp(B.y1, B.y0, v);
    return [lerp(fx, bx, t), lerp(fy, by, t)];
  };
  const vp: Pt = [(B.x0 + B.x1) / 2, (B.y0 + B.y1) / 2];
  return { proj, vp, back: B };
}

export type Room = ReturnType<typeof makeRoom>;

export const pts = (...p: Pt[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
export const pathOf = (p: Pt[], close = true) =>
  p.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + (close ? "Z" : "");

/** Deterministic pseudo-random numbers so drawings never change between renders. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function quads(r: Room) {
  const { proj } = r;
  return {
    floor: (u0: number, u1: number, d0: number, d1: number, v = 0): Pt[] => [proj(u0, v, d0), proj(u1, v, d0), proj(u1, v, d1), proj(u0, v, d1)],
    ceil: (u0: number, u1: number, d0: number, d1: number): Pt[] => [proj(u0, 1, d0), proj(u1, 1, d0), proj(u1, 1, d1), proj(u0, 1, d1)],
    wallL: (d0: number, d1: number, v0: number, v1: number, u = -1): Pt[] => [proj(u, v0, d0), proj(u, v0, d1), proj(u, v1, d1), proj(u, v1, d0)],
    wallR: (d0: number, d1: number, v0: number, v1: number, u = 1): Pt[] => [proj(u, v0, d0), proj(u, v0, d1), proj(u, v1, d1), proj(u, v1, d0)],
    back: (u0: number, u1: number, v0: number, v1: number, d = 1): Pt[] => [proj(u0, v0, d), proj(u1, v0, d), proj(u1, v1, d), proj(u0, v1, d)],
    /** A box: returns its three or four visible faces, back to front. */
    box(u0: number, u1: number, d0: number, d1: number, v0: number, v1: number) {
      const mid = (u0 + u1) / 2;
      const top: Pt[] = [proj(u0, v1, d0), proj(u1, v1, d0), proj(u1, v1, d1), proj(u0, v1, d1)];
      const front: Pt[] = [proj(u0, v0, d0), proj(u1, v0, d0), proj(u1, v1, d0), proj(u0, v1, d0)];
      const side: Pt[] =
        mid < 0
          ? [proj(u1, v0, d0), proj(u1, v0, d1), proj(u1, v1, d1), proj(u1, v1, d0)]
          : [proj(u0, v0, d0), proj(u0, v0, d1), proj(u0, v1, d1), proj(u0, v1, d0)];
      return { top, front, side };
    },
  };
}

/** Points on an ellipse lying flat on a floor-parallel plane. */
export function disc(r: Room, cu: number, cd: number, ru: number, rd: number, v = 0, n = 28): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return r.proj(cu + Math.cos(a) * ru, v, cd + Math.sin(a) * rd);
  });
}

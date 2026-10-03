import type { Pt } from "@/content/guide";

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerpPts = (a: Pt[], b: Pt[], t: number): Pt[] => a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);

/** Resample a closed polyline to n points, evenly by length, starting at its first point. */
export function resample(poly: Pt[], n: number): Pt[] {
  const pts = [...poly, poly[0]];
  const d = [0];
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = d[d.length - 1];
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const t = (k / n) * total;
    while (j < pts.length - 1 && d[j] < t) j++;
    const u = (t - d[j - 1]) / (d[j] - d[j - 1] || 1);
    out.push([lerp(pts[j - 1][0], pts[j][0], u), lerp(pts[j - 1][1], pts[j][1], u)]);
  }
  return out;
}

/** An arch (semicircular head, straight sides, flat sill), clockwise from the apex. */
export function arch(cx: number, top: number, w: number, h: number, n = 72): Pt[] {
  const r = w / 2;
  const poly: Pt[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    poly.push([cx + r * Math.cos(a), top + r + r * Math.sin(a)]);
  }
  poly.push([cx + r, top + h], [cx - r, top + h], [cx - r, top + r]);
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI + (i / steps) * (Math.PI / 2);
    poly.push([cx + r * Math.cos(a), top + r + r * Math.sin(a)]);
  }
  poly.pop();
  return resample(poly, n);
}

/** Smooth closed path through the points (quadratic midpoints). */
export function smoothPath(p: Pt[]): string {
  const n = p.length;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (v: number) => v.toFixed(1);
  const m0 = mid(p[n - 1], p[0]);
  let d = `M${f(m0[0])} ${f(m0[1])}`;
  for (let i = 0; i < n; i++) {
    const m = mid(p[i], p[(i + 1) % n]);
    d += `Q${f(p[i][0])} ${f(p[i][1])} ${f(m[0])} ${f(m[1])}`;
  }
  return d + "Z";
}

export const place = (unit: Pt[], cx: number, cy: number, size: number): Pt[] => unit.map(([x, y]) => [cx + x * size, cy + y * size]);

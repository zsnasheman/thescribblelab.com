import { useId } from "react";
import { C } from "@/lib/colors";

/** Organic cut-paper shapes. Original geometry in the brand's spirit; not the logo artwork. */
const BLOBS = {
  a: "M57 6C86-2 128 4 152 30c22 24 14 52-6 70-22 20-58 26-88 14C28 102 4 82 4 54 4 30 28 12 57 6Z",
  b: "M40 10c30-14 76-6 100 18 18 18 18 44 2 64-18 22-54 28-84 20C26 104 2 84 6 54 8 34 22 18 40 10Z",
  c: "M18 40C24 14 58 0 92 6c34 6 64 26 62 56-2 30-34 46-68 46C46 108 10 82 18 40Z",
  d: "M8 62C4 30 34 6 72 8c40 2 76 18 78 48 2 32-30 50-68 50C42 106 12 92 8 62Z",
} as const;

export type BlobKind = keyof typeof BLOBS;

export function Blob({
  kind = "a",
  color = C.indigo,
  className,
  style,
}: {
  kind?: BlobKind;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 176 120"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
      preserveAspectRatio="none"
    >
      <path d={BLOBS[kind]} fill={color} />
    </svg>
  );
}

/** A blob filled with the brand's mustard stripes (only ever inside a shape). */
export function StripeBlob({
  kind = "b",
  className,
  style,
}: {
  kind?: BlobKind;
  className?: string;
  style?: React.CSSProperties;
}) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 176 120"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={id}
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-24)"
        >
          <rect width="12" height="12" fill="#fff" />
          <rect width="12" height="6" fill={C.mustard} />
        </pattern>
      </defs>
      <path d={BLOBS[kind]} fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * The five-bubble motif: always five, four lavender and one emerald.
 * `active` marks progress (0–5). Bubbles up to `active` are solid; the rest are outlined
 * so progress reads without relying on colour alone.
 */
export function Bubbles({
  className,
  active,
  size = 14,
}: {
  className?: string;
  active?: number;
  size?: number;
}) {
  const pos = [
    { x: 12, y: 40, r: 9 },
    { x: 34, y: 28, r: 11 },
    { x: 60, y: 34, r: 14 },
    { x: 86, y: 22, r: 8 },
    { x: 106, y: 10, r: 7 },
  ];
  return (
    <svg
      viewBox="0 0 120 56"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ height: size * 4, width: "auto" }}
    >
      {pos.map((p, i) => {
        const isEmerald = i === 4;
        const on = active === undefined || i < active;
        const fill = isEmerald ? C.emerald : C.lavender;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={on ? fill : "transparent"}
            stroke={fill}
            strokeWidth={on ? 0 : 2}
          />
        );
      })}
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

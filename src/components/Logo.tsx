import Image from "next/image";

type Variant = "lockup-indigo" | "lockup-white" | "primary";

const FILES: Record<Variant, { src: string; w: number; h: number; min: number }> = {
  // Minimum on-screen widths from the Brand Book: primary 200 px, lockup 120 px.
  "lockup-indigo": { src: "/brand/lockup-indigo.png", w: 1000, h: 304, min: 120 },
  "lockup-white": { src: "/brand/lockup-white.png", w: 1000, h: 304, min: 120 },
  primary: { src: "/brand/logo-primary.png", w: 1600, h: 1043, min: 200 },
};

/**
 * Uses the supplied master artwork only. Never retyped, recoloured, rotated or stretched.
 * `width` is clamped to the brand minimum.
 */
export function Logo({
  variant,
  width,
  priority,
  className,
}: {
  variant: Variant;
  width: number;
  priority?: boolean;
  className?: string;
}) {
  const f = FILES[variant];
  const w = Math.max(width, f.min);
  const h = Math.round((w * f.h) / f.w);
  return (
    <Image
      src={f.src}
      alt="The Scribble Lab"
      width={w}
      height={h}
      priority={priority}
      className={className}
      style={{ width: w, height: "auto" }}
      sizes={`${w}px`}
    />
  );
}

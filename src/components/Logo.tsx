import Image from "next/image";

/**
 * The Scribble Lab primary logo: the supplied master artwork only.
 * Never retyped, recoloured, rotated or stretched. Minimum on-screen width is 200 px.
 * Place on a light field only (Studio Paper or white); keep clear space of 1X around it.
 */
export function Logo({ width = 220, priority, className }: { width?: number; priority?: boolean; className?: string }) {
  const w = Math.max(width, 200);
  const h = Math.round((w * 1043) / 1600);
  return (
    <Image
      src="/brand/logo-primary.png"
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

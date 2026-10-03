import type { CSSProperties } from "react";

export type Shape = "blob-a" | "blob-b" | "blob-c" | "circle" | "arch" | "pill";
const mask = (shape: Shape): CSSProperties => ({
  WebkitMaskImage: `url(/shapes/${shape}.svg)`, maskImage: `url(/shapes/${shape}.svg)`,
  WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
});

/** A photograph cut into an organic shape, with an offset patch of a logo colour behind it. */
export function Cutout({ src, alt = "", shape, patch, patchShape, className = "", ratio = "1 / 1", rotate = 0, width, height, eager }: {
  src: string; alt?: string; shape: Shape; patch: string; patchShape?: Shape; className?: string; ratio?: string; rotate?: number; width: number; height: number; eager?: boolean;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: ratio, transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
      <div aria-hidden="true" className="absolute inset-0 translate-x-[7%] translate-y-[6%] scale-[1.02]" style={{ ...mask(patchShape ?? shape), background: patch }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={width} height={height} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover" style={mask(shape)} />
    </div>
  );
}

/** Flat colour patch in a logo colour, decorative. */
export function Patch({ shape, color, className = "", style }: { shape: Shape; color: string; className?: string; style?: CSSProperties }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute ${className}`} style={{ ...mask(shape), background: color, ...style }} />;
}

export const STRIPES = "repeating-linear-gradient(-24deg,#d99a12 0 9px,#fff 9px 18px)";

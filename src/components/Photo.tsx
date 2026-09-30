"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo as PhotoT } from "@/content/types";

/**
 * A photograph that fills its (relatively positioned) parent.
 * If the image fails, a designed brand block shows instead of a broken box.
 * Placeholder photos carry a small honest label.
 */
export function Photo({
  photo,
  sizes = "100vw",
  priority,
  className = "",
  tag = true,
}: {
  photo: PhotoT;
  sizes?: string;
  priority?: boolean;
  className?: string;
  tag?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <>
      {failed ? (
        <div role="img" aria-label={photo.alt} className={`photo-fallback absolute inset-0 ${className}`} />
      ) : (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={`object-cover ${className}`}
        />
      )}
      {photo.placeholder && tag && (
        <span className="t-label pointer-events-none absolute bottom-3 left-3 rounded-full bg-indigo/85 px-3 py-2 text-[0.625rem] text-white">
          Placeholder photo
        </span>
      )}
    </>
  );
}

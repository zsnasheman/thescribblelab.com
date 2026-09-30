import Image from "next/image";
import { Art } from "./Art";
import type { ArtTone, ArtVariant, MediaItem } from "@/content/types";

/** One gallery item with its caption. Illustrations are drawn in code; photos use next/image. */
export function MediaFigure({
  m,
  art,
}: {
  m: MediaItem;
  art: { variant: ArtVariant; tone: ArtTone };
}) {
  if (!m.permissionToPublish) return null;
  return (
    <figure>
      <div className="overflow-hidden rounded-sm bg-indigo-10">
        {m.kind === "illustration" ? (
          <Art variant={art.variant} tone={art.tone} label={m.alt} className="aspect-[4/3] w-full" />
        ) : m.kind === "image" && m.src ? (
          <Image
            src={m.src}
            alt={m.alt}
            width={m.width ?? 1600}
            height={m.height ?? 1200}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="h-auto w-full"
          />
        ) : m.kind === "video" && m.src ? (
          <video
            src={m.src}
            poster={m.poster}
            controls
            preload="none"
            playsInline
            className="h-auto w-full"
            aria-label={m.alt}
          />
        ) : null}
      </div>
      <figcaption className="t-caption mt-2 text-indigo-80">
        {m.caption}
        {m.attribution ? ` Photo: ${m.attribution}.` : ""}
      </figcaption>
    </figure>
  );
}

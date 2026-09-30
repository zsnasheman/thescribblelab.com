import Image from "next/image";
import type { MediaItem, Photo as PhotoT } from "@/content/types";
import { Photo } from "./Photo";

/** One gallery item with its caption. Falls back to the project photo if the item has no file yet. */
export function MediaFigure({ m, fallback }: { m: MediaItem; fallback: PhotoT }) {
  if (!m.permissionToPublish) return null;
  return (
    <figure>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-indigo-10">
        {m.kind === "video" && m.src ? (
          <video src={m.src} poster={m.poster} controls preload="none" playsInline className="h-full w-full object-cover" aria-label={m.alt} />
        ) : m.src ? (
          <Image src={m.src} alt={m.alt} fill sizes="(min-width:1024px) 70vw, 100vw" className="object-cover" />
        ) : (
          <Photo photo={fallback} sizes="(min-width:1024px) 70vw, 100vw" />
        )}
      </div>
      <figcaption className="t-caption mt-2 text-indigo-80">
        {m.caption}{m.attribution ? ` Photo: ${m.attribution}.` : ""}
      </figcaption>
    </figure>
  );
}

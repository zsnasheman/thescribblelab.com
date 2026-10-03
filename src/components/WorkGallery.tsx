"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { PLACEHOLDER_IMAGES, type PlaceholderImage } from "@/content/placeholders";
import { kindLabel } from "@/content/media";

/** Image grid; each image opens large with its caption. Escape or Close returns focus to the image that opened it. */
export function WorkGallery({ items = PLACEHOLDER_IMAGES }: { items?: PlaceholderImage[] }) {
  const [open, setOpen] = useState<PlaceholderImage | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(null); opener.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); opener.current?.focus(); }
      if (e.key === "Tab") { const f = Array.from(document.querySelectorAll<HTMLElement>("#work-dialog a, #work-dialog button")); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((img, i) => (
          <li key={img.id} className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
            <button type="button" data-work={img.id} onClick={(e) => { opener.current = e.currentTarget; setOpen(img); }} className="group block w-full text-left" aria-label={`${img.title}. ${kindLabel(img)}. Open larger.`}>
              <span className="block overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i === 0 ? img.src : img.thumb} width={i === 0 ? img.w : 640} height={i === 0 ? img.h : 320} alt={img.alt} loading={i < 2 ? "eager" : "lazy"} decoding="async" className={`w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] ${i === 0 ? "aspect-[4/3]" : "aspect-[16/10]"}`} />
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-4"><span className="font-[family-name:var(--font-display)] text-2xl font-light">{img.title}</span><span className="t-label text-lavender">{kindLabel(img)}</span></span>
            </button>
          </li>
        ))}
      </ul>
      {open && (
        <div id="work-dialog" role="dialog" aria-modal="true" aria-label={open.title} className="on-dark fixed inset-0 z-[80] grid grid-rows-[1fr_auto] bg-[rgba(20,10,50,.96)] p-4 text-white md:p-8">
          <div className="grid min-h-0 place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.src} width={open.w} height={open.h} alt={open.alt} className="max-h-full max-w-full rounded-xl object-contain" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p><span className="font-[family-name:var(--font-display)] text-2xl font-light">{open.title}</span> <span className="t-label ml-2 text-white/85">{kindLabel(open)} · Placeholder image</span></p>
            <div className="flex gap-3"><Link href="/start-a-project?type=interiors" className="btn btn-coral">Start a project <Arrow /></Link><button ref={closeRef} type="button" onClick={close} className="btn btn-outline text-white">Close</button></div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Arrow } from "./ui";
import { SITE } from "@/lib/site";

const NAV: { href: string; label: string; also?: string[] }[] = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "What we do" },
  { href: "/studio", label: "Studio", also: ["/founder", "/approach"] },
  { href: "/contact", label: "Contact" },
];
const MORE = [
  { href: "/founder", label: "Founder" },
  { href: "/approach", label: "Our approach" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  const pathname = usePathname();
  // The menu is open only for the route it was opened on, so navigating closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isActive = (n: (typeof NAV)[number]) => [n.href, ...(n.also ?? [])].some((h) => pathname === h || pathname.startsWith(h + "/"));

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenAt(null); btnRef.current?.focus(); }
      if (e.key === "Tab" && panelRef.current) {
        const f = [btnRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a[href], button")].filter(Boolean) as HTMLElement[];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <header>
      {/* Logo row: scrolls away. The logo keeps its 200 px minimum and its clear space. */}
      <div className="container-x flex items-center justify-between gap-6 py-4 md:py-5">
        <Link href="/" aria-label="The Scribble Lab, home" className="block shrink-0"><Logo width={200} priority /></Link>
        <div className="hidden text-right md:block">
          <p className="font-[family-name:var(--font-display)] text-lg font-light leading-snug">{SITE.tagline}</p>
          <p className="t-caption mt-1 text-indigo-80">
            <a className="link" href={SITE.contact.phoneHref}>{SITE.contact.phone}</a>
            <span aria-hidden="true"> · </span>
            <a className="link" href={SITE.contact.whatsappHref} rel="noopener">WhatsApp</a>
          </p>
        </div>
      </div>

      {/* Navigation bar: sticky, but in the page flow, so it never covers content */}
      <div className="on-dark sticky top-0 z-50 bg-indigo text-white">
        <div className="container-x flex h-14 items-center justify-between gap-4">
          <nav aria-label="Main" className="hidden h-full items-stretch gap-8 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n) ? "page" : undefined}
                className="relative flex items-center text-[0.98rem] font-semibold no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-coral after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100">
                {n.label}
              </Link>
            ))}
          </nav>
          <button ref={btnRef} type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpenAt(open ? null : pathname)}
            className="btn btn-outline !min-h-10 !px-5 !py-1.5 text-white md:hidden">
            {open ? "Close" : "Menu"}
          </button>
          <Link href="/start-a-project" aria-current={pathname.startsWith("/start-a-project") ? "page" : undefined} className="btn btn-coral !min-h-10 !px-5 !py-1.5">
            Start a project
          </Link>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" ref={panelRef} className="on-dark fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-indigo text-white md:hidden" style={{ top: "3.5rem" }}>
          <nav aria-label="Mobile" className="container-x flex flex-col pb-10 pt-4">
            {[{ href: "/", label: "Home" }, ...NAV, ...MORE].map((n) => (
              <Link key={n.href} href={n.href} aria-current={pathname === n.href ? "page" : undefined}
                className="flex items-center justify-between border-b border-white/20 py-4 font-[family-name:var(--font-display)] text-3xl font-light no-underline aria-[current=page]:text-coral">
                {n.label}<Arrow />
              </Link>
            ))}
            <p className="t-caption mt-8 text-white/80">{SITE.tagline}</p>
          </nav>
        </div>
      )}
    </header>
  );
}

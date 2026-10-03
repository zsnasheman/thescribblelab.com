"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Arrow } from "./ui";
import { SITE } from "@/lib/site";

const NAV: { href: string; label: string; also?: string[] }[] = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio", also: ["/approach"] },
  { href: "/founder", label: "Founder" },
  { href: "/contact", label: "Contact" },
];
const MORE = [
  { href: "/services", label: "What we do" },
  { href: "/approach", label: "Our approach" },
  { href: "/privacy", label: "Privacy" },
];

/**
 * The navigation belongs to the opening composition: the full logo sits at the upper left of the page
 * and scrolls away with it; a compact bar (Home plus the same routes and project action) takes over.
 */
export function Header() {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const [scrolled, setScrolled] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isActive = (n: (typeof NAV)[number]) => [n.href, ...(n.also ?? [])].some((h) => pathname === h || pathname.startsWith(h + "/"));

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 230));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const close = () => { setOpenAt(null); opener.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenAt(null); opener.current?.focus(); }
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button"));
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  const links = (extra?: React.ReactNode) => (
    <>
      {extra}
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} aria-current={isActive(n) ? "page" : undefined} className="nav-link">{n.label}</Link>
      ))}
    </>
  );
  const project = (
    <Link href="/start-a-project" aria-current={pathname.startsWith("/start-a-project") ? "page" : undefined} className="btn btn-coral !min-h-11 whitespace-nowrap !px-5 !py-2 !text-[0.95rem]">
      Start a project
    </Link>
  );
  const menuBtn = (
    <button type="button" aria-expanded={open} aria-controls="mobile-menu"
      onClick={(e) => { opener.current = e.currentTarget; setOpenAt(pathname); }}
      className="btn btn-outline !min-h-11 !bg-paper !px-5 !py-2 md:hidden">
      Menu
    </button>
  );

  return (
    <>
      {/* Opening navigation: sits over the page artwork, not in a strip of its own */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="container-x flex items-start justify-between gap-4 pt-4 md:pt-6">
          <Link href="/" aria-label="The Scribble Lab, home" className="block shrink-0 rounded-2xl bg-paper p-2.5 shadow-[0_8px_30px_rgba(20,10,50,.18)]">
            <Logo priority className="h-auto w-[13rem] min-w-[200px] lg:w-[17rem]" />
          </Link>
          <nav aria-label="Main" className="glass mt-1 hidden items-center gap-3 rounded-full py-1 pl-4 pr-1.5 shadow-[0_8px_30px_rgba(20,10,50,.15)] md:flex lg:gap-8">
            {links()}
            {project}
          </nav>
          <div className="mt-2 md:hidden">{menuBtn}</div>
        </div>
      </header>

      {/* Compact bar once the page has scrolled: same routes and project action, plus an accessible Home link */}
      <div className={`fixed inset-x-0 top-0 z-50 border-b border-indigo/15 bg-paper/95 backdrop-blur transition-[transform,visibility] duration-300 ${scrolled ? "visible translate-y-0" : "invisible -translate-y-full"}`}>
        <div className="container-x flex h-14 items-center justify-between gap-3">
          <Link href="/" className="nav-link" aria-label="Home, The Scribble Lab">Home</Link>
          <nav aria-label="Compact" className="hidden items-center gap-7 md:flex">{links()}</nav>
          <div className="flex items-center gap-2">{project}<div className="md:hidden">{menuBtn}</div></div>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu" className="on-dark fixed inset-0 z-[70] overflow-y-auto bg-indigo text-white md:hidden">
          <div className="container-x flex h-16 items-center justify-between">
            <span className="t-label text-white/85">Menu</span>
            <button ref={closeRef} type="button" onClick={close} className="btn btn-outline !min-h-11 !px-5 !py-2 text-white">Close</button>
          </div>
          <nav aria-label="Mobile" className="container-x flex flex-col pb-10 pt-2">
            {[{ href: "/", label: "Home" }, ...NAV, ...MORE].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpenAt(null)} aria-current={pathname === n.href ? "page" : undefined}
                className="flex min-h-14 items-center justify-between border-b border-white/20 py-3 font-[family-name:var(--font-display)] text-3xl font-semibold no-underline aria-[current=page]:text-coral">
                {n.label}<Arrow />
              </Link>
            ))}
            <Link href="/start-a-project" className="btn btn-coral btn-lg mt-8">Start a project <Arrow /></Link>
            <p className="t-caption mt-8 text-white/80">{SITE.contact.phone} · {SITE.contact.email}</p>
          </nav>
        </div>
      )}
    </>
  );
}

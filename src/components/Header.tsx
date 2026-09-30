"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Arrow } from "./ui";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "What we do" },
  { href: "/studio", label: "Studio" },
];

export function Header() {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = (h: string) => pathname === h || pathname.startsWith(h + "/");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 260);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

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

  const toggle = () => setOpenAt(open ? null : pathname);

  return (
    <>
      {/* Top of page: the logo gets room to breathe (200 px minimum, clear space kept) */}
      <header className="container-x flex items-center justify-between gap-6 py-4 md:py-6">
        <Link href="/" aria-label="The Scribble Lab, home" className="block shrink-0">
          <Logo width={200} priority />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
              className="draw-link py-2 text-[1.05rem] font-semibold no-underline">
              {n.label}
            </Link>
          ))}
          <Link href="/start-a-project" className="btn btn-coral">Start a project</Link>
        </nav>
      </header>

      {/* Mobile: Menu stays reachable at the top right at all times */}
      <div className="fixed right-3 top-3 z-50 md:hidden">
        <button ref={btnRef} type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={toggle}
          className="btn btn-indigo !min-h-12 !px-6 shadow-lg">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {/* Desktop: a floating pill appears once you scroll, so navigation is always close */}
      <nav
        aria-label="Quick navigation"
        className={`on-dark fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-indigo p-1.5 pl-6 text-white shadow-xl transition-all duration-500 ease-[var(--ease-out-expo)] md:flex ${
          scrolled ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-20 opacity-0"
        }`}
        aria-hidden={!scrolled}
      >
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} tabIndex={scrolled ? 0 : -1}
            className={`rounded-full px-4 py-2 text-[0.95rem] font-semibold no-underline transition-colors hover:bg-white/15 ${active(n.href) ? "bg-white/15" : ""}`}>
            {n.label}
          </Link>
        ))}
        <Link href="/start-a-project" tabIndex={scrolled ? 0 : -1} className="btn btn-coral !min-h-10 !px-5 !py-2">Start a project</Link>
      </nav>

      {open && (
        <div id="mobile-menu" ref={panelRef} className="on-dark fixed inset-0 z-40 overflow-y-auto bg-indigo text-white md:hidden" style={{ height: "100dvh" }}>
          <nav aria-label="Mobile" className="container-x flex min-h-full flex-col justify-center gap-1 pb-10 pt-24">
            {[{ href: "/", label: "Home" }, ...NAV].map((n, i) => (
              <Link key={n.href} href={n.href} aria-current={pathname === n.href ? "page" : undefined}
                className="group flex items-baseline justify-between border-b border-white/20 py-5 font-[family-name:var(--font-display)] text-5xl font-light no-underline">
                <span>{n.label}</span><span className="t-label text-white/80 tabular-nums">0{i + 1}</span>
              </Link>
            ))}
            <Link href="/start-a-project" className="btn btn-coral btn-lg mt-10 self-start">Start a project <Arrow /></Link>
            <p className="t-caption mt-10 text-white/80">Ideas. People. Places. A brighter tomorrow.</p>
          </nav>
        </div>
      )}
    </>
  );
}

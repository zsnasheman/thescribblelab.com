"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "What we do" },
  { href: "/studio", label: "Studio" },
];

export function Header() {
  const pathname = usePathname();
  // Menu is open only for the route it was opened on, so navigating closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean | ((x: boolean) => boolean)) =>
    setOpenAt((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close, simple focus containment, and body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenAt(null);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = [
          btnRef.current,
          ...panelRef.current.querySelectorAll<HTMLElement>("a[href], button"),
        ].filter(Boolean) as HTMLElement[];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-indigo/10 bg-paper/95 backdrop-blur-sm">
      <div className="container-x flex items-center justify-between gap-6 py-3">
        <Link href="/" aria-label="The Scribble Lab, home" className="block shrink-0 py-1">
          <Logo variant="lockup-indigo" width={132} priority />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`py-2 text-[0.95rem] font-semibold transition-colors hover:text-lavender ${
                active(n.href) ? "link" : "no-underline"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/start-a-project" className="btn btn-coral !min-h-11 !py-2">
            Start a project
          </Link>
        </nav>

        <button
          ref={btnRef}
          type="button"
          className="btn btn-outline !min-h-11 !px-4 !py-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="on-dark fixed inset-x-0 bottom-0 top-[var(--header-h,4.25rem)] z-40 overflow-y-auto bg-indigo text-white md:hidden"
          style={{ height: "calc(100dvh - 4.25rem)" }}
        >
          <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-8">
            {[{ href: "/", label: "Home" }, ...NAV].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="font-[family-name:var(--font-display)] border-b border-white/15 py-4 text-3xl font-light"
                aria-current={pathname === n.href ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
            <Link href="/start-a-project" className="btn btn-coral mt-8 self-start">
              Start a project
            </Link>
            <p className="t-caption mt-10 text-white/75">
              Ideas. People. Places. A brighter tomorrow.
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}

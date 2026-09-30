"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Arrow } from "./ui";

/** The closing invitation. Hidden on the brief and contact pages, where it would only repeat the page. */
export function FooterCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/start-a-project") || pathname.startsWith("/contact")) return null;
  return (
    <div className="container-x grid items-center gap-10 py-14 md:grid-cols-12 md:py-20">
      <div className="md:col-span-7">
        <p className="t-label text-lavender">Let&rsquo;s talk</p>
        <h2 className="t-h1 mt-4 max-w-[18ch]">What are you imagining?</h2>
        <p className="t-lead mt-5 measure">Share a short brief, or start with a quick message. Either way, a person reads it.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/start-a-project" className="btn btn-coral">Start a project <Arrow /></Link>
          <Link href="/contact" className="btn btn-outline">Contact us</Link>
        </div>
      </div>
      {/* The full-colour logo always sits on a light field with its clear space kept */}
      <div className="md:col-span-5 md:justify-self-end"><Logo width={300} /></div>
    </div>
  );
}

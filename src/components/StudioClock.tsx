"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/** A small human touch: the current time at the Dubai studio. No claims about opening hours. */
export function StudioClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: SITE.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <p className="t-caption text-white/80">
      Studio time in Dubai: <span className="font-semibold text-white tabular-nums">{time ?? "--:--"}</span>
    </p>
  );
}

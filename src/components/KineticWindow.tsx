"use client";

import { useState } from "react";
import { C } from "@/lib/colors";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Mode = "still" | "running" | "paused";

export function KineticWindow() {
  const [mode, setMode] = useState<Mode>("still");
  const [pose, setPose] = useState<1 | 2 | 3>(1);
  const reduced = usePrefersReducedMotion();

  const running = mode === "running";
  const cls = mode === "still" ? "" : mode === "paused" ? "kin-anim kin-paused" : "kin-anim";
  const poseNames = ["Start position", "Panels open, disc lifted", "Closing again"];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="t-label text-white/80">Signature capability</p>
        <h2 className="t-h1 mt-4">A window that changes as people walk past.</h2>
        <p className="t-lead mt-5 max-w-[40ch] text-white/90">
          Kinetic windows are part set design, part engineering. Two panels slide on rails while a
          pendant disc rises and swings. One full movement takes fourteen seconds, so a passer-by
          catches the whole change.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {!reduced ? (
            <>
              <button
                type="button"
                className="btn btn-coral"
                onClick={() => setMode(running ? "paused" : "running")}
              >
                {mode === "still" ? "Set it in motion" : running ? "Pause" : "Resume"}
              </button>
              <button
                type="button"
                className="btn btn-outline text-white"
                onClick={() => setMode("still")}
                disabled={mode === "still"}
              >
                Reset
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-coral"
                onClick={() => setPose((p) => ((p % 3) + 1) as 1 | 2 | 3)}
              >
                Show next position
              </button>
              <button type="button" className="btn btn-outline text-white" onClick={() => setPose(1)} disabled={pose === 1}>
                Reset
              </button>
            </>
          )}
        </div>
        <p className="t-caption mt-4 text-white/85" aria-live="polite">
          {reduced
            ? `Position ${pose} of 3: ${poseNames[pose - 1]}. Movement is reduced on this device, so you step through it.`
            : mode === "still"
              ? "Press the button to start the movement. You can pause or reset at any time."
              : running
                ? "Moving. One full cycle takes about fourteen seconds."
                : "Paused."}
        </p>
        <p className="t-caption mt-2 text-white/70">
          This is an illustration of a kinetic window, not a completed client installation.
        </p>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-md bg-paper p-3 text-indigo">
          <svg
            viewBox="0 0 400 300"
            role="img"
            aria-label="Illustration of a shop window. Two panels slide on rails and a pendant disc rises and swings."
            className={`block h-auto w-full rounded-sm ${cls}`}
            data-pose={reduced || mode === "still" ? String(reduced ? pose : 1) : undefined}
          >
            <rect width="400" height="300" fill={C.indigo} />
            <rect y="242" width="400" height="58" fill="#231746" />
            {/* glow behind the disc */}
            <g data-kin="glow">
              <circle cx="200" cy="120" r="64" fill={C.paper} opacity=".16" />
            </g>
            {/* rails */}
            <rect x="52" y="60" width="296" height="4" fill="#fff" opacity=".75" />
            <rect x="52" y="160" width="296" height="4" fill="#fff" opacity=".75" />
            {/* panels */}
            <g data-kin="a">
              <rect x="74" y="64" width="86" height="92" fill={C.coral} />
            </g>
            <g data-kin="b">
              <rect x="236" y="168" width="98" height="68" fill={C.lavender} />
            </g>
            {/* pendant disc: lift then swing */}
            <g data-kin="lift">
              <g data-kin="swing">
                <line x1="200" y1="24" x2="200" y2="104" stroke="#fff" strokeWidth="2" />
                <circle cx="200" cy="120" r="24" fill={C.mustard} />
              </g>
            </g>
            {/* plinth and product forms */}
            <rect x="170" y="206" width="60" height="36" fill={C.paper} />
            <circle cx="200" cy="194" r="11" fill={C.emerald} />
            {/* glazing frame */}
            <rect x="40" y="18" width="320" height="224" fill="none" stroke="#fff" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

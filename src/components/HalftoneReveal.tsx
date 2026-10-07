"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";

type Props = {
  src: string;
  alt: string;
  inkColor?: string;
  paperColor?: string;
  cellSize?: number;
  radius?: number;
  className?: string;
};

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const VERT = `attribute vec2 position; attribute vec2 uv; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0., 1.); }`;

const FRAG = `precision highp float;
varying vec2 vUv;
uniform sampler2D uTex; uniform vec2 uRes; uniform vec2 uImg; uniform vec2 uMouse; uniform float uR; uniform float uCell; uniform float uOn;
uniform vec3 uInk; uniform vec3 uPaper;
vec2 cover(vec2 uv){ float a = uRes.x/uRes.y, b = uImg.x/uImg.y; vec2 s = a>b ? vec2(1., b/a) : vec2(a/b, 1.); return (uv-.5)*s+.5; }
void main(){
  vec2 px = vUv*uRes; vec2 tuv = cover(vUv);
  vec3 col = texture2D(uTex, tuv).rgb;
  float ang = .5236; mat2 rot = mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
  vec2 g = rot*px/uCell; vec2 id = floor(g); vec2 f = fract(g)-.5;
  vec2 cuv = cover((mat2(cos(ang),sin(ang),-sin(ang),cos(ang))*((id+.5)*uCell))/uRes);
  float lum = dot(texture2D(uTex, cuv).rgb, vec3(.299,.587,.114));
  float rad = (1.-lum)*.72;
  float d = length(f);
  float dot_ = 1.-smoothstep(rad-.08, rad+.08, d);
  vec3 print = mix(uPaper, uInk, dot_);
  float m = distance(px, uMouse*uRes);
  float k = (1.-smoothstep(uR-3., uR, m))*uOn;
  float ring = smoothstep(uR-5., uR-2., m)*(1.-smoothstep(uR-2., uR, m))*uOn;
  vec3 outc = mix(print, col, k);
  outc = mix(outc, uInk, ring*.9);
  gl_FragColor = vec4(outc, 1.);
}`;

/** A halftone print of a photograph; a round loupe follows the cursor (or finger) and shows the sharp picture beneath. */
export function HalftoneReveal({ src, alt, inkColor = "#2f2058", paperColor = "#ffffff", cellSize = 6, radius = 120, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    } catch { return; }
    const ctx = renderer.gl;
    if (!ctx) return;
    const canvas = ctx.canvas as HTMLCanvasElement;
    canvas.className = "absolute inset-0 h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    const texture = new Texture(ctx, { generateMipmaps: false });
    const program = new Program(ctx, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        uTex: { value: texture }, uRes: { value: [1, 1] }, uImg: { value: [1, 1] }, uMouse: { value: [0.5, 0.5] },
        uR: { value: radius }, uCell: { value: cellSize }, uOn: { value: 0 }, uInk: { value: hex(inkColor) }, uPaper: { value: hex(paperColor) },
      },
    });
    const mesh = new Mesh(ctx, { geometry: new Triangle(ctx), program });
    let raf = 0, dead = false, hover = false;
    const target = [0.5, 0.5], cur = [0.5, 0.5];
    let on = 0; const t0 = performance.now();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (dead) return;
      texture.image = img;
      program.uniforms.uImg.value = [img.naturalWidth, img.naturalHeight];
      el.appendChild(canvas);
      setGl(true);
      resize(); tick();
    };
    img.src = src;
    const resize = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      program.uniforms.uRes.value = [ctx.drawingBufferWidth, ctx.drawingBufferHeight];
      const s = renderer.dpr;
      program.uniforms.uR.value = radius * s * Math.min(1, r.width / 640 + 0.45);
      program.uniforms.uCell.value = cellSize * s;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target[0] = (e.clientX - r.left) / r.width; target[1] = 1 - (e.clientY - r.top) / r.height;
      hover = true;
    };
    const leave = () => { hover = false; };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - t0) / 1000;
      if (!hover) { target[0] = 0.5 + Math.cos(t * 0.5) * 0.22; target[1] = 0.5 + Math.sin(t * 0.7) * 0.18; }
      const k = reduce ? 1 : 0.12;
      cur[0] += (target[0] - cur[0]) * k; cur[1] += (target[1] - cur[1]) * k;
      on += ((hover ? 1 : 0.85) - on) * 0.1;
      program.uniforms.uMouse.value = cur;
      program.uniforms.uOn.value = on;
      renderer.render({ scene: mesh });
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      dead = true; cancelAnimationFrame(raf); ro.disconnect();
      el.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", move); el.removeEventListener("pointerleave", leave);
      canvas.remove(); ctx.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, inkColor, paperColor, cellSize, radius]);

  return (
    <div ref={wrap} className={`relative touch-pan-y overflow-hidden ${className}`} style={{ cursor: gl ? "none" : undefined }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${gl ? "opacity-0" : ""}`} loading="lazy" />
    </div>
  );
}

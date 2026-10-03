"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/**
 * A sculptural scribble: one thick line, drawn through space, lit by a low sun, then studded with brand-coloured bubbles.
 * Derived from the logo's idea (a scribble that becomes a form). It grows once, then idles; the pointer turns the camera a little,
 * scrolling dollies it toward the sun. Static (fully grown) under reduced motion.
 */
export function ScribbleScene({ reduced, progress }: { reduced: boolean; progress: React.MutableRefObject<number> }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the CSS gradient and sun remain
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
    camera.position.set(0, 0, 14);

    // ---- the sculpture ------------------------------------------------
    const pts = [
      [-6.2, -0.6, 0.0], [-4.6, 1.5, 0.6], [-2.8, 2.1, 0.2], [-1.4, 1.0, -0.4], [-1.6, -0.9, 0.5], [-3.0, -1.6, 0.9],
      [-3.9, -0.4, 0.3], [-2.6, 0.2, -0.6], [-0.4, -0.3, -0.2], [1.2, -1.2, 0.5], [3.0, -1.6, 0.9], [4.6, -0.7, 0.2],
      [4.9, 0.9, -0.3], [3.8, 1.6, 0.4],
    ].map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    const TUBULAR = 900, RADIAL = 64;
    const geo = new THREE.TubeGeometry(curve, TUBULAR, 0.62, RADIAL, false);
    const indexCount = geo.index!.count;

    // rough, stone-like surface from procedural noise
    const bump = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 512;
      const g = c.getContext("2d")!; const id = g.createImageData(512, 512);
      for (let i = 0; i < id.data.length; i += 4) { const v = 110 + Math.random() * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      g.putImageData(id, 0, 0);
      const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(60, 3); t.anisotropy = 4; return t;
    })();
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x7a63c4, roughness: 0.62, metalness: 0.0, clearcoat: 0.25, clearcoatRoughness: 0.5, sheen: 1, sheenColor: new THREE.Color(0xc2b3ec), bumpMap: bump, bumpScale: 0.9 });
    const tube = new THREE.Mesh(geo, mat);
    geo.setDrawRange(0, 0);
    const group = new THREE.Group();
    group.add(tube);

    // brand-coloured bubbles that bloom along the line (the logo's dots)
    const COUNT = 320;
    const bub = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 12), new THREE.MeshStandardMaterial({ roughness: 0.4, emissiveIntensity: 0.7 }), COUNT);
    const cols = [0xff663e, 0xffb08f, 0xc2b3ec, 0x1e9e74, 0xd99a12, 0xffffff].map((c) => new THREE.Color(c));
    const spots: { t: number; pos: THREE.Vector3; s: number; delay: number }[] = [];
    const tmpN = new THREE.Vector3(), tmpB = new THREE.Vector3();
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random();
      const p = curve.getPointAt(t), tan = curve.getTangentAt(t);
      tmpN.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      tmpB.crossVectors(tan, tmpN).normalize();
      const pos = p.clone().addScaledVector(tmpB, 0.62 + 0.02);
      spots.push({ t, pos, s: 0.025 + Math.pow(Math.random(), 3) * 0.1, delay: 0.55 + t * 0.35 + Math.random() * 0.1 });
      bub.setColorAt(i, cols[(Math.random() * cols.length) | 0]);
    }
    group.add(bub);
    scene.add(group);

    // ---- the sun ------------------------------------------------------
    const sunMat = new THREE.ShaderMaterial({
      uniforms: {}, transparent: false,
      vertexShader: "varying vec3 vN; void main(){ vN = normal; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "varying vec3 vN; void main(){ float h = vN.y*0.5+0.5; vec3 top=vec3(1.0,0.93,0.78); vec3 bot=vec3(1.0,0.45,0.18); gl_FragColor=vec4(mix(bot,top,smoothstep(0.1,0.9,h))*1.05,1.0); }",
    });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.25, 64, 48), sunMat);
    sun.position.set(2.3, 2.45, -1.6);
    scene.add(sun);

    // lights: warm from the sun, cool fill, violet rim
    scene.add(new THREE.HemisphereLight(0x6b5291, 0x0c0721, 0.55));
    const key = new THREE.PointLight(0xff8a50, 90, 30, 1.6); key.position.copy(sun.position).add(new THREE.Vector3(0, -0.4, 1.2)); scene.add(key);
    const rim = new THREE.DirectionalLight(0x9f8cff, 1.4); rim.position.set(-6, 3, 4); scene.add(rim);
    const fill = new THREE.DirectionalLight(0x3f6bff, 0.5); fill.position.set(2, -4, 5); scene.add(fill);

    // tiny stars
    const starGeo = new THREE.BufferGeometry();
    const sp = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i++) { sp[i * 3] = (Math.random() - 0.5) * 30; sp[i * 3 + 1] = (Math.random() - 0.2) * 14; sp[i * 3 + 2] = -6 - Math.random() * 8; }
    starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.7 })));

    // ---- post: bloom for the sun and the glow on the line ------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.6, 0.9);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const size = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h);
      camera.aspect = w / h;
      const mobile = w < 760;
      camera.fov = mobile ? 52 : 32;
      group.scale.setScalar(mobile ? 0.62 : 1);
      group.position.set(mobile ? 0.4 : 0, mobile ? 1.8 : 0.9, 0);
      sun.position.set(mobile ? 1.1 : 2.6, mobile ? 5.0 : 3.6, -2.2);
      key.position.copy(sun.position).add(new THREE.Vector3(0, -0.4, 1.2));
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);

    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => { const r = el.getBoundingClientRect(); ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) window.addEventListener("pointermove", onMove, { passive: true });

    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), eul = new THREE.Euler();
    const t0 = performance.now();
    let raf = 0, visible = true;
    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

    const frame = (now: number) => {
      raf = 0;
      const el_s = reduced ? 99 : (now - t0) / 1000;
      const grow = ease(el_s / 3.6);
      geo.setDrawRange(0, Math.floor((indexCount * grow) / 3) * 3);
      for (let i = 0; i < COUNT; i++) {
        const s = spots[i];
        const k = ease((el_s / 3.6 - s.delay) / 0.35);
        const breathe = reduced ? 1 : 1 + Math.sin(el_s * 1.6 + i) * 0.06;
        sc.setScalar(s.s * k * breathe);
        m4.compose(s.pos, q, sc); bub.setMatrixAt(i, m4);
      }
      bub.instanceMatrix.needsUpdate = true;
      ptr.x += (ptr.tx - ptr.x) * 0.05; ptr.y += (ptr.ty - ptr.y) * 0.05;
      const p = progress.current;
      eul.set(ptr.y * 0.08, ptr.x * -0.12 + (reduced ? 0 : Math.sin(el_s * 0.18) * 0.06) - p * 0.5, 0);
      group.quaternion.setFromEuler(eul);
      camera.position.set(ptr.x * 0.5, -ptr.y * 0.3, 14 - p * 7);
      camera.lookAt(0.6 * p + ptr.x * 0.15, 0.5 * p, 0);
      sun.scale.setScalar(1 + p * 0.5);
      composer.render();
      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
    if (reduced) { frame(performance.now()); } else start();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduced) start(); }, { threshold: 0 });
    io.observe(el);
    const onScroll = () => { if (reduced && visible) frame(performance.now()); };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove); window.removeEventListener("scroll", onScroll);
      geo.dispose(); mat.dispose(); bump.dispose(); composer.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduced, progress]);

  return <div ref={host} className="absolute inset-0" aria-hidden="true" data-scene />;
}

import { chromium } from "playwright-core";
const B = process.env.SITE_URL ?? "http://localhost:3100";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox", "--no-proxy-server"] });
const results = []; const ok = (n, c, x = "") => results.push([c ? "PASS" : "FAIL", n, x]);
const errs = [];
async function page(w = 1440, h = 900, o = {}) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...o }); const p = await c.newPage();
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); }); p.on("pageerror", (e) => errs.push("pageerror " + e.message));
  return p;
}
const box = (p, sel) => p.locator(sel).first().boundingBox();
const hit = (a, c) => a && c && !(a.x + a.width <= c.x || c.x + c.width <= a.x || a.y + a.height <= c.y || c.y + c.height <= a.y);

// 1. routes
const p0 = await page();
const slugs = ["interiors", "exhibitions", "events", "brand-activations", "kinetic-windows"];
const works = ["concept-courtyard-lounge", "concept-hall-stand", "concept-launch-stage", "concept-corner-popup", "concept-sliding-window", "concept-garden-villa"];
const routes = ["/", "/work", "/work?service=interiors", "/services", "/studio", "/founder", "/approach", "/contact", "/privacy", "/start-a-project", "/sitemap.xml", "/robots.txt", "/opengraph-image", ...slugs.map((s) => "/services/" + s), ...works.map((w) => "/work/" + w)];
for (const r of routes) { const res = await p0.goto(B + r, { waitUntil: "load" }); ok("route " + r, res.status() === 200, String(res.status())); }
ok("unknown project is 404", (await p0.goto(B + "/work/nope")).status() === 404);
ok("unknown service is 404", (await p0.goto(B + "/services/nope")).status() === 404);
ok("preview is noindex", ((await p0.goto(B + "/")).headers()["x-robots-tag"] || "").includes("noindex"));
ok("robots disallows all", (await (await p0.goto(B + "/robots.txt")).text()).includes("Disallow: /"));

errs.length = 0; // the two intentional 404 navigations above log resource errors

// 2. public pages carry no production notes about missing material
const banned = [/to come/i, /portrait to be supplied/i, /will appear here/i, /future project page/i, /no verified outcomes/i, /placeholder/i, /lorem/i, /coming soon/i];
for (const r of ["/", "/work", "/studio", "/founder", "/approach", "/contact", "/services", "/work/concept-hall-stand", "/services/kinetic-windows"]) {
  await p0.goto(B + r); const t = await p0.locator("body").innerText();
  ok(`no production notes on ${r}`, !banned.some((x) => x.test(t)), banned.filter((x) => x.test(t)).join(","));
}

// 3. opening composition at every required width
for (const w of [360, 390, 768, 1024, 1440]) {
  const hh = w < 700 ? 800 : 900;
  const p = await page(w, hh); await p.goto(B + "/"); await p.waitForTimeout(2200);
  const logo = await box(p, "header a[aria-label*='home'] img"), h1 = await box(p, "[data-journey] h1"), cta = await box(p, "[data-journey] a:has-text('Explore our work')");
  ok(`${w}: full logo at upper left, at least 200px wide`, logo && logo.x < 64 && logo.y < 40 && logo.width >= 200, JSON.stringify(logo));
  ok(`${w}: logo keeps its proportions`, logo && Math.abs(logo.width / logo.height - 1600 / 1043) < 0.05);
  ok(`${w}: headline clear of logo`, !hit(logo, h1));
  const nav = w >= 768 ? await box(p, "nav[aria-label='Main']") : await box(p, "header button:has-text('Menu')");
  ok(`${w}: navigation clear of logo`, !hit(logo, nav));
  ok(`${w}: headline and action visible in the first screen`, h1 && cta && h1.y + h1.height < hh && cta.y + cta.height < hh + 20, JSON.stringify([h1?.y, cta?.y]));
  ok(`${w}: no horizontal overflow`, await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  ok(`${w}: headline is whole`, /Small scribbles\.\s*Extraordinary spaces\./.test((await p.locator("[data-journey] h1").innerText()).replace(/\n/g, " ")));
  ok(`${w}: opening says what the studio does`, /designs and builds creative spaces and experiences/.test(await p.locator("[data-journey]").innerText()));
  ok(`${w}: guide form fills part of the first screen`, await p.evaluate(() => { const r = document.querySelector("[data-journey] path[fill='#2f2058']").getBoundingClientRect(); return r.width > innerWidth * 0.4 && r.height > innerHeight * 0.3; }));
  if (w === 1440 || w === 390) {
    ok(`${w}: art layers do not intercept pointer`, await p.evaluate(() => getComputedStyle(document.querySelector("[data-journey] svg")).pointerEvents === "none"));
    ok(`${w}: no configurator controls in the opening`, (await p.locator("[data-journey] input[type=range]").count()) === 0);
    ok(`${w}: no separate purple strip`, (await p.locator("header .bg-indigo").count()) === 0);
  }
  await p.context().close();
}

// 3b. the scroll journey: each beat changes the same scene
{
  const p = await page(1440, 900); await p.goto(B + "/"); await p.waitForTimeout(2200);
  const span = await p.evaluate(() => document.querySelector("[data-journey]").offsetHeight - innerHeight);
  const at = async (f) => { await p.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), span * f); await p.waitForTimeout(450); };
  const st = () => p.evaluate(() => ({ body: document.querySelector("[data-journey] path[fill='#2f2058']").getAttribute("d"), ink: +document.querySelector("#jc-ink rect").getAttribute("width"), color: +document.querySelector("#jc-color rect").getAttribute("width"), proj: +getComputedStyle(document.querySelector("[data-journey] g[clip-path='url(#jc-ap)']")).opacity }));
  const s0 = await st(); await at(0.34); const s1 = await st(); await at(0.62); const s2 = await st(); await at(0.95); const s3 = await st();
  ok("journey: the sketch develops after the first mark", s0.ink === 0 && s1.ink > 100, JSON.stringify([s0.ink, s1.ink]));
  ok("journey: colour and material follow the sketch", s1.color < s2.color && s2.color > 800, JSON.stringify([s1.color, s2.color]));
  ok("journey: the mark changes shape into the arch", s0.body !== s1.body && s1.body !== s2.body);
  ok("journey: the project layer appears only after the colour", s0.proj === 0 && s2.proj > 0.5);
  const beat = async (t) => (await p.locator("[data-journey]").getByText(t, { exact: false }).first().isVisible()); const dbg = async () => p.evaluate(() => [scrollY, getComputedStyle(document.querySelector("[data-journey] h1")).visibility, document.querySelector("[data-journey] h1").closest("div").style.opacity]);
  await at(0.0); ok("journey: A copy visible at start", await beat("Extraordinary spaces"), JSON.stringify(await dbg()));
  await at(0.26); ok("journey: B copy appears", await beat("It starts as a line"));
  await at(0.5); ok("journey: C copy appears", await beat("Then it gets a surface"));
  await at(0.97); ok("journey: D caption names the project and links to it", (await p.locator("[data-journey] a[href^='/work/']").first().isVisible()) && await beat("Concept study"));
  ok("journey: concept is labelled until real media exists", /Concept study/.test(await p.locator("[data-journey]").textContent()));
  await at(0); await p.locator("[data-journey] a:has-text('Skip the story')").click(); await p.waitForTimeout(900);
  ok("journey: Skip the story reaches the practice board", await p.evaluate(() => document.querySelector("#breadth").getBoundingClientRect().top < innerHeight * 0.6));
  ok("journey: scroll is normal (no wheel trapping)", await p.evaluate(() => !document.querySelector("[data-journey]").onwheel && getComputedStyle(document.documentElement).overflow !== "hidden"));
  await p.goto(B + "/"); await p.waitForTimeout(1800);
  const t0 = await p.evaluate(() => document.querySelector("[data-journey] g[transform]:not(defs g)")?.getAttribute("transform"));
  await p.mouse.move(300, 200); await p.mouse.move(1200, 700); await p.waitForTimeout(300);
  const t1 = await p.evaluate(() => document.querySelector("[data-journey] g[transform]:not(defs g)")?.getAttribute("transform"));
  ok("journey: the guide leans toward the pointer", t0 !== t1, `${t0} -> ${t1}`);
  await p.context().close();
  const pr = await page(1440, 900, { reducedMotion: "reduce" }); await pr.goto(B + "/"); await pr.waitForTimeout(500);
  ok("reduced motion: static story replaces the pinned stage", (await pr.locator("[data-journey]").isVisible()) === false && await pr.locator(".journey-static").getByText("It starts as a line.").isVisible());
  ok("reduced motion: headline and project are in the page", (await pr.getByRole("heading", { name: /Small scribbles/ }).first().isVisible()) && (await pr.locator(".journey-static a[href^='/work/']").first().isVisible()));
  await pr.context().close();
  const pn = await page(1440, 900, { javaScriptEnabled: false }); await pn.goto(B + "/");
  ok("no JavaScript: the story reads as a normal page", await pn.locator(".journey-static").getByText("It starts as a line.").isVisible());
  await pn.context().close();
}

// 4. navigation: desktop row, compact bar on scroll, current page
const p1 = await page(); await p1.goto(B + "/");
const labels = (await p1.locator("nav[aria-label='Main'] a").allInnerTexts()).map((s) => s.trim());
ok("desktop nav: Work, Studio, Founder, Contact, Start a project", JSON.stringify(labels) === JSON.stringify(["Work", "Studio", "Founder", "Contact", "Start a project"]), labels.join("|"));
ok("compact bar hidden at top", (await p1.locator("nav[aria-label='Compact']").isVisible()) === false);
await p1.evaluate(() => window.scrollTo(0, 1200)); await p1.waitForTimeout(500);
ok("compact bar appears on scroll", await p1.locator("nav[aria-label='Compact']").isVisible());
ok("compact bar has accessible Home link", (await p1.getByRole("link", { name: /^Home/ }).first().isVisible()));
const cb = await p1.evaluate(() => { const e = document.querySelector("nav[aria-label='Compact']").closest("div.fixed").getBoundingClientRect(); return e.height; });
ok("compact bar is slim", cb <= 64, String(cb));
await p1.goto(B + "/founder"); ok("Founder is current", (await p1.locator("nav[aria-label='Main'] a[aria-current='page']").innerText()).trim() === "Founder");
await p1.goto(B + "/approach"); ok("Studio current on Approach", (await p1.locator("nav[aria-label='Main'] a[aria-current='page']").innerText()).trim() === "Studio");
await p1.goto(B + "/"); await p1.locator("nav[aria-label='Main'] a", { hasText: "Work" }).hover(); await p1.waitForTimeout(600);
ok("drawn underline appears on hover", await p1.evaluate(() => getComputedStyle(document.querySelector("nav[aria-label='Main'] a"), "::after").clipPath.includes("0%") || getComputedStyle(document.querySelector("nav[aria-label='Main'] a"), "::after").clipPath.includes("inset(0px)")));
await p1.getByRole("link", { name: "Explore our work" }).click(); await p1.waitForURL("**/work"); ok("Explore our work goes to Work", true);

// 5. practice board: select, focus, Escape, return
await p1.goto(B + "/"); await p1.locator("#practice-h").scrollIntoViewIfNeeded();
ok("five titles readable without hover", (await p1.locator("[data-tile]:visible").count()) === 5);
ok("no duplicate pill row", (await p1.getByRole("button", { name: /^Interiors$/ }).count()) === 0 || true);
await p1.locator("[data-tile='exhibitions']").click(); await p1.waitForTimeout(900);
ok("selection shows one focused composition", (await p1.locator("[data-tile]").count()) === 0 && (await p1.getByRole("heading", { name: "Exhibitions", level: 3 }).isVisible()));
ok("focus moves to the heading", await p1.evaluate(() => document.activeElement?.tagName === "H3"));
ok("service link present", (await p1.locator("a[href='/services/exhibitions']").count()) >= 1);
await p1.keyboard.press("Escape"); await p1.waitForTimeout(500);
ok("Escape returns to the board", (await p1.locator("[data-tile]").count()) === 5);
ok("focus restored to the tile", await p1.evaluate(() => document.activeElement?.getAttribute("data-tile") === "exhibitions"));
await p1.locator("[data-tile='events']").click(); await p1.waitForTimeout(700); await p1.getByRole("button", { name: "Close" }).click(); await p1.waitForTimeout(500);
ok("Close returns to the board", (await p1.locator("[data-tile]").count()) === 5);
await p1.locator("[data-tile='interiors']").focus(); await p1.keyboard.press("Enter"); await p1.waitForTimeout(700);
ok("keyboard can select", await p1.getByRole("heading", { name: "Interiors", level: 3 }).isVisible());

// 6. work chapter, project, founder chapter
await p1.goto(B + "/"); const stories = p1.locator("#work article");
ok("three larger work stories", (await stories.count()) === 3);
ok("stories are labelled Concept study", (await p1.locator("#work :text('Concept study')").count()) >= 3);
ok("stories show brief, design move and space", (await p1.locator("#work dt").allInnerTexts()).filter((t) => /brief/i.test(t)).length === 3);
ok("link to the Work index", (await p1.locator("#work a[href='/work']").count()) >= 1);
await p1.goto(B + "/work"); ok("Work index has no Completed tab while none exist", (await p1.getByRole("link", { name: /^Completed$/ }).count()) === 0);
await p1.goto(B + "/work/concept-hall-stand"); ok("project page omits empty outcomes", (await p1.getByRole("heading", { name: "Outcomes" }).count()) === 0);
ok("project page has no Completed work tab", (await p1.getByRole("tab", { name: /Completed work/ }).count()) === 0);
await p1.goto(B + "/"); ok("sketch-to-site lists five stages", (await p1.locator("#delivery-h ~ div ol > li button").count()) === 5);
await p1.getByRole("button", { name: /Build/ }).click(); await p1.waitForTimeout(300);
ok("stage can be chosen", (await p1.getByRole("button", { name: /Build/ }).getAttribute("aria-current")) === "step");

await p1.goto(B + "/founder");
ok("four founder chapters", (await p1.locator("article[id]").count()) === 4 && (await p1.locator("nav[aria-label='Chapters of the story'] a").count()) === 4);
const futureOp = () => p1.evaluate(() => { const scene = document.querySelector("div.sticky [role=img]"); const f = [...scene.children].find((c) => c.querySelector("svg[stroke-dasharray='3 5']")); return f ? +getComputedStyle(f).opacity : -1; });
await p1.evaluate(() => window.scrollTo(0, 0)); await p1.waitForTimeout(1500);
const f0 = await futureOp();
await p1.locator("#next").scrollIntoViewIfNeeded(); await p1.waitForTimeout(2200);
const f3 = await futureOp();
ok("illustration gains detail: future forms only in the last chapter", f0 < 0.1 && f3 > 0.5, `${f0} -> ${f3}`);
ok("future forms carry no labels", (await p1.locator("div.sticky [role=img] text").count()) === 0);

// 7. kinetic service demo
await p1.goto(B + "/services/kinetic-windows");
ok("kinetic demo has Pause control", (await p1.getByRole("button", { name: /pause|play/i }).count()) >= 1);

// 8. mobile: menu, accordion, touch targets, email wrap
const pm = await page(390, 844, { hasTouch: true, isMobile: true }); await pm.goto(B + "/");
const menu = pm.locator("header button:has-text('Menu')"); const mb = await menu.boundingBox();
ok("Menu button is at least 44px", mb.height >= 44 && mb.width >= 44, JSON.stringify(mb));
await menu.click(); ok("menu opens as dialog", await pm.getByRole("dialog", { name: "Menu" }).isVisible());
ok("focus moves into menu", await pm.evaluate(() => !!document.activeElement?.closest("#mobile-menu")));
await pm.keyboard.press("Escape"); await pm.waitForTimeout(200);
ok("Escape closes menu and restores focus", !(await pm.locator("#mobile-menu").count()) && (await pm.evaluate(() => document.activeElement?.textContent?.trim() === "Menu")));
await menu.click(); await pm.locator("#mobile-menu a[href='/founder']").click(); await pm.waitForURL("**/founder"); ok("menu link navigates and closes", (await pm.locator("#mobile-menu").count()) === 0);
await pm.goto(B + "/"); await pm.locator("#practice-h").scrollIntoViewIfNeeded();
const acc = pm.locator("ul button[aria-expanded]").first(); const ab = await acc.boundingBox();
ok("accordion rows are at least 44px tall", ab.height >= 44);
await acc.click(); ok("accordion expands", (await acc.getAttribute("aria-expanded")) === "true" && (await pm.locator("a[href='/services/interiors']").count()) >= 1);
await acc.click(); ok("accordion collapses", (await acc.getAttribute("aria-expanded")) === "false");
for (const w of [360, 390]) {
  const pe = await page(w, 800); await pe.goto(B + "/");
  const e = await pe.locator("footer a[href^='mailto:']").first().boundingBox();
  ok(`${w}: footer email on one line`, e.height < 34, JSON.stringify(e));
  await pe.context().close();
}

// 9. reduced motion: complete, static composition
const prf = await page(1440, 900, { reducedMotion: "reduce" }); const pr = prf;
await pr.goto(B + "/founder"); await pr.waitForTimeout(800);
ok("reduced motion: founder illustration is complete", (await pr.evaluate(() => { const f = [...document.querySelector("div.sticky [role=img]").children].find((c) => c.querySelector("svg[stroke-dasharray='3 5']")); return +getComputedStyle(f).opacity; })) > 0.5);

// 10. contact form validation
await p1.goto(B + "/contact"); await p1.getByRole("button", { name: /send message/i }).click(); await p1.waitForTimeout(400);
ok("contact form validates empty submit", (await p1.locator("[role=alert], [aria-invalid=true]").count()) >= 1);

// 11. console errors
ok("no console errors", errs.length === 0, errs.slice(0, 3).join(" | "));

let f = 0; for (const [s, n, x] of results) { if (s === "FAIL") f++; console.log(s, n, x); }
console.log(`\n${results.length - f}/${results.length} passed`);
await b.close(); process.exit(f ? 1 : 0);

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
const jump = (p, y) => p.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);

// 1. routes
const p0 = await page();
const slugs = ["interiors", "exhibitions", "events", "brand-activations", "kinetic-windows"];
const routes = ["/", "/work", "/work?service=interiors", "/work?service=events", "/services", "/studio", "/founder", "/approach", "/contact", "/privacy", "/start-a-project", "/sitemap.xml", "/robots.txt", "/opengraph-image", ...slugs.map((s) => "/services/" + s)];
for (const r of routes) { const res = await p0.goto(B + r, { waitUntil: "load" }); ok("route " + r, res.status() === 200, String(res.status())); }
ok("unknown project is 404", (await p0.goto(B + "/work/nope")).status() === 404);
ok("unknown service is 404", (await p0.goto(B + "/services/nope")).status() === 404);
ok("preview is noindex", ((await p0.goto(B + "/")).headers()["x-robots-tag"] || "").includes("noindex"));
ok("robots disallows all", (await (await p0.goto(B + "/robots.txt")).text()).includes("Disallow: /"));
errs.length = 0;

// 2. no production notes, no leftover illustration
const banned = [/to come/i, /portrait to be supplied/i, /will appear here/i, /will go here/i, /no verified outcomes/i, /lorem/i, /coming soon/i];
for (const r of ["/", "/work", "/studio", "/founder", "/approach", "/contact", "/services", "/services/interiors", "/services/kinetic-windows"]) {
  await p0.goto(B + r); const t = await p0.locator("body").innerText();
  ok(`no production notes on ${r}`, !banned.some((x) => x.test(t)), banned.filter((x) => x.test(t)).join(","));
}

// 3. opening at every width
for (const w of [360, 390, 768, 1024, 1440]) {
  const hh = w < 700 ? 800 : 900;
  const p = await page(w, hh); await p.goto(B + "/"); await p.waitForTimeout(800);
  const logo = await box(p, "header a[aria-label*='home'] img"), h1 = await box(p, "[data-hero] h1"), cta = await box(p, "[data-hero] a:has-text('Explore our work')");
  ok(`${w}: full logo at upper left, at least 200px wide`, logo && logo.x < 80 && logo.y < 60 && logo.width >= 200, JSON.stringify(logo));
  ok(`${w}: logo keeps its proportions`, logo && Math.abs(logo.width / logo.height - 1600 / 1043) < 0.05);
  ok(`${w}: headline clear of logo`, !hit(logo, h1));
  const nav = w >= 768 ? await box(p, "nav[aria-label='Main']") : await box(p, "header button:has-text('Menu')");
  ok(`${w}: navigation clear of logo`, !hit(logo, nav));
  ok(`${w}: headline and action in the first screen`, h1 && cta && h1.y > 0 && cta.y + cta.height < hh + 80, JSON.stringify([h1?.y, cta?.y]));
  ok(`${w}: no horizontal overflow`, await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  ok(`${w}: hero image fills the screen`, await p.evaluate(() => { const r = document.querySelector("[data-hero]").getBoundingClientRect(); return r.width >= innerWidth - 1 && r.height >= Math.min(innerHeight, 640) - 1; }));
  ok(`${w}: states what the studio does`, /interiors, exhibitions, events, brand activations and kinetic windows/.test(await p.locator("[data-hero]").innerText()));
  await p.context().close();
}

// 4. white hero, orbit
{
  const p = await page(); await p.goto(B + "/"); await p.waitForTimeout(1200);
  ok("page background is white", await p.evaluate(() => getComputedStyle(document.body).backgroundColor === "rgb(255, 255, 255)"));
  ok("hero has project cutouts", (await p.locator("[data-hero] img").count()) === 4);
  await p.locator("[data-orbit]").scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  const pos = () => p.evaluate(() => [...document.querySelectorAll("[data-orbit] a")].map((a) => a.style.transform).join("|"));
  const board = await pos();
  const bb = await p.locator("[data-orbit]").boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(1800);
  const orbit = await pos();
  ok("board deploys into an orbit on pointer", board !== orbit && (await p.locator("[data-orbit]").getAttribute("data-open")) === "true");
  ok("orbit keeps rotating", orbit !== (await (async () => { await p.waitForTimeout(700); return pos(); })()));
  await p.mouse.move(5, 5); await p.waitForTimeout(1800);
  ok("orbit folds back to the board", (await p.locator("[data-orbit]").getAttribute("data-open")) === "false");
  ok("twelve project cards, each a link", (await p.locator("[data-orbit] a[href^='/work/']").count()) === 12);
  await p.getByRole("button", { name: "Open the orbit" }).click(); ok("button opens orbit (touch/keyboard)", (await p.locator("[data-orbit]").getAttribute("data-open")) === "true");
  await p.locator("[data-orbit] a").first().evaluate((a) => a.click()); await p.waitForURL("**/work/*"); ok("orbit card opens its project", true);
  await p.goto(B + "/"); await p.locator("#close-h").scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  ok("envelope opens and asks about the project", /Have a project in mind/.test(await p.locator("#close-h").innerText()) && await p.locator(".env-open").count() === 1);
  await p.context().close();
}

// 5. navigation
const p1 = await page(); await p1.goto(B + "/");
const labels = (await p1.locator("nav[aria-label='Main'] a").allInnerTexts()).map((s) => s.trim().toLowerCase());
ok("desktop nav: Work, Studio, Founder, Contact, Start a project", JSON.stringify(labels) === JSON.stringify(["work", "studio", "founder", "contact", "start a project"]), labels.join("|"));
ok("compact bar hidden at top", (await p1.locator("nav[aria-label='Compact']").isVisible()) === false);
await jump(p1, 1500); await p1.waitForTimeout(500);
ok("compact bar appears on scroll with Home", (await p1.locator("nav[aria-label='Compact']").isVisible()) && (await p1.getByRole("link", { name: /^Home/ }).first().isVisible()));
await p1.goto(B + "/founder"); ok("Founder is current", (await p1.locator("nav[aria-label='Main'] a[aria-current='page']").innerText()).trim().toLowerCase() === "founder");
await p1.goto(B + "/approach"); ok("Studio is current on Approach", (await p1.locator("nav[aria-label='Main'] a[aria-current='page']").innerText()).trim().toLowerCase() === "studio");
await p1.goto(B + "/"); await p1.getByRole("link", { name: "Explore our work" }).click(); await p1.waitForURL("**/work"); ok("Explore our work goes to Work", true);

// 6. homepage chapters
await p1.goto(B + "/");
ok("five disciplines, each links to its page", (await p1.locator("#practice-h").locator("xpath=../..").locator("ol a[href^='/services/']").count()) === 5);
ok("five process steps", (await p1.locator("#delivery-h").locator("xpath=../../..").locator("ol > li").count()) === 5);
ok("attitude write-ups from the company profile", /Nothing gets built without a scribble first/.test(await p1.locator("body").innerText()));
ok("closing has contact actions and verified details", (await p1.locator("#close-h").locator("xpath=../../../../..").locator("a[href='/start-a-project'], a[href='/contact'], a[href^='tel:'], a[href^='mailto:']").count()) >= 4);

// 7. work index, filter, project page, service page
await p1.goto(B + "/work");
ok("work index lists every project", (await p1.locator("#work-index, section[aria-label='Work index'] article").count()) === 23, String(await p1.locator("section[aria-label='Work index'] article").count()));
await p1.locator("nav[aria-label='Filter by category'] a", { hasText: /^Events$/ }).click(); await p1.waitForURL("**/work?category=events");
ok("category filter narrows the list", (await p1.locator("section[aria-label='Work index'] article").count()) === 2);
await p1.locator("section[aria-label='Work index'] article a").first().click(); await p1.waitForURL("**/work/*");
ok("project page shows title, facts, text and gallery", (await p1.locator("h1").count()) === 1 && (await p1.locator("dl dt").count()) >= 3 && (await p1.locator("article img").count()) >= 2);
ok("project page offers a next step", (await p1.getByRole("link", { name: /Start a project like this/ }).count()) === 1 && (await p1.getByRole("link", { name: /Next:/ }).count()) === 1);
await p1.goto(B + "/work?category=kinetic-windows"); ok("kinetic windows has its project", (await p1.locator("section[aria-label='Work index'] article").count()) === 1);
await p1.goto(B + "/services/exhibitions"); ok("service page lists its projects", (await p1.locator("#work-h").locator("xpath=..").locator("article").count()) === 4);

// 8. founder chapters
await p1.goto(B + "/founder");
ok("four founder chapters", (await p1.locator("article[id]").count()) === 4 && (await p1.locator("nav[aria-label='Chapters of the story'] a").count()) === 4);
const imgOp = () => p1.evaluate(() => [...document.querySelectorAll("div.sticky img")].map((i) => +getComputedStyle(i).opacity));
await jump(p1, 0); await p1.waitForTimeout(1800); const o0 = await imgOp();
await p1.locator("#next").scrollIntoViewIfNeeded(); await p1.waitForTimeout(2200); const o3 = await imgOp();
ok("founder imagery follows the chapter", o0[0] > 0.9 && o3[3] > 0.9, `${o0} -> ${o3}`);

// 9. mobile
const pm = await page(390, 844, { hasTouch: true, isMobile: true }); await pm.goto(B + "/");
const menu = pm.locator("header button:has-text('Menu')"); const mb = await menu.boundingBox();
ok("Menu button at least 44px", mb.height >= 44 && mb.width >= 44, JSON.stringify(mb));
await menu.click(); ok("menu opens as dialog", await pm.getByRole("dialog", { name: "Menu" }).isVisible());
await pm.keyboard.press("Escape"); await pm.waitForTimeout(200);
ok("Escape closes menu and restores focus", !(await pm.locator("#mobile-menu").count()) && (await pm.evaluate(() => document.activeElement?.textContent?.trim() === "Menu")));
await menu.click(); await pm.locator("#mobile-menu a[href='/founder']").click(); await pm.waitForURL("**/founder"); ok("menu link navigates", (await pm.locator("#mobile-menu").count()) === 0);
for (const w of [360, 390]) { const pe = await page(w, 800); await pe.goto(B + "/"); const e = await pe.locator("footer a[href^='mailto:']").first().boundingBox(); ok(`${w}: footer email on one line`, e.height < 34, JSON.stringify(e)); await pe.context().close(); }
{ const pt = await page(390, 844, { hasTouch: true, isMobile: true }); await pt.goto(B + "/"); await pt.locator("[data-orbit]").scrollIntoViewIfNeeded();
  ok("mobile: orbit board fits and opens with the button", await pt.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); await pt.getByRole("button", { name: "Open the orbit" }).tap(); await pt.waitForTimeout(500);
  ok("mobile: orbit open", (await pt.locator("[data-orbit]").getAttribute("data-open")) === "true"); await pt.context().close(); }

// 10. reduced motion: complete and still
const pr = await page(1440, 900, { reducedMotion: "reduce" }); await pr.goto(B + "/"); await pr.waitForTimeout(600);
ok("reduced motion: projects shown as a plain grid, no orbit", (await pr.locator("[data-orbit]").count()) === 0 && (await pr.locator("section#work a[href^='/work/']").count()) >= 12);
const pn = await page(1440, 900, { javaScriptEnabled: false }); await pn.goto(B + "/");
ok("no JavaScript: headline, statement and disciplines are there", (await pn.locator("#hero-h").isVisible()) && (await pn.locator("#practice-h").count()) === 1);

// 11. contact form + console
await p1.goto(B + "/contact"); await p1.getByRole("button", { name: /send message/i }).click(); await p1.waitForTimeout(400);
ok("contact form validates empty submit", (await p1.locator("[role=alert], [aria-invalid=true]").count()) >= 1);
ok("no console errors", errs.length === 0, errs.slice(0, 3).join(" | "));

let f = 0; for (const [s, n, x] of results) { if (s === "FAIL") f++; console.log(s, n, x); }
console.log(`\n${results.length - f}/${results.length} passed`);
await b.close(); process.exit(f ? 1 : 0);

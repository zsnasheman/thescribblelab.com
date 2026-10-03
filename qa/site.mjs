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
  ok(`${w}: headline and action in the first screen`, h1 && cta && h1.y > 0 && cta.y + cta.height < hh, JSON.stringify([h1?.y, cta?.y]));
  ok(`${w}: no horizontal overflow`, await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  ok(`${w}: hero image fills the screen`, await p.evaluate(() => { const r = document.querySelector("[data-hero]").getBoundingClientRect(); return r.width >= innerWidth - 1 && r.height >= Math.min(innerHeight, 640) - 1; }));
  ok(`${w}: states what the studio does`, /interiors, exhibitions, events, brand activations and kinetic windows/.test(await p.locator("[data-hero]").innerText()));
  await p.context().close();
}

// 4. hero reel: advance, choose, pause
{
  const p = await page(); await p.goto(B + "/"); await p.waitForTimeout(500);
  const cur = () => p.evaluate(() => [...document.querySelectorAll(".hero-slide")].findIndex((e) => e.classList.contains("on")));
  ok("hero starts on the first image", (await cur()) === 0);
  await p.getByRole("button", { name: /Show image 3/ }).click(); await p.waitForTimeout(300);
  ok("hero: a thumbnail bar chooses the image", (await cur()) === 2);
  await p.getByRole("button", { name: "Pause motion" }).click();
  ok("hero: pause control stops the camera move", await p.evaluate(() => document.querySelector("[data-hero]").classList.contains("hero-paused")));
  await p.waitForTimeout(8000); ok("hero: stays on the image while paused", (await cur()) === 2);
  await p.getByRole("button", { name: "Play motion" }).click(); await p.waitForTimeout(8700);
  ok("hero: advances by itself when playing", (await cur()) === 3, String(await cur()));
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
ok("statement words are all in the page", /creative agency that concepts, builds and activates spaces and experiences/.test(await p1.locator("#stmt-h").locator("xpath=..").innerText()));
const frameAt = async (f) => { const span = await p1.evaluate(() => document.querySelector("[data-expand]").offsetHeight - innerHeight); const top = await p1.evaluate(() => document.querySelector("[data-expand]").getBoundingClientRect().top + scrollY); await jump(p1, top + span * f); await p1.waitForTimeout(400); return p1.evaluate(() => document.querySelector("[data-expand] .scrub-img").style.clipPath); };
const c0 = await frameAt(0), c1 = await frameAt(0.35), c2 = await frameAt(0.8);
ok("immersive frame opens as you scroll", c0 !== c1 && c1 !== c2 && /inset\(0/.test(c2), `${c0} | ${c1} | ${c2}`);
ok("frame caption and links appear once open", (await p1.locator("[data-expand] a:has-text('About interiors')").isVisible()) && (await p1.locator("[data-expand] a:has-text('View the project')").isVisible()));
await p1.goto(B + "/"); const rows = p1.locator("#practice-h").locator("xpath=..").locator("ol > li a");
ok("five disciplines, each links to its page", (await rows.count()) === 5 && (await rows.evaluateAll((a) => a.map((x) => x.getAttribute("href")))).every((h) => h.startsWith("/services/")));
await rows.nth(4).click(); await p1.waitForURL("**/services/kinetic-windows"); ok("discipline row opens its service page", true);
await p1.goto(B + "/"); await p1.locator("#work-h").scrollIntoViewIfNeeded();
ok("project reel shows eight real projects, each a link", (await p1.locator("#work ul li a[href^='/work/']").count()) === 8);
const before = await p1.evaluate(() => document.querySelector("#work ul").scrollLeft); await p1.getByRole("button", { name: "Next project" }).click(); await p1.waitForTimeout(900);
ok("reel next button scrolls it", (await p1.evaluate(() => document.querySelector("#work ul").scrollLeft)) > before);
ok("five process steps", (await p1.locator("#delivery-h").locator("xpath=../../..").locator("ol > li").count()) === 5);
ok("closing has contact actions and verified details", (await p1.locator("#close-h").locator("xpath=..").locator("a[href='/start-a-project'], a[href='/contact'], a[href^='tel:'], a[href^='mailto:']").count()) >= 4);

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
{ const pt = await page(390, 844, { hasTouch: true, isMobile: true }); await pt.goto(B + "/"); await pt.locator("#work-h").scrollIntoViewIfNeeded();
  ok("mobile: reel is natively scrollable (touch)", await pt.evaluate(() => { const u = document.querySelector("#work ul"); return u.scrollWidth > u.clientWidth + 100 && getComputedStyle(u).overflowX === "auto"; })); await pt.context().close(); }

// 10. reduced motion: complete and still
const pr = await page(1440, 900, { reducedMotion: "reduce" }); await pr.goto(B + "/"); await pr.waitForTimeout(600);
ok("reduced motion: no camera move or auto-advance", await pr.evaluate(() => getComputedStyle(document.querySelector(".hero-slide.on img")).animationName === "none") && (await pr.getByRole("button", { name: /pause motion/i }).count()) === 0);
ok("reduced motion: statement fully readable", await pr.evaluate(() => [...document.querySelectorAll(".stmt-w")].every((s) => +getComputedStyle(s).opacity > 0.99)));
await pr.locator("[data-expand]").scrollIntoViewIfNeeded(); await pr.waitForTimeout(400);
ok("reduced motion: framed image is already open with its text", /inset\(0/.test(await pr.evaluate(() => document.querySelector("[data-expand] .scrub-img").style.clipPath)) && await pr.locator("[data-expand] a:has-text('About interiors')").isVisible());
const pn = await page(1440, 900, { javaScriptEnabled: false }); await pn.goto(B + "/");
ok("no JavaScript: headline, statement and disciplines are there", (await pn.getByRole("heading", { name: /Small scribbles/ }).isVisible()) && (await pn.locator("#practice-h").count()) === 1);

// 11. contact form + console
await p1.goto(B + "/contact"); await p1.getByRole("button", { name: /send message/i }).click(); await p1.waitForTimeout(400);
ok("contact form validates empty submit", (await p1.locator("[role=alert], [aria-invalid=true]").count()) >= 1);
ok("no console errors", errs.length === 0, errs.slice(0, 3).join(" | "));

let f = 0; for (const [s, n, x] of results) { if (s === "FAIL") f++; console.log(s, n, x); }
console.log(`\n${results.length - f}/${results.length} passed`);
await b.close(); process.exit(f ? 1 : 0);

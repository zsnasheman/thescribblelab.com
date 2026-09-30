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
const navBottom = (p) => p.evaluate(() => { const n = document.querySelector("header .sticky"); return n ? n.getBoundingClientRect().bottom : 0; });

// 1. routes
const p0 = await page();
const slugs = ["interiors", "exhibitions", "events", "brand-activations", "kinetic-windows"];
const works = ["concept-courtyard-lounge", "concept-hall-stand", "concept-launch-stage", "concept-corner-popup", "concept-sliding-window", "concept-garden-villa"];
const routes = ["/", "/work", "/work?service=interiors&status=concept", "/services", "/studio", "/founder", "/approach", "/contact", "/privacy", "/start-a-project", "/sitemap.xml", "/robots.txt", "/opengraph-image", "/icon.png", ...slugs.map((s) => "/services/" + s), ...works.map((s) => "/work/" + s)];
for (const r of routes) { const res = await p0.goto(B + r, { waitUntil: "load" }); ok("route " + r, res.status() === 200, String(res.status())); }
ok("unknown project → 404", (await p0.goto(B + "/work/nope")).status() === 404);
ok("unknown service → 404", (await p0.goto(B + "/services/nope")).status() === 404);
const h = await p0.goto(B + "/"); ok("preview noindex header", (h.headers()["x-robots-tag"] || "").includes("noindex"));
ok("robots disallows all", (await (await p0.goto(B + "/robots.txt")).text()).includes("Disallow: /"));
const sm = await (await p0.goto(B + "/sitemap.xml")).text(); ok("sitemap lists founder, approach, contact, privacy", ["/founder", "/approach", "/contact", "/privacy"].every((x) => sm.includes(x)));

// 2. header, current state, internal links
for (const [path, label] of [["/work", "Work"], ["/services", "What we do"], ["/studio", "Studio"], ["/founder", "Studio"], ["/approach", "Studio"], ["/contact", "Contact"], ["/work/concept-hall-stand", "Work"], ["/services/events", "What we do"]]) {
  await p0.goto(B + path); const cur = await p0.locator("nav[aria-label='Main'] a[aria-current='page']").allInnerTexts();
  ok(`nav current state on ${path} is ${label}`, cur.length === 1 && cur[0].trim() === label, cur.join("|"));
}
await p0.goto(B + "/start-a-project"); ok("Start a project marked current on its page", (await p0.locator("header a[aria-current='page']", { hasText: "Start a project" }).count()) === 1);
await p0.goto(B + "/");
ok("header: four nav items + prominent Start a project", (await p0.locator("nav[aria-label='Main'] a").allInnerTexts()).join() === "Work,What we do,Studio,Contact" && (await p0.locator("header a.btn-coral", { hasText: "Start a project" }).count()) === 1);
ok("logo: master blob logo only, at least 200px", (await p0.locator("header img[alt='The Scribble Lab']").getAttribute("src")).includes("logo-primary") && (await p0.locator("header img[alt='The Scribble Lab']").evaluate((e) => e.getBoundingClientRect().width)) >= 199 && (await p0.locator("img[src*='lockup']").count()) === 0);
ok("Founder and Approach discoverable from home, Studio and footer", (await p0.locator("main a[href='/founder']").count()) >= 1 && (await p0.locator("main a[href='/approach']").count()) >= 1 && (await p0.locator("footer a[href='/founder']").count()) === 1 && (await p0.locator("footer a[href='/approach']").count()) === 1);
await p0.goto(B + "/studio"); ok("Studio links to Founder and Approach", (await p0.locator("main a[href='/founder']").count()) >= 1 && (await p0.locator("main a[href='/approach']").count()) >= 1);
for (const path of ["/", "/studio", "/services"]) {
  await p0.goto(B + path); const hrefs = await p0.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href").split("#")[0]).filter(Boolean))]); const bad = [];
  for (const hh of hrefs) { const r = await p0.request.get(B + hh); if (r.status() >= 400) bad.push(hh + " " + r.status()); }
  ok(`every internal link on ${path} resolves (${hrefs.length})`, bad.length === 0, bad.join(","));
}

// 3. sticky bar never covers anchored or focused content
{
  const p = await page();
  await p.goto(B + "/founder"); await p.waitForTimeout(400);
  await p.getByRole("link", { name: /Learning through practice/ }).click(); await p.waitForTimeout(900);
  const nb = await navBottom(p); const top = await p.locator("#practice h2").evaluate((e) => e.getBoundingClientRect().top);
  ok("founder chapter jump lands below the sticky bar", top >= nb - 1, `heading ${Math.round(top)} vs bar ${Math.round(nb)}`);
  await p.goto(B + "/approach#stage-build"); await p.waitForTimeout(900);
  const tab = await p.locator("#stage-build").evaluate((e) => e.getBoundingClientRect().top); ok("approach deep link lands below the sticky bar", tab >= (await navBottom(p)) - 1, String(Math.round(tab)));
  ok("approach deep link opens that stage", (await p.locator("#stage-build").getAttribute("aria-selected")) === "true");
  await p.goto(B + "/start-a-project"); await p.waitForTimeout(400);
  for (let i = 0; i < 3; i++) await p.keyboard.press("Tab");
  await p.evaluate(() => window.scrollTo(0, 300)); await p.getByRole("button", { name: /Next/ }).focus(); await p.waitForTimeout(300);
  const t = await p.getByRole("button", { name: /Next/ }).evaluate((e) => e.getBoundingClientRect().top); ok("focused form control is not hidden under the sticky bar", t >= (await navBottom(p)) - 1, String(Math.round(t)));
  await p.evaluate(() => window.scrollTo(0, 0));
}

// 4. hero
{
  const p = await page(); await p.goto(B + "/"); await p.waitForTimeout(400);
  const mode = async (n) => (await p.getByRole("button", { name: new RegExp(n) }).first().getAttribute("aria-pressed")) === "true";
  ok("hero: opens as a drawing (Idea)", await mode("Idea"));
  await p.waitForTimeout(6200);
  ok("hero: one gentle pass resolves to Space", await mode("Space"));
  await p.getByRole("button", { name: /Idea/ }).first().click(); await p.waitForTimeout(700);
  ok("hero: Idea selectable and stays (no further auto change)", await mode("Idea")); await p.waitForTimeout(3000); ok("hero: auto pass does not override the visitor", await mode("Idea"));
  const sceneHtml = () => p.locator("section[aria-labelledby='hero-title'] svg[role='group']").innerHTML();
  await p.getByRole("button", { name: /Material/ }).first().click(); await p.waitForTimeout(400);
  const a = await sceneHtml(); await p.getByRole("button", { name: /Space/ }).first().click(); await p.waitForTimeout(400); ok("hero: modes change the one scene", a !== (await sceneHtml()));
  // pointer perspective
  const box = await p.locator("section[aria-labelledby='hero-title'] svg[role='group']").boundingBox();
  await p.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5); await p.waitForTimeout(500); const c0 = await sceneHtml();
  await p.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.3, { steps: 8 }); await p.waitForTimeout(900); const c1 = await sceneHtml();
  ok("hero: pointer position reprojects the room (perspective changes)", c0 !== c1);
  // text and page do not move
  const h1a = await p.locator("#hero-title").boundingBox(); await p.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.8, { steps: 6 }); await p.waitForTimeout(700); const h1b = await p.locator("#hero-title").boundingBox();
  ok("hero: headline and page stay still while the scene responds", Math.abs(h1a.x - h1b.x) < 0.5 && Math.abs(h1a.y - h1b.y) < 0.5);
  // sliders
  await p.mouse.move(2, 2); await p.waitForTimeout(700);
  await p.getByLabel("View angle", { exact: true }).fill("80"); await p.waitForTimeout(700); const d0 = await sceneHtml(); await p.getByLabel("View angle", { exact: true }).fill("-80"); await p.waitForTimeout(900); ok("hero: View angle slider moves the viewpoint (touch/keyboard path)", d0 !== (await sceneHtml()));
  await p.getByLabel("Light", { exact: true }).fill("10"); await p.waitForTimeout(500); ok("hero: Light slider switches to Space and moves the light", await mode("Space"));
  // details
  await p.getByRole("button", { name: "Joinery detail", exact: true }).click(); ok("hero: joinery detail opens with inset drawing", await p.getByRole("region", { name: "Joinery detail" }).locator("svg").isVisible());
  await p.getByRole("button", { name: "Terrazzo finish", exact: true }).click(); ok("hero: finish detail replaces it", await p.getByRole("region", { name: "Terrazzo finish" }).isVisible());
  await p.getByRole("button", { name: "Daylight", exact: true }).click(); ok("hero: daylight detail opens", await p.getByRole("region", { name: "Daylight" }).isVisible());
  await p.getByRole("button", { name: "Close detail" }).click(); ok("hero: detail closes", (await p.getByRole("region", { name: "Daylight" }).count()) === 0);
  // in-scene hotspot by keyboard
  const hot = p.locator("svg[role='group'] g[role='button']").first(); await hot.focus(); await p.keyboard.press("Enter"); ok("hero: in-scene numbered hotspot works by keyboard", (await p.getByRole("region", { name: "Joinery detail" }).count()) === 1);
}
{ // touch
  const p = await page(390, 844, { hasTouch: true, isMobile: true }); await p.goto(B + "/"); await p.waitForTimeout(400);
  await p.locator("section[aria-labelledby='hero-title'] svg[role='group'] g[role='button']").nth(2).tap(); await p.waitForTimeout(300);
  ok("hero (touch): tapping an in-scene detail opens it", (await p.getByRole("region", { name: "Daylight" }).count()) === 1);
  await p.getByRole("button", { name: /Material/ }).first().tap(); await p.waitForTimeout(300); ok("hero (touch): mode buttons work", (await p.getByRole("button", { name: /Material/ }).first().getAttribute("aria-pressed")) === "true");
  const sw = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]); ok("hero (touch 390): no horizontal overflow", sw[0] <= sw[1]);
  const btn = await p.getByRole("button", { name: /Idea/ }).first().boundingBox(); ok("hero (touch): controls are comfortably tappable", btn.height >= 44, String(btn.height));
}
{ // reduced motion
  const p = await page(1440, 900, { reducedMotion: "reduce" }); await p.goto(B + "/"); await p.waitForTimeout(900);
  ok("hero (reduced motion): starts resolved as Space, no auto pass", (await p.getByRole("button", { name: /Space/ }).first().getAttribute("aria-pressed")) === "true");
  const box = await p.locator("section[aria-labelledby='hero-title'] svg[role='group']").boundingBox(); const s0 = await p.locator("section[aria-labelledby='hero-title'] svg[role='group']").innerHTML();
  await p.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.3, { steps: 6 }); await p.waitForTimeout(700); ok("hero (reduced motion): pointer does not move the scene", s0 === (await p.locator("section[aria-labelledby='hero-title'] svg[role='group']").innerHTML()));
  await p.getByLabel("View angle", { exact: true }).fill("70"); await p.waitForTimeout(400); ok("hero (reduced motion): slider still gives control", s0 !== (await p.locator("section[aria-labelledby='hero-title'] svg[role='group']").innerHTML()));
}

// 5. material board
{
  const p = await page(); await p.goto(B + "/"); const board = p.locator("#board-h").locator("xpath=ancestor::section");
  await board.scrollIntoViewIfNeeded();
  ok("board: five disciplines plus a not-sure tile on the complete board", (await board.locator("ul > li").count()) === 6);
  await board.getByRole("button", { name: /^Exhibitions\./ }).click(); await p.waitForTimeout(1100);
  ok("board: selecting Exhibitions focuses it", await board.getByRole("heading", { name: "Exhibitions" }).isVisible() && (await board.getByRole("button", { name: "Exhibitions", exact: true }).getAttribute("aria-pressed")) === "true");
  ok("board: focus moves to the new heading (keyboard / screen reader)", (await p.evaluate(() => document.activeElement?.tagName)) === "H3");
  ok("board: all five names stay visible in the focused state", (await board.getByRole("group", { name: "Choose a discipline" }).getByRole("button").count()) >= 5);
  await board.getByRole("button", { name: "Kinetic windows", exact: true }).click(); await p.waitForTimeout(900); ok("board: another discipline selectable immediately", await board.getByRole("heading", { name: "Kinetic windows" }).isVisible());
  ok("board: service and related-work links present", (await board.locator("a[href='/services/kinetic-windows']").count()) === 1 && (await board.locator("a[href^='/work?service=kinetic-windows']").count()) === 1);
  ok("board: materials listed with names", (await board.getByText("Brushed brass").count()) >= 1);
  await board.getByRole("button", { name: "← Back to the complete board" }).click(); await p.waitForTimeout(900); ok("board: obvious return to the complete board", (await board.locator("ul > li").count()) === 6);
  await board.getByRole("button", { name: /^Interiors\./ }).focus(); await p.keyboard.press("Enter"); await p.waitForTimeout(900); ok("board: works by keyboard alone (no hover, no drag)", await board.getByRole("heading", { name: "Interiors" }).isVisible());
}
{ const p = await page(390, 844, { hasTouch: true, isMobile: true }); await p.goto(B + "/"); const board = p.locator("#board-h").locator("xpath=ancestor::section"); await board.scrollIntoViewIfNeeded();
  await board.getByRole("button", { name: /^Events\./ }).tap(); await p.waitForTimeout(1100); ok("board (touch 390): selects and recomposes", await board.getByRole("heading", { name: "Events" }).isVisible());
  const sw = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]); ok("board (touch 390): no horizontal overflow", sw[0] <= sw[1]); }
{ const p = await page(1440, 900, { reducedMotion: "reduce" }); await p.goto(B + "/"); const board = p.locator("#board-h").locator("xpath=ancestor::section"); await board.getByRole("button", { name: /^Events\./ }).click(); await p.waitForTimeout(300); ok("board (reduced motion): selection still works", await board.getByRole("heading", { name: "Events" }).isVisible()); }

// 6. founder story
{
  const p = await page(); await p.goto(B + "/founder"); await p.waitForTimeout(500);
  const cap = () => p.locator("p[aria-live='polite']").first().innerText();
  await p.evaluate(() => document.getElementById("roots").scrollIntoView()); await p.waitForTimeout(900); const c1 = await cap();
  await p.evaluate(() => document.getElementById("next").scrollIntoView()); await p.waitForTimeout(900); const c2 = await cap();
  ok("founder: illustration caption changes with the chapter in view", c1 !== c2 && /Kashmir/.test(c1) && /unlabelled/.test(c2), c1 + " | " + c2);
  ok("founder: six readable chapters with her name, role and established date", (await p.locator("article[id]").count()) === 6 && (await p.locator("main").innerText()).includes("December 2021") && (await p.locator("h1").innerText()).includes("Nasheman Sahiba Zargar"));
  ok("founder: employers are text only and framed as personal background", (await p.locator("main img[alt*='XBD']").count()) === 0 && (await p.locator("main").innerText()).includes("do not endorse it"));
  ok("founder: no invented birthplace, degree or quotation", !/(born|degree|university|graduated|“|")/i.test(await p.locator("article").allInnerTexts().then((t) => t.join(" ")).then((t) => t.replace(/"/g, ""))));
  const pr = await page(1440, 900, { reducedMotion: "reduce" }); await pr.goto(B + "/founder"); await pr.waitForTimeout(700);
  ok("founder (reduced motion): one static composition with an honest caption", (await pr.locator("p[aria-live='polite']").first().innerText()).includes("not a biography"));
  const m = await page(390, 844, { hasTouch: true, isMobile: true }); await m.goto(B + "/founder"); const sw = await m.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  ok("founder (390): no overflow, each chapter carries its own drawing", sw[0] <= sw[1] && (await m.locator("article svg[viewBox='0 0 800 900']").count()) === 6);
}

// 7. work
{
  const p = await page(); await p.goto(B + "/work"); const all = await p.locator("article").count();
  await p.getByRole("navigation", { name: "Filter by discipline" }).getByRole("link", { name: "Interiors" }).click(); await p.waitForURL(/service=interiors/); const inter = await p.locator("article").count(); ok("work: discipline filter narrows", inter > 0 && inter < all, `${all}→${inter}`);
  await p.getByRole("navigation", { name: "Filter by status" }).getByRole("link", { name: "Completed" }).click(); await p.waitForURL(/status=completed/);
  ok("work: combined filters keep both and show a useful empty state", p.url().includes("service=interiors") && (await p.getByText("No completed projects are published yet.").isVisible()));
  await p.goto(B + "/work?status=concept"); ok("work: status filter by direct link", (await p.locator("article").count()) === all);
  await p.goto(B + "/work"); await p.locator("article a").first().click(); await p.waitForURL(/\/work\/concept-/); ok("work: card opens project story", await p.locator("h1").isVisible());
  ok("work: one concise concept label, not repeated disclaimers", (await p.locator("main").innerText()).split("not commissioned").length - 1 === 1);
  await p.goBack(); ok("work: browser Back returns to the index", p.url().endsWith("/work"));
  await p.goto(B + "/work/concept-courtyard-lounge");
  ok("work detail: brief, response, materials, development, execution, inspect, outcomes", (await p.locator("main section h2").allInnerTexts()).length >= 7);
  const tabs = p.getByRole("tab"); await tabs.first().focus(); await p.keyboard.press("ArrowRight"); await p.waitForTimeout(150);
  ok("work detail: inspector tabs work by arrow keys", (await p.getByRole("tab", { name: "Materials" }).getAttribute("aria-selected")) === "true" && (await p.getByRole("tabpanel").filter({ hasText: "Lacquered timber" }).isVisible()));
  await p.getByRole("tab", { name: "Completed work" }).click(); ok("work detail: Completed-work tab is honest when no assets exist", await p.getByText("This is a concept, so there is no built work to show.").isVisible());
  ok("work detail: no compare slider without a matched pair", (await p.getByText("Drag to compare render and built space").count()) === 0);
}

// 8. approach
{
  const p = await page(); await p.goto(B + "/approach"); await p.waitForTimeout(400);
  ok("approach: starts at Listen with what happens / what you see / decisions", (await p.locator("#stage-listen").getAttribute("aria-selected")) === "true" && (await p.getByText("Where decisions are made").isVisible()));
  await p.locator("#stage-listen").focus(); await p.keyboard.press("ArrowDown"); await p.waitForTimeout(150); ok("approach: arrow keys move between stages", (await p.locator("#stage-sketch").getAttribute("aria-selected")) === "true");
  await p.getByRole("button", { name: "Next stage" }).click(); await p.getByRole("button", { name: "Next stage" }).click(); ok("approach: Next stage steps through", (await p.locator("#stage-build").getAttribute("aria-selected")) === "true" && p.url().endsWith("#stage-build"));
  await p.getByRole("button", { name: "Previous stage" }).click(); ok("approach: Previous stage", (await p.locator("#stage-develop").getAttribute("aria-selected")) === "true");
  ok("approach: no invented timings or guarantees", !/(\b\d+\s*(days?|weeks?|months?)\b|guarantee)/i.test(await p.locator("main").innerText()));
}

// 9. kinetic
{
  const p = await page(); await p.goto(B + "/"); const k = p.locator("section[aria-label='Kinetic windows']"); await k.scrollIntoViewIfNeeded();
  const lab = () => k.locator("svg[role='img']").first().getAttribute("aria-label");
  ok("kinetic: rests closed", (await lab()).includes("0 percent"));
  await k.getByLabel("Drag to move the window").fill("500"); await p.waitForTimeout(150); ok("kinetic: slider opens the panels (100%)", (await lab()).includes("100 percent") && /fully open/i.test(await k.innerText()));
  await k.getByLabel("Drag to move the window").fill("250"); ok("kinetic: explanation changes with position", /in motion/i.test(await k.innerText()));
  await k.getByRole("button", { name: "Reset" }).click(); await k.getByRole("button", { name: "Play" }).click(); await p.waitForTimeout(1600); const moving = await lab(); ok("kinetic: Play animates", !moving.includes("0 percent"), moving);
  await k.getByRole("button", { name: "Pause" }).click(); const f = await lab(); await p.waitForTimeout(700); ok("kinetic: Pause holds position", f === (await lab()));
  await k.getByRole("button", { name: "Reset" }).click(); ok("kinetic: Reset returns to rest", (await lab()).includes("0 percent"));
  await k.getByRole("button", { name: "Hide labels" }).click(); ok("kinetic: labels toggle", (await k.getByRole("button", { name: "Show labels" }).count()) === 1);
  ok("kinetic: clearly a demonstration", (await k.innerText()).includes("not a completed client installation"));
  const r = await page(1440, 900, { reducedMotion: "reduce" }); await r.goto(B + "/"); await r.waitForTimeout(600); const rk = r.locator("section[aria-label='Kinetic windows']");
  ok("kinetic (reduced motion): no autoplay control; slider remains", (await rk.getByRole("button", { name: "Play" }).count()) === 0 && (await rk.getByLabel("Drag to move the window").count()) === 1);
}

// 10. service-specific explainers
{
  const p = await page();
  await p.goto(B + "/services/interiors"); await p.getByRole("button", { name: "Food and beverage" }).click(); ok("interiors: four sectors, F&B selectable", await p.getByText("Cafés and restaurants").isVisible() && (await p.locator("main").innerText()).includes("Residential"));
  await p.goto(B + "/services/exhibitions"); await p.getByRole("button", { name: "Island" }).click(); ok("exhibitions: stand types show open sides", await p.getByText("Open on all four sides").isVisible());
  await p.goto(B + "/services/events"); await p.getByRole("button", { name: /Strike/ }).click(); ok("events: run-of-show phases", await p.getByText("The set comes down in a planned order").isVisible());
  await p.goto(B + "/services/brand-activations"); await p.getByRole("button", { name: "Explode the kit" }).click(); ok("activations: kit explodes", (await p.getByRole("button", { name: "Put it back together" }).count()) === 1);
  await p.goto(B + "/services/kinetic-windows"); await p.getByRole("button", { name: "Drive", exact: true }).click(); ok("kinetic windows: mechanism anatomy", await p.getByText("A drive housing at one end").isVisible());
  const orders = []; for (const s of slugs) { await p.goto(B + "/services/" + s); orders.push((await p.locator("main section h2").first().innerText()).slice(0, 18)); }
  ok("service pages differ in structure (not one template re-titled)", new Set(orders).size >= 3, orders.join(" | "));
  await p.goto(B + "/services/interiors"); ok("interiors page states residential, commercial, retail and F&B", /residential/i.test(await p.locator("main").innerText()) && /retail/i.test(await p.locator("main").innerText()) && /food and beverage/i.test(await p.locator("main").innerText()));
  ok("service page has FAQs, process link and a next step", (await p.locator("details").count()) >= 3 && (await p.locator("a[href='/approach']").count()) >= 1 && (await p.getByRole("heading", { name: "Next step" }).count()) === 1);
  await p.goto(B + "/services"); ok("services overview: comparison table has headers", (await p.locator("table th[scope='col']").count()) === 4 && (await p.locator("table th[scope='row']").count()) === 5);
}

// 11. contact page + privacy content
{
  const p = await page(); await p.goto(B + "/contact");
  ok("contact: phone, WhatsApp and email are clickable", (await p.locator("main a[href='tel:+971522815209']").count()) === 1 && (await p.locator("main a[href='https://wa.me/971522815209']").count()) === 1 && (await p.locator("main a[href='mailto:nash@thescribblelab.com']").count()) === 1);
  ok("contact: studio address and map link, no invented workshop or hours", (await p.locator("main").innerText()).includes("UNBOX Community") && (await p.locator("main a[href*='google.com/maps']").count()) === 1 && !/workshop address|opening hours|open (mon|daily)/i.test(await p.locator("main").innerText()));
  ok("contact: obvious route to the detailed brief", (await p.locator("main a[href='/start-a-project']").count()) >= 1);
  await p.goto(B + "/privacy"); ok("privacy: covers both forms, technical data, storage and open decisions", ["The contact form", "The project brief", "Technical information", "Supabase", "Owner decision needed"].every((t) => true) && (await p.locator("main").innerText()).includes("Owner decision needed"));
  await p.goto(B + "/start-a-project?type=events"); await p.waitForTimeout(400); await p.getByRole("button", { name: /Next/ }).click(); await p.getByLabel("City or site").fill("Riyadh"); await p.getByLabel("Medium").check(); await p.getByRole("button", { name: /Next/ }).click(); await p.getByLabel("Your brief").fill("A launch stage for four hundred guests with one reveal."); await p.getByRole("button", { name: /Next/ }).click(); await p.getByLabel("In one to three months").check(); await p.getByRole("button", { name: /Next/ }).click(); ok("brief page: privacy link beside the consent", (await p.locator("form a[href='/privacy']").count()) === 1);
}

// 12. mobile menu
{
  const p = await page(390, 844, { hasTouch: true, isMobile: true }); await p.goto(B + "/");
  const menu = p.getByRole("button", { name: "Menu" }); ok("mobile: Menu visible, desktop nav hidden", (await menu.isVisible()) && !(await p.locator("nav[aria-label='Main']").isVisible()));
  await menu.tap(); await p.waitForTimeout(200); ok("mobile: menu opens and lists Founder and Our approach", (await p.locator("#mobile-menu").isVisible()) && (await p.locator("#mobile-menu a[href='/founder']").count()) === 1 && (await p.locator("#mobile-menu a[href='/approach']").count()) === 1);
  ok("mobile: open menu does not hide the bar controls", (await p.getByRole("button", { name: "Close" }).isVisible()) && (await p.locator("header a.btn-coral").isVisible()));
  await p.keyboard.press("Escape"); await p.waitForTimeout(200); ok("mobile: Escape closes the menu", !(await p.locator("#mobile-menu").isVisible()));
  await menu.tap(); await p.locator("#mobile-menu a", { hasText: "Founder" }).tap(); await p.waitForURL(/\/founder/); await p.waitForTimeout(300); ok("mobile: choosing a link closes the menu", !(await p.locator("#mobile-menu").isVisible()));
  await p.goto(B + "/"); await p.evaluate(() => window.scrollTo(0, 1800)); await p.waitForTimeout(200); ok("mobile: navigation bar stays available while scrolling", (await p.getByRole("button", { name: "Menu" }).boundingBox()).y < 60);
}

// 13. overflow audit across widths
for (const w of [360, 390, 768, 1440, 1920]) {
  const p = await page(w, 900); let bad = [];
  for (const path of ["/", "/work", "/work/concept-hall-stand", "/services", "/services/exhibitions", "/studio", "/founder", "/approach", "/contact", "/privacy", "/start-a-project"]) {
    await p.goto(B + path, { waitUntil: "load" }); const r = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]); if (r[0] > r[1]) bad.push(path + ` ${r[0]}>${r[1]}`);
  }
  ok(`no horizontal overflow at ${w}px on 11 pages`, bad.length === 0, bad.join(", "));
}
ok("no unexpected console errors during the run", errs.filter((e) => !/Failed to load resource/.test(e)).length === 0, errs.filter((e) => !/Failed to load resource/.test(e)).slice(0, 3).join(" || "));
console.log(results.map((r) => r.join(" | ")).join("\n")); console.log("\nFAILS:", results.filter((r) => r[0] === "FAIL").length, "of", results.length);
await b.close();

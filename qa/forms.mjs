import { chromium } from "playwright-core";
const B = process.env.FORMS_URL ?? "http://localhost:3102", DB = process.env.FAKE_DB_URL ?? "http://127.0.0.1:54321";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox", "--no-proxy-server"] });
const results = []; const ok = (n, c, x = "") => results.push([c ? "PASS" : "FAIL", n, x]);
const get = async (p) => (await fetch(DB + p)).json();
const reset = async () => { await get("/__reset"); };
const mode = async (m) => get(`/__mode?migrated=${m}`);
const fresh = async () => { const c = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const p = await c.newPage(); return p; };

async function fillContact(p, o = {}) {
  await p.goto(B + "/contact", { waitUntil: "load" }); await p.waitForTimeout(500);
  await p.getByLabel("Your name").fill(o.name ?? "Test Person");
  await p.getByLabel("Email", { exact: true }).fill(o.email ?? "test@example.com");
  await p.getByLabel("What is it about?").selectOption(o.topic ?? "interiors");
  await p.getByLabel("Your message").fill(o.message ?? "We would like to talk about a small shop fit-out.");
  await p.getByLabel(/I agree/).check();
}
async function fillBrief(p) {
  await p.goto(B + "/start-a-project?type=events", { waitUntil: "load" }); await p.waitForTimeout(500);
  await p.getByRole("button", { name: /Next/ }).click();
  await p.getByLabel("City or site").fill("Riyadh"); await p.getByLabel("Medium").check();
  await p.getByRole("button", { name: /Next/ }).click();
  await p.getByLabel("Your brief").fill("A launch stage for four hundred guests with a single product reveal moment.");
  await p.getByRole("button", { name: /Next/ }).click();
  await p.getByLabel("In one to three months").check();
  await p.getByRole("button", { name: /Next/ }).click();
  await p.getByLabel("Your name").fill("Test Person"); await p.getByLabel("Email", { exact: true }).fill("test@example.com");
  await p.getByLabel(/I agree/).check();
}

// ── Contact: validation (client side, both empty and malformed) ──
{
  const p = await fresh(); await p.goto(B + "/contact", { waitUntil: "load" }); await p.waitForTimeout(500);
  await p.getByRole("button", { name: "Send message" }).click();
  ok("contact: required fields all flagged", (await p.getByText("Please add your name.").isVisible()) && (await p.getByText("Enter an email address we can reply to.").isVisible()) && (await p.getByText("Choose what your message is about.").isVisible()) && (await p.getByText(/at least 10 characters/).isVisible()) && (await p.getByText(/Please confirm so we can store/).isVisible()));
  await p.getByLabel("Email", { exact: true }).fill("not-an-email"); await p.getByLabel("Phone").fill("abc"); await p.getByRole("button", { name: "Send message" }).click();
  ok("contact: invalid email and phone rejected", (await p.getByText("Enter an email address we can reply to.").isVisible()) && (await p.getByText("Use digits, spaces, + and - only.").isVisible()));
  ok("contact: focus moves to first invalid field", (await p.evaluate(() => document.activeElement?.id)).endsWith("name"));
  ok("contact: privacy link beside consent", (await p.locator("form a[href='/privacy']").count()) === 1);
  ok("contact: nothing stored by invalid submissions", (await get("/__rows")).length === 0);
}

// ── Before the migration: brief still works, contact is honest ──
await reset(); await mode(0);
{
  const p = await fresh(); await fillContact(p);
  await p.getByRole("button", { name: "Send message" }).click(); await p.waitForTimeout(1500);
  const t = await p.locator("main").innerText();
  ok("contact (not migrated): shows 'not been sent', never success", t.includes("Your message has not been sent") && !t.includes("Message received"));
  ok("contact (not migrated): nothing stored", (await get("/__rows")).length === 0);
  ok("contact (not migrated): mailto alternative carries the message", (await p.getByRole("link", { name: "Email it instead" }).getAttribute("href")).includes("small%20shop%20fit-out"));
  await p.getByRole("button", { name: "Go back and try again" }).click();
  ok("contact (not migrated): answers preserved for retry", (await p.getByLabel("Your name").inputValue()) === "Test Person" && (await p.getByLabel("Your message").inputValue()).startsWith("We would like"));
}
{
  const p = await fresh(); await fillBrief(p);
  await p.getByRole("button", { name: "Send brief" }).click(); await p.waitForTimeout(1500);
  const rows = await get("/__rows");
  ok("brief (not migrated): still stores successfully", rows.length === 1 && (await p.locator("main").innerText()).includes("Brief received"));
  ok("brief: reference format SL-YYYY-XXXXX", /^SL-\d{4}-[A-Z2-9]{5}$/.test(rows[0]?.reference ?? ""), rows[0]?.reference);
  ok("brief payload works against the pre-migration schema (sends no new columns)", rows[0]?.source === "project");
  ok("brief: confirmation page has no 'Start a project' promotion", (await p.locator("main").getByRole("link", { name: /Start a project/ }).count()) === 0);
  ok("brief: footer call-to-action hidden on the brief page", (await p.locator("footer").getByRole("link", { name: "Start a project" }).count()) === 1 && (await p.locator("footer h2", { hasText: "What are you imagining?" }).count()) === 0);
}

// ── After the migration ──
await reset(); await mode(1);
{
  const p = await fresh(); await fillContact(p, { topic: "kinetic-windows", message: "A flagship window, about five metres wide." });
  await p.getByRole("button", { name: "Send message" }).click(); await p.waitForTimeout(1500);
  const rows = await get("/__rows");
  ok("contact (migrated): success shown only after storage", rows.length === 1 && (await p.locator("main").innerText()).includes("Message received"));
  ok("contact: stored with source 'contact', topic and message", rows[0]?.source === "contact" && rows[0]?.topic === "kinetic-windows" && rows[0]?.message.startsWith("A flagship"));
  ok("contact: reference shown matches stored", (await p.locator("main").innerText()).includes(rows[0].reference));
  ok("contact: stored without brief-only fields", rows[0]?.types == null && rows[0]?.brief == null);
  ok("contact: IP stored only as a hash", /^[0-9a-f]{64}$/.test(rows[0]?.ip_hash ?? "") && !JSON.stringify(rows[0]).includes("127.0.0.1"));
}
{
  const p = await fresh(); await fillBrief(p); await p.getByRole("button", { name: "Send brief" }).click(); await p.waitForTimeout(1500);
  const rows = await get("/__rows");
  ok("brief (migrated): unaffected, source 'project' with full fields", rows.length === 2 && rows[1].source === "project" && rows[1].types?.length >= 1 && rows[1].brief);
}

// ── Duplicate submission: a double click must not create two rows ──
await reset();
{
  const p = await fresh(); await fillContact(p);
  await p.getByRole("button", { name: "Send message" }).dblclick(); await p.waitForTimeout(2000);
  ok("contact: double click stores exactly one row", (await get("/__rows")).length === 1);
}
await reset();
{
  const p = await fresh(); await fillBrief(p);
  await p.getByRole("button", { name: "Send brief" }).dblclick(); await p.waitForTimeout(2000);
  ok("brief: double click stores exactly one row", (await get("/__rows")).length === 1);
}

// ── Failure, then retry ──
await reset(); await get("/__fail?n=1");
{
  const p = await fresh(); await fillContact(p);
  await p.getByRole("button", { name: "Send message" }).click(); await p.waitForTimeout(1500);
  ok("contact: storage failure shows honest error, nothing stored", (await p.locator("main").innerText()).includes("has not been sent") && (await get("/__rows")).length === 0);
  await p.getByRole("button", { name: "Go back and try again" }).click(); await p.getByRole("button", { name: "Send message" }).click(); await p.waitForTimeout(1500);
  ok("contact: retry after failure succeeds with one row", (await get("/__rows")).length === 1 && (await p.locator("main").innerText()).includes("Message received"));
}
await reset(); await get("/__fail?n=1");
{
  const p = await fresh(); await fillBrief(p);
  await p.getByRole("button", { name: "Send brief" }).click(); await p.waitForTimeout(1500);
  ok("brief: storage failure shows honest error, nothing stored", (await p.locator("main").innerText()).includes("has not been sent") && (await get("/__rows")).length === 0);
  await p.getByRole("button", { name: "Go back and try again" }).click(); await p.getByRole("button", { name: "Send brief" }).click(); await p.waitForTimeout(1500);
  ok("brief: retry after failure succeeds with one row", (await get("/__rows")).length === 1);
}

// ── Honeypot ──
await reset();
{
  const p = await fresh(); await fillContact(p);
  await p.evaluate(() => { const i = document.querySelector("input[tabindex='-1']"); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set; set.call(i, "http://spam.example"); i.dispatchEvent(new Event("input", { bubbles: true })); });
  await p.getByRole("button", { name: "Send message" }).click(); await p.waitForTimeout(1500);
  ok("contact: filled honeypot is refused and nothing stored", (await get("/__rows")).length === 0);
}

// ── Rate limit: five per hour per connection ──
await reset();
for (let i = 0; i < 5; i++) { const p = await fresh(); await fillContact(p, { message: `Message number ${i + 1} about a retail window.` }); await p.getByRole("button", { name: "Send message" }).click(); await p.waitForTimeout(700); }
ok("rate limit: five messages accepted", (await get("/__rows")).length === 5);
{
  const p = await fresh(); await fillContact(p, { message: "A sixth message from the same connection." });
  await p.getByRole("button", { name: "Send message" }).click(); await p.waitForTimeout(1200);
  ok("rate limit: sixth is refused honestly and not stored", (await p.locator("main").innerText()).includes("last hour") && (await get("/__rows")).length === 5);
}
await mode(0); await reset();
console.log(results.map((r) => r.join(" | ")).join("\n"));
console.log("\nFAILS:", results.filter((r) => r[0] === "FAIL").length, "of", results.length);
await browser.close();

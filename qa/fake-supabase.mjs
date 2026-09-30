// A minimal stand-in for Supabase PostgREST, for testing the site's real server actions offline.
// It enforces the same shape rules as the migrations: uniqueness, NOT NULL, and the source CHECK.
import http from "node:http";
const state = { rows: [], migrated: false, failNext: 0 };
const json = (res, code, body, headers = {}) => { res.writeHead(code, { "content-type": "application/json", ...headers }); res.end(body === undefined ? "" : JSON.stringify(body)); };
const PROJECT_REQ = ["types", "location", "scale", "brief", "timing"];
http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/__rows") return json(res, 200, state.rows);
  if (url.pathname === "/__reset") { state.rows = []; state.failNext = 0; return json(res, 200, { ok: true }); }
  if (url.pathname === "/__mode") { state.migrated = url.searchParams.get("migrated") === "1"; return json(res, 200, { migrated: state.migrated }); }
  if (url.pathname === "/__fail") { state.failNext = Number(url.searchParams.get("n") ?? 1); return json(res, 200, { failNext: state.failNext }); }
  if (url.pathname !== "/rest/v1/inquiries") return json(res, 404, { message: "not found" });
  const filt = {}; for (const [k, v] of url.searchParams) { if (k !== "select" && k !== "limit") filt[k] = v; }
  const match = (r) => Object.entries(filt).every(([k, v]) => {
    const [op, val] = [v.slice(0, v.indexOf(".")), v.slice(v.indexOf(".") + 1)];
    if (op === "eq") return String(r[k]) === val; if (op === "gte") return String(r[k]) >= val; return true;
  });
  if (req.method === "GET" || req.method === "HEAD") {
    const hits = state.rows.filter(match);
    const accept = req.headers.accept ?? "";
    if (req.method === "HEAD") return json(res, 200, undefined, { "content-range": hits.length ? `0-${hits.length - 1}/${hits.length}` : "*/0" });
    if (accept.includes("vnd.pgrst.object")) {
      if (hits.length === 1) return json(res, 200, hits[0]);
      return json(res, 406, { code: "PGRST116", details: `The result contains ${hits.length} rows`, message: "JSON object requested, multiple (or no) rows returned" });
    }
    return json(res, 200, hits);
  }
  if (req.method === "POST") {
    let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
      if (state.failNext > 0) { state.failNext--; return json(res, 500, { code: "XX000", message: "simulated failure" }); }
      const r = JSON.parse(body);
      if (!state.migrated && ("source" in r || "topic" in r || "message" in r)) return json(res, 400, { code: "42703", message: 'column "source" of relation "inquiries" does not exist' });
      const source = r.source ?? "project";
      if (state.migrated) {
        const ok = source === "project" ? PROJECT_REQ.every((k) => r[k] != null) : (source === "contact" && r.topic != null && r.message != null);
        if (!ok) return json(res, 400, { code: "23514", message: 'new row violates check constraint "inquiries_source_shape"' });
      } else {
        for (const k of [...PROJECT_REQ, "name", "email", "reference", "idempotency_key"]) if (r[k] == null) return json(res, 400, { code: "23502", message: `null value in column "${k}" violates not-null constraint` });
      }
      if (r.consent !== true) return json(res, 400, { code: "23514", message: "consent check" });
      if (state.rows.some((x) => x.idempotency_key === r.idempotency_key || x.reference === r.reference)) return json(res, 409, { code: "23505", message: "duplicate key value violates unique constraint" });
      state.rows.push({ ...r, source, created_at: new Date().toISOString() });
      return json(res, 201, undefined);
    });
    return;
  }
  json(res, 405, { message: "method" });
}).listen(54321, "127.0.0.1", () => console.log("fake supabase on 54321"));

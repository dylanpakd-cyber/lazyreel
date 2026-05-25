#!/usr/bin/env node
// enrich-deep.mjs — full-corpus DEEP visual enrichment via the Anthropic API
// (one call per cover image, 8x concurrent — no context ceiling). Targets only
// videos still missing method:"deepvis-cover". Reads the key from ./.env or
// ~/format-radar-deconstruct/.env. Output: data/decoded/_deepvis-all.jsonl (local).
//
// Usage: node pipeline/enrich-deep.mjs [--limit N] [--model claude-haiku-4-5-20251001]

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";

let key = process.env.ANTHROPIC_API_KEY;
for (const p of [`${homedir()}/format-radar-deconstruct/.env`, ".env"]) {
  if (!key && existsSync(p)) { const m = readFileSync(p, "utf8").match(/ANTHROPIC_API_KEY=(.+)/); if (m) key = m[1].trim(); }
}
if (!key) { console.error("ANTHROPIC_API_KEY missing"); process.exit(1); }
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const limit = args.limit ? Number(args.limit) : Infinity;
const model = args.model || "claude-haiku-4-5-20251001";
const outFile = "data/decoded/_deepvis-all.jsonl";

const load = (f) => existsSync(f) ? readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : [];

const cover = new Map();
for (const f of ["data/raw/scraped.jsonl", "data/raw/scraped-batch2.jsonl"]) for (const v of load(f)) { const u = v.webVideoUrl, c = v.videoMeta?.coverUrl; if (u && c) cover.set(u, c); }
const deepDone = new Set(load("data/decoded/enriched.jsonl").filter((e) => e.method === "deepvis-cover").map((e) => e.url));
// resume: skip ones already in the output file
const alreadyOut = new Set(load(outFile).map((r) => r.url));
const norm = new Map(); for (const n of [...load("data/raw/normalized.jsonl"), ...load("data/raw/normalized-batch2.jsonl")]) norm.set(n.url, n);
const lab = new Map(); for (const r of load("data/decoded/llm-labeled.jsonl")) lab.set(r.url, r);

const targets = [];
for (const [u, n] of norm) {
  if (deepDone.has(u) || alreadyOut.has(u) || !cover.get(u)) continue;
  const vpf = n.followers ? Number((n.views / n.followers).toFixed(2)) : null;
  targets.push({ url: u, cover: cover.get(u), niche: lab.get(u)?.niche || n.niche, views: n.views || 0, vpf });
}
targets.sort((a, b) => (b.vpf || 0) - (a.vpf || 0));
const work = targets.slice(0, limit);
console.error(`deep-visual TODO: ${targets.length} (resuming, ${alreadyOut.size} already done). processing ${work.length} this run on ${model}.`);

const FORMATS = "talking-head|voiceover-broll|text-overlay-heavy|screen-recording|product-demo|before-after|grwm|pov-handheld|green-screen|carousel-slideshow|lifestyle-broll|meme-edit|other";
const SYSTEM = "You label the craft of a short-form video from its cover thumbnail. Report only what is visible; use n-a/'' when not visible. Be decisive and consistent.";
function prompt() {
  return `Return ONLY JSON about this cover:
{"videoFormat":<${FORMATS}>,"presenterGender":<woman|man|multiple-people|no-person>,"ageRange":<teen|20s|30s|40s|50s+|n-a>,"creatorStyling":<polished|casual-messy|none-visible>,"setting":<bedroom/bathroom/kitchen/gym/car/outdoor/office/store/studio/etc or n-a>,"handsBusy":<holding-product/applying/pouring/gesturing/typing or "">,"onScreenText":<verbatim text on cover or "">,"openingVisual":<one short phrase>,"archetype":<girl-next-door/expert/founder/gym-bro/mom/aesthetic/faceless-hands/none>,"confidence":0.0-1.0}`;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchImg(url, attempt = 0) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(12000) });
    if (!r.ok) throw new Error(r.status);
    const ct = r.headers.get("content-type") || "image/jpeg";
    const media = ct.includes("png") ? "image/png" : ct.includes("webp") ? "image/webp" : "image/jpeg";
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 4_500_000 || buf.length < 500) throw new Error("size");
    return { data: buf.toString("base64"), media };
  } catch (e) { if (attempt < 2) { await sleep(800 * (attempt + 1)); return fetchImg(url, attempt + 1); } throw e; }
}
async function vision(b64, media, attempt = 0) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: 300, system: SYSTEM, messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: media, data: b64 } }, { type: "text", text: prompt() }] }] }),
  });
  if (!res.ok) { if ((res.status === 429 || res.status >= 500) && attempt < 5) { await sleep(1500 * (attempt + 1)); return vision(b64, media, attempt + 1); } throw new Error(res.status); }
  const d = await res.json();
  return { j: JSON.parse((d.content?.[0]?.text || "").trim().replace(/^```json\s*|\s*```$/g, "")), usage: d.usage };
}

const out = [];
let ok = 0, skip = 0, tin = 0, tout = 0;
const CONC = 8;
for (let i = 0; i < work.length; i += CONC) {
  const batch = work.slice(i, i + CONC);
  const res = await Promise.allSettled(batch.map(async (t) => {
    const img = await fetchImg(t.cover);
    const { j, usage } = await vision(img.data, img.media);
    tin += usage?.input_tokens || 0; tout += usage?.output_tokens || 0;
    return { url: t.url, niche: t.niche, views: t.views, viewsPerFollower: t.vpf, ...j, method: "deepvis-cover" };
  }));
  for (const x of res) { if (x.status === "fulfilled") { out.push(x.value); ok++; } else skip++; }
  if (i % 80 === 0 || i + CONC >= work.length) {
    writeFileSync(outFile, (load(outFile).filter((r) => !out.find((o) => o.url === r.url)).concat(out)).map((o) => JSON.stringify(o)).join("\n") + "\n");
    process.stderr.write(`\r  ${ok} ok / ${skip} skip / ${work.length}  (~$${((tin/1e6)*1+(tout/1e6)*5).toFixed(2)})   `);
  }
}
process.stderr.write("\n");
console.error(`done: ${ok} enriched, ${skip} skipped. tokens ${tin}/${tout} ~$${((tin/1e6)*1+(tout/1e6)*5).toFixed(2)}`);
console.log(ok);

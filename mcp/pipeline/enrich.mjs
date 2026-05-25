#!/usr/bin/env node
// enrich.mjs — the COST-ALTERNATIVE full-corpus pass. Instead of downloading
// every video (hours of yt-dlp), it uses the cover image we already scraped +
// a cheap vision model, plus free text/metadata signals. Runs over ALL videos.
//
// Per video it adds:
//   free (no API):   usesTrendingSound, usesTrendingHashtag, isLikelyTrend, soundReuse
//   cheap vision:    presenterGender, peopleCount, isDance, setting, videoFormat, coverText
//   (the deep first-3s + craft analysis stays in visual.mjs for breakouts)
//
// Requires ANTHROPIC_API_KEY. Output: data/decoded/enriched.jsonl (local, gitignored).
// Usage: node pipeline/enrich.mjs [--limit N] [--model claude-haiku-4-5-20251001]

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";

let key = process.env.ANTHROPIC_API_KEY;
for (const p of [`${homedir()}/.lazyreel/.env`, ".env"]) {
  if (!key && existsSync(p)) { const m = readFileSync(p, "utf8").match(/ANTHROPIC_API_KEY=(.+)/); if (m) key = m[1].trim(); }
}
if (!key) { console.error("ANTHROPIC_API_KEY missing"); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const limit = args.limit ? Number(args.limit) : Infinity;
const model = args.model || "claude-haiku-4-5-20251001";
const outFile = args.out || "data/decoded/enriched.jsonl";

// ---- load + join scraped (cover/music/hashtags) with labeled (niche/vpf) ----
const scraped = readFileSync("data/raw/scraped.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const labeledByUrl = new Map();
if (existsSync("data/decoded/llm-labeled.jsonl")) {
  for (const r of readFileSync("data/decoded/llm-labeled.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l))) labeledByUrl.set(r.url, r);
}
const normByUrl = new Map();
for (const n of readFileSync("data/raw/normalized.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l))) normByUrl.set(n.url, n);

// ---- free signals: trending sound (reused >=3 in corpus) + trending hashtag --
const soundCount = {};
for (const v of scraped) { const id = v.musicMeta?.musicId; if (id) soundCount[id] = (soundCount[id] || 0) + 1; }
let trendTags = new Set();
try {
  for (const line of readFileSync("data/trending-hashtags.csv", "utf8").split(/\r?\n/).slice(1)) {
    const tag = line.split(",")[0]; if (tag) trendTags.add(tag.toLowerCase());
  }
} catch {}

const rows = scraped.slice(0, limit);
console.error(`enriching ${rows.length} videos (cover image + cheap vision, model ${model})`);

const SYSTEM = `You label a short-form video from its single cover thumbnail. Report only what is visible. This is a fast triage pass, so be decisive but honest with confidence.`;
function prompt() {
  return `Return ONLY JSON about this video's cover image:
{
  "presenterGender": "woman | man | multiple-people | no-person",
  "peopleCount": 0,
  "isDance": true/false,
  "setting": "short phrase, where it's shot (bathroom, gym, kitchen, outdoors, car, studio, bedroom, store, n-a)",
  "videoFormat": "talking-head | voiceover-broll | text-overlay-heavy | screen-recording | product-demo | before-after | grwm | pov-handheld | green-screen | carousel-slideshow | lifestyle-broll | other",
  "coverText": "any text visible on the cover, verbatim, or ''",
  "confidence": 0.0-1.0
}`;
}

async function fetchImageB64(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!r.ok) throw new Error("img " + r.status);
  const ct = r.headers.get("content-type") || "image/jpeg";
  const media = ct.includes("png") ? "image/png" : ct.includes("webp") ? "image/webp" : "image/jpeg";
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 4_500_000) throw new Error("img too big");
  return { data: buf.toString("base64"), media };
}

async function vision(b64, media, attempt = 0) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: 250, system: SYSTEM, messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: media, data: b64 } }, { type: "text", text: prompt() }] }] }),
  });
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt < 4) { await new Promise((r) => setTimeout(r, 1500 * (attempt + 1))); return vision(b64, media, attempt + 1); }
    throw new Error(`${res.status}`);
  }
  const data = await res.json();
  return { j: JSON.parse((data.content?.[0]?.text || "").trim().replace(/^```json\s*|\s*```$/g, "")), usage: data.usage };
}

const out = [];
let ok = 0, skip = 0, tin = 0, tout = 0;
const CONC = 8;
for (let i = 0; i < rows.length; i += CONC) {
  const batch = rows.slice(i, i + CONC);
  const res = await Promise.allSettled(batch.map(async (v) => {
    const url = v.webVideoUrl || "";
    const lab = labeledByUrl.get(url) || {};
    const norm = normByUrl.get(url) || {};
    const cover = v.videoMeta?.coverUrl;
    const tags = (v.hashtags || []).map((h) => h.name).filter(Boolean).map((t) => t.toLowerCase());
    const musicId = v.musicMeta?.musicId;
    const reuse = musicId ? (soundCount[musicId] || 0) : 0;
    const usesTrendingSound = reuse >= 3;
    const usesTrendingHashtag = tags.some((t) => trendTags.has(t));
    let vis = {};
    if (cover) {
      try { const { data, media } = await fetchImageB64(cover); const r = await vision(data, media); vis = r.j; tin += r.usage?.input_tokens || 0; tout += r.usage?.output_tokens || 0; }
      catch { skip++; }
    } else skip++;
    return {
      url, niche: lab.niche || norm.niche || "general",
      views: v.playCount || 0, viewsPerFollower: lab.viewsPerFollower ?? null,
      hookPattern: lab.hookPattern || null, framework: lab.framework || null,
      durationSec: v.videoMeta?.duration || 0,
      soundReuse: reuse, usesTrendingSound, usesTrendingHashtag,
      isLikelyTrend: usesTrendingSound || usesTrendingHashtag,
      ...vis,
    };
  }));
  for (const x of res) if (x.status === "fulfilled") { out.push(x.value); if (x.value.presenterGender) ok++; }
  if (i % 80 === 0) writeFileSync(outFile, out.map((o) => JSON.stringify(o)).join("\n") + "\n");
  process.stderr.write(`\r  ${out.length}/${rows.length} (${ok} with vision, ${skip} img-skip)   `);
}
writeFileSync(outFile, out.map((o) => JSON.stringify(o)).join("\n") + "\n");
process.stderr.write("\n");
const cost = (tin / 1e6) * 1 + (tout / 1e6) * 5;
console.error(`enriched ${out.length} (${ok} with vision). tokens ${tin}/${tout} (~$${cost.toFixed(2)})`);
console.log(out.length);

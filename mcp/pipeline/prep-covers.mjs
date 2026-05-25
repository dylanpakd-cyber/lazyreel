#!/usr/bin/env node
// prep-covers.mjs — NO API. Picks the next wave of videos that still need DEEP
// visual enrichment, downloads their cover thumbnails to covers/<videoid>.jpg, and
// writes a targets file a Sonnet sub-agent reads. Run wave by wave.
//
// "Needs deep visual" = the video's enriched record is missing method:"deepvis-cover"
// (i.e. batch-1's shallow gender/setting, or batch-2's text-only enrichment).
//
// Usage: node pipeline/prep-covers.mjs [--limit 80] [--niche skincare]
//   --limit  how many to prep this wave (keep <= ~80 so one sub-agent can finish)
//   --niche  optional: restrict to one niche

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const limit = Number(args.limit || 80);
const onlyNiche = args.niche;

const load = (f) => existsSync(f) ? readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : [];

// cover URLs live in the scraped files
const cover = new Map();
for (const f of ["data/raw/scraped.jsonl", "data/raw/scraped-batch2.jsonl"]) for (const v of load(f)) { const u = v.webVideoUrl, c = v.videoMeta?.coverUrl; if (u && c) cover.set(u, c); }
// which already have deep visual
const deepDone = new Set(load("data/decoded/enriched.jsonl").filter((e) => e.method === "deepvis-cover").map((e) => e.url));
// rank remaining by vpf (breakouts first), need a cover + a niche
const norm = new Map(); for (const n of [...load("data/raw/normalized.jsonl"), ...load("data/raw/normalized-batch2.jsonl")]) norm.set(n.url, n);
const lab = new Map(); for (const r of load("data/decoded/llm-labeled.jsonl")) lab.set(r.url, r);

const cand = [];
for (const [u, n] of norm) {
  if (deepDone.has(u) || !cover.get(u)) continue;
  const niche = lab.get(u)?.niche || n.niche;
  if (onlyNiche && niche !== onlyNiche) continue;
  const vpf = n.followers ? n.views / n.followers : 0;
  cand.push({ url: u, cover: cover.get(u), niche, views: n.views || 0, vpf: Number(vpf.toFixed(2)) });
}
cand.sort((a, b) => b.vpf - a.vpf);
const wave = cand.slice(0, limit);
console.error(`remaining without deep-visual: ${cand.length}. prepping ${wave.length} this wave.`);

mkdirSync("covers", { recursive: true });
const vid = (u) => u.split("/").pop();
let ok = 0;
const https = await import("node:https");
for (const r of wave) {
  const p = `covers/${vid(r.url)}.jpg`;
  if (existsSync(p)) { ok++; continue; }
  try { execFileSync("curl", ["-s", "-L", "--max-time", "15", "-A", "Mozilla/5.0", "-o", p, r.cover]); if (existsSync(p)) ok++; } catch {}
}
writeFileSync("data/raw/_deepvis-targets.json", JSON.stringify(wave, null, 1) + "\n");
console.error(`covers ready: ${ok}/${wave.length} -> covers/<videoid>.jpg ; targets -> data/raw/_deepvis-targets.json`);
console.log(wave.length);

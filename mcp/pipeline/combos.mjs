#!/usr/bin/env node
// combos.mjs — the "what COMBINATION wins" engine. Single-axis lift says
// "direct-callout over-indexes." This crosses dimensions — hook × format ×
// person-trait × emotion — to find the COMBINATIONS that separate a breakout
// from a normal video. Contrastive lift on pairs (and a few triples), per niche
// and overall. Needs no API (pure stats over already-labeled+enriched data).
//
// Usage: node pipeline/combos.mjs   Output: data/combo-insights.json (committed; no source text)

import { readFileSync, writeFileSync } from "node:fs";

const lab = new Map();
for (const l of readFileSync("data/decoded/llm-labeled.jsonl", "utf8").split(/\r?\n/).filter(Boolean)) { try { const r = JSON.parse(l); if (r.url) lab.set(r.url, r); } catch {} }
const enr = new Map();
for (const l of readFileSync("data/decoded/enriched.jsonl", "utf8").split(/\r?\n/).filter(Boolean)) { try { const r = JSON.parse(l); if (r.url) enr.set(r.url, r); } catch {} }

function settingBucket(s) {
  s = (s || "").toLowerCase();
  for (const b of ["bedroom", "bathroom", "kitchen", "gym", "car", "outdoor", "office", "studio", "store", "desk"]) if (s.includes(b)) return b;
  return s ? "other" : "n-a";
}
// build the feature vector per analyzable video
const rows = [];
for (const [url, l] of lab) {
  const e = enr.get(url); if (!e) continue;
  const vpf = l.viewsPerFollower;
  if (typeof vpf !== "number") continue;
  rows.push({
    niche: l.niche, vpf,
    feat: {
      hook: l.hookPattern, framework: l.framework, emotion: l.emotion,
      format: e.videoFormat, gender: e.presenterGender, setting: settingBucket(e.setting),
      trend: e.isLikelyTrend ? "trend-riding" : "not-trend", face: e.presenterGender === "no-person" ? "faceless" : "has-face",
    },
  });
}

// which dimension PAIRS are worth crossing (across different dimension types)
const PAIRS = [
  ["hook", "format"], ["hook", "emotion"], ["hook", "gender"], ["hook", "setting"],
  ["format", "emotion"], ["format", "gender"], ["format", "face"], ["emotion", "gender"],
  ["hook", "trend"], ["format", "setting"], ["framework", "format"], ["hook", "face"],
];

function quantile(arr, q) { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))] || 0; }

function comboLift(set, minN) {
  if (set.length < 40) return [];
  const thresh = quantile(set.map((r) => r.vpf), 0.75);
  const win = set.filter((r) => r.vpf >= thresh), rest = set.filter((r) => r.vpf < thresh);
  if (!win.length || !rest.length) return [];
  const out = [];
  for (const [a, b] of PAIRS) {
    const counts = {};
    const key = (r) => `${r.feat[a]} + ${r.feat[b]}`;
    const valid = (r) => r.feat[a] && r.feat[b] && !["none", "n-a", "unclassified", "other", "has-face", "not-trend"].includes(String(r.feat[a])) && !["none", "n-a", "unclassified", "other", "has-face", "not-trend"].includes(String(r.feat[b]));
    const combos = new Set(set.filter(valid).map(key));
    for (const c of combos) {
      const inW = win.filter((r) => valid(r) && key(r) === c).length;
      const inR = rest.filter((r) => valid(r) && key(r) === c).length;
      const n = inW + inR; if (n < minN) continue;
      const pw = inW / win.length, pr = inR / rest.length;
      const lift = pr > 0 ? Number((pw / pr).toFixed(2)) : (pw > 0 ? 99 : 0);
      if (lift > 1.3) out.push({ combo: c, dims: `${a}×${b}`, lift, nWinners: inW, nTotal: n });
    }
  }
  return out.sort((x, y) => y.lift - x.lift);
}

const niches = [...new Set(rows.map((r) => r.niche))].filter((n) => n && n !== "general");
const byNiche = {};
for (const n of niches) { const c = comboLift(rows.filter((r) => r.niche === n), 5); if (c.length) byNiche[n] = c.slice(0, 8); }

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  analyzable: rows.length,
  method: "cross-dimensional contrastive lift: which feature COMBINATIONS (hook × format × person-trait × emotion) over-index among breakouts (top-quartile views-per-follower) vs the rest. Lift>1.3, min sample shown.",
  overall: comboLift(rows, 12).slice(0, 15),
  byNiche,
};
writeFileSync("data/combo-insights.json", JSON.stringify(out, null, 2) + "\n");
console.error(`combo insights: ${rows.length} analyzable videos, ${out.overall.length} overall winning combos, ${Object.keys(byNiche).length} niches`);
console.error("top overall combos:");
for (const c of out.overall.slice(0, 6)) console.error(`  ${c.combo} (${c.dims}): ${c.lift}x (n=${c.nTotal})`);

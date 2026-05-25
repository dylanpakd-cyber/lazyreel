#!/usr/bin/env node
// aggregate-enrich.mjs — turn the full-corpus enrichment (cover-image labels +
// free trend signals on all ~3,864 videos) into derived insights: which formats,
// presenter genders, settings, dance, and trend signals over-index among breakouts.
// Contrastive lift on views-per-follower (until creator-median rescore lands).
//
// Usage: node pipeline/aggregate-enrich.mjs --in data/decoded/enriched.jsonl
// Output: data/enrich-insights.json (committed; derived, no source text)

import { readFileSync, writeFileSync } from "node:fs";

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const rows = readFileSync(args.in || "data/decoded/enriched.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));

const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))] || 0; };
const tally = (set, k) => { const m = {}; for (const r of set) { const v = r[k]; if (v === undefined || v === null || v === "") continue; m[v] = (m[v] || 0) + 1; } return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1])); };

function lift(set, key, minN = 8) {
  const w = set.filter((r) => typeof r.viewsPerFollower === "number");
  if (w.length < 20) return [];
  const t = q(w.map((r) => r.viewsPerFollower), 0.75);
  const win = w.filter((r) => r.viewsPerFollower >= t), rest = w.filter((r) => r.viewsPerFollower < t);
  if (!win.length || !rest.length) return [];
  const labels = [...new Set(w.map((r) => String(r[key])).filter((x) => x && x !== "undefined" && x !== "null"))];
  return labels.map((label) => {
    const iw = win.filter((r) => String(r[key]) === label).length, ir = rest.filter((r) => String(r[key]) === label).length;
    const pw = iw / win.length, pr = ir / rest.length;
    return { label, lift: pr > 0 ? Number((pw / pr).toFixed(2)) : (pw > 0 ? 99 : 0), nWinners: iw, nTotal: iw + ir };
  }).filter((x) => x.nTotal >= minN).sort((a, b) => b.lift - a.lift);
}

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  analyzed: rows.length,
  note: "Full-corpus enrichment (cover-image vision + free trend signals). Contrastive lift on views-per-follower; switch to creator-median when scored. Derived only, no source text.",
  distributions: {
    videoFormat: tally(rows, "videoFormat"),
    presenterGender: tally(rows, "presenterGender"),
    setting: tally(rows, "setting"),
    danceRate: Number((rows.filter((r) => r.isDance).length / rows.length).toFixed(3)),
    trendRate: Number((rows.filter((r) => r.isLikelyTrend).length / rows.length).toFixed(3)),
  },
  overIndexInBreakouts: {
    videoFormat: lift(rows, "videoFormat"),
    presenterGender: lift(rows, "presenterGender"),
    setting: lift(rows, "setting"),
    isDance: lift(rows.map((r) => ({ ...r, isDance: String(!!r.isDance) })), "isDance", 5),
    usesTrendingSound: lift(rows.map((r) => ({ ...r, usesTrendingSound: String(!!r.usesTrendingSound) })), "usesTrendingSound", 5),
    isLikelyTrend: lift(rows.map((r) => ({ ...r, isLikelyTrend: String(!!r.isLikelyTrend) })), "isLikelyTrend", 5),
  },
};
writeFileSync("data/enrich-insights.json", JSON.stringify(out, null, 2) + "\n");
console.error(`enrich insights written from ${rows.length} videos`);

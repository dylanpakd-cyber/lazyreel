#!/usr/bin/env node
// aggregate-visual.mjs — fold the visual labels into derived insights: which
// FORMATS and craft attributes (styling, framing, lighting) over-index among
// breakouts, overall and per niche. Same contrastive-lift method as the hook
// analysis. Writes data/visual-insights.json (committed; no source text/urls).
//
// Usage: node pipeline/aggregate-visual.mjs --in data/decoded/visual.jsonl

import { readFileSync, writeFileSync } from "node:fs";

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const inFile = args.in || "data/decoded/visual.jsonl";
const rows = readFileSync(inFile, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));

function quantile(arr, q) { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))] || 0; }
function tally(set, key) { const m = {}; for (const r of set) { const k = r[key] || "n-a"; m[k] = (m[k] || 0) + 1; } return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1])); }

// contrastive lift of a categorical attribute within a row set, by views-per-follower breakouts
function lift(set, key, minN = 4) {
  const withVpf = set.filter((r) => typeof r.viewsPerFollower === "number");
  if (withVpf.length < 12) return [];
  const thresh = quantile(withVpf.map((r) => r.viewsPerFollower), 0.75);
  const win = withVpf.filter((r) => r.viewsPerFollower >= thresh), rest = withVpf.filter((r) => r.viewsPerFollower < thresh);
  if (!win.length || !rest.length) return [];
  const labels = [...new Set(withVpf.map((r) => r[key]).filter(Boolean))];
  return labels.map((label) => {
    const iw = win.filter((r) => r[key] === label).length, ir = rest.filter((r) => r[key] === label).length;
    const pw = iw / win.length, pr = ir / rest.length;
    const liftV = pr > 0 ? Number((pw / pr).toFixed(2)) : (pw > 0 ? 99 : 0);
    return { label, lift: liftV, nWinners: iw, nTotal: iw + ir, sharePct: Number((100 * (iw + ir) / withVpf.length).toFixed(1)) };
  }).filter((x) => x.nTotal >= minN && x.label !== "n-a").sort((a, b) => b.lift - a.lift);
}

const niches = [...new Set(rows.map((r) => r.niche))];
const byNiche = {};
for (const niche of niches) {
  const sub = rows.filter((r) => r.niche === niche);
  if (sub.length < 8) continue;
  byNiche[niche] = {
    sampleSize: sub.length,
    formatDistribution: tally(sub, "videoFormat"),
    formatsThatOverIndex: lift(sub, "videoFormat", 3),
  };
}

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  analyzed: rows.length,
  note: "Visual layer: format + craft attributes labeled from the first ~3s of each video by a vision model, then contrastive lift on views-per-follower. Derived analysis only; no frames, urls, or source text.",
  formatDistribution: tally(rows, "videoFormat"),
  formatsThatOverIndex: lift(rows, "videoFormat"),
  craft: {
    creatorStyling: { distribution: tally(rows, "creatorStyling"), lift: lift(rows, "creatorStyling") },
    cameraFraming: { distribution: tally(rows, "cameraFraming"), lift: lift(rows, "cameraFraming") },
    lighting: { distribution: tally(rows, "lighting"), lift: lift(rows, "lighting") },
    faceInFirst3s: { lift: lift(rows.map((r) => ({ ...r, faceInFirst3s: String(r.faceInFirst3s) })), "faceInFirst3s") },
  },
  byNiche,
};
writeFileSync("data/visual-insights.json", JSON.stringify(out, null, 2) + "\n");
console.error(`visual insights: ${rows.length} videos, ${niches.length} niches, ${Object.keys(out.formatDistribution).length} formats`);

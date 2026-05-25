#!/usr/bin/env node
// aggregate.mjs — honest pattern mining. Instead of averaging views (dominated
// by a few mega-viral outliers and by big accounts), this does a CONTRASTIVE
// analysis: within each niche, it splits videos into "breakouts" (top quartile
// by views-per-follower, i.e. videos that over-reached the creator's audience)
// vs the rest, then measures which hook patterns are OVER-REPRESENTED among
// breakouts (lift). Lift > 1 with a real sample size is a genuine signal.
//
// Usage: node pipeline/aggregate.mjs --in data/decoded/decoded.jsonl --source apify:tiktok

import { readFileSync, writeFileSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []),
);
const inFile = args.in || "data/decoded/decoded.jsonl";
const source = args.source || "input";

const rows = readFileSync(inFile, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)).map((r) => {
  // WS-4 (Lightreel-derived): engagement-rate quality gate + boost detection.
  const e = r.engagement || {};
  const v = e.views || 0;
  const engagementRate = v > 0 ? (e.likes + e.comments + e.shares + (e.saves || 0)) / v : 0;
  const engagementBand = engagementRate >= 0.05 ? "strong" : engagementRate >= 0.03 ? "solid" : engagementRate >= 0.003 ? "mixed" : "weak";
  // high views + near-zero engagement = likely boosted/low-quality reach -> exclude from "what works"
  const suspectedBoost = v >= 500000 && engagementRate < 0.003;
  return { ...r, engagementRate: Number(engagementRate.toFixed(4)), engagementBand, suspectedBoost };
});
const boosted = rows.filter((r) => r.suspectedBoost).length;

const median = (arr) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};
function quantile(arr, q) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
}

// Contrastive lift of a categorical label (hookPattern/framework) within a row set.
function liftAnalysis(subset, key) {
  const withVpf = subset.filter((r) => typeof r.viewsPerFollower === "number" && !r.suspectedBoost);
  if (withVpf.length < 12) return null; // too small to split honestly
  const thresh = quantile(withVpf.map((r) => r.viewsPerFollower), 0.75);
  const winners = withVpf.filter((r) => r.viewsPerFollower >= thresh);
  const rest = withVpf.filter((r) => r.viewsPerFollower < thresh);
  if (!winners.length || !rest.length) return null;

  const labels = [...new Set(withVpf.map((r) => r[key]))];
  const result = labels.map((label) => {
    const inW = winners.filter((r) => r[key] === label).length;
    const inR = rest.filter((r) => r[key] === label).length;
    const prevW = inW / winners.length;
    const prevR = inR / rest.length;
    const lift = prevR > 0 ? Number((prevW / prevR).toFixed(2)) : (prevW > 0 ? 99 : 0);
    const n = inW + inR;
    return { label, lift, nWinners: inW, nTotal: n, medianVpf: Number(median(withVpf.filter((r) => r[key] === label).map((r) => r.viewsPerFollower)).toFixed?.(2) ?? 0) };
  })
    .filter((x) => x.nTotal >= 6 && x.label && !["unclassified", "generic", "none", "null", "other", "n/a", ""].includes(String(x.label).toLowerCase()))
    .sort((a, b) => b.lift - a.lift);

  const table = result
    .filter((r) => r.label && !["unclassified", "generic", "none", "null", "other", "n/a", ""].includes(String(r.label).toLowerCase()))
    .map((r) => ({ label: r.label, count: r.nTotal, sharePct: Number((100 * r.nTotal / withVpf.length).toFixed(1)), lift: r.lift }))
    .sort((a, b) => b.count - a.count);
  return {
    sampleSize: withVpf.length,
    breakoutThresholdVpf: Number(thresh.toFixed(2)),
    breakouts: winners.length,
    overIndexed: result.filter((r) => r.lift > 1.15).slice(0, 5),
    underIndexed: result.filter((r) => r.lift < 0.85).slice(-3),
    table,
  };
}

function tally(key) {
  const m = {};
  for (const r of rows) { const k = r[key] || "unknown"; m[k] = (m[k] || 0) + 1; }
  return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1]));
}

const niches = [...new Set(rows.map((r) => r.niche))];
const byNiche = {};
for (const niche of niches) {
  const sub = rows.filter((r) => r.niche === niche);
  const hooks = liftAnalysis(sub, "hookPattern");
  if (!hooks) continue;
  // "gap" = a hook pattern that over-indexes (lift > 1.2) but is under-used
  // (below-median share of supply). High demand, low supply = the opening.
  const shares = hooks.table.map((t) => t.sharePct).sort((a, b) => a - b);
  const medianShare = shares[Math.floor(shares.length / 2)] || 0;
  const gaps = hooks.table
    .filter((t) => t.lift >= 1.2 && t.sharePct <= medianShare && t.count >= 4)
    .sort((a, b) => b.lift - a.lift);
  const saturated = hooks.table
    .filter((t) => t.sharePct >= 15 && t.lift <= 1.0)
    .sort((a, b) => b.sharePct - a.sharePct);
  byNiche[niche] = {
    sampleSize: sub.length,
    breakoutThresholdVpf: hooks.breakoutThresholdVpf,
    hookPatternsThatOverIndex: hooks.overIndexed,
    frameworks: (liftAnalysis(sub, "framework") || {}).overIndexed || [],
    patternTable: hooks.table,
    gaps,
    saturated,
  };
}

const classified = rows.filter((r) => r.hookPattern !== "unclassified").length;
const insights = {
  generatedAt: new Date().toISOString().slice(0, 10),
  source,
  decoded: rows.length,
  method: "contrastive lift: breakouts (top-quartile views-per-follower) vs rest, per niche",
  note: "Derived aggregates only; no source video text. Lift>1 means the hook pattern is over-represented among videos that over-reached their creator's following. Read low nTotal with caution.",
  classifiedShare: Number((classified / rows.length).toFixed(2)),
  hookPatternCounts: tally("hookPattern"),
  frameworkCounts: tally("framework"),
  nicheCounts: tally("niche"),
  overallHookLift: (liftAnalysis(rows, "hookPattern") || {}).overIndexed || [],
  byNiche,
};
writeFileSync("data/insights.json", JSON.stringify(insights, null, 2) + "\n");

let curated = 0;
try { curated = (JSON.parse(readFileSync("data/analyzed-videos.json", "utf8")).videos || []).length; } catch {}
let tags = 0;
try { tags = readFileSync("data/trending-hashtags.csv", "utf8").split(/\r?\n/).filter(Boolean).length - 1; } catch {}
writeFileSync("data/corpus-stats.json", JSON.stringify({
  generatedAt: new Date().toISOString().slice(0, 10),
  curatedTeardowns: curated,
  decodedByPipeline: rows.length,
  trendingTags: tags,
  classifiedShare: Number((classified / rows.length).toFixed(2)),
  note: "Counts computed from committed/derived data by pipeline/aggregate.mjs, not hand-typed.",
}, null, 2) + "\n");

console.error(`aggregated ${rows.length} rows (${Math.round(classified / rows.length * 100)}% classified); niches with signal: ${Object.keys(byNiche).length}`);

#!/usr/bin/env node
// aggregate.mjs — reads decoded JSONL, computes shippable aggregate insights
// (these are derived statistics, safe to redistribute) + a corpus-stats file
// whose counts the MCP and the site read. Run after decode.mjs.
//
// Usage: node pipeline/aggregate.mjs --in data/decoded/decoded.jsonl --source synthetic-demo

import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []),
);
const inFile = args.in || "data/decoded/decoded.jsonl";
const source = args.source || "input";

const rows = readFileSync(inFile, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));

function tally(key) {
  const m = {};
  for (const r of rows) { const k = r[key] || "unknown"; m[k] = (m[k] || 0) + 1; }
  return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1]));
}
// average views per hook pattern -> which patterns correlate with reach
function avgViewsBy(key) {
  const sum = {}, cnt = {};
  for (const r of rows) {
    const k = r[key] || "unknown"; const v = r.engagement?.views || 0;
    sum[k] = (sum[k] || 0) + v; cnt[k] = (cnt[k] || 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(sum).map(([k, s]) => [k, Math.round(s / cnt[k])]).sort((a, b) => b[1] - a[1]),
  );
}

// per-niche: which hook patterns actually pull the most views in THIS niche
function byNiche() {
  const niches = [...new Set(rows.map((r) => r.niche))];
  const out = {};
  for (const niche of niches) {
    const sub = rows.filter((r) => r.niche === niche);
    if (sub.length < 4) continue;
    const sum = {}, cnt = {};
    for (const r of sub) {
      const k = r.hookPattern; const v = r.engagement?.views || 0;
      sum[k] = (sum[k] || 0) + v; cnt[k] = (cnt[k] || 0) + 1;
    }
    const topHookPatterns = Object.entries(sum)
      .map(([k, s]) => ({ pattern: k, avgViews: Math.round(s / cnt[k]), n: cnt[k] }))
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 4);
    const fwCount = {};
    for (const r of sub) fwCount[r.framework] = (fwCount[r.framework] || 0) + 1;
    const topFrameworks = Object.entries(fwCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
    out[niche] = { sampleSize: sub.length, topHookPatterns, topFrameworks };
  }
  return out;
}

const insights = {
  generatedAt: new Date().toISOString().slice(0, 10),
  source,
  decoded: rows.length,
  note: "Derived aggregate statistics from an automated decode run over real scraped videos. Safe to redistribute. No source video content (transcripts/captions) is included here.",
  hookPatternCounts: tally("hookPattern"),
  frameworkCounts: tally("framework"),
  nicheCounts: tally("niche"),
  avgViewsByHookPattern: avgViewsBy("hookPattern"),
  byNiche: byNiche(),
  avgConfidence: Number((rows.reduce((s, r) => s + (r.confidence || 0), 0) / rows.length).toFixed(2)),
};
writeFileSync("data/insights.json", JSON.stringify(insights, null, 2) + "\n");

// corpus-stats: the computed counts the site + get_status trust.
let curated = 0;
try { curated = (JSON.parse(readFileSync("data/analyzed-videos.json", "utf8")).videos || []).length; } catch {}
let tags = 0;
try { tags = readFileSync("data/trending-hashtags.csv", "utf8").split(/\r?\n/).filter(Boolean).length - 1; } catch {}

const stats = {
  generatedAt: new Date().toISOString().slice(0, 10),
  curatedTeardowns: curated,
  decodedByPipeline: rows.length,
  trendingTags: tags,
  note: "Counts are computed from committed data by pipeline/aggregate.mjs, not hand-typed. curatedTeardowns are hand-authored on-domain teardowns; decodedByPipeline is the last automated run (off-domain demo unless re-run on real ad transcripts).",
};
writeFileSync("data/corpus-stats.json", JSON.stringify(stats, null, 2) + "\n");
console.error(`insights + corpus-stats written (decoded=${rows.length}, curated=${curated}, tags=${tags})`);

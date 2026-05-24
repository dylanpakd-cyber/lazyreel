#!/usr/bin/env node
// score.mjs — proper scoring (Lightreel-parity). Joins each video to its creator's
// median (from ingest-creators.mjs) and computes the real breakout metric:
//   breakoutScore = views / creator-median-views     (the headline number)
//   velocity      = views / hours-since-posted        (the "rising now" signal)
//   engagementRate + band + suspectedBoost            (quality gate)
// Falls back to views-per-follower when we don't have the creator's median yet.
//
// Usage: node pipeline/score.mjs   (reads normalized.jsonl + llm-labeled.jsonl + creator-medians.json)
// Output: data/decoded/scored.jsonl (local)

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const norm = readFileSync("data/raw/normalized.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const labByUrl = new Map();
if (existsSync("data/decoded/llm-labeled.jsonl")) for (const r of readFileSync("data/decoded/llm-labeled.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l))) labByUrl.set(r.url, r);
let medians = {};
try { medians = JSON.parse(readFileSync("data/raw/creator-medians.json", "utf8")); } catch {}

const now = Date.now();
const out = [];
let scoredByMedian = 0;
for (const v of norm) {
  const lab = labByUrl.get(v.url) || {};
  const views = v.views || 0;
  const cm = medians[v.author];
  const hasMedian = cm && cm.posts >= 5 && cm.medianViews > 0;
  const breakoutScore = hasMedian ? Number((views / cm.medianViews).toFixed(2)) : null;
  if (hasMedian) scoredByMedian++;
  const hours = v.createdAt ? Math.max(1, (now - new Date(v.createdAt).getTime()) / 3.6e6) : null;
  const velocity = hours ? Math.round(views / hours) : null;
  const e = { views, likes: v.likes || 0, comments: v.comments || 0, shares: v.shares || 0, saves: v.saves || 0 };
  const engagementRate = views > 0 ? Number(((e.likes + e.comments + e.shares + e.saves) / views).toFixed(4)) : 0;
  out.push({
    url: v.url, author: v.author, niche: v.niche,
    hookPattern: lab.hookPattern || null, framework: lab.framework || null,
    engagement: e,
    followers: v.followers || 0,
    viewsPerFollower: v.followers ? Number((views / v.followers).toFixed(2)) : null,
    creatorMedianViews: hasMedian ? cm.medianViews : null,
    breakoutScore,                 // PRIMARY metric (views / creator-median)
    breakoutMetric: hasMedian ? "creator-median" : "views-per-follower-fallback",
    velocity,
    engagementRate,
    engagementBand: engagementRate >= 0.05 ? "strong" : engagementRate >= 0.03 ? "solid" : engagementRate >= 0.003 ? "mixed" : "weak",
    suspectedBoost: views >= 500000 && engagementRate < 0.003,
    isBreakout: hasMedian ? breakoutScore >= 3 && views >= 50000 : null,
  });
}
writeFileSync("data/decoded/scored.jsonl", out.map((o) => JSON.stringify(o)).join("\n") + "\n");
console.error(`scored ${out.length} videos; ${scoredByMedian} via creator-median, ${out.length - scoredByMedian} on vpf fallback (need creator scrape)`);

// demonstrate: where breakout-score and views-per-follower DISAGREE
const both = out.filter((o) => o.breakoutScore !== null && o.viewsPerFollower !== null && o.engagement.views >= 50000);
both.sort((a, b) => b.breakoutScore - a.breakoutScore);
console.error("\nTop breakouts by creator-median (and their vpf rank for contrast):");
for (const o of both.slice(0, 6)) {
  console.error(`  @${o.author} ${o.engagement.views.toLocaleString()} views | breakout ${o.breakoutScore}x (median ${o.creatorMedianViews.toLocaleString()}) | vpf ${o.viewsPerFollower}`);
}
console.log(scoredByMedian);

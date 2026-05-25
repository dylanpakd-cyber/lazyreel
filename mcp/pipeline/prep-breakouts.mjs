#!/usr/bin/env node
// prep-breakouts.mjs — NO API. Prepares everything a Claude Code agent needs to
// do deep analysis on Claude Code credits (no Anthropic API key):
//   1) selects the top breakout videos per niche (by views-per-follower, transcript present)
//   2) attaches each one's transcript, caption, engagement, and the creator's other posts (for the A/B diff)
//   3) extracts first-3s frames (yt-dlp + ffmpeg) into frames/<id>/ so the agent can SEE them
//   4) writes data/_breakouts-to-analyze.json — the agent reads this + the frames, then writes teardowns/visual.
//
// Usage: node pipeline/prep-breakouts.mjs [--perNiche 6] [--minViews 500000] [--frames 1]
// (skip frame extraction with --frames 0 if yt-dlp is unavailable)

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const perNiche = Number(args.perNiche || 6);
const minViews = Number(args.minViews || 500000);
const doFrames = args.frames !== "0";

// pull from both batches if present
const labeled = [];
for (const f of ["data/decoded/llm-labeled.jsonl", "data/decoded/llm-labeled-batch2.jsonl"]) {
  if (existsSync(f)) for (const l of readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean)) { try { labeled.push(JSON.parse(l)); } catch {} }
}
const norm = new Map();
for (const f of ["data/raw/normalized.jsonl", "data/raw/normalized-batch2.jsonl"]) {
  if (existsSync(f)) for (const l of readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean)) { try { const n = JSON.parse(l); norm.set(n.url, n); } catch {} }
}
const byAuthor = new Map();
for (const n of norm.values()) if (n.author) (byAuthor.get(n.author) || byAuthor.set(n.author, []).get(n.author)).push(n);

const vid = (u) => (u.match(/video\/(\d+)/) || [])[1] || u.slice(-12);

const niches = [...new Set(labeled.map((r) => r.niche))].filter((n) => n && n !== "general");
const picks = [];
for (const niche of niches) {
  const cands = labeled
    .filter((r) => r.niche === niche && typeof r.viewsPerFollower === "number" && (r.engagement?.views || 0) >= minViews)
    .map((r) => ({ r, n: norm.get(r.url) }))
    .filter((x) => x.n && (x.n.transcript || "").trim().length > 40)
    .sort((a, b) => b.r.viewsPerFollower - a.r.viewsPerFollower)
    .slice(0, perNiche);
  picks.push(...cands);
}

mkdirSync("frames", { recursive: true });
const out = [];
let framed = 0;
for (const { r, n } of picks) {
  const id = vid(r.url);
  let frameFiles = [];
  if (doFrames) {
    const dir = `frames/${id}`; mkdirSync(dir, { recursive: true });
    try {
      const mp4 = `${dir}/v.mp4`;
      if (!existsSync(mp4)) execFileSync("yt-dlp", ["-q", "--no-warnings", "--no-progress", "-o", mp4, r.url], { timeout: 90000, stdio: ["ignore", "ignore", "ignore"] });
      for (const t of ["0.3", "1.5", "2.8", "6.0"]) {
        const jpg = `${dir}/f_${t}.jpg`;
        if (!existsSync(jpg)) execFileSync("ffmpeg", ["-loglevel", "error", "-ss", t, "-i", mp4, "-frames:v", "1", "-q:v", "5", "-vf", "scale=360:-1", jpg], { timeout: 20000 });
      }
      frameFiles = readdirSync(dir).filter((f) => f.endsWith(".jpg")).map((f) => `${dir}/${f}`).sort();
      if (frameFiles.length) framed++;
    } catch { /* geo/region/download fail — agent uses transcript only */ }
  }
  const sibs = (byAuthor.get(n.author) || []).filter((p) => p.url !== r.url && (p.views || 0) < (r.engagement?.views || 0) * 0.5)
    .sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3)
    .map((p) => ({ views: p.views, hook: (p.transcript || p.caption || "").slice(0, 120) }));
  out.push({
    id, url: r.url, niche: r.niche, author: n.author,
    views: r.engagement?.views || 0, viewsPerFollower: r.viewsPerFollower, followers: n.followers || 0,
    engagement: r.engagement, durationSec: n.duration || 0,
    hookPattern: r.hookPattern, framework: r.framework, emotion: r.emotion || null,
    transcript: (n.transcript || "").slice(0, 900), caption: (n.caption || "").slice(0, 200),
    frames: frameFiles, creatorNormPosts: sibs,
  });
}
writeFileSync("data/_breakouts-to-analyze.json", JSON.stringify({ count: out.length, framesExtracted: framed, breakouts: out }, null, 2) + "\n");
console.error(`prepped ${out.length} breakouts (${framed} with frames) -> data/_breakouts-to-analyze.json`);

#!/usr/bin/env node
// teardown.mjs — the real "why did it go viral" analyzer. Picks the genuine
// breakouts (videos that out-reached their creator's following, with a real
// spoken transcript) and has a strong model deconstruct WHY: the hook technique,
// the retention device, the viral mechanism, and what to steal. Grounded in the
// transcript + the over-performance evidence, not the view count alone.
//
// Writes TWO files:
//   data/decoded/winners-full.jsonl  (local, gitignored): includes url + transcript for audit
//   data/winners.json                (committed): derived structural teardowns only —
//                                     our analysis in our words, no verbatim transcript, no url
//
// Usage:
//   ANTHROPIC_API_KEY=... node pipeline/teardown.mjs --in data/decoded/llm-labeled.jsonl \
//       [--perNiche 6] [--minViews 500000] [--model claude-sonnet-4-6]

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";

let key = process.env.ANTHROPIC_API_KEY;
for (const p of [`${homedir()}/format-radar-deconstruct/.env`, ".env"]) {
  if (!key && existsSync(p)) { const m = readFileSync(p, "utf8").match(/ANTHROPIC_API_KEY=(.+)/); if (m) key = m[1].trim(); }
}
if (!key) { console.error("ANTHROPIC_API_KEY missing"); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const inFile = args.in || "data/decoded/llm-labeled.jsonl";
const perNiche = Number(args.perNiche || 6);
const minViews = Number(args.minViews || 500000);
const model = args.model || "claude-sonnet-4-6";

// We need the transcript, which lives in the normalized scrape, joined by url.
const labeled = readFileSync(inFile, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const normById = new Map();
const siblingsByAuthor = new Map(); // author -> their other posts, for the same-creator A/B diff
if (existsSync("data/raw/normalized.jsonl")) {
  for (const n of readFileSync("data/raw/normalized.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l))) {
    normById.set(n.url, n);
    if (n.author) { (siblingsByAuthor.get(n.author) || siblingsByAuthor.set(n.author, []).get(n.author)).push(n); }
  }
}
// the creator's OTHER posts (lower-view), as "normal" comparison points for the A/B diff
function creatorNormSamples(author, excludeUrl, breakoutViews) {
  const all = (siblingsByAuthor.get(author) || []).filter((p) => p.url !== excludeUrl);
  const normal = all.filter((p) => (p.views || 0) < breakoutViews * 0.5).sort((a, b) => (b.views || 0) - (a.views || 0));
  return (normal.length ? normal : all).slice(0, 3);
}

// Select genuine breakouts: real transcript, real reach, top views-per-follower per niche.
const niches = [...new Set(labeled.map((r) => r.niche))];
const picks = [];
for (const niche of niches) {
  if (niche === "general") continue;
  const cands = labeled
    .filter((r) => r.niche === niche && (r.engagement?.views || 0) >= minViews && typeof r.viewsPerFollower === "number")
    .map((r) => ({ r, norm: normById.get(r.url) }))
    .filter((x) => x.norm && (x.norm.transcript || "").trim().length > 40)
    .sort((a, b) => b.r.viewsPerFollower - a.r.viewsPerFollower)
    .slice(0, perNiche);
  picks.push(...cands);
}
console.error(`selected ${picks.length} breakout videos to tear down (model: ${model})`);

const SYSTEM = `You are a short-form video strategist who reverse-engineers why a specific video over-performed. You are given the spoken transcript and hard engagement evidence. You explain the MECHANISM, not platitudes. You never praise; you diagnose. You ground every claim in the transcript. If something is unclear from the transcript alone, you say so.`;

function prompt(x) {
  const r = x.r, n = x.norm;
  const e = r.engagement || {};
  const mult = r.viewsPerFollower;
  const sibs = creatorNormSamples(n.author, r.url, e.views);
  const sibBlock = sibs.length
    ? sibs.map((p) => `- ${(p.views || 0).toLocaleString()} views: "${((p.transcript || p.caption || "").slice(0, 120))}"`).join("\n")
    : "(no lower-performing posts from this creator available)";
  return `A video in the "${r.niche}" niche over-performed: it got ${e.views.toLocaleString()} views from a creator with ${(r.followers || 0).toLocaleString()} followers (${mult}x its following, a real breakout). Engagement: ${e.likes} likes, ${e.comments} comments, ${e.shares} shares, ${e.saves} saves. Duration ~${n.duration || "?"}s.

Spoken transcript:
"""${(n.transcript || "").slice(0, 900)}"""
Caption: "${(n.caption || "").slice(0, 200)}"

This creator's OTHER (more normal) posts, for comparison:
${sibBlock}

Diagnose WHY this reached far beyond the creator's audience. Return ONLY JSON:
{
  "hookTechnique": "the specific technique in the first ~3s, in your own words (do not quote the transcript verbatim)",
  "retentionDevice": "what keeps the viewer watching past the hook",
  "viralMechanism": "the single biggest reason this got shared/saved beyond the following (specific to THIS video)",
  "dimensionRatings": { "hook": "very-strong|strong|weak + 4-word why", "format": "...", "visual": "...", "audio": "..." },
  "vsCreatorNorm": "what specifically made THIS post separate from this creator's other posts above (the one changed variable), or 'insufficient comparison' if no siblings",
  "stealThis": "one concrete, reusable move another brand could copy",
  "confidence": 0.0-1.0
}`;
}

async function tear(x, attempt = 0) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: 600, system: SYSTEM, messages: [{ role: "user", content: prompt(x) }] }),
  });
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt < 4) { await new Promise((r) => setTimeout(r, 1500 * (attempt + 1))); return tear(x, attempt + 1); }
    throw new Error(`${res.status} ${(await res.text()).slice(0, 160)}`);
  }
  const data = await res.json();
  const j = JSON.parse((data.content?.[0]?.text || "").trim().replace(/^```json\s*|\s*```$/g, ""));
  return { j, usage: data.usage };
}

const full = [], committed = [];
let tin = 0, tout = 0;
const CONC = 5;
for (let i = 0; i < picks.length; i += CONC) {
  const batch = picks.slice(i, i + CONC);
  const results = await Promise.allSettled(batch.map(async (x) => {
    const { j, usage } = await tear(x);
    tin += usage?.input_tokens || 0; tout += usage?.output_tokens || 0;
    const e = x.r.engagement || {};
    const viewBucket = e.views >= 1e7 ? "10M+" : e.views >= 1e6 ? "1M+" : "500k+";
    full.push({ url: x.r.url, niche: x.r.niche, views: e.views, viewsPerFollower: x.r.viewsPerFollower,
      hook: (x.norm.transcript || "").slice(0, 160), ...j });
    committed.push({ // derived analysis only — safe to redistribute
      niche: x.r.niche,
      hookPattern: x.r.hookPattern,
      framework: x.r.framework,
      reach: `${x.r.viewsPerFollower}x following`,
      viewBucket,
      hookTechnique: j.hookTechnique,
      retentionDevice: j.retentionDevice,
      viralMechanism: j.viralMechanism,
      dimensionRatings: j.dimensionRatings || null,
      vsCreatorNorm: j.vsCreatorNorm || null,
      stealThis: j.stealThis,
    });
  }));
  const errs = results.filter((r) => r.status === "rejected");
  process.stderr.write(`\r  torn down ${full.length}/${picks.length}${errs.length ? ` (${errs.length} errs)` : ""}   `);
}
process.stderr.write("\n");

// sort committed by reach desc within niche for readability
committed.sort((a, b) => parseFloat(b.reach) - parseFloat(a.reach));
writeFileSync("data/decoded/winners-full.jsonl", full.map((o) => JSON.stringify(o)).join("\n") + "\n");
writeFileSync("data/winners.json", JSON.stringify({
  generatedAt: new Date().toISOString().slice(0, 10),
  note: "Derived viral teardowns of real breakout videos (over-reached the creator's following). Our analysis in our words; no verbatim transcript or source URL. The full audit version stays local.",
  count: committed.length,
  teardowns: committed,
}, null, 2) + "\n");
const cost = (tin / 1e6) * 3 + (tout / 1e6) * 15; // sonnet approx
console.error(`wrote ${committed.length} teardowns. tokens ${tin}/${tout} (~$${cost.toFixed(3)} on ${model})`);
console.log(committed.length);

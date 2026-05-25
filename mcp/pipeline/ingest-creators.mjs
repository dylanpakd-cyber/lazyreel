#!/usr/bin/env node
// ingest-creators.mjs — creator-list polling (the thing Lightreel's "10k creators"
// infra does). For each creator we've already seen, scrape their recent posts and
// compute their MEDIAN views. That median is what turns raw views into a proper
// breakout score (views / creator-median) instead of our weaker views-per-follower.
//
// Requires APIFY_TOKEN (env or ./.env). Output: data/raw/creator-medians.json (local).
// Usage: node pipeline/ingest-creators.mjs [--limit 15] [--per 20]
//   --limit caps creators (validate cheap first); --per = recent posts per creator.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

let token = process.env.APIFY_TOKEN;
if (!token && existsSync(".env")) { const m = readFileSync(".env", "utf8").match(/APIFY_TOKEN=(.+)/); if (m) token = m[1].trim(); }
if (!token) { console.error("APIFY_TOKEN missing"); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const limit = args.limit ? Number(args.limit) : Infinity;
const per = Number(args.per || 20);

// distinct creators from what we've already scraped, most-seen first
const scraped = readFileSync("data/raw/scraped.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const seen = {};
for (const v of scraped) { const h = v.authorMeta?.name; if (h) seen[h] = (seen[h] || 0) + 1; }
const handles = Object.keys(seen).sort((a, b) => seen[b] - seen[a]).slice(0, limit);
console.error(`polling ${handles.length} creators x ${per} recent posts...`);

const input = { profiles: handles, resultsPerPage: per, shouldDownloadVideos: false, shouldDownloadCovers: false, proxyCountryCode: "US" };
const start = await fetch(`https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs?token=${token}`,
  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
if (!start.ok) { console.error("apify start failed:", start.status, (await start.text()).slice(0, 200)); process.exit(1); }
const run = (await start.json()).data;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let status = run.status, waited = 0;
while (!["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"].includes(status)) {
  await sleep(8000); waited += 8;
  const d = (await (await fetch(`https://api.apify.com/v2/actor-runs/${run.id}?token=${token}`)).json()).data;
  status = d.status;
  process.stderr.write(`\r  ${status} (${waited}s, ~$${(d.usageTotalUsd || 0).toFixed(2)})   `);
  if (waited > 1800) break;
}
const items = await (await fetch(`https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${token}&clean=true&limit=100000`)).json();
console.error(`\ngot ${items.length} posts across creators`);

// group by creator -> median views
const byCreator = {};
for (const v of items) {
  const h = v.authorMeta?.name; if (!h) continue;
  (byCreator[h] ||= { views: [], followers: v.authorMeta?.fans || 0 }).views.push(v.playCount || 0);
}
const median = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const out = {};
for (const [h, d] of Object.entries(byCreator)) {
  out[h] = { medianViews: median(d.views), posts: d.views.length, followers: d.followers };
}
writeFileSync("data/raw/creator-medians.json", JSON.stringify(out, null, 1) + "\n");
const enough = Object.values(out).filter((c) => c.posts >= 5).length;
console.error(`computed medians for ${Object.keys(out).length} creators (${enough} with >=5 posts -> usable)`);
console.log(Object.keys(out).length);

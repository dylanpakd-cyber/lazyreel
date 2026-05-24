#!/usr/bin/env node
// ingest-apify.mjs — scrape real TikTok videos via Apify, fetch the spoken
// transcript (ASR subtitles) when present, and normalize into the decoder's
// input format. Raw scraped payloads stay local (gitignored); only our derived
// decode + aggregates get committed.
//
// Usage:
//   APIFY_TOKEN=... node pipeline/ingest-apify.mjs [--per 25] [--out data/raw/normalized.jsonl]
//
// Reads the token from env or ./.env (gitignored).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

// ---- token ----------------------------------------------------------------
let token = process.env.APIFY_TOKEN;
if (!token && existsSync(".env")) {
  const m = readFileSync(".env", "utf8").match(/APIFY_TOKEN=(.+)/);
  if (m) token = m[1].trim();
}
if (!token) { console.error("APIFY_TOKEN missing (env or ./.env)"); process.exit(1); }

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []),
);
const per = Number(args.per || 25);
const outFile = args.out || "data/raw/normalized.jsonl";

// hashtag -> our canonical niche
const HASHTAG_NICHE = {
  skincare: "skincare", skincareroutine: "skincare",
  makeup: "ABG beauty", grwm: "ABG beauty", beautytok: "ABG beauty",
  supplements: "supplements", wellnesstok: "supplements",
  gymtok: "fitness", fitnesstok: "fitness",
  foodtok: "food and beverage", matcha: "food and beverage",
  techtok: "tech and SaaS", gadgets: "tech and SaaS",
  fashiontok: "fashion", ootd: "fashion",
  cleantok: "home and cleaning", homehacks: "home and cleaning",
  hairtok: "hair",
  dogtok: "pets", pettok: "pets",
};
const hashtags = Object.keys(HASHTAG_NICHE);

console.error(`scraping ${hashtags.length} hashtags x ${per} = ~${hashtags.length * per} videos...`);

// ---- run the actor asynchronously, then poll (handles large runs) ---------
const input = {
  hashtags,
  resultsPerPage: per,
  shouldDownloadVideos: false,
  shouldDownloadCovers: false,
  shouldDownloadSubtitles: true,
  proxyCountryCode: "US",
};
const startRes = await fetch(`https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs?token=${token}`,
  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
if (!startRes.ok) { console.error("apify start failed:", startRes.status, (await startRes.text()).slice(0, 300)); process.exit(1); }
const run = (await startRes.json()).data;
const runId = run.id, datasetId = run.defaultDatasetId;
console.error(`run ${runId} started; polling...`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let status = run.status, waited = 0;
while (!["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"].includes(status)) {
  await sleep(8000); waited += 8;
  const s = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
  const d = (await s.json()).data;
  status = d.status;
  process.stderr.write(`\r  ${status} (${waited}s, ~$${(d.usageTotalUsd || 0).toFixed(2)})   `);
  if (waited > 1800) { console.error("\npolling timed out at 30min; continuing with whatever scraped"); break; }
}
console.error(`\nrun ${status}; fetching dataset...`);

const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true&limit=100000`);
const items = await itemsRes.json();
console.error(`got ${items.length} raw items`);

// save raw (gitignored) for audit
mkdirSync("data/raw", { recursive: true });
writeFileSync("data/raw/scraped.jsonl", items.map((i) => JSON.stringify(i)).join("\n") + "\n");

// ---- fetch spoken transcript (best-effort) --------------------------------
function vttToText(vtt) {
  return vtt.split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && l !== "WEBVTT" && !l.includes("-->") && !/^\d+$/.test(l) && !l.startsWith("Kind:") && !l.startsWith("Language:"))
    .join(" ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
async function fetchTranscript(item) {
  const links = (item.videoMeta?.subtitleLinks) || [];
  const eng = links.find((s) => /eng/i.test(s.language || ""));
  if (!eng?.downloadLink) return "";
  try {
    const r = await fetch(eng.downloadLink, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return "";
    return vttToText(await r.text());
  } catch { return ""; }
}

// ---- normalize (transcripts fetched in parallel, the slow part) -----------
let withTranscript = 0, done = 0;
const CONCURRENCY = 12;
async function normalizeOne(v) {
  const niche = HASHTAG_NICHE[v.searchHashtag] || "general";
  const transcript = await fetchTranscript(v);
  if (transcript) withTranscript++;
  done++;
  if (done % 250 === 0) process.stderr.write(`\r  transcripts ${done}/${items.length}   `);
  const tags = (v.hashtags || []).map((h) => h.name).filter(Boolean);
  return {
    source: "apify:tiktok",
    url: v.webVideoUrl || "",
    niche,
    transcript,
    caption: v.text || "",
    hashtags: tags,
    views: v.playCount || 0,
    likes: v.diggCount || 0,
    shares: v.shareCount || 0,
    comments: v.commentCount || 0,
    saves: v.collectCount || 0,
    followers: v.authorMeta?.fans || 0,   // creator following size, for over-performance math
    author: v.authorMeta?.name || "",
    duration: v.videoMeta?.duration || 0,
    isAd: !!(v.isAd || v.isSponsored),
    createdAt: v.createTimeISO || "",
  };
}
const normalized = [];
for (let i = 0; i < items.length; i += CONCURRENCY) {
  const batch = items.slice(i, i + CONCURRENCY);
  normalized.push(...await Promise.all(batch.map(normalizeOne)));
}
process.stderr.write("\n");

mkdirSync("data/raw", { recursive: true });
writeFileSync(outFile, normalized.map((n) => JSON.stringify(n)).join("\n") + "\n");
console.error(`normalized ${normalized.length} videos (${withTranscript} with spoken transcript) -> ${outFile}`);
console.log(normalized.length);

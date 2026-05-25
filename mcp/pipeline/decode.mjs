#!/usr/bin/env node
// decode.mjs — the decoder. Turns a video record (transcript + caption +
// engagement) into one structured LazyReel record: hook, hook pattern, framework,
// niche, engagement tier, why it worked, confidence. Heuristic, offline, scales.
//
// Usage:
//   node pipeline/decode.mjs --in <file.csv|file.jsonl> [--out decoded.jsonl] [--source label]
//
// Input formats:
//   CSV  with a `video_transcription_text` column (the synthetic TikTok set), or
//   JSONL with { transcript, caption?, hashtags?, views?, likes?, shares?, comments? }
//
// Output: JSONL, one decode record per line. The count of lines IS the "decoded" count.

import { readFileSync, writeFileSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const inFile = args.in;
const outFile = args.out || "data/decoded/decoded.jsonl";
const sourceLabel = args.source || "input";
if (!inFile) { console.error("need --in <file>"); process.exit(1); }

// ---- niche keyword map ----------------------------------------------------
const NICHE = {
  "ABG beauty": ["makeup","lip","lash","blush","mascara","brow","foundation","concealer","perfume","fragrance","nails"],
  "skincare": ["skin","serum","retinol","retinal","spf","sunscreen","moisturizer","acne","peptide","mask","wrinkle"],
  "supplements": ["supplement","greens","magnesium","electrolyte","protein","vitamin","collagen","creatine","gut"],
  "fitness": ["gym","workout","fitness","muscle","band","yoga","mat","cardio","lift","steps"],
  "food and beverage": ["matcha","coffee","creamer","snack","drink","recipe","meal","latte","tea","protein bar"],
  "tech and SaaS": ["app","software","ai","tool","charger","gadget","saas","automation","workflow","notes"],
  "fashion": ["jeans","dress","bag","shoes","outfit","denim","fit","wardrobe","style","flats"],
  "home and cleaning": ["clean","shower","fridge","organizer","candle","kitchen","laundry","home","spray"],
  "hair": ["hair","scalp","curl","shampoo","conditioner","rosemary","heatless","frizz"],
  "pets": ["dog","cat","pet","chew","puppy","kitten","vet","leash"],
};

// ---- hook-pattern signals (the 13 taxonomy) -------------------------------
// Ordered most-specific first. The generic "question" is intentionally narrow
// (the FIRST line must itself be a question), and there is NO catch-all sink:
// if nothing matches we label "unclassified" rather than inflating one bucket.
const HOOK_SIGNALS = [
  ["pov", /\bpov\b|when you|that moment when/i],
  ["belief", /i (used to )?thought|turns out|was wrong|nobody (told|tells) (me|you)|plot twist/i],
  ["callout", /\b(for|to) (the |all the |everyone |anyone |those |my )?(girlies|girls|people|person|moms|guys|men|women)\b.*\b(who|that|with)\b/i],
  ["beforeafter", /before .*(after|→)|day (1|one).*(day|week)|week \d+.*(week|month)|\d+ (days|weeks) later/i],
  ["howto", /^\s*how (to|i|she|he|they)\b/i],
  ["authority", /\b(experts?|doctors?|dermatologists?|derms?|researchers?|scientists?|nutritionists?|estheticians?)\b/i],
  ["removelimit", /\beven if\b|\bwithout (a|the|any|ever)\b|no (experience|gym|skill|budget|time|effort)/i],
  ["exclusivity", /\bthe only\b|nothing else (works|comes close)|no other\b/i],
  ["contrast", /\bvs\.?\b|versus|compared to|\$\d[\d,]*\s.*\$\d/i],
  ["speed", /\bin (one|1|two|2|three|3|\d+) (use|day|days|week|weeks|minute|minutes|night|seconds)\b|overnight/i],
  ["newness", /nobody('?s| is) talking|just (dropped|launched|found)|new (it|holy grail|favorite)|viral/i],
  ["size", /\b\d{2,}(\b|%|x| million| billion| of)/i],
  ["question", /^\s*(why|how|what|when|is|are|do|does|can|should|did|have you|ever)\b|^[^.?!]{4,90}\?/i],
];

// ---- framework signals (the 12) -------------------------------------------
const FRAMEWORK_SIGNALS = [
  ["usvsthem", /\bvs\b|versus|compared to/i],
  ["objections", /scam|skeptic|i thought|didn'?t believe|objection|too good to be true/i],
  ["founder", /we built|we started|our story|i founded|as a founder|why we made/i],
  ["listicle", /^\d+ (reasons|things|ways|signs)|here are \d+|\d+ mistakes/i],
  ["contrarian", /secret|they don'?t want|the truth about|industry|nobody tells/i],
  ["without", /without|even if/i],
  ["tripleg", /goal|the gap|finally hit|new year/i],
  ["tease", /wait for it|you won'?t believe|watch what|the reason will/i],
  ["bandwagon", /everyone('?s| is)|the .* girlies|trend|joining/i],
  ["organic", /\bpov\b|get ready with me|grwm|day in (my|the) life|what i (use|do)/i],
];

function firstSentence(text) {
  const t = (text || "").trim();
  const m = t.split(/(?<=[.?!])\s+/)[0] || t;
  return m.length > 110 ? m.slice(0, 107).trimEnd() + "..." : m;
}
function classify(text, signals, fallback) {
  for (const [id, re] of signals) if (re.test(text)) return id;
  return fallback;
}
// classify on the HOOK (first line) only, not the whole transcript, so a long
// transcript doesn't trip every regex. This is what a viewer sees in 2 seconds.
function hookText(r) {
  const spoken = (r.transcript || "").trim();
  const cap = (r.caption || "").trim();
  const base = spoken || cap;
  return firstSentence(base);
}
function detectNiche(text) {
  const lo = text.toLowerCase();
  let best = null, bestHits = 0;
  for (const [niche, words] of Object.entries(NICHE)) {
    const hits = words.reduce((s, w) => s + (lo.includes(w) ? 1 : 0), 0);
    if (hits > bestHits) { bestHits = hits; best = niche; }
  }
  return { niche: best || "general", nicheHits: bestHits };
}

// ---- read input -----------------------------------------------------------
function parseCsvLine(line) {
  // simple split; the synthetic set has no embedded commas in transcripts
  return line.split(",");
}
function loadRecords(file) {
  const text = readFileSync(file, "utf8");
  if (file.endsWith(".jsonl")) {
    return text.split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)).map((r) => ({
      ...r,
      saves: r.saves ?? 0,
    }));
  }
  // CSV (synthetic TikTok schema)
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines[0]);
  const idx = (name) => header.indexOf(name);
  const tIdx = idx("video_transcription_text");
  const vIdx = idx("video_view_count"), lIdx = idx("video_like_count");
  const sIdx = idx("video_share_count"), cIdx = idx("video_comment_count");
  return lines.slice(1).map((l) => {
    const f = parseCsvLine(l);
    return {
      transcript: tIdx >= 0 ? f[tIdx] : "",
      views: vIdx >= 0 ? Number(f[vIdx]) || 0 : 0,
      likes: lIdx >= 0 ? Number(f[lIdx]) || 0 : 0,
      shares: sIdx >= 0 ? Number(f[sIdx]) || 0 : 0,
      comments: cIdx >= 0 ? Number(f[cIdx]) || 0 : 0,
    };
  });
}

const records = loadRecords(inFile);

// ---- engagement tiering: percentile of views across this corpus -----------
const views = records.map((r) => r.views || 0).sort((a, b) => a - b);
const pct = (p) => views[Math.min(views.length - 1, Math.floor(p * views.length))] || 0;
const p60 = pct(0.6), p90 = pct(0.9);
const tier = (v) => (v >= p90 ? "breakout" : v >= p60 ? "high" : "steady");

// ---- decode ---------------------------------------------------------------
const WHY = {
  pov: "opens on a too-real moment, so the right viewer recognizes themselves in the first second",
  belief: "leads with the viewer's own doubt, which makes the proof land harder",
  callout: "names a hyper-specific person, so the right buyer stops scrolling",
  beforeafter: "shows the transformation, which is its own proof",
  howto: "promises a concrete outcome up front",
  question: "opens a loop the viewer needs to resolve",
  authority: "borrows expert credibility for a skeptical market",
  removelimit: "removes the disqualifier that keeps the buyer out",
  exclusivity: "frames the product as the only one that clears the bar",
  contrast: "a head-to-head the viewer can judge for themselves",
  speed: "a fast, concrete result claim",
  newness: "novelty plus a trend signal",
  size: "a concrete number beats a vague benefit",
};

const out = [];
for (const r of records) {
  const hk = hookText(r);
  const fullText = [r.transcript, r.caption, (r.hashtags || []).join(" ")].filter(Boolean).join(" ");
  if (!hk && !fullText.trim()) continue;
  // hook pattern is judged on the hook line; framework on the fuller text
  const hookPattern = classify(hk, HOOK_SIGNALS, "unclassified");
  const framework = classify(fullText, FRAMEWORK_SIGNALS, "unclassified");
  const detected = detectNiche(fullText);
  const niche = r.niche && r.niche !== "general" ? r.niche : detected.niche;
  const eng = { views: r.views || 0, likes: r.likes || 0, shares: r.shares || 0, comments: r.comments || 0, saves: r.saves || 0 };
  const followers = r.followers || 0;
  // views-per-follower: the over-performance signal. >1 means the video reached
  // beyond the creator's own audience (a real breakout, not just a big account).
  const vpf = followers > 0 ? Number((eng.views / followers).toFixed(2)) : null;
  const engagementRate = eng.views > 0 ? Number(((eng.likes + eng.comments + eng.shares + eng.saves) / eng.views).toFixed(4)) : 0;
  out.push({
    source: sourceLabel,
    hook: hk,
    hookPattern,
    framework,
    niche,
    method: "heuristic-v2",          // honest: regex-on-hook-line, not an LLM (yet)
    engagement: eng,
    followers,
    viewsPerFollower: vpf,           // null when follower count unknown
    engagementRate,
    durationSec: r.duration || 0,
    hasTranscript: !!(r.transcript && r.transcript.trim()),
    isAd: !!r.isAd,
  });
}

writeFileSync(outFile, out.map((o) => JSON.stringify(o)).join("\n") + "\n");
console.error(`decoded ${out.length} records from ${records.length} inputs -> ${outFile}`);
console.log(out.length);

#!/usr/bin/env node
// words.mjs — FREE (no API) language analysis. From the spoken-hook lines we
// already have, computes per niche: the most common opening words and bigrams,
// and which words OVER-INDEX in breakouts (top-quartile views-per-follower).
// Answers "what words / hooks do winners actually open with?"
//
// Usage: node pipeline/words.mjs   (reads llm-labeled.jsonl + normalized.jsonl)
// Output: data/word-insights.json (committed — counts + lift only, no full text)

import { readFileSync, writeFileSync } from "node:fs";

const labeled = readFileSync("data/decoded/llm-labeled.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const transcriptByUrl = new Map();
for (const n of readFileSync("data/raw/normalized.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l))) {
  transcriptByUrl.set(n.url, (n.transcript || n.caption || ""));
}

const STOP = new Set([
  ..."the a an and or but of to in on for with my your you i it this that is are was were be been have has had do does did so just like really very then than at as it's i'm you're we my me up out about get got go going know what when how why if no not yeah okay ok oh um uh".split(/\s+/),
  // platform + scrape-hashtag noise so we measure real language, not tags
  ..."fyp foryou foryoupage fypage viral trending tiktok tiktokmademebuyit reels reel explore capcut".split(/\s+/),
  ..."skincare skincareroutine makeup grwm beautytok supplements wellnesstok gymtok fitnesstok foodtok matcha techtok gadgets fashiontok ootd cleantok homehacks hairtok dogtok pettok".split(/\s+/),
]);

function hookTokens(text) {
  return text.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").split(/\s+/)
    .filter(Boolean).slice(0, 12) // first ~12 words = the hook
    .filter((w) => w.length > 2 && !STOP.has(w));
}
function bigrams(toks) { const b = []; for (let i = 0; i < toks.length - 1; i++) b.push(toks[i] + " " + toks[i + 1]); return b; }

function analyzeSet(rows) {
  const withVpf = rows.filter((r) => typeof r.viewsPerFollower === "number" && transcriptByUrl.get(r.url));
  if (withVpf.length < 12) return null;
  const sorted = [...withVpf].map((r) => r.viewsPerFollower).sort((a, b) => a - b);
  const thresh = sorted[Math.floor(0.75 * sorted.length)];
  const win = withVpf.filter((r) => r.viewsPerFollower >= thresh);
  const rest = withVpf.filter((r) => r.viewsPerFollower < thresh);

  function freq(set, gram) {
    const m = {};
    for (const r of set) {
      const toks = hookTokens(transcriptByUrl.get(r.url));
      const grams = gram === 1 ? toks : bigrams(toks);
      for (const g of new Set(grams)) m[g] = (m[g] || 0) + 1; // doc frequency
    }
    return m;
  }
  function lift(gram) {
    const fw = freq(win, gram), fr = freq(rest, gram);
    const terms = [...new Set([...Object.keys(fw), ...Object.keys(fr)])];
    return terms.map((t) => {
      const pw = (fw[t] || 0) / win.length, pr = (fr[t] || 0) / rest.length;
      const n = (fw[t] || 0) + (fr[t] || 0);
      return { term: t, lift: pr > 0 ? Number((pw / pr).toFixed(2)) : (pw > 0 ? 99 : 0), nWinners: fw[t] || 0, nTotal: n };
    }).filter((x) => x.nTotal >= Math.max(4, Math.round(withVpf.length * 0.03))).sort((a, b) => b.lift - a.lift);
  }
  // most common overall (doc freq across all)
  const allWords = freq(withVpf, 1), allBigrams = freq(withVpf, 2);
  const topCommon = (m) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([term, count]) => ({ term, count }));
  return {
    sampleSize: withVpf.length,
    commonOpeningWords: topCommon(allWords),
    commonOpeningBigrams: topCommon(allBigrams),
    wordsThatOverIndex: lift(1).filter((x) => x.lift > 1.2).slice(0, 10),
    phrasesThatOverIndex: lift(2).filter((x) => x.lift > 1.2).slice(0, 10),
  };
}

const niches = [...new Set(labeled.map((r) => r.niche))].filter((n) => n !== "general");
const byNiche = {};
for (const niche of niches) { const a = analyzeSet(labeled.filter((r) => r.niche === niche)); if (a) byNiche[niche] = a; }
const overall = analyzeSet(labeled);

writeFileSync("data/word-insights.json", JSON.stringify({
  generatedAt: new Date().toISOString().slice(0, 10),
  note: "Free language analysis of spoken-hook openings. 'overIndex' = the word/phrase is more common among breakouts (top-quartile views-per-follower) than the rest. Counts are document frequencies; no full transcripts stored.",
  overall, byNiche,
}, null, 2) + "\n");
console.error(`word insights: overall + ${Object.keys(byNiche).length} niches`);

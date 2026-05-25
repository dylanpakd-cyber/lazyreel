#!/usr/bin/env node
// build-wiki.mjs — generate an interlinked, browsable knowledge wiki from the
// decoded corpus, InfraNodus-style: one page per niche, one per hook pattern,
// cross-linked, plus a GitHub-rendered Mermaid "connection map" that shows which
// hook patterns win across which niches (the commonalities). All derived analysis
// (no scraped text), so it ships in the repo for anyone to explore.
//
// Usage: node pipeline/build-wiki.mjs   (reads data/insights.json + data/winners.json)
// Output: ../wiki/

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const ins = JSON.parse(readFileSync("data/insights.json", "utf8"));
let winners = [];
try { winners = JSON.parse(readFileSync("data/winners.json", "utf8")).teardowns || []; } catch {}
let stats = {};
try { stats = JSON.parse(readFileSync("data/corpus-stats.json", "utf8")); } catch {}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const WIKI = "../wiki";
mkdirSync(`${WIKI}/niches`, { recursive: true });
mkdirSync(`${WIKI}/patterns`, { recursive: true });

const niches = Object.keys(ins.byNiche || {});

// ---- collect pattern -> niches where it over-indexes (the connections) -----
const patternNiches = {}; // pattern -> [{niche, lift}]
for (const niche of niches) {
  for (const h of (ins.byNiche[niche].hookPatternsThatOverIndex || [])) {
    (patternNiches[h.label] ||= []).push({ niche, lift: h.lift });
  }
}

// ---- the connection map (Mermaid; GitHub renders it natively) --------------
function connectionMap() {
  const lines = ["```mermaid", "graph LR"];
  // niche nodes
  for (const n of niches) lines.push(`  N_${slug(n)}["${n}"]:::niche`);
  // pattern nodes + edges where a pattern over-indexes in a niche
  const patterns = Object.keys(patternNiches);
  for (const p of patterns) lines.push(`  P_${slug(p)}(["${p}"]):::pat`);
  for (const niche of niches) {
    for (const h of (ins.byNiche[niche].hookPatternsThatOverIndex || []).slice(0, 4)) {
      lines.push(`  N_${slug(niche)} -->|${h.lift}x| P_${slug(h.label)}`);
    }
  }
  lines.push("  classDef niche fill:#1A1916,color:#EDEAE0,stroke:#F54E00;");
  lines.push("  classDef pat fill:#D4FF3F,color:#17150F,stroke:#17150F;");
  lines.push("```");
  return lines.join("\n");
}

// ---- index --------------------------------------------------------------
const overall = (ins.overallHookLift || []).map((h) => `- **${h.label}** — ${h.lift}x more common in breakouts (n=${h.nTotal})`).join("\n");
const sharedPatterns = Object.entries(patternNiches)
  .filter(([, ns]) => ns.length >= 2)
  .sort((a, b) => b[1].length - a[1].length)
  .map(([p, ns]) => `- **[${p}](patterns/${slug(p)}.md)** wins in ${ns.length} niches: ${ns.map((x) => x.niche).join(", ")}`)
  .join("\n");

writeFileSync(`${WIKI}/README.md`, `# LazyReel — decoded insights wiki

Auto-generated from ${stats.decodedByPipeline?.toLocaleString() || "the"} real short-form videos decoded by the pipeline. This is derived analysis (no source video content). Regenerate with \`node pipeline/build-wiki.mjs\`.

## The connection map

Which hook patterns over-perform in which niches. A pattern wired to several niches is a cross-niche winner; a pattern unique to one niche is a niche-specific edge. (Edge labels = lift among breakouts.)

${connectionMap()}

## Cross-niche winners (the commonalities)

Hook patterns that over-index among breakouts in more than one niche:

${sharedPatterns || "_Not enough multi-niche signal yet._"}

## What wins overall

${overall}

## Niches

${niches.map((n) => `- [${n}](niches/${slug(n)}.md) — ${ins.byNiche[n].sampleSize} videos decoded`).join("\n")}

## Hook patterns

${Object.keys(patternNiches).map((p) => `- [${p}](patterns/${slug(p)}.md)`).join("\n")}

---
_Method: a model labels each video's real spoken hook; engagement is normalized by follower count (over-performance, not raw views); patterns are mined by contrastive lift (breakouts vs the rest). See [../mcp/pipeline/README.md](../mcp/pipeline/README.md)._
`);

// ---- per-niche pages ----------------------------------------------------
for (const niche of niches) {
  const d = ins.byNiche[niche];
  const gaps = (d.gaps || []).map((g) => `- **[${g.label}](../patterns/${slug(g.label)}.md)** — over-indexes ${g.lift}x but only ${g.sharePct}% of videos use it. The opening.`).join("\n");
  const sat = (d.saturated || []).map((s) => `- **${s.label}** — ${s.sharePct}% of videos, performs ${s.lift}x. Crowded.`).join("\n");
  const table = (d.patternTable || []).slice(0, 10).map((t) => `| [${t.label}](../patterns/${slug(t.label)}.md) | ${t.count} | ${t.sharePct}% | ${t.lift}x |`).join("\n");
  const wins = winners.filter((w) => w.niche === niche).slice(0, 4).map((w) =>
    `### ${w.reach} · ${w.viewBucket} · ${w.hookPattern}\n- **Hook technique:** ${w.hookTechnique}\n- **Why it spread:** ${w.viralMechanism}\n- **Steal this:** ${w.stealThis}`).join("\n\n");
  writeFileSync(`${WIKI}/niches/${slug(niche)}.md`, `# ${niche}

[← all niches](../README.md) · ${d.sampleSize} videos decoded · breakout threshold ${d.breakoutThresholdVpf}x views-per-follower

## The opening (high performance, under-used)
${gaps || "_No clear under-supplied winner at this sample size._"}

## Crowded (hard to stand out)
${sat || "_Nothing dominant._"}

## Every hook pattern here
| Pattern | Videos | Share | Lift in breakouts |
| --- | --- | --- | --- |
${table}

## Real breakouts, torn down
${wins || "_No breakout teardowns for this niche yet._"}
`);
}

// ---- per-pattern pages --------------------------------------------------
for (const [pat, ns] of Object.entries(patternNiches)) {
  const sorted = ns.sort((a, b) => b.lift - a.lift);
  const overallLift = (ins.overallHookLift || []).find((h) => h.label === pat);
  const exMechs = winners.filter((w) => w.hookPattern === pat).slice(0, 3)
    .map((w) => `- _(${w.niche})_ ${w.viralMechanism}`).join("\n");
  writeFileSync(`${WIKI}/patterns/${slug(pat)}.md`, `# Hook pattern: ${pat}

[← all patterns](../README.md)${overallLift ? ` · overall lift ${overallLift.lift}x (n=${overallLift.nTotal})` : ""}

## Niches where it over-performs
${sorted.map((x) => `- [${x.niche}](../niches/${slug(x.niche)}.md) — ${x.lift}x`).join("\n")}

## How it actually worked (from real teardowns)
${exMechs || "_No teardown examples using this pattern yet._"}
`);
}

console.error(`wiki built: README + ${niches.length} niches + ${Object.keys(patternNiches).length} patterns -> ${WIKI}/`);

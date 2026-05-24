#!/usr/bin/env node
// llm-label.mjs — the real labeler. Replaces regex guessing with a model that
// reads the actual hook (spoken transcript + caption) and returns a structured
// label: hook pattern, framework, the narrative beats it can see, and a grounded
// one-line reason. This is what makes "decoding" real instead of pattern-matching.
//
// Usage:
//   ANTHROPIC_API_KEY=... node pipeline/llm-label.mjs --in data/raw/normalized.jsonl \
//       --out data/decoded/llm-labeled.jsonl [--limit 20] [--model claude-haiku-4-5-20251001]
//
// Reads the key from env or ~/format-radar-deconstruct/.env. Costs money per call;
// Haiku keeps it cheap (hundreds of videos for cents). Output is derived labels
// (gitignored) — not redistributed source content.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";

let key = process.env.ANTHROPIC_API_KEY;
for (const p of [`${homedir()}/format-radar-deconstruct/.env`, ".env"]) {
  if (!key && existsSync(p)) { const m = readFileSync(p, "utf8").match(/ANTHROPIC_API_KEY=(.+)/); if (m) key = m[1].trim(); }
}
if (!key) { console.error("ANTHROPIC_API_KEY missing (env or ~/format-radar-deconstruct/.env)"); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const inFile = args.in || "data/raw/normalized.jsonl";
const outFile = args.out || "data/decoded/llm-labeled.jsonl";
const limit = args.limit ? Number(args.limit) : Infinity;
const model = args.model || "claude-haiku-4-5-20251001";

const rows = readFileSync(inFile, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)).slice(0, limit);

const HOOKS = "pov, belief-challenging, direct-callout, before-after, size-of-claim, speed-of-claim, authority, removing-limitations, question, information-offering, newness, exclusivity, comparison";
const FRAMEWORKS = "bandwagon, industry-contrarian, listicle, founder, x-without-y, organic, problem-agitate-solution, ugly-ad, founder-objections, us-vs-them, triple-g, tease";

const SYSTEM = `You are a short-form video ad analyst. You read the spoken hook and caption of a TikTok and label its structure precisely. You never invent details that are not in the text. If the hook is generic or unreadable, say so honestly with low confidence.`;

function prompt(r) {
  const spoken = (r.transcript || "").slice(0, 600);
  const cap = (r.caption || "").slice(0, 300);
  return `Hook (spoken transcript): "${spoken || "(none)"}"
Caption: "${cap || "(none)"}"
Niche: ${r.niche || "unknown"}

Return ONLY a JSON object, no prose:
{
  "hookPattern": one of [${HOOKS}],
  "framework": one of [${FRAMEWORKS}],
  "beats": ["the 2-4 beats you can actually identify from the text"],
  "emotion": "the dominant emotion it exploits (curiosity|disgust|guilt|relief|envy|betrayal|fear|humor|aspiration|nostalgia|none)",
  "prop": "the object/setup that carries the idea, or '' if none",
  "reveal": "what changes/reveals partway through, or '' ",
  "proofDevice": "how it proves the claim (before-after|screenshot|demo|numbers|testimonial|receipt|none)",
  "payoff": "what the viewer feels/learns by the end, in 5-8 words",
  "hookProductDistance": "natural|bolted-on|n-a — is the hook naturally tied to the product?",
  "adObviousness": "native|semi-native|clearly-ad",
  "productRole": "hero|helper|background|punchline|proof|cta-only|none",
  "ctaType": "explicit|soft|link-in-bio|comment-prompt|none",
  "whyItWorks": "one sentence, grounded ONLY in what the hook actually says",
  "confidence": 0.0-1.0
}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function label(r, attempt = 0) {
  const body = {
    model, max_tokens: 350, system: SYSTEM,
    messages: [{ role: "user", content: prompt(r) }],
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await sleep(1500 * (attempt + 1)); return label(r, attempt + 1);
    }
    throw new Error(`${res.status} ${(await res.text()).slice(0, 160)}`);
  }
  const data = await res.json();
  const text = (data.content?.[0]?.text || "").trim();
  const json = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
  return { ...json, usage: data.usage };
}

const out = [];
let totalIn = 0, totalOut = 0, ok = 0;
const CONC = 6;
for (let i = 0; i < rows.length; i += CONC) {
  const batch = rows.slice(i, i + CONC);
  const results = await Promise.allSettled(batch.map(async (r) => {
    const l = await label(r);
    totalIn += l.usage?.input_tokens || 0; totalOut += l.usage?.output_tokens || 0; ok++;
    return {
      source: r.source, url: r.url, niche: r.niche, method: "llm:" + model,
      hook: (r.transcript || r.caption || "").slice(0, 140),
      hookPattern: l.hookPattern, framework: l.framework, beats: l.beats,
      emotion: l.emotion || null, prop: l.prop || null, reveal: l.reveal || null,
      proofDevice: l.proofDevice || null, payoff: l.payoff || null,
      hookProductDistance: l.hookProductDistance || null, adObviousness: l.adObviousness || null,
      productRole: l.productRole || null, ctaType: l.ctaType || null,
      whyItWorks: l.whyItWorks, confidence: l.confidence,
      engagement: { views: r.views, likes: r.likes, shares: r.shares, comments: r.comments, saves: r.saves },
      followers: r.followers || 0,
      viewsPerFollower: r.followers ? Number((r.views / r.followers).toFixed(2)) : null,
    };
  }));
  for (const x of results) if (x.status === "fulfilled") out.push(x.value);
  process.stderr.write(`\r  labeled ${out.length}/${rows.length}   `);
}
process.stderr.write("\n");

writeFileSync(outFile, out.map((o) => JSON.stringify(o)).join("\n") + "\n");
// Haiku pricing approx $1/$5 per Mtok in/out
const cost = (totalIn / 1e6) * 1 + (totalOut / 1e6) * 5;
console.error(`labeled ${ok}/${rows.length} videos -> ${outFile}`);
console.error(`tokens: ${totalIn} in / ${totalOut} out  (~$${cost.toFixed(4)} on ${model})`);
console.log(out.length);

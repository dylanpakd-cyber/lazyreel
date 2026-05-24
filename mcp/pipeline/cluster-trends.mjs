#!/usr/bin/env node
// cluster-trends.mjs — re-analysis (Lightreel method applied to OUR corpus).
// Cluster videos by CREATIVE-UNIT signature (not topic), keep clusters that pass
// the 3 gates (recurrence: >=2 creators · transfer: >=2 niches · performance:
// overperforms), then name each with a FORMULA + 3-part name (object/setup +
// emotion + mechanism) via a cheap model. Output data/trends.json (committed).
//
// Usage: ANTHROPIC_API_KEY=... node pipeline/cluster-trends.mjs

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";

let key = process.env.ANTHROPIC_API_KEY;
for (const p of [`${homedir()}/format-radar-deconstruct/.env`, ".env"]) {
  if (!key && existsSync(p)) { const m = readFileSync(p, "utf8").match(/ANTHROPIC_API_KEY=(.+)/); if (m) key = m[1].trim(); }
}

const lab = readFileSync("data/decoded/llm-labeled.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const enr = new Map(); for (const e of readFileSync("data/decoded/enriched.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l))) enr.set(e.url, e);
const norm = new Map(); for (const n of readFileSync("data/raw/normalized.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l))) norm.set(n.url, n);

// creative-unit feature per video; cluster KEY = framework | videoFormat | hookPattern bucket
const rows = lab.map((r) => {
  const e = enr.get(r.url) || {}; const n = norm.get(r.url) || {};
  return {
    url: r.url, niche: r.niche, author: n.author || "",
    hookPattern: r.hookPattern, framework: r.framework,
    videoFormat: e.videoFormat || "?", setting: e.setting || "?",
    vpf: typeof r.viewsPerFollower === "number" ? r.viewsPerFollower : null,
  };
}).filter((r) => r.framework && r.videoFormat !== "?" && r.hookPattern);

const allVpf = rows.map((r) => r.vpf).filter((v) => typeof v === "number").sort((a, b) => a - b);
const corpusMedianVpf = allVpf[Math.floor(allVpf.length / 2)] || 0;
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };

// cluster
const clusters = {};
for (const r of rows) {
  const k = `${r.framework} | ${r.videoFormat} | ${r.hookPattern}`;
  (clusters[k] ||= []).push(r);
}

// apply the 3 gates
const candidates = [];
for (const [k, members] of Object.entries(clusters)) {
  if (members.length < 6) continue;
  const creators = new Set(members.map((m) => m.author).filter(Boolean));
  const niches = new Set(members.map((m) => m.niche));
  const cMedVpf = med(members.map((m) => m.vpf).filter((v) => typeof v === "number"));
  const recurrence = creators.size >= 2;
  const transfer = niches.size >= 2;
  const performance = cMedVpf >= corpusMedianVpf;
  if (recurrence && transfer && performance) {
    candidates.push({ key: k, members: members.length, creators: creators.size, niches: [...niches], medianVpf: Number(cMedVpf.toFixed(2)),
      framework: members[0].framework, videoFormat: members[0].videoFormat, hookPattern: members[0].hookPattern,
      sampleSettings: [...new Set(members.map((m) => m.setting))].slice(0, 4) });
  }
}
candidates.sort((a, b) => b.medianVpf - a.medianVpf);
const top = candidates.slice(0, 18);
console.error(`${Object.keys(clusters).length} clusters -> ${candidates.length} pass 3 gates -> naming top ${top.length}`);

// name each with formula + 3-part name (cheap LLM)
async function name(c) {
  if (!key) return { formula: null, name: null };
  const prompt = `A recurring short-form video pattern, seen across ${c.creators} creators and ${c.niches.length} niches (${c.niches.join(", ")}). Format: ${c.videoFormat}. Hook pattern: ${c.hookPattern}. Script framework: ${c.framework}. Common settings: ${c.sampleSettings.join(", ")}.
Return ONLY JSON:
{ "formula": "X -> Y -> Z -> fix/payoff (the mechanic, 4-6 short beats)", "name": "a 3-part handle: concrete object/setup + emotional trigger + creative mechanism, like 'Murky water bottle shock prop'", "whyItTravels": "one line on why it works across niches" }`;
  const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 250, messages: [{ role: "user", content: prompt }] }) });
  if (!res.ok) return { formula: null, name: null };
  try { return JSON.parse((await res.json()).content[0].text.trim().replace(/^```json\s*|\s*```$/g, "")); } catch { return { formula: null, name: null }; }
}

// --cluster-only: emit the gated clusters WITHOUT naming (no API call), so a
// Claude Code agent can do the formula + 3-part naming directly in-context.
if (process.argv.includes("--cluster-only")) {
  writeFileSync("data/_clusters-to-name.json", JSON.stringify({ corpusMedianVpf: Number(corpusMedianVpf.toFixed(2)), clusters: top }, null, 2) + "\n");
  console.error(`wrote ${top.length} unnamed clusters -> data/_clusters-to-name.json (name them with an agent, then write data/trends.json)`);
  process.exit(0);
}

const trends = [];
for (const c of top) {
  const named = await name(c);
  trends.push({ name: named.name || c.key, formula: named.formula || null, whyItTravels: named.whyItTravels || null,
    framework: c.framework, videoFormat: c.videoFormat, hookPattern: c.hookPattern,
    recurrence: `${c.creators} creators`, transfer: c.niches, medianVpf: c.medianVpf, examples: c.members });
}
writeFileSync("data/trends.json", JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), method: "cluster by creative-unit (framework|format|hook) -> gates: recurrence>=2 creators, transfer>=2 niches, performance>=corpus-median vpf -> LLM formula+3-part name", count: trends.length, corpusMedianVpf: Number(corpusMedianVpf.toFixed(2)), trends }, null, 2) + "\n");
console.error(`wrote ${trends.length} named trends -> data/trends.json`);

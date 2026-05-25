#!/usr/bin/env node
// visual.mjs — the visual layer. For a stratified sample of videos (breakouts +
// baseline per niche), download the video, extract first-3-second frames + a mid
// frame, and have a vision model read the OPENING: content format (talking head,
// text-overlay, voiceover b-roll, screen recording, etc.), the visual hook, the
// on-screen text, and what grabs attention in the first 3 seconds.
//
// Requires: yt-dlp + ffmpeg on PATH, ANTHROPIC_API_KEY (env or ~/.lazyreel/.env).
//
// Usage:
//   node pipeline/visual.mjs --perNiche 12 [--model claude-sonnet-4-6] [--out data/decoded/visual.jsonl]
//
// Output (local, gitignored — frames/urls are TikTok-sourced): data/decoded/visual.jsonl
// Derived format aggregates get folded into insights by aggregate-visual.mjs.

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir, tmpdir } from "node:os";

let key = process.env.ANTHROPIC_API_KEY;
for (const p of [`${homedir()}/.lazyreel/.env`, ".env"]) {
  if (!key && existsSync(p)) { const m = readFileSync(p, "utf8").match(/ANTHROPIC_API_KEY=(.+)/); if (m) key = m[1].trim(); }
}
if (!key) { console.error("ANTHROPIC_API_KEY missing"); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith("--")) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const perNiche = Number(args.perNiche || 12);
const model = args.model || "claude-sonnet-4-6";
const outFile = args.out || "data/decoded/visual.jsonl";

// join labeled (niche, vpf, engagement) with normalized (url)
const labeled = readFileSync("data/decoded/llm-labeled.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const cands = labeled.filter((r) => r.url && typeof r.viewsPerFollower === "number" && (r.engagement?.views || 0) >= 100000);

// stratified per niche: top half by vpf (breakouts) + a mid baseline slice
const niches = [...new Set(cands.map((r) => r.niche))].filter((n) => n !== "general");
const picks = [];
for (const niche of niches) {
  const arr = cands.filter((r) => r.niche === niche).sort((a, b) => b.viewsPerFollower - a.viewsPerFollower);
  if (arr.length < 4) continue;
  const half = Math.ceil(perNiche / 2);
  picks.push(...arr.slice(0, half));                              // breakouts
  const midStart = Math.floor(arr.length / 2);
  picks.push(...arr.slice(midStart, midStart + (perNiche - half))); // baseline
}
console.error(`visual pass on ${picks.length} videos (${niches.length} niches, model ${model})`);

// Format taxonomy aligned to the short-form consensus (talking-head, etc.).
const FORMATS = [
  "talking-head", "voiceover-broll", "text-overlay-heavy", "screen-recording",
  "product-demo", "before-after", "day-in-the-life", "grwm", "pov-handheld",
  "silent-stare-text", "green-screen", "carousel-slideshow", "meme-edit",
  "street-interview", "founder-led", "lifestyle-broll",
];

const SYSTEM = `You are a short-form video analyst who labels the craft of a video from its frames, the way a top UGC researcher would. You are shown frames from the FIRST ~3 SECONDS (the hook) plus one later frame. You report only what is visibly on screen, objectively, never guessing beyond the frames. The opening is what matters most: it decides whether a viewer stays.`;

function framePrompt() {
  return `Frames are t=0.3s, 1.5s, 2.8s (the hook) and one mid-video frame, in order.

Return ONLY JSON:
{
  "videoFormat": one of [${FORMATS.join(", ")}],
  "openingVisual": "what is on screen in the first second, plainly",
  "onScreenTextHook": "on-screen text in the first 3s, transcribed verbatim, or '' if none",
  "faceInFirst3s": true/false,
  "visualHookDevice": "the single thing that stops the scroll in the opening (bold text claim, face+expression, fast motion, surprising object, transformation tease, etc.)",
  "lighting": "natural-window | ring-light | soft-diffused | harsh | low-light | mixed | n-a",
  "cameraFraming": "selfie-closeup | medium-eye-level | wide | overhead | screen | low-angle | n-a",
  "creatorStyling": "polished | casual-messy | none-visible",
  "handsBusy": "what the hands are doing if anything (holding product, applying, pouring, gesturing) or ''",
  "setting": "where it appears to be shot",
  "confidence": 0.0-1.0
}`;
}

function frames(file) {
  const dir = `${tmpdir()}/abgv-${process.pid}`; mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) { try { rmSync(`${dir}/${f}`); } catch {} }
  const mp4 = `${dir}/v.mp4`;
  execFileSync("yt-dlp", ["-q", "--no-warnings", "--no-progress", "-o", mp4, file], { timeout: 90000, stdio: ["ignore", "ignore", "ignore"] });
  const out = [];
  for (const t of ["0.3", "1.5", "2.8", "6.0"]) {
    const jpg = `${dir}/f_${t}.jpg`;
    try {
      execFileSync("ffmpeg", ["-loglevel", "error", "-ss", t, "-i", mp4, "-frames:v", "1", "-q:v", "5", "-vf", "scale=360:-1", jpg], { timeout: 20000 });
      if (existsSync(jpg)) out.push(readFileSync(jpg).toString("base64"));
    } catch {}
  }
  try { rmSync(mp4); } catch {}
  return out;
}

async function analyze(b64s) {
  const content = b64s.map((d) => ({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: d } }));
  content.push({ type: "text", text: framePrompt() });
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: 400, system: SYSTEM, messages: [{ role: "user", content }] }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 140)}`);
  const data = await res.json();
  return { j: JSON.parse((data.content?.[0]?.text || "").trim().replace(/^```json\s*|\s*```$/g, "")), usage: data.usage };
}

const out = [];
let ok = 0, dl = 0, tin = 0, tout = 0;
for (const r of picks) {
  let b64s = [];
  try { b64s = frames(r.url); } catch { /* download/geo fail */ }
  if (b64s.length < 2) { process.stderr.write(`\r  ${ok}/${picks.length} ok, ${dl} dl-fail   `); dl++; continue; }
  try {
    const { j, usage } = await analyze(b64s);
    tin += usage?.input_tokens || 0; tout += usage?.output_tokens || 0;
    out.push({ url: r.url, niche: r.niche, viewsPerFollower: r.viewsPerFollower, views: r.engagement?.views || 0, hookPattern: r.hookPattern, framework: r.framework, ...j });
    ok++;
  } catch { dl++; }
  process.stderr.write(`\r  ${ok}/${picks.length} analyzed, ${dl} skipped   `);
  writeFileSync(outFile, out.map((o) => JSON.stringify(o)).join("\n") + "\n"); // incremental save
}
process.stderr.write("\n");
const cost = (tin / 1e6) * 3 + (tout / 1e6) * 15;
console.error(`visual: ${ok} analyzed, ${dl} skipped. tokens ${tin}/${tout} (~$${cost.toFixed(2)})`);
console.log(ok);

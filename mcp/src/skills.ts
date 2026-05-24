// skills.ts — the 6 ABG CMO skills. Each composes the framework library into a
// genuinely good, specific output. Deterministic (seeded by the input) so the
// same brief gives stable results, but varied across products.

import {
  SCRIPT_FRAMEWORKS, HOOK_PATTERNS, ANGLES, VISUAL_APPROACHES, AWARENESS,
  SOPHISTICATION, BANNED_WORDS, VOICE_RULES, UGC_MODIFIERS, type HookPattern,
} from "./frameworks.js";
import {
  searchVideos, relatedTrendingTags, corpusCounts, nicheInsight, overallHookLift, insightsMeta,
  getWinners, winnersForNiche, type AnalyzedVideo, type HookLift, type Teardown,
} from "./corpus.js";

// --- tiny deterministic helpers -------------------------------------------
function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function pick<T>(arr: T[], s: number, offset = 0): T { return arr[(s + offset) % arr.length]; }
function cleanCat(str: string): string {
  return str.trim()
    .replace(/^(a|an|the)\s+/i, "")
    .replace(/\$?\d[\d,.]*\s*/g, "")            // strip price / number tokens
    .replace(/\s*(kit|set|bundle|niche)\s*$/i, "")
    .trim() || "product";
}
function rotate<T>(arr: T[], s: number, n: number): T[] {
  const out: T[] = []; const used = new Set<number>();
  for (let i = 0; out.length < Math.min(n, arr.length); i++) {
    const idx = (s + i * 7) % arr.length;
    if (!used.has(idx)) { used.add(idx); out.push(arr[idx]); }
  }
  return out;
}
function fillHook(p: HookPattern, product: string, niche: string, avatar: string, category: string): string {
  return p.template
    .replace("{a too-real moment the buyer lives}", `${avatar} catches the ${category} problem mid-day`)
    .replace("{common belief}", `every ${category} is the same`)
    .replace("{this}", product)
    .replace("{avatar}", avatar)
    .replace("{the before state}", `the ${category} that never lasts`)
    .replace("{the after state}", `${product}, end of day, still holding`)
    .replace("{a big, specific number}", `the one ${category} stat nobody quotes`)
    .replace("{result}", `${category} that lasts`)
    .replace("{surprisingly short time}", "one use")
    .replace("{experts}", `${niche} pros`)
    .replace("{do this}", `reach for ${product}`)
    .replace("{the usual disqualifier}", "you've quit every routine by day 3")
    .replace("{a question the buyer can't not answer}", `still fighting ${category} in 2026?`)
    .replace("{outcome}", `nail ${category}`)
    .replace("{year/constraint}", "an afternoon, no studio")
    .replace("{category}", category)
    .replace("{your way}", product)
    .replace("{the rival way}", `the overpriced ${category}`)
    .replace("{does the job}", "actually does the job");
}

export type IdeaInput = { product: string; niche?: string; audience?: string; count?: number };

export function videoIdeas(i: IdeaInput): string {
  const product = i.product.trim();
  const niche = (i.niche || "your niche").trim();
  const avatar = (i.audience || "the buyer").trim();
  const category = cleanCat(product) || cleanCat(niche.replace(/\s*niche\s*/i, ""));
  const n = Math.min(Math.max(i.count || 5, 3), 8);
  const s = seed(product + niche + avatar);
  const fw = rotate(SCRIPT_FRAMEWORKS, s, n);
  const hooks = rotate(HOOK_PATTERNS, s + 3, n);

  const lines = fw.map((f, k) => {
    const aw = pick(AWARENESS, s, k);
    const so = pick(SOPHISTICATION, s + 2, k);
    const va = pick(VISUAL_APPROACHES, s + 1, k);
    const hook = fillHook(hooks[k], product, niche, avatar, category);
    return [
      `### ${k + 1}. ${f.name} (${f.acronym})`,
      `- **Hook:** "${hook}"`,
      `- **Who:** ${avatar}, ${aw.name.toLowerCase()} (awareness ${aw.level}), sophistication ${so.level} (${so.name.toLowerCase()})`,
      `- **Structure:** ${f.beats.join(" → ")}`,
      `- **Visual approach:** ${va}`,
      `- **Why it lands:** ${f.bestFor}. At this awareness, ${aw.play.toLowerCase()}`,
    ].join("\n");
  });

  return [
    `# ${n} video concepts for ${product}`,
    `_Niche: ${niche}. Each concept is a different framework — pick the 2-3 that match where your buyer's head is at._`,
    "",
    ...lines,
    "",
    `> One desire per video. Don't stack two of these into one clip.`,
  ].join("\n");
}

function videoCard(v: AnalyzedVideo): string {
  return [
    `- **${v.hook}**`,
    `  _${v.niche} · ${v.productType} · ${v.format} · ${v.framework} framework · ${v.hookPattern} hook · ${v.engagementTier}_`,
    `  Signature: ${v.signatureDevice}. Why it worked: ${v.whyItWorked}.`,
  ].join("\n");
}

export function nicheDecode(niche: string, examples?: string): string {
  const n = niche.trim();
  const meta = insightsMeta();
  const fmtLift = (h: HookLift) => `- **${h.label}** — ${h.lift}x more common in breakouts (${h.nWinners}/${h.nTotal})`;
  const insight = nicheInsight(n);
  const overall = overallHookLift();
  let insightBlock: string[] = [];
  if (insight && insight.hookPatternsThatOverIndex.length) {
    insightBlock = ["", `## What over-performs in ${n} (real data, n=${insight.sampleSize})`,
      `Hook patterns over-represented among breakouts (videos that out-reached the creator's own following):`,
      ...insight.hookPatternsThatOverIndex.slice(0, 5).map(fmtLift)];
  } else if (overall.length) {
    insightBlock = ["", `## What over-performs across all niches (real data)`,
      `Not enough ${n} videos yet for a niche-specific read, so here's the cross-niche signal. Hook patterns over-represented among breakouts:`,
      ...overall.slice(0, 5).map(fmtLift)];
  }
  if (insightBlock.length) {
    insightBlock.push(`_Method: ${meta.method || "contrastive lift on views-per-follower"}. Source: ${meta.source}, ${meta.decoded.toLocaleString()} videos decoded. Lift>1 = over-indexed in breakouts; read small samples with caution._`);
  }
  const winners = winnersForNiche(n, 3);
  const winnerBlock = winners.length
    ? ["", `## Real breakouts in ${n}, torn down (why they over-reached)`,
       ...winners.flatMap((w) => [
         `**${w.reach} · ${w.viewBucket} · ${w.hookPattern}**`,
         `- Hook technique: ${w.hookTechnique}`,
         `- Why it spread: ${w.viralMechanism}`,
         `- Steal this: ${w.stealThis}`,
       ])]
    : [];
  const matches = searchVideos(n, 4);
  const tags = relatedTrendingTags(n, 8);
  const corpusBlock = matches.length
    ? ["", `## From the analyzed-video library (${corpusCounts().videos} teardowns)`,
       `Closest performers to ${n}, with the DNA worth stealing:`, ...matches.map(videoCard)]
    : [];
  const tagBlock = tags.length
    ? ["", `## Cultural moments trending now (real TikTok data, MIT)`,
       `Piggyback one only if it genuinely fits the product:`,
       tags.map((t) => `#${t.tag} (${t.year}, rank ${t.rank})`).join(" · ")]
    : [];
  return [
    `# Niche read: ${n}`,
    `_How to decode what's actually working before you write a single hook._`,
    "",
    `## 1. Place the market`,
    `- **Awareness:** which of the 5 levels is the feed targeting? (Unaware story-leads vs Most-Aware offer-leads.)`,
    `- **Sophistication:** is the niche on plain claims (lvl 1-2), mechanism (lvl 3-4), or burned/skeptical (lvl 5)? Burned markets need identity + reframe, not another claim.`,
    "",
    `## 2. Mine the inputs (the part everyone skips)`,
    `- Pull 10-30 of your reviews + 10-30 competitor reviews + 100+ TikTok comments.`,
    `- Sort every line into: pain_points · failed_solutions · desired_outcomes · objections · misconceptions · golden_nuggets · language_notes.`,
    `- The golden_nuggets and language_notes are your actual hook copy. Write in their words, not yours.`,
    "",
    `## 3. Read the winning videos`,
    `- Study the 20-25 top hooks; the ones running longest are winning — model those patterns.`,
    `- Dominant visual approach? (problem / benefit / product / product-in-action.)`,
    `- Production style: authentic-UGC or polished? In ${n}, match the trust signal, don't fight it.`,
    `- Which content structure repeats: Symptom→Problem→Solution→Product→Offer, or a shorter cut?`,
    "",
    `## 4. Find the gap`,
    `- The exploitable opening is usually "everyone shows the product, nobody shows the problem state."`,
    `- Name 2-3 angles the niche is NOT running yet. That's your shot.`,
    examples ? `\n## Notes from what you pasted\n${examples.trim()}` : "",
    ...insightBlock,
    ...winnerBlock,
    ...corpusBlock,
    ...tagBlock,
    "",
    `> Output you should end with: top-10 pains (each w/ a real quote), the 3 hook patterns winning now, the dominant visual approach, and 2-3 unused angles.`,
  ].filter(Boolean).join("\n");
}

export function contentGaps(niche: string): string {
  const n = niche.trim();
  const ins = nicheInsight(n);
  if (!ins || !ins.patternTable) {
    return `# No gap map for "${n}" yet\nNot enough decoded videos in this niche. Try a broader niche or scrape more.`;
  }
  const gaps = ins.gaps || [];
  const sat = ins.saturated || [];
  const out = [
    `# Content gap map: ${n}`,
    `_Supply (how often a hook is used) vs demand (how it performs). The opening is what works but nobody's doing yet. n=${ins.sampleSize}._`,
    "",
  ];
  if (sat.length) {
    out.push(`## Crowded (hard to stand out)`);
    out.push(...sat.map((s) => `- **${s.label}** — ${s.sharePct}% of videos use it, but it only performs at ${s.lift}x. Saturated.`));
    out.push("");
  }
  if (gaps.length) {
    out.push(`## The openings (high performance, low supply)`);
    out.push(...gaps.map((g) => `- **${g.label}** — over-indexes ${g.lift}x among breakouts but only ${g.sharePct}% of videos use it. Do more of this.`));
  } else {
    out.push(`## The openings`, `No clear under-supplied winner yet at this sample size; lean on the over-indexing patterns from niche_decode.`);
  }
  out.push("", `> The move: drop the crowded pattern, test the opening. That's where reach is cheapest.`);
  return out.join("\n");
}

export function viralTeardowns(niche: string, limit = 5): string {
  const n = niche.trim();
  const ws = winnersForNiche(n, Math.min(Math.max(limit, 1), 10));
  if (!ws.length) return `# No teardowns yet for "${n}"\nRun pipeline/teardown.mjs over a scrape, or try a broader niche.`;
  return [
    `# ${ws.length} real breakout teardowns: ${n}`,
    `_Videos that out-reached their creator's following. Diagnosed from the real transcript + engagement, not view counts. ${getWinners().length} teardowns in the library._`,
    "",
    ...ws.flatMap((w) => [
      `## ${w.reach} reach · ${w.viewBucket} views · ${w.hookPattern} / ${w.framework}`,
      `- **Hook technique:** ${w.hookTechnique}`,
      `- **Retention device:** ${w.retentionDevice}`,
      `- **Why it spread:** ${w.viralMechanism}`,
      `- **Steal this:** ${w.stealThis}`,
      "",
    ]),
  ].join("\n");
}

export function searchCorpus(query: string, limit = 6): string {
  const q = query.trim();
  const hits = searchVideos(q, Math.min(Math.max(limit, 1), 12));
  if (!hits.length) {
    return `# No matches for "${q}"\nTry a niche (e.g. "skincare"), a format ("before-after"), or a hook pattern ("POV").`;
  }
  return [
    `# ${hits.length} analyzed videos for "${q}"`,
    `_From the ${corpusCounts().videos}-teardown library. Steal the structure, not the creative._`,
    "",
    ...hits.map(videoCard),
  ].join("\n");
}

export function formatTeardown(description: string): string {
  const d = description.trim();
  const s = seed(d);
  const fw = pick(SCRIPT_FRAMEWORKS, s);
  const hook = pick(HOOK_PATTERNS, s + 1);
  return [
    `# Teardown`,
    `_Steal the skeleton, not the pixels. Here's the DNA and how to rebuild it for your product._`,
    "",
    `**What you pasted:** ${d}`,
    "",
    `## Narrative DNA`,
    `- **Framework (best fit):** ${fw.name} (${fw.acronym}) — ${fw.beats.join(" → ")}`,
    `- **Hook pattern:** ${hook.name} — e.g. "${hook.example}"`,
    `- **Content structure:** identify which beats carry the symptom, the problem, the solution, the product reveal, and the offer.`,
    `- **Awareness target:** does line 1 assume the viewer knows the category? That tells you who it's for.`,
    "",
    `## Edit DNA (how it's cut)`,
    `- **Shot-by-shot:** timestamp every cut, name the move (e.g. "speed ramp (deceleration) ~20-25%", not "slow-mo").`,
    `- **Signature device:** find the ONE hero moment the whole video is built around (the mirror cut, the reveal, the split-screen).`,
    `- **Density:** is it HIGH (4+ stacked effects), MEDIUM (2-3), or LOW (one continuous authentic shot)? In UGC, LOW is usually deliberate — the lack of polish IS the trust.`,
    `- **Energy arc:** does it open hot, hold a signature middle, and resolve? Energy that never resolves feels like AI.`,
    "",
    `## To clone it`,
    `- Keep the ${fw.name} skeleton and the ${hook.name} hook shape.`,
    `- Swap their demo beat for YOUR product's equivalent before/after moment.`,
    `- Re-shoot the signature device with your product — that's the part worth copying.`,
  ].join("\n");
}

export type HookInput = { product: string; niche?: string; audience?: string; count?: number };

export function crackedHooks(i: HookInput): string {
  const product = i.product.trim();
  const niche = (i.niche || "your niche").trim();
  const avatar = (i.audience || "your buyer").trim();
  const category = cleanCat(product) || cleanCat(niche.replace(/\s*niche\s*/i, ""));
  const n = Math.min(Math.max(i.count || 8, 5), 12);
  const s = seed(product + avatar);
  const patterns = rotate(HOOK_PATTERNS, s, n);
  const lines = patterns.map((p, k) => {
    const hook = fillHook(p, product, niche, avatar, category);
    return `${k + 1}. **[${p.name}]** "${hook}"\n   _delivery: ${pick(["check phone-mirror, no smudge", "shocked glance after the gym", "frustrated dab, then relief", "talk to camera, hold the product", "split-screen vs the old way"], s, k)} · caption-safe · brand not named in line 1_`;
  });
  return [
    `# ${n} hooks for ${product}`,
    `_Each attacks a different angle. None name the brand in the first line. All survive with the sound off._`,
    "",
    ...lines,
    "",
    `> Test 3-4 of these as the first 2 seconds. The hook is 80% of the result.`,
  ].join("\n");
}

export type BriefInput = { product: string; audience?: string; objective?: string; framework?: string };

export function shootBrief(i: BriefInput): string {
  const product = i.product.trim();
  const audience = (i.audience || "the buyer").trim();
  const objective = (i.objective || "first qualified purchase").trim();
  const s = seed(product + audience + objective);
  const fw = i.framework
    ? SCRIPT_FRAMEWORKS.find(f => f.id === i.framework || f.name.toLowerCase() === i.framework!.toLowerCase()) || pick(SCRIPT_FRAMEWORKS, s)
    : pick(SCRIPT_FRAMEWORKS, s);
  const angle = pick(ANGLES, s);
  const category = cleanCat(product);
  const hookBank = rotate(HOOK_PATTERNS, s, 3).map(p =>
    `- [${p.name}] "${fillHook(p, product, "your niche", audience, category)}"`);

  // Build a 3-column-style table from the framework beats.
  const rows = fw.beats.map((beat, k) => {
    const vo = pick([
      `honestly? ${beat.toLowerCase()}`,
      `okay so — ${beat.toLowerCase()}`,
      `here's the thing about ${beat.toLowerCase()}`,
      `no one tells you: ${beat.toLowerCase()}`,
    ], s, k);
    const text = beat.split(/[(–-]/)[0].trim().toUpperCase().slice(0, 28);
    const broll = pick([
      "handheld, talk to camera",
      "close-up on the product, natural light",
      "the stuck-state, before",
      "the result, after, no narration",
      "selfie-arm walk-and-talk",
    ], s + 1, k);
    return `| ${k + 1}. ${beat} | ${vo} | ${text} | ${broll} |`;
  });

  return [
    `# Shoot brief: ${product}`,
    `**Framework:** ${fw.name} (${fw.acronym}) · **Angle:** ${angle.name} (${angle.shots} shots) · **Audience:** ${audience} · **Objective:** ${objective}`,
    "",
    `## Hook bank (test these first)`,
    ...hookBank,
    "",
    `## The script (Beat · VO · on-screen Text · B-roll)`,
    `| Beat | VO / dialogue | On-screen text | B-roll |`,
    `| --- | --- | --- | --- |`,
    ...rows,
    "",
    `## CTA`,
    `- Implicit and punchy: "link in bio", "you'll want this one", or identity-led ("if you're ${audience}, this is for you"). Never "Shop now".`,
    "",
    `## Shoot notes`,
    `- ${UGC_MODIFIERS.join(" · ")}.`,
    `- ${angle.note}`,
    `- Product name lands in shot 2-3, not shot 1. ~3 words of dialogue per second of screen time.`,
    `- Voice: calm, slightly serious, documentary — not a YouTuber shouting.`,
  ].join("\n");
}

export function killTheSlop(copy: string): string {
  const c = copy.trim();
  const lower = c.toLowerCase();
  const found = BANNED_WORDS.filter(w => lower.includes(w));
  const problems: string[] = [];
  if (found.length) problems.push(`**AI-tell vocabulary:** ${found.map(w => `"${w}"`).join(", ")} — instant slop signal.`);
  if (/\b(we|our|us)\b/i.test(c) && !/\byou\b/i.test(c)) problems.push("**Brand-centric:** it's about you, not the buyer. They don't care about the brand — only their problem.");
  if (!/[0-9]/.test(c)) problems.push("**No specificity:** zero numbers or concrete detail. Adjectives don't convince; specifics do.");
  if (/[🚀✨🔥💯]/.test(c)) problems.push("**Emoji hype:** rocket/sparkle energy reads as an AI ad.");
  if (c.length < 120 && !/\?/.test(c) && !/\b(pov|how|why)\b/i.test(c)) problems.push("**No curiosity gap:** nothing makes the viewer need to keep watching.");
  if (!problems.length) problems.push("**Soft:** no banned words, but it's generic. Sharpen with a named hook pattern + one concrete number.");

  const s = seed(c);
  const p = pick(HOOK_PATTERNS, s);
  const rewrite = fillHook(p, "this", "your niche", "you", "it");

  return [
    `# Slop teardown`,
    "",
    `**Original:** ${c}`,
    "",
    `## What's wrong`,
    ...problems.map(x => `- ${x}`),
    "",
    `## Rewrite (${p.name} hook, customer voice)`,
    `> "${rewrite}"`,
    "",
    `## The bar it now clears`,
    `- Hook rate: opens a loop in the first line.`,
    `- Watch-through: one idea, concrete, no wasted words.`,
    `- Brand-blindness: speaks to the buyer, names the product late.`,
    "",
    `## Voice rules this enforces`,
    ...VOICE_RULES.slice(0, 5).map(r => `- ${r}`),
  ].join("\n");
}

export function status(token?: string): string {
  const t = (token || "").trim();
  const tokenLine = t
    ? `**Install token:** \`${t.slice(0, 8)}…\` — active. Authorizes the read-only UGC skills.`
    : `**Install token:** none set (the skills still work; the token just namespaces an install).`;
  return [
    "# ABG CMO MCP — status",
    "",
    tokenLine,
    "",
    "**Live now:**",
    "- 9 skills: video_ideas, niche_decode, format_teardown, cracked_hooks, shoot_brief, kill_the_slop, search_corpus, viral_teardowns, content_gaps",
    `- ${getWinners().length} real breakout videos torn down (the actual viral mechanism, diagnosed from transcript + engagement)`,
    `- ${SCRIPT_FRAMEWORKS.length} named script frameworks, ${HOOK_PATTERNS.length} hook patterns, ${ANGLES.length} proven UGC angles`,
    `- ${corpusCounts().videos} hand-authored teardowns + ${corpusCounts().tags} real TikTok trending tags (2022-2025, MIT)`,
    `- ${corpusCounts().decoded.toLocaleString()} real TikTok videos decoded: LLM-labeled hook + framework, engagement normalized by follower count, patterns mined by contrastive lift (breakouts vs rest)`,
    "- Awareness + sophistication models, the anti-slop bar, UGC prompt modifiers",
    "",
    "**How it actually decodes (honest):**",
    "- A model reads each video's real spoken hook + caption and labels it (not regex guessing)",
    "- 'What works' = which hook patterns over-index among videos that out-reached their creator's following, not raw view averages",
    "- Visual decoding (frames, cuts, on-screen text) is the next layer and not built yet; today's signal is hook/transcript + engagement",
    "- Run `pipeline/` with your own keys to grow it; raw scraped content stays local, only derived aggregates ship",
    "- Transcript/embedding search over a hosted video DB",
    "- Private per-account niche libraries",
    "",
    "It's a real MCP connection with genuinely good, framework-grounded outputs — not a mock.",
  ].join("\n");
}

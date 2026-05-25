// skills.ts — the 6 LazyReel skills. Each composes the framework library into a
// genuinely good, specific output. Deterministic (seeded by the input) so the
// same brief gives stable results, but varied across products.

import {
  SCRIPT_FRAMEWORKS, HOOK_PATTERNS, ANGLES, VISUAL_APPROACHES, AWARENESS,
  SOPHISTICATION, BANNED_WORDS, VOICE_RULES, UGC_MODIFIERS, FALSE_POSITIVE_LABELS, BREAKOUT_GATES, VIDEO_MODELS, type HookPattern,
} from "./frameworks.js";
import {
  searchVideos, relatedTrendingTags, corpusCounts, nicheInsight, overallHookLift, insightsMeta,
  getWinners, winnersForNiche, getVisualInsights, visualForNiche, wordsForNiche,
  getTrends, trendsForNiche, getExamples, examplesFor, type Example,
  combosFor, getAppInsights, getBreakoutModel,
  type AnalyzedVideo, type HookLift, type Teardown,
} from "./corpus.js";

export function appInsights(): string {
  const a = getAppInsights();
  if (!a.analyzed) return `# App-space vertical not populated yet\nRun the app extraction pipeline.`;
  const apps = a.appsTracked?.list || [];
  const pats = a.appAdPatterns || {};
  const overIndex = (pats.overIndex || pats.overIndexing || []);
  return [
    `# App-space — how mobile apps market on short-form (${a.analyzed} app ads, ${a.appsTracked?.count || apps.length} apps tracked)`,
    `_The app-marketing vertical: which app categories advertise on UGC and what ad patterns win. (Starting set — scraped from a lifestyle corpus, so app density is light; grows with app-hashtag scraping.)_`,
    "",
    `## App categories in play`,
    ...Object.entries(a.categoryCounts || {}).sort((x, y) => (y[1] as number) - (x[1] as number)).map(([c, n]) => `- ${c}: ${n}`),
    "",
    `## Apps tracked (top)`,
    apps.slice(0, 12).map((x) => `${x.appName} (${x.appCategory})`).join(" · "),
    "",
    `## App-ad patterns that over-index in breakouts`,
    ...(Array.isArray(overIndex) && overIndex.length
      ? overIndex.slice(0, 6).map((p: any) => `- **${p.label || p.combo || p.pattern}** — ${p.lift}x ${p.nTotal ? `(n=${p.nTotal})` : ""}`)
      : [`- direct-callout + text-overlay over-indexes; caption-driven "get this app" with no talking head punches above its weight.`]),
    "",
    `> App ads lead with a consequence/conflict or a direct call-out, show the app screen as proof, and the product often enters mid or as an end-card. Use study_examples / replicate_format with an app + its category.`,
  ].join("\n");
}

export function winningCombos(niche = ""): string {
  const { combos, scope, analyzable } = combosFor(niche.trim());
  if (!combos.length) return `# No winning combinations for "${niche}" yet\nRun pipeline/combos.mjs. Needs a niche with enough analyzable videos.`;
  return [
    `# Winning combinations — ${scope}`,
    `_Not single factors — the COMBINATIONS that separate a breakout from a normal video. Cross-dimensional lift over ${analyzable.toLocaleString()} fully-featured videos (hook × format × person × emotion × setting). A combo at 4x appears 4x more often among breakouts than among normal videos._`,
    "",
    ...combos.map((c) => `- **${c.combo}** — ${c.lift}x more common in breakouts _(${c.dims}, ${c.nWinners}/${c.nTotal} videos)_`),
    "",
    `> Stack these: pick a winning combo, then ${"`"}study_examples${"`"} to watch real ones and ${"`"}replicate_format${"`"} to build it. Read small-sample combos as directional.`,
  ].join("\n");
}

function exampleLine(e: Example): string {
  const tags = [e.videoFormat, e.hookPattern, e.emotion].filter(Boolean).join(" · ");
  return `- ${e.url}  _(${e.viewsPerFollower}x reach · ${(e.views || 0).toLocaleString()} views · ${tags})_`;
}

export function studyExamples(niche = "", videoFormat = "", hookPattern = "", limit = 8): string {
  const ex = examplesFor({ niche: niche.trim() || undefined, videoFormat: videoFormat.trim() || undefined, hookPattern: hookPattern.trim() || undefined }, Math.min(Math.max(limit, 1), 20));
  const filt = [niche, videoFormat, hookPattern].filter(Boolean).join(" / ");
  if (!ex.length) return `# No example videos for "${filt}"\nTry a broader niche, format, or hook pattern. ${getExamples().length} real videos in the library.`;
  return [
    `# ${ex.length} real videos to study${filt ? ` — ${filt}` : ""}`,
    `_Actual TikToks behind the patterns, best breakouts first (reach = views ÷ creator followers). Watch these to see the format live, then replicate it. From ${getExamples().length} curated examples._`,
    "",
    ...ex.map(exampleLine),
    "",
    `> Open the links, watch the first 3 seconds, and note the hook + the prop + what changes mid-video. That's the format you're replicating.`,
  ].join("\n");
}

export type ReplicateInput = { product: string; niche?: string; trend?: string; model?: string };

export function replicateFormat(i: ReplicateInput): string {
  const product = i.product.trim();
  const niche = (i.niche || "your niche").trim();
  // pick the trend: by name if given, else the top trend that fits the niche
  const trends = getTrends();
  const trend = (i.trend && trends.find((t) => t.name.toLowerCase().includes(i.trend!.toLowerCase())))
    || trendsForNiche(niche, 1)[0] || trends[0];
  if (!trend) return `# No trends available\nRun the trend pipeline first.`;
  const model = VIDEO_MODELS.find((m) => i.model && (m.id === i.model.toLowerCase() || m.name.toLowerCase().includes(i.model.toLowerCase()))) || VIDEO_MODELS[0];
  const ex = (examplesFor({ niche, videoFormat: trend.videoFormat, hookPattern: trend.hookPattern }, 3).length
    ? examplesFor({ niche, videoFormat: trend.videoFormat, hookPattern: trend.hookPattern }, 3)
    : examplesFor({ videoFormat: trend.videoFormat, hookPattern: trend.hookPattern }, 3));
  const brief = shootBrief({ product, audience: niche + " buyer", objective: "first purchase", framework: trend.framework });

  return [
    `# Replicate: ${trend.name}`,
    `_Turning a proven format into a video for **${product}**. Format chosen for ${niche} (recurs across ${trend.recurrence}, ${trend.transfer.join(", ")}, ${trend.medianVpf}x median reach)._`,
    "",
    `## 1. The format you're copying`,
    trend.formula ? `- **Mechanic:** ${trend.formula}` : "",
    trend.whyItTravels ? `- **Why it works:** ${trend.whyItTravels}` : "",
    `- **Shape:** ${trend.framework} framework · ${trend.videoFormat} format · ${trend.hookPattern} hook`,
    "",
    ...(ex.length ? [`## 2. Watch these real ones first`, ...ex.map(exampleLine), ""] : []),
    `## 3. Your shoot-ready brief`,
    brief,
    "",
    `## 4. Generate it with ${model.name}`,
    `- **Prompt grammar:** ${model.promptGrammar}`,
    ...model.notes.map((n) => `- ${n}`),
    `- **Apply it:** take each beat from the brief above, write it as one ${model.name} shot using that grammar, keep the spoken hook in quotes, and chain the shots. Replace the example's product moment with ${product}.`,
    "",
    `> The format + the real examples are the proof; the brief + the model prompt are how you ship it this afternoon.`,
  ].filter(Boolean).join("\n");
}

export function findTrends(niche = "", limit = 8): string {
  const ts = trendsForNiche(niche.trim(), Math.min(Math.max(limit, 1), 18));
  if (!ts.length) return `# No trends yet\nRun pipeline/cluster-trends.mjs to mine cross-niche trends from the corpus.`;
  return [
    `# ${ts.length} cross-niche trends${niche ? ` for ${niche}` : ""}`,
    `_Patterns that recur across multiple creators AND niches and over-perform. Clustered by creative-unit, not topic (from ${getTrends().length} validated). Each is a copyable formula with real videos to study._`,
    "",
    ...ts.flatMap((t) => {
      let ex = examplesFor({ niche, videoFormat: t.videoFormat, hookPattern: t.hookPattern }, 2);
      if (!ex.length) ex = examplesFor({ videoFormat: t.videoFormat, hookPattern: t.hookPattern }, 2);
      return [
        `## ${t.name}`,
        t.formula ? `- **Formula:** ${t.formula}` : "",
        t.whyItTravels ? `- **Why it travels:** ${t.whyItTravels}` : "",
        `- **Built on:** ${t.framework} framework · ${t.videoFormat} format · ${t.hookPattern} hook`,
        `- **Proof:** ${t.recurrence}, across ${t.transfer.join(", ")} (median ${t.medianVpf}x reach)`,
        ...(ex.length ? [`- **Study it live:** ${ex.map((e) => e.url).join("  ·  ")}`] : []),
        "",
      ].filter(Boolean);
    }),
  ].join("\n");
}

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

  const laws = breakoutChecklist();
  return [
    `# ${n} video concepts for ${product}`,
    `_Niche: ${niche}. Each concept is a different framework — pick the 2-3 that match where your buyer's head is at._`,
    "",
    ...lines,
    "",
    ...(laws.length ? [`## First 3 seconds (validated gate — whichever concept you shoot must clear these)`, ...laws.map(l => `- [ ] ${l}`), ""] : []),
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
  const words = wordsForNiche(n);
  const wordBlock = (words && words.wordsThatOverIndex?.length)
    ? ["", `## Words the winners open with in ${n} (over-index in breakouts)`,
       words.wordsThatOverIndex.slice(0, 8).map((x) => `${x.term} (${x.lift}x)`).join(" · ")]
    : [];
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
  // real videos to watch for this niche (links lead, not a checklist)
  const ex = examplesFor({ niche: n }, 5);
  const exBlock = ex.length
    ? ["", `## Watch these real breakouts in ${n}`, ...ex.map(exampleLine)]
    : [];
  return [
    `# What's working in ${n} — from ${insightsMeta().decoded.toLocaleString()} real decoded videos`,
    // DATA LEADS: the findings + real videos come first
    ...insightBlock,
    ...wordBlock,
    ...exBlock,
    ...winnerBlock,
    ...corpusBlock,
    ...tagBlock,
    examples ? `\n## Notes from what you pasted\n${examples.trim()}` : "",
    "",
    // methodology footer (was the lead; now a compact how-to-go-deeper)
    `---`,
    `## Go deeper yourself`,
    `- **Place the market:** awareness level (Unaware→Most-Aware) + sophistication (plain claim → mechanism → burned/skeptical). Burned markets need identity + reframe, not another claim.`,
    `- **Mine the inputs:** 10-30 of your + competitor reviews + 100+ comments → sort into pain_points · failed_solutions · desired_outcomes · objections · golden_nuggets · language_notes. The golden_nuggets are your hook copy — write in their words.`,
    `- **Find the gap:** the opening is usually "everyone shows the product, nobody shows the problem state." Name 2-3 angles the niche isn't running.`,
    `> Then: ${"`"}find_trends${"`"} for copyable formats, ${"`"}study_examples${"`"} for more real videos, ${"`"}replicate_format${"`"} to turn a winner into a brief.`,
  ].filter(Boolean).join("\n");
}

export function formatPlaybook(niche: string): string {
  const n = niche.trim();
  const v = getVisualInsights();
  if (!v.analyzed) {
    return `# Visual format analysis not run yet\nRun pipeline/visual.mjs + aggregate-visual.mjs to label video formats and craft from the actual frames.`;
  }
  const nv = visualForNiche(n);
  const lines = [
    `# Format playbook: ${n}`,
    `_How winning videos in this niche actually look, read from the first 3 seconds of real videos (${v.analyzed} analyzed). The shape of the video, not just the words._`,
    "",
  ];
  if (nv && nv.formatsThatOverIndex?.length) {
    lines.push(`## Formats that over-perform in ${n}`);
    lines.push(...nv.formatsThatOverIndex.slice(0, 5).map((f) => `- **${f.label}** — ${f.lift}x more common among breakouts (n=${f.nTotal})`));
    if (nv.formatDistribution) {
      const top = Object.entries(nv.formatDistribution).slice(0, 3).map(([k, c]) => `${k} (${c})`).join(", ");
      lines.push("", `Most-used formats here: ${top}.`);
    }
  } else {
    lines.push(`## Cross-niche format signal (niche sample still small)`);
    lines.push(...(v.formatsThatOverIndex || []).slice(0, 5).map((f) => `- **${f.label}** — ${f.lift}x among breakouts (n=${f.nTotal})`));
  }
  // craft attributes (the Lightreel-style moat)
  const craft = v.craft || {};
  const craftLines: string[] = [];
  for (const [dim, label] of [["creatorStyling", "Styling"], ["cameraFraming", "Framing"], ["lighting", "Lighting"], ["faceInFirst3s", "Face in first 3s"]] as const) {
    const top = craft[dim]?.lift?.[0];
    if (top && top.lift > 1.1) craftLines.push(`- **${label}:** ${top.label} over-indexes ${top.lift}x in breakouts`);
  }
  if (craftLines.length) { lines.push("", `## Craft that correlates with breakouts`, ...craftLines); }
  lines.push("", `> The shape matters as much as the script. Match the winning format before you obsess over the hook words.`);
  return lines.join("\n");
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
      ...(w.dimensionRatings ? [`- **Dimension ratings:** ${Object.entries(w.dimensionRatings).map(([k, v]) => `${k}: ${v}`).join(" · ")}`] : []),
      ...(w.vsCreatorNorm ? [`- **vs the creator's normal posts:** ${w.vsCreatorNorm}`] : []),
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
  const laws = breakoutChecklist();
  return [
    `# ${n} hooks for ${product}`,
    `_Each attacks a different angle. None name the brand in the first line. All survive with the sound off._`,
    "",
    ...lines,
    "",
    ...(laws.length ? [`## The opening frame must also clear (validated, 83% within-creator)`, ...laws.map(l => `- [ ] ${l}`), ""] : []),
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
    `## First 3 seconds (the breakout lever — clear all of these)`,
    ...breakoutChecklist().map(l => `- [ ] ${l}`),
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

// The 5 first-3-seconds laws, read live from the breakout-vs-dud analysis.
function breakoutChecklist(): string[] {
  return (getBreakoutModel().laws || []).map(l => l.law);
}

export function breakoutVsDud(): string {
  const m = getBreakoutModel();
  const laws = m.laws || [];
  if (!laws.length) return `# Breakout-vs-dud model not populated yet\nRun the breakout analysis pipeline (data/breakout-vs-dud.json).`;
  const cc = m.corpusContrast || {};
  const topLift = (Object.values(cc).flat() as any[]).filter(x => x && x.lift).sort((a, b) => b.lift - a.lift).slice(0, 6);
  const pairs = (m.conceptControlledPairs || []).slice(0, 3);
  return [
    `# Breakout vs dud — why the same concept gets 1K vs 1M views`,
    m.method ? `_${m.method}_` : "",
    "",
    `## The first-3-seconds laws (patterns that over-index, not guarantees)`,
    ...laws.map((l, i) => `**${i + 1}. ${l.law}**\n   - ${l.evidence}${l.corpusEcho ? `\n   - _corpus echo: ${l.corpusEcho}_` : ""}`),
    "",
    `## What over-indexes in 1M+ winners vs <10K duds`,
    ...topLift.map(x => `- **${x.value}** — ${x.lift}x (${x.pctHigh}% of winners vs ${x.pctLow}% of duds)`),
    "",
    `## Concept-matched proof (same niche + hook, winner vs dud, compared frame-by-frame)`,
    ...pairs.map(p => `- **${p.concept}** (${p.gap}): ${(p.firstFrameDelta || "").slice(0, 220)}\n  → _steal:_ ${(p.lesson || "").slice(0, 160)}`),
    "",
    ...((m as any).validation ? [
      "",
      `## Validation (blind, out-of-sample) vs ${(m as any).validation.baseline || "50% baseline"}`,
      `_${(m as any).validation.method || ""}_`,
      ...(((m as any).validation.tests || []) as any[]).map(t => `- **${t.accuracy}** — ${t.name}${t.reads ? ` _(${t.reads})_` : ""}`),
      ...((m as any).validation.pooled ? [`- **Pooled:** ${(m as any).validation.pooled}`] : []),
      ...((m as any).validation.methodNote ? [`- _Method check:_ ${(m as any).validation.methodNote}`] : []),
      ...((m as any).validation.ablation ? [`- _Ablation:_ ${(m as any).validation.ablation.takeaway}`] : []),
      `- **Read this:** ${(m as any).validation.interpretation || ""}`,
    ] : []),
    "",
    ...((m as any).appAdBreakoutFormats ? (() => {
      const aa = (m as any).appAdBreakoutFormats;
      const arches = (aa.hookArchetypes || []).slice(0, 10);
      return [
        `## App-ad breakout formats (for mobile-app UGC; scored creator-relative)`,
        `_Derived archetypes; raw sources kept local. copyDecision is gated by the product-proof ladder: caption/app-card-only proof can never be copy_directly._`,
        ...arches.map((a: any) => `- **${a.id}** (${a.durationRequirement}, ${a.copyDecision}) — ${a.template}`),
        "",
        `### App-ad breakout rules`,
        ...((aa.breakoutRules || []).map((r: string) => `- ${r}`)),
      ];
    })() : []),
    "",
    `## Honest caveat`,
    `- ${m.confound?.takeaway || "Raw views are confounded by audience size; judge craft by creator-baseline (vpf), not raw views."}`,
    `- The "why" is inferred from still frames, not watch-time/A-B. Treat the laws as a first-3-seconds QC floor, not a virality guarantee.`,
  ].filter(Boolean).join("\n");
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
  if (/\b(honest review|review|tutorial|how to use|unboxing|#ad|paid partnership|sponsored)\b/i.test(lower)) problems.push("**Signals the format:** announcing 'review/tutorial/ad' tells the feed it's a sales video and kills the mystery — show it, don't label it (breakout law: don't signal the format).");
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
    `## First 3 seconds (breakout QC — does the rewrite clear these?)`,
    ...breakoutChecklist().map(l => `- [ ] ${l}`),
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
    "# LazyReel MCP — status",
    "",
    tokenLine,
    "",
    "**Live now:**",
    "- 16 skills incl. breakout_vs_dud (why 1K vs 1M), winning_combos (what mix wins), replicate_format, study_examples (real links), find_trends, viral_teardowns",
    `- ${getWinners().length} real breakout videos torn down (the actual viral mechanism, diagnosed from transcript + engagement)`,
    getVisualInsights().analyzed ? `- ${getVisualInsights().analyzed} videos analyzed visually (format + craft from the first 3 seconds of frames)` : "- visual/format layer: scripts ready, run pipeline/visual.mjs to populate",
    `- ${SCRIPT_FRAMEWORKS.length} named script frameworks, ${HOOK_PATTERNS.length} hook patterns, ${ANGLES.length} proven UGC angles`,
    `- ${corpusCounts().videos} hand-authored teardowns + ${corpusCounts().tags} real TikTok trending tags (2022-2025, MIT)`,
    `- ${corpusCounts().decoded.toLocaleString()} real TikTok videos decoded: LLM-labeled hook + framework, engagement normalized by follower count, patterns mined by contrastive lift (breakouts vs rest)`,
    "- Awareness + sophistication models, the anti-slop bar, UGC prompt modifiers",
    `- ${BREAKOUT_GATES.length} breakout-quality gates + ${FALSE_POSITIVE_LABELS.length} false-positive labels (distilled from 117 applied teardowns)`,
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

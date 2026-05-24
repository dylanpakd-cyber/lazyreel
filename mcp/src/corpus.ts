// corpus.ts — loads the bundled, redistributable data: an original analyzed-video
// archetype library + the MIT-licensed TikTok trending-hashtags dataset. Read at
// runtime relative to the build output, so a cloned install finds them.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type AnalyzedVideo = {
  id: string; niche: string; productType: string; format: string;
  framework: string; hookPattern: string; hook: string; structure: string[];
  signatureDevice: string; whyItWorked: string; engagementTier: string;
  onScreenText: string; tags: string[];
};

export type TrendingTag = { tag: string; year: number; rank: number; posts: number };

function dataPath(file: string): string {
  return fileURLToPath(new URL(`../data/${file}`, import.meta.url));
}

let _videos: AnalyzedVideo[] | null = null;
export function getVideos(): AnalyzedVideo[] {
  if (_videos) return _videos;
  try {
    const raw = JSON.parse(readFileSync(dataPath("analyzed-videos.json"), "utf8"));
    _videos = (raw.videos || []) as AnalyzedVideo[];
  } catch { _videos = []; }
  return _videos;
}

let _tags: TrendingTag[] | null = null;
export function getTrendingTags(): TrendingTag[] {
  if (_tags) return _tags;
  try {
    const text = readFileSync(dataPath("trending-hashtags.csv"), "utf8");
    const lines = text.split(/\r?\n/).slice(1).filter(Boolean);
    _tags = lines.map((l) => {
      const [tag, year, rank, posts] = l.split(",");
      return { tag, year: Number(year), rank: Number(rank), posts: Number(posts) };
    });
  } catch { _tags = []; }
  return _tags;
}

export type CorpusStats = {
  generatedAt?: string; curatedTeardowns?: number; decodedByPipeline?: number; trendingTags?: number;
};
let _stats: CorpusStats | null = null;
export function getStats(): CorpusStats {
  if (_stats) return _stats;
  let s: CorpusStats;
  try { s = JSON.parse(readFileSync(dataPath("corpus-stats.json"), "utf8")); }
  catch { s = {}; }
  _stats = s;
  return s;
}

export function corpusCounts() {
  const s = getStats();
  return {
    videos: getVideos().length,
    tags: getTrendingTags().length,
    decoded: s.decodedByPipeline ?? 0,
  };
}

export type HookLift = { label: string; lift: number; nWinners: number; nTotal: number };
export type NicheInsight = {
  sampleSize: number;
  breakoutThresholdVpf?: number;
  hookPatternsThatOverIndex: HookLift[];
  frameworks?: HookLift[];
};
type Insights = {
  source?: string; decoded?: number; method?: string;
  overallHookLift?: HookLift[];
  byNiche?: Record<string, NicheInsight>;
};
let _insights: Insights | null = null;
function getInsights(): Insights {
  if (_insights) return _insights;
  let i: Insights;
  try { i = JSON.parse(readFileSync(dataPath("insights.json"), "utf8")); }
  catch { i = {}; }
  _insights = i;
  return i;
}
export function nicheInsight(niche: string): NicheInsight | null {
  const by = getInsights().byNiche || {};
  if (by[niche]) return by[niche];
  const key = Object.keys(by).find((k) => k.toLowerCase().includes(niche.toLowerCase()) || niche.toLowerCase().includes(k.toLowerCase()));
  return key ? by[key] : null;
}
export function overallHookLift(): HookLift[] {
  return getInsights().overallHookLift || [];
}
export function insightsMeta() {
  const i = getInsights();
  return { source: i.source, decoded: i.decoded ?? 0, method: i.method };
}

function searchable(v: AnalyzedVideo): string {
  return [v.niche, v.productType, v.format, v.framework, v.hookPattern, v.hook, v.whyItWorked, ...v.tags]
    .join(" ").toLowerCase();
}

export function searchVideos(query: string, limit = 6): AnalyzedVideo[] {
  const terms = query.toLowerCase().split(/\s+/).map((t) => t.trim()).filter(Boolean);
  const all = getVideos();
  if (!terms.length) return all.slice(0, limit);
  return all
    .map((v) => ({ v, score: terms.reduce((s, t) => s + (searchable(v).includes(t) ? 1 : 0), 0) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.v);
}

// Trending tags whose name loosely relates to a niche query, newest year first.
export function relatedTrendingTags(query: string, limit = 8): TrendingTag[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const tags = getTrendingTags();
  const scored = tags
    .map((t) => ({ t, hit: terms.some((q) => t.tag.toLowerCase().includes(q) || q.includes(t.tag.toLowerCase())) }))
    .filter((r) => r.hit)
    .sort((a, b) => b.t.year - a.t.year || a.t.rank - b.t.rank)
    .slice(0, limit)
    .map((r) => r.t);
  if (scored.length) return scored;
  // fallback: this year's top tags
  const latest = Math.max(...tags.map((t) => t.year));
  return tags.filter((t) => t.year === latest).sort((a, b) => a.rank - b.rank).slice(0, limit);
}

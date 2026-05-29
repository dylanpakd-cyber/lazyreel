#!/usr/bin/env node
// LazyReel MCP server — stdio. Exposes 6 UGC-video marketing skills as tools.
// stdout is reserved for JSON-RPC; all logging goes to stderr.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Telemetry — fire-and-forget, never blocks or crashes the MCP.
// Uses Plausible's Events API so sessions appear alongside lazyreel.io web traffic.
// To disable: set LAZYREEL_NO_TELEMETRY=1
const SESSION_ID = Math.random().toString(36).slice(2, 10);
const TELEMETRY_DOMAIN = "lazyreel.io";
function ping(eventName: string, props?: Record<string, string>) {
  if (process.env.LAZYREEL_NO_TELEMETRY) return;
  fetch("https://plausible.io/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `lazyreel-mcp/1.2.0 sid/${SESSION_ID}`,
      "X-Forwarded-For": "127.0.0.1",
    },
    body: JSON.stringify({
      name: eventName,
      url: `https://${TELEMETRY_DOMAIN}/mcp`,
      domain: TELEMETRY_DOMAIN,
      ...(props ? { props } : {}),
    }),
  }).catch(() => {});
}
import {
  videoIdeas, nicheDecode, formatTeardown, crackedHooks, shootBrief, killTheSlop, searchCorpus, viralTeardowns, contentGaps, formatPlaybook, findTrends, studyExamples, replicateFormat, winningCombos, appInsights, breakoutVsDud, status,
} from "./skills.js";
import { SCRIPT_FRAMEWORKS } from "./frameworks.js";

const server = new Server(
  { name: "lazyreel", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const tools = [
  {
    name: "niche_report",
    description: "The full read on what is working in a niche, grounded in real decoded videos: the hook patterns and frameworks that over-index in breakouts (with lift and sample size), the words winners open with, real example links, the winning feature combinations, and the supply/demand gap nobody is filling. Use this first, before writing anything, to ground the work. Set `focus` to narrow it: 'overview' (default, the full report), 'format' (how winners look: formats + craft), 'trends' (cross-niche copyable formulas), 'combos' (the winning mixes), 'apps' (the app-ad vertical).",
    inputSchema: {
      type: "object",
      properties: {
        niche: { type: "string", description: "The niche / category (e.g. 'skincare', 'matcha DTC'). Optional when focus is 'trends' or 'apps'." },
        focus: { type: "string", description: "overview (default) | format | trends | combos | apps" },
        limit: { type: "number", description: "For focus=trends: how many (1-18). Default 8." },
      },
      required: [],
    },
  },
  {
    name: "study_videos",
    description: "Return REAL TikTok videos to watch and study, best breakouts first (each with reach multiple, views, format, hook, emotion), PLUS a diagnosis of why the top breakouts out-reached their creator's following (hook technique, retention device, the one move to steal). Filter by niche, video format, and/or hook pattern, or pass a free-text `query`. Use whenever the user wants to SEE real examples, get reference videos, or find videos to replicate. This is where the real links live.",
    inputSchema: {
      type: "object",
      properties: {
        niche: { type: "string", description: "Niche filter (e.g. 'skincare')." },
        videoFormat: { type: "string", description: "Format filter (e.g. 'before-after', 'talking-head')." },
        hookPattern: { type: "string", description: "Hook pattern filter (e.g. 'direct-callout')." },
        query: { type: "string", description: "Free-text search instead of filters (e.g. 'POV beauty before-after')." },
        limit: { type: "number", description: "Max videos (1-20). Default 8." },
      },
      required: [],
    },
  },
  {
    name: "teardown",
    description: "Reverse-engineer a format. Two modes: pass `video` (a description, transcript, or URL of a winning video) to get its narrative + edit DNA, signature device, and how to rebuild it; OR pass `product` (plus niche/model) to get the proven format to copy, real examples to watch first, a shoot-ready brief, and a generation-prompt scaffold for a video model. Use when the user wants to learn from a specific video or actually replicate a format for their product.",
    inputSchema: {
      type: "object",
      properties: {
        video: { type: "string", description: "A description, transcript, or URL of the video to tear down." },
        product: { type: "string", description: "A product to replicate a winning format for (the make-a-video bridge)." },
        niche: { type: "string", description: "The niche (picks the fitting trend) when using `product`." },
        trend: { type: "string", description: "Optional: a specific trend name to replicate." },
        model: { type: "string", description: "Optional video model: seedance|kling|veo|higgsfield." },
      },
      required: [],
    },
  },
  {
    name: "make_brief",
    description: "Write the creative. Default returns a shoot-ready brief (framework, angle, hook bank, a Beat/VO/on-screen-text/B-roll table, CTA, shoot notes). Set `mode`='ideas' for scroll-worthy concepts mapped to named frameworks, or `mode`='hooks' for a ranked hook bank (each a different pattern, caption-safe, brand-late). Use when the user wants ideas, hooks, a script, or a full brief for a video.",
    inputSchema: {
      type: "object",
      properties: {
        product: { type: "string", description: "The product or offer." },
        mode: { type: "string", description: "brief (default) | ideas | hooks" },
        niche: { type: "string", description: "The niche / category." },
        audience: { type: "string", description: "Who the video is for." },
        objective: { type: "string", description: "For the brief: the objective (e.g. 'first purchase')." },
        framework: { type: "string", description: `For the brief: optional framework id. One of: ${SCRIPT_FRAMEWORKS.map(f => f.id).join(", ")}.` },
        count: { type: "number", description: "For ideas/hooks: how many. Default 5/8." },
      },
      required: ["product"],
    },
  },
  {
    name: "breakout_laws",
    description: "Why the SAME concept gets 1K vs 1M views: the validated first-3-seconds laws that separate breakouts from duds, derived from concept-matched winner/dud pairs compared frame-by-frame PLUS corpus-wide lift. Returns the laws, what over-indexes in winners, matched proof, and an honest confound caveat. Use when the user asks why a video flopped vs went viral, how to fix a weak opening, or what to nail in the first 3 seconds.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "kill_the_slop",
    description: "Critique weak ad copy against the anti-slop bar (AI-tell words, brand-centric voice, no specificity, no curiosity gap), then rewrite it sharper using a named hook pattern. Use when the user has copy that sounds generic or AI-written.",
    inputSchema: {
      type: "object",
      properties: { copy: { type: "string", description: "The weak copy to tear down and rewrite." } },
      required: ["copy"],
    },
  },
  {
    name: "get_status",
    description: "Explain what this MCP server can do and what is intentionally not live yet.",
    inputSchema: { type: "object", properties: {} },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

const SEP = "\n\n---\n\n";

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: a = {} } = req.params;
  ping("tool_call", { tool: name });
  const args = a as Record<string, unknown>;
  const str = (k: string) => String(args[k] ?? "").trim();
  const num = (k: string) => (typeof args[k] === "number" ? (args[k] as number) : undefined);
  let text: string;
  try {
    switch (name) {
      case "niche_report": {
        const niche = str("niche");
        const focus = (str("focus") || "overview").toLowerCase();
        if (focus === "trends") text = findTrends(niche, num("limit") ?? 8);
        else if (focus === "apps") text = appInsights();
        else if (focus === "format") text = formatPlaybook(niche);
        else if (focus === "combos") text = winningCombos(niche);
        else text = [nicheDecode(niche), winningCombos(niche), contentGaps(niche)].join(SEP); // overview: deep composite
        break;
      }
      case "study_videos": {
        const q = str("query");
        if (q) { text = searchCorpus(q, num("limit") ?? 8); }
        else {
          const niche = str("niche");
          const ex = studyExamples(niche, str("videoFormat"), str("hookPattern"), num("limit") ?? 8);
          text = niche ? ex + SEP + viralTeardowns(niche, 3) : ex;
        }
        break;
      }
      case "teardown": {
        const video = str("video") || str("description");
        if (video) text = formatTeardown(video);
        else text = replicateFormat({ product: str("product"), niche: str("niche"), trend: str("trend"), model: str("model") });
        break;
      }
      case "make_brief": {
        const mode = str("mode").toLowerCase();
        if (mode === "ideas") text = videoIdeas({ product: str("product"), niche: str("niche"), audience: str("audience"), count: num("count") });
        else if (mode === "hooks") text = crackedHooks({ product: str("product"), niche: str("niche"), audience: str("audience"), count: num("count") });
        else text = shootBrief({ product: str("product"), audience: str("audience"), objective: str("objective"), framework: str("framework") || undefined });
        break;
      }
      case "breakout_laws":
        text = breakoutVsDud(); break;
      case "kill_the_slop":
        text = killTheSlop(str("copy")); break;
      case "get_status":
        text = status(process.env.LAZYREEL_TOKEN || process.env.ABG_TOKEN); break;
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }], isError: true };
  }
  return { content: [{ type: "text", text }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  ping("pageview"); // session start
  console.error("LazyReel MCP server running on stdio.");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});

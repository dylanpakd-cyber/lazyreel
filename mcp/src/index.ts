#!/usr/bin/env node
// ABG CMO MCP server — stdio. Exposes 6 UGC-video marketing skills as tools.
// stdout is reserved for JSON-RPC; all logging goes to stderr.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  videoIdeas, nicheDecode, formatTeardown, crackedHooks, shootBrief, killTheSlop, searchCorpus, viralTeardowns, contentGaps, status,
} from "./skills.js";
import { SCRIPT_FRAMEWORKS } from "./frameworks.js";

const server = new Server(
  { name: "abg-cmo", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const tools = [
  {
    name: "video_ideas",
    description: "Generate scroll-worthy short-form video concepts for a product, each mapped to a named script framework, awareness level, and visual approach. Use when the user wants ideas, angles, or concepts for a video.",
    inputSchema: {
      type: "object",
      properties: {
        product: { type: "string", description: "The product or offer." },
        niche: { type: "string", description: "The niche / category (e.g. 'ABG beauty', 'matcha DTC')." },
        audience: { type: "string", description: "Who the video is for." },
        count: { type: "number", description: "How many concepts (3-8). Default 5." },
      },
      required: ["product"],
    },
  },
  {
    name: "niche_decode",
    description: "Return a structured method + checklist for decoding what's actually working in a niche (awareness, sophistication, customer-research mining, winning-hook analysis, the exploitable gap). Use before writing, to ground the work in the niche.",
    inputSchema: {
      type: "object",
      properties: {
        niche: { type: "string", description: "The niche to decode." },
        examples: { type: "string", description: "Optional: pasted notes, competitor videos, or review snippets to fold in." },
      },
      required: ["niche"],
    },
  },
  {
    name: "format_teardown",
    description: "Reverse-engineer a winning video's DNA: narrative framework, hook pattern, edit/effects structure, signature device, and how to rebuild it for a different product. Use when the user pastes or describes a video they want to learn from.",
    inputSchema: {
      type: "object",
      properties: {
        description: { type: "string", description: "A description, transcript, or URL of the video to tear down." },
      },
      required: ["description"],
    },
  },
  {
    name: "cracked_hooks",
    description: "Write ranked short-form hooks for a product, each labeled by pattern (from a 13-pattern taxonomy), each a different angle, all caption-safe and brand-late. Use when the user wants hooks or first lines.",
    inputSchema: {
      type: "object",
      properties: {
        product: { type: "string", description: "The product or offer." },
        niche: { type: "string", description: "The niche / category." },
        audience: { type: "string", description: "Who the hooks should speak to." },
        count: { type: "number", description: "How many hooks (5-12). Default 8." },
      },
      required: ["product"],
    },
  },
  {
    name: "shoot_brief",
    description: "Produce a shoot-ready brief: framework, angle, hook bank, a Beat/VO/on-screen-text/B-roll table, CTA, and shoot notes. Use when the user wants a full brief or script for a video.",
    inputSchema: {
      type: "object",
      properties: {
        product: { type: "string", description: "The product or offer." },
        audience: { type: "string", description: "Target audience." },
        objective: { type: "string", description: "The objective (e.g. 'first purchase', 'email signups')." },
        framework: { type: "string", description: `Optional framework id/name. One of: ${SCRIPT_FRAMEWORKS.map(f => f.id).join(", ")}.` },
      },
      required: ["product"],
    },
  },
  {
    name: "kill_the_slop",
    description: "Critique weak ad copy against the anti-slop bar (AI-tell words, brand-centric voice, no specificity, no curiosity gap), then rewrite it sharper using a named hook pattern. Use when the user has copy that sounds generic or AI-written.",
    inputSchema: {
      type: "object",
      properties: {
        copy: { type: "string", description: "The weak copy to tear down and rewrite." },
      },
      required: ["copy"],
    },
  },
  {
    name: "search_corpus",
    description: "Search the analyzed-video library for real teardowns matching a niche, format, hook pattern, or product. Returns the hook, framework, signature device, and why it worked. Use to ground ideas in what's performed.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "A niche, format, hook pattern, or product (e.g. 'skincare before-after', 'POV beauty')." },
        limit: { type: "number", description: "Max results (1-12). Default 6." },
      },
      required: ["query"],
    },
  },
  {
    name: "viral_teardowns",
    description: "Return real breakout videos in a niche, each diagnosed for WHY it over-reached the creator's following: the hook technique, retention device, viral mechanism, and the one move to steal. Grounded in the actual transcript + engagement, not view counts. Use when the user asks what made videos go viral or wants proven mechanics to copy.",
    inputSchema: {
      type: "object",
      properties: {
        niche: { type: "string", description: "The niche to pull breakout teardowns for (e.g. 'skincare', 'ABG beauty')." },
        limit: { type: "number", description: "Max teardowns (1-10). Default 5." },
      },
      required: ["niche"],
    },
  },
  {
    name: "content_gaps",
    description: "Map supply vs demand in a niche: which hook patterns are crowded (everyone uses them) vs which over-perform but are under-used (the opening). Use when the user asks where the opportunity is, what's saturated, or how to stand out in a niche.",
    inputSchema: {
      type: "object",
      properties: { niche: { type: "string", description: "The niche to map (e.g. 'skincare')." } },
      required: ["niche"],
    },
  },
  {
    name: "get_status",
    description: "Explain what this MCP server can do and what is intentionally not live yet.",
    inputSchema: { type: "object", properties: {} },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: a = {} } = req.params;
  const args = a as Record<string, unknown>;
  const str = (k: string) => String(args[k] ?? "").trim();
  const num = (k: string) => (typeof args[k] === "number" ? (args[k] as number) : undefined);
  let text: string;
  try {
    switch (name) {
      case "video_ideas":
        text = videoIdeas({ product: str("product"), niche: str("niche"), audience: str("audience"), count: num("count") }); break;
      case "niche_decode":
        text = nicheDecode(str("niche"), str("examples") || undefined); break;
      case "format_teardown":
        text = formatTeardown(str("description")); break;
      case "cracked_hooks":
        text = crackedHooks({ product: str("product"), niche: str("niche"), audience: str("audience"), count: num("count") }); break;
      case "shoot_brief":
        text = shootBrief({ product: str("product"), audience: str("audience"), objective: str("objective"), framework: str("framework") || undefined }); break;
      case "kill_the_slop":
        text = killTheSlop(str("copy")); break;
      case "search_corpus":
        text = searchCorpus(str("query"), num("limit") ?? 6); break;
      case "viral_teardowns":
        text = viralTeardowns(str("niche"), num("limit") ?? 5); break;
      case "content_gaps":
        text = contentGaps(str("niche")); break;
      case "get_status":
        text = status(process.env.ABG_TOKEN); break;
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
  console.error("ABG CMO MCP server running on stdio.");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});

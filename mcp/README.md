# LazyReel MCP server

A real stdio MCP server that gives a coding agent genuinely good short-form / UGC
video marketing skills. No video editing, just ideation, niche analysis, format
teardown, hooks, shoot-ready briefs, and anti-slop rewrites, all grounded in real
DTC/UGC scripting frameworks (12 named script frameworks, a 13-pattern hook
taxonomy, 6 proven angles, awareness/sophistication models, and a hard anti-slop bar).

## Tools

6 tools (each composes the underlying analysis, so one call returns a full report).

| Tool | What it does |
| --- | --- |
| `niche_report` | The full read on a niche: hook/framework lift with sample sizes, the words winners open with, real example links, winning combos, the gap. `focus`=format/trends/combos/apps |
| `study_videos` | Real TikTok links to study (best breakouts first, with reach/views/format/hook), plus why the top ones won. Filter by niche/format/hook or pass a query |
| `teardown` | Reverse-engineer a video's narrative + edit DNA and how to rebuild it, or replicate a format for a product (with a gen-prompt scaffold) |
| `make_brief` | A shoot-ready brief (framework, angle, hook bank, Beat/VO/Text/B-roll table, CTA, notes). `mode`=ideas or hooks |
| `breakout_laws` | Why the same concept gets 1K vs 1M views: the validated first-3-seconds laws, what over-indexes, matched proof, the honest caveat |
| `kill_the_slop` | Critique weak copy against the anti-slop bar, then rewrite it sharper |
| `get_status` | What's live and what's intentionally not yet |

## Run locally

```bash
cd mcp
npm install
npm run build
npm run smoke   # spawns the server, calls every tool, prints pass/fail
```

## Connect from a coding agent

**Claude Code:**

```bash
claude mcp add lazyreel -- node /ABSOLUTE/PATH/TO/cracked-marketer/mcp/build/index.js
```

**Cursor / Codex / any MCP client.** Add a stdio server entry:

```json
{
  "mcpServers": {
    "lazyreel": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/cracked-marketer/mcp/build/index.js"]
    }
  }
}
```

stdout is reserved for JSON-RPC; the server logs only to stderr.

## What's real

This is a working MCP connection with framework-grounded generation, not a mock.
What it does *not* yet do: live ingestion of new winning videos, transcript/embedding
search over a hosted video DB, or private per-account niche libraries. `get_status`
says so plainly.


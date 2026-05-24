# ABG CMO — MCP server

A real stdio MCP server that gives a coding agent genuinely good short-form / UGC
video marketing skills. No video editing — ideation, niche analysis, format
teardown, hooks, shoot-ready briefs, and anti-slop rewrites, all grounded in real
DTC/UGC scripting frameworks (12 named script frameworks, a 13-pattern hook
taxonomy, 6 proven angles, awareness/sophistication models, and a hard anti-slop bar).

## Tools

| Tool | What it does |
| --- | --- |
| `video_ideas` | Scroll-worthy concepts, each mapped to a named framework + awareness + visual approach |
| `niche_decode` | A structured method to read what's working in a niche before you write |
| `format_teardown` | Reverse-engineer a winning video's narrative + edit DNA, and how to rebuild it |
| `cracked_hooks` | Ranked hooks, each a different pattern, caption-safe, brand named late |
| `shoot_brief` | Full brief: framework, angle, hook bank, Beat/VO/Text/B-roll table, CTA, shoot notes |
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
claude mcp add abg-cmo -- node /ABSOLUTE/PATH/TO/cracked-marketer/mcp/build/index.js
```

**Cursor / Codex / any MCP client** — add a stdio server entry:

```json
{
  "mcpServers": {
    "abg-cmo": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/cracked-marketer/mcp/build/index.js"]
    }
  }
}
```

stdout is reserved for JSON-RPC; the server logs only to stderr.

## What's real

This is a working MCP connection with framework-grounded generation — not a mock.
What it does *not* yet do: live ingestion of new winning videos, transcript/embedding
search over a hosted video DB, or private per-account niche libraries. `get_status`
says so plainly.

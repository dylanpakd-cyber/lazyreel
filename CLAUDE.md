# LazyReel

Marketing site + real MCP server for **LazyReel** — a connector + skill set that turns any coding agent into a short-form / UGC video marketer. ("ABG" is the trend-word hook; functionally it's a UGC CMO. Positioning: *video context for AI, not AI for video creation.*)

## What's here (built)

- **`index.html`** — the landing page. Single self-contained file, warm-light editorial-playful design (Cursor warmth + 67labs play + Cal's dark-footer close). One agent, minimal buttons, click-to-preview skills, before/after slider, real library stats (12 frameworks / 13 hook patterns / 6 angles), closing one-prompt teaser.
- **`mcp-install.html`** — the separate install page (lazyweb `/mcp-install` style). Generates a free install token and one universal paste-ready prompt (Claude Code / Codex / any MCP client) that installs the MCP. Landing-page "Get started" / "Get the MCP" CTAs link here.
- **`mcp/`** — the **real, working** stdio MCP server (TypeScript). 7 tools (`video_ideas`, `niche_decode`, `format_teardown`, `cracked_hooks`, `shoot_brief`, `kill_the_slop`, `get_status`). `npm install && npm run build && npm run smoke` → 7/7 pass.
  - `mcp/src/frameworks.ts` — the knowledge base: 12 named script frameworks, a 13-pattern hook taxonomy, 6 UGC angles, awareness/sophistication models, the anti-slop bar. Mined from real DTC/UGC playbooks.
  - `mcp/src/skills.ts` — generation logic that composes those into genuinely good, specific outputs.
  - `mcp/src/index.ts` — MCP server wiring.

## Reference docs (planning artifacts)

`DESIGN.md`, `COPY.md`, `PLAN.md` are the original design system / copy deck / build plan. The live `index.html` is the source of truth where they diverge.

## Run it

```bash
open index.html                 # the site
cd mcp && npm install && npm run build && npm run smoke   # the MCP
```

## The one rule

The product sells "stop shipping AI slop." If the site or the skill outputs look AI-generated — purple gradients, "revolutionary / supercharge / 🚀", generic hooks — it fails its own thesis. The anti-slop bar lives in `DESIGN.md §3` and `mcp/src/frameworks.ts` (`BANNED_WORDS`, `VOICE_RULES`).


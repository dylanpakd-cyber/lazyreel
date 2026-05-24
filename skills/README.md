# ABG CMO — video-creation skills

These are the **"make it"** half of ABG CMO. The MCP (`../mcp`) tells you *what works*; these skills turn that into *actual videos*.

| Skill | Job |
| --- | --- |
| **abg-format-deconstructor** | Take a breakout video → diagnose *why* it broke out → a rich, copyable shot-by-shot FormatSpec you can prompt from. |
| **abg-ugc-ad-director** | Take a product + a proven format → copy-paste UGC video-generation prompts (Seedance 2.0 / Kling / Veo / Higgsfield), with the spoken hook, shot grammar, on-screen text, and audio direction. |

## How they pair with the MCP (the full loop)

```
MCP: find_trends / niche_decode / study_examples / viral_teardowns   →  what wins + real videos to study
abg-format-deconstructor                                             →  why it wins, as a copyable spec
abg-ugc-ad-director                                                  →  the model-ready generation prompts
```

So a creator goes: *see what's working in my niche → watch the real breakouts → understand why they broke out → get the prompts to make my own.*

## Install (Claude Code / Cursor / Codex)

Copy a skill folder into your agent's skills directory (e.g. `~/.claude/skills/`), or point your agent at this repo. Each `SKILL.md` is self-contained.

## Design note

These are **original** skills authored for ABG CMO, grounded in real DTC/UGC ad craft (anti-cinematic UGC rules, shot grammar, the framework catalogue) and wired to the ABG CMO corpus — not generic copies. The value is the pairing: prompts grounded in a *proven, real* format, never a guess. We deliberately do NOT auto-emit a finished prompt from the MCP; the MCP is the curated insight feed, and these skills are where the human + agent compose the prompt from that grounding.

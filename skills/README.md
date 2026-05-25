# LazyReel video-creation skills

The **"make it"** half of LazyReel. The MCP (`../mcp`) tells you *what works*; these skills turn that into *actual videos*.

| Skill | Job |
| --- | --- |
| **lazyreel-format-deconstructor** | Breakout video → *why* it broke out (3 gates + false-positive labels) → a rich, copyable shot-by-shot FormatSpec. The "understand it well enough to rebuild it" skill. |
| **lazyreel-format-prompt-builder** | Break a video into a shot/effects timeline (density map, energy arc, signature device) you can prompt from. |
| **lazyreel-ugc-ad-director** | Product/concept/format → copy-paste UGC video prompts (Seedance 2.0): Pinterest creator refs, shot-by-shot prompts, native audio direction, anti-cinematic rules. |
| **lazyreel-ugc-ad-generator** | Product image + ad angle → a full multi-shot UGC ad generated via Seedance on fal.ai, stitched with ffmpeg (includes `scripts/` + `references/`). End-to-end automation. |
| **lazyreel-higgsfield-director** | Brief → Higgsfield video prompts whose first 3 seconds are engineered to clear the *validated* breakout laws (83% within-creator, blind; see `../docs/methodology`). Carries the measured insight payload in `references/breakout-insights.md` and a pre-render checklist so you gate the opening before spending credits. The Higgsfield-side counterpart to the Seedance director. |
| **lazyreel-video-editor** | The generated clips, however many the video needs (or raw UGC) → a finished, fast-cut, sound-off-legible 9:16 video at any length that obeys the cut-rhythm laws. Real FFmpeg + Remotion pipeline (trim, reframe, concat, normalize, burn captions). Carries `references/cut-rhythm.md`, the measured edit decisions. Where the clips become the video. |

## The full loop (insight → creation)

```
MCP tools: niche_report / study_videos / breakout_laws   →  what wins + real videos to study
lazyreel-format-deconstructor                                             →  why it wins, as a copyable spec
lazyreel-ugc-ad-director  (or  lazyreel-ugc-ad-generator for full automation)  →  the model-ready, multi-clip prompts
lazyreel-video-editor                                                     →  stitch the clips (any number) into the finished cut
```

A creator goes: *see what's working in my niche → watch the real breakouts → understand why → get the prompts (or the generated ad) to make my own, at any length from a 12s ad to a 60-90s+ video.*

These are universal video-creation skills: the clip count follows the script and the target length, never a fixed 3-4. A short ad is a few clips; a long video is many, chained for continuity (Seedance reference-to-video, or Higgsfield native video-extend for a seamless single subject).

## Install (Claude Code / Codex)

Copy a skill folder into your agent's skills directory (e.g. `~/.claude/skills/`), or point your agent at this repo. Each `SKILL.md` is self-contained; `lazyreel-ugc-ad-generator` also bundles `scripts/` (fal.ai generate + ffmpeg stitch) and `references/`.

## Design note

These are the project's own video-creation skills. The MCP stays the **curated insight feed**. It grounds every prompt in a *proven, real* format with links to the actual videos, and these skills are where the human and agent compose the prompt from that grounding. The point is the pairing: prompts grounded in what genuinely broke out, never a guess.


# COPY.md — LazyReel

Word-for-word copy. Build to this verbatim. Confident, joke-forward, receipts behind the brags. One agent, minimal buttons. Italic-serif punchline words are marked `*like this*`. Lime highlighter words are marked `==like this==`.

Brand note: **LazyReel** is functionally a UGC CMO (a short-form video marketing agent). "ABG" is the trend-word hook, played for fun in the high-personality spots only.

---

## Nav

- Wordmark: `LazyReel` (mark + orange slash in the lockup)
- Links: `Skills` · `How it works` · `Pricing` · `FAQ`
- Status pill: `● live · listening`
- CTA: `Get started`

## Hero

- Eyebrow (mono): `AGENT-FIRST UGC`
- **H1:** `Make your agent an ==*ABG*== CMO.`
- **Subhead:** `Plug in the taste, formats, and hooks it takes to make short-form video that performs. Your agent stops writing generic AI ad mush and starts shipping UGC that actually converts.`
- CTAs: `Get started` (primary pill) · `See it work →` (text link, not a second button)
- Compatibility line (mono): `Works with Claude Code, Cursor & Codex`

### Terminal demo (typewriter, streaming)

```
lazyreel — zsh
$ claude
> /abg "launch video for my matcha brand, ABG beauty niche"
↳ loading 12,400 winning UGC formats...
↳ matched 3 formats · pulled 18 hook patterns · read the niche
↳ writing hooks, script, shot list, on-screen text...
✓ shoot-ready brief saved — 3 hooks · 5 scenes · A/B variants
```

(Color rules: `$` command white, `>` prompt orange, `↳` lines muted gray, `✓` line lime.)

## Slogan tape (marquee, repeating)

`ship the hook ✦ kill the slop ✦ receipts not vibes ✦ always be testing ✦ make the joke, then the business ✦ taste is a hard constraint ✦ post like it's your job ✦`

## 01 / SKILLS — Opinionated skills

- Section label (mono): `01 / SKILLS`
- **H2:** `Six opinionated skills, not ==prompt templates==.`
- Intro: `Break down what it takes to make a video and each step becomes a skill your agent runs the same way every time. From the idea to the shoot-ready brief. Click one to see what it gives back.`

Skill rows (command · title · description · sample output for the preview panel). These six map to the buckets of making a short-form video. No editing, just the thinking and the writing.

1. `/video-ideas` — **Ideation**
   - Title: `Ideas that aren't the same three you've seen`
   - Desc: `Generate scroll-worthy concepts and angles for {product} in {niche}, each tagged with the format it fits and why it'll land.`
   - Preview (concept list):
     - `01 "I tried every {niche} product so you don't have to" — authority haul`
     - `02 "things nobody tells you about {product}" — listicle, fast cuts`
     - `03 "get ready with me, but it's a {product} review" — GRWM stealth-ad`

2. `/niche-decode` — **Niche + video analysis**
   - Title: `What's actually working in your niche`
   - Desc: `Read the {niche} feed and return the patterns: the formats that win, the hooks that repeat, what the niche rewards and what it punishes. Context, not guesses.`
   - Preview (niche brief):
     - `Winning formats: GRWM, "honest review", text-on-screen storytime`
     - `Repeating hook: a confession in the first 2 seconds`
     - `Niche rewards: low-fi, face-to-camera, fast pace`
     - `Niche punishes: studio polish, voiceover ads, slow intros`

3. `/format-teardown` — **Reverse-engineer a winner**
   - Title: `Steal the skeleton, not the pixels`
   - Desc: `Paste a video that's working. Get its DNA: the hook shape, the proof beat, the structure, the why. Never copies the creative, copies what makes it work.`
   - Preview (DNA card):
     - `Hook shape: problem-as-confession`
     - `Proof beat: live use, no narration`
     - `Structure: stuck → switch → receipt`
     - `Why it works: shows the pain before the product`

4. `/cracked-hooks` — **Hook writing**
   - Title: `Hooks that survive the scroll`
   - Desc: `Ten hooks for {product}, ranked, each with the angle behind it. Pulled from formats that actually stopped the thumb, not ad-copy mush.`
   - Preview (ranked hooks):
     - `"I deleted my {category} routine. Here's what I do instead." — identity`
     - `"nobody is talking about this {product} and it's criminal" — callout`
     - `"POV: you finally found a {product} that isn't mid." — relatability`

5. `/shoot-brief` — **Brief, script, shot list**
   - Title: `Product in, shoot-ready brief out`
   - Desc: `Turn {product} + {audience} + objective into an agent-ready brief: three hooks, a scene-by-scene script, the shot list, on-screen text, and the CTA.`
   - Preview (brief snippet):
     - `Audience: {audience}`
     - `Hook: "Your {category} is where money goes to die."`
     - `Scenes: 1) the chaos  2) the switch  3) the result  4) the ask`
     - `On-screen text: "watch what changed →"`

6. `/kill-the-slop` — **Critique and rewrite**
   - Title: `Point it at weak copy, get a sharper cut`
   - Desc: `A ranked teardown of what's wrong, scored against the anti-slop catalogue, then a rewrite that's shorter and lands harder.`
   - Preview (rewrite diff):
     - `~~Discover the revolutionary power of {product} to elevate your lifestyle 🚀~~`
     - `==You've bought 4 of these. This is the one you'll actually finish.==`

> Each preview ends with a `Copy this prompt` button, so a human can lift the exact prompt and run it in their own agent. (Wiring is presentational this phase.)

## 02 / RECEIPTS — Stats strip

- Section label (mono): `02 / RECEIPTS`
- Counters:
  - `12,400+` — `winning UGC videos decoded`
  - `3.4B+` — `views reverse-engineered`
  - `6` — `agent skills, zero fluff`

## 03 / THE DIFFERENCE — Before / after

- Section label (mono): `03 / THE DIFFERENCE`
- **H2:** `Same prompt. ABG context. ==Better videos.==`
- Instruction: `Drag to compare what your agent writes with and without LazyReel.`
- **Without** card (label `WITHOUT`):
  - `Discover the revolutionary power of our product to elevate your everyday routine. 🚀 Seamless. Innovative. Game-changing. Shop now and transform your life.`
- **With** card (label `WITH LazyReel`):
  - `you have 6 of these in a drawer and you reach for one. here's why. (hook holds 3s, cut to the use, text: "the only one that survived my bag")`

## 04 / MCP — Tools

- Section label (mono): `04 / MCP`
- **H2:** `A real MCP, wired into your agent.`
- Intro: `Six tools your agent calls mid-task. It reads the niche, finds the format, and writes the brief without leaving the chat.`
- Tool cards (mono title · description):
  - `search_video_patterns` — `Find reusable short-form patterns that match the product and angle.`
  - `generate_marketing_brief` — `Turn product, audience, and objective into an agent-ready brief.`
  - `list_video_skill_harnesses` — `Show the formats the agent can work in before it writes.`
  - `get_video_skill_harness` — `Return the behavior, format, shot, and rewrite rules for one format.`
  - `generate_agent_md` — `Write a reusable Markdown harness for the current session.`
  - `get_mcp_shell_status` — `Say plainly what's live and what's coming.`
- Footnote (mono, muted): `Connect once. Free for agents.`

## 05 / PRICING

- Section label (mono): `05 / PRICING`
- **H2:** `Free for humans. ==Free for agents.==`
- Positioning line: `UGC taste for AI. Not AI for UGC.`

- **For agents** card:
  - Eyebrow: `FOR AGENTS`
  - Price: `Free forever`
  - Checklist: `The MCP + 6 tools` · `All six opinionated skills` · `No card, no account`
  - CTA: `Get the MCP`

- **For humans** card:
  - Eyebrow: `FOR HUMANS`
  - Price: `Free forever`
  - Checklist: `Browse the format library` · `Steal the skeletons` · `Bring your own agent`
  - CTA: `Browse formats`

## 06 / ONE PROMPT — Closing copy-paste block

- Section label (mono): `06 / ONE PROMPT`
- **H2:** `One prompt. Your agent ==does the rest.==`
- Intro: `Paste this into Claude Code, Cursor, or Codex. Your agent installs the LazyReel skills, connects the MCP, and is ready to make a video on the next message.`
- The paste block (mono, dark inset, with a working `Copy` button):

```
Install LazyReel for this agent. It's free; the connector only authorizes
read-only UGC-format tools and writes no files outside local config without
asking. Add the MCP server, load the six skills (/video-ideas, /niche-decode,
/format-teardown, /cracked-hooks, /shoot-brief, /kill-the-slop), then confirm
the tools are live by running get_mcp_shell_status. After setup, use LazyReel
whenever I ask for a short-form video, a hook, a brief, or a niche read.
```

- Button: `Copy` → `Copied`
- Footnote (mono, muted): `Free. Reads formats, writes briefs. Won't touch anything without asking.`

## 07 / QUESTIONS — FAQ

- Section label (mono): `07 / QUESTIONS`
- **H2:** `Questions`

1. **Wait, what's "ABG"?**
   A very-online word we're having fun with. Under the hood it's a UGC CMO: an agent that does the real work of making short-form video, from the idea to the shoot-ready brief.

2. **Is this just prompt templates?**
   No. Templates make every video sound the same. LazyReel gives the agent the workflow plus a library of formats that actually worked, so it picks the right shape for your product and niche instead of reaching for the same three lines.

3. **Will it make my agent sound like every other AI?**
   The opposite is the entire point. The skills are tuned to kill the tells: the "revolutionary," the 🚀, the feature-list hook, the studio-ad polish. If it sounds like AI, it failed.

4. **Do I need the MCP, or can I just browse?**
   Browse the format library free as a human. Connect the MCP free when you want your agent to do it for you. Both cost nothing.

5. **What's actually live today?**
   The format library, the six skills, and the six MCP tools. Live ingestion of new winning videos and private niche libraries are on the way. We'll always tell you which is which.

## Footer

- Kicker (huge): `Stay online. Ship video.`
- Columns:
  - `Product`: Skills · How it works · Pricing · MCP
  - `Elsewhere`: GitHub · Changelog · X
  - `Operators`: Manifesto · Contact
- Legal kicker (mono): `© LazyReel 2026. All conversions reserved. Touch grass occasionally.`


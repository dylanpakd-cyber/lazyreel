# LazyReel

The feed your agent already doomscrolled.

LazyReel is a free MCP server that doomscrolled 21B+ views of short-form video (and app ads) so your coding agent doesn't have to. Plug it in and your agent already knows what is breaking out in your niche: the hooks, the formats, and the real videos behind them, before it writes a single line. It stops writing generic AI ad mush and starts shipping UGC that actually converts.

Think of it as video research for AI, not AI for video creation. It does the research and the writing: what is working, why, the ideas, the niche reads, the teardowns, the hooks, and the shoot-ready briefs. The companion skills in `skills/` turn that research into the actual generation prompts.

It is a harness for making better videos, so it pairs naturally with a video-generation MCP like Higgsfield. LazyReel decides what is worth making and hands over the exact brief; the gen MCP renders it. Same agent, same chat. You stop rendering slop because the thing you generate is grounded in what actually broke out.

Decode with evidence, not vibes.

## What it gives your agent

**6 tools** (plus a status tool). Each one composes the underlying analysis, so a single call returns a full report, not a thin slice.

1. **niche_report.** The full read on what is working in a niche, from real decoded videos: the hook patterns and frameworks that over-index in breakouts (with lift and sample size), the words winners open with, real example links, the winning feature combinations, and the supply/demand gap nobody is filling. `focus` narrows it: `format` (how winners look), `trends` (cross-niche formulas), `combos` (the winning mixes), `apps` (the app-ad vertical).
2. **study_videos.** Real TikTok links to watch and study, best breakouts first (each with reach multiple, views, format, hook, emotion), plus a diagnosis of why the top ones out-reached their creator's following. Filter by niche/format/hook, or pass a free-text query.
3. **teardown.** Reverse-engineer a format. Pass a video (description, transcript, or URL) for its narrative + edit DNA and how to rebuild it; or pass a product to get the proven format, real examples, a shoot-ready brief, and a generation-prompt scaffold.
4. **make_brief.** Write the creative. Default returns a shoot-ready brief (framework, angle, hook bank, a Beat/VO/on-screen-text/B-roll table, CTA, shoot notes); `mode=ideas` for concepts, `mode=hooks` for a ranked hook bank.
5. **breakout_laws.** Why the same concept gets 1K vs 1M views: the validated first-3-seconds laws that separate breakouts from duds (concept-matched and same-creator pairs plus corpus lift; 83% within-creator on the cleanest blind test, see `docs/methodology`). Returns the laws, what over-indexes, matched proof, and an honest confound caveat.
6. **kill_the_slop.** Point it at weak copy. It names exactly what is wrong against the anti-slop bar, then rewrites it sharper using a named hook pattern.

And **get_status**, which says plainly what is live and what is not. No marketing in the tool output.

These 6 tools are the research layer. The 6 companion **skills** in `skills/` are the make-it layer (deconstruct, the Seedance and Higgsfield directors, the video editor) that turn this research into the prompts and the finished cut. So the product is **6 tools + 6 skills**.

## What is inside

The skills are grounded in real DTC and UGC scripting knowledge, not vibes:

* 12 named script frameworks (PAS, the contrarian, the listicle, the founder story, and more)
* A 13-pattern hook taxonomy (POV, belief-challenging, direct call-out, size of claim, and the rest)
* 6 proven UGC angles with shot counts
* Awareness and sophistication models, so the angle matches where the buyer's head is at
* A hard anti-slop bar: banned filler words plus the voice rules that separate real creator copy from AI mush
* A library of analyzed video teardowns across the main DTC niches (beauty, skincare, supplements, fitness, food, tech, fashion, home, hair, pets), each tagged with its framework, hook pattern, signature device, and why it worked
* Real TikTok trending-hashtag data for 2022 through 2025 (MIT licensed) so niche reads can point at live cultural moments

The corpus lives in `mcp/data` and grows over time. See `mcp/data/DATA.md` for sources and licenses. The `study_videos` tool queries it directly.

How the tools point at real videos: the committed reference list is `mcp/data/examples.json`, 418 real videos with their public links and decoded labels (niche, hook pattern, format, views, views-per-follower). That file is what `study_videos` reads to hand your agent real videos to study. The raw scrape and the downloaded video files stay out of the repo. Only the public links and the derived analysis are committed.

## The window, and why recency wins

Every video in the corpus is from the **past 6 months**. Short-form moves fast, so the more recent the upload, the stronger the signal. The **last 30 days are weighted highest**: a format that broke out a year ago is history, while a format breaking out this month is the brief. The corpus grows every day, and older videos age out of the window. When two formats tie on performance, the more recent one wins, because it reflects what the feed is rewarding right now.

## Repository layout

```
mcp/            the real stdio MCP server (TypeScript)
  src/          server wiring, the skills logic, and the knowledge base
  data/         the decoded corpus: teardowns, aggregates, trending tags (see DATA.md)
  pipeline/     the scrape, label, score, and teardown pipeline (how the corpus is built)
skills/         companion agent skills that turn research into generation prompts
  lazyreel-ugc-ad-director/, lazyreel-ugc-ad-generator/, lazyreel-format-*/  (each with its own references/)
docs/           how the findings were reached, validated, and committed
  methodology/  the research method, the blind validation protocol, data discipline
wiki/           a browsable graph of insights, readable on GitHub
  niches/       10 niche reads     patterns/   the hook-pattern teardowns
index.html      the marketing site (also deployed on its own)
mcp-install.html the one-prompt install page (free token, any MCP client)
DESIGN.md, COPY.md, PLAN.md   the design system, copy deck, and build plan
```

The `wiki/` folder is the part to browse first. It reads like a research notebook: each niche and each hook pattern has its own page with what wins and why.

## Install as a plugin (recommended: MCP + skills, auto-activating)

One install brings the MCP server and all the companion skills together. The skills then auto-activate by their triggers through the video workflow, so the agent leverages them without being called by name (deconstruct a video, write the multi-clip prompts, cut the clips), and the MCP tools are available the whole time.

```bash
claude plugin marketplace add dylanpakd-cyber/lazyreel
claude plugin install lazyreel@lazyreel
```

The skills (`lazyreel-format-deconstructor`, `lazyreel-ugc-ad-director`, `lazyreel-higgsfield-director`, `lazyreel-video-editor`, `lazyreel-format-prompt-builder`, `lazyreel-ugc-ad-generator`) activate immediately. The MCP server ships **pre-compiled** as a single self-contained bundle (`mcp/build/server.mjs`, declared in `.mcp.json`), so there is no build step. Just set your free token and reload:

```bash
export LAZYREEL_TOKEN=lr_your_token   # from the install page, or any string
```

(The bundle is regenerated with `cd mcp && npm run bundle` whenever the server source changes.)

## Install it (MCP only)

The easy way is the install page. It generates a free token and gives you one prompt to paste into your agent. Open `mcp-install.html`, copy the block, paste it into Claude Code, Cursor, Codex, or any MCP client, and you are done.

By hand with Claude Code:

```bash
git clone https://github.com/dylanpakd-cyber/lazyreel ~/lazyreel
cd ~/lazyreel/mcp
npm install && npm run build
claude mcp add lazyreel --scope user -- node "$(pwd)/build/index.js"
```

Then ask your agent to call `get_status` to confirm the skills are live.

For Cursor or Codex, run the same build, then point the client at the printed path of `build/index.js`. The install page writes the exact config for each one.

## Run it locally

```bash
cd mcp
npm install
npm run build
npm run smoke
```

The smoke run spawns the server, calls every tool, and prints a pass or fail for each. You should see every tool pass before you rely on it.

## What is real, honestly

This is a working MCP connection with genuinely good, framework-grounded output. It is not a mock. The corpus is real video, decoded by the pipeline in `mcp/pipeline`, and the aggregates are committed so you can read them.

What it does not do yet: live ingestion of fresh winning videos on demand, transcript search over a hosted video database, and private niche libraries per account. The `get_status` tool says so plainly. Growing the analyzed-video corpus is the ongoing work.

## How the findings were reached

The claims in these tools are tested, not asserted. `docs/methodology` records how. It covers the breakout-vs-dud study (including a result that nearly fooled us and the confound we caught), the reusable blind out-of-sample validation protocol so you can re-run a test the same way, and the data discipline that keeps scraped content out of the repo. Headline: in the even 5,680-video validation read, baseline is 50% for every two-video choice. The first-3-seconds laws picked the higher-view video 785/946 times on the cleanest same-creator, age-controlled tier (82.98% ~= 83%, z=20.29), 890/947 times at ~1000x extremes (93.98% ~= 94%, z=27.07), and 474/947 times on closer-margin cross-creator pairs (50.05%, chance, z=0.03). Pooled across all tiers: 2,149/2,840 = 75.67% (z=27.36), but judge craft by creator-baseline because pooling masks the cross-creator confound. Start at `docs/methodology/README.md`.

## Data and licensing

Derived analysis and aggregates are committed to this repo. Raw scraped video, frames, and per-video labels are gitignored and never redistributed, so the repo stays on the right side of platform terms. The trending-hashtag data is MIT licensed. The example clips under `assets/feed` are the owner's own media.

## Free

Free for agents. The token only authorizes the read-only research skills. It cannot spend money, buy anything, post, or touch private data.


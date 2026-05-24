# ABG CMO

Make your agent an ABG CMO.

ABG CMO is a free MCP server that gives a coding agent the taste, formats, and hooks it takes to make short form video that actually performs. Plug it in and your agent stops writing generic AI ad mush and starts shipping UGC that converts.

Think of it as video context for AI, not AI for video creation. It does not edit video. It does the thinking and the writing: ideas, niche reads, teardowns, hooks, and shoot ready briefs.

## What it gives your agent

Nine skills, plus a status tool.

1. **video_ideas.** Scroll worthy concepts for a product, each built on a named script framework, placed on the awareness ladder, with the visual approach and why it lands.
2. **niche_decode.** A structured read on what is actually working in a niche, backed by real scraped data: which hook patterns over perform, real breakout teardowns, and trending tags.
3. **format_teardown.** Reverse engineer a winning video. You get its narrative DNA, its edit DNA, the one signature device it is built around, and how to rebuild it for your product.
4. **cracked_hooks.** Ranked hooks for a product. Each one is a different pattern, each one is caption safe, and the brand is never named in the first line.
5. **shoot_brief.** A full brief. Framework, angle, a hook bank, a beat by beat script table (VO, on screen text, and B roll), the CTA, and shoot notes.
6. **kill_the_slop.** Point it at weak copy. It names exactly what is wrong against the anti slop bar, then rewrites it shorter and sharper.
7. **search_corpus.** Search the decoded video library by niche, format, or hook pattern.
8. **viral_teardowns.** Real breakout videos in a niche, each diagnosed for why it out reached the creator's following: the hook technique, the retention device, the viral mechanism, and the one move to steal.
9. **content_gaps.** A supply versus demand map of a niche. Which hook patterns are crowded, and which over perform but are under used. The under used winners are the opening.

There is also a get_status tool that says plainly what is live and what is not.

## What is inside

The skills are grounded in real DTC and UGC scripting knowledge, not vibes:

* 12 named script frameworks (PAS, the contrarian, the listicle, the founder story, and more)
* A 13 pattern hook taxonomy (POV, belief challenging, direct call out, size of claim, and the rest)
* 6 proven UGC angles with shot counts
* Awareness and sophistication models so the angle matches where the buyer's head is at
* A hard anti slop bar: banned filler words plus the voice rules that separate real creator copy from AI mush
* A library of analyzed video teardowns across the main DTC niches (beauty, skincare, supplements, fitness, food, tech, fashion, home, hair, pets), each tagged with its framework, hook pattern, signature device, and why it worked
* Real TikTok trending hashtag data for 2022 through 2025 (MIT licensed) so niche reads can point at live cultural moments

The corpus lives in mcp/data and grows over time. See mcp/data/DATA.md for sources and licenses. The search_corpus skill queries it directly.

## Install it

The easy way is the install page. It generates a free token and gives you one prompt to paste into your agent. Open mcp_install in the site, pick your client, copy, paste, done.

To do it by hand with Claude Code:

```
git clone https://github.com/dylanpakd-cyber/abg-cmo ~/abg-cmo
cd ~/abg-cmo/mcp
npm install && npm run build
claude mcp add abg-cmo --scope user -- node "$(pwd)/build/index.js"
```

Then ask your agent to call get_status to confirm the six skills are live.

For Cursor or Codex, run the same build, then point the client at the printed path of build/index.js. The install page writes the exact config for each one.

## Run it locally

```
cd mcp
npm install
npm run build
npm run smoke
```

The smoke run spawns the server, calls every tool, and prints a pass or fail for each. You should see seven of seven pass.

## What is real, honestly

This is a working MCP connection with genuinely good, framework grounded output. It is not a mock.

What it does not do yet: live ingestion of fresh winning videos, transcript search over a hosted video database, or private niche libraries per account. The get_status tool says so plainly. Growing the analyzed video corpus is the next step.

## Free

Free for humans. Free for agents. The token only authorizes the read only skills. It cannot spend money, buy anything, or touch private data.

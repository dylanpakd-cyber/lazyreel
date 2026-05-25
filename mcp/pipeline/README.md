# The decode pipeline

This is how "videos decoded" becomes a real, computed number instead of a claim. Nothing here stores videos. It stores the decode: the structured insight pulled out of each video.

## The flow

```
ingest-apify.mjs   scrape real TikTok videos (Apify) + fetch spoken transcripts
        |          -> data/raw/normalized.jsonl   (local only, gitignored)
        v
llm-label.mjs      a model reads the real spoken hook + caption and labels each video:
        |          hook pattern, framework, beats, grounded reason, confidence
        |          (the real decoder; replaces regex guessing)
        v          -> data/decoded/llm-labeled.jsonl  (local only, gitignored)
aggregate.mjs      contrastive lift: which hook patterns over-index among breakouts
                   (top-quartile views-per-follower) vs the rest, per niche + overall
                   -> data/insights.json + data/corpus-stats.json  (committed)
```

`decode.mjs` is the fast, free, regex-on-the-hook-line fallback (honest about its
limits: it leaves ~75% of real hooks `unclassified` rather than inflating a
catch-all bucket). `llm-label.mjs` is the real labeler and gets ~80%+ confidently
classified for cents per hundred videos.

## The method (why it's honest)

Averaging views is the trap: view counts are dominated by a few mega-viral
outliers and by big accounts. So instead:

1. **Engagement is normalized by reach.** Each video's `views-per-follower` tells
   you if it out-reached the creator's own audience (a real breakout) rather than
   just having a big creator behind it.
2. **Patterns are mined by contrastive lift, not averages.** Within a niche, split
   videos into breakouts (top quartile by views-per-follower) vs the rest, then
   measure which hook patterns are over-represented among breakouts. Lift > 1 with
   a real sample size is a genuine signal; small samples are flagged.

This mirrors the rigorous open-source / academic approaches (view-normalized
engagement + per-feature risk-ratios). The next depth layer is visual: frames,
cut-rate, and on-screen text via a vision model. Not built yet, and the output
says so.

## Run it

```bash
cd mcp
echo "APIFY_TOKEN=your_token_here" > .env          # gitignored
echo "ANTHROPIC_API_KEY=your_key_here" >> .env      # for the real labeler
node pipeline/ingest-apify.mjs --per 25             # scrape (spends Apify credits)
node pipeline/llm-label.mjs --in data/raw/normalized.jsonl --out data/decoded/llm-labeled.jsonl
node pipeline/aggregate.mjs --in data/decoded/llm-labeled.jsonl --source "apify:tiktok + llm-label"
npm run build
```

The MCP then reports the new counts and per-niche hook performance automatically. The site and `get_status` read `corpus-stats.json`, so the number is always whatever the data actually is.

## What is committed vs local

* **Committed (safe to redistribute):** `data/insights.json` and `data/corpus-stats.json`. These are derived statistics: counts and average views by hook pattern and niche. No source video text.
* **Local only (gitignored):** `data/raw/` and `data/decoded/*.jsonl`. These hold scraped captions and transcripts, which are TikTok-sourced content and should not be redistributed. Anyone can regenerate them with their own Apify key.

## Cost

The clockworks/tiktok-scraper actor cost about 2 USD for 500 videos in testing (roughly 0.004 USD per video). Plan a larger run accordingly.

## Honesty

The decoder uses transparent heuristics (regex signals tied to the framework library) to classify hook pattern, framework, and niche, plus view-percentile tiering for engagement. It is not a black box and it does not invent data. Swap in a stronger classifier later without changing the rest of the flow.

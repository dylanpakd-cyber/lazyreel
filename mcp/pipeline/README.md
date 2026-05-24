# The decode pipeline

This is how "videos decoded" becomes a real, computed number instead of a claim. Nothing here stores videos. It stores the decode: the structured insight pulled out of each video.

## The flow

```
ingest-apify.mjs   scrape real TikTok videos (Apify) + fetch spoken transcripts
        |          -> data/raw/normalized.jsonl   (local only, gitignored)
        v
decode.mjs         turn each video into one structured record:
        |          hook, hook pattern, framework, niche, engagement tier, why it worked
        v          -> data/decoded/decoded.jsonl  (local only, gitignored)
aggregate.mjs      compute shippable aggregates + the corpus counts
                   -> data/insights.json + data/corpus-stats.json  (committed)
```

## Run it

```bash
cd mcp
echo "APIFY_TOKEN=your_token_here" > .env     # gitignored
node pipeline/ingest-apify.mjs --per 25       # scrape (spends Apify credits)
node pipeline/decode.mjs --in data/raw/normalized.jsonl --out data/decoded/decoded.jsonl --source apify:tiktok
node pipeline/aggregate.mjs --in data/decoded/decoded.jsonl --source apify:tiktok
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

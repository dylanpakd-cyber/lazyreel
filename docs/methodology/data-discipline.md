# Data discipline: what we commit and why

This explains the boundary between what lives in the public repo and what stays local. An agent working here must keep this boundary, because crossing it creates legal exposure and undoes the project's stated posture.

## The rule

Commit our own derived analysis and aggregate numbers. Never commit scraped third-party content.

| Committed (derived, our words) | Gitignored (scraped or raw) |
|---|---|
| `mcp/data/breakout-vs-dud.json` (laws, lift, validation summary) | `mcp/data/decoded/*.jsonl` (labeled rows with URLs) |
| `mcp/data/winners.json` (teardowns, no URL or transcript) | `mcp/data/raw/*.jsonl` and `_*.json` working files |
| `mcp/data/combo-insights.json`, `enrich-insights.json`, etc. | `covers/` and `frames/` (TikTok-sourced images and video) |
| `docs/` and `wiki/` (methodology and insight graph) | `mcp/data/decoded/_td-full.jsonl` (the video-id to URL audit) |

Run `git status` before every commit and confirm no jpg, mp4, raw, transcript, or URL-bearing file is staged.

## Why we do not publish the list of analyzed video links

It is tempting to ship a folder of every TikTok URL we studied. We do not, for three reasons:

1. **Redistribution.** A curated list of scraped video URLs is republishing someone else's catalog, which runs against TikTok terms and the project's legal rule (decided 2026-05-24: do not vendor scraped datasets into the public repo).
2. **It adds no value the derived work lacks.** The teardowns in `winners.json` already carry our analysis in our own words. The conclusions in `breakout-vs-dud.json` carry the numbers. A reader does not need the raw links to trust or use either.
3. **The audit trail still exists, locally.** The video-id to URL mapping is preserved in gitignored files (for example `mcp/data/decoded/_td-full.jsonl`) so we can always retrace a specific teardown. That traceability lives with us, not on GitHub.

What we publish instead is the selection methodology: how videos were chosen (breakout ranking by views-per-follower, then concept-matched or same-creator pairing), how many were analyzed, and across which niches. That lets a reader judge the sampling without us redistributing the sources.

## Engineering discipline for changes

So that an agent's commits match how this repo is maintained:

- Every code change to the MCP must pass `npm run build` and `npm run smoke` (currently 11/11) before commit.
- Commits state the value of the change and, for research commits, the result and how it was validated. Reference SHAs so a reader can trace the chain (for example the breakout-vs-dud validation chain).
- Derived aggregates are recomputed and committed; the scraped inputs that produced them are not.
- No em-dashes in any committed text (README, docs, titles, copy, commit messages). Use commas, periods, or parentheses.
- The product repo is `github.com/dylanpakd-cyber/lazyreel`; the marketing site is the separate `lazyreel-site` repo. Do not conflate them.

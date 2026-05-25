# LazyReel methodology

This folder documents *how* LazyReel reaches its conclusions, so any agent or person reading the repo can trust the findings, reproduce them, and extend them without guessing. It is the answer to "where did this number come from and how do I know it is not random."

## Why this exists

LazyReel makes claims about what makes short-form video win (see the `breakout_vs_dud`, `viral_teardowns`, `winning_combos`, and `content_gaps` MCP tools). A claim is only worth shipping if it survives a test it could have failed. These docs record the tests, the failures we caught, and the engineering discipline behind every commit.

## The four operating principles

1. **Evidence before assertion.** Every behavioral claim in the tools traces to a measured result, not intuition. If we have not tested it, we label it a hypothesis, not a law.
2. **Blind and out-of-sample.** We validate on pairs the analysis was not derived from, with the answer hidden from the predictor. A pattern that only "explains" the data it was built on proves nothing.
3. **Control the confound, then re-test.** A surprising result is a prompt to look for a hidden variable (audience size, video age) before believing it. We document the confounds we found and how we removed them.
4. **Commit derived analysis, never scraped content.** The repo carries our own words and aggregate numbers. It does not carry TikTok URLs, transcripts, video files, or cover images. See `data-discipline.md`.

## Files

- **`breakout-vs-dud-study.md`** : the full study answering "why does the same concept get 1K vs 1M views," including the result that nearly fooled us, how we caught it, and what we learned over time.
- **`validation-protocol.md`** : the reusable blind-prediction protocol and the local pipeline (frame extraction plus sub-agent predictors), so you can run a new test the same way.
- **`corpus-index.md`** : transparent counts of what we analyzed, by niche, with the validation-pair tally.
- **`data-discipline.md`** : what is committed vs gitignored and the legal reasoning around analyzed video links.

## Headline results (scaled to 5,680 validation videos)

| Test | What it controls for | Result |
|---|---|---|
| Extremes (concept-matched, ~1000x gap) | nothing beyond concept matching | 890/947 = 93.98% ~= 94% (z=27.07) |
| Closer-margin (cross-creator, 5 to 34x gap) | smaller gap, not follower-controlled | 474/947 = 50.05% ~= 50% (chance; z=0.03) |
| Same-creator, age-controlled | audience and video age | 785/946 = 82.98% ~= 83% (z=20.29) |
| **Pooled across all valid pairs** | evenly spread across tiers | **2,149/2,840 = 75.67% (z=27.36); read tiers separately, pooling masks the confound** |

Baseline for every test is 50%: a coin flip between two videos. Here `n` is the number of paired tests, so 5,680 validation videos produce 2,840 pair tests. `z` is the binomial z-score against that 50% baseline, not the number of tests run. Full detail in `breakout-vs-dud-study.md`.

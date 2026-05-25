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

## Headline results (as of commit history below)

| Test | What it controls for | Result |
|---|---|---|
| Extremes (concept-matched, ~1000x gap) | nothing | 17/18 = 94% |
| Closer-margin (concept-matched, 8 to 34x gap) | smaller gap | 9/12 = 75% |
| Same-creator, age-controlled | audience and video age | 15/18 = 83% (z=2.83, p approximately 0.002) |
| **Pooled across all valid pairs** | mixed | **41/48 = 85% (95% CI 73 to 93%, z=4.91)** |

Baseline for every test is 50% (a coin flip between two videos). Full detail in `breakout-vs-dud-study.md`.

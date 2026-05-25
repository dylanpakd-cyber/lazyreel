# Corpus index: what we analyzed

A transparent count of what sits behind the tools, so a reader can judge the sampling. These are derived counts, not the source videos. See `data-discipline.md` for why the raw links are handled separately.

## The labeled corpus

5,560 short-form videos, scraped and labeled (hook pattern, framework, emotion, niche) by the pipeline in `mcp/pipeline`. Distribution across the ten DTC niches:

| Niche | Labeled videos |
|---|---|
| ABG beauty | 716 |
| tech and SaaS | 615 |
| fashion | 600 |
| food and beverage | 572 |
| home and cleaning | 554 |
| supplements | 548 |
| pets | 538 |
| fitness | 511 |
| skincare | 496 |
| hair | 410 |
| **Total** | **5,560** |

## Deep teardowns (committed in `winners.json`)

58 videos analyzed in depth, each rebuilt into a structured teardown (hook technique, retention device, viral mechanism, the one move to steal). No URL or transcript is stored, only our analysis.

| Niche | Teardowns |
|---|---|
| ABG beauty | 8 |
| skincare | 8 |
| fitness | 8 |
| supplements | 7 |
| food and beverage | 7 |
| pets | 4 |
| hair | 4 |
| tech and SaaS | 4 |
| home and cleaning | 4 |
| fashion | 4 |
| **Total** | **58** |

Of these, 40 use the `deepvis-frames` method (a dense full-timeline frame strip read end to end), and 18 are earlier transcript-grounded teardowns.

## Deep visual analysis (frames extracted)

267 videos had a full frame strip extracted with yt-dlp and ffmpeg for frame-level analysis. This set covers the 58 teardowns plus every video used in the validation pairs below.

## Validation pairs (blind, out-of-sample)

Pairs used to test the breakout-vs-dud laws, none of which were used to derive the laws:

| Tier | Pairs | Result |
|---|---|---|
| Extremes (concept-matched, ~1000x gap) | 18 | 17/18 = 94% |
| Closer-margin (concept-matched, 8 to 34x gap) | 12 | 9/12 = 75% |
| Same-creator, age-controlled | 18 | 15/18 = 83% (significant) |
| **Pooled valid** | **48** | **41/48 = 85% (z=4.91)** |

Two earlier same-creator batches (14 and 40 pairs) were discarded after we found a recency confound. They are documented in `breakout-vs-dud-study.md` as a lesson, not counted as evidence.

## Selection method (in brief)

Breakouts are ranked by views-per-follower, not raw views, so a small creator who out-reached their following counts as a winner. Teardown targets were the top breakouts per niche. Validation pairs were drawn by matching on concept (same niche and hook) or on creator, then controlling for video age. Full procedure in `validation-protocol.md`.

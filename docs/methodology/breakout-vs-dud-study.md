# Study: why the same concept gets 1K vs 1M views

This is the research behind the `breakout_vs_dud` MCP tool and the `data/breakout-vs-dud.json` artifact. It documents the question, the method, the result that almost fooled us, the fix, and the honest limits.

## The question

Holding the idea constant, what separates a short-form video that gets a million views from one that gets a thousand? Is the difference visible in the first few seconds, and can it be stated as rules?

## Data

- Corpus: 5,560 labeled TikTok videos (hook pattern, framework, emotion, niche), scraped via the pipeline in `mcp/pipeline/` and labeled by a cheap model.
- For deep visual work we download the video with yt-dlp and extract a dense frame strip with ffmpeg (roughly 13 frames spanning the whole video, dense in the first 3 seconds). See `validation-protocol.md`.
- Committed outputs carry no URLs, transcripts, or frames. The video-id to URL audit trail lives only in gitignored local files.

## Step 1: corpus-wide contrast

We compared the labeled features of 1M-plus videos (n=2,361) against sub-10K videos (n=694) and computed lift (share among winners divided by share among duds). What over-indexes in winners:

- Hook: `speed-of-claim` 7.3x, `before-after` 2.3x, `authority` and `direct-callout` and `pov` around 1.6 to 1.9x.
- Emotion: `fear` 2.0x, `guilt` 1.9x, `nostalgia` 1.7x, `disgust` 1.5x.
- What loses: `clearly-ad` openings 0.7x, product as background 0.73x, `link-in-bio` CTA 0.67x, `listicle` framework 0.81x.

Important confound noted up front: 1M-plus videos come from accounts roughly 19x larger (median 234K vs 12.6K followers). Raw views are not pure craft. But 62% of the 1M-plus set out-reached their own following by 10x or more, so a real execution signal exists underneath.

## Step 2: concept-matched frame comparison

We paired a mega-breakout with a flop of the *same niche and same hook pattern*, then compared their frames end to end. Across six pairs the pattern was consistent and produced five candidate laws (the "first 3 seconds laws"). These are stored in `data/breakout-vs-dud.json` and surfaced by the tool.

## Step 3: blind validation (the part that matters)

We then ran blind, out-of-sample tests. For each test we took pairs the laws were not derived from, randomized which video was option A vs B, hid all view counts, and asked a fresh sub-agent to pick the higher-view video from frames alone using only the five laws. Baseline is 50%.

| Test | Pairs | Accuracy |
|---|---|---|
| Extremes (concept-matched, ~1000x gap) | 18 | 17/18 = 94% |
| Closer-margin (concept-matched, 8 to 34x gap) | 12 | 9/12 = 75% |
| Same-creator, age-controlled | 18 | 15/18 = 83% (z=2.83) |
| Pooled | 48 | 41/48 = 85% (95% CI 73 to 93%, z=4.91) |

## The result that almost fooled us

The same-creator test is the cleanest, because two videos by one creator share an audience, so follower count cannot explain the difference. Our first attempt paired each creator's highest-views video against their lowest-views video. It scored 64% at n=14, then dropped to 41% at n=54, which looked like the laws failing.

We did not accept that number. We checked video age using the TikTok id (the creation timestamp is the top 32 bits: `created_unix = int(video_id) >> 32`). In 38 of 40 pairs the low-views "dud" was actually the creator's *newest* upload, a median of 133 days younger than the "winner." It had not flopped, it just had not aged. The test was measuring recency, not craft.

The fix: require the dud to be at least as *old* as the winner, so it is a genuinely matured flop. Re-run on 18 clean pairs gave 15/18 = 83%, statistically significant. Lesson recorded in the artifact's `methodNote`: trust the controlled number, and scaling a test is what exposed the confound that a small sample hid.

## Honest limits

- Sample is small (18 clean same-creator pairs, 48 pooled). The true within-creator rate could sit anywhere from roughly 61 to 94%.
- The "why" is inferred from still frames, not watch-time curves or A/B tests.
- Every miss was an external pull the frames cannot see: a celebrity (a Zendaya video), or a flashy opening the laws over-rewarded. The laws explain opening craft, and opening craft loses to star power or a trending sound.
- The two laws carrying most of the signal across all tiers are: do not signal the format (no "GRWM / tutorial / review" title card), and maximize per-frame novelty (macro, motion, or new shots) rather than a static talking head.

## What we learned over time

The conclusions did not arrive in one shot. The evolution is part of the evidence:

1. **The session's real lane was deep video, not cover images.** An early plan was to enrich the corpus from cover thumbnails, but that work was redundant with a separate API process. The unique value was full-timeline frame analysis of the top breakouts, which produced the teardowns and then the laws.
2. **A high score on easy cases can flatter you.** 94% on extremes (a 100M video vs a 50K one) felt strong, but a 100M video also tends to come from a bigger account and a more produced shoot. Some of that 94% was production quality and audience, not the five laws.
3. **Scaling a test is how you find the confound a small sample hides.** The same-creator test looked fine at n=14 (64%). Only when we pushed to n=54 and it fell to 41% did we stop and look, and find that the low-views video was almost always just the newest upload. A confident small sample is a trap.
4. **A surprising number is a prompt to check a variable, not to publish.** We decoded video age from the TikTok id and confirmed the recency confound before believing the 41%. The clean re-run gave 83%.
5. **The misses define the boundary.** Every wrong call was an external pull the frames cannot show: a celebrity, or a flashy opening the laws over-rewarded. So the honest claim is bounded to opening craft.
6. **Two laws do most of the work.** Across every tier, not signaling the format and maximizing per-frame novelty were the levers that separated winners. The other three help but matter less.
7. **Methodology moved the result more than the model did.** The same laws scored 94%, 41%, or 83% depending only on how the test was built. That is why this folder documents the how, not just the what.

## What this licenses the tool to claim

That nailing the first three seconds is a real, measured edge (85% pooled, significant), not a guarantee of virality. The tool states this and shows all three test tiers plus the method note, so it cannot oversell.

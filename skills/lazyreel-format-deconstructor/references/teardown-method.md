# Teardown method and the measured insights

This is the insight payload for the deconstructor. Every number here is from the LazyReel corpus (real decoded TikTok and Instagram, past 6 months), not intuition. The MCP tools `viral_teardowns`, `breakout_vs_dud`, and `winning_combos` serve live versions. Read this before you judge a video, so the read is grounded in what actually over-performs, not in what looks impressive.

## The creator-baseline rule (read this first)

Raw views lie. In the corpus, the 1M-plus set had a median of 234,500 followers against 12,600 for the sub-10K set, roughly 19x bigger accounts. A big account gets big views from a weak video. So judge craft on **views over the creator's own median (views-per-follower)**, not raw views. 62% of the 1M-plus videos still out-reached their own following 10x or more, which is the real, learnable signal. When you deconstruct, always ask: did this out-reach the creator's baseline, or is the account just large.

## The three gates (a high-view video can still be a bad model)

1. **Relative lift.** Did it beat the creator's own median, or is the account just big. Creator-relative beats raw views.
2. **Engagement quality.** Organic engagement, or high-views with suspiciously low engagement (a possible boost). Flag it.
3. **Product-necessity and recurrence.** Remove the product mentally: does the video still work without it (a weak model, the product is decoration). Does the mechanic repeat across creators, or is it a one-off premise, a celebrity, or a trend that will not transfer.

## False-positive labels (name them when you see them)

A video can have huge views and still be a trap to copy. Label these so a downstream prompt does not chase them:

- `big_account` : views explained by follower count, not craft (failed gate 1).
- `paid_reach_suspect` : view count far above engagement norms, likely boosted.
- `zero_share_high_view` : high views, near-zero shares. Shares are the breakout engine; without them it will not transfer.
- `celebrity_overfit` : it worked because of who is in it, not the format.
- `trend_overfit` : it rode a sound or meme that is already cooling. The shell will not carry a new product.
- `product_unnecessary` : remove the product and nothing changes. There is no buyable reason in the video.
- `one_off_premise` : a premise that cannot recur (a literal accident, a once-only event).

## What over-indexes in winners (corpus lift, 1M-plus vs sub-10K)

Use this to weight the diagnosis. Higher lift means the feature shows up far more in winners than in duds.

Hook pattern:
- speed-of-claim 7.3x
- before-after 2.3x
- authority 1.9x
- direct-callout 1.6x
- pov 1.6x
- comparison 1.3x

Framework:
- problem-agitate-solution 1.8x
- founder-objections 1.8x
- x-without-y 1.3x

Emotion (high-arousal beats neutral):
- fear 2.0x, guilt 1.9x, nostalgia 1.7x, disgust 1.5x

Product role:
- helper 1.6x (the product assists, it is not the star)

What loses, so flag it as a weak model to copy:
- clearly-ad opening 0.7x
- product as background prop 0.73x
- explicit CTA or link-in-bio 0.67x
- listicle framework 0.81x

Note the trap: the single most-used hook in the corpus, information-offering, sits around 44 to 52% of videos per niche and UNDER-performs. Common is not the same as winning.

## Feature combinations that over-index (winning_combos)

Combinations beat single features. The strongest in the corpus:
- lifestyle-broll + store setting: 19.5x (n=13/15)
- pov-handheld + faceless (no person on camera): 10.5x (n=35/45)
- nostalgia + faceless: 8.2x
- pov-handheld + store setting: 6.0x

The throughline: a faceless, in-the-world, handheld point of view over-indexes hard. You do not need a creator on camera to break out.

## The dimension stack (label every teardown on these)

- **format**: talking-head / before-after / voiceover-broll / GRWM / pov-handheld / screen-recording / text-overlay-heavy / product-demo / lifestyle-broll
- **hook pattern**: the 13-pattern taxonomy (pov, belief-challenging, direct-callout, speed-of-claim, before-after, authority, comparison, curiosity, size-of-claim, and the rest)
- **framework**: problem-agitate-solution, founder-objections, x-without-y, us-vs-them, contrarian, listicle, founder-origin, testimonial
- **emotion**: the dominant felt charge in the first 3 seconds
- **setting**: home / store / car / outdoor / studio / gym
- **face / person**: on-camera person, faceless, hands-only
- **product role**: hero / proof / helper / background / punchline / cta-only
- **ad-obviousness**: native / semi / clearly-ad

## The signature device

Every real breakout is built around one moment: the single shot or beat the whole video exists to deliver (the 7am/7pm mirror cut, the murky-water-bottle shock, the one curl released early). Name it explicitly. If you cannot find one, the video probably does not have a transferable spine, and that is itself the finding.

## The first-3-seconds laws (the opening is what the feed judges)

Cross-reference with `breakout_vs_dud`. The opening either earns the next second or it does not:
1. Open on an unresolved visual question, not a caption that states the premise.
2. Show a taste of the payoff inside ~1.5s, then withhold the full reveal.
3. Maximize per-frame novelty (macro, motion, a new shot every 5 to 8s).
4. Do not signal the format (no GRWM, tutorial, review, or title card in the opening).
5. Front-load social or emotional charge in frame 1.

Laws 3 and 4 carried the most weight in blind validation (83% within-creator, the cleanest tier). When you deconstruct, score the opening against these five first, because that is the part that decides reach.

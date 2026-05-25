# Breakout insights for video generation

The distilled, measured findings from decoding the LazyReel corpus, written as directives you can apply directly when prompting Higgsfield. Every number here is from blind, out-of-sample validation, not intuition. Provenance and the full method are in `docs/methodology` of the LazyReel repo. The `breakout_laws` MCP tool serves a live version of this.

## The five first-3-seconds laws

A video that follows more of these beats one that follows fewer. In blind validation the higher-law-compliance video was the higher-views video 83% of the time on the cleanest test (same-creator, audience controlled) and 94% at extremes. It is at chance for ranking moderate-gap pairs across different creators, where follower count owns raw views, so judge by creator-baseline.

1. **Open on an unresolved visual question, not a caption that explains the premise.** The first frame should make the viewer need to keep watching to find out what happens. A caption that states the premise kills it. Example contrast: a winner opened on two mismatched dogs nose to glass (will the big one hurt the small one); the dud captioned "POV: the most spoiled dog" over a static shot and had nothing left to show.
2. **Show a taste of the payoff inside the first ~1.5s, then withhold the full reveal.** Lead with the most desirable or striking visual, then hold the resolution. A hair winner dropped one perfect curl at 1.5s and withheld the full mane for nearly a minute; the dud opened on the finished hair and had nowhere to go.
3. **Maximize per-frame novelty.** Macro framing, motion, or a new shot every 5 to 8 seconds. The transformation must be visible at the frame level. A beauty winner cut to a new macro product shot every 7 to 8s; the dud was a static 6-minute talking head where the change was invisible frame to frame.
4. **Do not signal the format.** No "GRWM," "tutorial," "review," "ad," or title card in the opening. Show it, never label it. A tech winner stacked wordless "what is that" gadget shots; the dud slapped a "gadget review" overlay at 0.3s and killed the mystery.
5. **Front-load social or emotional charge in frame 1.** Multiple people, a shock or delight expression, a color pop, or a prop. A hair winner opened on a matching-neon mother-daughter duo mid-reaction; the dud opened on one neutral woman.

Laws 3 and 4 carried the most weight across every validation tier. If you only enforce two, enforce per-frame novelty and no format label.

## What over-indexes in winners (corpus lift, 1M-plus vs sub-10K)

Use these to decide what to generate, not just how to open it.

- Hook pattern: speed-of-claim 7.3x, before-after 2.3x, authority 1.9x, direct-callout 1.6x, pov 1.6x.
- Emotion: fear 2.0x, guilt 1.9x, nostalgia 1.7x, disgust 1.5x. High-arousal beats neutral.
- Structure: problem-agitate-solution 1.8x.
- Product role: helper 1.6x. The product assists, it is not the star.

What loses, so do not generate it: clearly-ad openings 0.7x, product as background prop 0.73x, link-in-bio or explicit CTA 0.67x, listicle framework 0.81x.

## Opening patterns that won, by niche

Grounded in concept-matched frame comparisons (same niche and hook, winner vs dud).

- **Food and beverage:** open on the finished dish in extreme macro filling the frame in the first 0.3s, then show the process. Do not start with a person stirring.
- **Beauty and skincare:** macro of skin, tool, or product texture, a new angle every few seconds. Bare-skin or product-in-action close-ups beat a talking head.
- **Hair:** show a strange, specific "before" state, release one piece of the transformation early, withhold the full reveal.
- **Tech and gadgets:** wordless, an unexplained device in use on an attractive subject in an aspirational setting. Withhold the product name for the first 3 seconds.
- **Pets:** an active inter-species or mid-action moment that poses a question. No list captions.
- **Fitness and fashion:** front-load social proof and motion (two people, a shock expression, a kinetic entrance), not a static pose or a tier-list card.

## The anti-slop bar (enforce in dialogue and on-screen text)

Never generate these words or their energy: revolutionary, supercharge, game-changing, transform your life, experience the difference, unlock the power, elevate your, seamless, innovative, stunning, breathtaking, epic, unleash. Rocket and sparkle emoji read as an AI ad.

Voice rules that matter most for a generated video:
- Talk like a person texting, not a brand writing. Contractions and fragments are fine.
- Customer-first, never brand-first. The product name lands late, around shot 2 or 3, never in the first line.
- Specificity is the whole game. Numbers and concrete scenarios beat adjectives.
- Open a curiosity gap, do not spoil it. A hook that states the payoff is dead.
- Sound-off survival. The first line must land from the on-screen caption alone, because most viewers start muted.
- Realism over polish. Imperfect framing and a real room are trust signals.

## How to apply this in a Higgsfield prompt

- Put law 1 and law 5 into the first-frame image you lock with `generate_image`, then drive it with image-to-video so the hook is not random.
- Put law 3 into the motion or camera preset and the shot count.
- Put law 4 and the anti-slop bar into the on-screen text and dialogue you write.
- Put the niche pattern above into the choice of opening subject.
- After rendering, run `virality_predictor` and read its hook assessment against laws 1 and 4.

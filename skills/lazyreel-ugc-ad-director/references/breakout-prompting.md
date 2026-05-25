# Breakout prompting: the measured insights as prompt directives

The insight payload for the director. Every rule maps a validated corpus finding to a concrete prompt decision. Numbers are from the LazyReel corpus (real decoded TikTok and Instagram, past 6 months); the MCP `breakout_laws` and `niche_report` tools serve live versions. Read this before writing prompts so the clips chase what wins, not what looks impressive.

## The five laws, as positive prompt directives

The opening clip decides reach. Write clip 1 to satisfy these:

1. **Unresolved visual question.** The first frame shows an action mid-event or an anomaly the viewer must keep watching to resolve. Prompt the subject already in motion or in a strange-but-legible state. Do not put the premise in on-screen text.
2. **Taste of the payoff inside ~1.5s, then withhold.** Prompt the single most desirable or striking visual early (the finished result, one piece of the transformation), and save the full reveal for the final clip.
3. **Per-frame novelty.** This is why the output is 3-4 clips, not one. Each clip is a distinct framing (wide, macro, reframe, insert). Prompt macro and motion.
4. **No format label.** Never prompt a "GRWM," "tutorial," "review," "ad," or title-card overlay in the opening. Show it, never label it. This was one of the two strongest laws.
5. **Social or emotional charge in frame 1.** Prompt a face mid-expression, two people, a color pop, or a prop. High-arousal openings win.

Laws 3 and 4 carried the most weight in blind validation (83% within-creator, the cleanest tier).

## The negative-prompt library (the do-not list)

Put a Negative line on every clip. Two jobs:

**Kill the AI-video glitches:**
plastic or airbrushed skin, waxy sheen, extra or fused or missing fingers, morphing face during head turns, eye drift or jitter, warping or bending background, floating or duplicated objects, melting hands, warping or scrambled text, inconsistent lighting flicker, duplicated limbs.

**Kill the slop tells:**
on-screen text, watermark, logo, baked-in subtitles, cinematic color grade, LUT, lens flare, bloom, film grain, oversaturation, beauty filter, studio lighting, dramatic lighting, slow motion, title card, format label ("GRWM" / "review" / "ad"), magazine pose.

**Shot-specific negatives to add as needed:**
hands-only clip: "no face, no full body." Product macro: "no hands obscuring the product." Outdoor: "no sun flare."

## What to generate (corpus lift, 1M-plus vs sub-10K)

Pick the concept, hook, and structure from what over-indexes, not from instinct.

Hooks: speed-of-claim 7.3x, before-after 2.3x, authority 1.9x, direct-callout 1.6x, pov 1.6x.
Frameworks: problem-agitate-solution 1.8x, founder-objections 1.8x.
Emotion (high-arousal beats neutral): fear 2.0x, guilt 1.9x, nostalgia 1.7x, disgust 1.5x.
Product role: helper 1.6x. The product assists, it is not the star, and it is named late.
Combos: pov-handheld + faceless 10.5x, lifestyle-broll + store 19.5x, nostalgia + faceless 8.2x. A faceless, in-the-world, handheld POV is a strong default and needs no on-camera creator.

What loses, so do not prompt it: a clearly-ad opening 0.7x, product as background prop 0.73x, an explicit CTA or link-in-bio 0.67x, the listicle framework 0.81x. Note the trap: information-offering is the single most-used hook (around 44 to 52 percent of videos) and under-performs. Common is not winning.

## Niche-to-opening map (the first clip, by niche)

Grounded in concept-matched winner-vs-dud frame comparisons.

- **Food and beverage:** open on the finished dish in extreme macro filling the frame, then show the process. Not a person stirring.
- **Beauty and skincare:** macro of skin, tool, or product texture, a new angle every clip. Bare-skin or product-in-action close-ups beat a talking head.
- **Hair:** open on a strange, specific "before" state, release one piece of the transformation early, withhold the full reveal.
- **Tech and gadgets:** wordless, an unexplained device in use on an attractive subject in an aspirational setting. Withhold the product name for the first clip.
- **Pets:** an active inter-species or mid-action moment that poses a question. No list captions.
- **Fitness and fashion:** front-load social proof and motion (two people, a shock expression, a kinetic entrance), not a static pose or a tier-list card.

## Sound-off rule

Most viewers start muted. The hook line must land as the burned caption alone, so write clip 1's dialogue so the first phrase reads as a standalone caption. The video-editor burns it; you write it caption-first.

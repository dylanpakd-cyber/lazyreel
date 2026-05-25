---
name: lazyreel-higgsfield-director
description: Turn LazyReel's validated breakout insights into Higgsfield video-generation prompts as a 3-4 clip cut sequence whose first three seconds are engineered to clear the breakout laws before you spend a credit. Each clip gets a positive prompt, a negative (do-not) prompt, and a why-it-works tied to a measured law. Use when the user wants to generate a UGC or short-form video with Higgsfield, write a Higgsfield prompt, render an ad from a LazyReel brief, or asks "what should the opening shot be." Pairs with the LazyReel MCP (call breakout_vs_dud, shoot_brief, viral_teardowns, replicate_format first), the Higgsfield MCP (generate_image, generate_video, virality_predictor), and hands the clips to the lazyreel-video-editor skill for the cut.
---

# LazyReel to Higgsfield director

You are the bridge between research and render. LazyReel decides what is worth making and why; Higgsfield makes it; the video-editor cuts it. Your job is to turn a brief into a **3-4 clip cut sequence** whose first three seconds are engineered to win, because that is the part we validated and the part the feed judges first.

The payload that makes this worth more than a generic prompt template is `references/breakout-insights.md`: the five first-3-seconds laws and the format and hook lift, each measured, not guessed. Read it before you write a prompt.

## Where this sits

- **Upstream (LazyReel MCP):** what to make. Call `breakout_vs_dud` for the laws and the confound caveat, `shoot_brief` or `replicate_format` for the structure, `viral_teardowns` or `study_examples` for the niche's winning format.
- **Here:** translate that into a 3-4 clip plan and the Higgsfield prompts that satisfy the laws.
- **Downstream (Higgsfield MCP):** `generate_image` for a controlled first frame, `generate_video` to render each clip, `virality_predictor` as a post-render gate.
- **Then (lazyreel-video-editor skill):** hand it the clips to trim, cut, caption, and assemble into the finished 9:16 short.

## Never render one clip

A 10 to 15 second ad is **3 to 4 clips**, one shot each, hard-cut. Per-frame novelty was one of the two strongest things we measured; a single continuous clip loses on it and reads as AI. Plan the cut before you prompt:

- **Clip 1 (0 to ~3s): the hook.** The most unresolved, highest-charge shot. Engineer it against all five laws. No title card.
- **Clips 2 to 3 (~3 to ~10s): escalation.** Each a new framing or beat. The product enters here as a helper, not the star.
- **Final clip (~10 to ~15s): the payoff** the hook teased, then a hard end. No drawn-out CTA.

## The method

### 1. Pull the brief, do not invent it
If a LazyReel brief was handed to you, use it. If not, get one: call `breakout_vs_dud` (the laws), then `shoot_brief` for the product and niche, and note the niche's strongest format from `viral_teardowns`. Never write from a blank page when the research tools exist.

### 2. Write each clip with three parts
For every clip in the sequence:

- **Prompt:** the positive Higgsfield prompt. Vertical 9:16, one shot, UGC-real (handheld feel, natural light), the rich specifics (subject, expression, hands, light source, background). Lock clip 1's first frame with `generate_image`, then image-to-video so the hook is not left to chance.
- **Negative:** the do-not list (see below). Higgsfield honors negative prompts; use them on every clip.
- **Why it works:** one line tied to a law or lift.

### 3. Engineer clip 1 to clear all five laws
This is the whole game. The concrete Higgsfield directive per law:

1. **Open on an unresolved visual question, not a caption.** First frame shows an action mid-event or an anomaly. Put it in the `generate_image` first frame, not in on-screen text.
2. **Show a taste of the payoff in the first ~1.5s, then withhold the rest.** Prompt the single most striking visual up front, save the full reveal for the final clip.
3. **Maximize per-frame novelty.** This is why it is 3-4 clips. Pick a motion or camera preset with real movement; never a static talking head holding one angle.
4. **Do not signal the format.** No "GRWM," "tutorial," "review," or title card in the opening. Show it, never label it. One of the two strongest laws.
5. **Front-load social or emotional charge in frame 1.** A face mid-expression, two people, a color pop, or a prop. Prompt the emotion and the color explicitly.

### 4. The negative prompt (every clip)
Put a Negative on each clip. It kills both the AI-video glitches and the slop tells:

`plastic or airbrushed skin, waxy sheen, extra or fused fingers, morphing face, eye drift, warping background, floating or duplicated objects, scrambled text, on-screen text, watermark, logo, baked-in subtitles, cinematic color grade, LUT, lens flare, film grain, oversaturation, beauty filter, studio lighting, slow motion, title card, format label (GRWM / review / ad)`

Add shot-specific negatives as needed (faceless clip: "no face, no full body"; product macro: "no hands obscuring the product").

### 5. Render with Higgsfield
- Vertical 9:16. First-frame control via `generate_image` then image-to-video gives the most reliable hook.
- Choose a motion or camera preset that creates the per-frame novelty law 3 wants.
- Generate each clip as its own short render (3 to 4s, one action arc).

### 6. Hand the clips to the editor, then gate
Send the clip set to the **lazyreel-video-editor** skill with the cut order and which clip is the hook. It trims each to its beat, crops to 9:16, hard-cuts every 1.5 to 3s, normalizes loudness, and burns the sound-off caption. Rendering costs money, so run the pre-render checklist below first. After rendering, run Higgsfield `virality_predictor` and read its hook assessment against laws 1 and 4; a weak-hook flag usually means clip 1 violated one of them.

## Worked example (matcha kit, PAS, before-after hook)

- **Clip 1, hook (0-3s):** generate_image locks a macro of clumpy matcha mid-whisk, hands only, no caption. Negative: text, watermark, smooth skin, cinematic grade. Why: unresolved question (law 1), faceless + handheld (10.5x).
- **Clip 2, problem (3-6s):** annoyed glance at the clumpy cup, new angle. Why: emotional charge (law 5).
- **Clip 3, switch (6-10s):** smooth pour from the product, macro, real time, helper role. Why: taste of payoff (law 2).
- **Clip 4, payoff (10-14s):** finished cup, one sip, knowing look, hard end. Why: withheld reveal delivered, no CTA card (explicit CTA loses at 0.67x).
- Hand to lazyreel-video-editor: order 1-2-3-4, hook = clip 1, caption "still clumpy at 2pm?" burned at 0.5s.

## Pre-render checklist (the gate)

Do not render until the plan clears these. A no here is cheaper to fix in the prompt than after the render.

- [ ] 3 to 4 clips planned, one action arc each, never one static clip
- [ ] Clip 1 opens on an unresolved visual question, not a caption that explains the premise
- [ ] A taste of the payoff lands in clip 1, full reveal withheld to the final clip
- [ ] Motion or a new framing every clip (per-frame novelty), not a static talking head
- [ ] No format label or title card in the opening (law 4)
- [ ] Social or emotional charge in clip 1's first frame (law 5)
- [ ] Every clip has a positive prompt, a Negative prompt, and a why-it-works
- [ ] Cut order and hook clip handed to the video-editor

## Honest scope

These laws predicted the higher-view video 83% of the time on the cleanest blind test (same-creator, audience controlled) and 94% at extremes, but only at chance for ranking moderate-gap pairs across different creators (follower count owns raw views there). They do not guarantee virality. External pulls (a celebrity, a trending sound) beat opening craft and the laws cannot see those. Treat the checklist as the floor that keeps you from losing in the first 3 seconds, not a promise of a hit. Full method in `docs/methodology` of the LazyReel repo.

## References

- `references/breakout-insights.md`: the five laws with evidence, the format and hook lift, the per-niche strongest formats, and the anti-slop bar. The insight payload. Read it first.
- Downstream: the `lazyreel-video-editor` skill assembles the clips into the finished cut.

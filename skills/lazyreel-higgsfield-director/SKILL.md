---
name: lazyreel-higgsfield-director
description: Turn LazyReel's validated breakout insights into Higgsfield video-generation prompts as a multi-clip cut sequence of any length, from a short ad to a 60-90 second-plus video, whose first three seconds are engineered to clear the breakout laws before you spend a credit. The clip count follows the script and target length, and long videos chain clips with Higgsfield's native video-extend for seamless continuity. Each clip gets a positive prompt, a negative (do-not) prompt, and a why-it-works tied to a measured law. Use when the user wants to generate a UGC, short-form, or long-form video with Higgsfield, write a Higgsfield prompt, render an ad from a LazyReel brief, or asks "what should the opening shot be." Pairs with the LazyReel MCP (call breakout_laws, make_brief, study_videos, teardown first), the Higgsfield MCP (generate_image, generate_video, virality_predictor), and hands the clips to the lazyreel-video-editor skill for the cut.
---

# LazyReel to Higgsfield director

You are the bridge between research and render. LazyReel decides what is worth making and why; Higgsfield makes it; the video-editor cuts it. Your job is to turn a brief into a **multi-clip cut sequence** whose first three seconds are engineered to win, because that is the part we validated and the part the feed judges first. The length is whatever the script needs, a 12s ad or a 90s video, and the clip count follows from it; see "Long-form" for how to chain past ~15s.

The payload that makes this worth more than a generic prompt template is `references/breakout-insights.md`: the five first-3-seconds laws and the format and hook lift, each measured, not guessed. Read it before you write a prompt.

## Where this sits

- **Upstream (LazyReel MCP):** what to make. Call `breakout_laws` for the laws and the confound caveat, `make_brief` or `teardown` for the structure, `study_videos` or `study_videos` for the niche's winning format.
- **Here:** translate that into a multi-clip plan (as many clips as the length needs) and the Higgsfield prompts that satisfy the laws.
- **Downstream (Higgsfield MCP):** `generate_image` for a controlled first frame, `generate_video` to render each clip, `virality_predictor` as a post-render gate.
- **Then (lazyreel-video-editor skill):** hand it the clips to trim, cut, caption, and assemble into the finished 9:16 short.

## Never render one clip

Any video is **multiple clips**, one shot each, hard-cut. The count follows the length: a 10-15s ad is ~3 to 5 clips, a 30s video ~8 to 12, a 60-90s video more. Per-frame novelty was one of the two strongest things we measured; a single continuous clip loses on it and reads as AI, and a cut every ~1.5 to 3s holds at any length. Plan the cut before you prompt:

- **Clip 1 (0 to ~3s): the hook.** The most unresolved, highest-charge shot. Engineer it against all five laws. No title card.
- **Middle clips: escalation.** Each a new framing or beat. The product enters here as a helper, not the star. As many as the script has beats.
- **Final clip: the payoff** the hook teased, then a hard end. No drawn-out CTA.

## Long-form: videos past ~15 seconds

Long videos use the same laws and the same per-clip discipline; there are just more clips, and continuity matters more. Higgsfield's strength here is **native video-extend**: it continues from the last frame of a rendered clip, so a single creator or scene stays seamless across many hops (validated past 40s on multi-hop chains).

- **Beats to clips.** Map the full script to beats first, one clip per beat. A 60s video is roughly 12 to 18 clips at 3-5s each.
- **Chain with video-extend for seamless continuity.** When the long video is one continuous performance (a creator talking through it, a single unfolding scene), render clip 1, then **extend** from its tail for each subsequent clip rather than generating each fresh. This keeps the face, wardrobe, lighting, and framing locked across the whole length where fresh renders would drift. The `higgsfield` CLI's video-extend (feed the prior clip back in, e.g. `--video`) is the reliable path; the flaky MCP is not.
- **Chain by reference when beats are distinct framings.** If each beat is a different shot (macro insert, reframe, new location), lock the first frame with `generate_image` per clip and carry the character via image reference, then hard-cut in the editor. Use extend for continuity, hard cuts for novelty; most long videos mix both.
- **Hold the through-line.** One spine across all clips: one problem resolved, one routine in order, one story. The extra length is for escalation, not filler. Name the signature device and let the clips serve it.

## The method

### 1. Pull the brief, do not invent it
If a LazyReel brief was handed to you, use it. If not, get one: call `breakout_laws` (the laws), then `make_brief` for the product and niche, and note the niche's strongest format from `study_videos`. Never write from a blank page when the research tools exist.

### 2. Write each clip with three parts
For every clip in the sequence:

- **Prompt:** the positive Higgsfield prompt. Vertical 9:16, one shot, UGC-real (handheld feel, natural light), the rich specifics (subject, expression, hands, light source, background). Lock clip 1's first frame with `generate_image`, then image-to-video so the hook is not left to chance.
- **Negative:** the do-not list (see below). Higgsfield honors negative prompts; use them on every clip.
- **Why it works:** one line tied to a law or lift.

### 3. Engineer clip 1 to clear all five laws
This is the whole game. The concrete Higgsfield directive per law:

1. **Open on an unresolved visual question, not a caption.** First frame shows an action mid-event or an anomaly. Put it in the `generate_image` first frame, not in on-screen text.
2. **Show a taste of the payoff in the first ~1.5s, then withhold the rest.** Prompt the single most striking visual up front, save the full reveal for the final clip.
3. **Maximize per-frame novelty.** This is why it is multiple clips, not one. Pick a motion or camera preset with real movement; never a static talking head holding one angle.
4. **Do not signal the format.** No "GRWM," "tutorial," "review," or title card in the opening. Show it, never label it. One of the two strongest laws.
5. **Front-load social or emotional charge in frame 1.** A face mid-expression, two people, a color pop, or a prop. Prompt the emotion and the color explicitly.

### 4. The negative prompt (every clip)
Put a Negative on each clip. It kills both the AI-video glitches and the slop tells:

`plastic or airbrushed skin, waxy sheen, extra or fused fingers, morphing face, eye drift, warping background, floating or duplicated objects, scrambled text, on-screen text, watermark, logo, baked-in subtitles, cinematic color grade, LUT, lens flare, film grain, oversaturation, beauty filter, studio lighting, slow motion, title card, format label (GRWM / review / ad)`

Add shot-specific negatives as needed (faceless clip: "no face, no full body"; product macro: "no hands obscuring the product").

### 5. Render with Higgsfield
- Vertical 9:16. First-frame control via `generate_image` then image-to-video gives the most reliable hook.
- Choose a motion or camera preset that creates the per-frame novelty law 3 wants.
- Generate each clip as its own short render (3 to 5s, one action arc), or extend from the previous clip for seamless long-form continuity (see "Long-form").

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

- [ ] The clip count the script and length call for (more clips for longer videos), one action arc each, never one static clip
- [ ] For videos past ~15s, a continuity plan (video-extend for seamless single-subject, reference for distinct framings)
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

---
name: lazyreel-higgsfield-director
description: Turn LazyReel's validated breakout insights into Higgsfield video-generation prompts that clear the first-3-seconds laws before you spend a credit. Use when the user wants to generate a UGC or short-form video with Higgsfield, write a Higgsfield prompt, render an ad from a LazyReel brief, or asks "what should the opening shot be" for a video. Pairs with the LazyReel MCP (call breakout_vs_dud, shoot_brief, viral_teardowns, replicate_format first) and the Higgsfield MCP (generate_image, generate_video, virality_predictor). Trigger on "Higgsfield video," "generate this ad," "render the brief," "make a video with Higgsfield," or when an orchestrator hands off a LazyReel brief for rendering.
---

# LazyReel to Higgsfield director

You are the bridge between research and render. LazyReel decides what is worth making and why; Higgsfield makes it. Your job is to take a brief and turn it into Higgsfield prompts whose **first three seconds are engineered to win**, because that is the part we validated and the part the feed judges first.

The payload that makes this skill worth more than a generic prompt template is `references/breakout-insights.md`: the five first-3-seconds laws and the format and hook lift, each one measured, not guessed. Read it before you write a prompt.

## Where this sits

- **Upstream (LazyReel MCP):** what to make. Call `breakout_vs_dud` for the laws and the confound caveat, `shoot_brief` or `replicate_format` for the structure, `viral_teardowns` or `study_examples` for the niche's winning format.
- **Here:** translate that into a shot list and Higgsfield prompts that satisfy the laws.
- **Downstream (Higgsfield MCP):** `generate_image` for a controlled first frame, `generate_video` to render, `virality_predictor` as a post-render gate.

## The method

### 1. Pull the brief, do not invent it
If a LazyReel brief was handed to you, use it. If not, get one: call `breakout_vs_dud` (the laws), then `shoot_brief` for the product and niche. Note the niche's strongest format from `viral_teardowns`. Never write a prompt from a blank page when the research tools exist.

### 2. Engineer the first shot to clear all five laws
This is the whole game. For each law, the concrete Higgsfield directive:

1. **Open on an unresolved visual question, not a caption.** First frame shows an action mid-event or an anomaly the viewer must keep watching to resolve. In the prompt: describe the subject already in motion or in a strange-but-legible state. Do not put the premise in on-screen text. Use `generate_image` to lock this exact first frame, then image-to-video so the hook is not left to chance.
2. **Show a taste of the payoff in the first ~1.5s, then withhold the rest.** Prompt the single most desirable or striking visual up front (the finished dish, one curl released, the device in use), then let the full reveal come later. Open a loop; do not close it.
3. **Maximize per-frame novelty.** Prompt macro or close framing, motion, and a shot change every few seconds. Avoid a static talking head holding one angle. In Higgsfield terms: pick a motion or camera preset with real movement, and plan 3 or more distinct shots for a 10 to 15s ad.
4. **Do not signal the format.** No "GRWM," "tutorial," "review," or title card in the opening. Show it, never label it. This was one of the two strongest laws in validation.
5. **Front-load social or emotional charge in frame 1.** A face mid-expression, two people, a color pop, or a prop. Prompt the emotion and the color explicitly.

### 3. Build the rest of the shot list
Carry the brief's framework beats. Keep cuts frequent (law 3). Place the product as a helper, not the hero, and name it late (the anti-slop bar). End on the payoff the opening teased.

### 4. Render with Higgsfield
- Vertical 9:16. First-frame control via `generate_image` then image-to-video gives the most reliable hook.
- Choose a motion or camera preset that creates the per-frame novelty law 3 wants.
- Generate each shot, then stitch in order.

### 5. Gate before and after you spend credits
Rendering costs money, so gate first. Run the pre-render checklist below. After rendering, run Higgsfield `virality_predictor` on the result and compare its read to the laws. If it flags a weak hook, the opening probably violated law 1 or 4.

## Pre-render checklist (the gate)

Do not render until the planned first shot clears all five. Be honest; a no here is cheaper to fix in the prompt than after the render.

- [ ] Opens on an unresolved visual question, not a caption that explains the premise
- [ ] A taste of the payoff lands inside the first ~1.5s, full reveal withheld
- [ ] Macro or motion or a shot change in the first 3s, not a static talking head
- [ ] No format label (no GRWM, tutorial, review, or title card) in the opening
- [ ] Social or emotional charge in frame 1 (face, people, color, or prop)

## Honest scope

These laws predicted the higher-view video on 41 of 48 blind, out-of-sample pairs (85%, significant), strongest when telling a viral-grade opening from a weak one and within a single creator. They do not guarantee virality. External pulls (a celebrity, a trending sound) beat opening craft, and the laws cannot see those. So treat the checklist as the floor that keeps you from losing in the first 3 seconds, not a promise of a hit. Full method in `docs/methodology` of the LazyReel repo.

## References

- `references/breakout-insights.md` : the five laws with evidence, the format and hook lift, the per-niche strongest formats, and the anti-slop bar. This is the insight payload. Read it first.

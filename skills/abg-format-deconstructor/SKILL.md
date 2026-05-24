---
name: abg-format-deconstructor
description: Deconstruct a breakout short-form video into a precise, copyable spec — why it broke out, then a shot-by-shot timeline (hook frame, on-screen text, props, cuts, audio, the signature device) described richly enough that you can write generation prompts from it. Use when the user pastes/links a winning video and wants to understand AND replicate its structure, or wants a "FormatSpec" of a pattern. Pairs with the ABG CMO MCP (viral_teardowns, study_examples).
---

# ABG CMO — Format Deconstructor

You turn a winning video into words precise enough to rebuild it. The principle: **if you can describe exactly what a breakout looks like and why it works, you can prompt it.** You don't write the final generation prompt here — you produce the rich spec a creator (or the ABG CMO UGC Ad Director skill) writes the prompt from.

## Inputs
A video link, a description, or a transcript. If the ABG CMO MCP is connected, first call `viral_teardowns`/`study_examples` for the niche to anchor the read in what already over-performs.

## Part 1 — Why it broke out (the diagnosis)
Diagnose against three independent gates (a high-view video can still be a bad model):
- **Relative lift:** did it out-reach the *creator's own median*, or is the account just big? (creator-relative beats raw views.)
- **Engagement quality:** organic engagement, or high-views-low-engagement (possible boost)? Flag `paid_reach_suspect`, `zero_share_high_view` if so.
- **Product-necessity + recurrence:** remove the product mentally — does the video still work (weak model)? Does the mechanic repeat across creators, or is it a one-off premise / celebrity / trend overfit?
Name the single biggest reason it spread (the viral mechanism), and the false-positive labels if any.

## Part 2 — The shot-by-shot FormatSpec (what to copy)
Describe it so it can be prompted, beat by beat:

```
HOOK (0-3s): opening visual (the literal first frame) · on-screen text verbatim · the hook technique · first-second friction (anything that slows comprehension)
RETENTION: what makes them stay past the hook
BEATS: setup → escalation → payoff → loop (the narrative arc + reveal timing)
CRAFT: video format (talking-head / before-after / voiceover-broll / GRWM / POV-handheld / screen-rec / text-overlay) · lighting (natural-window / ring / soft) · framing (selfie-closeup / medium-eye-level / overhead) · creator styling (polished / casual-messy) · setting · cut rate (continuous vs jump-cut) · motion
AUDIO: spoken vs music vs ambient · does the lack of music carry it? · trending sound or original?
PROP: the object that carries the idea · the SIGNATURE DEVICE (the one moment the whole video is built around)
PRODUCT: role (hero / proof / background / punchline / cta-only) · when it appears · how integrated · ad-obviousness (native / semi / clearly-ad)
```

Rate each dimension **very-strong / strong / weak** with a 4-word why, like a real teardown.

## Part 3 — Replication instructions
- The reusable **formula**: "X → Y → Z → payoff" (the mechanic, niche-agnostic).
- A **3-part name** for the pattern (concrete object/setup + emotion + mechanism), e.g. "Murky water bottle shock prop."
- **What to swap** for the new product (keep the skeleton + signature device; swap the demo beat).
- **Hand off** to `abg-ugc-ad-director` to write the actual model prompts from this spec.

## Rules
Ground every claim in what's actually visible/audible — never invent beyond the evidence; lower confidence when frames/audio aren't available. Describe the UGC craft honestly (imperfect framing, real apartment, visible skin texture are trust signals, not flaws).

---
_The "understand it well enough to rebuild it" companion in ABG CMO. Decode → describe → hand to the Ad Director to prompt._

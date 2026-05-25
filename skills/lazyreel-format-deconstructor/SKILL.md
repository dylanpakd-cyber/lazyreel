---
name: lazyreel-format-deconstructor
description: Deconstruct a breakout short-form video into a precise, copyable spec. First diagnose why it broke out (the three gates, the false-positive labels, the measured lift), then produce a shot-by-shot timeline (hook frame, on-screen text, props, cuts, audio, the signature device) described richly enough to write generation prompts from it. Use when the user pastes or links a winning video and wants to understand AND replicate its structure, or wants a "FormatSpec" of a pattern. Pairs with the LazyReel MCP (study_videos, breakout_laws, niche_report, study_videos) and hands off to the UGC ad director skills to write the prompts.
---

# LazyReel format deconstructor

You turn a winning video into words precise enough to rebuild it. The principle: **if you can describe exactly what a breakout looks like and why it works, you can prompt it.** You do not write the final generation prompt here. You produce the rich spec that a creator, the UGC ad director skill, or the Higgsfield director writes the prompt from.

The thing that makes this more than a generic "describe the video" pass is `references/teardown-method.md`: the creator-baseline rule, the three gates, the false-positive labels, and the measured lift for every hook, framework, emotion, and combination. Read it before you judge anything. A video that looks impressive is not the same as a video worth copying, and the payload is how you tell them apart.

## Inputs

A video link, a description, or a transcript. The richer the input (frames, captions, audio), the higher your confidence. If you only have a description, say so and lower the confidence on the craft section.

If the LazyReel MCP is connected, anchor the read in real data first:
- `breakout_laws` for the first-3-seconds laws and the creator-baseline confound.
- `study_videos` or `study_videos` for the niche, to see what already over-performs.
- `niche_report` for the feature combinations that over-index.

## Part 1: why it broke out (the diagnosis)

Run the three gates from `references/teardown-method.md`. A high-view video fails the model test if it cannot clear them:

1. **Relative lift.** Did it beat the creator's own median, or is the account just big. Use views-per-follower, never raw views.
2. **Engagement quality.** Organic, or high-views with suspiciously low engagement or near-zero shares.
3. **Product-necessity and recurrence.** Remove the product mentally: does it still work. Does the mechanic repeat across creators, or is it a one-off, a celebrity, or a cooling trend.

Then name two things:
- The **viral mechanism**: the single biggest reason it spread, in one sentence.
- The **false-positive labels**, if any (`big_account`, `paid_reach_suspect`, `zero_share_high_view`, `celebrity_overfit`, `trend_overfit`, `product_unnecessary`, `one_off_premise`). If you flag one, say plainly that this is a weak model to copy and why.

Weight the diagnosis with the measured lift in the payload. A before-after hook (2.3x) inside a problem-agitate-solution structure (1.8x) with the product as a helper (1.6x) is a strong, repeatable model. A clearly-ad opening (0.7x) with an explicit CTA (0.67x) is not, no matter the view count.

## Part 2: the shot-by-shot FormatSpec (what to copy)

Describe it beat by beat, precisely enough to prompt:

```
HOOK (0-3s): the literal first frame · on-screen text verbatim · the hook technique · first-second friction (anything that slows comprehension)
            score the opening against the five first-3-seconds laws
RETENTION: what makes them stay past the hook (the open loop, the withheld reveal)
BEATS: setup -> escalation -> payoff -> loop (the narrative arc + reveal timing)
CRAFT: format (talking-head / before-after / voiceover-broll / GRWM / pov-handheld / screen-rec / text-overlay / lifestyle-broll)
       · lighting (natural-window / ring / soft) · framing (selfie-closeup / medium-eye-level / overhead)
       · styling (polished / casual-messy) · setting · cut rate (continuous vs jump-cut) · motion
AUDIO: spoken vs music vs ambient · does the lack of music carry it · trending sound or original
PROP: the object that carries the idea · the SIGNATURE DEVICE (the one moment the whole video is built around)
PRODUCT: role (hero / proof / helper / background / punchline / cta-only) · when it appears · how integrated · ad-obviousness (native / semi / clearly-ad)
```

Rate each dimension **very-strong / strong / weak** with a four-word reason, like a real teardown. Ground every claim in what is actually visible or audible. Never invent beyond the evidence; lower confidence when frames or audio are missing.

## Part 3: replication instructions

- The reusable **formula**: "X to Y to Z to payoff", the mechanic stated niche-agnostically.
- A **three-part name** for the pattern: concrete object or setup + emotion + mechanism. For example "murky water bottle shock prop" or "7am 7pm mirror cut."
- **What to swap** for the new product: keep the skeleton and the signature device, swap the demo beat. Say exactly which beat changes.
- **Hand off** to the UGC ad director (Seedance) or the Higgsfield director to write the model-ready prompts from this spec.

## Worked example

Input: a hair video, ~4M views, creator has ~30K followers.

Diagnosis:
- Gate 1: ~130x the creator's median. Real breakout, not a big account.
- Gate 2: high comments and shares, organic. Clean.
- Gate 3: remove the product and the transformation still hooks, but the payoff needs it. Product is necessary, role is proof. Mechanic recurs across the hair niche.
- Viral mechanism: a strange "before" state poses a question the viewer needs resolved.
- Labels: none. Strong model.

FormatSpec (compressed):
- HOOK (0-3s): extreme macro of damaged, matted hair, no caption, no face. Hook technique: unresolved visual question. Clears laws 1, 3, 4. No format label.
- RETENTION: one healthy curl released at ~1.5s, full mane withheld.
- BEATS: damaged state -> one curl reveal -> process -> full reveal near the end -> loop back to the before.
- CRAFT: pov-handheld, natural window light, macro framing, casual-messy, bathroom, jump-cut every 5 to 8s, high motion.
- AUDIO: original, no music, ambient water. The silence carries the realism.
- PROP / signature device: the single released curl at 1.5s.
- PRODUCT: role proof, appears around shot 3, native.

Formula: "strange before state -> tease one piece of the payoff -> withhold the full reveal -> deliver late." Name: "matted before, one-curl tease." Swap: replace the curl-release beat with your product's equivalent single-proof moment; keep the withheld full reveal. Hand off to the Higgsfield director.

## Quality checklist (run before you hand off the spec)

- [ ] Judged on creator-baseline (views-per-follower), not raw views
- [ ] All three gates run, viral mechanism named in one sentence
- [ ] False-positive labels applied honestly (or explicitly none)
- [ ] Opening scored against the five first-3-seconds laws
- [ ] Every craft dimension labeled with a four-word reason, grounded in the evidence
- [ ] The signature device named (or flagged absent, which is itself the finding)
- [ ] A niche-agnostic formula, a three-part name, and the exact beat to swap
- [ ] Confidence lowered where frames or audio were not available

## References

- `references/teardown-method.md`: the creator-baseline rule, the three gates, the false-positive labels, the full measured lift tables (hook, framework, emotion, product role, combinations), the dimension stack, and the first-3-seconds laws. This is the insight payload. Read it first.

---
name: lazyreel-format-prompt-builder
description: Turn a brief or a decoded format into a cut-by-cut timeline for a UGC video of any length, from a short ad to a 60-90 second-plus video: the clip order, the per-cut framing and beat, the cut rhythm, and the energy arc, grounded in the validated breakout laws. The cut count follows the length, not a fixed number. Anti-cinematic by design (per-frame novelty comes from cuts and real capture, never lens flares or speed ramps). Use when the user wants a shot list, a video timeline, to plan a sequence, or to turn a FormatSpec into a structure to prompt from. Feeds the lazyreel-ugc-ad-director and lazyreel-higgsfield-director (which write the model prompts) and the lazyreel-video-editor (which executes the cut). Pairs with the LazyReel MCP (breakout_laws, make_brief, niche_report).
---

# LazyReel cut-and-pacing timeline builder

Turn a brief into the **cut-by-cut timeline** for a short-form UGC video: what each clip shows, the order, where the cuts land, and how the energy arcs. This is the structure the director skills prompt from and the editor executes. It is not the model prompt itself and it is not a cinematic effects list.

**Anti-cinematic by design.** On short-form UGC, per-frame novelty comes from **cuts and real capture** (a new framing, a macro insert, a reframe), not from lens flares, speed ramps, bloom flashes, or whip pans. Those read as an ad and lose. If the brief asks for a "cinematic brand film," that is a different product than what wins on the feed; say so and build the UGC-real version. The cut rhythm and the laws are in `references/cut-timeline.md`.

## How it works

1. Take the brief, the FormatSpec from `lazyreel-format-deconstructor`, or a `niche_report` result. If the LazyReel MCP is connected, call `breakout_laws` for the cut-rhythm laws and `make_brief` for the beats.
2. Build the timeline as **one cut (clip) per beat**, as many as the length needs (a 12-15s video is ~3 to 5 cuts, a 60s video is 12 to 18+), each a distinct framing. Never one continuous shot.
3. Output the four sections below, then hand off to a director skill to write the prompts and to the video-editor to cut.

## Output structure (all four sections, in order)

### Section 1: cut-by-cut timeline

Each cut is one clip, one beat, one framing. Clip 1 is the hook.

```
CUT [N] ([timestamp in the final edit, e.g. 0:00-0:03]) | [framing: wide / macro / reframe / insert / pov-handheld]
- BEAT: [what happens in one line]
- FRAME: [the literal opening frame of this cut: subject, expression, hands, light, background]
- WHY: [the law or lift this cut serves, e.g. "unresolved question (law 1)" or "before-after hook (2.3x)"]
- CUT TO: [how it hands to the next clip]
```

Rules:
- One cut per beat, as many as the length needs (~3 to 5 for a 10-15s video, 12 to 18+ for a 60s one). Cut every 1.5 to 3 seconds in the first half regardless of total length.
- Clip 1 opens on an unresolved visual question, front-loads charge, and carries no title card or format label.
- Name the SIGNATURE DEVICE: the one cut the whole video is built around.
- Product enters as a helper in the middle cuts, named late. The final cut delivers the withheld payoff, then a hard end.
- Describe the visual result, not an editing technique. Say "macro insert of the texture," not "keyframed scale in After Effects."

### Section 2: cut and framing inventory

A numbered list of the framings and real-capture moves used (macro insert, reframe, pov-handheld, two-shot, hands-only), how many times each appears, and its role. This is the palette. It contains cuts and framings, not cinematic effects.

### Section 3: cut-rhythm density map

Break the timeline into 3 to 5 second segments and rate the cut density:
- **HIGH** = a cut every 1.5 to 2s (the hook and any rapid-fire beat)
- **MEDIUM** = a cut every 2 to 3s
- **LOW** = a held shot of 3 to 5s (use sparingly, only once the viewer is committed)

```
[timestamp range] = [DENSITY] ([cuts in the segment], [count] in [duration])
```

Per-frame novelty was one of the two strongest things we measured, so the first half should run HIGH. A single held clip across the whole video is the failure mode.

### Section 4: energy arc (the laws, as a structure)

Map the arc to the breakout structure, not a generic three-act:
- **Hook (clip 1):** the unresolved opening that earns the next second.
- **Escalation (the middle clips, as many as the script has):** the problem agitated, the switch shown, the product entering as a helper. A long video spends its extra length here, on more escalation beats, not on filler.
- **Payoff (final clip):** the reveal the hook teased, then a hard end. No drawn-out CTA.

## Creative principles (the breakout version)

1. **Cuts, not effects.** Novelty comes from a new framing every cut. No lens flare, speed ramp, bloom, whip pan, or color grade.
2. **The opening is the whole game.** Clip 1 against the five laws. If the first 3 seconds do not earn the watch, nothing downstream matters.
3. **Signature device.** Every video is built around one moment. Name it; the others support it.
4. **Contrast in rhythm.** A held beat after rapid cuts hits harder, but earn it. Front-load the cuts.
5. **Sound-off first.** The hook must land as a burned caption with no audio. Write clip 1's beat caption-first.
6. **It must resolve.** End on the payoff, a hard cut, not a logo card.

## Duration calibration (any length)

The skill scales to whatever length the brief asks for. One cut per beat, density HIGH in the first third at every length.

- **8 to 12s:** 3 to 4 cuts, one signature device.
- **12 to 20s:** 4 to 6 cuts, room for one held beat, one signature device.
- **20 to 45s:** 8 to 14 cuts. One signature device plus 1 to 2 supporting moments. Plan an escalation ladder so the middle does not sag.
- **45 to 90s+:** 14 to 25+ cuts. Structure it as chapters (hook, then 2 to 4 escalation movements, then payoff), each with its own mini-arc, all serving one through-line. Hand the director skill a continuity plan (Higgsfield video-extend for a single continuous subject, reference-to-video for distinct framings) so the creator and setting hold across the whole length.
- Default to 12 to 15s if unspecified.

## Worked example

Brief: trail-running shoe, single runner, 14s, "feel real not polished."

- CUT 1 (0:00-0:03) macro, hands lacing a muddy shoe, no face. WHY: unresolved question (law 1), faceless+handheld (10.5x). CUT TO: hard cut on the first stride.
- CUT 2 (0:03-0:07) pov-handheld, feet hitting trail, fast. WHY: per-frame novelty, motion. Product visible as helper.
- CUT 3 (0:07-0:11) reframe to the runner's face mid-effort, one line of audio. WHY: emotional charge (law 5).
- CUT 4 (0:11-0:14) macro of the clean shoe back home, a knowing look, hard end. WHY: withheld payoff, no CTA card.

Signature device: the muddy-to-clean shoe bookend. Density: 0-7s HIGH, 7-14s MEDIUM. Hand to the ugc-ad-director (or higgsfield-director) to write the four clip prompts, then to the video-editor.

## Quality checklist

- [ ] One cut per beat, as many as the length needs (more for longer videos), never one continuous shot
- [ ] Clip 1 opens on an unresolved question, no title card or format label
- [ ] Every cut has a framing, a beat, a why (a law or lift), and a cut-to
- [ ] Signature device named
- [ ] No cinematic effects (lens flare, speed ramp, bloom, whip pan, color grade)
- [ ] Cut-rhythm density HIGH in the first half
- [ ] Product enters as a helper, payoff last, hard end, no CTA card
- [ ] Handed to a director skill for prompts and the video-editor for the cut

## References

- `references/cut-timeline.md`: the cut-rhythm laws, the framing vocabulary, and what over-indexes, as timeline directives. Read it first.

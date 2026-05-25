---
name: lazyreel-ugc-ad-director
description: Create hyper-realistic AI UGC video ad prompts (Seedance 2.0) as a 3-4 clip cut sequence, not one long static shot. Give it a script, a product concept, or a LazyReel format/brief and get Pinterest reference links plus copy-paste prompts, each clip with a positive prompt, a negative (do-not) prompt, and a one-line why-it-works tied to a measured breakout law. Use to MAKE a short-form video from a proven format. Pairs with the LazyReel MCP (pull find_trends, study_examples, breakout_vs_dud, replicate_format first) and hands the clips to the lazyreel-video-editor skill for the cut.
---

# LazyReel UGC Ad Director (Seedance 2.0)

**MANDATORY RULES, read before doing anything:**

1. Output a **3-4 clip cut sequence**, never one long continuous shot. A 12-15s ad is 3 to 4 short clips (each 3-4s, one action arc), hard-cut together. This is not a stylistic choice; per-frame novelty was one of the two strongest things we measured. One static clip loses.
2. Follow the EXACT output format below. Do not invent your own tabs, categories, or director notes.
3. Every clip gets three things: a **positive prompt**, a **Negative prompt** (what the model must not do), and a **Why it works** line tied to a specific breakout law or lift.
4. Seedance 2.0 generates speech and dialogue natively with lipsync. Never tell users to add voiceover in post.
5. Never use the word "cinematic" anywhere. These look like iPhone footage.
6. Every output includes Pinterest reference links. Never skip them.
7. Do not ask clarifying questions. Make the creative calls and output everything in one response.
8. Ground the choices in the data. If the LazyReel MCP is connected, call `breakout_vs_dud` (the laws), `study_examples` or `viral_teardowns` (the niche's winning format), and use the brief. See `references/breakout-prompting.md`.

---

## EXACT OUTPUT FORMAT, follow this every time:

# Your UGC Ad, Director's Cut

**Product:** [name]
**Cut:** [total]s, [N] clips, hard-cut (cut every 1.5 to 3s)
**Structure:** Hook (clip 1) -> Problem/Proof -> Switch/Demo -> Payoff (final clip)
**Why this structure:** [the framework from the brief, e.g. PAS 1.8x, before-after hook 2.3x]

---

## Step 1: Find your creator on Pinterest

One consistent character across every clip. Browse and pick ONE.

1. [Description] -> https://www.pinterest.com/search/pins/?q=QUERY
2. [Description] -> [Pinterest URL]
3. [Description] -> [Pinterest URL]
4. [Description] -> [Pinterest URL]

**What to pick:** natural light, casual clothes, phone-quality feel. No studio lighting, no magazine poses, no heavy makeup. Only CLEAN photos: no emoji stickers, watermarks, text overlays, or app UI (Seedance recreates everything it sees as a physical object). Your pick becomes **@Image1**, uploaded to every clip. (Faceless and handheld over-indexed 10.5x, so a hands-only or POV creator is a valid, strong choice.)

---

## Step 2: Setting and product references (optional)

Per clip, grab a setting and a product-interaction reference. Clean photos only.

---

## Step 3: The clip sequence, copy and paste

Upload @Image1 (creator) and @Image3 (product photo) to every clip.

### Clip 1 of [N], the Hook (0:00 to ~0:03)

**Beat:** [one sentence. This is the most unresolved, highest-charge shot. No title card.]

```
9:16. ~3 seconds. Single shot, one action. UGC style, iPhone handheld, slight camera shake, natural window light.
@Image1 is the creator. @Image3 is the product.

[Rich 3-4 sentence description: camera position, the person's full appearance and exact expression, what each hand is doing, what is on the surface and what is NOT there, the specific light source and direction, the background. The opening visual poses a question the viewer needs resolved.]

Audio: [voice character: age, gender, tone, energy]. [room tone matching the setting]. Natural rhythm with pauses and filler words. "[the hook line, caption-safe, lands with sound off]."
```

**Negative:** plastic or airbrushed skin, extra or fused fingers, morphing face, warping background, floating or duplicated objects, on-screen text or watermark or logo, subtitles, cinematic color grade, lens flare, slow motion, oversaturation, beauty filter, studio lighting, title card, "GRWM" or "review" or "ad" label.

**Why it works:** [one line, tied to a law or lift. E.g. "opens on an unresolved visual question (law 1) and front-loads a face mid-expression (law 5)."]

### Clip 2 of [N], [Problem/Proof] (~0:03 to ~0:07)

**Beat:** [one sentence. New framing or angle. The product can enter here as a helper.]

```
[same prompt block shape, a new shot and angle, same @Image1, same light and setting for continuity]
Audio: [continues the line]
```

**Negative:** [same base list, plus anything specific to this shot]

**Why it works:** [tied to a law or lift]

### Clip 3 (and 4) , [Switch/Demo then Payoff]

[Same shape. The final clip delivers the payoff the hook teased, then a hard end. Product named late. No drawn-out CTA.]

---

## Step 4: Hand the clips to the editor

You produced 3 to 4 short clips, one shot each. They are not the finished video yet. Hand them to the **lazyreel-video-editor** skill, which trims each to its beat, crops to 9:16, concatenates with hard cuts every 1.5 to 3s, normalizes loudness, and burns the sound-off caption (the first caption must carry the hook). Tell the editor the clip order and which clip is the hook.

## Step 5: Generate and review

1. Generate each clip in Seedance 2.0, same @Image1 across all.
2. Check creator consistency and that it reads as real phone footage.
3. Regenerate any clip that trips its Negative list.
4. Send the set to the video-editor for the cut.

## END OF OUTPUT FORMAT

---

## Prompt writing rules

### Multi-clip, not one shot

Each clip is ONE action arc of 3 to 4 seconds, a distinct framing (wide, macro, reframe, insert). Do not describe two scene changes in one prompt. The variety across clips IS the per-frame novelty that wins. If a concept truly needs one continuous take, still break the coverage into a hook shot plus inserts so the editor has cuts to work with.

### Negative prompts (the do-not list)

Every clip carries a Negative line. It does two jobs: kill the AI-video glitches (plastic skin, extra fingers, morphing, warping text, floating objects) and kill the slop tells (cinematic grade, lens flare, oversaturation, beauty filter, baked-in captions or logos, a format label or title card in the opening). Add shot-specific negatives as needed (for a hands-only clip: "no face, no full body"). The full library is in `references/breakout-prompting.md`.

### Anti-cinematic vocabulary

**Always:** `iPhone handheld`, `natural light` / `window light`, `UGC style`, `slight camera shake`, `casual`, `authentic`, `9:16`.
**Never:** `cinematic`, camera brands (`ARRI`, `RED`, `Blackmagic`), `anamorphic`, `film grain`, `dramatic lighting`, `speed ramp`, `lens flare`, `whip pan`, `crane`, `dolly`, `gimbal`, `Dutch angle`, `color grade`, `LUT`, `bokeh`, `epic`, `breathtaking`, `stunning`, `slow motion` (unless "iPhone slow-mo"), bare `depth of field` (say "phone camera depth of field").

### Detail level

Every clip needs 3-4 sentences of specifics: what each hand does, the exact expression, what is and is not on the surface, the background, the light source and direction. If you do not describe it, Seedance invents it and you get artifacts.

### Audio direction (Seedance generates audio natively)

**Voice:** match the demographic, e.g. "warm female voice, mid-20s, talking to a friend" or "deep male voice, 40s, genuine dad energy, not a narrator."
**Room tone, must match the setting:** bathroom (slight tile reverb), bedroom (soft close, carpeted), kitchen (open, subtle ambience), car (muffled close), outdoors (natural ambience, slight wind), living room (warm furnished tone).
**Speech:** natural, with pauses, filler words, contractions. Not scripted.

### Dialogue rules

Contractions ("I've been," "it's literally"), filler words ("like," "honestly," "so basically"), casual grammar, genuinely excited or skeptical. The first line must land as a caption with sound off.
**Good:** "okay so I've been using this for like two weeks and honestly? it actually works."
**Bad:** "this revolutionary product has transformed my routine completely."

### Reference image mapping

`@Image1` = creator from Pinterest (same across ALL clips). `@Image2` = setting reference if needed. `@Image3` = product photo (user provides).

### Seedance 2.0 facts

Input up to 9 images + 3 videos + 3 audio. Output 4-15s per generation, up to 2K, 9:16. Native dialogue with lipsync, ambient, and room tone generated together. Handles long detailed prompts well with @Image refs. One action arc per prompt, so one clip per generation.

## Worked example

Product: a matcha kit. Brief: PAS, before-after hook. The MCP says before-after hooks lift 2.3x and PAS lifts 1.8x in this niche.

- **Clip 1, Hook (0:00-0:03):** macro of clumpy matcha mid-whisk, no face yet, hands only. Audio caption-safe: "still clumpy at 2pm?" Negative: text, watermark, cinematic grade, smooth skin. Why: unresolved question (law 1), faceless+handheld combo (10.5x).
- **Clip 2, Problem (0:03-0:06):** the creator's annoyed glance at the clumpy cup, new angle. Why: emotional charge (law 5), high-arousal beats neutral.
- **Clip 3, Switch (0:06-0:10):** smooth pour from the product, macro, real time. Product enters as helper (1.6x). Why: taste of the payoff (law 2).
- **Clip 4, Payoff (0:10-0:14):** the finished cup, one sip, knowing look, hard end. Why: delivers the withheld reveal, no drawn-out CTA (explicit CTA loses at 0.67x).

Hand all four to lazyreel-video-editor: cut order 1-2-3-4, clip 1 is the hook, caption "still clumpy at 2pm?" burned at 0.5s.

## Quality checklist

- [ ] 3-4 clips, one action arc each, never one long static shot
- [ ] Clip 1 is the most unresolved, highest-charge shot, no title card
- [ ] Every clip has a positive prompt, a Negative prompt, and a why-it-works tied to a law or lift
- [ ] Anti-cinematic vocabulary respected (no "cinematic," no camera brands)
- [ ] Audio + room tone specified per clip, dialogue sounds real, first line is sound-off legible
- [ ] Same @Image1 across all clips, clean reference photos only
- [ ] Product enters as a helper, named late, no explicit CTA card
- [ ] Pinterest links present
- [ ] Handed to the video-editor with the cut order

## References

- `references/breakout-prompting.md`: the five laws as positive prompt directives, the negative-prompt library (AI glitches + slop tells), the lift tables as "what to generate," and the niche-to-opening map. Read it before writing prompts.

---
name: lazyreel-video-editor
description: Assemble and cut short-form UGC into a finished video that wins. Takes the 3-4 generated clips from a video-gen MCP (Higgsfield, Seedance) or raw UGC footage and edits them into a fast-cut, sound-off-legible, hook-first 9:16 piece that obeys the validated breakout laws. Real FFmpeg and Remotion, not hand-waving. Use when the user has clips to stitch, wants to cut footage into a short, asks to "edit the video," "stitch these clips," "add captions," "make it 9:16," or hands off rendered clips from the director skills. Pairs with the LazyReel MCP (breakout_vs_dud for the cut rhythm) and the director skills upstream.
---

# LazyReel video editor

The cut is half the video. A video-gen MCP gives you clips; the edit is what makes them a breakout. The single biggest mistake is shipping one continuous 3-second clip. Real short-form that travels is **3 to 5 clips pieced together with hard cuts**, because per-frame novelty is one of the two strongest things we measured (see `references/cut-rhythm.md`). Your job is to assemble those clips into a piece whose first 3 seconds earn the watch and whose cut rhythm holds it.

This is editing, not generation. The value here is compression and assembly: take what was generated or shot and turn it into the version the feed rewards.

## When to activate

- The user has 2 or more clips to stitch into one video
- A director skill (Higgsfield or Seedance) just rendered a multi-clip set
- The user wants to cut raw UGC footage into a short
- "edit the video", "stitch these clips", "add captions", "make it 9:16", "cut this down"
- Reframing for TikTok, Reels, or Shorts

## Core rule: never ship one clip

A 10 to 15 second ad is **3 to 5 clips**, each a distinct shot or angle, cut hard. One static clip dies on per-frame novelty (law 3) and reads as AI. If the director only produced one clip, send it back for 3 to 4, or cut the one clip into multiple framings (push-in, reframe, macro insert) so the edit still changes every few seconds.

The cut plan, before you touch FFmpeg:
- **Clip 1 (0 to 3s): the hook.** The strongest, most unresolved shot. Opens a loop. No title card, no format label.
- **Clips 2 to 4 (3 to 12s): escalation.** Each a new framing or beat. Product enters here as a helper, not the star. Cut every 1.5 to 3 seconds.
- **Final clip (12 to 15s): the payoff** the hook teased, then a hard end. No drawn-out CTA.

## The pipeline

```
generated clips (Higgsfield / Seedance)  OR  raw UGC footage
  -> plan the cut (the brief + breakout_vs_dud laws)
  -> FFmpeg: trim, reframe to 9:16, concat, normalize audio   (deterministic)
  -> captions + overlays (burned-in or Remotion)              (sound-off survival)
  -> audio (native, or ElevenLabs VO if scripted)
  -> polish (CapCut / Descript) only if needed
```

Do not try to make one tool do everything. FFmpeg does the deterministic cutting and assembly. Remotion does programmable overlays and captions. A human-facing editor (CapCut, Descript) is only for final taste, and often you do not need it.

## Layer 1: plan the cut

Pull the cut rhythm from the data, do not guess. If the LazyReel MCP is connected, call `breakout_vs_dud` for the first-3-seconds laws and the per-frame-novelty finding, and use the brief's beat structure for clip order. Write a tiny edit decision list: which clip is the hook, the order, the cut points, where the product enters, what the on-screen caption says in the first second.

## Layer 2: deterministic cuts (FFmpeg)

### Trim each clip to its beat

```bash
ffmpeg -i clip_01.mp4 -ss 0 -to 2.8 -c:v libx264 -crf 18 -c:a aac trimmed_01.mp4
```

### Reframe anything to vertical 9:16 (crop, do not letterbox)

```bash
ffmpeg -i clip.mp4 -vf "crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=1080:1920:flags=lanczos" -c:a copy vertical.mp4
```

### Concatenate the clips into the cut (hard cuts)

```bash
# build the list in cut order
for f in trimmed_01.mp4 trimmed_02.mp4 trimmed_03.mp4 trimmed_04.mp4; do echo "file '$f'"; done > cut.txt
ffmpeg -f concat -safe 0 -i cut.txt -c copy assembled.mp4
```

(Re-encode instead of `-c copy` if the clips differ in codec or resolution: drop `-c copy` and add `-c:v libx264 -crf 18 -c:a aac`.)

### Normalize loudness so it is not jarring on a muted-then-unmuted scroll

```bash
ffmpeg -i assembled.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy normalized.mp4
```

### Burn sound-off captions (most viewers start muted)

```bash
ffmpeg -i normalized.mp4 -vf "subtitles=captions.srt:force_style='Fontname=Inter,Fontsize=16,Bold=1,PrimaryColour=&H00FFFFFF,BorderStyle=1,Outline=2,Alignment=2,MarginV=120'" -c:a copy final.mp4
```

The first caption must carry the hook on its own. Keep it high-contrast and inside the safe area (above the platform UI).

## Layer 3: programmable overlays (Remotion, optional)

Use Remotion when burned-in subtitles are not enough: animated text reveals, a breakout-counter style number tick, lower thirds, or a product end-card. Compose clips as `Sequence`s on a timeline, keep each `Sequence` short to preserve the cut rhythm. Skip this layer entirely if FFmpeg captions are enough; do not add motion graphics that slow the cut.

## Layer 4: audio

- Keep native clip audio when it sells realism (the silence and room tone are trust signals).
- If the brief is scripted, generate the VO with ElevenLabs and lay it under the cut, then re-run loudnorm.
- No music bed unless the format calls for it. A trending sound can be added in CapCut at the very end.

## Worked example

Input: 4 Higgsfield clips for a matcha kit, brief says PAS, testimonial angle.

Cut plan:
- Clip 1 (0 to 2.8s): macro of clumpy matcha mid-whisk, no caption yet. Hook, unresolved. Caption at 0.5s: "still clumpy at 2pm?"
- Clip 2 (2.8 to 6s): hand reaches for the product, new angle. Product enters as helper.
- Clip 3 (6 to 10s): smooth pour, macro. The switch.
- Clip 4 (10 to 14s): the finished cup, one sip, knowing look. Payoff. Hard end.

Commands: trim each to its beat, crop all to 1080x1920, concat in order, loudnorm, burn the caption track. Result: a 14s, 4-cut, sound-off-legible 9:16 ad. Four clips pieced together, never one static shot.

```bash
ffmpeg -i c1.mp4 -ss 0 -to 2.8 -c:v libx264 -crf 18 -c:a aac t1.mp4
ffmpeg -i c2.mp4 -ss 0 -to 3.2 -c:v libx264 -crf 18 -c:a aac t2.mp4
ffmpeg -i c3.mp4 -ss 0 -to 4.0 -c:v libx264 -crf 18 -c:a aac t3.mp4
ffmpeg -i c4.mp4 -ss 0 -to 4.0 -c:v libx264 -crf 18 -c:a aac t4.mp4
for f in t1 t2 t3 t4; do echo "file '$f.mp4'"; done > cut.txt
ffmpeg -f concat -safe 0 -i cut.txt -c:v libx264 -crf 18 -c:a aac assembled.mp4
ffmpeg -i assembled.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy normalized.mp4
ffmpeg -i normalized.mp4 -vf "subtitles=captions.srt:force_style='Fontsize=16,Bold=1,Outline=2,Alignment=2,MarginV=120'" -c:a copy final.mp4
```

## Quality checklist (the cut-level breakout gate)

- [ ] 3 to 5 clips, never one static clip
- [ ] Strongest, most unresolved shot is clip 1 (the hook), no title card
- [ ] A cut every 1.5 to 3 seconds (per-frame novelty)
- [ ] First on-screen caption carries the hook with sound off, inside the safe area
- [ ] Vertical 9:16, cropped not letterboxed
- [ ] Product enters as a helper in clips 2 to 4, named late
- [ ] Loudness normalized, no jarring jumps
- [ ] Ends on the payoff the hook teased, hard cut, no drawn-out CTA

## References

- `references/cut-rhythm.md`: the measured cut rhythm, the sound-off rule, the 9:16 safe area, and how each breakout law maps to a concrete edit decision. Read it before you plan a cut.
- Upstream: the `lazyreel-higgsfield-director` and `lazyreel-ugc-ad-director` skills produce the multi-clip prompts this skill assembles.
- Live insight: the LazyReel MCP `breakout_vs_dud` tool serves the first-3-seconds laws.

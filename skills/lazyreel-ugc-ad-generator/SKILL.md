---
name: lazyreel-ugc-ad-generator
description: Generate multi-shot UGC video ads for DTC brands and creative agencies using Seedance 2.0 via the fal.ai API. Auto-writes UGC dialogue and shot lists from a product image plus an ad angle (unboxing, testimonial, lifestyle demo, problem-solution, before-after, or freeform), fires prompts to Seedance, downloads every clip, and stitches them into one finished vertical ad with ffmpeg. Use whenever the user wants to create a UGC ad, generate UGC video, make a TikTok/Reels/Meta video ad, turn a product photo into video, clone a UGC ad, or make creator-style video content for a DTC brand. Also trigger on phrases like "make me a UGC video ad," "generate a Seedance ad," "UGC from this product," or when the user drops a product image and asks for a video ad.
---

# LazyReel — UGC Ad Generator (Seedance 2.0 + fal.ai)

Generates multi-shot UGC video ads for DTC brands using Seedance 2.0 on fal.ai. One product image plus one ad angle produces a finished vertical ad with hook, demo, and CTA — ready to upload to Meta, TikTok, or Reels.

## Where to run this skill

**Recommended: Claude Code.** Runs on the user's machine with full network access. No sandbox, no allowlist, no workarounds needed. Every pattern in this skill works out of the box.

**Also works: Claude Cowork** — with specific setup (see "Cowork setup" section below). The sandbox blocks several fal.ai hosts by default and requires an allowlist configuration + session restart.

**Does not work: Regular Claude chat.** No code execution, no file system, no API calls to fal.ai.

## What this skill does

1. Takes a product image and an ad angle from the user
2. Optionally reads `brand/brand-dna.md`, `brand/brand-voice.md`, `brand/icp-cards.md` if they exist (skips silently if not)
3. Writes a multi-shot UGC script with dialogue, shot direction, and pacing
4. Fires each shot to Seedance 2.0 via fal.ai using the appropriate endpoint (image-to-video for first-frame shots, reference-to-video for character-consistency shots)
5. Downloads every generated clip into an organized folder
6. Stitches the clips together with ffmpeg into one finished vertical ad
7. Returns both the stitched ad and the individual clips

## Before you start — required setup

### API key
The user needs ONE of these ready:

- **`.env` file** in the working directory with `FAL_KEY=<their-fal-api-key>` — preferred
- **Environment variable** `FAL_KEY` exported in shell

If neither is present, open `.env` and guide the user to paste their key there. Never ask them to paste the key into the chat.

Get the key: [fal.ai](https://fal.ai) → Settings → API Keys → Create key. Load credits (Seedance 2.0 at 720p is ~$0.30/second — a 15-second ad runs ~$4.50; reference-to-video with video refs is 40% cheaper).

### Python dependencies
```bash
pip install fal-client python-dotenv requests
```

### ffmpeg
Check ffmpeg is installed:
```bash
ffmpeg -version
```

If missing:
- macOS: `brew install ffmpeg`
- Ubuntu/Debian: `sudo apt install ffmpeg`
- Windows: download from [ffmpeg.org](https://ffmpeg.org) and add to PATH

### Cowork setup (only needed if running in Cowork)

The Cowork sandbox blocks fal.ai's CDN and queue hosts by default. Without this setup, uploads fail, downloads fail, and `fal_client.subscribe` hangs.

**1. Add these domains to your project's allowlist:**

Project Settings → Network egress → Additional allowed domains. Add as wildcards:
- `*.fal.media` (for output MP4 downloads)
- `*.fal.ai` (for the upload handshake host)
- `*.fal.run` (covers `fal.run` AND `queue.fal.run`)
- `storage.googleapis.com` (some outputs route through GCS)

**2. Restart the Cowork session.**

Allowlist changes DO NOT hot-reload. End the session entirely (don't just close the tab — end it from the menu) and start a new one in the same project. The sandbox proxy loads its ruleset at session start.

**3. In Cowork, use the sync endpoint — not `fal_client.subscribe`.**

`fal_client.subscribe` polls `queue.fal.run` under the hood. Even with the allowlist configured correctly, the queue endpoint behaves unreliably in Cowork's sandbox. Use a direct POST against the sync endpoint instead:

```python
import requests
import os

response = requests.post(
    "https://fal.run/bytedance/seedance-2.0/reference-to-video",
    headers={
        "Authorization": f"Key {os.getenv('FAL_KEY')}",
        "Content-Type": "application/json",
    },
    json=arguments,
    timeout=180,  # sync endpoint holds the connection until done
)
result = response.json()
```

The sync endpoint blocks until the video is ready (~60-120 seconds for a 5-sec clip) and returns the same response shape as the queue endpoint. In Claude Code, `fal_client.subscribe` works fine — the issue is Cowork-specific.

**4. For image upload in Cowork, use the direct HTTP endpoint:**

`fal_client.upload_file` routes through hosts that sometimes aren't covered by the allowlist cleanly. Use the direct storage upload instead:

```python
import requests

with open(image_path, "rb") as f:
    r = requests.post(
        "https://fal.run/storage/upload",
        headers={"Authorization": f"Key {os.getenv('FAL_KEY')}"},
        files={"file": f},
        timeout=60,
    )
image_url = r.json()["url"]
```

## Workflow

### Step 1 — Intake

Collect from the user:

1. **Product image** — file path on their machine (required)
2. **Ad angle** — one of these presets, or freeform:
   - `unboxing` — 3 shots (reveal → close-up detail → wear/use shot)
   - `testimonial` — 4 shots (hook/pain → product intro → benefit → CTA)
   - `lifestyle-demo` — 5 shots (environment → product intro → 2 use-case shots → wrap)
   - `problem-solution` — 4 shots (problem → reveal product → demo → result/CTA)
   - `before-after` — 3 shots (before state → product reveal → after state)
   - `hold-and-show` — 3 shots (hook/pickup → product detail rotation → smile-and-CTA). Safest angle for products Seedance struggles with (see category guidance below).
   - or freeform (user describes the angle in plain English, you infer shot count and structure)
3. **Product name + one-line description** — optional but makes dialogue sharper. If not provided, infer from the image.
4. **Target duration per clip** — default `"5"` seconds per shot (string, not int). Seedance supports `"4"`–`"15"` or `"auto"`.

Do NOT ask about every option at once. Ask in a natural conversational way — typically just product image + angle in the first turn, then details once you know the angle.

### Category guidance — when to steer the user toward safer angles

Some product categories are harder for Seedance 2.0 to render convincingly. If the user asks for a risky angle in one of these categories, suggest a safer alternative instead of blindly generating it:

**Makeup and skincare application** — Seedance regularly hallucinates:
- Color appearing on hands, lips, or clothing when it should only be on the face
- Pre-existing makeup marks that weren't in the reference image
- Application to the wrong body part (lip product shown applied to cheeks, cheek product shown applied to lips)

For cream blush, lipstick, foundation, serums, or anything the creator would physically apply to themselves, steer toward:
- `hold-and-show` — she holds the product, rotates to show the shade/packaging, talks about it. No application.
- "Finished-look" freeform — she already has the product on (matched to the reference image color), holds the product, talks about why she loves it. Skip the application entirely.
- "Swatch-on-hand" freeform — she swatches the product on the back of her hand to show color payoff. No face involvement.

If the user INSISTS on an application angle, write very restrictive prompts: describe the exact starting state ("clean face, no makeup, even skin tone"), specify the exact application location ("applies to the apple of her left cheek only, twice, then sets the product down"), and explicitly negate everything you don't want ("no color on hands, no color on lips, no pre-existing blush, no smudges on clothing"). Expect to regenerate once or twice.

**Other risky categories that need similar care:**
- Food being eaten (the model handles "holding a snack" fine but struggles with chewing/swallowing)
- Tight text rendering on small packaging (use 720p+ and keep product at mid-to-close distance in frame)
- Small supplement capsules or pills (often morph between shots)
- Multi-step physical routines (opening a bottle, pouring, drinking in one shot — split into separate shots)

### Step 2 — Check for brand context (optional)

Look for these files in the working directory:
- `brand/brand-dna.md`
- `brand/brand-voice.md`
- `brand/icp-cards.md`

If any exist, read them silently and use them to inform dialogue voice and ICP targeting. Do NOT mention to the user that you found or read them. If none exist, proceed without — this skill works with just a product image.

### Step 3 — Choose the mode for each shot

Seedance 2.0 has three endpoints. Pick per-shot:

| Shot type | Best mode | Why |
|---|---|---|
| First shot (establishing/product reveal) | `image_to_video` | Product image IS the first frame — maximum fidelity to the actual product |
| Shots 2+ needing the SAME creator from shot 1 | `reference_to_video` with `video_urls=[shot_1.mp4]` + `image_urls=[product.jpg]` | Passes shot 1's output as `@Video1` and the product as `@Image1`, locking character + product across the ad. ALSO 40% cheaper. |
| Before-after transition in a single shot | `image_to_video` with `end_image_url` | Seedance transitions from first frame to last frame — perfect for before/after ads |
| Pure lifestyle shots with no product in frame | `text_to_video` | No visual reference needed — but use sparingly, less fidelity |

Default pattern for a multi-shot UGC ad:
- Shot 1: `image_to_video` with product image as first frame
- Shots 2 through N: `reference_to_video` with `image_urls=[product]` and `video_urls=[shot_1_output]`

This gives you character consistency AND cuts cost by 40% on shots 2+.

### Step 4 — Write the shot list + dialogue

For the chosen angle, write a shot list in this structure:

```
Shot 1/N — [Shot name, e.g., "Hook close-up"]
Mode: image_to_video | reference_to_video | text_to_video
Visual: [what's happening on screen — subject, framing, action, lighting]
Dialogue: [what the creator says, kept tight — ~3 words per second of screen time]
Prompt: [full prompt to send to the model — see references/prompting.md]
References: [which images/videos/audio are passed, and how they're referenced in the prompt using @Image1, @Video1, @Audio1]
```

Critical dialogue rules:
- UGC voice — conversational, not scripted. "Bro, these just came in" not "Introducing our new product."
- First line must be a hook that works without sound (captions will carry it on Meta/TikTok autoplay)
- Product name appears in shot 2 or 3, NOT shot 1
- CTA is implicit ("link in bio") or punchy ("you need this"), never "shop now" or "buy today"
- If `brand/brand-voice.md` was loaded, mirror its sentence patterns and word list

Critical reference syntax (reference-to-video only):
- You MUST reference each image/video/audio in the prompt using `@Image1`, `@Image2`, `@Video1`, `@Audio1`, etc.
- Example: `"The same woman from @Video1 now holds @Image1 up to the camera and says 'Seriously, try this.'"`
- If you don't reference them, Seedance may ignore them

Show the user the shot list + dialogue and ask for approval before firing to the API. This is the step where they either green-light or redirect — it's much cheaper to revise dialogue than regenerate videos.

### Step 5 — Build the manifest

Create a `manifest.json` at `outputs/<project-name>/manifest.json`:

```json
{
  "project_name": "mr-paid-social-sneakers",
  "output_dir": "outputs/mr-paid-social-sneakers",
  "shots": [
    {
      "shot_number": 1,
      "mode": "image_to_video",
      "prompt": "...",
      "image_url": "https://v3b.fal.media/...",
      "duration": "5",
      "resolution": "720p",
      "aspect_ratio": "9:16",
      "generate_audio": true
    },
    {
      "shot_number": 2,
      "mode": "reference_to_video",
      "prompt": "The same creator from @Video1 now holds @Image1 up... ",
      "image_urls": ["https://v3b.fal.media/..."],
      "video_urls": ["<will be filled after shot 1 completes>"],
      "duration": "5",
      "resolution": "720p",
      "aspect_ratio": "9:16",
      "generate_audio": true
    }
  ]
}
```

Key details:
- `duration` is a **string** (`"5"` not `5`) — fal.ai rejects integers
- For shots 2+ using character consistency, you'll need to run shot 1 first, then fill in `video_urls` with shot 1's output URL before running shot 2+. Either do this in two passes, or use a simpler structure where every shot references only the product image (no character continuity, but simpler).

### Step 6 — Upload product image to fal.ai

Before building the manifest, upload the user's local product image:

```python
import fal_client
url = fal_client.upload_file("/path/to/product.jpg")
print(url)  # use this URL in the manifest
```

### Step 7 — Generate clips

Use `scripts/generate.py`:

```bash
python scripts/generate.py --manifest outputs/<project>/manifest.json
```

The script uses the official `fal-client` Python package, submits shots in parallel (up to 5 concurrent), and downloads each finished MP4 to `outputs/<project>/clips/shot-N.mp4`.

Handle failures:
- If a generation fails, retry once with a slightly reworded prompt
- If it fails twice, flag it and ask the user whether to skip or adjust the prompt further
- Common failure: passed `duration` as integer instead of string → fix and retry
- Common failure: image URL expired mid-generation → re-upload with `fal_client.upload_file()` and retry

Track costs as the script reports them. After all shots complete, tell the user the running total.

### Step 8 — Stitch with ffmpeg

Use the script at `scripts/stitch.sh`:

```bash
./scripts/stitch.sh outputs/<project>/clips outputs/<project>/final-ad.mp4
```

The script handles:
- Concat with re-encode (safer than stream copy when clips have different encodings)
- 9:16 vertical output (1080x1920) for UGC to Meta/TikTok/Reels
- Audio track preserved from the generated clips

### Step 9 — Deliver

Present three things to the user:
1. Path to the finished stitched ad
2. Paths to individual clips (so they can re-stitch or remix)
3. The full shot list + dialogue as a `shot-list.md` file (so they can iterate next time)

## File structure this skill produces

```
outputs/<project-name>/
├── shot-list.md          # approved script for this run
├── manifest.json         # metadata + prompts + results + costs
├── clips/
│   ├── shot-1.mp4
│   ├── shot-2.mp4
│   └── shot-N.mp4
└── final-ad.mp4          # stitched output
```

## References

- `references/fal-api.md` — exact fal.ai API schemas for all three Seedance 2.0 endpoints, auth, pricing, file upload, response shape, parallel generation pattern
- `references/prompting.md` — how to write Seedance prompts that actually work (structure, UGC modifiers, `@Image1`/`@Video1` reference syntax, common failure modes)
- `references/angles.md` — detailed shot-by-shot breakdowns for each preset angle
- `scripts/stitch.sh` — ffmpeg concatenation script
- `scripts/generate.py` — Python helper using the official `fal-client` package

## Honest limits

- Seedance 2.0 is one of the more expensive video models — ~$0.30/sec at 720p. Budget $2–$5 per 15–20 second ad. Reference-to-video with video refs is $0.18/sec (40% cheaper) — use this for shots 2+ in a multi-shot ad.
- Text rendering is unreliable below 720p. If the product has text on packaging, use 720p+ or expect some garbled text.
- Dialogue audio generated by Seedance is solid but not always perfect. For highest quality, set `generate_audio: false` and dub in ElevenLabs afterward (audio generation is free anyway — cost is the same either way — so keep it on unless you specifically want a clean silent clip).
- Character consistency across shots requires the reference-to-video pattern: pass shot 1's output as `@Video1` AND the product image as `@Image1`. Just passing the product image is NOT enough for character consistency.
- Reference-to-video limits: max 9 images, 3 videos, 3 audio clips, 12 files total across all modalities.

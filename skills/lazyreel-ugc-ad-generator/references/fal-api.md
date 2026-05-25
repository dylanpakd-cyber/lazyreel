# fal.ai API: Seedance 2.0

This skill uses three fal.ai endpoints for Seedance 2.0. All three share the same auth, response format, and pricing structure.

## Authentication

All requests need this header:
```
Authorization: Key <FAL_KEY>
```

Load the key from `.env` or environment, never hardcode and never pass through chat.

## The three endpoints

| Mode | Endpoint | Use case |
|---|---|---|
| Image-to-video | `https://fal.run/bytedance/seedance-2.0/image-to-video` | Your image IS the literal first frame; Seedance animates from it |
| Reference-to-video | `https://fal.run/bytedance/seedance-2.0/reference-to-video` | Up to 9 image refs + 3 video refs + 3 audio refs, reference them in the prompt with `@Image1`, `@Video1`, `@Audio1` |
| Text-to-video | `https://fal.run/bytedance/seedance-2.0/text-to-video` | No visual input, pure prompt (fallback when user has no product image) |

**Note:** There is no separate "Pro" tier on fal.ai, this IS Seedance 2.0. The `/pro/` path from older docs does not exist. Use the three endpoints above.

## Pricing: real numbers

Seedance 2.0 is expensive. Budget accordingly.

| Resolution | Per-second cost | 5-sec clip | 15-sec clip |
|---|---|---|---|
| 720p (text-to-video) | $0.3034/sec | $1.52 | $4.55 |
| 720p (image-to-video) | $0.3024/sec | $1.51 | $4.54 |
| 720p (reference-to-video, image refs only) | $0.3024/sec | $1.51 | $4.54 |
| 720p (reference-to-video WITH video refs) | $0.1814/sec | $0.91 | $2.72 |

The video-reference discount (40% off) is significant. If you're doing multi-shot character consistency (passing shot 1's output video as a reference for shot 2), it's both better quality AND cheaper than always regenerating from just the product image.

480p is roughly half the cost of 720p. 1080p is roughly double. fal.ai posts current rates at [https://fal.ai/models/bytedance/seedance-2.0/image-to-video](https://fal.ai/models/bytedance/seedance-2.0/image-to-video), check before the first run if it's been a while.

## Install the Python client

fal.ai has an official Python client that handles queueing, polling, and result retrieval. Use it:

```bash
pip install fal-client python-dotenv
```

The client picks up `FAL_KEY` from the environment automatically.

## Using the client

### Image-to-video

```python
import fal_client

result = fal_client.subscribe(
    "bytedance/seedance-2.0/image-to-video",
    arguments={
        "prompt": "Selfie-style, a 25-year-old woman holds the product box toward the camera in her bedroom. Morning light. She says 'Bro, these just came in.' UGC style, iPhone quality, handheld.",
        "image_url": "<fal url from upload>",
        "duration": "5",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    },
    with_logs=True,
)

print(result["video"]["url"])
print(result["seed"])
```

### Reference-to-video (this is where the magic is)

The `@Image1`, `@Video1`, `@Audio1` syntax is how you reference inputs from the prompt. This is how you tell Seedance what each reference is FOR.

```python
result = fal_client.subscribe(
    "bytedance/seedance-2.0/reference-to-video",
    arguments={
        "prompt": "The same woman from @Video1 continues her review in the same bedroom. She holds @Image1 up to the camera and says 'The texture on this is insane.' UGC style, iPhone quality, handheld, vertical 9:16.",
        "image_urls": ["<fal url for product image>"],
        "video_urls": ["<fal url for shot 1 output>"],
        "duration": "5",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    },
    with_logs=True,
)
```

Limits on reference-to-video:
- **Images**: up to 9, max 30MB each, JPEG/PNG/WebP
- **Videos**: up to 3, combined duration 2–15 seconds, combined size under 50MB, resolution between ~480p and ~720p
- **Audio**: up to 3, combined duration under 15 seconds, max 15MB per file, MP3/WAV
- **Total files across all modalities**: max 12
- If audio is provided, at least one image or video reference is also required

### Text-to-video (fallback only)

```python
result = fal_client.subscribe(
    "bytedance/seedance-2.0/text-to-video",
    arguments={
        "prompt": "<prompt>",
        "duration": "5",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    },
    with_logs=True,
)
```

### Parallel generation for multi-shot ads

`fal_client.subscribe` blocks until the result is ready. For multi-shot runs (3–5 shots), use `fal_client.submit` to fire all shots at once, then collect them:

```python
import fal_client
from concurrent.futures import ThreadPoolExecutor

def generate_shot(shot):
    handler = fal_client.submit(
        "bytedance/seedance-2.0/image-to-video",
        arguments=shot["arguments"],
    )
    return {"shot_number": shot["shot_number"], "result": handler.get()}

with ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(generate_shot, shots))
```

A 5-second 720p clip usually takes 40–90 seconds to generate. Running shots in parallel cuts total time roughly 3–5x.

### Cowork sandbox: use sync endpoint instead of fal_client

`fal_client.subscribe` and `fal_client.submit` both route through `queue.fal.run` under the hood, which is unreliable inside Cowork's sandbox even with the host on the allowlist. When running in Cowork, bypass the client and POST directly to the sync endpoint:

```python
import requests
import os

response = requests.post(
    "https://fal.run/bytedance/seedance-2.0/reference-to-video",
    headers={
        "Authorization": f"Key {os.getenv('FAL_KEY')}",
        "Content-Type": "application/json",
    },
    json=arguments,  # same shape as fal_client arguments
    timeout=180,     # holds connection until video is ready
)
response.raise_for_status()
result = response.json()  # {"video": {"url": "..."}, "seed": 42}
```

The sync endpoint holds the HTTP connection open until generation completes (~60-120 seconds for a 5-second clip). Response shape is identical to the client's output. For parallel multi-shot runs from Cowork, fire multiple sync requests from a ThreadPoolExecutor, each thread holds its own long-lived connection.

In Claude Code, use `fal_client.subscribe` as documented above, it's more convenient and the queue endpoint works fine outside the sandbox.

## Parameter reference (shared across endpoints)

### Duration
- Type: string (NOT integer, this catches people)
- Values: `"auto"`, `"4"`, `"5"`, `"6"`, `"7"`, `"8"`, `"9"`, `"10"`, `"11"`, `"12"`, `"13"`, `"14"`, `"15"`
- Default: `"auto"` (model picks based on prompt)
- For UGC shots, use `"5"`, tight enough for punchy pacing

### Resolution
- `"480p"`, cheapest, fine for testing but text on packaging will garble
- `"720p"`, default, good balance
- `"1080p"`, highest quality, ~2x cost

### Aspect ratio
- For UGC going to Meta/TikTok/Reels: `"9:16"`
- For landscape ads (YouTube in-stream, display): `"16:9"`
- `"auto"` lets the model infer from the input image

### generate_audio
- `true` (default), Seedance generates dialogue, SFX, ambient audio
- `false`, silent clip; dub in post (ElevenLabs, music in CapCut)
- **Cost is the same either way**, audio is free to generate, you're paying for the video

### image_to_video extras
- `end_image_url` (optional), if provided, Seedance transitions from `image_url` (first frame) to `end_image_url` (last frame). Great for before/after ads.

## File upload

Product images need to be accessible by URL. Three options:

**Option 1: Use fal_client's upload** (easiest)
```python
url = fal_client.upload_file("/path/to/product.jpg")
```

**Option 2: Upload via HTTP**
```bash
curl -X POST https://fal.run/storage/upload \
  -H "Authorization: Key $FAL_KEY" \
  -F "file=@/path/to/product.jpg"
```
Returns JSON with the upload URL.

**Option 3: Already-hosted image**
If the product image is already on the user's Shopify CDN or similar, pass that URL directly, no re-upload needed.

## Response shape

```json
{
  "video": {
    "url": "https://storage.googleapis.com/..../output.mp4"
  },
  "seed": 42
}
```

The `video.url` is a signed URL, download it to local disk right after the call. Don't save it and expect it to work tomorrow.

```python
import requests
r = requests.get(result["video"]["url"], stream=True, timeout=60)
r.raise_for_status()
with open(dest_path, "wb") as f:
    for chunk in r.iter_content(chunk_size=8192):
        f.write(chunk)
```

## Common failures and fixes

| Failure | Likely cause | Fix |
|---|---|---|
| `422 invalid image_url` | URL expired or malformed | Re-upload via `fal_client.upload_file` and retry |
| `500 generation failed` | Prompt hit safety filter OR model choked | Reword the prompt, remove brand claims that sound medical/promissory, retry |
| `429 rate limited` | Too many parallel calls | Back off 30s, retry with `max_workers=3` instead of 5 |
| Duration error | Passed integer instead of string | Convert: `"duration": str(5)` not `"duration": 5` |
| Reference image ignored | Didn't reference it in prompt | Use `@Image1`, `@Video1`, `@Audio1` explicitly in the prompt text |
| Character morphs across shots | Only passing product image as reference | For shots 2+, also pass shot 1's video URL in `video_urls` and reference it as `@Video1` |

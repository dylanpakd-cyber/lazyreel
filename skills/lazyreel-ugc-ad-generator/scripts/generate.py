#!/usr/bin/env python3
"""
generate.py, Seedance 2.0 multi-shot generator.

Submits multiple shots to fal.ai in parallel, waits for completion, and
downloads the resulting MP4s to a local folder.

Works in both environments:
- Claude Code / local: uses fal_client.subscribe (cleaner, recommended)
- Cowork sandbox: use --sync flag to bypass fal_client and POST directly to
  the sync endpoint (works around queue.fal.run sandbox issues)

Usage:
    python generate.py --manifest path/to/manifest.json
    python generate.py --manifest path/to/manifest.json --sync

manifest.json format:
{
  "project_name": "my-ugc-ad",
  "output_dir": "outputs/my-ugc-ad",
  "shots": [
    {
      "shot_number": 1,
      "mode": "image_to_video",            # or "reference_to_video" or "text_to_video"
      "prompt": "...",
      "image_url": "https://...",          # required for image_to_video
      "image_urls": ["https://..."],       # for reference_to_video (up to 9)
      "video_urls": ["https://..."],       # optional, for reference_to_video (up to 3)
      "audio_urls": ["https://..."],       # optional, for reference_to_video (up to 3)
      "end_image_url": "https://...",      # optional, image_to_video only
      "duration": "5",                     # STRING, not integer
      "resolution": "720p",
      "aspect_ratio": "9:16",
      "generate_audio": true
    },
    ...
  ]
}

Requires:
    pip install fal-client python-dotenv requests
    FAL_KEY set in .env or environment
"""

import argparse
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: pip install requests", file=sys.stderr)
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # optional; env var still works

FAL_KEY = os.getenv("FAL_KEY")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set. Add it to .env or export it.", file=sys.stderr)
    sys.exit(1)


ENDPOINTS = {
    "image_to_video": "bytedance/seedance-2.0/image-to-video",
    "reference_to_video": "bytedance/seedance-2.0/reference-to-video",
    "text_to_video": "bytedance/seedance-2.0/text-to-video",
}


# ---------- Rough cost estimates (720p base; check current on fal.ai) ----------
# text-to-video and image-to-video at 720p: $0.3024–$0.3034/sec
# reference-to-video at 720p with video refs: $0.1814/sec (40% off)
def estimate_cost(shot: dict) -> float:
    res = shot.get("resolution", "720p")
    dur = int(shot.get("duration", "5"))
    has_video_ref = shot.get("mode") == "reference_to_video" and shot.get("video_urls")

    # 720p rates
    if has_video_ref:
        rate_720 = 0.1814
    else:
        rate_720 = 0.3024

    if res == "480p":
        rate = rate_720 * 0.5
    elif res == "1080p":
        rate = rate_720 * 2.0
    else:
        rate = rate_720

    return rate * dur


def build_arguments(shot: dict) -> dict:
    """Turn a shot dict from manifest.json into fal.ai arguments for the endpoint."""
    mode = shot["mode"]

    # Shared params
    args = {
        "prompt": shot["prompt"],
        "duration": str(shot.get("duration", "5")),  # MUST be string
        "resolution": shot.get("resolution", "720p"),
        "aspect_ratio": shot.get("aspect_ratio", "9:16"),
        "generate_audio": shot.get("generate_audio", True),
    }

    if mode == "image_to_video":
        args["image_url"] = shot["image_url"]
        if shot.get("end_image_url"):
            args["end_image_url"] = shot["end_image_url"]

    elif mode == "reference_to_video":
        if shot.get("image_urls"):
            args["image_urls"] = shot["image_urls"]
        if shot.get("video_urls"):
            args["video_urls"] = shot["video_urls"]
        if shot.get("audio_urls"):
            args["audio_urls"] = shot["audio_urls"]

    elif mode == "text_to_video":
        pass  # prompt only

    else:
        raise ValueError(f"Unknown mode: {mode}")

    if shot.get("seed") is not None:
        args["seed"] = shot["seed"]

    return args


def download_video(url: str, dest_path: str) -> None:
    """Stream-download the video to disk."""
    Path(dest_path).parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(dest_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)


def call_fal_sync(endpoint: str, args: dict) -> dict:
    """POST directly to fal.run sync endpoint, bypasses fal_client/queue.
    Used in Cowork environments where queue.fal.run is unreliable."""
    url = f"https://fal.run/{endpoint}"
    r = requests.post(
        url,
        headers={
            "Authorization": f"Key {FAL_KEY}",
            "Content-Type": "application/json",
        },
        json=args,
        timeout=300,  # sync endpoint holds connection until ready
    )
    r.raise_for_status()
    return r.json()


def call_fal_client(endpoint: str, args: dict) -> dict:
    """Standard path via fal_client.subscribe, works outside Cowork."""
    import fal_client
    return fal_client.subscribe(endpoint, arguments=args, with_logs=False)


def process_shot(shot: dict, output_dir: str, use_sync: bool) -> dict:
    """Submit a single shot, wait, download. Returns metadata."""
    n = shot["shot_number"]
    endpoint = ENDPOINTS[shot["mode"]]
    args = build_arguments(shot)

    mode_label = "sync" if use_sync else "fal_client"
    print(f"[Shot {n}] Submitting to {endpoint} via {mode_label}...")
    t0 = time.time()

    try:
        if use_sync:
            result = call_fal_sync(endpoint, args)
        else:
            result = call_fal_client(endpoint, args)

        video_url = result["video"]["url"]
        dest = f"{output_dir}/clips/shot-{n}.mp4"
        download_video(video_url, dest)

        elapsed = int(time.time() - t0)
        print(f"[Shot {n}] ✓ Done in {elapsed}s → {dest}")

        return {
            "shot_number": n,
            "status": "completed",
            "local_path": dest,
            "video_url": video_url,
            "seed": result.get("seed"),
            "elapsed_seconds": elapsed,
        }

    except Exception as e:
        print(f"[Shot {n}] ✗ FAILED: {e}")
        return {
            "shot_number": n,
            "status": "failed",
            "error": str(e),
        }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True, help="Path to manifest.json")
    parser.add_argument("--max-workers", type=int, default=5, help="Parallel shots")
    parser.add_argument(
        "--sync",
        action="store_true",
        help="Use direct fal.run sync endpoint instead of fal_client (required in Cowork).",
    )
    args_cli = parser.parse_args()

    with open(args_cli.manifest) as f:
        manifest = json.load(f)

    shots = manifest["shots"]
    output_dir = manifest["output_dir"]
    use_sync = args_cli.sync

    # If not explicitly using sync, verify fal_client is installed.
    if not use_sync:
        try:
            import fal_client  # noqa: F401
        except ImportError:
            print(
                "fal_client not installed. Either `pip install fal-client` or "
                "re-run with --sync to use the direct endpoint.",
                file=sys.stderr,
            )
            sys.exit(1)

    est_total = sum(estimate_cost(s) for s in shots)

    print(f"Project: {manifest.get('project_name', '(unnamed)')}")
    print(f"Shots: {len(shots)}")
    print(f"Mode: {'sync endpoint' if use_sync else 'fal_client'}")
    print(f"Estimated cost: ${est_total:.2f}")
    print()

    Path(f"{output_dir}/clips").mkdir(parents=True, exist_ok=True)

    results = []
    workers = min(len(shots), args_cli.max_workers)
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(process_shot, s, output_dir, use_sync) for s in shots]
        for fut in as_completed(futures):
            results.append(fut.result())

    results.sort(key=lambda r: r["shot_number"])

    manifest["results"] = results
    manifest["estimated_cost_usd"] = round(est_total, 2)
    manifest["completed_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    with open(f"{output_dir}/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)

    completed = [r for r in results if r["status"] == "completed"]
    failed = [r for r in results if r["status"] == "failed"]

    print()
    print(f"Done: {len(completed)}/{len(shots)} succeeded, {len(failed)} failed")
    if failed:
        print("Failed shots:")
        for r in failed:
            print(f"  Shot {r['shot_number']}: {r['error']}")
        sys.exit(1)

    print()
    print(f"Next step: stitch clips with")
    print(f"  ./stitch.sh {output_dir}/clips {output_dir}/final-ad.mp4")


if __name__ == "__main__":
    main()

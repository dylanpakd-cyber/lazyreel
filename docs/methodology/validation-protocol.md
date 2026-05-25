# Reusable validation protocol

This is the exact procedure used to validate the `breakout_vs_dud` laws, written so an agent can run a new test the same way and produce a number that is comparable to ours. The design goal is a test the hypothesis could fail.

## Principle

A pattern that explains the data it was built on proves nothing. To earn a claim, the pattern must predict an outcome it has not seen, with the answer hidden, against a fair baseline. For a two-video choice the baseline is 50%.

## Step by step

1. **Pick a comparison that isolates one variable.**
   - Concept-matched: two videos with the same niche and same hook pattern, so the idea is constant and only execution varies.
   - Same-creator: two videos by one handle, so the audience is constant. This is the strongest control because follower count cannot leak in.
2. **Control the obvious confounds.**
   - Audience: prefer same-creator pairs.
   - Video age: a low-views video may just be new. Require the lower-views video to be at least as old as the higher-views one. Decode age from the TikTok id: `created_unix = int(video_id) >> 32`.
   - Out-of-sample: do not reuse the pairs the laws were derived from.
3. **Blind it.** Build two files. A public-to-the-predictor file with `{pairId, optionA_vid, optionB_vid}` where A vs B is randomized and view counts are removed. A separate key file with the true winner and the views, never shown to the predictor.
4. **Extract frames.** For each video, download with yt-dlp and cut a dense frame strip with ffmpeg (dense in the first 3 seconds, then evenly across the whole clip). See the extractor pattern below.
5. **Predict blind.** Dispatch a cheap-model sub-agent per small chunk of pairs. It reads each video's frames in time order, scores each option 0 to 5 on how many of the five laws it follows, and picks the higher-views option. It writes `{pairId, prediction, confidence, lawsScoreA, lawsScoreB, reasoning}`. It is told there are no view numbers and must not guess from ids.
6. **Score against the key.** Accuracy vs 50%, a Wilson 95% confidence interval, and a z test (`z = (correct - 0.5n) / (0.5 * sqrt(n))`; above 1.65 is significant at p<0.05). Also report law-margin alignment (did the higher-law-score side win) and a calibration breakdown by margin size.

## The local pipeline

- Frame extractor: `/tmp/dv_frames.sh <video_id> <url>` downloads to `frames/<id>/v.mp4` (reused if cached) and writes `frames/<id>/t_<seconds>.jpg`. Roughly 13 frames per clip.
- Blinding, scoring, and confound checks are short Python scripts run against the `_*.json` and `_*.jsonl` working files under `mcp/data/raw/` and `mcp/data/decoded/` (all gitignored).
- Predictors run as parallel background sub-agents on a cheap model (Sonnet or Haiku), never the orchestrator model, to conserve cost. Roughly 3 pairs per sub-agent keeps each under the image-context ceiling.

## Reading the result honestly

- A high score on extremes (a 100M video vs a 50K video) is easy and partly measures production quality, not just the laws. Weight the controlled tests (same-creator, age-controlled) more.
- Report the confidence interval, not just the point estimate. Small n means a wide interval.
- Inspect every miss. A miss is usually a variable the frames cannot capture (audio trend, creator fame), and naming it is part of the finding.
- Keep the working files local. Only the derived summary (counts, accuracy, the laws) goes into `data/breakout-vs-dud.json` and the docs.

# ADR 0001: A shared intelligence brain for LazyReel and FormatRadar

- **Status:** Accepted
- **Date:** 2026-05-24
- **Decision owner:** Dylan
- **Scope note:** LazyReel is a personal/research project, not a commercial product. License constraints (for example CC-BY-NC research models) gate what we can ship commercially later, not what we can use for research now.

## Context

Two projects overlap. **LazyReel** reverse-engineers what wins in short-form video and produces grounded prompts; it now has a validated prompt-quality and scoring layer (the five first-3-seconds laws at 83% within-creator (blind, the cleanest tier), the 11-level product-proof ladder, and a post-render virality gate). **FormatRadar** does generative reverse-engineering (scrape a viral video, build a FormatSpec, replicate it through a generation API).

The observed problem: FormatRadar's individual prompts are undetailed and unpolished, and their hook-rate is weak. The cause is generating against no quality bar. That bar is exactly what LazyReel built and validated.

The question: turn them into one system, or keep them separate?

## Decision

**Merge the brain, not the binaries.** Keep two product surfaces. Build one shared intelligence layer underneath, consumed by both.

The shared brain has three parts, and each already exists in some form:

1. **One FormatSpec schema.** A structured, shot-by-shot representation of a real video (FormatRadar's deconstruction output). A worked example is the frame-by-frame spec used in the Higgsfield proof.
2. **A pre-generation gate.** The five first-3-seconds laws as a checklist, the 11-level product-proof ladder, and the copy-decision rules. These live in `mcp/data/breakout-vs-dud.json` and are surfaced by the `breakout_vs_dud` MCP tool and the `lazyreel-higgsfield-director` skill. This is what stops a blank-page, unpolished prompt before a credit is spent.
3. **A post-generation gate.** A virality/engagement scorer (today: Higgsfield `virality_predictor`) read against the laws, with a fix loop on whichever law the render failed.

LazyReel's validated layer becomes FormatRadar's missing polish engine. FormatRadar keeps its ingestion and replication runtime.

## Why not fuse the codebases

LazyReel is a clean, shipped MCP plus a documented research notebook with one audience. FormatRadar is a mid-build generative platform with another. Fusing the repositories risks dragging the clean one and blurring two audiences. Two surfaces over one brain keeps each shippable while the intelligence compounds once.

## Consequences

- FormatRadar gains a quality bar it lacked; LazyReel stays the source of truth for what wins.
- The contract to build toward is the FormatSpec schema plus the scoring layer in `breakout-vs-dud.json`, not two diverging prompt engines.
- Any new scorer (a brain-response model, a different predictor) must clear the same bar before we trust it: run it blind on the held-out winner/dud pairs and beat or match the within-creator 83%. A model that predicts something adjacent (brain activity, attention) is a proxy and earns trust only by predicting our actual outcome.
- Because the scope is research, non-commercial-licensed models are usable for benchmarking, but nothing core should depend on a model we could not ship if the scope changed.

## Worked example (the loop, proven once)

Crispy-tacos format (a 154.9M-view winner): its frames were read into a FormatSpec, shot 1 was turned into a locked first-frame image and an image-to-video prompt, rendered on Higgsfield, then scored by `virality_predictor`. The predictor flagged a weak hook (peak at second 5, not the opening), which independently confirmed law 2 (deliver the payoff taste in the first ~1.5s). The fix is front-loading the payoff. Deconstruct, gate, generate, score, fix: the loop is real and self-correcting.

# ABG CMO — decoded insights wiki

Auto-generated from 3,701 real short-form videos decoded by the pipeline. This is derived analysis (no source video content). Regenerate with `node pipeline/build-wiki.mjs`.

## The connection map

Which hook patterns over-perform in which niches. A pattern wired to several niches is a cross-niche winner; a pattern unique to one niche is a niche-specific edge. (Edge labels = lift among breakouts.)

```mermaid
graph LR
  N_abg-beauty["ABG beauty"]:::niche
  N_fitness["fitness"]:::niche
  N_supplements["supplements"]:::niche
  N_skincare["skincare"]:::niche
  N_food-and-beverage["food and beverage"]:::niche
  N_tech-and-saas["tech and SaaS"]:::niche
  N_fashion["fashion"]:::niche
  N_home-and-cleaning["home and cleaning"]:::niche
  N_hair["hair"]:::niche
  N_pets["pets"]:::niche
  P_exclusivity(["exclusivity"]):::pat
  P_comparison(["comparison"]):::pat
  P_authority(["authority"]):::pat
  P_before-after(["before-after"]):::pat
  P_direct-callout(["direct-callout"]):::pat
  P_pov(["pov"]):::pat
  P_speed-of-claim(["speed-of-claim"]):::pat
  P_problem-agitate-solution(["problem-agitate-solution"]):::pat
  P_belief-challenging(["belief-challenging"]):::pat
  P_removing-limitations(["removing-limitations"]):::pat
  P_question(["question"]):::pat
  N_abg-beauty -->|5.96x| P_exclusivity
  N_abg-beauty -->|2.48x| P_comparison
  N_abg-beauty -->|1.19x| P_authority
  N_abg-beauty -->|1.19x| P_before-after
  N_fitness -->|3.39x| P_before-after
  N_fitness -->|1.35x| P_direct-callout
  N_fitness -->|1.27x| P_pov
  N_supplements -->|3.62x| P_direct-callout
  N_supplements -->|2.96x| P_exclusivity
  N_supplements -->|1.48x| P_authority
  N_supplements -->|1.19x| P_speed-of-claim
  N_skincare -->|5.93x| P_speed-of-claim
  N_skincare -->|2.96x| P_problem-agitate-solution
  N_skincare -->|1.48x| P_pov
  N_skincare -->|1.36x| P_belief-challenging
  N_food-and-beverage -->|2.1x| P_direct-callout
  N_food-and-beverage -->|1.7x| P_pov
  N_food-and-beverage -->|1.19x| P_before-after
  N_tech-and-saas -->|2.99x| P_before-after
  N_tech-and-saas -->|1.24x| P_removing-limitations
  N_fashion -->|2.33x| P_before-after
  N_fashion -->|1.99x| P_comparison
  N_fashion -->|1.89x| P_direct-callout
  N_fashion -->|1.33x| P_removing-limitations
  N_home-and-cleaning -->|2.25x| P_authority
  N_home-and-cleaning -->|1.8x| P_before-after
  N_home-and-cleaning -->|1.62x| P_direct-callout
  N_home-and-cleaning -->|1.57x| P_removing-limitations
  N_hair -->|3x| P_direct-callout
  N_hair -->|2.4x| P_pov
  N_hair -->|2.14x| P_question
  N_hair -->|2x| P_removing-limitations
  N_pets -->|2.09x| P_before-after
  N_pets -->|1.49x| P_removing-limitations
  classDef niche fill:#1A1916,color:#EDEAE0,stroke:#F54E00;
  classDef pat fill:#D4FF3F,color:#17150F,stroke:#17150F;
```

## Cross-niche winners (the commonalities)

Hook patterns that over-index among breakouts in more than one niche:

- **[before-after](patterns/before-after.md)** wins in 7 niches: ABG beauty, fitness, food and beverage, tech and SaaS, fashion, home and cleaning, pets
- **[direct-callout](patterns/direct-callout.md)** wins in 6 niches: fitness, supplements, food and beverage, fashion, home and cleaning, hair
- **[removing-limitations](patterns/removing-limitations.md)** wins in 5 niches: tech and SaaS, fashion, home and cleaning, hair, pets
- **[pov](patterns/pov.md)** wins in 4 niches: fitness, skincare, food and beverage, hair
- **[exclusivity](patterns/exclusivity.md)** wins in 3 niches: ABG beauty, supplements, home and cleaning
- **[comparison](patterns/comparison.md)** wins in 3 niches: ABG beauty, skincare, fashion
- **[authority](patterns/authority.md)** wins in 3 niches: ABG beauty, supplements, home and cleaning
- **[speed-of-claim](patterns/speed-of-claim.md)** wins in 2 niches: supplements, skincare
- **[belief-challenging](patterns/belief-challenging.md)** wins in 2 niches: skincare, fashion

## What wins overall

- **before-after** — 1.52x more common in breakouts (n=232)
- **humor** — 1.5x more common in breakouts (n=9)
- **direct-callout** — 1.4x more common in breakouts (n=248)
- **exclusivity** — 1.17x more common in breakouts (n=32)
- **pov** — 1.16x more common in breakouts (n=118)

## Niches

- [ABG beauty](niches/abg-beauty.md) — 557 videos decoded
- [fitness](niches/fitness.md) — 317 videos decoded
- [supplements](niches/supplements.md) — 329 videos decoded
- [skincare](niches/skincare.md) — 326 videos decoded
- [food and beverage](niches/food-and-beverage.md) — 398 videos decoded
- [tech and SaaS](niches/tech-and-saas.md) — 395 videos decoded
- [fashion](niches/fashion.md) — 400 videos decoded
- [home and cleaning](niches/home-and-cleaning.md) — 399 videos decoded
- [hair](niches/hair.md) — 197 videos decoded
- [pets](niches/pets.md) — 383 videos decoded

## Hook patterns

- [exclusivity](patterns/exclusivity.md)
- [comparison](patterns/comparison.md)
- [authority](patterns/authority.md)
- [before-after](patterns/before-after.md)
- [direct-callout](patterns/direct-callout.md)
- [pov](patterns/pov.md)
- [speed-of-claim](patterns/speed-of-claim.md)
- [problem-agitate-solution](patterns/problem-agitate-solution.md)
- [belief-challenging](patterns/belief-challenging.md)
- [removing-limitations](patterns/removing-limitations.md)
- [question](patterns/question.md)

---
_Method: a model labels each video's real spoken hook; engagement is normalized by follower count (over-performance, not raw views); patterns are mined by contrastive lift (breakouts vs the rest). See [../mcp/pipeline/README.md](../mcp/pipeline/README.md)._

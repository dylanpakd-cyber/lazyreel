# ABG CMO — decoded insights wiki

Auto-generated from 4,475 real short-form videos decoded by the pipeline. This is derived analysis (no source video content). Regenerate with `node pipeline/build-wiki.mjs`.

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
  P_pov(["pov"]):::pat
  P_before-after(["before-after"]):::pat
  P_direct-callout(["direct-callout"]):::pat
  P_size-of-claim(["size-of-claim"]):::pat
  P_belief-challenging(["belief-challenging"]):::pat
  P_speed-of-claim(["speed-of-claim"]):::pat
  P_question(["question"]):::pat
  P_problem-agitate-solution(["problem-agitate-solution"]):::pat
  P_removing-limitations(["removing-limitations"]):::pat
  P_newness(["newness"]):::pat
  N_abg-beauty -->|7.45x| P_exclusivity
  N_abg-beauty -->|2.13x| P_comparison
  N_abg-beauty -->|1.28x| P_pov
  N_fitness -->|2.45x| P_before-after
  N_fitness -->|1.68x| P_direct-callout
  N_fitness -->|1.5x| P_size-of-claim
  N_fitness -->|1.29x| P_pov
  N_supplements -->|3x| P_direct-callout
  N_supplements -->|2.25x| P_exclusivity
  N_supplements -->|1.38x| P_before-after
  N_supplements -->|1.33x| P_comparison
  N_skincare -->|8.91x| P_speed-of-claim
  N_skincare -->|5.94x| P_question
  N_skincare -->|2.97x| P_problem-agitate-solution
  N_skincare -->|1.49x| P_direct-callout
  N_food-and-beverage -->|2.29x| P_direct-callout
  N_food-and-beverage -->|1.71x| P_pov
  N_tech-and-saas -->|1.79x| P_before-after
  N_tech-and-saas -->|1.4x| P_removing-limitations
  N_tech-and-saas -->|1.23x| P_newness
  N_fashion -->|2.33x| P_before-after
  N_fashion -->|2x| P_comparison
  N_fashion -->|1.89x| P_direct-callout
  N_fashion -->|1.5x| P_belief-challenging
  N_home-and-cleaning -->|2.24x| P_exclusivity
  N_home-and-cleaning -->|1.79x| P_before-after
  N_home-and-cleaning -->|1.49x| P_removing-limitations
  N_home-and-cleaning -->|1.3x| P_direct-callout
  N_hair -->|2.99x| P_question
  N_hair -->|2.39x| P_pov
  N_hair -->|1.9x| P_removing-limitations
  N_hair -->|1.9x| P_direct-callout
  N_pets -->|2.17x| P_before-after
  N_pets -->|1.49x| P_removing-limitations
  classDef niche fill:#1A1916,color:#EDEAE0,stroke:#F54E00;
  classDef pat fill:#D4FF3F,color:#17150F,stroke:#17150F;
```

## Cross-niche winners (the commonalities)

Hook patterns that over-index among breakouts in more than one niche:

- **[direct-callout](patterns/direct-callout.md)** wins in 7 niches: fitness, supplements, skincare, food and beverage, fashion, home and cleaning, hair
- **[before-after](patterns/before-after.md)** wins in 6 niches: fitness, supplements, tech and SaaS, fashion, home and cleaning, pets
- **[pov](patterns/pov.md)** wins in 5 niches: ABG beauty, fitness, skincare, food and beverage, hair
- **[removing-limitations](patterns/removing-limitations.md)** wins in 5 niches: tech and SaaS, fashion, home and cleaning, hair, pets
- **[exclusivity](patterns/exclusivity.md)** wins in 3 niches: ABG beauty, supplements, home and cleaning
- **[comparison](patterns/comparison.md)** wins in 3 niches: ABG beauty, supplements, fashion
- **[belief-challenging](patterns/belief-challenging.md)** wins in 2 niches: fitness, fashion
- **[speed-of-claim](patterns/speed-of-claim.md)** wins in 2 niches: supplements, skincare
- **[question](patterns/question.md)** wins in 2 niches: skincare, hair

## What wins overall

- **humor** — 2x more common in breakouts (n=10)
- **direct-callout** — 1.48x more common in breakouts (n=288)
- **exclusivity** — 1.38x more common in breakouts (n=38)
- **before-after** — 1.35x more common in breakouts (n=270)
- **pov** — 1.24x more common in breakouts (n=123)

## Niches

- [ABG beauty](niches/abg-beauty.md) — 633 videos decoded
- [fitness](niches/fitness.md) — 432 videos decoded
- [supplements](niches/supplements.md) — 420 videos decoded
- [skincare](niches/skincare.md) — 398 videos decoded
- [food and beverage](niches/food-and-beverage.md) — 481 videos decoded
- [tech and SaaS](niches/tech-and-saas.md) — 487 videos decoded
- [fashion](niches/fashion.md) — 425 videos decoded
- [home and cleaning](niches/home-and-cleaning.md) — 461 videos decoded
- [hair](niches/hair.md) — 296 videos decoded
- [pets](niches/pets.md) — 442 videos decoded

## Hook patterns

- [exclusivity](patterns/exclusivity.md)
- [comparison](patterns/comparison.md)
- [pov](patterns/pov.md)
- [before-after](patterns/before-after.md)
- [direct-callout](patterns/direct-callout.md)
- [size-of-claim](patterns/size-of-claim.md)
- [belief-challenging](patterns/belief-challenging.md)
- [speed-of-claim](patterns/speed-of-claim.md)
- [question](patterns/question.md)
- [problem-agitate-solution](patterns/problem-agitate-solution.md)
- [removing-limitations](patterns/removing-limitations.md)
- [newness](patterns/newness.md)

---
_Method: a model labels each video's real spoken hook; engagement is normalized by follower count (over-performance, not raw views); patterns are mined by contrastive lift (breakouts vs the rest). See [../mcp/pipeline/README.md](../mcp/pipeline/README.md)._

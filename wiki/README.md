# ABG CMO — decoded insights wiki

Auto-generated from 3,839 real short-form videos decoded by the pipeline. This is derived analysis (no source video content). Regenerate with `node pipeline/build-wiki.mjs`.

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
  P_authority(["authority"]):::pat
  P_comparison(["comparison"]):::pat
  P_before-after(["before-after"]):::pat
  P_pov(["pov"]):::pat
  P_direct-callout(["direct-callout"]):::pat
  P_speed-of-claim(["speed-of-claim"]):::pat
  P_removing-limitations(["removing-limitations"]):::pat
  P_problem-agitate-solution(["problem-agitate-solution"]):::pat
  P_question(["question"]):::pat
  P_belief-challenging(["belief-challenging"]):::pat
  P_newness(["newness"]):::pat
  P_exclusivity(["exclusivity"]):::pat
  N_abg-beauty -->|2.24x| P_authority
  N_abg-beauty -->|1.49x| P_comparison
  N_abg-beauty -->|1.16x| P_before-after
  N_abg-beauty -->|1.16x| P_pov
  N_fitness -->|2.99x| P_before-after
  N_fitness -->|1.67x| P_direct-callout
  N_fitness -->|1.49x| P_pov
  N_supplements -->|3.59x| P_direct-callout
  N_supplements -->|1.79x| P_speed-of-claim
  N_supplements -->|1.41x| P_authority
  N_supplements -->|1.36x| P_before-after
  N_skincare -->|5.9x| P_problem-agitate-solution
  N_skincare -->|2.95x| P_speed-of-claim
  N_skincare -->|2.95x| P_question
  N_skincare -->|1.4x| P_authority
  N_food-and-beverage -->|2.21x| P_direct-callout
  N_food-and-beverage -->|1.25x| P_before-after
  N_tech-and-saas -->|2.25x| P_before-after
  N_fashion -->|2.56x| P_before-after
  N_fashion -->|1.85x| P_direct-callout
  N_fashion -->|1.79x| P_comparison
  N_fashion -->|1.36x| P_removing-limitations
  N_home-and-cleaning -->|2.19x| P_before-after
  N_home-and-cleaning -->|1.78x| P_authority
  N_home-and-cleaning -->|1.55x| P_removing-limitations
  N_home-and-cleaning -->|1.49x| P_direct-callout
  N_hair -->|3.48x| P_direct-callout
  N_hair -->|2.55x| P_question
  N_hair -->|2.48x| P_removing-limitations
  N_hair -->|2.48x| P_pov
  N_pets -->|2.4x| P_before-after
  N_pets -->|1.2x| P_removing-limitations
  classDef niche fill:#1A1916,color:#EDEAE0,stroke:#F54E00;
  classDef pat fill:#D4FF3F,color:#17150F,stroke:#17150F;
```

## Cross-niche winners (the commonalities)

Hook patterns that over-index among breakouts in more than one niche:

- **[before-after](patterns/before-after.md)** wins in 8 niches: ABG beauty, fitness, supplements, food and beverage, tech and SaaS, fashion, home and cleaning, pets
- **[direct-callout](patterns/direct-callout.md)** wins in 6 niches: fitness, supplements, food and beverage, fashion, home and cleaning, hair
- **[removing-limitations](patterns/removing-limitations.md)** wins in 5 niches: supplements, fashion, home and cleaning, hair, pets
- **[authority](patterns/authority.md)** wins in 4 niches: ABG beauty, supplements, skincare, home and cleaning
- **[pov](patterns/pov.md)** wins in 3 niches: ABG beauty, fitness, hair
- **[comparison](patterns/comparison.md)** wins in 2 niches: ABG beauty, fashion
- **[speed-of-claim](patterns/speed-of-claim.md)** wins in 2 niches: supplements, skincare
- **[question](patterns/question.md)** wins in 2 niches: skincare, hair

## What wins overall

- **before-after** — 1.48x more common in breakouts (n=242)
- **direct-callout** — 1.43x more common in breakouts (n=291)
- **exclusivity** — 1.43x more common in breakouts (n=34)
- **pov** — 1.18x more common in breakouts (n=149)
- **newness** — 1.17x more common in breakouts (n=160)

## Niches

- [ABG beauty](niches/abg-beauty.md) — 570 videos decoded
- [fitness](niches/fitness.md) — 347 videos decoded
- [supplements](niches/supplements.md) — 335 videos decoded
- [skincare](niches/skincare.md) — 399 videos decoded
- [food and beverage](niches/food-and-beverage.md) — 397 videos decoded
- [tech and SaaS](niches/tech-and-saas.md) — 396 videos decoded
- [fashion](niches/fashion.md) — 400 videos decoded
- [home and cleaning](niches/home-and-cleaning.md) — 399 videos decoded
- [hair](niches/hair.md) — 196 videos decoded
- [pets](niches/pets.md) — 400 videos decoded

## Hook patterns

- [authority](patterns/authority.md)
- [comparison](patterns/comparison.md)
- [before-after](patterns/before-after.md)
- [pov](patterns/pov.md)
- [direct-callout](patterns/direct-callout.md)
- [speed-of-claim](patterns/speed-of-claim.md)
- [removing-limitations](patterns/removing-limitations.md)
- [problem-agitate-solution](patterns/problem-agitate-solution.md)
- [question](patterns/question.md)
- [belief-challenging](patterns/belief-challenging.md)
- [newness](patterns/newness.md)
- [exclusivity](patterns/exclusivity.md)

---
_Method: a model labels each video's real spoken hook; engagement is normalized by follower count (over-performance, not raw views); patterns are mined by contrastive lift (breakouts vs the rest). See [../mcp/pipeline/README.md](../mcp/pipeline/README.md)._

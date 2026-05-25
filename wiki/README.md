# LazyReel decoded insights wiki

Auto-generated from 5,560 real short-form videos decoded by the pipeline. This is derived analysis (no source video content). Regenerate with `node pipeline/build-wiki.mjs`.

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
  P_newness(["newness"]):::pat
  P_before-after(["before-after"]):::pat
  P_pov(["pov"]):::pat
  P_direct-callout(["direct-callout"]):::pat
  P_belief-challenging(["belief-challenging"]):::pat
  P_size-of-claim(["size-of-claim"]):::pat
  P_speed-of-claim(["speed-of-claim"]):::pat
  P_question(["question"]):::pat
  P_problem-agitate-solution(["problem-agitate-solution"]):::pat
  P_authority(["authority"]):::pat
  P_information-offering(["information-offering"]):::pat
  P_removing-limitations(["removing-limitations"]):::pat
  N_abg-beauty -->|7.5x| P_exclusivity
  N_abg-beauty -->|2.14x| P_comparison
  N_abg-beauty -->|1.25x| P_newness
  N_abg-beauty -->|1.22x| P_before-after
  N_fitness -->|2.24x| P_before-after
  N_fitness -->|1.73x| P_direct-callout
  N_fitness -->|1.28x| P_pov
  N_fitness -->|1.26x| P_belief-challenging
  N_supplements -->|2.6x| P_direct-callout
  N_supplements -->|2.4x| P_pov
  N_supplements -->|1.4x| P_before-after
  N_supplements -->|1.29x| P_exclusivity
  N_skincare -->|8.95x| P_speed-of-claim
  N_skincare -->|4.18x| P_question
  N_skincare -->|2.98x| P_problem-agitate-solution
  N_skincare -->|1.22x| P_authority
  N_food-and-beverage -->|2.16x| P_direct-callout
  N_food-and-beverage -->|1.28x| P_speed-of-claim
  N_food-and-beverage -->|1.16x| P_information-offering
  N_tech-and-saas -->|2.32x| P_before-after
  N_tech-and-saas -->|1.62x| P_removing-limitations
  N_tech-and-saas -->|1.2x| P_newness
  N_fashion -->|2.39x| P_before-after
  N_fashion -->|2.1x| P_comparison
  N_fashion -->|1.44x| P_direct-callout
  N_fashion -->|1.36x| P_removing-limitations
  N_home-and-cleaning -->|2.24x| P_exclusivity
  N_home-and-cleaning -->|1.76x| P_direct-callout
  N_home-and-cleaning -->|1.75x| P_before-after
  N_home-and-cleaning -->|1.61x| P_removing-limitations
  N_hair -->|2.97x| P_authority
  N_hair -->|2.23x| P_question
  N_hair -->|1.91x| P_direct-callout
  N_hair -->|1.6x| P_removing-limitations
  N_pets -->|2.17x| P_before-after
  N_pets -->|1.49x| P_removing-limitations
  classDef niche fill:#1A1916,color:#EDEAE0,stroke:#F54E00;
  classDef pat fill:#D4FF3F,color:#17150F,stroke:#17150F;
```

## Cross-niche winners (the commonalities)

Hook patterns that over-index among breakouts in more than one niche:

- **[before-after](patterns/before-after.md)** wins in 7 niches: ABG beauty, fitness, supplements, tech and SaaS, fashion, home and cleaning, pets
- **[direct-callout](patterns/direct-callout.md)** wins in 6 niches: fitness, supplements, food and beverage, fashion, home and cleaning, hair
- **[removing-limitations](patterns/removing-limitations.md)** wins in 5 niches: tech and SaaS, fashion, home and cleaning, hair, pets
- **[pov](patterns/pov.md)** wins in 4 niches: ABG beauty, fitness, supplements, hair
- **[exclusivity](patterns/exclusivity.md)** wins in 3 niches: ABG beauty, supplements, home and cleaning
- **[comparison](patterns/comparison.md)** wins in 3 niches: ABG beauty, skincare, fashion
- **[newness](patterns/newness.md)** wins in 3 niches: ABG beauty, tech and SaaS, home and cleaning
- **[belief-challenging](patterns/belief-challenging.md)** wins in 2 niches: fitness, fashion
- **[speed-of-claim](patterns/speed-of-claim.md)** wins in 2 niches: skincare, food and beverage
- **[question](patterns/question.md)** wins in 2 niches: skincare, hair
- **[authority](patterns/authority.md)** wins in 2 niches: skincare, hair

## What wins overall

- **humor**: 2x more common in breakouts (n=10)
- **bandwagon**: 1.8x more common in breakouts (n=8)
- **direct-callout**: 1.45x more common in breakouts (n=328)
- **exclusivity**: 1.41x more common in breakouts (n=50)
- **speed-of-claim**: 1.35x more common in breakouts (n=58)

## Niches

- [ABG beauty](niches/abg-beauty.md): 716 videos decoded
- [fitness](niches/fitness.md): 511 videos decoded
- [supplements](niches/supplements.md): 548 videos decoded
- [skincare](niches/skincare.md): 496 videos decoded
- [food and beverage](niches/food-and-beverage.md): 572 videos decoded
- [tech and SaaS](niches/tech-and-saas.md): 615 videos decoded
- [fashion](niches/fashion.md): 600 videos decoded
- [home and cleaning](niches/home-and-cleaning.md): 554 videos decoded
- [hair](niches/hair.md): 410 videos decoded
- [pets](niches/pets.md): 538 videos decoded

## Hook patterns

- [exclusivity](patterns/exclusivity.md)
- [comparison](patterns/comparison.md)
- [newness](patterns/newness.md)
- [before-after](patterns/before-after.md)
- [pov](patterns/pov.md)
- [direct-callout](patterns/direct-callout.md)
- [belief-challenging](patterns/belief-challenging.md)
- [size-of-claim](patterns/size-of-claim.md)
- [speed-of-claim](patterns/speed-of-claim.md)
- [question](patterns/question.md)
- [problem-agitate-solution](patterns/problem-agitate-solution.md)
- [authority](patterns/authority.md)
- [information-offering](patterns/information-offering.md)
- [removing-limitations](patterns/removing-limitations.md)

---
_Method: a model labels each video's real spoken hook; engagement is normalized by follower count (over-performance, not raw views); patterns are mined by contrastive lift (breakouts vs the rest). See [../mcp/pipeline/README.md](../mcp/pipeline/README.md)._

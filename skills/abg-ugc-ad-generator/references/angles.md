# Preset Ad Angles — Shot-by-Shot Structures

Each angle below lists the shot count, what each shot does, and a dialogue pattern. Use these as the starting structure. Swap in the actual product details before showing the user the shot list for approval.

---

## Hold-and-Show — 3 shots (15 seconds, 5s each)

The safest angle for products Seedance struggles to render during application — makeup, skincare, small supplements. Zero application = zero application errors. The creator holds, rotates, and shows off the product without ever putting it on themselves.

This is also the recommended default for any cream blush, lipstick, foundation, serum, dropper product, or small packaged product with packaging text that matters.

### Shot 1 — Hook / pickup (5s)
- **Visual**: Close-up of the product that pulls back to reveal the creator in her space (bathroom, bedroom, kitchen) picking it up. She holds it up toward the camera. Natural light, handheld selfie-style.
- **Mode**: `image_to_video` — product image is the literal first frame, camera pulls back to reveal the creator
- **Dialogue**: Curious hook. Example: *"Okay, I need to talk about this."*

### Shot 2 — Product detail rotation (5s)
- **Visual**: Same creator, same space. She now rotates the product slowly to show a different angle — side of the packaging, back of the tube, color of the top. Her eyes on the product with a satisfied expression.
- **Mode**: `reference_to_video` with shot 1's output as `@Video1` + product image as `@Image1`
- **Dialogue**: Product name + specific detail. Example: *"The shade is literally perfect — and look at the packaging."*

### Shot 3 — Smile + CTA (5s)
- **Visual**: Same creator, same space. She holds the product next to her face (matching the product color in her existing makeup if relevant) and smiles confidently at the camera.
- **Mode**: `reference_to_video` with shot 1's output as `@Video1` + product image as `@Image1`
- **Dialogue**: Punchy close. Example: *"Seriously, just get it. Link in bio."*

### Why this works for hard categories

- Hands stay on the product, not on the face — eliminates color-transfer hallucinations
- No application action — eliminates the model's tendency to apply to wrong body parts
- Product visible in every shot — keeps brand recognition strong
- Reference-to-video mode for shots 2 and 3 locks the creator's face + outfit via `@Video1`, AND costs 40% less per second ($0.1814 vs $0.3024 at 720p)

---

## Unboxing — 3 shots (15 seconds total, 5s each)

Highest-converting format for DTC products with strong packaging or reveal appeal.

### Shot 1 — Reveal (5s)
- **Visual**: Selfie-style, creator holding unopened box toward camera in a casual environment (bedroom, kitchen, desk). Morning or window light.
- **Dialogue**: Anticipation/hype beat. Example: *"Bro, these finally came. Look at this."*
- **Mode**: Image-to-video if product box is the focus; reference-to-video if creator is prominent.

### Shot 2 — Close-up detail (5s)
- **Visual**: Tight shot on the product outside the box. Hands rotating or opening it. Natural lighting.
- **Dialogue**: Benefit or product name reveal. Example: *"The [product] is insane — look at the detail on this."*
- **Mode**: Image-to-video with product image as first frame works great here.

### Shot 3 — Wear/use shot (5s)
- **Visual**: Creator using or wearing the product, looking at camera.
- **Dialogue**: Implicit CTA. Example: *"These are not leaving the rotation. Link in bio."*

---

## Testimonial — 4 shots (20 seconds, 5s each)

Highest-performing format for supplements, skincare, and anything with a before/after health claim.

### Shot 1 — Hook (5s)
- **Visual**: Selfie-style, creator in a relatable setting (bathroom, kitchen, couch). Problem face.
- **Dialogue**: Pain point lead. Example: *"I've tried every [category] and nothing worked. Then I found this."*

### Shot 2 — Product introduction (5s)
- **Visual**: Creator holds up product, shows label clearly.
- **Dialogue**: Product name + mechanism. Example: *"[Product] — it's [unique mechanism/ingredient]."*

### Shot 3 — Benefit proof (5s)
- **Visual**: Creator showing the result (skin close-up, energy shot, wearing the product, etc.)
- **Dialogue**: Specific outcome. Example: *"Three weeks in, my [problem] is completely gone."*

### Shot 4 — CTA (5s)
- **Visual**: Product back in frame, creator smiling at camera.
- **Dialogue**: Implicit close. Example: *"Seriously, try it. Link in bio."*

---

## Lifestyle Demo — 5 shots (25 seconds, 5s each)

Best for apparel, accessories, home goods, and any product where usage context matters.

### Shot 1 — Environment establish (5s)
- **Visual**: Wide-ish shot of the creator in the lifestyle context (car, gym, coffee shop, hiking, etc.) WITHOUT the product yet.
- **Dialogue**: Setup. Example: *"Every morning I [routine]. This is what changed everything."*

### Shot 2 — Product intro (5s)
- **Visual**: Product enters the frame — creator pulls it out of a bag, off a shelf, etc.
- **Dialogue**: Product name + one-line benefit. Example: *"[Product] — it just fits the vibe."*

### Shot 3 — Use case A (5s)
- **Visual**: Creator using the product in one specific way relevant to the context.
- **Dialogue**: Feature call-out. Example: *"The [feature] is honestly the best part."*

### Shot 4 — Use case B (5s)
- **Visual**: Creator using the product in a second way or angle.
- **Dialogue**: Second feature or texture/quality call-out. Example: *"And the [detail] — that's the move."*

### Shot 5 — Wrap/CTA (5s)
- **Visual**: Creator back in frame, product still visible.
- **Dialogue**: Close. Example: *"Link in bio if you know, you know."*

---

## Problem-Solution — 4 shots (20 seconds, 5s each)

Best for products that solve a specific, nameable problem. Works especially well for supplements, tools, beauty problem-solvers.

### Shot 1 — Problem state (5s)
- **Visual**: Creator in the problem moment — frustrated, struggling, or demonstrating the problem.
- **Dialogue**: Name the pain. Example: *"If you're still [doing the wrong thing] every day, this is for you."*

### Shot 2 — Product reveal (5s)
- **Visual**: Product enters the frame — held up, placed on a counter, pulled from a drawer.
- **Dialogue**: Solution intro. Example: *"[Product] fixed this for me in under a week."*

### Shot 3 — Demo (5s)
- **Visual**: Creator actually using the product, showing the mechanism of action.
- **Dialogue**: How it works. Example: *"You just [action] and it [result]."*

### Shot 4 — Result + CTA (5s)
- **Visual**: After state — creator showing the result, in a better state than shot 1.
- **Dialogue**: Close. Example: *"Game changer. Link in bio."*

---

## Before-After — 3 shots (15 seconds, 5s each)

Best for products with visual transformation — skincare, fitness, home/design, hair, teeth whitening.

### Shot 1 — Before state (5s)
- **Visual**: The "before" — problem visible, creator in the struggle.
- **Dialogue**: Brief, acknowledging the before state. Example: *"This is what my [area] looked like before."*

### Shot 2 — Product reveal (5s)
- **Visual**: Product in frame — creator holding it, applying it, using it.
- **Dialogue**: Product name + duration. Example: *"[Product]. Two weeks of daily use."*

### Shot 3 — After state (5s)
- **Visual**: The "after" — clear visible result, creator confident.
- **Dialogue**: Result + implicit CTA. Example: *"Yeah. That's the difference."*

---

## Freeform — any shot count

If the user provides a freeform angle, infer shot count from the structure they describe:
- 1 beat or idea → 3 shots (hook, demo, CTA)
- 2 beats → 4 shots (hook, beat 1, beat 2, CTA)
- 3+ beats → 5 shots (environment, hook, beats, CTA)

Never exceed 5 shots in a single stitched ad — past that, attention drops and costs spike. If the user wants longer, suggest two separate 5-shot ads they can A/B test.

---

## Audio decisions per angle

| Angle | Dialogue audio | Music | Ambient SFX |
|---|---|---|---|
| Unboxing | Yes, creator speaking | No (let the crinkling carry) | Yes — high-gain packaging sounds |
| Testimonial | Yes, creator speaking | Optional, quiet underneath | Minimal |
| Lifestyle Demo | Yes, creator speaking | Optional music if energy is high | Yes — environment sounds |
| Problem-Solution | Yes, creator speaking | No | Minimal |
| Before-After | Optional — can work silent with captions | Optional | No |

Set `generate_audio: true` in the fal.ai request for any shot with dialogue. For silent shots, set `false` — it's cheaper and lets you dub music in post.

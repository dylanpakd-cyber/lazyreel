# Writing Seedance 2.0 Prompts That Actually Work

## Structure every prompt the same way

Every Seedance prompt should hit these beats in order:

```
[Shot type + framing] of [subject] [doing action].
[Environment + lighting].
[Camera movement or static].
[Audio cue: dialogue in quotes OR ambient SFX note].
[Style modifiers: UGC, iPhone quality, handheld, vertical].
```

### Example (unboxing, shot 1)

```
Medium close-up, selfie-style of a 25-year-old woman holding an unopened
product box toward the camera in her bedroom. Morning natural light,
handheld phone framing. She says "You guys, this just came in and I've
been waiting a month for this." UGC style, iPhone quality, vertical 9:16.
```

## Anatomy: what each piece does

**Shot type + framing**: "close-up," "medium shot," "POV," "overhead," "selfie-style." This controls how Seedance composes the frame.

**Subject**: If using reference-to-video, describe the creator ("25-year-old woman," "early-30s man with beard," etc.) so the generated character looks consistent across shots. Be specific about age and a couple features, Seedance will lock on these.

**Action**: Keep it to ONE clear action per shot. "Holding the product and tilting it toward the camera" works. "Opening the box, then showing the product, then putting it on" does not, it's too many actions for a single 5-second clip.

**Environment + lighting**: UGC lives in real environments. Bedroom, kitchen, bathroom, car, coffee shop, outdoor walk. Always specify natural lighting (morning, golden hour, overcast), studio lighting reads as commercial, not UGC.

**Camera movement**: "Handheld," "slight shake," "static selfie-style," "slow pan." For UGC, handheld + static selfie-style is the default. Don't ask for complex camera moves unless it's a specific directed shot.

**Audio cue**: If `generate_audio: true`, put the dialogue in quotes exactly as you want it spoken. Include filler words ("like," "honestly," "bro") for realism. If you want ambient sound only, write: `Audio: ambient room tone, no music, no dialogue.`

**Style modifiers**: Always end UGC prompts with some version of: `UGC style, iPhone quality, handheld, vertical 9:16.` This pushes Seedance away from cinematic/produced aesthetic.

## UGC-specific modifiers that work

Drop these in whenever relevant:

- `iPhone quality`, prevents overly-polished lighting
- `slight camera shake`, adds realism
- `selfie-style arm extension`, classic UGC framing for first-person shots
- `imperfect framing`, Seedance will otherwise center everything perfectly
- `natural skin texture, visible pores`, avoids the "plastic skin" AI tell
- `casual lighting, not studio`, blocks the overhead softbox look
- `real apartment, not staged`, for lifestyle shots
- `vertical 9:16, mobile-first framing`, always end with this for paid social

## Dialogue rules

Per second of screen time, budget ~3 words of dialogue. A 5-second shot fits ~15 words max spoken comfortably. Any more and it rushes.

Write dialogue like a real person texts, not like a script:
- ✅ "Bro, these just came in. Look at this."
- ❌ "Introducing the new product you've been waiting for."

Include a natural pause or filler in the first 1 second, Seedance uses that pause to establish the subject before speech starts.

## Reference syntax: CRITICAL for reference-to-video

In reference-to-video mode you pass arrays of reference inputs: `image_urls`, `video_urls`, `audio_urls`. To use them you must explicitly reference each one in the prompt text using `@` syntax:

- First image → `@Image1`
- Second image → `@Image2` (up to `@Image9`)
- First video → `@Video1` (up to `@Video3`)
- First audio → `@Audio1` (up to `@Audio3`)

The reference syntax is how you tell Seedance what each input IS and how to use it. Without `@` references in the prompt, Seedance may ignore the inputs entirely.

### Examples

**Locking the creator across shots (shot 2 references shot 1's video):**
```
The same woman from @Video1 continues her review in the same bedroom.
She now holds @Image1 up to the camera and says "The texture on this
is actually insane." UGC style, iPhone quality, handheld, vertical 9:16.
```
- `@Video1` = shot 1's output MP4 (locks the creator's face, outfit, environment)
- `@Image1` = product image (keeps the product visible and consistent)

**Multiple product angles passed as images:**
```
A creator in her kitchen holds up the product from @Image1, rotates it
to show the side view from @Image2, then sets it down next to the
version from @Image3. "This one's my favorite." UGC style, iPhone quality.
```

**Voice cloning (use your own recorded audio as the voice):**
```
A 25-year-old woman holds @Image1 toward the camera and speaks
the dialogue from @Audio1. Her mouth movement matches @Audio1 exactly.
UGC style, iPhone quality, vertical 9:16.
```
- `@Audio1` = a recording of the user's (or a chosen voice's) audio
- Seedance will lip-sync the visual character to that audio

## Reference-to-video vs image-to-video: how the prompt differs

**Image-to-video** (product image = literal first frame):
- Prompt describes what happens AFTER the frame
- Example: "The product box sits on a wooden table. A hand enters frame from the right and picks it up, turning it to show the side label."
- No `@` syntax needed, there's only one input, the first-frame image

**Reference-to-video** (inputs inform the scene, Seedance composes around them):
- Prompt describes the whole scene AND references inputs with `@Image1`, `@Video1`, `@Audio1`
- Example: "A woman in her kitchen holds @Image1 and shows it to the camera selfie-style."

## Common failure modes and how to fix them

| Failure | Likely cause | Fix |
|---|---|---|
| Garbled text on packaging | Resolution too low | Use 720p or 1080p |
| Product looks different from reference | Prompt overrides image | Add "matching the reference image exactly" to prompt |
| Creator face morphs between shots | No character reference | Pass a creator reference image across all shots in reference-to-video mode |
| Dialogue doesn't match audio | Prompt dialogue wasn't in quotes | Wrap dialogue in quotes exactly as you want it spoken |
| Generic "stock ad" aesthetic | Missing UGC modifiers | Add `iPhone quality, handheld, UGC style, casual lighting` |
| Product disappears mid-shot | Too many actions | One action per shot, split into two clips |
| Weird mouth movement | Audio generation artifact | Regenerate with same seed, or generate without audio and dub later |

## Negative prompting (soft: Seedance doesn't take explicit negative prompts like Stable Diffusion)

Seedance v2 doesn't have a formal negative prompt field. Work around it by adding "not" phrasing in the main prompt:

- `not studio lighting, natural light only`
- `not cinematic, casual UGC vibe`
- `no text overlays, no graphics`
- `not a commercial, real creator style`

## Restrictive negatives for high-risk categories

For makeup, skincare, food, or any category where Seedance tends to hallucinate (color transfer to wrong body parts, pre-existing application marks, morphing products), pile on the negatives aggressively. The model listens when you're explicit.

Pattern:

```
[describe the exact desired action and location in detail]
[describe the exact starting state, including what is NOT present]
[explicit list of forbidden elements]
```

Example (blush stick, high-risk makeup application):

```
A 25-year-old woman in her bathroom holds @Image1 up to the camera,
rotates it to show the side of the packaging, and smiles. She is NOT
applying the product. She has a clean face with only the natural blush
color on the apples of her cheeks that matches the product shade. No
color is visible on her hands, lips, forehead, or neck. No makeup marks,
no smudges, no pre-existing application. The product stays in her hand
the entire shot. UGC style, iPhone quality, handheld, vertical 9:16.
```

Notice:
- The forbidden elements are LISTED explicitly (color on hands, lips, forehead, neck)
- The desired state is DESCRIBED positively (natural blush on cheeks that matches the product)
- The action is CONSTRAINED ("stays in her hand the entire shot")

If the first generation still hallucinates forbidden elements, regenerate with even more explicit language. This is iteration territory, expect 1-2 retries for hard categories.

## Continuing a shot into the next one (character consistency)

If shots 2–5 need the SAME creator as shot 1:

1. After shot 1 generates, download it to disk
2. Upload it to fal.ai: `video_url = fal_client.upload_file("outputs/.../shot-1.mp4")`
3. For shot 2, use reference-to-video mode
4. Pass BOTH the product image AND shot 1's video in the arguments:
   ```python
   arguments = {
       "prompt": "The same creator from @Video1 now holds @Image1 and says ...",
       "image_urls": [product_image_url],
       "video_urls": [shot_1_video_url],
       ...
   }
   ```
5. Reference them in the prompt with `@Image1` and `@Video1`

This locks the character across the full ad AND the per-second rate drops 40% (reference-to-video with video refs is $0.1814/sec at 720p vs $0.3024/sec without).

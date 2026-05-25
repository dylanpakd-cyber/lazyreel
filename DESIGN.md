# DESIGN.md — LazyReel

> This file is the design system prompt. Hand it to Claude Code with the `frontend-design` skill and build the site to this spec. Words live in [COPY.md](COPY.md). Build/sequence steps live in [PLAN.md](PLAN.md). Build the whole thing as one cohesive, hand-crafted page. No template, no component-library default look.

---

## 1. The product, in one breath

**LazyReel** gives a coding agent the taste, formats, and hooks it takes to make short-form video that actually performs. Plug it in and your agent stops writing generic AI ad mush and starts shipping UGC that converts. It ships as an MCP connector plus a set of opinionated, video-creation skills.

- **Headline:** "Make your agent an LazyReel."
- **Positioning line:** "UGC taste for AI. Not AI for UGC."
- **What it actually is:** a UGC / short-form video marketing agent. "ABG" is the trend-word hook, used for fun (67labs / terminally-online energy). The substance underneath is dead serious: it does the real work of making a video, from idea to shoot-ready brief.
- **Audience:** founders, e-commerce operators, and creators who already live in Claude Code / Cursor / Codex.

## 2. Brand personality

Terminally-online operator with very good taste, having fun with it. Confident, joke-forward, allergic to corporate mush. The name leans into a viral word on purpose; the product backs every joke with a receipt. Think 67labs' voice (smart kids who are very online) wearing LazyWeb's clean devtool structure.

**Voice tells**

- Short, declarative, a little cocky. "Your agent writes hooks like a brand intern. Let's fix that."
- Creator/operator slang used correctly and sparingly: hook, angle, format, niche, brief, b-roll, receipts, ship, test.
- The ABG wink stays in the high-personality spots (headline, eyebrow, footer kicker, slogan tape). It never shows up in the parts that build trust (pricing, what-is-real). There it's all substance.
- **Confident plus aspirational numbers are wanted.** Big round headline metrics are on-brand brag, not fraud. Keep them round and obviously brand-flavored (12,400+, 3.4B+), never fake-precise.

## 3. The thesis you must not betray

The product sells "stop shipping AI slop." So the site itself cannot look AI-generated. These are hard rules, adapted from the anti-slop consensus for a UGC brand. Treat them like tests.

1. **Warm the neutrals.** Never pure `#ffffff` or `#000000`. Paper is cream, ink is warm near-black. Warmth alone kills the sterile-devtool feeling before any color is added.
2. **One loud color, used like a highlighter.** The lime accent swipes *behind* emphasis words (a copywriter marking up a brief). It is almost never a button fill and never a gradient. One saturated color reads as fun; three read as garish.
3. **Two type faces minimum, doing different jobs.** A grotesque display face and an italic-serif punchline word. Inter never does display work. Mono carries the operator/dashboard texture.
4. **Bias the layout where it earns it.** The hero can center (LazyWeb does, it reads as confident). The showcase and teardown sections break symmetry on purpose. Centered-everything for a whole page is a tell.
5. **Motion is springy and purposeful.** Spring easing, staggered entrances, alive faux-UI. Every animation has a `prefers-reduced-motion` fallback. No motion for decoration's sake.
6. **Illustrations are fake-but-believable UGC marketing UI, and they breathe.** A hook A/B card, a rewrite diff, a niche-trend panel, a shoot-brief receipt. Each one has micro-motion. No stock 3D blobs, no purple gradient hero, no generic icon-tile feature grid.
7. **Restraint beats decoration.** Better an empty, well-spaced section than a decorative blob. Silence is the strongest fail-state.

## 4. Visual system

### Palette (warm-light base, dark insets)

Light, warm-paper base with near-black "screen" insets for terminals and dashboards. This matches LazyWeb's actual lower sections (light dotted paper) and 67labs / Hallmark warmth, not a full dark mode. (If we ever flip to dark, the palette is the single tunable knob; layout and motion are unchanged. Default is light.)

```css
:root {
  /* surfaces */
  --paper:    #FBF8F0; /* page background, warmest cream */
  --cream:    #F4F0E6; /* alternating section background */
  --cream-2:  #EAE3D2; /* raised panels, cards */
  --ink:      #0E0E0C; /* primary text, warm near-black */
  --ink-2:    #1A1916; /* dark inset background (terminal, dashboards) */
  --ink-3:    #2A2925; /* dark inset layer 2 */
  --mute:     #6B6960; /* secondary text, warm gray */

  /* accents (use sparingly) */
  --highlighter: #D4FF3F; /* the one signature: swiped behind words */
  --flag:        #FF4D17; /* warm orange: logo slash, live dot, one CTA at most */

  /* lines + texture */
  --line:   rgba(14,14,12,.12);
  --line-2: rgba(14,14,12,.22);
  --dot:    rgba(14,14,12,.10); /* the subtle dotted-grid background texture */

  /* on dark insets */
  --ink-text:   #EDEAE0;
  --ink-mute:   #8A877C;
  --term-green: #B8F23F;
}
```

**Color discipline:** ~90 percent of every screen is warm neutral. Color appears only as the lime highlight behind 2 to 3 emphasis words per section, plus one orange hit (logo slash, a live-status dot). That ratio is the whole trick.

**Background texture:** a subtle warm dotted grid (`--dot`, ~24px spacing) on the paper, like LazyWeb. It signals "spec sheet / blueprint" and keeps large empty sections from feeling flat. Keep it faint.

### Typography

Keep LazyWeb's font feel. Add one italic-serif emphasis face for charm.

| Role | Family | Weights | Use |
|---|---|---|---|
| Display | **Space Grotesk** | 500, 600, 700 | H1, H2, big numbers |
| Body | **Inter** | 400, 500, 600 | paragraphs, UI |
| Mono | **JetBrains Mono** | 400, 500, 700 | labels, terminal, stats, section numbers, badges |
| Emphasis | **Instrument Serif** *(italic)* | 400 italic | the single punchline word inside a headline |

Self-host as woff2 and preload. The signature move: a Space Grotesk headline with exactly one word in Instrument Serif italic, optionally with the lime highlighter behind it.

**Type scale (fluid):**

```css
--fs-display: clamp(2.75rem, 5.5vw + 1rem, 5.5rem);  /* H1 */
--fs-h2:      clamp(1.9rem, 3vw + 1rem, 2.75rem);
--fs-h3:      1.25rem;
--fs-body:    1.0625rem;  /* 17px, min 16px on mobile */
--fs-label:   0.75rem;    /* mono, uppercase, letter-spacing .12em */
```

Negative tracking on display (`-0.02em`). Wide tracking on mono labels (`0.12em`, uppercase). Line-height 0.98 to 1.02 on display, 1.55 on body.

### Spacing, radii, shadows

```css
--space-xs: .5rem;  --space-sm: .75rem; --space-md: 1rem;
--space-lg: 1.5rem; --space-xl: 2.5rem; --space-2xl: 4rem;
--space-3xl: 6.5rem; --space-4xl: 10rem;

--measure: 68ch;     --page-max: 1240px;  --gutter: clamp(20px, 4vw, 32px);
--r-card: 16px;      --r-pill: 999px;     --r-term: 10px;
```

Shadows are **soft, warm, low**, never hard brutalist offset blocks.

```css
--shadow-rest: 0 1px 0 var(--line);
--shadow-lift: 0 18px 40px -24px rgba(14,14,12,.28);
```

### Motion

```css
--ease-spring: cubic-bezier(.2,.7,.2,1);
--dur-fast: .18s; --dur: .35s; --dur-slow: .6s;
```

- **Card hover:** `translateY(-4px) rotate(-.6deg)` with `--ease-spring`. The "sticker peeling off the page" feel.
- **Entrances:** staggered `popIn` (fade + 8px rise + tiny scale).
- **Faux-UI life:** blinking terminal cursor, typewriter reveal, pulsing live dot, gentle float on hero widget, a counter that ticks up once on scroll-in.
- **Every keyframe needs a `prefers-reduced-motion: reduce` fallback** showing the final state.

### Playfulness devices (UGC-coded)

- **Highlighter swipe** behind 2 to 3 emphasis words per section (lime).
- **Everything rounds to a pill** for tags, badges, status chips, the primary CTA.
- **1-degree hover tilt** on cards.
- **Faux UGC-marketing UI as illustration** (see component specs): hook A/B card, rewrite diff, niche-trend panel, shoot-brief receipt. Doubles as proof.
- **A scrolling slogan tape** (marquee) under the hero. Copy in COPY.md.
- **Live status pill** in the nav ("live · listening") with a pulsing dot, and one metric that ticks.
- **✦ sparkle** as the bullet/separator throughout.
- **Joke microcopy** in section labels and the footer kicker (the ABG wink lives here).

> Differentiation note: borrow 67labs' warm-neutral discipline + highlighter mechanic and LazyWeb's structure, but every motif is **UGC-coded** (the highlighter is a copywriter's pen, the faux-UI is hook tests and niche dashboards, the slogans are creator slogans). Same craft language, different world. Unique, not a clone.

## 5. Layout and section cadence

LazyWeb's section order, UGC content. Centered single column, `--page-max` width, faint dotted-grid background, full-width hairline rules between sections, numbered mono section labels (`01 / SKILLS`).

**Button discipline.** Hard caps:
- Nav: at most 4 text links + 1 status pill + 1 primary CTA.
- **One agent only.** No agent-mode switcher. Delete the two-tab toggle entirely.
- Each content section gets at most one CTA. Most sections get zero and rely on the page's two anchor CTAs (hero + closing).

1. **Nav (sticky).** Wordmark `LazyReel` with a CM-style mark and an orange slash. Center links: Skills, How it works, Pricing, FAQ. Right: a live-status pill + one "Get started" pill CTA.
2. **Hero (centered).** Mono eyebrow, H1 with one italic-serif highlighted word, confident subhead, **two CTAs max** (primary "Get started", text-link "See it work"), compatibility line ("Works with Claude Code, Cursor & Codex"), and an **animated terminal** running a single `/abg` command with streaming success lines. No switcher.
3. **Slogan tape.** A single-row marquee of creator slogans. Pure personality.
4. **Opinionated skills (`01 / SKILLS`).** The centerpiece, built exactly like LazyWeb's: a left rail of **6** clickable skill commands, a right **preview panel** that renders the selected skill's output as a believable mini-report. The preview uses **placeholder slots** (`{product}`, `{niche}`) so it reads like a real fill-in-the-blank output you'd get back, and ends with a **"Copy this prompt"** affordance. Default the first skill selected. The 6 skills map to the buckets of making a video (ideation, niche/video analysis + context, teardown, hooks, shoot-brief, rewrite). No video editing. See COPY.md for all 6 + sample outputs.
5. **Stats strip (`02 / RECEIPTS`).** Three big mono counters, aspirational round numbers, tick up on scroll-in.
6. **Before / after (`03 / THE DIFFERENCE`).** A drag slider: "Same prompt. ABG context. Better videos." Left card is generic AI ad slop (painfully recognizable), right card is the ABG version.
7. **Tools (`04 / MCP`).** The real 6 MCP tools as a grid of mono-titled cards. Presentational this phase.
8. **Pricing (`05 / PRICING`).** LazyWeb's clean 2-up: "For agents" (free) + "For humans" (free), each a checklist card with one CTA. Positioning line above.
9. **The closing prompt block (`06 / ONE PROMPT`).** The LazyWeb "One prompt. Your agent installs the rest." pattern: a dark inset panel holding a single copy-pasteable prompt, with a big **Copy** button. You paste it into your agent and it installs + runs the LazyReel skills. This is the "click, get the output, paste it in, it just works" moment the operator called out. Presentational copy this phase (real token/wiring comes with the MCP phase), but the Copy button must work.
10. **FAQ (`07 / QUESTIONS`).** Native `<details>` disclosures.
11. **Footer.** Giant kicker line, three link columns, legal kicker (the ABG wink).

## 6. Component specs

- **Buttons / CTAs.** Pill shape. Primary: ink fill, paper text. Secondary: a plain text link with an arrow, not a second filled button (this is how we cut button clutter). Min height 44px. The orange `--flag` is allowed on at most one CTA on the whole page.
- **Pills / badges.** Mono, uppercase, `--r-pill`, hairline border, optional leading dot. Status pill gets a pulsing `--flag` dot.
- **Cards.** `--r-card`, `--shadow-rest` at rest, `--shadow-lift` + 1-degree tilt on hover. Cream-2 surface. No heavy borders.
- **Terminal / console.** Dark inset (`--ink-2`), `--r-term`, faux title bar ("lazyreel — zsh"), mono body with colored lines: command white, prompt orange, muted gray, success lime (`--term-green`). Typewriter reveal + blinking cursor.
- **Skills showcase (centerpiece).** Left: a vertical list of **6** skill rows (mono command, Space Grotesk title, muted one-liner); the selected row gets a lime highlighter mark + a left border. Right: a preview panel with a faux report header (`/skill — output`, a "Copy" affordance) rendering the selected skill's sample output (a brief, a teardown, a hook list, a niche report) with `{placeholder}` slots. Clicking a row swaps the preview. Keyboard-navigable (arrow keys, Enter).
- **Stat counter.** Big Space Grotesk number + mono label. IntersectionObserver triggers a single count-up.
- **Comparison slider.** Two stacked cards, a draggable vertical handle, keyboard-accessible (arrow keys move the divider), `aria-label`. Instruction line: "Drag to compare."
- **Closing prompt block.** Dark inset panel, mono body holding the paste-ready prompt, a prominent **Copy** button (writes to clipboard, flips to "Copied"). A muted footnote about it being free / safe to paste.
- **Faux-UI illustrations** (pick 2 to 3, place in hero / showcase / difference):
  - *Hook A/B card:* two hook variants, one with a lime "CTR +37%" pill ticking.
  - *Rewrite diff:* a weak line struck through in muted red, a strong line below in lime-highlight. The "kill the slop" visual.
  - *Niche-trend panel:* a small dashboard of a niche's rising formats with a pulsing live dot + sparkline.
  - *Shoot-brief receipt:* "✓ brief ready · 3 hooks · 5 scenes · on-screen text."
- **FAQ item.** `<details>`/`<summary>`, min 48px target, chevron rotates on open.

## 7. Responsive

- Check **390, 768, 1440px**. No horizontal scroll at any width.
- Mobile stacks in reading order: promise, terminal, skills, receipts, difference, tools, pricing, closing prompt, FAQ.
- Nav center links collapse below ~720px; keep CTA + status pill.
- Skills showcase stacks on mobile (command list above, preview below).
- Images and faux-UI keep aspect ratio to avoid layout shift.

## 8. Accessibility

- Body text on paper and on dark insets clears WCAG AA. Never put body text on the lime; lime is highlight-behind-dark-text only.
- Every interactive element keyboard-reachable with a visible `:focus-visible` ring (orange, offset).
- The comparison slider and skill rail work with keyboard, not just drag/click.
- Respect `prefers-reduced-motion` on all motion.
- Real landmarks (`nav`, `main`, `section` aria-labels), one `h1`, logical heading order.

## 9. Tech stack (recommended, tunable)

- **Next.js (App Router) + CSS Modules with a CSS-variable token system.** Not utility-class soup. Hand-written CSS keeps craft high and avoids the generic look. Matches the operator's existing Next stack and eases the later MCP wiring + Vercel deploy.
- Self-hosted fonts, preloaded. One route (`/`). No backend this phase.
- A plain single-file `index.html` + CSS is an acceptable alternative if a maximally hand-crafted, framework-free artifact is preferred. Decide at build time; the design is stack-agnostic.

## 10. Out of scope this phase

- MCP server wiring, live tool calls, real data, auth, accounts, deploy. The skill commands, tools, and closing prompt are presentational (the Copy button works, but the prompt it copies is illustrative). We integrate the MCP after this design is finalized and the static site looks right.

## 11. References (what to borrow from each)

- **LazyWeb** (lazyweb.com): the skeleton (hero + terminal, click-to-preview opinionated-skills showcase, before/after slider, stats strip, 2-up pricing, the closing copy-paste prompt block), the fonts (Space Grotesk / Inter / JetBrains Mono), the faint dotted-grid background, and the "context for AI, not AI for X" positioning frame.
- **Hallmark** (usehallmark.com): the anti-slop discipline in section 3, the warm editorial restraint, the "the page is the demo" ethos.
- **67labs** (67labs.co): the warm-neutral palette + token feel, the highlighter-behind-words mechanic, the italic-serif punchline word, pill shapes, 1-degree hover tilt, live faux-UI, slogan tape, and joke microcopy.

Borrow the craft language. Keep the world (UGC) and the voice ours.


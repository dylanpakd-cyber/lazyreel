# LazyReel Landing Site — Implementation Plan

> **For agentic workers:** Build this with the `frontend-design` skill. Follow [DESIGN.md](DESIGN.md) for the visual system and [COPY.md](COPY.md) for verbatim words. Steps use checkbox (`- [ ]`) syntax. Because this is a static marketing page, the acceptance check at each task is a **screenshot at 390 / 768 / 1440px**, not a unit test. Commit after each task.

**Goal:** Build a single-page, hand-crafted marketing site for LazyReel that looks like a real operator made it, not an AI.

**Architecture:** Next.js (App Router). Content lives in one typed `lib/content.ts` module (lifted verbatim from COPY.md); every section is a focused presentational component; only the four genuinely interactive pieces (Skills showcase, Stats count-up, Difference slider, OnePrompt copy block) plus the Terminal/SloganTape animations are client components. A single CSS-variable token system in `globals.css` carries the whole visual language. No utility-class soup, no component library.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · CSS Modules + CSS variables · `next/font/local` (self-hosted woff2: Space Grotesk, Inter, JetBrains Mono, Instrument Serif).

---

## File structure (lock this first)

```
app/
  layout.tsx            # fonts + metadata + <main> wrapper
  globals.css           # token system, base, dotted-grid bg, keyframes
  page.tsx              # composes the sections in order
  page.module.css       # page-level section rhythm + dotted grid
components/
  Nav.tsx / .module.css
  Hero.tsx / .module.css         # includes the Terminal
  Terminal.tsx / .module.css     # client: typewriter + blink
  SloganTape.tsx / .module.css   # CSS-only marquee
  Skills.tsx / .module.css       # client: rail + preview swap (centerpiece)
  Stats.tsx / .module.css        # client: IntersectionObserver count-up
  Difference.tsx / .module.css   # client: drag/keyboard comparison slider
  Tools.tsx / .module.css
  Pricing.tsx / .module.css
  OnePrompt.tsx / .module.css    # client: clipboard Copy button
  Faq.tsx / .module.css          # native <details>
  Footer.tsx / .module.css
  faux/
    HookABCard.tsx
    RewriteDiff.tsx
    NicheTrend.tsx
    ShootBriefReceipt.tsx
lib/
  content.ts            # all copy + the 6 skills data, typed
public/fonts/           # self-hosted woff2
```

Rationale: content separated from presentation (one edit point for words); interactivity isolated to the few client components so the rest stays static and fast; faux-UI widgets are their own small files so they can be reused across hero/skills/difference.

---

## Task 1: Scaffold + token system + fonts

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json` (via `create-next-app`)
- Create: `app/layout.tsx`, `app/globals.css`, `lib/fonts.ts`
- Add: `public/fonts/*.woff2`

- [ ] **Step 1:** Scaffold. Run: `npx create-next-app@latest . --ts --app --no-tailwind --no-src-dir --no-eslint` (we hand-write CSS; no Tailwind on purpose).
- [ ] **Step 2:** Download/self-host the four font families as woff2 into `public/fonts/`, wire them with `next/font/local` in `lib/fonts.ts` (Space Grotesk 500/600/700, Inter 400/500/600, JetBrains Mono 400/500/700, Instrument Serif 400 italic), and apply the CSS variables in `app/layout.tsx`.
- [ ] **Step 3:** Write `app/globals.css` token block verbatim (this is deterministic, use exactly these values):

```css
:root {
  --paper:#FBF8F0; --cream:#F4F0E6; --cream-2:#EAE3D2;
  --ink:#0E0E0C; --ink-2:#1A1916; --ink-3:#2A2925; --mute:#6B6960;
  --highlighter:#D4FF3F; --flag:#FF4D17;
  --line:rgba(14,14,12,.12); --line-2:rgba(14,14,12,.22); --dot:rgba(14,14,12,.10);
  --ink-text:#EDEAE0; --ink-mute:#8A877C; --term-green:#B8F23F;
  --fs-display:clamp(2.75rem,5.5vw + 1rem,5.5rem);
  --fs-h2:clamp(1.9rem,3vw + 1rem,2.75rem); --fs-h3:1.25rem;
  --fs-body:1.0625rem; --fs-label:.75rem;
  --space-xs:.5rem; --space-sm:.75rem; --space-md:1rem; --space-lg:1.5rem;
  --space-xl:2.5rem; --space-2xl:4rem; --space-3xl:6.5rem; --space-4xl:10rem;
  --measure:68ch; --page-max:1240px; --gutter:clamp(20px,4vw,32px);
  --r-card:16px; --r-pill:999px; --r-term:10px;
  --shadow-rest:0 1px 0 var(--line); --shadow-lift:0 18px 40px -24px rgba(14,14,12,.28);
  --ease-spring:cubic-bezier(.2,.7,.2,1); --dur-fast:.18s; --dur:.35s; --dur-slow:.6s;
}
body{ background:var(--paper); color:var(--ink); font-family:var(--font-inter),sans-serif; }
/* faint dotted-grid texture */
.dotgrid{ background-image:radial-gradient(var(--dot) 1px,transparent 1px); background-size:24px 24px; }
```

- [ ] **Step 4:** Add the keyframe library (`popIn`, `blink`, `marquee`, `float`, `pulse`) plus a global `@media (prefers-reduced-motion: reduce)` block that disables transforms/animations and shows final state.
- [ ] **Step 5 (acceptance):** `npm run dev`, open `/`. Screenshot. Expect a warm cream page (`#FBF8F0`) with a faint dotted grid and the four fonts loading without FOUT.
- [ ] **Step 6:** Commit. `git add -A && git commit -m "feat: scaffold + token system + self-hosted fonts"`

## Task 2: Content model

**Files:** Create `lib/content.ts`

- [ ] **Step 1:** Encode every string from COPY.md as typed exports. Define a `Skill` type and a `skills: Skill[]` array of the six skills, each with `{ command, bucket, title, desc, preview }` where `preview` is the sample-output lines for the showcase panel. Also export `nav`, `hero`, `terminalLines`, `slogans`, `stats`, `difference`, `tools`, `pricing`, `onePrompt`, `faq`, `footer`.
- [ ] **Step 2 (acceptance):** `npx tsc --noEmit` passes. The six skill commands are exactly: `/video-ideas`, `/niche-decode`, `/format-teardown`, `/cracked-hooks`, `/shoot-brief`, `/kill-the-slop`.
- [ ] **Step 3:** Commit. `feat: typed content model from COPY.md`

## Task 3: Nav

**Files:** Create `components/Nav.tsx` + `.module.css`

- [ ] **Step 1:** Sticky nav. Left: `LazyReel` wordmark with a CM mark and an orange (`--flag`) slash. Center: 4 links (Skills, How it works, Pricing, FAQ) collapsing below ~720px. Right: a status pill (`● live · listening`, pulsing `--flag` dot) + one primary pill CTA `Get started`. **No more than this — button discipline per DESIGN.md §5.**
- [ ] **Step 2 (acceptance):** Screenshot at 1440 and 390. Desktop shows all links; mobile hides center links, keeps CTA + status pill. Exactly one filled button.
- [ ] **Step 3:** Commit.

## Task 4: Hero + Terminal

**Files:** Create `components/Hero.tsx`, `components/Terminal.tsx` (+ modules)

- [ ] **Step 1:** Centered hero: mono eyebrow `AGENT-FIRST UGC`; H1 `Make your agent an LazyReel.` with "ABG" set in Instrument Serif italic and a lime highlighter swipe behind it; subhead; **two CTAs max** (`Get started` filled pill + `See it work →` text link, not a second filled button); compatibility line. **No agent-mode switcher.**
- [ ] **Step 2:** `Terminal` (client): dark inset (`--ink-2`), faux title bar `lazyreel — zsh`, the `terminalLines` revealed with a typewriter effect and a blinking cursor; line colors per DESIGN.md §6 (command white, prompt orange, `↳` muted, `✓` lime). Reduced-motion shows all lines instantly.
- [ ] **Step 3 (acceptance):** Screenshot at all three widths. The highlighted italic "ABG" reads as the focal point; terminal animates then rests; exactly one filled CTA.
- [ ] **Step 4:** Commit.

## Task 5: Slogan tape

**Files:** Create `components/SloganTape.tsx` + module

- [ ] **Step 1:** CSS-only infinite marquee of `slogans`, `✦` separators, duplicated track for seamless loop, paused under `prefers-reduced-motion`.
- [ ] **Step 2 (acceptance):** Screenshot; scrolls smoothly, no layout shift, no horizontal scrollbar on the page.
- [ ] **Step 3:** Commit.

## Task 6: Skills showcase (centerpiece)

**Files:** Create `components/Skills.tsx` + module, and `components/faux/*` as needed for previews

- [ ] **Step 1:** Two-column layout. Left rail: the six skill rows (mono command, Space Grotesk title, muted one-liner). Selected row gets a lime highlighter mark + left border. Right: a preview panel with a faux report header (`/skill — output`, a `Copy this prompt` affordance) rendering the selected skill's `preview` lines, with `{product}`/`{niche}` placeholder slots styled distinctly (e.g. lime-tinted). First skill selected by default.
- [ ] **Step 2:** Client interactivity: clicking/keyboard (↑/↓ + Enter, `role="tablist"`/`tab`/`tabpanel`) swaps the preview. `Copy this prompt` writes a prompt string to the clipboard and flips to `Copied`.
- [ ] **Step 3 (acceptance):** Screenshot desktop (rail + preview side by side) and mobile (rail above, preview below). Tab through with keyboard only; preview updates; Copy works. This is the section that proves the LazyWeb pattern — it must feel real.
- [ ] **Step 4:** Commit.

## Task 7: Stats strip

**Files:** Create `components/Stats.tsx` + module

- [ ] **Step 1:** Three big Space Grotesk counters + mono labels from `stats` (`12,400+`, `3.4B+`, `6`). Client: IntersectionObserver triggers a single count-up on scroll-in; reduced-motion shows final values immediately.
- [ ] **Step 2 (acceptance):** Screenshot; numbers count once when scrolled into view, then rest at final values.
- [ ] **Step 3:** Commit.

## Task 8: Difference slider

**Files:** Create `components/Difference.tsx` + module

- [ ] **Step 1:** Two stacked comparison cards (WITHOUT = the cringe AI-slop copy; WITH LazyReel = the real hook), a draggable vertical divider with a handle, `aria-label`, and keyboard support (←/→ move the divider). Instruction line `Drag to compare`. H2 with "Better videos." highlighted.
- [ ] **Step 2 (acceptance):** Screenshot mid-drag; works with mouse, touch, and keyboard; the contrast between slop and real copy is obvious.
- [ ] **Step 3:** Commit.

## Task 9: Tools grid

**Files:** Create `components/Tools.tsx` + module

- [ ] **Step 1:** A grid of the six MCP tool cards (mono title + description from `tools`), 1-degree hover tilt, muted footnote. Presentational only.
- [ ] **Step 2 (acceptance):** Screenshot; 2–3 col desktop, 1 col mobile; hover tilt feels springy.
- [ ] **Step 3:** Commit.

## Task 10: Pricing

**Files:** Create `components/Pricing.tsx` + module

- [ ] **Step 1:** Positioning line + H2 with "Free for agents." highlighted, then the clean 2-up cards (For agents / For humans), each a checklist with one CTA. `+` bullets.
- [ ] **Step 2 (acceptance):** Screenshot; two equal cards desktop, stacked mobile; one CTA each.
- [ ] **Step 3:** Commit.

## Task 11: One-prompt closing block

**Files:** Create `components/OnePrompt.tsx` + module

- [ ] **Step 1:** H2 `One prompt. Your agent does the rest.` (last two words highlighted), intro, a dark inset panel holding the `onePrompt` paste text in mono, and a prominent `Copy` button that writes the prompt to the clipboard and flips to `Copied`. Muted footnote. (Prompt text is presentational this phase; the button must actually copy.)
- [ ] **Step 2 (acceptance):** Screenshot; click Copy, confirm clipboard contains the prompt and the label flips to `Copied`.
- [ ] **Step 3:** Commit.

## Task 12: FAQ + Footer

**Files:** Create `components/Faq.tsx`, `components/Footer.tsx` (+ modules)

- [ ] **Step 1:** FAQ as native `<details>`/`<summary>` (min 48px targets, chevron rotates on open) from `faq`. Footer: huge kicker `Stay online. Ship video.`, three link columns, mono legal kicker.
- [ ] **Step 2 (acceptance):** Screenshot; disclosures open/close via keyboard; footer kicker is the largest type on the page after H1.
- [ ] **Step 3:** Commit.

## Task 13: Compose the page

**Files:** Modify `app/page.tsx`, `app/page.module.css`

- [ ] **Step 1:** Compose all sections in DESIGN.md §5 order: Nav, Hero, SloganTape, Skills (`01`), Stats (`02`), Difference (`03`), Tools (`04`), Pricing (`05`), OnePrompt (`06`), Faq (`07`), Footer. Apply the dotted-grid background, section rhythm (`--space-3xl` between sections), `--page-max` container, full-width hairline rules, and mono numbered section labels.
- [ ] **Step 2 (acceptance):** Full-page screenshot at 1440. Order matches; rhythm is even; the lime accent appears only as highlights (audit: no lime button fills, no gradients, no purple).
- [ ] **Step 3:** Commit.

## Task 14: Faux-UI illustrations

**Files:** Finish `components/faux/HookABCard.tsx`, `RewriteDiff.tsx`, `NicheTrend.tsx`, `ShootBriefReceipt.tsx`; place 2–3 in hero/skills/difference

- [ ] **Step 1:** Build the four widgets per DESIGN.md §6 (each with subtle micro-motion: ticking CTR pill, pulsing live dot, etc.), reduced-motion safe. Place a couple so the page has believable product UI instead of stock graphics.
- [ ] **Step 2 (acceptance):** Screenshot; widgets read as real UGC dashboards/diffs, breathe subtly, and don't cause layout shift.
- [ ] **Step 3:** Commit.

## Task 15: Responsive + motion + a11y pass

- [ ] **Step 1:** Walk 390 / 768 / 1440. Fix any horizontal scroll, overflow, or tap-target-under-44px. Verify reading order on mobile matches DESIGN.md §7.
- [ ] **Step 2:** Toggle OS reduced-motion; confirm every animation (terminal, marquee, count-up, tilt, faux-UI) has a static fallback.
- [ ] **Step 3:** Keyboard-only pass: nav, skill rail (tabs), difference slider, FAQ, all CTAs reachable with a visible orange focus ring. Run a contrast check on body text over paper and over the dark insets (must clear AA).
- [ ] **Step 4 (acceptance):** Screenshots at all three widths in both motion modes; a short note confirming keyboard + contrast pass.
- [ ] **Step 5:** Commit.

## Task 16: Final slop audit (the thesis test)

- [ ] **Step 1:** Run DESIGN.md §3 as a literal checklist against the built page: warm neutrals (no pure #fff/#000), one highlighter accent (not button fill, no gradient), two type faces with the italic-serif punchline, biased layout where it earns it, springy purposeful motion, believable faux-UI (no stock blobs), restraint. Fix any violation.
- [ ] **Step 2 (acceptance):** A pass/fail line per rule. The page must not look AI-generated, or it fails its own pitch.
- [ ] **Step 3:** Commit. `chore: pass the anti-slop audit`

---

## Self-review (spec coverage)

- One agent / no switcher → Task 4 §1. ✓
- Button discipline → Task 3 §1, Task 4 §1, component spec. ✓
- 6 skills mapped to video buckets, no editing → Task 2 + Task 6. ✓
- Click-to-preview real report with placeholder slots + Copy → Task 6. ✓
- Same-prompt-better-context → Task 8. ✓
- Closing copy-paste prompt that "just works" → Task 11. ✓
- Warm-light visual system, fonts, dotted grid → Task 1. ✓
- MCP deferred / presentational → Tasks 9 & 11 note presentational; no wiring task. ✓

## Out of scope (do not build this phase)

MCP server wiring, live tool calls, real tokens, auth, deploy. Reconcile the human-facing skill names (`/video-ideas` etc.) with the wire tool names (`search_video_patterns` etc.) when the MCP phase starts.

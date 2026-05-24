// frameworks.ts — the encoded knowledge base behind every ABG CMO skill.
// Sourced from real DTC/UGC scripting playbooks: 12 named script frameworks,
// a 13-pattern hook taxonomy, 6 proven UGC angles, awareness/sophistication
// models, and a hard anti-slop bar. Skills compose these into outputs.

export type ScriptFramework = {
  id: string;
  name: string;
  acronym: string;
  beats: string[]; // ordered story beats
  bestFor: string;
};

// The 12 named scripting frameworks (Scripting Frameworks 2026).
export const SCRIPT_FRAMEWORKS: ScriptFramework[] = [
  { id: "bandwagon", name: "Bandwagon", acronym: "CROWD",
    beats: ["Call out the movement", "Reject the old way", "Onboard the new way", "Wave the proof", "Direct the viewer"],
    bestFor: "Trend-backed products with visible social proof" },
  { id: "contrarian", name: "Industry Contrarian", acronym: "DISRUPT",
    beats: ["Declassify the secret", "Industry failure", "Solution", "Reinforce with evidence", "Upstage the competition", "Provide proof", "Trigger the movement"],
    bestFor: "Myth-busting, 'what they don't want you to know' angles" },
  { id: "listicle", name: "Listicle", acronym: "CURE",
    beats: ["Curiosity (list hook)", "Uncover the failures", "Remedy", "Evidence", "Engage"],
    bestFor: "'3 reasons your X isn't working' education plays" },
  { id: "founder", name: "Founder", acronym: "FOUNDER",
    beats: ["Feature the founder", "Opposing force", "Unlocking the idea", "Numbers", "Destiny", "Engage the movement"],
    bestFor: "Mission-led, identity-driven brand story" },
  { id: "without", name: "X Without Y", acronym: "SIMPLE",
    beats: ["State the escape", "Identify the pain", "Minimal solution", "Prove (because → so)", "Lifestyle win", "Escape CTA"],
    bestFor: "Shortcut buyers who want the result without the effort" },
  { id: "organic", name: "Organic", acronym: "PURE",
    beats: ["Problem uncovered", "Unfiltered chaos (2-3 real scenarios)", "Real evidence (the genuine 'aha')", "Effortless freedom"],
    bestFor: "Authentic day-in-the-life proof, feels un-produced" },
  { id: "pas", name: "Problem-Agitate-Solution", acronym: "PAS",
    beats: ["Problem (loss aversion)", "Agitate (social-proof gap)", "Solution (certainty anchor + identity shift)"],
    bestFor: "A nameable, felt pain point" },
  { id: "ugly", name: "Ugly Ads", acronym: "UGLY",
    beats: ["Make it SIMPLER (5-words-or-less cards)", "Show it CHEAPLY ($0 phone footage)", "Do the OPPOSITE of competitors", "Lean into unflattering reality"],
    bestFor: "Pattern-break in a polished, over-produced category" },
  { id: "objections", name: "Founder Objections", acronym: "PROVE",
    beats: ["Problem", "Reframe", "Objection", "Victory", "Expand"],
    bestFor: "Skeptical markets that have been burned before" },
  { id: "usvsthem", name: "Us vs Them", acronym: "SHOW",
    beats: ["Set the challenge", "Head-to-head showdown (split screen)", "Outcome & why", "Win & CTA"],
    bestFor: "Demonstrable, visual superiority over an alternative" },
  { id: "tripleg", name: "Triple G", acronym: "GOAL-GAP-GAINS",
    beats: ["Goal (the desired outcome)", "Gap (what's missing today)", "Gains (the bridge + payoff)"],
    bestFor: "Aspiration / transformation / new-year energy" },
  { id: "tease", name: "Tease (Curiosity Loop)", acronym: "TEASE",
    beats: ["Tease (impossible/surprising claim)", "Engage (the story)", "Advantage (stack the benefits)", "Satisfy (close the loop)", "Encourage (CTA + bonus)"],
    bestFor: "Curiosity-loop storytelling that demands a watch-through" },
];

export type HookPattern = {
  id: string;
  name: string;
  template: string;
  example: string;
};

// The 13-pattern hook taxonomy (POPPY market-research prompt).
export const HOOK_PATTERNS: HookPattern[] = [
  { id: "pov", name: "POV / recognition", template: "POV: {a too-real moment the buyer lives}", example: "POV: it's 7pm and your mascara looks exactly like it did at 7am." },
  { id: "belief", name: "Belief-challenging", template: "I thought {common belief}. I was wrong about {this}.", example: "I thought all mascara smudged by lunch. Not this one." },
  { id: "callout", name: "Direct call-out", template: "To the {avatar} who has tried everything — this is for you.", example: "For the girlies checking their under-eyes every 2 hours — this is for you." },
  { id: "beforeafter", name: "Before / after", template: "{the before state} → {the after state}", example: "Sweaty 90-minute workout. Same eyeliner I put on at 6am." },
  { id: "size", name: "Size-of-claim", template: "{a big, specific number}", example: "92 of the 102 minerals your body actually needs — in one scoop." },
  { id: "speed", name: "Speed-of-claim", template: "{result} in {surprisingly short time}", example: "Dinner-table-ready skin in the 4 minutes before they arrive." },
  { id: "authority", name: "Authority figure", template: "Why {experts} quietly {do this}", example: "Why anti-aging researchers reach for copper peptides, not collagen." },
  { id: "removelimit", name: "Removing limitations", template: "{result} — even if {the usual disqualifier}", example: "Clear skin even if you've never kept a routine past day 3." },
  { id: "question", name: "Question-based", template: "{a question the buyer can't not answer}", example: "Still failing at hydration in 2026? It's not the water." },
  { id: "howto", name: "Information-offering", template: "How to {outcome} in {year/constraint}", example: "How to actually film a UGC ad in one afternoon, no studio." },
  { id: "newness", name: "Newness", template: "The {category} thing nobody's talking about yet", example: "The matcha format quietly eating every beauty page right now." },
  { id: "exclusivity", name: "Exclusivity", template: "The only {category} that actually {does the job}", example: "The only lash serum that survived my 5am-to-midnight days." },
  { id: "contrast", name: "Comparing to rivals", template: "{the rival way} vs {your way}", example: "$220 serum vs the $30 one dermatologists keep re-buying." },
];

export type Angle = {
  id: string;
  name: string;
  shots: number;
  note: string;
};

// The 6 proven UGC angles + shot counts (seedance-ugc-ads / angles.md).
export const ANGLES: Angle[] = [
  { id: "hold-and-show", name: "Hold and show", shots: 3, note: "Safest. Hands hold the product, talk to camera. Dodges application hallucination." },
  { id: "unboxing", name: "Unboxing", shots: 3, note: "First-touch reaction; product reveal lands in shot 2." },
  { id: "testimonial", name: "Testimonial", shots: 4, note: "'I tried everything, then this.' Pain → switch → result." },
  { id: "lifestyle-demo", name: "Lifestyle demo", shots: 5, note: "Product woven into a real moment. Never exceed 5 shots." },
  { id: "problem-solution", name: "Problem / solution", shots: 4, note: "Show the stuck state first, then the fix." },
  { id: "before-after", name: "Before / after", shots: 3, note: "The transformation, with the 'that's the difference' beat." },
];

// 5 visual approaches an idea can take (POPPY).
export const VISUAL_APPROACHES = [
  "picture of the problem (show the stuck state)",
  "picture of the benefit (show the after-life)",
  "picture of the product (clean hero)",
  "product-in-action (the mechanism, visible)",
];

// Awareness ladder (Schwartz / POPPY) — which angle fits the buyer's awareness.
export const AWARENESS = [
  { level: 1, name: "Completely Unaware", play: "Lead with story or curiosity; never name the product first." },
  { level: 2, name: "Problem-Aware", play: "Name the pain in their words; agitate before you solve." },
  { level: 3, name: "Solution-Aware", play: "Show the mechanism — why THIS solution, not the category." },
  { level: 4, name: "Product-Aware", play: "Differentiate; handle the objection that's keeping them out." },
  { level: 5, name: "Most Aware", play: "Offer, urgency, proof. They just need a reason to act now." },
];

// Market sophistication (how tired the market is of the claim).
export const SOPHISTICATION = [
  { level: 1, name: "Virgin market", play: "State the claim plainly; you're first." },
  { level: 2, name: "Claim escalates", play: "Be bigger/faster/more specific than the last guy." },
  { level: 3, name: "Mechanism era", play: "Lead with HOW it works — a new named mechanism." },
  { level: 4, name: "Mechanism escalates", play: "Better/faster/easier mechanism; depositioning competitors." },
  { level: 5, name: "Skeptical / burned", play: "Identity + reframe. They don't believe claims anymore." },
];

// The hard anti-slop bar (consolidated across all sources).
export const BANNED_WORDS = [
  "revolutionary", "supercharge", "game-changing", "game-changer", "transform your life",
  "transformed my routine", "experience the difference", "introducing our new", "unlock the power",
  "elevate your", "seamless", "innovative", "stunning", "breathtaking", "epic", "unleash",
];

export const VOICE_RULES = [
  "Talk like a person texting, not a brand writing. Contractions, filler ('honestly', 'like', 'so basically'), fragments are fine.",
  "Customer-first, never brand-first. The viewer doesn't know or care about the brand — only their own problem.",
  "Specificity is the whole game. Numbers, timelines, concrete scenarios beat adjectives.",
  "Show the mechanism, not just the claim. HOW it works builds belief; 'it works' doesn't.",
  "Calm beats hype. Documentary, slightly serious. If it sounds like a YouTuber shouting, it's wrong.",
  "Share, don't sell. The subject shares an experience; CTAs are implicit ('link in bio'), never 'Shop now'.",
  "Open a curiosity gap, don't spoil it. A hook that states the payoff is dead.",
  "Realism over polish. Imperfect framing, visible pores, a real apartment — these are trust signals.",
  "Sound-off survival. The first line must land via on-screen caption alone.",
  "Product name appears in shot/beat 2-3, never the first line.",
];

// UGC video prompt modifiers that read as real, not AI.
export const UGC_MODIFIERS = [
  "iPhone handheld", "natural window light", "slight camera shake", "selfie-style arm extension",
  "imperfect framing", "natural skin texture, visible pores", "real apartment not staged", "9:16 vertical",
];

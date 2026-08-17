---
name: Econova Hub
description: Glassmorphic sky-blue marketplace where digital creators sell and share resources
colors:
  clear-sky: "#3b82f6"
  sky-haze: "#dbeafe"
  dawn-sky: "#eff6ff"
  horizon-blue: "#bfdbfe"
  midnight-slate: "#1e293b"
  overcast-gray: "#64748b"
  cloud-white: "#ffffff"
typography:
  display:
    fontFamily: "'ONE DAY', sans-serif"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "'ONE DAY', sans-serif"
    fontWeight: 700
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    lineHeight: 1.2
  title:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 600
    fontSize: "0.875rem"
    letterSpacing: "0.05em"
    textTransform: "uppercase"
  body:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 300
    fontSize: "1rem"
    lineHeight: 1.625
  label:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 600
    fontSize: "0.75rem"
    letterSpacing: "0.15em"
    textTransform: "uppercase"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.clear-sky}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.md}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.clear-sky}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.md}"
    padding: "14px 32px"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.6)"
    textColor: "{colors.midnight-slate}"
    rounded: "{rounded.md}"
    padding: "14px 32px"
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.5)"
    textColor: "{colors.midnight-slate}"
    rounded: "{rounded.lg}"
    padding: "28px"
  pill:
    backgroundColor: "{colors.sky-haze}"
    textColor: "{colors.clear-sky}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
  input-field:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.midnight-slate}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: Econova Hub

## Overview

**Creative North Star: "The Sky Harbor"**

Econova Hub is a marketplace floating in a clear blue sky: glass panels, soft drifting light, and a single vivid blue runway for action. The system pairs a frosted, translucent surface layer (half-transparent white cards, heavy backdrop blur, hairline white borders) with one saturated accent family of sky blues, and reserves its most energetic expression — an animated blue-to-cyan gradient sweep — for the moments that ask creators to act: the logo, the primary CTA, the step badges. Depth here is meteorological, not architectural: blobs of light drift behind the glass, shadows are tinted blue like a reflection on water, and everything rests on pale gradient skies that shift slowly from dawn white to haze blue.

The type system speaks in two voices: ONE DAY, a confident, slightly playful display face (assumed — no accented glyphs, so Spanish headlines are deliberately written without diacritics), carries every headline, the logo, and the hero CTAs; Poppins in light weights carries all explanation, labels, and interface text. Copy is Spanish-first, with uppercase tracking-widest Poppins kickers above every section. Density is airy: 80–96px section padding, 12–16px radius on every interactive edge, generous internal padding, and cards that hover-lift 8px when you reach for them. This is a system where trust reads as clarity — nothing heavy, nothing opaque, nothing louder than the one blue button.

**Key Characteristics:**
- Frosted glass surfaces (`bg-white/50`, `backdrop-blur-xl`, `border-white/30`) over pale blue skies, never solid fills in light sections
- One saturated accent: a vivid sky blue (#3b82f6) that becomes a 3-stop blue→cyan gradient on action accents
- ONE DAY for display, Poppins Light for body — two voices that never trade places
- Everything drifts: floating blobs, floating glass tags, tilt-float illustrations, a slow-shifting page gradient
- Tinted blue shadows on light surfaces; deep slate (#1e293b) used only for the closing CTA band and footer
- Uppercase, tracking-widest Poppins kickers (`text-sm`, `tracking-widest`) above every section heading

## Colors

A pale sky with one strong blue: everything is a shade of daylight, from dawn white through haze blue to a single vivid signal blue.

### Primary
- **Clear Sky Blue** (#3b82f6, called `rose-elegant` in code): the system's single saturated accent. Used for the primary CTA gradient start, section kickers, pill text and dots, icon chips, plan-card highlights, links and focus rings. It never covers large areas — it punctuates.
- **Clear Sky Blue → Cyan Gradient** (from #3b82f6 via blue-500 to #06b6d4, `from-rose-elegant via-blue-500 to-cyan-500`): the signature action sweep. Applied to primary buttons, the logo wordmark, hero keyword spans, step-number badges, and the glass-lifted CTA on the dark band. Two companion keys of the sweep — **Light Sky** (#60a5fa, `blue-400`) and **Soft Cyan** (#67e8f9, `cyan-300`) — appear only on dark backgrounds (footer logo, footer link hovers).

### Secondary
- **Sky Haze** (#dbeafe, `rose-soft`): the softest usable blue; pill fills, selected/state backgrounds, hero pill borders, creator-page hero washes, and the midpoint of every section gradient.
- **Dawn Sky** (#eff6ff, `rose-light`): near-white blue; the lightest section-gradient bottom stops and the 404 page background.
- **Horizon Blue** (#bfdbfe, `rose-border`): hairline borders on light-blue treatments (selected FAQ item, creator-page borders).

### Neutral
- **Midnight Slate** (#1e293b, `text-dark`): the ink for all headings and body text on light; also the dark band itself — the CTA section, footer, and creator-page "secondary" buttons are filled with this exact value. Its gradient partner **Deep Navy** (#172554, `blue-950`) tops the CTA band's gradient.
- **Overcast Gray** (#64748b, `text-gray`): secondary/description text at 60–80% opacity, placeholder text at 40%.
- **Cloud White** (#ffffff): page background, card fills at 50–70% opacity, and the lone solid-white CTA button on the dark band.

### Named Rules
**The Sky Saturation Rule.** Full-chroma Clear Sky Blue appears only as small fills (pills, chips, badges), button gradients, and text accents — never as a large background field. Large areas are always the pale haze family at 30–60% opacity over white.
**The One Gradient Rule.** The Clear Sky → Cyan sweep is reserved for primary CTAs, the logo wordmark, hero keyword spans, step badges, and icon-chip fills. It never appears on body copy, card backgrounds at rest, or any surface that is not asking for a click.

## Typography

**Display Font:** ONE DAY (local `public/ONEDAY.otf`, loaded via `@font-face`)
**Body Font:** Poppins (300–700, Google Fonts via `--font-poppins`)
**Fallbacks:** Geist Sans (`--font-geist-sans`) for the global body default; Arial/Helvetica sans-serif as final fallback.

**Character:** ONE DAY is the loud, friendly megaphone — bold statements in display sizes with a 1.1 line height, used verbatim for headlines and buttons. Poppins is the calm narrator: light-weight body copy, semibold uppercase micro-labels. The pairing is megaphone-then-whisper: every section announces itself in ONE DAY and explains itself in Poppins Light.

### Hierarchy
- **Display** (ONE DAY, 700, `clamp` text-3xl→6xl / 1.1): the hero `h1`, the logo wordmark, and CTA-band headlines. The hero `h1` mixes midnight-slate spans with a gradient-text span on the key phrase.
- **Headline** (ONE DAY, 700, text-3xl→4xl / 1.2): every section `h2` ("¿Por que Econova Hub?", "Como funciona") and FAQ title.
- **Title** (Poppins, 600, 14px, 0.05em tracking, uppercase): card titles, nav links (Poppins 400, uppercase, `tracking-wider`), step titles, plan names.
- **Body** (Poppins, 300, 16–18px, 1.625 `leading-relaxed`, max ~45ch): hero subtitle, section intros, card descriptions at 11–12px with 70–80% Overcast Gray.
- **Label** (Poppins, 600, 12–14px, 0.15em `tracking-widest`, uppercase): section kickers ("Para creadores", "Todo en un solo lugar"), footer column headings.

### Named Rules
**The No-Accent Rule.** ONE DAY ships no accented glyphs (assumption, observed in implementation). Spanish headlines set in ONE DAY are written without diacritics — "mas facil", "Como funciona". Never force an accented character into a ONE DAY headline; drop the diacritic instead.
**The Two-Voice Rule.** ONE DAY announces, Poppins explains. Never set body copy or card descriptions in ONE DAY; never set a section `h2` or the logo in Poppins.

## Layout

A single centered column, max-width 1280px (`max-w-7xl`) with `px-4 sm:px-6 lg:px-8` gutters; the FAQ and step grids narrow to `max-w-5xl`, plan grids to `max-w-2xl`–`max-w-5xl` depending on column count. Sections breathe at 80–96px vertical padding (`py-20`/`py-24`) with a 64px gap between heading block and grid (`mb-16`).

- **Grids:** 4-column benefit grid (`lg:grid-cols-4`, gap 24px), 2-column feature grids (`sm:grid-cols-2`, gap 12px) for creator/client mini-cards, asymmetric hero (`lg:grid-cols-[60fr_40fr]`, gap 48px), and a 3-step grid (`lg:grid-cols-3`, gap 32px).
- **Navbar rhythm:** fixed glass pill anchored `top-3` with `left-4 right-4`, 64px tall, `max-w-7xl`; on scroll it tightens to `max-w-5xl` and 56px tall (`h-16 → h-14`) while the fill shifts from `bg-blue-50/60` to `bg-white/40`.
- **Responsive:** desktop-only illustrations (undraw SVGs, floating glass tags) collapse at `lg`; grids collapse 4→2→1; the hero text centers below `lg`. Mobile navigation is a hamburger revealing a matching glass panel (`bg-white/50`, `rounded-2xl`, `border-white/30`).
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32px, sections at 96px; cards pad 16–32px internally (`p-4` mini-cards, `p-7`/`p-8` large cards and plans).

## Elevation & Depth

Hybrid: glass and light before shadow. Depth is conveyed first by translucency — surfaces are 40–70% white with `backdrop-blur-xl` to `backdrop-blur-2xl`, so the page's pale gradient sky and drifting blobs actually show through the panels — and second by *tinted* shadows, blue-tinged like reflections on water. Solid, opaque depth exists only on the dark band: the CTA/footer in Midnight Slate with blurred blue glow orbs (`bg-blue-500/15 blur-3xl`) and a `blue-950` gradient top.

### Shadow Vocabulary
- **Glass Rest** (`shadow-xl shadow-rose-elegant/10` — `0 20px 25px -5px rgba(59,130,246,0.10), 0 10px 10px -5px rgba(59,130,246,0.05)`): default on every glass card and glass tag.
- **Glass Lifted** (`hover:shadow-2xl shadow-rose-elegant/20` — `0 25px 50px -12px rgba(59,130,246,0.20)`): paired with `hover:-translate-y-2` on interactive cards.
- **CTA Glow** (`shadow-xl shadow-rose-elegant/20` — `0 20px 25px -5px rgba(59,130,246,0.2), 0 10px 10px -5px rgba(59,130,246,0.05)`): under every primary gradient button, plus the expanding `btn-pulse` ring.
- **Nav Float** (`shadow-lg shadow-rose-elegant/5`): a whisper under the floating navbar.
- **Deep Ink** (`shadow-2xl`): the white CTA button on the dark band; the only black-strength shadow in the system.
- **Illustration Drop** (`drop-shadow-2xl`): under hero and section undraw SVGs.

### Named Rules
**The Glass-Over-Shadow Rule.** Depth is frost and glow first: `backdrop-blur`, translucent white fills, blurred light blobs, tinted blue shadows. Hard, dark shadows are reserved for the dark band — nowhere else.
**The One-Pulse Rule.** At most one pulsing element per viewport: the hero's primary CTA `btn-pulse` ring (plus the 2s blinking status dot inside the hero pill). Everything else floats, never pulses.

## Shapes

Soft and uniformly generous: 12px radius (`rounded-xl`) on every button, input, nav link, small card, and FAQ item; 16px radius (`rounded-2xl`) on the navbar pill, large cards, step cards, floating glass tags, and icon chips; 8px (`rounded-lg`) only on the tiny info badge in the dark CTA; full-radius pills (`rounded-full`) for section kickers, step badges, format chips, and avatars. Borders are hairline whites (`border-white/30`–`/50`) on glass, `border-rose-soft/50` on solid white plan cards, and `border-2` Clear Sky Blue only to crown the "most sold" plan. Light glass cards sit on a subtle 3D tilt (`perspective(800px) rotateX(1–2deg)`), which straightens into an 8px hover lift.

## Components

### Buttons
- **Shape:** gently rounded rectangle (12px), full-width on plan cards, inline-flex elsewhere with an arrow icon on the right.
- **Primary:** the Clear Sky → Cyan gradient sweep, white text, 14px vertical / 28–32px horizontal padding, `shadow-xl` CTA glow, bold ONE DAY (hero) or Poppins 600 (small CTAs). Animated: `btn-pulse` ring (2s) + `btn-gradient` background drift (3s). Hover `scale(1.02)`, active `scale(0.98)`, hover dims to `opacity-90` in nav size.
- **Secondary / Ghost:** frosted white (`bg-white/60`, `backdrop-blur-md`, `border-white/40`) with midnight-slate ONE DAY text, `shadow-sm`, hover `bg-white/80` — used beside the primary in hero and sections.
- **Dark-band CTA:** the only solid-white button in the system (`bg-white`, Clear Sky text, `shadow-2xl`, `btn-pulse`), plus a frosted outline partner (`bg-white/10`, `border-2 border-white/20`).
- **Creator pages:** solid Clear Sky (`bg-rose-elegant`, hover `/90`); dark "Comprar ahora" buttons in Midnight Slate for non-popular plans.

### Chips / Pills
- **Style:** `rounded-full`; section kickers are sky-haze fills (`bg-rose-soft/80`, `backdrop-blur-md`, `border-rose-soft`) with a pulsing Clear Sky dot; step badges and plan badges are the full gradient sweep with white text; format chips on creator pages are sky-haze fills with Clear Sky text.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** `bg-white/50` with `backdrop-blur-xl` (glass); solid white only on creator-page plan and problem/solution cards.
- **Border:** `border-white/30` on glass; `border-rose-soft/50` on solid white; `border-2 border-rose-elegant` on the featured plan.
- **Shadow Strategy:** Glass Rest at rest, Glass Lifted + 8px lift on hover (see Elevation).
- **Internal Padding:** 16px mini feature cards, 28–32px benefit, step, and plan cards.
- **Icon chips:** 48–56px, `rounded-2xl`, `bg-rose-elegant/15`, `shadow-lg`; on hover they scale 110% and rotate 6° over 500ms.

### Inputs / Fields
- **Style:** solid white (`bg-white`), 1px `border-gray-200` (#e2e8f0), 12px radius, 10px/12px padding, Poppins 14px, placeholder Overcast Gray at 40%.
- **Focus:** Clear Sky border (`focus:border-rose-elegant`), outline removed — the border is the signal.

### Navigation
- **Style:** a floating glass pill (`rounded-2xl`, `backdrop-blur-2xl`, `border-white/30`, `bg-blue-50/60 → bg-white/40` on scroll). Logo is the ONE DAY wordmark in the signature gradient; desktop links are uppercase Poppins 400, 14px, `px-4 py-2 rounded-xl`, `hover:bg-white/40`; the account CTA is the mini gradient button. Mobile collapses to a hamburger + full glass dropdown panel. Creator pages use a slimmer bar (`bg-white/80 backdrop-blur-md border-b border-rose-soft/30`) with a solid Clear Sky "Comprar" button.

### Step / Benefit Cards (signature pattern)
Numbered step badges float at the card's top-left corner in the signature gradient; icon chips alternate `bg-rose-elegant/15` fills and full gradient washes (`from-rose-elegant/20 via-blue-500/20 to-cyan-500/20`) with a slow float animation on step icons. Titles are uppercase Poppins 600; descriptions are 11–12px Poppins 300 at 70–80% gray.

### FAQ (signature pattern)
Native `<details>` accordions: glass treatment, 12px radius; the first item opens by default with a `bg-blue-50/60 border-blue-200` tint and Clear Sky summary text; closed items are `bg-white/50 backdrop-blur-md border-white/30` with midnight-slate summaries. The chevron rotates 180° on open; the answer sits under a `border-white/20` divider in 12px Poppins 300 gray.

## Do's and Don'ts

### Do:
- **Do** build light-section surfaces from frosted glass (`bg-white/50`, `backdrop-blur-xl`, `border-white/30`) — the sky gradient and blobs must show through.
- **Do** reserve the Clear Sky → Cyan gradient sweep for the logo, primary CTAs, step badges, and hero keyword spans.
- **Do** set every headline and hero CTA in ONE DAY, and every paragraph, label, and card description in Poppins (body 300, titles 600).
- **Do** write Spanish ONE DAY headlines without diacritics ("Como funciona", "mas facil") — the face has no accented glyphs.
- **Do** kick sections with an uppercase, `tracking-widest` Poppins label in Clear Sky Blue.
- **Do** lift interactive cards 8px on hover with the tinted shadow deepening from `/10` to `/20`, and scale primary buttons 1.02→0.98.
- **Do** keep at most one pulsing element per viewport.
- **Do** paint the closing CTA and footer Midnight Slate with blurred blue glow orbs and a solid-white CTA button.

### Don't:
- **Don't** set body copy, card descriptions, or nav links in ONE DAY.
- **Don't** fill large background areas with saturated blue — large fields stay in the pale haze family at low opacity.
- **Don't** apply the gradient to body text, card fills, or any surface that isn't an action accent.
- **Don't** use hard black shadows on light surfaces — shadows are tinted blue at 5–20% opacity.
- **Don't** add more than one pulsing element (pulse rings, blinking dots) to a single viewport.
- **Don't** force accented characters into ONE DAY headings — the glyphs do not exist and will render as fallback.
- **Don't** use solid opaque fills in light sections; only creator-page plan cards, inputs, and the dark band may be opaque.
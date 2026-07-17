# Marketing Mojito — Homepage Redesign Prompt

*(Paste this into Claude together with the attached full-page screenshots — desktop and mobile — of the current marketingmojito.com homepage.)*

---

## 1. ROLE & OBJECTIVE

You are a **senior UI/UX designer and front-end engineer**. Redesign the **Marketing Mojito homepage** shown in the attached screenshots and output a **production-ready, fully responsive front-end**.

Keep the brand — the green/lemon "mojito" identity, the real copy, and all existing sections — but **elevate the execution to premium-agency quality**. The single most important fix is the **non-standardized, "haywire" typography**: the current site inherits a broken Webflow type system where headings render at desktop size on phones and overflow. You will replace it with one disciplined, token-driven design system.

Match the screenshots for layout and content intent, then apply every fix in this brief. Where the screenshots and this brief conflict, **this brief wins**.

---

## 2. PRODUCT & BRAND CONTEXT

- **Business:** Marketing Mojito — a full-service digital marketing agency in India. Services: SEO, content, paid/PPC, social, branding & visual identity, motion graphics, video production, websites & e-commerce. Audience: startups, D2C, SaaS, and established brands across healthcare, real estate, hospitality, and entertainment.
- **Homepage goal:** Build credibility and drive the primary action — **"Book a Free 15-min Strategy Call" / "Contact Us."**
- **Brand personality:** Playful-premium "mojito" visual language — lime/lemon slices, lime-slice hot-air balloons, mint leaves, a 3D lightbulb, soft clouds. Refined and disciplined, never cluttered.
- **Theme:** LIGHT by default (white / `#f5f5f5`), with a working light/dark toggle (sun/moon icon, top-right).
- **Colors:** primary green `#82c341` (logo, CTAs, accents); pop lemon-yellow `#fdb913` (sparing accent only); neutrals `#353535`, near-black `#1c1c1c`, muted `#474747`.
- **Type:** **Unbounded** (geometric) for display/headings; **Poppins** for body/UI. No new fonts, no new brand colors.

---

## 3. DESIGN SYSTEM

This is the centerpiece. Rebuild the type and layout system from scratch as CSS custom properties — **do not carry forward any legacy Webflow CSS.**

### Global implementation rules (no exceptions)
- Define **ONE** canonical scale in `:root`. Every heading, class, and Webflow leftover (`.who-para`, `.text-18`, `.heading-style-h3`, `.text-block-*`) maps to a role token — no element carries its own ad-hoc size.
- **Delete the Webflow fluid-rem hack:** set `html{font-size:100%}` (16px) once. Never redeclare `html{font-size:…vw}` per breakpoint.
- **Strip every `!important` size override** (`h1{font-size:3.5rem!important}`, h2 3rem, h3 2.5rem, etc.). Fluid `clamp()` replaces all per-breakpoint font-size media queries.
- **Zero duplicate size declarations** — one rule per role. Remove the conflicting `.who-para` (1.5/2.5/2.8/1.6rem), `.text-18` (1rem + 1.5rem), and the ~6 `.heading-style-h3` base rules.

### 3.1 Typography

```css
--font-display: "Unbounded", ui-sans-serif, system-ui, sans-serif; /* headings only */
--font-body:    "Poppins",  ui-sans-serif, system-ui, sans-serif;  /* everything else */
```

Fluid scale — copy verbatim into `:root`:
```css
--fs-display: clamp(2.25rem, 1.40rem + 3.80vw, 3.50rem); /* H1  36 → 56 */
--fs-h2:      clamp(1.875rem, 1.20rem + 3.00vw, 3.00rem); /* H2  30 → 48 */
--fs-h3:      clamp(1.50rem, 1.05rem + 2.00vw, 2.50rem);  /* H3  24 → 40 */
--fs-h4:      clamp(1.25rem, 1.10rem + 0.60vw, 1.50rem);  /* H4  20 → 24 */
--fs-eyebrow: clamp(0.75rem, 0.72rem + 0.08vw, 0.8125rem);/* 12 → 13 */
--fs-body-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem);/* 18 → 22 */
--fs-body:    clamp(1.00rem, 0.96rem + 0.15vw, 1.0625rem);/* 16 → 17 */
--fs-small:   clamp(0.8125rem, 0.79rem + 0.10vw, 0.875rem);/* 13 → 14 */
--fs-button:  clamp(0.9375rem, 0.90rem + 0.10vw, 1.00rem);/* 15 → 16 */
```

Per-role spec:

| Role | Token | Family | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| Display / H1 | `--fs-display` | Unbounded | 700 | 1.05 | −0.02em | — |
| H2 | `--fs-h2` | Unbounded | 500 | 1.10 | −0.01em | — |
| H3 | `--fs-h3` | Unbounded | 500 | 1.15 | −0.01em | — |
| H4 / small heading | `--fs-h4` | Unbounded | 500 | 1.25 | 0 | — |
| Eyebrow / label | `--fs-eyebrow` | Poppins | 600 | 1.0 | **0.10em** | **UPPERCASE** |
| Body-lg (hero sub, lead) | `--fs-body-lg` | Poppins | 400 | 1.55 | 0 | — |
| Body | `--fs-body` | Poppins | 400 | 1.60 | 0 | — |
| Small / caption | `--fs-small` | Poppins | 400 | 1.50 | 0 | — |
| Button | `--fs-button` | Poppins | 600 | 1.0 | 0.01em | — |

Rendered sizes (proves mobile overflow is gone — headings now shrink):

| Role | ≤480px | ≤768px | Desktop ≥1280 |
|---|---|---|---|
| H1 | 36px | 44px | **56px** |
| H2 | 30px | 40px | **48px** |
| H3 | 24px | 31px | **40px** |
| H4 | 20px | 21px | **24px** |
| Body-lg | 18px | 20px | **22px** |
| Body | 16px | 16px | **17px** |

Guardrails: `body{font-family:var(--font-body);font-size:var(--fs-body);line-height:1.6}`; headings default to `--font-display`; `text-wrap:balance` on H1–H3; `overflow-wrap:anywhere` on H1 as an anti-overflow backstop; cap body measure at `max-width:65ch`. Load Unbounded and Poppins with `font-display:swap`, subset, and explicit fallbacks — no invisible-text flash, no layout shift. Preload only the weights actually used (Unbounded 500/700, Poppins 400/600); drop the rest.

### 3.2 Color

Warm/green-biased neutral ramp (never pure grey) + brand:
```css
/* Brand green */
--green-50:#f1f8e8; --green-100:#ddeec4; --green-200:#c3e29b; --green-300:#a6d46e;
--green-400:#8fca50; --green-500:#82c341; /* BRAND */ --green-600:#6ba82f; /* hover */
--green-700:#52831f; --green-800:#3c5f18; --green-900:#2b4413;
/* Yellow pop — sparing only */
--yellow-500:#fdb913; --yellow-600:#e5a50c;
/* Warm/green-tinted neutrals */
--neutral-0:#ffffff;  --neutral-50:#f6f7f2;  --neutral-100:#eef0e9; --neutral-200:#e6e8df;
--neutral-300:#d7dacd; --neutral-400:#a9ae9f; --neutral-500:#7c8172; --neutral-600:#585c50;
--neutral-700:#3f4239; --neutral-800:#2a2c26; --neutral-900:#1c2016;
```

Semantic tokens — **LIGHT (default):**
```css
--surface-page:#f6f7f2;   --surface-card:#ffffff;  --surface-sunken:#eef0e9;
--text-heading:#1c2016;   /* near-black warm green — fixes washed-out hero H1 */
--text-body:#353b2e;      --text-muted:#6b7161;     --text-inverse:#ffffff;
--border-subtle:#e6e8df;  --border-default:#d7dacd; --border-strong:#c1c5b4;
--accent:#82c341;         --accent-hover:#6ba82f;   --accent-ink:#17240a; /* text ON green */
--pop:#fdb913;            --focus-ring:#52831f;
```

Semantic tokens — **DARK (`[data-theme="dark"]`):**
```css
--surface-page:#14160f;   --surface-card:#1e2118;  --surface-sunken:#181b12;
--text-heading:#f2f4ec;   --text-body:#d3d7c8;     --text-muted:#9aa08b; --text-inverse:#14160f;
--border-subtle:#2f3427;  --border-default:#3b4130;--border-strong:#4b5140;
--accent:#82c341;         --accent-hover:#8fca50;  --accent-ink:#12200a;
--pop:#fdb913;            --focus-ring:#8fca50;
```

Usage rules (WCAG AA, both themes):
- **Hero H1 fix:** color `var(--text-heading)` (≈13:1 on white) — never light grey. Optionally set ONE word (e.g. "Solve.") to `var(--green-700)`; never color the whole line green.
- **Green as text** must use `--green-700`/`--green-800` — brand `#82c341` fails AA on white.
- **Green as fill uses dark ink text** (`--accent-ink`), never white — white on `#82c341` is ~1.9:1 and fails AA.
- **Yellow `#fdb913`** is a pop only (self-audit band, badges, one CTA accent) with dark text; never body text, never large fills.
- Verify every text/background pair ≥4.5:1 (≥3:1 for ≥24px) in **both** light and dark.

### 3.3 Spacing & layout

8pt scale:
```css
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:24px;
--space-6:32px; --space-7:40px; --space-8:48px; --space-9:64px; --space-10:80px;
--space-11:96px; --space-12:128px;
```
Rhythm & container:
```css
--section-y: clamp(3.5rem, 2rem + 6vw, 8rem);   /* section padding-block 56 → 128 */
--container-max:1200px;                          /* content max; marquees/logos full-bleed */
--gutter: clamp(1rem, 0.5rem + 2vw, 2.5rem);     /* page gutter 16 → 40 */
--grid-cols:12; --grid-gap: clamp(1rem, 0.5rem + 1.5vw, 1.5rem); /* 16 → 24 */
```
- Section: `padding-block:var(--section-y); padding-inline:var(--gutter)`; inner wrapper `max-width:var(--container-max);margin-inline:auto`. All section content aligns to the same left/right edges.
- Grid: 12-col desktop → 6-col (≤768) → 4-col (≤480). Card grids: 3-up → 2-up (tablet) → 1-up (mobile).

Radius & elevation:
```css
--radius-sm:8px; --radius-md:12px; --radius-lg:20px; --radius-xl:28px; --radius-pill:999px;
--shadow-sm:0 1px 2px rgba(28,33,20,.06);
--shadow-md:0 4px 16px rgba(28,33,20,.08);
--shadow-lg:0 12px 32px rgba(28,33,20,.10);
--shadow-xl:0 24px 60px rgba(28,33,20,.12);
--shadow-glow:0 10px 30px rgba(130,195,65,.28); /* brand accent glow, sparing */
```

### 3.4 Components

**Buttons** — shared base: `font:600 var(--fs-button)/1 var(--font-body); border-radius:var(--radius-pill); padding:14px 28px (mobile 12px 22px); display:inline-flex;gap:8px;align-items:center; transition:.18s ease`. Focus-visible: `outline:2px solid var(--focus-ring);outline-offset:2px`.

| Variant | Fill | Text | Border | Hover | Active |
|---|---|---|---|---|---|
| **Primary** (Book a Free Call, Contact Us) | `--accent` | `--accent-ink` | none | bg `--accent-hover` + `translateY(-1px)` + `--shadow-md` | bg `--green-700`, translateY(0) |
| **Secondary** | transparent | `--text-heading` | 1.5px `--border-strong` | border `--accent`, bg `--green-50` | bg `--green-100` |
| **Ghost / tertiary** (nav, "Project link") | none | `--green-700` (`--accent` on dark) | none | bg `--green-50`, optional underline | bg `--green-100` |

Keep exactly two prominent button tokens (primary + secondary); tertiary is for inline links. Same height, radius, padding, and font everywhere.

**Card** (ONE primitive, reused across Solutions / Portfolio / Testimonials / Blog):
```
bg:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg);
padding:var(--space-6) (mobile var(--space-5)); box-shadow:var(--shadow-md); gap:var(--space-4);
hover: box-shadow:var(--shadow-lg); transform:translateY(-4px); transition:.2s ease;
```
Unify radius, padding, shadow, image aspect-ratio, title/body sizes, and hover across all card types.

**Section-intro component** (identical on every section): eyebrow (`--fs-eyebrow`, uppercase, green) + H2 + one-line sub, same spacing and alignment throughout.

**Input:**
```
height:48px; padding:12px 16px; border-radius:var(--radius-md);
border:1.5px solid var(--border-default); background:var(--surface-card);
font:400 var(--fs-body) var(--font-body); color:var(--text-body);
placeholder: color:var(--text-muted);
focus: border-color:var(--accent-hover); box-shadow:0 0 0 3px rgba(130,195,65,.25);
error: border-color:#d64545; box-shadow:0 0 0 3px rgba(214,69,69,.20);
```

---

## 4. SECTION-BY-SECTION REDESIGN

Preserve all 13 sections in the exact order below, with the **real copy verbatim**.

**0 — Top Announcement Bar.** Replace the scrolling marquee with a static, single-line green bar, dark text: "Not sure what service you need? **Book a FREE 15-min strategy call**" + inline "Talk to an Expert →" as an underlined text button, right-aligned. Add a dismiss "×" with `aria-label`. Height 40px desktop / 36px mobile. Mobile: truncate to "Free 15-min strategy call →", full-width tap target, one line.

**1 — Nav.** Left logo wordmark; nav links (Explore, Solutions, Knowledge hub, Portfolio, Get Started); right cluster = light/dark toggle, small "Team Login" text link, solid green "Contact Us". Reduce to ONE primary button; demote "Team Login" to a text link (internal, not a visitor action); fold "Get Started" into the CTA. Sticky, 64–72px tall, background blur + subtle shadow only after 100px scroll; active-link underline in green with `aria-current`. Mobile: logo + hamburger + always-visible green "Contact" button; full-height slide-in drawer with links stacked at 20px and the toggle at the bottom. Never hide the CTA behind the hamburger.

**2 — Hero** *(most important fix).* Left-weighted single column on a light ground. Eyebrow "Full-service digital marketing agency · India". H1 "**Design. Think. Solve. Develop.**" at full ink color (`--text-heading`) — remove the grey wash; optionally accent the final word "Develop." green. Sub: "Creating digital experiences that connect, engage and inspire to help brands grow." Then add the **missing primary CTA "Book a Free 15-min Strategy Call"** (green) + secondary ghost "See Our Work". Below the CTAs add a **trust row** — "Trusted by 30+ brands" with 4–5 greyscale client logos (ISB, Le Meridien, AeonX…) or a one-line proof stat. Reading order: eyebrow → H1 → sub → CTAs → proof.
*Graphics fix:* consolidate the floating clouds/lime-balloons/mint/lightbulb into a single disciplined right-side composition inside a positioned, `overflow:hidden` wrapper — max 3–4 elements, generous negative space, `aria-hidden`, `pointer-events:none`, gentle slow float only. They must sit in a defined column, never free-float across the text. **Mobile:** stack single column, text first; cut floating graphics to at most ONE small motif (or `display:none` below 768px) — no absolute-positioned art overlapping the H1; primary CTA full-width, secondary below, trust logos a centered 3-logo row.

**3 — Loop-Text Keyword Band.** Keep a single horizontal keyword marquee (SEO · PPC · Social · Branding · Motion · Video · Web…) as a thin brand band — outline/stroke Unbounded or muted `#474747` on `#f5f5f5`, green/lime bullet separators. One row, pause-on-hover, `prefers-reduced-motion` disables travel. Mobile: keep, reduced height, ~14–16px.

**4 — Who We Are.** Two columns: left text, right single image. Eyebrow "Who We Are", H2, para "Marketing Mojito is a full-service digital marketing agency in India, blending creativity…", then ghost "About Us →". Collapse `.who-para` to the ONE body-lg token. Image in a rounded container (radius-lg) with soft shadow; overlay one small proof chip ("50+ brands" / "8+ services"). Mobile: text first, image below, full-width 4:3 crop.

**5 — Digital Marketing Services (intro).** Reframe as a short **capability strip**, not a full section — differentiate it from Section 7. Eyebrow + H2 + the "…full growth stack under one roof: SEO, PPC, social, branding, motion graphics, video, web & e-commerce…" line rendered as a **clean icon-chip grid** (8 small service pills with tiny line icons) instead of a run-on sentence. Keep the green "Book A Free Call" as the section CTA. Mobile: chips wrap 2-up; button full-width; no horizontal scroll.

**6 — Trusted-By Logos.** Keep the marquee but normalize it: all ~31 logos to **uniform greyscale**, equal optical height (~28–32px), consistent padding on white, with edge mask-gradients. Add a context heading: "Trusted by teams across healthcare, real estate, hospitality & entertainment." Hover-to-color as a subtle delight; pause-on-hover. Feed a 4–5 logo slice up into the hero. Mobile: single row, smaller logos, pause-on-tap.

**7 — Our Solutions.** Eyebrow "Our Solutions", H2, sub "We build websites, create memorable videos, and elevate your brand through media, SEO…". Disciplined **3-col card grid** (Digital Transformation / Brand & Visual Identity / Growth Marketing + more) using the shared card primitive: one line-icon, title (H4/20px), 2-line description, "Learn more →". Equal-height cards, hover lift + green border, one lime-slice corner accent used sparingly (not on every card). End with a centered green "Checkout Our Work". Mobile: 1-up (2-up tablet) vertical list; icons top-left; avoid phone carousels unless snap-scroll with a visible peek.

**8 — Portfolio.** Eyebrow "Portfolio", H2, tagline "You name it, we've built it." **2-col project grid** (or 3-up masonry) of image-led cards: large thumbnail (one enforced 16:10 aspect ratio), project name, 1-line category tag (Healthcare / Real Estate / D2C…), "Project link →" on hover with subtle zoom. Cap at 6 featured projects + a "View all work" button. Mobile: 1-up stacked, full-width images, tag + title below, CTA full-width text link; lazy-load images.

**9 — Client Success (testimonials).** Eyebrow "Client Success", H2 "Hear from our happy customers!". Testimonial cards: quote (~20px), circular uniform avatar + name + role/company, optional company logo. Show 2–3 at a time as a snap-scroll carousel with dots (or a static 3-card row); green quotation-mark motif as the only accent. If available, attach a result metric to at least one quote ("+40% leads"). Mobile: 1 card/view, swipeable with dots; avatar + name under the quote.

**10 — Self-Audit CTA Band.** Full-bleed green (`#82c341`) band. H3 white "Is Your Marketing Working?" (hook) + H3 lemon (`#fdb913`) "Get A Free Self-Audit Checklist" (value) + a white/dark solid "Get the Checklist" button. Center-stack, ~640px max-width; one lime/mint corner motif. This is the one place lemon-yellow earns a big moment. Optional inline email field for one-tap capture. Ensure button/text contrast passes AA (dark `#1c1c1c` text on the button). Mobile: stack all three lines, 48px vertical padding, full-width button; headings on the clamp ramp so nothing overflows the band.

**11 — Featured From Blog.** Eyebrow "From the Blog", H2. 3-card row **reusing the shared card component**: thumbnail, category tag, post title (H4/20px), date + read-time, "Read →". Muted, editorial, calm. End with "Visit the Knowledge Hub →". Mobile: 1-up stacked or horizontal snap-scroll with peek; thumbnail on top, meta below.

**12 — Footer.** Dark footer (`#1c1c1c` / `#353535`) to ground the light page. Columns: brand blurb + logo | Explore/Solutions/Portfolio | Knowledge hub/Get Started | Contact (hello@marketingmojito.com as a real `mailto:` link, "Schedule Appointment" as a green button, socials as an icon row). Bottom bar: © + Privacy Policy + a small "Made with 🍋" wink. Keep the floating WhatsApp button (consistent size, bottom-right, `aria-label`) and the mobile bottom dock (4 clear icons: Call / WhatsApp / Contact / Menu) — **offset the FAB above the dock so they never overlap**. Mobile: columns collapse to a stack/accordions; email + "Schedule Appointment" full-width and prominent.

---

## 5. FLAWS TO FIX (checklist — every item mandatory)

**Typography**
- Remove all `vw`/per-breakpoint `html` font-size rules; pin `html{font-size:100%}`.
- Delete every `!important` on font-size/line-height; mobile values win by cascade order, not specificity.
- Collapse duplicate class sizes (`.heading-style-h3` ×6+, `.who-para` 1.5/2.5/2.8/1.6rem, `.text-18` 1rem+1.5rem) to one definition each, mapped to a role token.
- Every heading on the `clamp()` scale; nothing renders at desktop size on a phone; no horizontal scroll at 360px.
- Headings `line-height` 1.05–1.25, body 1.5–1.6, measure ≤65ch.

**Hierarchy & consistency**
- Lock role weights (H1 700, H2/H3 500, eyebrow 600 uppercase, body 400) identically across all sections.
- One section-intro component, one card primitive, two button tokens everywhere.

**Spacing & alignment**
- 8px spacing scale as tokens; no loose px. Equal section rhythm. One 1200px container, shared gutters. Marquee bands get fixed height, vertical centering, edge mask-gradients.

**Color & contrast (AA, both themes)**
- Hero H1 near-black at full opacity (no grey ghost). Green text only via `--green-700/800`. Green fills use dark ink, never white. Yellow only on dark bands/accents. Verify muted `#474747` on `#f5f5f5` ≥4.5:1. Define and verify the explicit dark palette.

**Conversion / CTA**
- Add the hero primary CTA (biggest gap) + one-line value prop above the fold ("Full-service digital marketing agency — SEO, content, paid, social, branding & video").
- Standardize the primary action on ONE label — **"Book a Free 15-min Strategy Call"** — reused at hero, services, and footer; secondary CTAs stay visually subordinate.
- Guarantee a primary CTA is visible in hero, mid-page, and footer.

**Accessibility**
- Exactly ONE `<h1>`; ordered `<h2>`/`<h3>`, no skipped levels chosen for size.
- Visible `:focus-visible` on every interactive element; never bare `outline:none`. Tap targets ≥44×44px.
- Descriptive `alt` on meaningful images; brand-name alt on client logos; `alt=""`/`aria-hidden` on decorative fruit/cloud art. Duplicated marquee items `aria-hidden` so AT doesn't read them twice.
- Landmarks: `<header><nav><main><section aria-labelledby><footer>`; toggle is a real `<button>` with `aria-label` + `aria-pressed`. Don't convey state by color alone.

**Performance**
- Responsive `srcset` in WebP/AVIF; compress hero/portfolio/blog assets; no full-res desktop images to phones.
- `loading="lazy"` on everything below the fold (testimonials, logos, blog); hero art eager. Set `width`/`height` or `aspect-ratio` on all images (CLS ≈ 0).
- Ship ONE lean token-driven stylesheet; drop the multi-file Webflow export entirely. Animate transform/opacity only.

---

## 6. MOTION & RESPONSIVE RULES

**Motion — premium restraint** (transform/opacity only; never animate layout).
- Timing tokens: micro 120ms, standard 240ms, entrance 500ms. Ease-out `cubic-bezier(.22,.61,.36,1)` for entrances, `cubic-bezier(.4,0,.2,1)` for hovers. Sibling stagger 60–80ms, cap the cascade at ~6.
- **Scroll reveals:** sections/cards fade + rise (`opacity 0→1`, `translateY 16–24px→0`) via `IntersectionObserver` (~15% threshold, `rootMargin:0px 0px -10%`), fire once then unobserve. Hero is visible immediately — no reveal on H1.
- **Marquees:** `translateX` loop with duplicated track, 30–60s/loop, pause on hover/focus.
- **Hover/focus:** primary CTA lift `translateY(-2px)` + shadow + 4% brightness; cards lift 2–4px with inner-image scale `1.03` under `overflow:hidden`, "Project link" arrow nudges `translateX(3px)`; nav links animated underline wipe. Keyboard parity via `:focus-visible`.
- **Cursor follower** (keep existing): soft lime dot/ring lagging via `lerp` in `requestAnimationFrame`, scales over interactive elements, `pointer-events:none`. Only when `(pointer:fine)` and `(hover:hover)` — disabled on touch and under reduced-motion.
- **Hero graphics:** gentle 2–6px float, 6–10s ease-in-out loops, `aria-hidden`, `pointer-events:none`.
- **`prefers-reduced-motion: reduce` (hard requirement):** kill all marquee travel, reveals, floats, cursor follower, and card/image scale; content shows at full opacity; keep only instant color/opacity affordances.

**Responsive — mobile-first.**
- Breakpoints (min-width cascade): base 320+, sm 480, md 768, lg 1024, xl 1280. Max content 1200px centered, fluid gutters.
- Grids collapse 3→2→1. Section padding fluid via `--section-y`.
- **No horizontal overflow at any width (test 320/375/390/768/1024/1440):** `overflow-x:clip` as a safety net only after fixing root causes — oversized headings, absolutely-positioned graphics, `100vw` widths, negative `vw` offsets. Images `max-width:100%;height:auto`. Wide items (marquee tracks, tables) scroll inside their own `overflow-x:auto` container.
- No absolute-positioned decorative element may overlap text below 768px — make it in-flow or hide it.
- Mobile bottom dock + WhatsApp FAB: fixed, safe-area-inset aware, never overlapping each other or the footer.

**Component states to define:** buttons (default/hover/active/focus-visible/disabled), nav (default/hover/active/scrolled/mobile-open), cards (default/hover/focus-within), links, inputs (default/focus/error/disabled), toggle (persist choice, ≤200ms icon swap, AA in both themes), marquees (running/paused/static).

---

## 7. CONSTRAINTS & GUARDRAILS

**Keep:**
- All 13 sections (0 announcement → 12 footer) in the exact given order, with real copy verbatim (H1 "Design. Think. Solve. Develop.", "Who We Are", the section paras, CTA labels).
- Brand system only: green `#82c341`, lemon `#fdb913`, neutrals `#353535`/`#1c1c1c`/`#474747`, backgrounds white/`#f5f5f5`. Unbounded for display, Poppins for body. No new fonts or brand colors.
- The refined "mojito" visual language (lime/lemon slices, balloons, mint, lightbulb, clouds).
- The working light/dark toggle (light is default).

**Do NOT:**
- Invent testimonials, client names, logos, case studies, or metrics. Use only real ones; for unknown assets leave a clearly labeled placeholder — never fabricate.
- Remove, reorder, rename, or merge sections; don't drop the marquees, WhatsApp button, or mobile dock.
- Switch to a dark-first design, gradients-on-everything, glassmorphism overload, purple/blue "AI startup" palettes, generic stock hero, or centered-everything sameness. **Avoid the generic AI look** — keep the asymmetric, illustrative, brand-owned character.
- Ship `!important` type overrides, vw-based root font-size, duplicate conflicting class sizes, or any leftover Webflow cruft.
- Animate layout properties, autoplay sound, or add motion that ignores `prefers-reduced-motion`.

**Acceptance bar (must all pass):** zero horizontal scroll 320→1440px; exactly one `<h1>`; every text/bg pair ≥ WCAG AA in both themes; every heading on the fixed token scale (no `!important`, no duplicate class sizes); visible hero primary CTA + one-line value prop above the fold; all tap targets ≥44px; `prefers-reduced-motion` honored; below-fold images lazy-loaded with reserved dimensions.

---

## 8. DELIVERABLE FORMAT

Produce a **single, self-contained, production-ready responsive front-end** for the homepage:

- **One artifact**, either clean semantic **HTML + one token-driven CSS file** (CSS custom properties for color/type/spacing as specified) or **React + Tailwind** with the tokens mapped into the Tailwind theme config — your choice, but it must be componentized and readable (shared `SectionIntro`, `Button`, `Card` primitives reused across sections).
- All 13 sections implemented in order, mobile-first, with the light/dark toggle wired up.
- Include the `IntersectionObserver` scroll-reveal script, marquee logic, cursor follower, and the `prefers-reduced-motion` guards inline.
- Use clearly labeled placeholders (with correct aspect ratios and `alt`) for images you don't have; do not fabricate brand assets.
- The screenshots are attached separately as the layout/spacing reference — match their intent while applying every fix above.
- After the code, add a short **"What changed & why"** note mapping each major fix (typography system, hero H1 + CTA, card unification, contrast, responsive overflow) to the flaw it resolves.
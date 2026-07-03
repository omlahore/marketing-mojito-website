# Marketing Mojito — Site Consistency Audit

_Findings only — nothing changed yet. Ordered by severity._

## Root cause behind most of this

The site is split: ~25 pages are still **raw Webflow static HTML** (`public/*.html`) carrying the original exported header/footer, while a handful are **clean React pages** (homepage, blog, tools, celebrity page) that use shared components. Every header/footer defect below exists in the 25 static files but NOT in the React ones — which is exactly why things look inconsistent page to page. Fixing the static files one by one is whack-a-mole; converting them to React (so they share one Header/Footer) is the durable fix.

---

## Critical — visible content errors

1. **Wrong copyright + placeholder company name.** Every page footer reads `© 2022 Welcome. All right reserved.` Two bugs: the year is **2022** (should be 2026) and the company is **"Welcome"** (should be "Marketing Mojito"). Present in all 27 static pages **and** in `components/Footer.tsx` (line 137), so even the new React pages show it. Also "All right reserved" → "All rights reserved."

2. **Placeholder content live in the navbar (Portfolio megamenu) on all 25 static pages:**
   - `Lorem ipsum dolor sit amet, consectetur adipiscing elit` — placeholder body copy
   - `Article Title` — placeholder card titles
   - `No items found` — empty CMS state showing to visitors
   - `Placeholder-Image` — placeholder images
   - `Work By serivce` — typo, should be "Work By **Service**"
   The React Navbar component does NOT have these, so the megamenu literally differs depending on which page you're on.

3. **"Viral Content & Shots" typo.** Appears 28× across nav and labels; should be "**Shorts**" (the page itself is `viral-content-shorts-page`). A few spots correctly say "Short-Form" — so it's inconsistent on top of being wrong.

---

## Typography inconsistencies

4. **Inconsistent Unbounded fallback.** Three variants in use: `Unbounded, cursive`, `Unbounded, sans-serif`, and `Unbounded,sans-serif` (no space). Should be one.

5. **Non-brand font (Arial).** `font-family: Arial, sans-serif` appears in ~10+ static pages instead of Poppins.

6. **System font stack in embeds.** `-apple-system, BlinkMacSystemFont…` used in code-embed blocks (services list, hover preview) — diverges from the Poppins/Unbounded system everywhere else.

---

## Structural inconsistencies

7. **CTA sections vary page to page.** The "Is Your Marketing Working? / Free Self-Audit Checklist" CTA exists on only some pages (e.g. partner-with-us, websites-ecommerce); others have a different CTA or none. Heights differ because both the content and the padding classes differ between pages — this is the uneven-CTA-height you noticed.

8. **FAQ styling differs by page type.** Static FAQs (contact-us, websites-ecommerce) use Webflow `faq-para` / `faq-heading` classes; the new React celebrity page uses its own `cbm-faq` styling; only 2 static pages have an FAQ at all. Result: FAQ text size/spacing is not uniform — matches your observation.

9. **Section heights/padding not standardized.** Static pages use a mix of padding utility classes inconsistently, so equivalent sections render at different heights across pages.

---

## Minor / under-the-hood

10. **Misspelled CSS class names** (not user-visible, but signal sloppiness and make maintenance error-prone): `contacr-wrapperr` (→ contact-wrapper), `adress-block` (→ address-block).

11. **Heading-size usage is ad hoc** — `heading-style-h3` is reused for visually different headings rather than a consistent scale.

---

## Recommended fix order

1. **Footer copyright** — one edit in `components/Footer.tsx` + a scripted find/replace across the 25 static files. ~10 min, fixes every page.
2. **Navbar placeholders + "serivce" typo** — fix the Portfolio megamenu in the 25 static files (React is already clean).
3. **"Shots" → "Shorts"** — global find/replace.
4. **Font standardization** — normalize Unbounded fallback, replace Arial, in the shared CSS + embeds.
5. **CTA + FAQ standardization** — pick one CTA block and one FAQ style; apply everywhere.
6. **Strategic:** convert the static pages to React so they share one Header/Footer/CTA/FAQ — this prevents the whole class of problem from recurring.

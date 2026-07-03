# Marketing Mojito — SEO Audit & Remediation Playbook

> **Purpose of this document.** This is a complete, self-contained brief for an AI coding agent
> tasked with taking `marketingmojito.com` from "technically clean but strategically invisible" to
> a site that ranks for commercial, lead-generating terms. It assumes **no prior context**. Read
> §0–§3 fully before changing anything. Every finding includes evidence, exact file locations,
> remediation steps, and a verification command.
>
> **Data source.** Findings come from a DataForSEO audit (Keywords Data, SERP, On-Page, Backlinks,
> Labs) run on the live site, plus manual live verification. The audit's raw numbers are the
> **"before" state**; §8 lists what has already been fixed and deployed since.
>
> **Target:** `https://marketingmojito.com` · **Business:** Marketing Mojito, a full-service digital
> marketing agency operating across India · **Audit baseline date:** 2026-07-02.

---

## 0. How to use this document

1. **Read §2 (Environment map) first.** The site is a hybrid — static Webflow HTML *and* a Next.js
   App Router — and editing the wrong layer silently does nothing. This is the #1 way to waste effort.
2. **Do not redo §8 (already-fixed items).** They are live in production. Verify with the given
   command if unsure, but do not re-implement.
3. **Work the "Remaining work" plan in §5**, in priority order. Each task has an owner-action flag:
   - `[CODE]` — you can do it in this repo.
   - `[DATA]` — needs the DataForSEO API (currently blocked — see §3.3).
   - `[OFF-SITE]` — needs a human in an external dashboard (Webflow, Google Search Console, GBP).
4. **After any code change**, run the build + deploy + verify loop in §7. Never assume; verify live.
5. **Ground truth beats this doc.** If a command's output contradicts a claim here, trust the command
   and note the discrepancy.

---

## 1. Executive summary

`marketingmojito.com` is a **well-built site with almost no organic footprint**. The technical
foundation is strong (on-page score 95.5/100, HTTPS, ~600ms loads, no 4xx/5xx). But it ranks for only
**27 organic keywords, every one of them informational** — "7 Ps of marketing", "how to make a YouTube
channel and earn money" — and buried on pages 3–11. **As a marketing agency it ranks for ZERO
commercial or service keywords**, so organic search sends it no qualified leads.

| Pillar | Score (baseline) | One-line read |
|---|---:|---|
| Keywords | 47 | Thin (27 kw), all low-intent informational |
| Technical | 89 → **~95+** after fixes | The site's genuine strength |
| Competitors | 0\* | \*Artifact — no commercial footprint means no real peers surface |
| Content | 27 | Almost no topical authority; 1 top-10 ranking total |
| Authority | 45 | 44 referring domains, but ~75% are the site's own Webflow mirror |
| **Overall** | **45** | Technically sound, strategically invisible |

**The single highest-leverage program of work** (this document's core):
1. **Rank for commercial terms** (§5.1) — the only path to leads. *Biggest impact.*
2. **Consolidate the Webflow staging mirror** (§5.2) — one action removes ~75% of the backlink noise.
3. **Build topical authority** (§5.3) — turn 27 keywords into hundreds.

---

## 2. Environment map (READ THIS)

**Stack:** Next.js 14.2 (App Router), deployed as a standalone Node server via PM2 on AWS Lightsail.

**Repo root:** `/home/onyx/Documents/Marketing-Mojito/MM NEW WEBSITE`

The site serves pages from **three different layers**. Know which one owns the page you're editing:

### Layer A — Static Webflow HTML (`public/*.html`)
- These are Webflow exports. **25 are "live"**, listed in the `htmlPages` array in `next.config.mjs`.
- Served at clean URLs via rewrite: `/{page}` → internally serves `/{page}.html`. A request to
  `/{page}.html` **301-redirects** to `/{page}`.
- **Live page slugs:** `about-us, career, contact-us, partner-with-us, websites-ecommerce,
  ai-powered-automation, brand-visual-identity, motion-animation, photography-videography,
  paid-advertising, growth-marketing-seo-content-services, performance-analytics-cro-services,
  strategy-management, personal-branding, viral-content-shorts-page, e-commerce-digital-marketing,
  healthcare-marketing, real-estate-digital-marketing, saas-digital-marketing,
  hospitality-digital-marketing, entertainment-digital-marketing, privacy-policy, terms-of-service,
  mojito-labs, portfolio`.
- **17 of these are "service" pages** (the industry/service ones); the rest are utility pages.
- ⚠️ **Shared fragments:** `public/header.html` and `public/footer.html` are the nav/footer, but they
  are **inlined into every page's HTML** (not included at runtime). To change the global nav/footer on
  static pages you must edit the markup **inside each of the 25 files** (script it), not just the
  fragment files. `detail_*.html`, `401/404.html`, `search.html` are templates/fragments — NOT live.
- Each file is a full 2,000–3,500-line Webflow document with its own `<head>` (title, meta, canonical,
  OG, Twitter — all already well-populated).

### Layer B — Next.js App Router (`app/`)
- **Homepage:** `app/page.tsx` → renders `app/HomeContent.tsx` (the actual hero/sections).
- **Blog index:** `app/blog/page.tsx` → `app/blog/BlogGrid.tsx`.
- **Blog post:** `app/blog/[slug]/page.tsx` (SSG, one page per post).
- **Tools:** `app/tools/`, `app/free-tools/*`, `app/free-templates/`.
- `app/celebrity-brand-marketing/page.tsx`.
- **Global wrapper:** `app/layout.tsx` — sets default metadata + renders
  `components/OrganizationSchema.tsx` (sitewide Organization JSON-LD) on all App Router routes.
- **Global metadata template:** `app/layout.tsx` sets `title.template = '%s | Marketing Mojito'`.
  Per-page `title` should therefore be the bare page title (the template appends the brand).

### Layer C — Blog content data (`content/blog-posts.json`)
- **73 posts**, each: `{slug, title, excerpt, content(HTML string), date, modified, author,
  categories[], featuredImage, metaDescription, faqs[]}`.
- Rendered by `app/blog/[slug]/page.tsx`, which:
  - Uses `metaDescription` for `<meta description>`, OG, Twitter, and Article schema.
  - Emits **Article** + **BreadcrumbList** JSON-LD, and **FAQPage** JSON-LD **only if `faqs[]` is
    non-empty**.
  - Renders `title` as the page `<h1>` (so post `content` must **start at `<h2>`**, never contain an
    `<h1>`).
  - Falls back to `/images/42.png` for any `featuredImage` containing `/wp-content/` (old dead WP URLs).
- **Images:** `public/images/` (≈646 files). `public/images/blog/` has a couple of real blog images.

### Key config & infra files
| File | Role |
|---|---|
| `next.config.mjs` | `htmlPages` list, `.html`→clean-URL redirects, rewrites, cache headers |
| `app/sitemap.ts` | Sitemap generator — already lists all 25 static pages + tools + blog posts |
| `public/robots.txt` | `Allow: /`, points to `/sitemap.xml` — correct |
| `components/OrganizationSchema.tsx` | Sitewide Organization JSON-LD (real phone `+91-9152605355`) |
| `deploy-lightsail.sh` | Build + deploy (see §7) |

---

## 3. The DataForSEO data layer

### 3.1 The skill
An installed skill pack at `~/.claude/skills/seo/` wraps the DataForSEO API. Scripts (all print JSON):

| Script | Useful commands |
|---|---|
| `scripts/keyword_research.py` | `seed <kw>` · `related <kw>` · `suggestions <kw>` · `volume <kw...>` · `difficulty <kw...>` |
| `scripts/domain_overview.py` | `overview --target` · `ranked --target` · `competitors --target` · `content_gap --you <d> --competitors <a b c>` |
| `scripts/backlinks.py` | `summary` · `top` · `refdomains` · `anchors` (all `--target`) |
| `scripts/on_page_audit.py` | `site --target <d> --max-crawl-pages 100` |
| `scripts/serp_check.py` | live SERP position lookups |
| `scripts/generate_pdf_report.py` | renders a client PDF from a saved audit JSON (no API cost) |

Global flags: `--location "India" --language "en"` (defaults are set to India in `.env`).
Credentials live in `~/.claude/skills/seo/.env` (`DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`).

### 3.2 Running a full audit / report
```bash
# Full 5-pillar audit (orchestrated by the skill) — writes output/marketingmojito.com-audit.json
/seo-audit marketingmojito.com
# Generate the client PDF from the saved JSON (local render, no API cost)
~/.claude/skills/seo/scripts/generate_pdf_report.py \
  --input ~/.claude/skills/seo/output/marketingmojito.com-audit.json \
  --output ~/.claude/skills/seo/output/marketingmojito.com-report.pdf
```
The last saved audit is at `~/.claude/skills/seo/output/marketingmojito.com-audit.json`.

### 3.3 ⚠️ ACCOUNT STATUS — currently BLOCKED
As of 2026-07-02 the DataForSEO account (`om@marketingmojito.com`) is under a **precautionary fraud
hold**. All data endpoints return **`40201 "unusual activity… access temporarily paused"`**, even
though the balance is ~$0.91. The hold is **independent of balance** — adding funds does not clear it.

**Probe before trusting any `[DATA]` task:**
```bash
cd ~/.claude/skills/seo/scripts && ../.venv/bin/python3 -c "
import sys; sys.path.insert(0,'.')
from dataforseo_client import call, normalize_domain
r=call('backlinks/summary/live',{'target':normalize_domain('marketingmojito.com'),'internal_list_limit':1})
print(r['tasks'][0]['status_code'], r['tasks'][0]['status_message'])"
# 20000 Ok  -> unblocked, [DATA] tasks are runnable
# 40201 ... -> still frozen; do NOT hammer it (repeated calls may worsen the hold)
```
**To unblock:** the account owner must email **support@dataforseo.com from `om@marketingmojito.com`**
asking them to lift the "unusual activity" pause (likely triggered by opening a second free trial for
the same domain + scripted calls on an unverified account). Account verification alone did **not**
clear it. Until a probe returns `20000 Ok`, treat every `[DATA]` task as parked.

---

## 4. Issue register

Priorities from the audit, with current status. **✅ = fixed & live, 🟡 = partial/blocked, ⬜ = open.**

| # | Priority | Issue | Status |
|---|---|---|---|
| 1 | CRITICAL | Ranks for **zero commercial/service keywords** | ⬜ open — see §5.1 |
| 2 | CRITICAL | High-value keyword clusters stranded on pages 3–11 | 🟡 pillars built (§8); rankings lag |
| 3 | HIGH | Missing `<h1>` on 68% of live pages | ✅ fixed (§8) |
| 4 | HIGH | Backlink profile distorted by own Webflow staging mirror | 🟡 documented; needs OFF-SITE + DATA (§5.2) |
| 5 | MEDIUM | No structured data + images missing alt text | ✅ fixed (§8) |
| 6 | MEDIUM | Broken resources on 25 pages | ✅ fixed (§8) — were the local `.avif` refs |
| 7 | (crawl) | 258 internal blog links caused 308 redirect hops | ✅ fixed (§8) |

---

## 5. Remaining work — the "fix it once and for all" plan

### 5.1 `[CODE]` + `[DATA]` + `[OFF-SITE]` — Rank for commercial keywords (CRITICAL, #1)

**The problem, precisely.** 26 of 27 ranked keywords are informational. The agency's service pages
*exist* with good `<title>`/meta, but their **on-page body content is creative/thin** ("Elevate Your
Reach", "Craft Your Online Presence") and does not target the commercial terms a buyer searches.
There is also **no local-SEO signal** (agencies win locally) and **no Google Business Profile**.

**Target keyword map** (validate volumes/difficulty with `[DATA]` once unblocked — see command below).
Map each commercial head term to the page that should own it:

| Target keyword (India) | Owning page | Current gap |
|---|---|---|
| digital marketing agency / company / services | Homepage (`app/HomeContent.tsx`) | H1 is a brand slogan, not the keyword |
| SEO services / SEO agency | `public/growth-marketing-seo-content-services.html` | Creative hero, no keyword-focused copy |
| social media marketing agency / services | (needs a dedicated page or repurpose viral-content) | No page owns this term |
| PPC / paid advertising services | `public/paid-advertising.html` | Hero "Elevate Your Reach" |
| performance marketing agency | `public/performance-analytics-cro-services.html` | — |
| branding agency / brand identity services | `public/brand-visual-identity.html` | — |
| video production / motion graphics company | `public/motion-animation.html`, `photography-videography.html` | — |
| website development / e-commerce company | `public/websites-ecommerce.html` | — |
| digital marketing agency in **[city]** | **new location pages** (Mumbai/Delhi/Bengaluru/Pune…) | none exist |

**Get the data (run when §3.3 probe = `20000 Ok`):**
```bash
cd ~/.claude/skills/seo
./scripts/keyword_research.py --location "India" volume \
  "digital marketing agency" "digital marketing agency in india" "digital marketing services" \
  "seo services" "seo agency" "social media marketing agency" "ppc services" \
  "performance marketing agency" "branding agency" "website development company" \
  "digital marketing agency in mumbai" "digital marketing agency in delhi"
# add: ./scripts/keyword_research.py suggestions "digital marketing agency"   (long-tail)
# and:  ./scripts/domain_overview.py content_gap --you marketingmojito.com \
#         --competitors <real-agency-1.com> <real-agency-2.com> <real-agency-3.com>
```
> Note: `content_gap`/`competitors` will return mega-platforms (youtube/reddit) until the site has a
> commercial footprint (see §6.3). Seed the competitor list manually with real Indian agencies
> (e.g. webchutney, socialbeat, iProspect India, Schbang) to get a meaningful gap.

**On-page requirements per commercial page** (do all of these for each target page):
1. **Keyword-relevant `<h1>`** — the hero `<h1>` currently carries brand-voice copy. Either make the
   H1 keyword-bearing, or keep the brand hero H1 **and** add an early keyword-rich `<h2>` +
   intro paragraph that names the exact service term. (In the Webflow pages the hero title has class
   `inner-banner-heading`; the primary section headings use `main-heading-style-h3`.)
2. **600–1000+ words of genuinely useful copy** — what the service is, who it's for, process, results,
   FAQs. The pages are visually rich but text-light (`low_content_rate` fired on 77% of pages).
3. **Internal links** from relevant blog posts → the service page (anchor = the commercial term).
4. **`Service` JSON-LD** — already injected on the 17 service pages (§8). When you add/rename pages,
   replicate the block (`@type: Service`, `provider: Organization`, `areaServed: India`).
5. **A conversion path** — every commercial page needs a visible CTA to `/contact-us`.

**Local SEO (high ROI for an agency, `[OFF-SITE]` + `[CODE]`):**
- Create/claim a **Google Business Profile** for each city the agency operates in. This is the single
  biggest local-ranking lever and cannot be done in code.
- Add **`LocalBusiness` JSON-LD** with real NAP per city (only if a real address/phone exists — do not
  fabricate; the current Organization schema deliberately omits a street address).
- Build **location landing pages** (`/digital-marketing-agency-mumbai`, etc.) with unique local copy.
- Ensure **NAP consistency** (name/address/phone identical across site, GBP, directories).

**Verify progress** (weeks later — rankings lag Google's re-crawl): re-run `/seo-audit` and watch the
Keywords pillar and the commercial-term positions via `scripts/serp_check.py`.

---

### 5.2 `[OFF-SITE]` + `[DATA]` — Backlink cleanup (HIGH, #4)

Two independent problems. Full runbook already in **`seo/BACKLINK-PLAYBOOK.md`** — summary here.

**(a) The Webflow staging mirror — `marketing-mojit.webflow.io` (do this first, no API needed).**
~335 of the site's 446 backlinks are this staging subdomain mirroring the live site (its nav menu:
anchors "know more" ×216, "Portfolio" ×27, "Project link" ×18, "Mojito labRead More" ×27 — see §6.2).
Google can index it as a duplicate. **Do NOT disavow it — it's your own content.** Instead, in the
**Webflow dashboard** (owner action): stop publishing to the `*.webflow.io` subdomain, OR enable
"Disable Webflow subdomain indexing", OR 301 it to `marketingmojito.com`. The live site's canonicals
already point to the real domain (verified), so no code change is needed here. Then submit
`https://marketingmojito.com/sitemap.xml` in Google Search Console and use Removals on the mirror.

**(b) Disavow the spammy tail (`[DATA]`).** ~29 low-quality domains (junk TLDs `.info/.eu/.xyz/.click
/.cv`) link with the naked-URL anchor `marketingmojito.com` (spam score 50); plus "visit
marketingmojito.com for latest info" (spam 60) and "marketingmojito" (spam 65). A ready generator
exists:
```bash
# when §3.3 probe = 20000 Ok:
python3 "seo/generate-disavow.py" --target marketingmojito.com --spam-threshold 40
# -> writes seo/disavow.txt ; REVIEW every line, then upload at
#    https://search.google.com/search-console/disavow-links
```
⚠️ **Do not disavow** `gokulgarden.com`, `homestaymukteshwar.com`, `singerhariharana.com`,
`astral-consulting.com` — these are **legitimate** (client sites with "made with ❤ by marketing mojito"
footer credits, spam 0–3). See §6.2.

**(c) Earn real links.** The healthy anchor "Marketing Mojito" comes from only 4 domains. Build more:
client footer credits (already a good pattern — scale it), digital PR, quality directories, guest posts
on marketing publications. This is the long-term fix for Authority = 45.

---

### 5.3 `[CODE]` + `[DATA]` — Content depth / topical authority (Content = 27)

The site has 73 blog posts but almost no topical authority (1 top-10 ranking total). Program:
1. **Topic clusters.** Group services into clusters (SEO, paid, branding, video, social, web) with one
   **pillar page** (the service page) + supporting blog posts, all cross-linked. Two pillars already
   exist (see §8) — replicate the pattern for each service.
2. **Internal linking pass.** Every blog post should link to (a) its cluster's service page and (b) 2–3
   sibling posts, using descriptive anchors. (A trailing-slash link cleanup was already done — §8.)
3. **Refresh thin/old posts.** Many posts date to 2020–2022. Update, expand, and add `faqs[]` (drives
   FAQPage rich results — the renderer already supports it).
4. **`[DATA]` content gap.** Once unblocked, run `domain_overview.py content_gap` against **real**
   competitors to find keywords they rank for that you don't; write to those gaps.

---

### 5.4 `[CODE]` — Optional technical polish (low priority; the site is already 95/100)

- **`title_too_long` on 3 pages** — trim any `<title>` over ~60 chars. Find them:
  `for f in public/*.html; do t=$(grep -oE '<title>[^<]*' "$f"); [ ${#t} -gt 68 ] && echo "$f ${#t}"; done`
- **`render_blocking_resources` (79%) / `low_content_rate` (77%)** — inherent to the Webflow export
  (CSS in `<head>`, heavy div markup). Fixing risks breaking animations for marginal gain. Leave unless
  templates are rebuilt. The §5.1 copy expansion will naturally improve `low_content_rate`.
- **8 pages are 308 redirect targets** (`/blog/`, `/project/`, trailing-slash blog URLs). The redirects
  themselves are fine (permanent). Internal links pointing at them were already fixed (§8).

---

## 6. Raw data appendix (the audit's "before" numbers)

### 6.1 Ranked keywords (27 total, all informational)
| Keyword | Volume | KD | CPC | Position |
|---|---:|---:|---:|---:|
| 7'p of marketing | 1,600 | 12 | $4.96 | 65 |
| how to create a youtube channel and make money | 1,000 | 27 | $4.15 | 32 |
| how to create a youtube channel and earn money | 1,000 | 30 | $4.15 | 30 |
| how to make channel on youtube and earn money | 1,000 | 31 | $4.15 | 31 |
| how to make a youtube channel and make money | 1,000 | 36 | $4.15 | 36 |
| how to make youtube channel to make money | 1,000 | 28 | $4.15 | 37 |
| how to make a youtube channel to make money | 1,000 | 27 | $4.15 | 39 |
| how to make a youtube channel and earn money | 1,000 | 32 | $4.15 | 44 |
| marketing mix 7 p's | 480 | 21 | — | 73 |
| seven ps marketing mix | 480 | 29 | — | 86 |
| 7p for marketing | 390 | **8** | $9.98 | 104 |
| mojito labs (brand/navigational) | 110 | 4 | — | **7** |
| 360 marketing plans | 40 | 2 | — | 72 |
| + ~13 more YouTube-monetization long-tail variants (pos 30–44) | | | | |

**Read:** two clusters — YouTube-monetization (~7,540 combined volume, pos 30–44) and 7 Ps of marketing
(pos 65–104). `7p for marketing` (KD 8) and `mojito labs` (already #7) are the softest targets. Both
clusters now have dedicated pillar pages (§8). **No commercial term appears anywhere.**

### 6.2 Backlink anchor profile (446 backlinks, 44 referring domains)
| Anchor | Backlinks | Spam | Source / note |
|---|---:|---:|---|
| know more | 216 | 5 | Webflow **mirror** nav |
| Marketing Mojito | 50 | 0 | ✅ healthy brand anchor (4 real domains) |
| (image, null anchor) | 37 | 7 | mostly mirror |
| **marketingmojito.com** | 31 | **50** | ⚠️ 29 junk-TLD domains — **disavow candidates** |
| Portfolio / Project link / Mojito labRead More | 72 | 5–7 | Webflow **mirror** nav |
| Marketingmojito | 10 | 0 | ✅ healthy |
| © made with ❤ by marketing mojito | 5 | 3 | ✅ client footer credits |
| visit marketingmojito.com for latest info | 1 | **60** | ⚠️ disavow |
| marketingmojito | 1 | **65** | ⚠️ disavow |

Referring-domain notes: **90% rank < 50**. Legit: `astral-consulting.com` (rank 200), the client
footer-credit sites (`gokulgarden.com`, `homestaymukteshwar.com`, `singerhariharana.com`). The mirror
`marketing-mojit.webflow.io` alone = **335 backlinks**. Toxic tail = the naked-URL cluster above.

### 6.3 "Competitors" returned (all mega-platforms — a symptom, not real peers)
`youtube.com, quora.com, reddit.com, medium.com, shopify.com, google.com, techsmith.com, wikihow.com,
simplybusiness.co.uk, printful.com`. These overlap only on the site's informational keywords.
**Interpretation:** the site has no commercial/local footprint, so no real agency competitor surfaces.
Real competitive analysis is only meaningful **after** §5.1. Seed real competitors manually.

### 6.4 Technical crawl (39 URLs; on-page score 95.5/100)
- Status: 31×`200`, 8×`308` (trailing-slash `/blog/`, `/project/`). No 4xx/5xx. Avg load ~600ms (max ~2.8s on one page).
- Baseline check hits (now largely remediated — see §8): `no_h1_tag` 21, `no_image_alt` 31, `has_micromarkup` 0, `broken_resources` 25, `has_links_to_redirects` 7.
- Persisting/optional: `has_render_blocking_resources` 79%, `low_content_rate` 77%, `title_too_long` 3.

---

## 7. Build, deploy & verify

```bash
cd "/home/onyx/Documents/Marketing-Mojito/MM NEW WEBSITE"

# 1. Build (must succeed: "✓ Compiled successfully" + "Generating static pages (92/92)")
npm run build

# 2. Deploy to Lightsail (rebuilds, ships standalone bundle incl. public/, pm2 restart)
./deploy-lightsail.sh          # -> https://marketingmojito.com  (server ubuntu@13.232.187.181)

# 3. Verify LIVE (never assume). Examples:
curl -s https://marketingmojito.com/paid-advertising | grep -c '<h1'                 # expect 1
curl -s https://marketingmojito.com/paid-advertising | grep -c 'application/ld+json' # expect 3 (Org+Breadcrumb+Service)
curl -s -o /dev/null -w "%{http_code}\n" https://marketingmojito.com/blog/understanding-the-7-ps-of-the-marketing-mix  # 200
```
**Notes:** the deploy script bundles `public/` into the standalone output, so static-HTML edits *do*
ship. Static HTML is served as-is (no build validation), so validate HTML edits manually. JSON/TSX
changes are validated by `npm run build`.

---

## 8. Change log — already fixed & live (DO NOT REDO)

All of the following are committed to the working tree, built, deployed, and verified live this session
(2026-07-02):

1. **H1 on every page (issue #3).** All 25 live static pages now have exactly one semantic `<h1>` (hero
   title promoted from `<h2 class="inner-banner-heading">`/`<div>`). Homepage `<a id="heading-h1">` →
   real `<h1>`; blog index got an `<h1>`; `photography-videography` duplicate H1s merged.
   *Verify:* every `public/*.html` live page and `/`, `/blog` return exactly one `<h1>`.
2. **Structured data (issue #5).** `Organization` JSON-LD injected into all 25 static pages' `<head>`
   (aligned with `components/OrganizationSchema.tsx`); **`BreadcrumbList`** added to all 25 static pages
   + blog posts; **`Service`** added to the 17 service pages; blog posts already emit `Article` +
   `FAQPage`. 67 JSON-LD blocks total, all valid.
3. **Alt text (issue #5).** 151 logo instances → `alt="Marketing Mojito"`; 19 hero images → descriptive
   per-page alt; 2 homepage section images. (Decorative nav/menu icons intentionally left `alt=""`.)
4. **Broken resources (issue #6).** 16 doubled-name `.avif` refs (e.g. `About-Us_1About-Us.avif`) →
   their real `_1.avif` files; the `contact-us` phone/email icons repaired. **0 broken local assets;
   all external CDN resources return 200.**
5. **Two pillar pages (issue #2).** `content/blog-posts.json` posts
   `understanding-the-7-ps-of-the-marketing-mix` and `how-to-create-a-youtube-channel-and-earn-money`
   rewritten into comprehensive, keyword-optimized guides (7 `<h2>` + 5 FAQs + `metaDescription` +
   internal links each). They target the two ranked clusters in §6.1.
6. **Contact details.** `public/contact-us.html` placeholder phone `+880 123 456 789` → `+91 91526
   05355`, and `rebuild@gmail.com` → `hello@marketingmojito.com`.
7. **Blog title tag de-duplication.** `app/blog/[slug]/page.tsx` and `app/blog/page.tsx` no longer emit
   `…- Marketing Mojito Blog | Marketing Mojito` (the template adds the brand).
8. **Redirect-hop cleanup (crawl finding #7).** 258 internal `/blog/<slug>/` trailing-slash links
   across 61 posts in `content/blog-posts.json` → slashless (no more 308 hops).
9. **Backlink deliverables.** `seo/BACKLINK-PLAYBOOK.md`, `seo/generate-disavow.py`, `seo/disavow.txt`.
10. **DataForSEO defaults.** `~/.claude/skills/seo/.env` set to `location="India"`.

**Net after this session:** issues #3, #5, #6, #7 fully resolved; #2 built (awaiting Google re-crawl);
#1 and #4 are the remaining substantive work, documented in §5.

### Session 2 (2026-07-02, later) — §5.1 [CODE] + §5.3 executed. See `seo/progress.md` for verification detail.
11. **Commercial copy sections** on 8 service pages (keyword H2 + 600–900w + FAQs + FAQPage JSON-LD + CTA); service pages now emit **4** JSON-LD blocks (was 3 — update §7 expectation).
12. **Homepage** keyword section + agency-in-India copy (`app/HomeContent.tsx`).
13. **New pages:** `/social-media-marketing` + 4 city pages `/digital-marketing-agency-{mumbai,delhi,bengaluru,pune}` (Service+FAQPage schema, no fabricated NAP). All in sitemap.
14. **Blog:** 12 new commercial/informational cluster posts (73→85, all with metas+FAQs+internal links); automatic "Related articles" cross-linking on every post (`lib/blog.ts:getRelatedPosts`); BlogCta now title-aware and routes social to the new page.
15. **Cleanup:** dead `wp-content` `<img>`s stripped from 41 post bodies; `mojito-labs`/`portfolio` titles trimmed ≤60. Webflow badge/darkreader/data-wf-* audited — dormant or functional, deliberately left.
16. DataForSEO still `40201`-frozen this session; [DATA] tasks remain parked.

---

## 9. Suggested execution order for the fixing agent

1. **Confirm the baseline** — run §7 verify commands; skim §8 so you don't redo finished work.
2. **§5.1 on-page commercial optimization** `[CODE]` — do the parts that don't need data: add
   keyword-bearing H2/intro copy + 600–1000 words + CTAs to the mapped service pages; expand homepage
   targeting for "digital marketing agency". Deploy + verify.
3. **§5.2(a) Webflow mirror** — hand to the owner (Webflow dashboard); it needs no code.
4. **When DataForSEO unblocks (§3.3 probe = `20000 Ok`):** pull commercial keyword + content-gap data
   (§5.1/§5.3), refine the on-page copy, and run `seo/generate-disavow.py` (§5.2b).
5. **§5.3 topical authority** `[CODE]` — internal-linking pass + refresh/expand posts + write to gaps.
6. **Re-audit** — `/seo-audit marketingmojito.com` → regenerate the PDF; compare Keywords/Technical
   pillars. Expect Technical to jump immediately; Keywords/Authority to move over weeks as Google
   re-crawls.

*End of playbook.*

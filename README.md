# Marketing Mojito — Website & Application

**Full-service digital marketing agency** — *Design. Think. Solve. Develop.*

This repository powers **[marketingmojito.com](https://marketingmojito.com)**: a **hybrid Next.js 14** application that serves a large set of **exported Webflow HTML** pages as static assets, plus a **React blog**, **API routes** for forms, and integrations with **Resend** (email) and **Google Sheets** (lead logging).

---

## Table of contents

1. [High-level architecture](#high-level-architecture)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Repository layout](#repository-layout)
5. [Prerequisites](#prerequisites)
6. [Local development](#local-development)
7. [Environment variables](#environment-variables)
8. [npm scripts](#npm-scripts)
9. [Routing, URLs, and static pages](#routing-urls-and-static-pages)
10. [Next.js configuration](#nextjs-configuration)
11. [Blog system](#blog-system)
12. [WordPress import pipeline](#wordpress-import-pipeline)
13. [Forms (client)](#forms-client)
14. [API routes (server)](#api-routes-server)
15. [Spam protection & reCAPTCHA](#spam-protection--recaptcha)
16. [Google Sheets logging](#google-sheets-logging)
17. [Lead magnets & resources](#lead-magnets--resources)
18. [SEO: sitemap, robots, metadata](#seo-sitemap-robots-metadata)
19. [Production deployment (AWS Lightsail)](#production-deployment-aws-lightsail)
20. [Operations & troubleshooting](#operations--troubleshooting)
21. [Security & secrets](#security--secrets)
22. [License & contact](#license--contact)

---

## High-level architecture

| Layer | What it is |
|--------|------------|
| **Marketing pages** | HTML, CSS, images, and Webflow JS under `public/`. Clean URLs (e.g. `/about-us`) are **rewrites** to `public/about-us.html`. |
| **Homepage** | There is **no** `app/page.tsx`; `/` rewrites to `/index.html` (see `next.config.mjs`). |
| **Blog** | React/Next under `app/blog/`; content from `content/blog-posts.json`. |
| **API** | Next.js Route Handlers under `app/api/` for contact, lead magnets, and public config. |
| **Build output** | `output: 'standalone'` for a minimal server bundle suitable for small VPS instances. |

Traffic flow in production: **Internet → Nginx (SSL, reverse proxy) → Node (Next standalone, port 3000) → PM2**.

---

## Features

- **Static marketing site** — Industry, service, legal, and landing pages from Webflow, with **canonical clean URLs** (no `.html` in the address bar when using recommended links).
- **Blog (“Mojito Labs”)** — Index and post pages with SEO metadata, static generation for post routes, HTML body rendered via `html-react-parser`.
- **Contact form** — Submits to `/api/contact`: team notification email, optional Google Sheets row.
- **Lead magnet / checklist forms** — Submits to `/api/lead-magnet`: team notification, **DOCX attachment** to the user when the file exists in `public/resources/`, Sheets logging.
- **Free-tool flows** — Same API can record a **tool link** (`tool_link`) when the resource is a URL rather than a file attachment.
- **Spam controls** — Honeypots, timing checks, per-IP rate limiting, heuristic spam patterns, optional **reCAPTCHA v3**.
- **SEO** — `app/sitemap.ts` builds `/sitemap.xml`; `public/robots.txt` references it; root `app/layout.tsx` sets site-wide metadata and Open Graph defaults.

---

## Tech stack

| Technology | Version / notes | Role |
|------------|-----------------|------|
| **Next.js** | 14.2.0 | App Router, Route Handlers, `generateStaticParams`, standalone output |
| **React** | 18 | Blog UI |
| **TypeScript** | 5 | App and `lib/` |
| **Resend** | ^6.9.2 | Outbound email |
| **googleapis** | ^171.4.0 | Sheets API append |
| **html-react-parser** | ^5.2.17 | Blog post HTML → React |
| **ESLint** | 8 + `eslint-config-next` | Linting |

**Production (typical):** Ubuntu on **AWS Lightsail**, **PM2** for process management, **Nginx** as reverse proxy with Let’s Encrypt (**Certbot**) for TLS.

---

## Repository layout

```
marketing-mojito/
├── app/
│   ├── api/
│   │   ├── config/route.ts       # GET — public config (reCAPTCHA site key)
│   │   ├── contact/route.ts        # POST — contact form
│   │   └── lead-magnet/route.ts    # POST — lead magnet / free tool
│   ├── blog/
│   │   ├── [slug]/page.tsx         # Single post (SSG via generateStaticParams)
│   │   ├── layout.tsx              # Shell: header/footer from HTML exports
│   │   ├── page.tsx                # Blog index
│   │   ├── BlogGrid.tsx
│   │   ├── BlogScripts.tsx
│   │   └── blog-content.css
│   ├── layout.tsx                  # Root metadata & <html>/<body>
│   └── sitemap.ts                  # Dynamic sitemap.xml
├── content/
│   └── blog-posts.json             # Blog data (WordPress import output)
├── lib/
│   ├── blog.ts                     # Read posts JSON, helpers
│   ├── google-sheets.ts            # Append row to Sheets
│   └── spam.ts                     # Rate limit, honeypot, reCAPTCHA, heuristics
├── public/
│   ├── *.html                      # Webflow pages (served via rewrites)
│   ├── css/                        # normalize, webflow, site CSS, mobile-dock, section-center
│   ├── images/
│   ├── js/
│   │   ├── forms.js                # Intercepts forms → API + reCAPTCHA
│   │   └── webflow.js
│   ├── resources/                  # DOCX files for lead magnets (must match server map)
│   ├── documents/                  # Webflow / CMS JSON assets (if referenced by pages)
│   ├── robots.txt
│   └── 401.html, 404.html, etc.
├── scripts/
│   └── parse-wordpress.mjs         # WXR → blog-posts.json
├── deploy-lightsail.sh             # Local build + upload standalone tarball + PM2 restart
├── next.config.mjs
├── package.json
├── tsconfig.json
├── RECAPTCHA-SETUP.md              # reCAPTCHA key setup (short guide)
├── SERVER-SETUP.md               # Server bootstrap notes (review for secrets if committed)
└── README.md                     # This file
```

Root-level `*.html` files may exist as editing convenience; **runtime static files live in `public/`** (and are copied into `.next/standalone` during deploy).

---

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** 9+
- For production features locally: **Resend** API key, **Google Cloud** service account with Sheets access, target **spreadsheet** shared with that service account

---

## Local development

```bash
git clone <repository-url>
cd marketing-mojito
npm install
```

Create **`.env.local`** in the project root (see [Environment variables](#environment-variables)). This file must **not** be committed.

```bash
# Development — http://localhost:3000
npm run dev

# Production build (standalone in .next/standalone)
npm run build

# Run production server locally (after build)
npm start
```

```bash
npm run lint
```

---

## Environment variables

Create **`.env.local`** at the repo root.

| Variable | Required for | Description |
|----------|----------------|-------------|
| `RESEND_API_KEY` | Email | Resend API key. `from` domain must be verified in Resend. |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Sheets | Google service account email. |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Sheets | Service account private key. Use `\n` for newlines inside the string when stored in env. |
| `GOOGLE_SHEET_ID` | Sheets | Spreadsheet ID (from the Sheet URL). |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional | reCAPTCHA v3 **site** key (exposed to browser). |
| `RECAPTCHA_SECRET_KEY` | Optional | reCAPTCHA v3 **secret** key (server only). |

**Example (placeholders only):**

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

GOOGLE_SHEETS_CLIENT_EMAIL=your-sa@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

If Sheets variables are missing, **`logFormSubmission`** logs a warning and skips the append; email may still send.

---

## npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev -p 3000` | Development server |
| `build` | `next build` | Production build + standalone output |
| `start` | `next start` | Production server |
| `lint` | `next lint` | ESLint |
| `import-blog` | `node scripts/parse-wordpress.mjs` | Regenerate `content/blog-posts.json` from WordPress XML |

---

## Routing, URLs, and static pages

### Clean URLs and rewrites

In **`next.config.mjs`**, `htmlPages` lists basename routes. For each entry `foo`, Next.js:

- **Rewrites** `GET /foo` → `/foo.html` (file in `public/`).
- **Redirects** `GET /foo.html` → `/foo` (308 permanent).

The homepage **`/`** rewrites to **`/index.html`**, and **`/index.html`** redirects to **`/`**.

### Current `htmlPages` list

`about-us`, `career`, `contact-us`, `portfolio`, `partner-with-us`, `websites-ecommerce`, `ai-powered-automation`, `brand-visual-identity`, `motion-animation`, `photography-videography`, `paid-advertising`, `growth-marketing-seo-content-services`, `performance-analytics-cro-services`, `strategy-management`, `personal-branding`, `viral-content-shorts-page`, `e-commerce-digital-marketing`, `healthcare-marketing`, `real-estate-digital-marketing`, `saas-digital-marketing`, `hospitality-digital-marketing`, `entertainment-digital-marketing`, `free-tools-and-template`, `privacy-policy`, `terms-of-service`, `mojito-labs`.

### Adding a new static HTML page

1. Add **`public/your-page.html`** (and keep assets under `public/`).
2. Append **`'your-page'`** to the **`htmlPages`** array in **`next.config.mjs`** (rewrites + redirects + cache headers).
3. Add **`'/your-page'`** to **`staticPages`** in **`app/sitemap.ts`** so it appears in **`sitemap.xml`**.
4. Rebuild and deploy.

---

## Next.js configuration

**`next.config.mjs`** (summary):

| Setting | Behavior |
|---------|----------|
| **`output: 'standalone'`** | Produces a minimal server bundle under `.next/standalone` for VPS deployment. |
| **Rewrites** | `/` and each `htmlPages` slug → corresponding `.html` in `public/`. |
| **Redirects** | Strip `.html` from URLs for SEO-friendly canonical paths. |
| **Headers** | Long cache for `/_next/static`, `/images`, `/css`, `/js`. **No store** for `/` and each marketing slug. **1 day** cache for `/robots.txt` and `/sitemap.xml`. |

---

## Blog system

- **Data:** `content/blog-posts.json` — array of posts with `slug`, `title`, `excerpt`, `content` (HTML string), `date`, `modified`, `author`, `categories`, `featuredImage`, optional `metaDescription`.
- **Routes:**
  - **`/blog`** — list (`app/blog/page.tsx` + `BlogGrid.tsx`).
  - **`/blog/[slug]`** — post (`app/blog/[slug]/page.tsx`); **`generateStaticParams`** builds all slugs at build time.
- **Layout:** `app/blog/layout.tsx` reads **`public/mojito-labs.html`** and **`public/index.html`**, slices out header (and mobile menu) from the former and footer from the latter, fixes relative `href`/`src` paths, loads Webflow CSS + `public/css/mobile-dock.css`, and injects **`BlogScripts`** for any blog-specific JS.

**Operational note:** If the blog errors at runtime, confirm **`public/mojito-labs.html`** and **`public/index.html`** exist and **`content/blog-posts.json`** is valid JSON.

---

## WordPress import pipeline

**Script:** `scripts/parse-wordpress.mjs`

1. Export WordPress as **WXR** (Tools → Export).
2. Save the XML file and set **`XML_PATH`** inside the script (default in repo points to something like `blog.WordPress.2026-02-12.xml` — **update this path** to your file).
3. Run:

   ```bash
   npm run import-blog
   ```

**Output:** `content/blog-posts.json`

The parser:

- Skips non-`post` items.
- Pulls title, content, excerpt, dates, author, slug, categories.
- Resolves **featured images** using attachment metadata (`_thumbnail_id` / `wp:attachment_url`).
- Reads **Yoast** meta description when present (`_yoast_wpseo_metadesc`).

After import, **commit** the updated JSON and **redeploy** so new posts are live.

---

## Forms (client)

**File:** `public/js/forms.js` (loaded by static HTML pages as needed).

**Behavior:**

1. **Fetches** `GET /api/config` once for **`recaptchaSiteKey`**.
2. **Injects** hidden honeypot fields (`website`, `company_url`) and **`_loaded`** timestamp (milliseconds) if missing.
3. On submit, **prevents** default Webflow handling and **POSTs** JSON to the right API.

**Contact forms** — Matched selectors include: `form#contact-form`, `form#wf-form-Name`, `form.form-2`, `.contact-form-2 form`. A form is treated as contact if it has message and/or company fields. Payload: `name`, `email`, `company`, `phone`, `subject`, `message`, `_loaded`, optional `recaptchaToken`.

**Lead magnet forms** — Selectors: `form#checklist-form`, `form.web3-checklist-form`, `form[data-pdf-name]`, `form.lead-magnet-form`. Payload: `name`, `email`, `pdfName`, `pageName`, `_loaded`, optional `recaptchaToken`. Resource title often comes from **`data-pdf-name`** on the form or hidden `pdfName` input.

**Field name compatibility:** Multiple Webflow naming conventions (`firstname`/`lastname`, `First-name`, `Email`, etc.) are normalized in JS.

---

## API routes (server)

### `GET /api/config`

Returns JSON:

```json
{ "recaptchaSiteKey": "<site key or empty string>" }
```

Used only for public configuration safe to expose to the browser.

---

### `POST /api/contact`

**Validation:** `name`, `email`, and `message` are required.

**Pipeline:** Rate limit → timestamp → honeypots → spam heuristics → optional reCAPTCHA → **Resend** email → **Google Sheets** append.

**Success response:** `{ "success": true, "data": ... }` (Resend payload).

**Error responses (examples):** `429` too many requests; `400` validation / spam / reCAPTCHA; `500` Resend or server errors.

**Email (code defaults):**

- **From:** `Marketing Mojito <hello@marketingmojito.com>`
- **To:** `rahul@marketingmojito.com`, `om.mojito@gmail.com` (change in `app/api/contact/route.ts` if needed)

**Timestamps** in emails and Sheets use **`Asia/Kolkata`** locale formatting.

---

### `POST /api/lead-magnet`

**Validation:** `name`, `email`, `pdfName`, `pageName` required.

**Optional:** `tool_link` — when set, copy may include the URL in the team email and user messaging; Sheets **formType** becomes **`Free Tool`** vs **`Lead Magnet`**.

**Attachment:** If `pdfName` maps to a filename in **`RESOURCE_MAP`** and the file exists under **`public/resources/`**, the DOCX is attached to the **user** confirmation email. If the file is missing, the **team** email Body states that a **manual send** is required (and Sheets status reflects attachment vs link vs manual).

**User email:** HTML template with branding; team notification is plain text.

---

## Spam protection & reCAPTCHA

**Implementation:** `lib/spam.ts`

| Mechanism | Detail |
|-----------|--------|
| **Rate limit** | **5** submissions per client IP per **1 hour** (in-memory `Map`; resets on process restart). |
| **Timestamp** | Body must include numeric **`_loaded`**. Submit must be **≥ 2 seconds** later and **≤ 24 hours** (replay guard). |
| **Honeypots** | If `website`, `company_url`, or **`url`** is non-empty string → reject. |
| **Heuristics** | Short messages dominated by links; disposable-email domain substrings. |
| **reCAPTCHA v3** | If `RECAPTCHA_SECRET_KEY` is set **and** the client sends `recaptchaToken`, Google **siteverify** must return success with **score ≥ 0.3**. If token absent (script blocked), verification is skipped. |

**Client setup:** See **`RECAPTCHA-SETUP.md`**: create v3 keys, add domains (`marketingmojito.com`, `www`, `localhost` for dev), set both env vars, rebuild and deploy.

---

## Google Sheets logging

**Function:** `logFormSubmission` in `lib/google-sheets.ts`

- **Spreadsheet:** `GOOGLE_SHEET_ID`
- **Range:** `Form Submissions!A:K`
- **Columns (one row per submission):**

| Col | Field |
|-----|--------|
| A | `timestamp` |
| B | `formType` (`Contact` \| `Lead Magnet` \| `Free Tool`) |
| C | `name` |
| D | `email` |
| E | `company` |
| F | `phone` |
| G | `subject` |
| H | `message` |
| I | `resourceName` |
| J | `page` |
| K | `status` |

The sheet tab must exist and the service account must have **Editor** access (or equivalent append rights).

---

## Lead magnets & resources

**Server map:** `RESOURCE_MAP` in `app/api/lead-magnet/route.ts` maps the **display name** (`pdfName`) to a **filename** in **`public/resources/`**.

Examples of keys (must match what forms send as `pdfName` / `data-pdf-name`):

`Self-Audit Checklist`, `Business Growth Toolkit`, `Website Conversion Audit`, `Workflow Playbook`, `Brand Identity Scorecard`, `30 Animated Videos`, `Shoot Planner`, `Ad Metrics Dashboard`, `SEO Audit Template`, `Funnel Optimization Checklist`, `Instagram Bio Guide`, `LinkedIn Optimization Guide`, `Viral Reels Templates`, `Product Launch Checklist`, `Appointment Tracker`, `Sales Funnel Template`, `SaaS Metrics Dashboard`, `Room Booking Checklist`, `Launch Plan Checklist`.

When adding a new offer:

1. Add the DOCX to **`public/resources/`** (exact filename).
2. Add a **`RESOURCE_MAP`** entry: display name → filename.
3. Ensure front-end forms use the **same** display name in `data-pdf-name` or hidden field.
4. Deploy (standalone bundle must include `public/resources/`).

---

## SEO: sitemap, robots, metadata

- **`app/sitemap.ts`** — Builds absolute URLs under `https://marketingmojito.com` for all marketing slugs (including `/portfolio`), `/blog`, and every `/blog/[slug]`.
- **`public/robots.txt`** — Allows all; points to `Sitemap: https://marketingmojito.com/sitemap.xml`.
- **`app/layout.tsx`** — Sets `metadataBase`, default **title template**, description, keywords, Open Graph, Twitter card, robots index/follow.

---

## Production deployment (AWS Lightsail)

### `deploy-lightsail.sh` (summary)

1. Runs **`npm run build`** locally.
2. Copies **`.next/static`** and **`public`** into **`.next/standalone`** (required for standalone).
3. Creates **`/tmp/deploy.tar.gz`** from the standalone directory.
4. **`scp`** tarball to the server (default **`ubuntu@13.232.187.181`**: `/var/www/marketing-mojito/`).
5. Optionally **`scp`** **`.env.local`** (ignored if missing locally).
6. **SSH** remote steps: backup existing **`.env.local`**, remove old files except env and tarball, extract archive, restore **`.env.local`**, **`pm2 restart marketing-mojito`**, **`pm2 save`**.

**SSH key path** in the script defaults to:

`$HOME/Documents/Marketing-Mojito/Backups/LightsailDefaultKey-ap-south-1.pem`

Adjust **`SERVER`**, **`KEY`**, or paths for your machine.

### Server expectations

- **Node** 20+ recommended, **PM2** installed, app name **`marketing-mojito`**.
- App directory **`/var/www/marketing-mojito`**.
- **Nginx** reverse proxy to **`http://127.0.0.1:3000`** (or `localhost:3000`), with **`X-Forwarded-For`** / **`X-Real-IP`** set so rate limiting sees client IPs.

**Reference:** `SERVER-SETUP.md` has Nginx snippet, DNS notes, and Certbot — **audit that file for secrets** before sharing the repo; prefer rotating any key that was ever committed in plaintext.

### DNS (documented in repo)

- **Route 53 hosted zone ID** (as noted in project docs): `Z05400832FYVV487ELHT4`
- **A records** for apex and `www` historically point to Lightsail **`13.232.187.181`** — verify in AWS for your environment.

---

## Operations & troubleshooting

| Symptom | Checks |
|---------|--------|
| **Contact / lead “Something went wrong”** | Browser console + Network tab for `/api/*`. Resend dashboard logs. **`RESEND_API_KEY`**. Domain **SPF/DKIM** for `hello@marketingmojito.com`. |
| **429 Too many requests** | By design after **5 posts/hour/IP**. Wait or adjust `lib/spam.ts` if business needs differ. |
| **400 Failed to send / verification failed** | Honeypot filled (CSS/theme issue), **`_loaded`** skew, reCAPTCHA domain mismatch, or low score. |
| **Sheets not updating** | `GOOGLE_SHEET_ID`, credentials, tab name **`Form Submissions`**, share with SA email. |
| **Lead magnet: manual send only** | Missing **`RESOURCE_MAP`** key or missing file under **`public/resources/`**. |
| **Blog 500 / blank shell** | Missing **`public/mojito-labs.html`** or **`public/index.html`**. Corrupt **`blog-posts.json`**. |
| **Deploy / PM2** | SSH key path, **`pm2 list`**, logs **`pm2 logs marketing-mojito`**, disk space on VPS. |
| **Stale HTML after deploy** | Marketing HTML uses **no-store** headers for slugs; hard refresh. Confirm new `public/*.html` is inside standalone tarball. |

---

## Security & secrets

- Never commit **`.env.local`** or service account JSON with keys.
- If **`SERVER-SETUP.md`** or any doc ever contained **live** API keys or private keys, **rotate** those credentials in Google Cloud, Resend, and reCAPTCHA consoles.
- reCAPTCHA **secret** stays server-side; **site key** is public by design.
- Rate limiting is **per server process**; multiple instances without sticky sessions would each maintain separate counters — acceptable for current single-instance Lightsail setup.

---

## License & contact

- **License:** Proprietary — Marketing Mojito.
- **Website:** [marketingmojito.com](https://marketingmojito.com)
- **Email:** [hello@marketingmojito.com](mailto:hello@marketingmojito.com)

---

*Last updated to reflect the codebase structure and behavior as of the README authoring date. When in doubt, trust the source files (`next.config.mjs`, `app/api/*`, `lib/*`, `public/js/forms.js`) over this document.*

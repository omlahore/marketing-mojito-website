# Backlink Cleanup Playbook — marketingmojito.com

Two independent problems from the SEO audit (2026-07-02), each with its own fix:

1. **Staging-mirror duplication** → *canonicalize / de-index* (NOT disavow)
2. **~29 spammy referring domains (spam score ~50)** → *disavow*

> **Status note:** the specific spammy-domain list could not be pulled on 2026-07-02
> because the DataForSEO balance was exhausted (`40200 Payment Required`). Top up the
> balance, then run `generate-disavow.py` (in this folder) to produce the final
> `disavow.txt` automatically. Part 1 below needs **no** API credit — do it now.

---

## Part 1 — Kill the Webflow staging mirror (do this first)

**Problem:** ~75% of all 446 backlinks point at `marketing-mojit.webflow.io`, a Webflow
staging subdomain that mirrors the live site. Google can index it as a duplicate of
`marketingmojito.com`, splitting link equity and risking a duplicate-content signal.

**Do NOT disavow it** — it's your own content. You want to *consolidate* its authority
into the real domain, not throw it away.

### The live site is already correct
Every page on `marketingmojito.com` already declares a self-referential
`<link rel="canonical">` (verified 2026-07-02). No change needed on the Next.js app.

### Actions on the Webflow side (owner — Webflow dashboard)
Pick **one** of these, in order of preference:

1. **Best — stop publishing to the webflow.io subdomain.**
   In Webflow → Project Settings → Publishing, publish only to the custom domain
   `marketingmojito.com` and unpublish the `*.webflow.io` staging URL. This removes the
   mirror entirely.

2. **If you must keep staging — de-index it.**
   Webflow → Project Settings → SEO → check **"Disable Webflow subdomain indexing"**
   (adds `noindex` to `*.webflow.io` automatically). This tells Google not to index the
   mirror while keeping it reachable for previews.

3. **Belt-and-braces — 301 the subdomain.**
   If the subdomain must stay live and indexable is not acceptable, set up a 301 redirect
   from `marketing-mojit.webflow.io/*` to `https://marketingmojito.com/*` (Webflow
   redirects or a reverse proxy). This passes the ~330 mirror backlinks' equity to the
   real domain — the ideal outcome.

### Then, in Google Search Console
- Confirm `https://marketingmojito.com` is the verified property.
- Submit `https://marketingmojito.com/sitemap.xml` (the Next.js app generates this).
- If the mirror was indexed, use **Removals** to temporarily hide `marketing-mojit.webflow.io`
  while the noindex/redirect propagates.

**Expected result:** the ~330 mirror backlinks stop diluting the profile; with option 1 or 3
their equity consolidates onto `marketingmojito.com`.

---

## Part 2 — Disavow the spammy referring domains

**Problem:** ~29 low-quality referring domains (mixed TLDs, naked-URL anchors,
DataForSEO spam score ~50) make up the toxic tail of the backlink profile.

### How to generate the final list (one command, after topping up credit)
```bash
# from anywhere:
python3 "/home/onyx/Documents/Marketing-Mojito/MM NEW WEBSITE/seo/generate-disavow.py" \
  --target marketingmojito.com --spam-threshold 40
```
This calls the DataForSEO Backlinks `referring_domains` endpoint via the installed `seo`
skill, filters to domains with `backlinks_spam_score >= 40` (excluding your own Webflow
mirror), and writes `disavow.txt` in Google's required format next to this file.

### Review before uploading
Open `disavow.txt` and sanity-check every line. Disavowing is a blunt instrument:
- **Keep** any domain that is a legitimate mention (a real blog, directory, or press hit),
  even if its spam score is moderate.
- **Disavow** obvious link-spam: auto-generated pages, scraper sites, unrelated foreign-TLD
  domains, and naked-URL link farms.
- When unsure, leave it **out** — false-disavowing a good link costs you equity.

### Upload to Google
1. Go to the **Google Disavow Tool**: https://search.google.com/search-console/disavow-links
2. Select the `marketingmojito.com` property.
3. Upload `disavow.txt`.
4. Google reprocesses these links over the following weeks as it re-crawls them.

> Disavow is a last resort. If the toxic links are few and the site has no manual action,
> Google usually ignores obvious spam on its own. Prioritise Part 1 (the mirror) — it's the
> larger, safer win.

---

## Re-audit
After the mirror is de-indexed/redirected and the disavow is uploaded, re-run the audit
in ~4–6 weeks (once credit is restored) to confirm the referring-domain quality improved:
```bash
python3 "/home/onyx/.claude/skills/seo/scripts/backlinks.py" summary --target marketingmojito.com
```

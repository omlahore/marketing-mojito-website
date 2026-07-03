#!/usr/bin/env python3
"""Generate a Google-format disavow.txt from DataForSEO referring-domain data.

Pulls referring domains for the target via the installed `seo` skill's backlinks
script, filters to the toxic tail (spam score >= threshold), excludes your own
Webflow staging mirror, and writes disavow.txt next to this file.

Usage:
  ./generate-disavow.py --target marketingmojito.com --spam-threshold 40

Requires a funded DataForSEO balance (the API returns 40200 "Payment Required"
when the balance is exhausted).
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys

BACKLINKS = "/home/onyx/.claude/skills/seo/scripts/backlinks.py"
HERE = os.path.dirname(os.path.abspath(__file__))

# Domains to never disavow (your own properties / known-good).
NEVER = ("webflow.io", "marketingmojito.com")


def fetch_refdomains(target: str, limit: int) -> list[dict]:
    proc = subprocess.run(
        [BACKLINKS, "refdomains", "--target", target, "--limit", str(limit)],
        capture_output=True, text=True,
    )
    if proc.returncode != 0 or not proc.stdout.strip():
        sys.stderr.write(proc.stderr or "no output from backlinks.py\n")
        if "40200" in (proc.stderr or "") or "Payment Required" in (proc.stderr or ""):
            sys.stderr.write("\n>>> DataForSEO balance exhausted. Top up and retry.\n")
        sys.exit(1)
    return json.loads(proc.stdout).get("items", [])


def domain_of(item: dict) -> str | None:
    return item.get("domain") or item.get("target") or None


def spam_of(item: dict) -> float:
    for k in ("backlinks_spam_score", "domain_spam_score", "spam_score"):
        v = item.get(k)
        if isinstance(v, (int, float)):
            return float(v)
    return 0.0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--target", required=True)
    ap.add_argument("--spam-threshold", type=float, default=40.0)
    ap.add_argument("--limit", type=int, default=1000)
    args = ap.parse_args()

    items = fetch_refdomains(args.target, args.limit)
    toxic, reviewed = [], 0
    for it in items:
        dom = domain_of(it)
        if not dom:
            continue
        reviewed += 1
        if any(n in dom for n in NEVER):
            continue
        if spam_of(it) >= args.spam_threshold:
            toxic.append((dom, spam_of(it), it.get("backlinks", "?")))

    toxic.sort(key=lambda t: t[1], reverse=True)

    out = os.path.join(HERE, "disavow.txt")
    with open(out, "w", encoding="utf-8") as f:
        f.write(f"# Disavow file for {args.target}\n")
        f.write(f"# Generated from DataForSEO referring_domains "
                f"(spam score >= {args.spam_threshold:g})\n")
        f.write(f"# Referring domains reviewed: {reviewed} | flagged: {len(toxic)}\n")
        f.write("# REVIEW EVERY LINE before uploading to Google Search Console.\n")
        f.write("# Upload: https://search.google.com/search-console/disavow-links\n#\n")
        for dom, score, bl in toxic:
            f.write(f"# spam={score:g} backlinks={bl}\n")
            f.write(f"domain:{dom}\n")

    print(f"Reviewed {reviewed} referring domains; flagged {len(toxic)} at "
          f"spam >= {args.spam_threshold:g}.")
    print(f"Wrote {out} — review it, then upload to Google Search Console.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

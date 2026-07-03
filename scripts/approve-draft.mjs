#!/usr/bin/env node
/**
 * Blog draft approval — the human gate.
 *
 * Drafts live in content/blog-drafts.json (status: "draft"). After you've
 * read and edited a draft, approve it to move it into the live blog
 * (content/blog-posts.json), then rebuild + deploy as usual.
 *
 * Usage:
 *   node scripts/approve-draft.mjs --list                 # show pending drafts
 *   node scripts/approve-draft.mjs <slug>                 # approve one draft
 *   node scripts/approve-draft.mjs --all                  # approve every draft
 *
 * Safe by design: it refuses to publish a draft whose slug already exists,
 * strips the internal "status" field, stamps today's date, and prepends the
 * post so it appears first in the blog grid.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DRAFTS = path.join(ROOT, 'content', 'blog-drafts.json');
const POSTS = path.join(ROOT, 'content', 'blog-posts.json');

const REQUIRED = ['slug', 'title', 'excerpt', 'content', 'categories'];

function load(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}
function save(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}
function rfc(d) {
  // e.g. "Mon, 16 Jun 2026 09:00:00 +0530"
  return d.toUTCString().replace('GMT', '+0000');
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node scripts/approve-draft.mjs <slug> | --all | --list');
  process.exit(1);
}

const drafts = load(DRAFTS);
const posts = load(POSTS);
const liveSlugs = new Set(posts.map((p) => p.slug));

if (arg === '--list') {
  if (!drafts.length) { console.log('No pending drafts.'); process.exit(0); }
  console.log(`${drafts.length} pending draft(s):\n`);
  for (const d of drafts) {
    const dup = liveSlugs.has(d.slug) ? '  ⚠ slug already live' : '';
    console.log(`  • ${d.slug}${dup}\n    ${d.title}`);
  }
  process.exit(0);
}

const toApprove = arg === '--all' ? [...drafts] : drafts.filter((d) => d.slug === arg);
if (!toApprove.length) {
  console.error(`No draft found with slug "${arg}". Run --list to see pending drafts.`);
  process.exit(1);
}

const now = new Date();
let approved = 0;
const remaining = [...drafts];

for (const draft of toApprove) {
  const missing = REQUIRED.filter((k) => !draft[k] || (Array.isArray(draft[k]) && !draft[k].length));
  if (missing.length) {
    console.error(`✗ ${draft.slug}: missing required fields: ${missing.join(', ')} — skipped`);
    continue;
  }
  if (liveSlugs.has(draft.slug)) {
    console.error(`✗ ${draft.slug}: a live post already uses this slug — skipped`);
    continue;
  }
  const { status, ...clean } = draft;
  const post = {
    slug: clean.slug,
    title: clean.title,
    excerpt: clean.excerpt,
    content: clean.content,
    date: clean.date || rfc(now),
    modified: clean.modified || now.toISOString().slice(0, 19).replace('T', ' '),
    author: clean.author || 'marketingmojitoindia',
    categories: clean.categories,
    featuredImage: clean.featuredImage || '/images/42.png',
    ...(clean.metaDescription ? { metaDescription: clean.metaDescription } : {}),
  };
  posts.unshift(post); // newest first
  liveSlugs.add(post.slug);
  remaining.splice(remaining.findIndex((d) => d.slug === draft.slug), 1);
  approved += 1;
  console.log(`✓ published: ${post.slug}`);
}

if (approved > 0) {
  save(POSTS, posts);
  save(DRAFTS, remaining);
  console.log(`\n${approved} post(s) published. ${remaining.length} draft(s) remain.`);
  console.log('Next: npm run build && bash deploy-lightsail.sh');
} else {
  console.log('\nNothing published.');
}

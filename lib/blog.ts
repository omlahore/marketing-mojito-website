import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  author: string;
  categories: string[];
  featuredImage: string;
  metaDescription?: string;
  faqs?: { question: string; answer: string }[];
}

const BLOG_DATA_PATH = path.join(process.cwd(), 'content', 'blog-posts.json');

export function getAllPosts(): BlogPost[] {
  const data = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'your',
  'you', 'how', 'what', 'why', 'is', 'are', 'can', 'do', 'does', 'it', 'its',
  'that', 'this', 'best', 'top', 'guide', 'tips', 'vs', 'from', 'by', 'at',
]);

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

/**
 * Related posts for internal linking: scored by title-keyword overlap with a
 * shared-category tiebreak. Deterministic at build time.
 */
export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const posts = getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];
  const tokens = titleTokens(current.title);
  const cats = new Set(current.categories);
  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      titleTokens(p.title).forEach((t) => {
        if (tokens.has(t)) score += 2;
      });
      for (const c of p.categories) if (cats.has(c)) score += 1;
      return { post: p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.post.slug.localeCompare(b.post.slug))
    .slice(0, count)
    .map((r) => r.post);
}

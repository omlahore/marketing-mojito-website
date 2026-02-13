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

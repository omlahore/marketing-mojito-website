import { getAllPosts } from '@/lib/blog';
import BlogGrid from './BlogGrid';

export const metadata = {
  title: 'Mojito Labs - Marketing Mojito Blog',
  description: 'Digital marketing insights, strategies, and tips from Marketing Mojito.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  // Pass only what the client component needs (no full content)
  const cardPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    categories: p.categories,
    featuredImage: p.featuredImage,
  }));

  return (
    <div className="padding-global padding-section-nav">
      <div className="container-large w-container">
        <BlogGrid posts={cardPosts} />
      </div>
    </div>
  );
}

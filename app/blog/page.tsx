import { getAllPosts } from '@/lib/blog';
import BlogGrid from './BlogGrid';

export const metadata = {
  title: 'Mojito Labs',
  description: 'Digital marketing insights, strategies, and tips from Marketing Mojito.',
  alternates: { canonical: 'https://marketingmojito.com/blog' },
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
        <h1 className="heading-style-h2">Mojito Labs</h1>
        <BlogGrid posts={cardPosts} />
      </div>
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';
import '../blog-content.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  const url = `https://marketingmojito.com/blog/${post.slug}`;
  const description = post.metaDescription || post.excerpt.slice(0, 160);
  return {
    title: `${post.title} - Marketing Mojito Blog`,
    description,
    // CRITICAL: without a per-post canonical, every post inherits the root
    // layout's canonical and tells Google it's a duplicate of the homepage.
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="padding-global padding-section-nav">
      <div className="container-large w-container" style={{ maxWidth: 720 }}>
        <header style={{ marginBottom: '2rem' }}>
          <Link
            href="/blog"
            style={{ color: '#82c341', textDecoration: 'none', fontWeight: 600 }}
          >
            ← Back to Blog
          </Link>
        </header>

        <article>
            <h1
              style={{
                fontSize: '2rem',
                lineHeight: 1.3,
                color: '#1a1a1a',
                marginBottom: '1rem',
              }}
            >
              {post.title}
            </h1>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '2rem',
              }}
            >
              <span>{new Date(post.date).toLocaleDateString('en-IN')}</span>
              <span>• {post.author}</span>
              {post.categories.length > 0 && (
                <span>• {post.categories.join(', ')}</span>
              )}
            </div>

            <div
              className="blog-content"
              style={{
                lineHeight: 1.7,
                color: '#333',
              }}
            >
              {parse(post.content)}
            </div>
          </article>

          <footer style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
            <Link
              href="/blog"
              style={{ color: '#82c341', textDecoration: 'none', fontWeight: 600 }}
            >
              ← All blog posts
            </Link>
        </footer>
      </div>
    </div>
  );
}

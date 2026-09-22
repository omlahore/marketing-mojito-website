import Link from 'next/link';
import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/blog';
import { BlogCtaStyles, BlogCtaMid, BlogCtaEnd } from '@/components/BlogCta';
import '../blog-content.css';

/**
 * Split post HTML at a safe top-level boundary (an <h2> past ~40% of the
 * content) so a CTA can be injected mid-article. WP-exported content is flat
 * (p/h2/h3/img/ul), so splitting before an <h2 is structurally safe.
 * Returns [firstHalf, secondHalf] or [html, ''] when no safe split exists.
 */
function splitForCta(html: string): [string, string] {
  const from = Math.floor(html.length * 0.4);
  for (const tag of ['<h2', '<h3', '<h4', '<p>']) {
    const idx = html.indexOf(tag, from);
    if (idx !== -1) return [html.slice(0, idx), html.slice(idx)];
  }
  return [html, ''];
}

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
  // Old WordPress /blog/wp-content/ uploads no longer exist on the server.
  const ogImage =
    post.featuredImage && !post.featuredImage.includes('/wp-content/')
      ? post.featuredImage
      : 'https://marketingmojito.com/images/42.png';
  return {
    // Root layout template appends " | Marketing Mojito" — don't repeat the brand here.
    title: post.title,
    description,
    // CRITICAL: without a per-post canonical, every post inherits the root
    // layout's canonical and tells Google it's a duplicate of the homepage.
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      images: [{ url: ogImage }],
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

  const toISO = (d?: string) => {
    if (!d) return undefined;
    const t = new Date(d);
    return isNaN(t.getTime()) ? undefined : t.toISOString();
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt.slice(0, 160),
    image:
      post.featuredImage && !post.featuredImage.includes('/wp-content/')
        ? post.featuredImage
        : 'https://marketingmojito.com/images/42.png',
    datePublished: toISO(post.date),
    dateModified: toISO(post.modified) || toISO(post.date),
    author: { '@type': 'Organization', name: 'Marketing Mojito', url: 'https://marketingmojito.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Marketing Mojito',
      logo: { '@type': 'ImageObject', url: 'https://marketingmojito.com/images/MM-1.png' },
    },
    mainEntityOfPage: `https://marketingmojito.com/blog/${post.slug}`,
  };

  // FAQPage rich result — only emitted when the engine extracted Q&A pairs.
  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://marketingmojito.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://marketingmojito.com/blog' },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://marketingmojito.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="padding-global padding-section-nav">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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

            <BlogCtaStyles />
            {(() => {
              const [first, second] = splitForCta(post.content);
              return (
                <div className="blog-content" style={{ lineHeight: 1.7, color: '#333' }}>
                  {parse(first)}
                  {second && <BlogCtaMid categories={post.categories} title={post.title} />}
                  {second && parse(second)}
                </div>
              );
            })()}
            {/* FAQ answers must be visible on the page — Google rejects FAQPage
                schema whose Q&A content the user cannot actually see. */}
            {post.faqs && post.faqs.length > 0 && (
              <section
                style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}
              >
                <h2 style={{ fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Frequently asked questions
                </h2>
                <dl style={{ margin: 0 }}>
                  {post.faqs.map((f) => (
                    <div key={f.question} style={{ marginBottom: '1.5rem' }}>
                      <dt
                        style={{
                          fontWeight: 600,
                          color: '#1a1a1a',
                          marginBottom: '0.5rem',
                          fontSize: '1.05rem',
                        }}
                      >
                        {f.question}
                      </dt>
                      <dd style={{ margin: 0, lineHeight: 1.7, color: '#333' }}>{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <BlogCtaEnd categories={post.categories} title={post.title} />
          </article>

          {(() => {
            const related = getRelatedPosts(post.slug);
            if (related.length === 0) return null;
            return (
              <nav
                aria-label="Related articles"
                style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}
              >
                <h2 style={{ fontSize: '1.25rem', color: '#1a1a1a', marginBottom: '1rem' }}>
                  Related articles
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {related.map((r) => (
                    <li key={r.slug} style={{ marginBottom: '0.75rem' }}>
                      <Link
                        href={`/blog/${r.slug}`}
                        style={{ color: '#82c341', textDecoration: 'none', fontWeight: 600 }}
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })()}

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

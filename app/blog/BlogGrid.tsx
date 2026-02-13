'use client';

import { useState } from 'react';
import Link from 'next/link';

const FALLBACK_IMAGE = '/images/42.png';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  categories: string[];
  featuredImage: string;
}

const POSTS_PER_PAGE = 9;

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const visible = posts.slice(start, start + POSTS_PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Build page numbers to display
  function getPageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <>
      <div className="blog-grid">
        {visible.map((post) => (
          <article key={post.slug} className="blog-card">
            <Link href={`/blog/${post.slug}`} className="blog-card-image-link">
              <img
                src={post.featuredImage || FALLBACK_IMAGE}
                alt={post.title}
                className="blog-card-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.getAttribute('data-fallback-used')) {
                    target.setAttribute('data-fallback-used', '1');
                    target.src = FALLBACK_IMAGE;
                  }
                }}
              />
            </Link>
            <div className="blog-card-body">
              <Link href={`/blog/${post.slug}`} className="blog-card-title-link">
                <h3 className="blog-card-title">{post.title}</h3>
              </Link>
              <p className="blog-card-excerpt">
                {post.excerpt.replace(/<[^>]+>/g, '').slice(0, 150)}...
              </p>
              <Link href={`/blog/${post.slug}`} className="blog-card-btn">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="blog-pagination" aria-label="Blog pagination">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="blog-page-btn blog-page-arrow"
            aria-label="Previous page"
          >
            &laquo;
          </button>
          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="blog-page-dots">...</span>
            ) : (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`blog-page-btn ${p === page ? 'active' : ''}`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="blog-page-btn blog-page-arrow"
            aria-label="Next page"
          >
            &raquo;
          </button>
        </nav>
      )}

      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 991px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr; }
        }

        .blog-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .blog-card-image-link {
          display: block;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #f0f0f0;
        }
        .blog-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .blog-card:hover .blog-card-image {
          transform: scale(1.05);
        }
        .blog-card-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e8e8e8, #f5f5f5);
        }

        .blog-card-body {
          padding: 1.25rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .blog-card-title-link {
          text-decoration: none;
          color: inherit;
        }
        .blog-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.4;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-excerpt {
          font-size: 0.875rem;
          color: #666;
          line-height: 1.6;
          margin: 0 0 1.25rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-btn {
          display: inline-block;
          align-self: flex-start;
          padding: 0.5rem 1.25rem;
          background: #82C341;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .blog-card-btn:hover {
          background: #6eaa35;
        }

        /* Pagination */
        .blog-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0 2rem;
        }
        .blog-page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 40px;
          padding: 0 0.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          color: #333;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .blog-page-btn:hover:not(:disabled):not(.active) {
          border-color: #82C341;
          color: #82C341;
        }
        .blog-page-btn.active {
          background: #82C341;
          border-color: #82C341;
          color: #fff;
        }
        .blog-page-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .blog-page-arrow {
          font-size: 1.1rem;
        }
        .blog-page-dots {
          padding: 0 0.25rem;
          color: #999;
        }
      `}</style>
    </>
  );
}

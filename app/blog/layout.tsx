import PageShell from '@/components/PageShell';
import BlogScripts from './BlogScripts';
import './blog-content.css';

/**
 * Blog layout — now uses the shared PageShell (React components)
 * instead of slicing HTML from mojito-labs.html and index.html.
 *
 * This means:
 * - No more readFileSync / string slicing / fixPaths
 * - Header and footer are real React components with working interactions
 * - Same components used by blog and any new React pages
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <main className="blog-main-content">{children}</main>
      <BlogScripts />
    </PageShell>
  );
}

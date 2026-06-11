import Header from './Header';
import Footer from './Footer';
import MobileDock from './MobileDock';
import WebflowStyles from './WebflowStyles';
import WebflowRuntimeScripts from './WebflowRuntimeScripts';

/**
 * PageShell — the complete page wrapper for any React-rendered page.
 *
 * Usage in any layout:
 *
 *   import PageShell from '@/components/PageShell';
 *
 *   export default function SomeLayout({ children }) {
 *     return <PageShell>{children}</PageShell>;
 *   }
 *
 * This replaces the old HTML-slicing approach in blog/layout.tsx.
 * Static HTML pages served via rewrites are NOT affected — they
 * still use their own <head> and embedded header/footer.
 *
 * React pages load the same Webflow runtime (jQuery + webflow.js) as static HTML
 * so navbar dropdowns, mobile menu, and IX2 (e.g. announcement marquee) work.
 */
interface PageShellProps {
  children: React.ReactNode;
  /** Extra class names on the body wrapper */
  className?: string;
  /** Hide the green top announcement / marquee bar (e.g. on Free Templates) */
  hideAnnouncement?: boolean;
}

export default function PageShell({ children, className, hideAnnouncement = false }: PageShellProps) {
  return (
    <div className={`body ${className || ''}`} style={{ margin: 0 }}>
      <WebflowStyles />
      <div className="page-wrapper">
        <div className="main-wrapper">
          <Header hideAnnouncement={hideAnnouncement} />
          {children}
          <Footer />
          <MobileDock />
        </div>
      </div>
      <WebflowRuntimeScripts />
    </div>
  );
}

/**
 * BlogCta — in-content conversion blocks for blog posts.
 * `variant="mid"` is a slim banner injected mid-article;
 * `variant="end"` is the full block after the article body.
 * Category-aware: maps the post's categories to the most relevant service page.
 */

const CAL_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0TsP5i42tYVxGSKLnyQSPuP2px8mxUmZfraM11FYQ-mk2-kM83oO6bGxBPqLV-IHeG4czTchxd?gv=true';

/** First matching category wins. */
const CATEGORY_SERVICE: Array<[RegExp, { href: string; label: string }]> = [
  [/brand/i, { href: '/brand-visual-identity', label: 'Branding & Visual Identity services' }],
  [/video|youtube|production/i, { href: '/photography-videography', label: 'Video & Photography services' }],
  [/social|instagram|facebook|linkedin|tiktok/i, { href: '/social-media-marketing', label: 'Social Media Marketing services' }],
  [/seo|content|search/i, { href: '/growth-marketing-seo-content-services', label: 'SEO & Content services' }],
  [/ads|advertis|ppc|google/i, { href: '/paid-advertising', label: 'Paid Advertising services' }],
  [/web|ecommerce|e-commerce|design/i, { href: '/websites-ecommerce', label: 'Website & E-commerce services' }],
];

function serviceFor(categories: string[], title = '') {
  // Categories are coarse ("Marketing" covers 65 posts) — the title is the
  // stronger cluster signal, so match against both.
  const joined = `${title} ${categories.join(' ')}`;
  for (const [re, svc] of CATEGORY_SERVICE) {
    if (re.test(joined)) return svc;
  }
  return { href: '/growth-marketing-seo-content-services', label: 'Growth Marketing services' };
}

const css = `
.bcta { border-radius: 1rem; margin: 2.5rem 0; font-family: Poppins, sans-serif; }
.bcta-mid { background: #f7fbf3; border: 1px solid #d9ecc6; padding: 1.5rem 1.75rem; display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; flex-wrap: wrap; }
.bcta-mid p { margin: 0; color: #353535; font-weight: 600; font-size: 1rem; line-height: 1.5; }
.bcta-mid p span { display: block; font-weight: 400; color: #474747; font-size: .9rem; margin-top: .2rem; }
.bcta-btn { background-image: linear-gradient(45deg, #82c341, #09ce91); color: #fff !important; border-radius: .5625rem; padding: .8em 1.3em; font-weight: 600; text-decoration: none; white-space: nowrap; display: inline-block; }
.bcta-end { background-image: linear-gradient(45deg, #000 43%, #364b54); text-align: center; padding: 2.5rem 1.75rem; }
.bcta-end h3 { font-family: Unbounded, sans-serif; color: #fff; font-size: 1.4rem; margin: 0 0 .35rem; line-height: 1.35; }
.bcta-end .bcta-yellow { color: #fdc934; }
.bcta-end p { color: #efefea; max-width: 520px; margin: .75rem auto 1.5rem; line-height: 1.65; font-size: .95rem; }
.bcta-end .bcta-svc { display: block; margin-top: 1rem; color: #a4d65e; font-size: .9rem; text-decoration: underline; }
`;

export function BlogCtaStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export function BlogCtaMid({ categories, title }: { categories: string[]; title?: string }) {
  const svc = serviceFor(categories, title);
  return (
    <aside className="bcta bcta-mid">
      <p>
        Want this done for your brand instead of DIY?
        <span>Free 15-minute strategy call — we&apos;ll show you the fastest wins. No commitment.</span>
      </p>
      <a href={CAL_URL} className="bcta-btn" data-cta="blog-mid">Book a Free Call</a>
    </aside>
  );
}

export function BlogCtaEnd({ categories, title }: { categories: string[]; title?: string }) {
  const svc = serviceFor(categories, title);
  return (
    <aside className="bcta bcta-end">
      <h3>
        Reading about it is step one.
        <br />
        <span className="bcta-yellow">Getting it done is ours.</span>
      </h3>
      <p>
        Book a free 15-minute strategy call and we&apos;ll audit your digital presence — you leave
        with an action plan either way.
      </p>
      <a href={CAL_URL} className="bcta-btn" data-cta="blog-end">Book a Free Strategy Call</a>
      <a href={svc.href} className="bcta-svc" data-cta="blog-end-service">
        Or explore our {svc.label} →
      </a>
    </aside>
  );
}

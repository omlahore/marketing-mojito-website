import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import PageShell from '@/components/PageShell';

const TOOL_ICONS: Record<string, ReactNode> = {
  mail: <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
  calc: <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h2M8 15h2M14 11v6" /></svg>,
  video: <svg viewBox="0 0 24 24"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3z" /></svg>,
  gauge: <svg viewBox="0 0 24 24"><path d="M12 14 4 9a8 8 0 1 1 16 0" /><circle cx="12" cy="14" r="1.5" /></svg>,
  refresh: <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" /></svg>,
  palette: <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1 .5-1.5 1.5-1.5h1.5A3 3 0 0 0 21 15a9 9 0 0 0-9-12z" /><circle cx="7.5" cy="11" r="1" /><circle cx="12" cy="7.5" r="1" /><circle cx="16.5" cy="11" r="1" /></svg>,
  type: <svg viewBox="0 0 24 24"><path d="M4 7V5h16v2M9 19h6M12 5v14" /></svg>,
};

export const metadata: Metadata = {
  title: 'Free Marketing Tools',
  description:
    'Free marketing tools built by experts. Use our utilities to save time and get better results.',
  alternates: { canonical: 'https://marketingmojito.com/free-tools' },
  openGraph: {
    title: 'Free Marketing Tools | Marketing Mojito',
    description: 'Free marketing tools built by experts. Save time and get results.',
    url: 'https://marketingmojito.com/free-tools',
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function FreeToolsPage() {
  return (
    <PageShell>
      <div className="q">
        <section className="section_hero">
          <div className="padding-global inner-banner-padding">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="columns-11 w-row">
                <div className="column-15 _1 w-col w-col-6">
                  <div className="hero-left">
                    <h1 className="inner-banner-heading">Free Tools</h1>
                    <div className="hero_para">
                      <div className="inner-banner-para">
                        Work smarter, not harder. Use our free marketing tools built by experts to save
                        time and get results.
                      </div>
                    </div>
                    <div className="div-block-91">
                      <a
                        href="/contact-us"
                        target="_blank"
                        rel="noreferrer"
                        className="solid-button-wrapper hero-banner-btn w-button"
                      >
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
                <div className="column-16 w-col w-col-6">
                  <div className="hero-image-wrapper">
                    <img
                      sizes="(max-width: 767px) 96vw, (max-width: 991px) 354px, 460px"
                      srcSet="/images/Viral-Content-p-500.png 500w, /images/Viral-Content-p-800.png 800w, /images/Viral-Content.png 1080w"
                      alt="hero-image"
                      src="/images/Viral-Content.png"
                      loading="lazy"
                      className="header-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-brand">
          <div className="padding-global padding-section-small">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="heading-wrapper">
                <div className="heading-wrap-inner">
                  <h3 className="main-heading-style-h3">Tools you can use today</h3>
                  <p className="main-heading-para">More tools are coming soon.</p>
                </div>
              </div>
              <style dangerouslySetInnerHTML={{ __html: `
.tools-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; margin-top:2.5rem; }
@media (max-width:991px){ .tools-grid{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:600px){ .tools-grid{ grid-template-columns:1fr; } }
.tool-card { background:#fff; border-radius:16px; padding:2rem 1.75rem; display:flex; flex-direction:column; box-shadow:0 6px 24px rgba(53,53,53,.08); transition:transform .2s, box-shadow .2s; }
.tool-card:hover { transform:translateY(-4px); box-shadow:0 14px 32px rgba(53,53,53,.14); }
.tool-ico { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#82c341,#09ce91); margin-bottom:1.25rem; }
.tool-ico svg { width:28px; height:28px; stroke:#fff; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.tool-card h4 { font-family:Unbounded,sans-serif; font-size:1.05rem; font-weight:500; color:#353535; margin:0 0 .6rem; line-height:1.3; }
.tool-card p { font-family:Poppins,sans-serif; font-size:.9rem; line-height:1.6; color:#474747; margin:0 0 1.5rem; flex:1; }
.tool-card .tool-btn { align-self:flex-start; background-image:linear-gradient(45deg,#82c341,#09ce91); color:#fff; border-radius:.5625rem; padding:.7em 1.4em; font-family:Poppins,sans-serif; font-weight:600; font-size:.8rem; letter-spacing:.04em; text-transform:uppercase; text-decoration:none; }
` }} />
              <div className="tools-grid">
                {[
                  { href: '/free-tools/email-signature-generator', title: 'Email Signature Generator', desc: 'Create professional email signatures in minutes. Customize colors, fonts, and layout — then copy the HTML into Gmail, Outlook, or any client.', icon: 'mail' },
                  { href: '/free-tools/website-cost-calculator', title: 'Website Cost Calculator', desc: 'Estimate what a new website or e-commerce store costs. Pick your type, pages, and features for an instant, honest price range.', icon: 'calc' },
                  { href: '/free-tools/video-production-cost-estimator', title: 'Video Production Cost Estimator', desc: 'Planning a video? Choose type, length, crew, and post-production to get a realistic cost range before you brief anyone.', icon: 'video' },
                  { href: '/free-tools/website-health-score', title: 'Website Health Score', desc: 'Score your site in 60 seconds across speed, mobile, SEO, and conversion — and get a prioritized list of what to fix first.', icon: 'gauge' },
                  { href: '/free-tools/maintenance-vs-rebuild', title: 'Patch or Rebuild?', desc: 'Should you keep patching your old site or rebuild? Get a clear verdict and a realistic rebuild budget in a minute.', icon: 'refresh' },
                  { href: '/free-tools/color-palette-generator', title: 'Brand Color Palette Generator', desc: 'Generate a harmonious brand palette from any base color, with hex codes, tints, and shades ready to copy.', icon: 'palette' },
                  { href: '/free-tools/font-pairing-tool', title: 'Font Pairing Tool', desc: 'Pick a heading font and preview expert-matched body fonts live, then copy the ready-to-paste embed code.', icon: 'type' },
                ].map((t) => (
                  <div key={t.href} className="tool-card">
                    <div className="tool-ico" aria-hidden="true">{TOOL_ICONS[t.icon]}</div>
                    <h4>{t.title}</h4>
                    <p>{t.desc}</p>
                    <Link href={t.href} className="tool-btn">Use Tool</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

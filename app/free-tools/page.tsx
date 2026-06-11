import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';

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
                    <h2 className="inner-banner-heading">Free Tools</h2>
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
              <div className="grid-wrap" style={{ justifyContent: 'center' }}>
                <div className="featured-card" style={{ maxWidth: '22rem', width: '100%' }}>
                  <img
                    sizes="100vw"
                    srcSet="/images/Free-Templates_1Free-Templates.avif 500w, /images/Free-Templates_1.avif 1600w"
                    alt=""
                    src="/images/Free-Templates_1.avif"
                    loading="lazy"
                    className="image-12"
                  />
                  <h4 className="article-title">Email Signature Generator</h4>
                  <div className="text-block-13">
                    Create professional email signatures in minutes. Customize colors, fonts, layout, and
                    add your photo — then copy the HTML and paste into Gmail, Outlook, or any email
                    client.
                  </div>
                  <Link
                    href="/free-tools/email-signature-generator"
                    className="button caps-btn w-button"
                  >
                    Use Tool
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

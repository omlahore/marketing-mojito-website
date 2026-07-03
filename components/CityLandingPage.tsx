import PageShell from '@/components/PageShell';

export interface CityConfig {
  slug: string;
  city: string;
  heroSub: string;
  whyParas: string[];
  industries: Array<{ name: string; desc: string; href: string }>;
  faqs: Array<{ q: string; a: string }>;
}

const CAL_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0TsP5i42tYVxGSKLnyQSPuP2px8mxUmZfraM11FYQ-mk2-kM83oO6bGxBPqLV-IHeG4czTchxd?gv=true';

const services = [
  {
    title: 'SEO & Content Marketing',
    desc: 'Rank for the searches your buyers make — technical SEO, content strategy, and local visibility.',
    href: '/growth-marketing-seo-content-services',
    accent: '#82c341',
  },
  {
    title: 'Paid Advertising (PPC)',
    desc: 'Google, Meta, and LinkedIn campaigns measured in leads and revenue, not impressions.',
    href: '/paid-advertising',
    accent: '#fdc934',
  },
  {
    title: 'Social Media Marketing',
    desc: 'Strategy, content, reels, and community management that turn attention into customers.',
    href: '/social-media-marketing',
    accent: '#09ce91',
  },
  {
    title: 'Branding & Identity',
    desc: 'Positioning and visual identity that make you the memorable choice in your market.',
    href: '/brand-visual-identity',
    accent: '#82c341',
  },
  {
    title: 'Websites & E-commerce',
    desc: 'Fast, conversion-focused websites and stores, built to rank from day one.',
    href: '/websites-ecommerce',
    accent: '#fdc934',
  },
  {
    title: 'Video & Motion',
    desc: 'Brand films, product shoots, reels, and animation produced fully in-house.',
    href: '/photography-videography',
    accent: '#09ce91',
  },
];

const pageCss = `
.city-hero { background: linear-gradient(135deg, #f7fbf3 0%, #fffce1 100%); border-radius: 0 0 2rem 2rem; }
.city-hero-inner { padding: 5rem 0 4rem; max-width: 800px; }
.city-eyebrow { display: inline-block; background: #82c341; color: #fff; font-family: Poppins, sans-serif; font-weight: 600; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; border-radius: 2rem; padding: .45em 1.1em; margin-bottom: 1.25rem; }
.city-hero-sub { font-size: 1.125rem; line-height: 1.7; color: #474747; margin: 1.25rem 0 2rem; max-width: 680px; }
.city-btn-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.city-btn-ghost { border: 2px solid #353535; color: #353535; border-radius: .5625rem; padding: .9em 1.4em; font-weight: 600; text-decoration: none; transition: all .2s; }
.city-btn-ghost:hover { background: #353535; color: #fff; }
.city-section { padding: 4rem 0 1rem; }
.city-h2 { font-family: Unbounded, sans-serif; font-weight: 600; font-size: 2rem; line-height: 1.25; color: #353535; margin: 0 0 .75rem; }
.city-sub { color: #474747; font-size: 1.05rem; margin: 0 0 2.5rem; max-width: 680px; }
.city-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.city-card { background: #fff; border-radius: 1rem; padding: 1.75rem; text-decoration: none; display: block; box-shadow: 0 6px 24px rgba(53,53,53,.08); border-top: 5px solid var(--city-accent, #82c341); transition: transform .2s, box-shadow .2s; }
.city-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(53,53,53,.14); }
.city-card h3 { font-family: Poppins, sans-serif; font-size: 1.1rem; font-weight: 700; color: #353535; margin: 0 0 .5rem; }
.city-card p { color: #474747; font-size: .95rem; line-height: 1.65; margin: 0; }
.city-card-link { display: inline-block; margin-top: 1rem; color: #82c341; font-weight: 600; font-size: .9rem; }
.city-prose { max-width: 820px; }
.city-prose p { color: #474747; line-height: 1.75; margin: 0 0 1rem; }
.city-faq { max-width: 820px; }
.city-faq details { background: #fff; border-radius: 1rem; box-shadow: 0 4px 16px rgba(53,53,53,.07); margin-bottom: 1rem; padding: 1.25rem 1.5rem; }
.city-faq summary { font-family: Poppins, sans-serif; font-weight: 600; color: #353535; cursor: pointer; list-style: none; position: relative; padding-right: 2rem; }
.city-faq summary::after { content: '+'; position: absolute; right: 0; top: 0; color: #82c341; font-size: 1.4rem; font-weight: 700; line-height: 1; }
.city-faq details[open] summary::after { content: '\\2212'; }
.city-faq p { color: #474747; line-height: 1.75; margin: 1rem 0 0; }
.city-cta { background-image: linear-gradient(45deg, #000 43%, #364b54); border-radius: 2rem; text-align: center; padding: 4rem 2rem; }
.city-cta .city-h2 { color: #fff; }
.city-cta .city-cta-yellow { color: #fdc934; display: block; }
.city-cta p { color: #efefea; max-width: 560px; margin: 1rem auto 2rem; line-height: 1.7; }
@media (max-width: 767px) {
  .city-hero-inner { padding: 3rem 0 2.5rem; }
  .city-h2 { font-size: 1.5rem; }
}
`;

export default function CityLandingPage({ config }: { config: CityConfig }) {
  const url = `https://marketingmojito.com/${config.slug}`;
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Digital Marketing Services in ${config.city}`,
    serviceType: 'Digital marketing',
    provider: { '@type': 'Organization', name: 'Marketing Mojito', url: 'https://marketingmojito.com' },
    areaServed: { '@type': 'City', name: config.city },
    description: `Full-service digital marketing for businesses in ${config.city}: SEO, paid advertising, social media, branding, video, and web development.`,
    url,
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      {/* Hero */}
      <section className="city-hero">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="city-hero-inner">
              <span className="city-eyebrow">{config.city}</span>
              <h1 className="inner-banner-heading">Digital Marketing Agency in {config.city}</h1>
              <p className="city-hero-sub">{config.heroSub}</p>
              <div className="city-btn-row">
                <a href={CAL_URL} className="solid-button-wrapper hero-banner-btn w-button">
                  Book a Free 15-min Strategy Call
                </a>
                <a href="/contact-us" className="city-btn-ghost">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="city-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="city-h2">Digital Marketing Services for {config.city} Businesses</h2>
            <p className="city-sub">The full growth stack — one team, one strategy, one report.</p>
            <div className="city-grid">
              {services.map((s) => (
                <a key={s.title} href={s.href} className="city-card" style={{ ['--city-accent' as never]: s.accent }}>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="city-card-link">Explore →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why / local context */}
      <section className="city-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="city-h2">Why {config.city} Businesses Work With Us</h2>
            <div className="city-prose">
              {config.whyParas.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="city-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="city-h2">Industries We Serve in {config.city}</h2>
            <div className="city-grid">
              {config.industries.map((ind) => (
                <a key={ind.name} href={ind.href} className="city-card">
                  <h3>{ind.name}</h3>
                  <p>{ind.desc}</p>
                  <span className="city-card-link">Learn more →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="city-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="city-h2">Frequently Asked Questions</h2>
            <div className="city-faq">
              {config.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="city-section" style={{ paddingBottom: '4rem' }}>
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="city-cta">
              <h2 className="city-h2">
                Ready to grow in {config.city}?
                <span className="city-cta-yellow">Let&apos;s find your fastest wins.</span>
              </h2>
              <p>
                Book a free 15-minute strategy call. We&apos;ll audit your digital presence and show
                you exactly where the growth is — no commitment.
              </p>
              <a href={CAL_URL} className="solid-button-wrapper hero-banner-btn w-button">
                Book the Free Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

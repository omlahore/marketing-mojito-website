import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';

const URL = 'https://marketingmojito.com/celebrity-brand-marketing';

export const metadata: Metadata = {
  title: { absolute: 'Celebrity & Artist Brand Marketing Agency India | Marketing Mojito' },
  description:
    'Brand marketing for musicians, performers & public figures. Trusted by Padma Shri awardees Hariharan & Jaspinder Narula. Personal branding, social media, video & fan growth — India and worldwide.',
  keywords: [
    'celebrity brand marketing agency', 'artist marketing agency India', 'musician marketing agency',
    'personal branding for celebrities', 'artist social media management', 'entertainment marketing agency',
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Celebrity & Artist Brand Marketing | Marketing Mojito',
    description:
      'Brand marketing for musicians, performers & public figures. Trusted by Padma Shri awardees.',
    images: [{ url: 'https://marketingmojito.com/images/MM-1.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Celebrity & Artist Brand Marketing | Marketing Mojito',
    description: 'Brand marketing for musicians, performers & public figures.',
  },
};

const faqs = [
  {
    q: 'What does a celebrity brand marketing agency do?',
    a: 'We manage the digital presence of artists, musicians, and public figures end to end: positioning and personal branding, social media strategy and management, content and video production, release and event promotion, and audience growth — so the artist focuses on the craft while the brand grows.',
  },
  {
    q: 'Which artists and entertainment brands has Marketing Mojito worked with?',
    a: 'Our roster includes Padma Shri awardees Hariharan and Jaspinder Narula, entertainment companies like Morya Entertainment, and culture-focused platforms like XploreIndia Stream, alongside hospitality and corporate brands.',
  },
  {
    q: 'Do you work with international artists or only in India?',
    a: 'Both. Campaigns for music releases, tours, and personal brands routinely span Indian and international audiences across Instagram, YouTube, Facebook, and LinkedIn.',
  },
  {
    q: 'How is artist marketing different from regular social media management?',
    a: 'An artist is the product. The work centres on narrative and legacy: archiving and presenting a body of work, balancing fan engagement with prestige, managing press moments, and converting attention into streams, bookings, and brand deals — not just posting on a calendar.',
  },
  {
    q: 'How do we start?',
    a: 'Book a free 15-minute strategy call. We audit your current digital presence, identify the fastest wins, and propose a plan with clear deliverables before any commitment.',
  },
];

const services = [
  {
    title: 'Personal Branding & Digital Legacy',
    desc: 'Positioning, storytelling, and a digital presence that does justice to a lifetime of work — built to resonate with existing fans and reach new generations.',
    href: '/personal-branding',
    icon: '/images/brush-outline.svg',
    accent: '#82c341',
  },
  {
    title: 'Social Media Strategy & Management',
    desc: 'Full-stack management across Instagram, YouTube, Facebook, and X — content calendars, community management, and trend-aware curation.',
    href: '/strategy-management',
    icon: '/images/chatbubbles-outline.svg',
    accent: '#fdc934',
  },
  {
    title: 'Video, Motion & Photography',
    desc: 'Performance films, reels, motion graphics, and shoots that match the production quality your stage work deserves.',
    href: '/photography-videography',
    icon: '/images/trending-up-outline.svg',
    accent: '#09ce91',
  },
  {
    title: 'Release & Event Promotion',
    desc: 'Launch campaigns for albums, singles, tours, and live events — teasers, influencer collaborations, and paid amplification.',
    href: '/viral-content-shorts-page',
    icon: '/images/cloud-download-outline.svg',
    accent: '#82c341',
  },
  {
    title: 'Viral & Short-form Content',
    desc: 'Scroll-stopping shorts and fan-first formats engineered for discovery on Reels, Shorts, and TikTok-style surfaces.',
    href: '/viral-content-shorts-page',
    icon: '/images/chatbubbles-outline.svg',
    accent: '#fdc934',
  },
  {
    title: 'Paid Amplification',
    desc: 'Targeted campaigns on Meta, Google, and YouTube to push releases and announcements beyond the organic ceiling.',
    href: '/paid-advertising',
    icon: '/images/trending-up-outline.svg',
    accent: '#09ce91',
  },
];

const testimonials = [
  {
    quote:
      'Marketing Mojito beautifully translated my music and legacy into the digital space. Their social media management and event promotions helped us connect with a whole new generation.',
    name: 'Hariharan',
    role: 'Singer & Padma Shri Awardee',
    img: '/images/hariharan-ji.png',
  },
  {
    quote:
      'They captured the essence of my art and heritage with grace. I now have a digital presence that truly resonates with my audience and elevates my brand.',
    name: 'Jaspinder Narula',
    role: 'Singer & Padma Shri Awardee',
    img: '/images/jaspinder-narula.png',
  },
  {
    quote:
      'Entertainment marketing needs a pulse on what\u2019s hot \u2014 and Marketing Mojito has that instinct. From buzz-worthy content to strategic collaborations, they deliver every time.',
    name: 'Vishal G',
    role: 'Founder \u2013 Morya Entertainment',
    img: '/images/New-Project-19.png',
  },
];

const steps: Array<[string, string]> = [
  ['Audit', 'We review your current digital presence, audience, and positioning — and where attention is leaking.'],
  ['Strategy', 'A brand narrative and channel plan built around your work, your audience, and your goals.'],
  ['Production', 'Content, video, and design produced to performance standard, on a steady calendar.'],
  ['Growth', 'Distribution, promotion, and paid amplification — measured in reach, engagement, and real-world outcomes.'],
];

const CAL_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0TsP5i42tYVxGSKLnyQSPuP2px8mxUmZfraM11FYQ-mk2-kM83oO6bGxBPqLV-IHeG4czTchxd?gv=true';

const pageCss = `
.cbm-hero { background: linear-gradient(135deg, #f7fbf3 0%, #fffce1 100%); border-radius: 0 0 2rem 2rem; }
.cbm-hero-inner { padding: 5rem 0 4rem; max-width: 800px; }
.cbm-eyebrow { display: inline-block; background: #82c341; color: #fff; font-family: Poppins, sans-serif; font-weight: 600; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; border-radius: 2rem; padding: .45em 1.1em; margin-bottom: 1.25rem; }
.cbm-hero-sub { font-size: 1.125rem; line-height: 1.7; color: #474747; margin: 1.25rem 0 2rem; max-width: 680px; }
.cbm-btn-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.cbm-btn-ghost { border: 2px solid #353535; color: #353535; border-radius: .5625rem; padding: .9em 1.4em; font-weight: 600; text-decoration: none; transition: all .2s; }
.cbm-btn-ghost:hover { background: #353535; color: #fff; }
.cbm-section { padding: 4rem 0 1rem; }
.cbm-h2 { font-family: Unbounded, sans-serif; font-weight: 600; font-size: 2rem; line-height: 1.25; color: #353535; margin: 0 0 .75rem; }
.cbm-sub { color: #474747; font-size: 1.05rem; margin: 0 0 2.5rem; max-width: 680px; }
.cbm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.cbm-card { background: #fff; border-radius: 1rem; padding: 1.75rem; text-decoration: none; display: block; box-shadow: 0 6px 24px rgba(53,53,53,.08); border-top: 5px solid var(--cbm-accent, #82c341); transition: transform .2s, box-shadow .2s; }
.cbm-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(53,53,53,.14); }
.cbm-card-icon { width: 52px; height: 52px; border-radius: .75rem; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--cbm-accent, #82c341) 16%, white); margin-bottom: 1rem; }
.cbm-card-icon img { width: 26px; height: 26px; }
.cbm-card h3 { font-family: Poppins, sans-serif; font-size: 1.1rem; font-weight: 700; color: #353535; margin: 0 0 .5rem; }
.cbm-card p { color: #474747; font-size: .95rem; line-height: 1.65; margin: 0; }
.cbm-card-link { display: inline-block; margin-top: 1rem; color: #82c341; font-weight: 600; font-size: .9rem; }
.cbm-quote-card { background: #fcf8ec; border-radius: 1rem; padding: 2rem 1.75rem; display: flex; flex-direction: column; }
.cbm-quote-card img.cbm-qmark { width: 28px; margin-bottom: 1rem; }
.cbm-quote-card blockquote { margin: 0 0 1.5rem; color: #353535; font-size: .98rem; line-height: 1.75; flex: 1; }
.cbm-person { display: flex; align-items: center; gap: .8rem; }
.cbm-person img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
.cbm-person strong { font-family: Poppins, sans-serif; color: #353535; }
.cbm-person span { display: block; font-size: .85rem; color: #474747; }
.cbm-step { background: #fff; border-radius: 1rem; padding: 1.75rem; box-shadow: 0 6px 24px rgba(53,53,53,.08); }
.cbm-step-num { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(45deg, #82c341, #09ce91); color: #fff; font-family: Unbounded, sans-serif; font-weight: 600; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
.cbm-step h3 { font-family: Poppins, sans-serif; font-size: 1.05rem; font-weight: 700; color: #353535; margin: 0 0 .5rem; }
.cbm-step p { color: #474747; font-size: .95rem; line-height: 1.65; margin: 0; }
.cbm-faq { max-width: 820px; }
.cbm-faq details { background: #fff; border-radius: 1rem; box-shadow: 0 4px 16px rgba(53,53,53,.07); margin-bottom: 1rem; padding: 1.25rem 1.5rem; }
.cbm-faq summary { font-family: Poppins, sans-serif; font-weight: 600; color: #353535; cursor: pointer; list-style: none; position: relative; padding-right: 2rem; }
.cbm-faq summary::after { content: '+'; position: absolute; right: 0; top: 0; color: #82c341; font-size: 1.4rem; font-weight: 700; line-height: 1; }
.cbm-faq details[open] summary::after { content: '\\2212'; }
.cbm-faq p { color: #474747; line-height: 1.75; margin: 1rem 0 0; }
.cbm-cta { background-image: linear-gradient(45deg, #000 43%, #364b54); border-radius: 2rem; text-align: center; padding: 4rem 2rem; }
.cbm-cta .cbm-h2 { color: #fff; }
.cbm-cta .cbm-cta-yellow { color: #fdc934; display: block; }
.cbm-cta p { color: #efefea; max-width: 560px; margin: 1rem auto 2rem; line-height: 1.7; }
@media (max-width: 767px) {
  .cbm-hero-inner { padding: 3rem 0 2.5rem; }
  .cbm-h2 { font-size: 1.5rem; }
}
`;

export default function CelebrityBrandMarketingPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Celebrity & Artist Brand Marketing',
    provider: { '@type': 'Organization', name: 'Marketing Mojito', url: 'https://marketingmojito.com' },
    areaServed: ['IN', 'Worldwide'],
    description:
      'Brand marketing for musicians, performers, and public figures: personal branding, social media management, video production, and release promotion.',
    url: URL,
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
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
      <section className="cbm-hero">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="cbm-hero-inner">
              <span className="cbm-eyebrow">Entertainment &amp; Celebrity Marketing</span>
              <h1 className="inner-banner-heading">Celebrity &amp; Artist Brand Marketing</h1>
              <p className="cbm-hero-sub">
                We build and manage the digital presence of musicians, performers, and public
                figures — trusted by Padma Shri awardees Hariharan and Jaspinder Narula. From
                personal branding to release campaigns, your story told at the standard your work
                deserves.
              </p>
              <div className="cbm-btn-row">
                <a href={CAL_URL} className="solid-button-wrapper hero-banner-btn w-button">
                  Book a Free 15-min Strategy Call
                </a>
                <a href="/contact-us" className="cbm-btn-ghost">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="cbm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="cbm-h2">What We Do for Artists &amp; Entertainment Brands</h2>
            <p className="cbm-sub">One team for the whole brand — strategy, content, production, and growth.</p>
            <div className="cbm-grid">
              {services.map((s) => (
                <a key={s.title} href={s.href} className="cbm-card" style={{ ['--cbm-accent' as never]: s.accent }}>
                  <div className="cbm-card-icon">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt="" loading="lazy" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="cbm-card-link">Explore →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="cbm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="cbm-h2">Trusted by Legends and Entertainment Brands</h2>
            <p className="cbm-sub">Real artists. Real legacies. Managed with care.</p>
            <div className="cbm-grid">
              {testimonials.map((t) => (
                <figure key={t.name} className="cbm-quote-card" style={{ margin: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icon-quotes.svg" alt="" className="cbm-qmark" loading="lazy" />
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="cbm-person">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.img} alt={t.name} loading="lazy" />
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="cbm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="cbm-h2">How It Works</h2>
            <p className="cbm-sub">A clear path from audit to growth — no black box.</p>
            <div className="cbm-grid">
              {steps.map(([title, desc], i) => (
                <div key={title} className="cbm-step">
                  <div className="cbm-step-num">{i + 1}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cbm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="cbm-h2">Frequently Asked Questions</h2>
            <div className="cbm-faq">
              {faqs.map((f) => (
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
      <section className="cbm-section" style={{ paddingBottom: '4rem' }}>
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="cbm-cta">
              <h2 className="cbm-h2">
                Your work deserves an audience that matches it.
                <span className="cbm-cta-yellow">Let&apos;s build your legacy online.</span>
              </h2>
              <p>
                Book a free 15-minute strategy call. We&apos;ll audit your presence and show you the
                fastest wins — no commitment.
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

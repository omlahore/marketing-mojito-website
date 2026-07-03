import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';

const URL = 'https://marketingmojito.com/social-media-marketing';

export const metadata: Metadata = {
  title: { absolute: 'Social Media Marketing Agency India | Marketing Mojito' },
  description:
    'Full-service social media marketing agency in India. Strategy, content, reels, community management & paid social across Instagram, YouTube, LinkedIn & Facebook. Book a free strategy call.',
  keywords: [
    'social media marketing agency', 'social media marketing services', 'social media agency India',
    'social media management company', 'Instagram marketing agency', 'paid social advertising',
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Social Media Marketing Agency India | Marketing Mojito',
    description:
      'Strategy, content, reels, community management & paid social across Instagram, YouTube, LinkedIn & Facebook.',
    images: [{ url: 'https://marketingmojito.com/images/MM-1.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Media Marketing Agency India | Marketing Mojito',
    description: 'Strategy, content, reels, community management & paid social — one team, measured in growth.',
  },
};

const faqs = [
  {
    q: 'What do your social media marketing services include?',
    a: 'Everything a brand needs to grow on social: channel strategy and positioning, monthly content calendars, design and video production (including reels and shorts), community management, influencer collaborations, paid social campaigns, and monthly reporting tied to reach, engagement, and leads — not vanity metrics.',
  },
  {
    q: 'How much does social media marketing cost in India?',
    a: 'Professional social media management in India typically ranges from ₹25,000 to ₹1,00,000+ per month depending on the number of platforms, content volume, and whether video production and paid campaigns are included. We scope engagements after a free audit of your current presence.',
  },
  {
    q: 'Which platforms should my business be on?',
    a: 'Fewer than you think. We recommend platforms based on where your buyers actually spend attention: Instagram and YouTube for consumer brands, LinkedIn for B2B, and Facebook for community and local reach. Two platforms done consistently beat five done sporadically.',
  },
  {
    q: 'How long before social media shows business results?',
    a: 'Engagement and reach typically improve within the first 4–8 weeks of consistent, quality posting. Follower growth and inbound leads compound over 3–6 months. Paid social can generate leads from week one while the organic engine builds.',
  },
  {
    q: 'Do you create the content or do we have to supply it?',
    a: 'We create it. Design, copy, photography, video, and editing are all in-house — including batch shoot days that yield weeks of reels. You approve a monthly calendar; we handle production and posting.',
  },
  {
    q: 'Can you handle paid social campaigns too?',
    a: 'Yes. Our paid media team runs Meta, LinkedIn, and YouTube campaigns coordinated with your organic content — so winning organic posts become ads, and ad insights feed the content strategy.',
  },
];

const services = [
  {
    title: 'Social Media Strategy',
    desc: 'Positioning, platform mix, content pillars, and a growth plan built around your audience — not generic best practices.',
    href: '/strategy-management',
    icon: '/images/chatbubbles-outline.svg',
    accent: '#82c341',
  },
  {
    title: 'Content Creation & Design',
    desc: 'Statics, carousels, stories, and copy produced in-house on a consistent monthly calendar, in your brand voice.',
    href: '/brand-visual-identity',
    icon: '/images/brush-outline.svg',
    accent: '#fdc934',
  },
  {
    title: 'Reels, Shorts & Video',
    desc: 'Batch-shot, scroll-stopping short-form video — the highest-reach format on every platform right now.',
    href: '/viral-content-shorts-page',
    icon: '/images/trending-up-outline.svg',
    accent: '#09ce91',
  },
  {
    title: 'Community Management',
    desc: 'Comments, DMs, and reviews handled daily — because response speed is a ranking and trust signal on social.',
    href: '/contact-us',
    icon: '/images/chatbubbles-outline.svg',
    accent: '#82c341',
  },
  {
    title: 'Paid Social Advertising',
    desc: 'Meta, LinkedIn, and YouTube campaigns that turn engaged audiences into leads and sales, run by our paid media team.',
    href: '/paid-advertising',
    icon: '/images/trending-up-outline.svg',
    accent: '#fdc934',
  },
  {
    title: 'Influencer & Creator Collabs',
    desc: 'Creator partnerships planned for reach that converts — briefs, negotiation, and performance tracking included.',
    href: '/celebrity-brand-marketing',
    icon: '/images/cloud-download-outline.svg',
    accent: '#09ce91',
  },
];

const steps: Array<[string, string]> = [
  ['Audit & Strategy', 'We review your current channels, competitors, and audience, then set content pillars, platform mix, and growth targets.'],
  ['Content Engine', 'Monthly calendars, batch production days, and an approval flow that keeps quality high and posting consistent.'],
  ['Community & Distribution', 'Daily publishing, engagement, and community management — plus paid amplification of what performs.'],
  ['Measure & Compound', 'Monthly reporting on reach, engagement, followers, and leads — with the next month planned from what the data says.'],
];

const CAL_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0TsP5i42tYVxGSKLnyQSPuP2px8mxUmZfraM11FYQ-mk2-kM83oO6bGxBPqLV-IHeG4czTchxd?gv=true';

const pageCss = `
.smm-hero { background: linear-gradient(135deg, #f7fbf3 0%, #fffce1 100%); border-radius: 0 0 2rem 2rem; }
.smm-hero-inner { padding: 5rem 0 4rem; max-width: 800px; }
.smm-eyebrow { display: inline-block; background: #82c341; color: #fff; font-family: Poppins, sans-serif; font-weight: 600; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; border-radius: 2rem; padding: .45em 1.1em; margin-bottom: 1.25rem; }
.smm-hero-sub { font-size: 1.125rem; line-height: 1.7; color: #474747; margin: 1.25rem 0 2rem; max-width: 680px; }
.smm-btn-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.smm-btn-ghost { border: 2px solid #353535; color: #353535; border-radius: .5625rem; padding: .9em 1.4em; font-weight: 600; text-decoration: none; transition: all .2s; }
.smm-btn-ghost:hover { background: #353535; color: #fff; }
.smm-section { padding: 4rem 0 1rem; }
.smm-h2 { font-family: Unbounded, sans-serif; font-weight: 600; font-size: 2rem; line-height: 1.25; color: #353535; margin: 0 0 .75rem; }
.smm-sub { color: #474747; font-size: 1.05rem; margin: 0 0 2.5rem; max-width: 680px; }
.smm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.smm-card { background: #fff; border-radius: 1rem; padding: 1.75rem; text-decoration: none; display: block; box-shadow: 0 6px 24px rgba(53,53,53,.08); border-top: 5px solid var(--smm-accent, #82c341); transition: transform .2s, box-shadow .2s; }
.smm-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(53,53,53,.14); }
.smm-card-icon { width: 52px; height: 52px; border-radius: .75rem; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--smm-accent, #82c341) 16%, white); margin-bottom: 1rem; }
.smm-card-icon img { width: 26px; height: 26px; }
.smm-card h3 { font-family: Poppins, sans-serif; font-size: 1.1rem; font-weight: 700; color: #353535; margin: 0 0 .5rem; }
.smm-card p { color: #474747; font-size: .95rem; line-height: 1.65; margin: 0; }
.smm-card-link { display: inline-block; margin-top: 1rem; color: #82c341; font-weight: 600; font-size: .9rem; }
.smm-step { background: #fff; border-radius: 1rem; padding: 1.75rem; box-shadow: 0 6px 24px rgba(53,53,53,.08); }
.smm-step-num { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(45deg, #82c341, #09ce91); color: #fff; font-family: Unbounded, sans-serif; font-weight: 600; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
.smm-step h3 { font-family: Poppins, sans-serif; font-size: 1.05rem; font-weight: 700; color: #353535; margin: 0 0 .5rem; }
.smm-step p { color: #474747; font-size: .95rem; line-height: 1.65; margin: 0; }
.smm-prose { max-width: 820px; }
.smm-prose p { color: #474747; line-height: 1.75; margin: 0 0 1rem; }
.smm-faq { max-width: 820px; }
.smm-faq details { background: #fff; border-radius: 1rem; box-shadow: 0 4px 16px rgba(53,53,53,.07); margin-bottom: 1rem; padding: 1.25rem 1.5rem; }
.smm-faq summary { font-family: Poppins, sans-serif; font-weight: 600; color: #353535; cursor: pointer; list-style: none; position: relative; padding-right: 2rem; }
.smm-faq summary::after { content: '+'; position: absolute; right: 0; top: 0; color: #82c341; font-size: 1.4rem; font-weight: 700; line-height: 1; }
.smm-faq details[open] summary::after { content: '\\2212'; }
.smm-faq p { color: #474747; line-height: 1.75; margin: 1rem 0 0; }
.smm-cta { background-image: linear-gradient(45deg, #000 43%, #364b54); border-radius: 2rem; text-align: center; padding: 4rem 2rem; }
.smm-cta .smm-h2 { color: #fff; }
.smm-cta .smm-cta-yellow { color: #fdc934; display: block; }
.smm-cta p { color: #efefea; max-width: 560px; margin: 1rem auto 2rem; line-height: 1.7; }
@media (max-width: 767px) {
  .smm-hero-inner { padding: 3rem 0 2.5rem; }
  .smm-h2 { font-size: 1.5rem; }
}
`;

export default function SocialMediaMarketingPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Social Media Marketing Services',
    serviceType: 'Social media marketing',
    provider: { '@type': 'Organization', name: 'Marketing Mojito', url: 'https://marketingmojito.com' },
    areaServed: 'India',
    description:
      'Full-service social media marketing: strategy, content creation, reels and short-form video, community management, influencer collaborations, and paid social campaigns.',
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
      <section className="smm-hero">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="smm-hero-inner">
              <span className="smm-eyebrow">Social Media Marketing</span>
              <h1 className="inner-banner-heading">Social Media Marketing Agency in India</h1>
              <p className="smm-hero-sub">
                Strategy, content, reels, community, and paid social — one in-house team turning
                attention into followers, and followers into customers, across Instagram, YouTube,
                LinkedIn, and Facebook.
              </p>
              <div className="smm-btn-row">
                <a href={CAL_URL} className="solid-button-wrapper hero-banner-btn w-button">
                  Book a Free 15-min Strategy Call
                </a>
                <a href="/contact-us" className="smm-btn-ghost">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="smm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="smm-h2">Our Social Media Marketing Services</h2>
            <p className="smm-sub">Everything a brand needs to grow on social, under one roof.</p>
            <div className="smm-grid">
              {services.map((s) => (
                <a key={s.title} href={s.href} className="smm-card" style={{ ['--smm-accent' as never]: s.accent }}>
                  <div className="smm-card-icon">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt="" loading="lazy" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="smm-card-link">Explore →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why social */}
      <section className="smm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="smm-h2">Why Brands Hire a Social Media Marketing Company</h2>
            <div className="smm-prose">
              <p>
                Social is where your customers form opinions about you before they ever visit your
                website. Done consistently, it compounds: content builds audience, audience builds
                trust, and trust lowers the cost of every sale. Done sporadically, it quietly signals
                that the lights are off.
              </p>
              <p>
                The hard part is not posting — it is sustaining quality at the pace platforms reward.
                That takes strategy, a production engine, and someone accountable for results. That is
                the job we take off your plate: we plan it, produce it, post it, and report on what it
                earned — while our <a href="/paid-advertising">paid media</a> and{' '}
                <a href="/growth-marketing-seo-content-services">SEO teams</a> make sure social,
                search, and ads work as one system instead of three silos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="smm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="smm-h2">How It Works</h2>
            <p className="smm-sub">A clear system from audit to compounding growth.</p>
            <div className="smm-grid">
              {steps.map(([title, desc], i) => (
                <div key={title} className="smm-step">
                  <div className="smm-step-num">{i + 1}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="smm-section">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <h2 className="smm-h2">Frequently Asked Questions</h2>
            <div className="smm-faq">
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
      <section className="smm-section" style={{ paddingBottom: '4rem' }}>
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="smm-cta">
              <h2 className="smm-h2">
                Your audience is already scrolling.
                <span className="smm-cta-yellow">Give them a reason to stop.</span>
              </h2>
              <p>
                Book a free 15-minute strategy call. We&apos;ll audit your social presence and show
                you the fastest wins — no commitment.
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

import type { Metadata } from 'next';
import CityLandingPage, { type CityConfig } from '@/components/CityLandingPage';

const URL = 'https://marketingmojito.com/digital-marketing-agency-mumbai';

export const metadata: Metadata = {
  title: { absolute: 'Digital Marketing Agency in Mumbai | Marketing Mojito' },
  description: "Full-service digital marketing agency serving Mumbai: SEO, PPC, social media, branding, video & web development. Senior team, one strategy, measurable leads. Free strategy call.",
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Digital Marketing Agency in Mumbai | Marketing Mojito',
    description: "Full-service digital marketing agency serving Mumbai: SEO, PPC, social media, branding, video & web development. Senior team, one strategy, measurable leads. Free strategy call.",
    images: [{ url: 'https://marketingmojito.com/images/MM-1.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Agency in Mumbai | Marketing Mojito',
    description: "Full-service digital marketing agency serving Mumbai: SEO, PPC, social media, branding, video & web development. Senior team, one strategy, measurable leads. Free strategy call.",
  },
};

const config: CityConfig = {
  "slug": "digital-marketing-agency-mumbai",
  "city": "Mumbai",
  "heroSub": "Mumbai is the most competitive marketing market in India — finance, film, D2C, real estate, and every national brand's HQ fighting for the same attention. We help Mumbai businesses cut through with strategy-led SEO, paid media, content, and design under one roof.",
  "whyParas": [
    "Mumbai buyers are bombarded: out-of-home on every flyover, ads in every feed, and a startup pitching them weekly. Winning here is not about spending more — it is about sharper positioning, creative that stops the scroll, and showing up for the exact searches your buyers make, from <em>“D2C growth agency”</em> to neighbourhood-level intent in Andheri, Bandra, or Lower Parel.",
    "We run integrated programmes for Mumbai businesses: <a href=\"/growth-marketing-seo-content-services\">SEO</a> that captures demand, <a href=\"/paid-advertising\">paid campaigns</a> that scale it, and <a href=\"/photography-videography\">production</a> that keeps creative fresh without agency-hopping. One team, one strategy, one monthly scorecard."
  ],
  "industries": [
    {
      "name": "Real Estate",
      "desc": "Project launches, lead-gen funnels, and walkthrough films for Mumbai's most crowded property market.",
      "href": "/real-estate-digital-marketing"
    },
    {
      "name": "Entertainment & Celebrity",
      "desc": "Artist branding, release campaigns, and fan growth — in the home of the Indian entertainment industry.",
      "href": "/entertainment-digital-marketing"
    },
    {
      "name": "E-commerce & D2C",
      "desc": "Store builds, performance marketing, and content engines for Mumbai's D2C brands.",
      "href": "/e-commerce-digital-marketing"
    },
    {
      "name": "Healthcare",
      "desc": "Patient-first marketing for clinics, hospitals, and health brands across the city.",
      "href": "/healthcare-marketing"
    }
  ],
  "faqs": [
    {
      "q": "Do you work with businesses located in Mumbai?",
      "a": "Yes — Mumbai is one of our core markets. We work with real estate developers, entertainment brands, D2C companies, and clinics across the city, and shoot on location in Mumbai for photography and video projects."
    },
    {
      "q": "How much does digital marketing cost in Mumbai?",
      "a": "Mumbai is a competitive market, so meaningful programmes typically start around ₹40,000–₹50,000 per month for a focused single-channel engagement, and ₹1,00,000+ for integrated multi-channel retainers. We scope after a free audit so you pay for what your growth actually needs."
    },
    {
      "q": "Can you compete with big Mumbai agencies?",
      "a": "We win on senior attention and speed. Your account is run by the people who pitched it — not handed to a junior team — and creative, media, and strategy sit in one room, so changes ship in days, not quarterly reviews."
    },
    {
      "q": "Do you offer local SEO for Mumbai searches?",
      "a": "Yes. We optimise for city and locality-level intent — from Google Business Profile optimisation to landing pages for the areas you serve — so you appear when Mumbai buyers search for what you sell."
    }
  ]
};

export default function Page() {
  return <CityLandingPage config={config} />;
}

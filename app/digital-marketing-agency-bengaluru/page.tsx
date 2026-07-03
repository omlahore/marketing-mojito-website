import type { Metadata } from 'next';
import CityLandingPage, { type CityConfig } from '@/components/CityLandingPage';

const URL = 'https://marketingmojito.com/digital-marketing-agency-bengaluru';

export const metadata: Metadata = {
  title: { absolute: 'Digital Marketing Agency in Bengaluru | Marketing Mojito' },
  description: "Digital marketing agency for Bengaluru startups, SaaS & brands: SEO, performance marketing, CRO, content & paid acquisition measured in CAC and pipeline. Free strategy call.",
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Digital Marketing Agency in Bengaluru | Marketing Mojito',
    description: "Digital marketing agency for Bengaluru startups, SaaS & brands: SEO, performance marketing, CRO, content & paid acquisition measured in CAC and pipeline. Free strategy call.",
    images: [{ url: 'https://marketingmojito.com/images/MM-1.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Agency in Bengaluru | Marketing Mojito',
    description: "Digital marketing agency for Bengaluru startups, SaaS & brands: SEO, performance marketing, CRO, content & paid acquisition measured in CAC and pipeline. Free strategy call.",
  },
};

const config: CityConfig = {
  "slug": "digital-marketing-agency-bengaluru",
  "city": "Bengaluru",
  "heroSub": "Bengaluru builds India's startups, SaaS, and tech brands — and they all need growth. We help Bengaluru companies acquire users and customers with SEO, performance marketing, and content engineered for metrics-driven teams.",
  "whyParas": [
    "Bengaluru clients speak in CAC, LTV, and payback periods — and so do we. Our <a href=\"/performance-analytics-cro-services\">performance and CRO practice</a> instruments your funnel end to end, our <a href=\"/growth-marketing-seo-content-services\">SEO programmes</a> build the organic engine that lowers blended acquisition costs, and our <a href=\"/paid-advertising\">paid media team</a> scales what the numbers prove.",
    "For SaaS and startups we run growth like an in-house team: experiment roadmaps, weekly sprints, and reporting your investors can read. For Bengaluru's consumer brands — from F&B to real estate — we bring the same rigour to local visibility and lead generation."
  ],
  "industries": [
    {
      "name": "SaaS & Tech",
      "desc": "Product-led SEO, content, and paid acquisition for Bengaluru's software companies.",
      "href": "/saas-digital-marketing"
    },
    {
      "name": "Startups & D2C",
      "desc": "Full-stack growth for funded startups and D2C brands — from brand to performance.",
      "href": "/e-commerce-digital-marketing"
    },
    {
      "name": "Real Estate",
      "desc": "Lead-gen funnels for Bengaluru's fast-moving residential and commercial market.",
      "href": "/real-estate-digital-marketing"
    },
    {
      "name": "Healthcare",
      "desc": "Growth marketing for clinics, hospitals, and healthtech across the city.",
      "href": "/healthcare-marketing"
    }
  ],
  "faqs": [
    {
      "q": "Do you work with SaaS and startup companies in Bengaluru?",
      "a": "Yes — SaaS and startups are one of our strongest segments. We run product-led SEO, content programmes, and paid acquisition with tracking wired into your analytics stack, and report in the metrics your board expects: CAC, pipeline, and payback."
    },
    {
      "q": "How is your pricing structured for startups?",
      "a": "Retainers scale with scope: focused engagements from around ₹40,000 per month, integrated growth programmes from ₹1,00,000. For early-stage companies we often start with a 90-day sprint on the single highest-leverage channel before broadening."
    },
    {
      "q": "Can you work alongside our in-house growth team?",
      "a": "Yes — that is a common model in Bengaluru. We slot in as specialists (SEO, paid, content, or CRO) inside your existing stack and rituals: your sprint board, your analytics, your Slack."
    },
    {
      "q": "Do you understand technical products?",
      "a": "We do — we build websites and run automation projects ourselves, and our content team is comfortable turning technical capability into copy that both engineers and buyers respect."
    }
  ]
};

export default function Page() {
  return <CityLandingPage config={config} />;
}

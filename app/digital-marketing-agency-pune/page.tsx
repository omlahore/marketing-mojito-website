import type { Metadata } from 'next';
import CityLandingPage, { type CityConfig } from '@/components/CityLandingPage';

const URL = 'https://marketingmojito.com/digital-marketing-agency-pune';

export const metadata: Metadata = {
  title: { absolute: 'Digital Marketing Agency in Pune | Marketing Mojito' },
  description: "Digital marketing agency serving Pune: SEO, Google Ads, social media, real estate & education marketing \u2014 senior strategy at Pune-friendly budgets. Free strategy call.",
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Digital Marketing Agency in Pune | Marketing Mojito',
    description: "Digital marketing agency serving Pune: SEO, Google Ads, social media, real estate & education marketing \u2014 senior strategy at Pune-friendly budgets. Free strategy call.",
    images: [{ url: 'https://marketingmojito.com/images/MM-1.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Agency in Pune | Marketing Mojito',
    description: "Digital marketing agency serving Pune: SEO, Google Ads, social media, real estate & education marketing \u2014 senior strategy at Pune-friendly budgets. Free strategy call.",
  },
};

const config: CityConfig = {
  "slug": "digital-marketing-agency-pune",
  "city": "Pune",
  "heroSub": "Pune's mix of manufacturing, IT, education, and a booming property market makes it one of India's best-value growth markets. We help Pune businesses win it with search-led marketing, paid campaigns, and content that converts.",
  "whyParas": [
    "Pune buyers — students, IT professionals, home-buyers, and factory owners alike — start on Google. The businesses that win are the ones visible for high-intent searches and credible when checked on social. We build that presence: <a href=\"/growth-marketing-seo-content-services\">SEO</a> for lasting visibility, <a href=\"/paid-advertising\">paid campaigns</a> for immediate leads, and <a href=\"/social-media-marketing\">social content</a> that holds up to scrutiny.",
    "Compared to Mumbai-priced agencies, Pune businesses get more from us per rupee: senior strategy, in-house production, and programmes sized for mid-market budgets — without the metro-agency overhead baked into the fee."
  ],
  "industries": [
    {
      "name": "Real Estate",
      "desc": "Project launches and lead funnels for Pune's fast-growing residential corridors.",
      "href": "/real-estate-digital-marketing"
    },
    {
      "name": "Education & Institutes",
      "desc": "Admissions-driven marketing for Pune's colleges, academies, and ed-tech.",
      "href": "/strategy-management"
    },
    {
      "name": "IT & SaaS",
      "desc": "Growth programmes for Pune's software companies and IT service firms.",
      "href": "/saas-digital-marketing"
    },
    {
      "name": "Hospitality & F&B",
      "desc": "Visibility and bookings for hotels, restaurants, and experience brands.",
      "href": "/hospitality-digital-marketing"
    }
  ],
  "faqs": [
    {
      "q": "Do you work with Pune-based businesses?",
      "a": "Yes. We serve businesses across Pune and PCMC — from Hinjawadi IT companies to real estate developers and hospitality brands — with digital programmes run remotely and shoots planned on location."
    },
    {
      "q": "What does digital marketing cost in Pune?",
      "a": "Pune programmes typically start around ₹30,000–₹40,000 per month for a focused channel and ₹75,000+ for integrated retainers — generally better value than equivalent Mumbai engagements, with the same senior team."
    },
    {
      "q": "Can you help a local Pune business appear in Google's map results?",
      "a": "Yes — local SEO is core to what we do: Google Business Profile optimisation, reviews strategy, locality landing pages, and NAP consistency so you surface for “near me” and locality searches across Pune."
    },
    {
      "q": "We already run ads but leads are expensive. Can you fix that?",
      "a": "Usually, yes. Expensive leads almost always trace to broad targeting, weak landing pages, or missing negative keywords. We audit the account free, fix the leaks, and then scale what works — most accounts see cost-per-lead drop within the first month or two."
    }
  ]
};

export default function Page() {
  return <CityLandingPage config={config} />;
}

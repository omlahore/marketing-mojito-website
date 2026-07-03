import type { Metadata } from 'next';
import CityLandingPage, { type CityConfig } from '@/components/CityLandingPage';

const URL = 'https://marketingmojito.com/digital-marketing-agency-delhi';

export const metadata: Metadata = {
  title: { absolute: 'Digital Marketing Agency in Delhi | Marketing Mojito' },
  description: "Digital marketing agency serving Delhi NCR: SEO, PPC, B2B lead generation, social media & web development for businesses in Delhi, Gurugram & Noida. Free strategy call.",
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Digital Marketing Agency in Delhi | Marketing Mojito',
    description: "Digital marketing agency serving Delhi NCR: SEO, PPC, B2B lead generation, social media & web development for businesses in Delhi, Gurugram & Noida. Free strategy call.",
    images: [{ url: 'https://marketingmojito.com/images/MM-1.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Agency in Delhi | Marketing Mojito',
    description: "Digital marketing agency serving Delhi NCR: SEO, PPC, B2B lead generation, social media & web development for businesses in Delhi, Gurugram & Noida. Free strategy call.",
  },
};

const config: CityConfig = {
  "slug": "digital-marketing-agency-delhi",
  "city": "Delhi",
  "heroSub": "Delhi NCR is India's biggest B2B and consumer market rolled into one — government, enterprise, exporters, and a massive retail economy. We help Delhi businesses turn digital channels into a predictable source of leads and sales.",
  "whyParas": [
    "Delhi NCR buyers research hard before they buy — comparing vendors on search, checking reputations on social, and shortlisting from page one of Google. If you are not visible at that moment, the lead goes to a competitor in Gurugram or Noida who is. Our job is to put you there: <a href=\"/growth-marketing-seo-content-services\">SEO</a> for the searches that matter, <a href=\"/paid-advertising\">PPC</a> for immediate pipeline, and <a href=\"/brand-visual-identity\">branding</a> that makes you the credible choice.",
    "From exporters and manufacturers to hospitals, institutes, and D2C brands, we build programmes around your sales cycle — because a B2B enquiry in Okhla and an impulse D2C purchase need very different funnels."
  ],
  "industries": [
    {
      "name": "B2B & Manufacturing",
      "desc": "Lead generation for exporters, manufacturers, and service firms across Delhi NCR.",
      "href": "/strategy-management"
    },
    {
      "name": "Healthcare",
      "desc": "Ethical, results-driven marketing for Delhi's hospitals, clinics, and wellness brands.",
      "href": "/healthcare-marketing"
    },
    {
      "name": "Real Estate",
      "desc": "Project marketing and lead funnels for NCR developers and brokers.",
      "href": "/real-estate-digital-marketing"
    },
    {
      "name": "E-commerce & D2C",
      "desc": "Full-funnel growth for Delhi's retail and D2C businesses.",
      "href": "/e-commerce-digital-marketing"
    }
  ],
  "faqs": [
    {
      "q": "Do you serve businesses across Delhi NCR — Gurugram and Noida included?",
      "a": "Yes. We work with businesses across the NCR: Delhi, Gurugram, Noida, Faridabad, and Ghaziabad. Digital programmes run remotely with regular video reviews, and shoots are planned on location when needed."
    },
    {
      "q": "What does digital marketing cost in Delhi?",
      "a": "Focused single-channel engagements typically start around ₹35,000–₹50,000 per month; integrated retainers covering SEO, paid, and content typically run ₹1,00,000+. Every proposal is itemised after a free audit."
    },
    {
      "q": "Can you generate B2B leads, not just consumer traffic?",
      "a": "Yes — B2B is a core strength. We combine LinkedIn campaigns, search ads on high-intent commercial keywords, and SEO content that ranks for specification-stage queries, then track every lead through to your CRM."
    },
    {
      "q": "How soon can a Delhi business expect results?",
      "a": "Paid campaigns can produce leads within the first two weeks. SEO for competitive Delhi commercial terms typically takes 3–6 months to move meaningfully — we sequence both so pipeline starts early while organic compounds."
    }
  ]
};

export default function Page() {
  return <CityLandingPage config={config} />;
}

import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import DarkModeToggle from '@/components/DarkModeToggle';
import HomeContent from './HomeContent';
import HomeScripts from './HomeScripts';

const siteUrl = 'https://marketingmojito.com';

/** Mirrors the SEO head of the original public/index.html exactly. */
export const metadata: Metadata = {
  title: { absolute: 'Marketing Mojito | Digital Marketing Agency India' },
  description:
    'Full-service digital marketing agency in India. Websites, branding, SEO, paid ads & growth strategies. Book a FREE 15-min strategy call today.',
  keywords: [
    'digital marketing agency India', 'marketing agency', 'SEO', 'branding',
    'web design', 'growth marketing',
  ],
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/`,
    title: 'Marketing Mojito | Digital Marketing Agency India',
    description:
      'Full-service digital marketing agency in India. Websites, branding, SEO, paid ads & growth strategies.',
    images: [{ url: `${siteUrl}/images/MM-1.png` }],
    siteName: 'Marketing Mojito',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketing Mojito | Digital Marketing Agency India',
    description:
      'Full-service digital marketing agency in India. Websites, branding, SEO, paid ads & growth strategies.',
    images: [`${siteUrl}/images/MM-1.png`],
  },
};

export default function HomePage() {
  return (
    <PageShell className="mm-home">
      <HomeContent />
      <DarkModeToggle />
      <HomeScripts />
    </PageShell>
  );
}

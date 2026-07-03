import type { Metadata } from 'next';

const URL = 'https://marketingmojito.com/free-tools/website-health-score';

export const metadata: Metadata = {
  title: 'Website Health Score Checker',
  description:
    'Score your website in 60 seconds. Answer a quick checklist on speed, mobile, SEO, and conversion basics to get an instant health grade and a prioritized fix list.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Website Health Score Checker | Marketing Mojito',
    description: 'Get an instant website health grade and a prioritized fix list.',
    url: URL,
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

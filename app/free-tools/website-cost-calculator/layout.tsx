import type { Metadata } from 'next';

const URL = 'https://marketingmojito.com/free-tools/website-cost-calculator';

export const metadata: Metadata = {
  title: 'Website Cost Calculator',
  description:
    'Estimate what a new website or e-commerce store costs in India. Choose your site type, pages, and features for an instant price range — free, no signup to start.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Website Cost Calculator | Marketing Mojito',
    description: 'Instant website price estimate by type, pages, and features.',
    url: URL,
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

const URL = 'https://marketingmojito.com/free-tools/video-production-cost-estimator';

export const metadata: Metadata = {
  title: 'Video Production Cost Estimator',
  description:
    'Estimate what your video will cost in India. Choose video type, length, crew, and post-production for an instant price range — free, no signup to start.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Video Production Cost Estimator | Marketing Mojito',
    description: 'Instant video production price estimate by type, length, and crew.',
    url: URL,
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

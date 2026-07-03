import type { Metadata } from 'next';

const URL = 'https://marketingmojito.com/free-tools/maintenance-vs-rebuild';

export const metadata: Metadata = {
  title: 'Patch or Rebuild? Website Decision Calculator',
  description:
    'Should you keep patching your old website or rebuild it? Answer a few questions about age, platform, and pain points to get a clear verdict and a rough cost gut-check.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Patch or Rebuild? Website Decision Calculator | Marketing Mojito',
    description: 'Get a clear verdict: maintain your current site or rebuild.',
    url: URL,
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

const URL = 'https://marketingmojito.com/free-tools/font-pairing-tool';

export const metadata: Metadata = {
  title: 'Font Pairing Tool',
  description:
    'Find the perfect font pairing for your brand. Pick a heading font and preview expert-matched body fonts live, then copy the Google Fonts embed code. Free.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Font Pairing Tool | Marketing Mojito',
    description: 'Pick a heading font, preview matched body fonts, copy the embed code.',
    url: URL,
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

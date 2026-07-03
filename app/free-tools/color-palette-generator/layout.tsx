import type { Metadata } from 'next';

const URL = 'https://marketingmojito.com/free-tools/color-palette-generator';

export const metadata: Metadata = {
  title: 'Brand Color Palette Generator',
  description:
    'Generate a harmonious brand color palette from any base color. Choose a harmony style, preview swatches with hex codes, and copy them instantly. Free, no signup to start.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Brand Color Palette Generator | Marketing Mojito',
    description: 'Generate a harmonious brand palette with hex codes in seconds.',
    url: URL,
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

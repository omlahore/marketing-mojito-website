import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Signature Generator',
  description:
    'Build a professional HTML email signature with live preview. Customize details, images, layout, and colors — then copy and paste into Gmail, Outlook, and more.',
  alternates: { canonical: 'https://marketingmojito.com/free-tools/email-signature-generator' },
  openGraph: {
    title: 'Email Signature Generator | Marketing Mojito',
    description: 'Create a professional HTML email signature in minutes.',
    url: 'https://marketingmojito.com/free-tools/email-signature-generator',
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function EmailSignatureGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

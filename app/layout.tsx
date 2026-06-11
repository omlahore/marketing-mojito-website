import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = 'https://marketingmojito.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Marketing Mojito - Digital Marketing Agency | Design. Think. Solve. Develop.',
    template: '%s | Marketing Mojito',
  },
  description:
    'Full-service digital marketing agency. Websites, branding, SEO, paid ads, content, and growth strategies. Book a FREE 15-min strategy call.',
  keywords: ['digital marketing', 'marketing agency', 'SEO', 'branding', 'web design', 'growth marketing'],
  authors: [{ name: 'Marketing Mojito', url: siteUrl }],
  creator: 'Marketing Mojito',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Marketing Mojito',
    title: 'Marketing Mojito - Digital Marketing Agency',
    description: 'Full-service digital marketing agency. Websites, branding, SEO, paid ads, content, and growth strategies.',
    images: [{ url: '/images/MM-1.png', width: 1200, height: 630, alt: 'Marketing Mojito' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketing Mojito - Digital Marketing Agency',
    description: 'Full-service digital marketing agency. Websites, branding, SEO, paid ads, content.',
  },
  robots: { index: true, follow: true },
  // NOTE: no site-wide `alternates.canonical` here — it would be inherited by
  // every page that doesn't override it, telling Google those pages are
  // duplicates of the homepage. Each page must declare its own canonical.
  icons: {
    shortcut: '/images/favicon.svg',
    apple: '/images/webclip.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-wf-page="684a78bb344929502a0da7ec" data-wf-site="6821a11a1adb296fa1dad4b9">
      <body>
        {children}
        {/* Google Analytics — same property as the static Webflow pages */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-78YMGG1L5M" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-78YMGG1L5M');`}
        </Script>
      </body>
    </html>
  );
}

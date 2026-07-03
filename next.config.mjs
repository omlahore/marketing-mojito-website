/** @type {import('next').NextConfig} */

const htmlPages = [
  'about-us', 'career', 'contact-us', 'partner-with-us', 'websites-ecommerce',
  'ai-powered-automation', 'brand-visual-identity', 'motion-animation',
  'photography-videography', 'paid-advertising', 'growth-marketing-seo-content-services',
  'performance-analytics-cro-services', 'strategy-management', 'personal-branding',
  'viral-content-shorts-page', 'e-commerce-digital-marketing', 'healthcare-marketing',
  'real-estate-digital-marketing', 'saas-digital-marketing', 'hospitality-digital-marketing',
  'entertainment-digital-marketing', 'privacy-policy',
  'terms-of-service', 'mojito-labs', 'portfolio',
];

// Next.js runs redirects before rewrites and before matching files in /public.
// /free-templates and /free-tools are App Router only — not in htmlPages (no rewrites to *.html).
const redirects = [
  { source: '/index.html', destination: '/', permanent: true },
  // Stale WordPress-era URLs still in Google's index
  { source: '/about', destination: '/about-us', permanent: true },
  { source: '/new-home-page', destination: '/', permanent: true },
  { source: '/project', destination: '/portfolio', permanent: true },
  { source: '/free-tools-and-template', destination: '/free-templates', statusCode: 301 },
  { source: '/free-tools-and-template.html', destination: '/free-templates', statusCode: 301 },
  ...htmlPages.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
];

const rewrites = [
  // '/' is now served by app/page.tsx (React homepage) — no rewrite needed.
  ...htmlPages.map((p) => ({ source: `/${p}`, destination: `/${p}.html` })),
];

const nextConfig = {
  output: 'standalone',
  // Heavy server-only deps: bundling googleapis in dev/webpack can churn thousands of modules
  // and trigger broken server chunk graphs (e.g. missing ./948.js) after API route compiles.
  experimental: {
    serverComponentsExternalPackages: ['googleapis', 'google-auth-library'],
  },
  async redirects() {
    return redirects;
  },
  async rewrites() {
    return rewrites;
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/css/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/js/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      ...htmlPages.map((p) => ({
        source: `/${p}`,
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      })),
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;

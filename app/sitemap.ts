import { MetadataRoute } from 'next';
import { getPostSlugs } from '@/lib/blog';

const BASE = 'https://marketingmojito.com';

const staticPages = [
  '',
  '/about-us',
  '/career',
  '/contact-us',
  '/portfolio',
  '/partner-with-us',
  '/websites-ecommerce',
  '/ai-powered-automation',
  '/brand-visual-identity',
  '/motion-animation',
  '/photography-videography',
  '/paid-advertising',
  '/growth-marketing-seo-content-services',
  '/performance-analytics-cro-services',
  '/strategy-management',
  '/personal-branding',
  '/viral-content-shorts-page',
  '/e-commerce-digital-marketing',
  '/healthcare-marketing',
  '/real-estate-digital-marketing',
  '/saas-digital-marketing',
  '/hospitality-digital-marketing',
  '/entertainment-digital-marketing',
  '/free-templates',
  '/free-tools',
  '/privacy-policy',
  '/terms-of-service',
  '/mojito-labs',
  '/blog',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/blog' ? 0.9 : 0.8,
  }));

  const blogSlugs = getPostSlugs();
  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...blogUrls];
}

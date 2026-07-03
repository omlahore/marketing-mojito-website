/**
 * Organization JSON-LD — sitewide structured data for Google.
 * Rendered once in the root layout. Helps brand knowledge panel,
 * sitelinks, and entity recognition for "Marketing Mojito".
 */
export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Marketing Mojito',
    url: 'https://marketingmojito.com',
    logo: 'https://marketingmojito.com/images/MM-1.png',
    description:
      'Full-service digital marketing agency in India. Branding, video production, social media, websites & e-commerce development.',
    email: 'hello@marketingmojito.com',
    telephone: '+91-9152605355',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.linkedin.com/company/marketing-mojito/',
      'https://www.instagram.com/marketingmojitoindia/',
      'https://x.com/MarketingMojito',
      'https://www.facebook.com/marketingmojito',
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import { readFileSync } from 'fs';
import path from 'path';
import parse from 'html-react-parser';
import BlogScripts from './BlogScripts';

function fixPaths(html: string): string {
  return html
    .replace(/href="(about-us|career|contact-us|partner-with-us|websites-ecommerce|ai-powered-automation|brand-visual-identity|motion-animation|photography-videography|paid-advertising|growth-marketing-seo-content-services|performance-analytics-cro-services|strategy-management|personal-branding|viral-content-shorts-page|e-commerce-digital-marketing|healthcare-marketing|real-estate-digital-marketing|saas-digital-marketing|hospitality-digital-marketing|entertainment-digital-marketing|free-tools-and-template|privacy-policy|terms-of-service)\.html"/g, (_, p) => `href="/${p}.html"`)
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/src="images\//g, 'src="/images/')
    .replace(/srcset="images\//g, 'srcset="/images/');
}

function getBlogShell() {
  const mojitoPath = path.join(process.cwd(), 'mojito-labs.html');
  const indexPath = path.join(process.cwd(), 'public/index.html');
  const mojito = readFileSync(mojitoPath, 'utf-8');
  const index = readFileSync(indexPath, 'utf-8');

  // Extract header: from page-wrapper to end of header section (Mojito labs)
  const bodyStart = mojito.indexOf('<body');
  const pageWrapperStart = mojito.indexOf('<div class="page-wrapper">', bodyStart);
  const headerSectionEnd = mojito.indexOf('</section>', mojito.indexOf('<section class="header">'));
  const headerHtml = mojito.slice(pageWrapperStart, headerSectionEnd + '</section>'.length);

  // Extract mobile dock from mojito-labs (mobile-menu-wrap div)
  const mobileStart = mojito.indexOf('<div class="mobile-menu-wrap">');
  const scriptTag = mojito.indexOf('<script src="https://d3e54v103j8qbb.cloudfront.net');
  // Find the closing of mobile-menu-wrap - it's nested, trace back from script tag
  const beforeScript = mojito.lastIndexOf('</div>', scriptTag);
  const mobileHtml = mojito.slice(mobileStart, scriptTag).trim();

  // Extract footer from index.html (from <div class="footer"> to just before <div class="mobile-menu-wrap">)
  const footerStart = index.indexOf('<div class="footer">');
  const mobileStartIndex = index.indexOf('<div class="mobile-menu-wrap">', footerStart);
  const footerHtml = index.slice(footerStart, mobileStartIndex);

  // Remove logo fade-in animation on blog (strip data-w-id from header logo)
  const blogHeaderHtml = headerHtml.replace(
    /<img data-w-id="6629658d-09dd-f644-51bd-5ebe7e4e5347" loading="lazy" alt="Logo"/,
    '<img loading="lazy" alt="Logo"'
  );

  return {
    header: fixPaths(blogHeaderHtml),
    footer: fixPaths(footerHtml),
    mobile: fixPaths(mobileHtml),
  };
}

const shell = getBlogShell();

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="body" style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/normalize.css" rel="stylesheet" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/webflow.css" rel="stylesheet" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/marketing-mojitotesting.webflow.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Unbounded:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      {parse(shell.header)}
      <main className="blog-main-content">{children}</main>
      {parse(shell.footer)}
      {parse(shell.mobile)}
      <BlogScripts />
    </div>
  );
}

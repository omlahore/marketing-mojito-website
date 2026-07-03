/**
 * WebflowStyles — loads the Webflow CSS, fonts, and global embed styles
 * that all pages (both static HTML rewrites and React pages) need.
 *
 * Use in any layout that renders Header/Footer React components.
 * The static HTML pages in public/ already have these in their <head>,
 * so this is only needed for React-rendered pages.
 */
export default function WebflowStyles() {
  return (
    <>
      {/* Webflow CSS */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/normalize.css" rel="stylesheet" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/webflow.css" rel="stylesheet" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/marketing-mojitotesting.webflow.css" rel="stylesheet" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/mobile-dock.css" rel="stylesheet" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/mobile-fixes.css" rel="stylesheet" />

      {/* Fonts */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Unbounded:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* FontAwesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Webflow embed styles — responsive font sizing + utility classes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* Webflow focus styles */
.w-input:focus, .w-select:focus {
    border-color: #82c341;
    outline: 0;
}

/* Responsive font sizing */
@media only screen and (max-width: 1440px) {
  html { font-size: 1.1111111111vw; }
}
@media only screen and (max-width: 991px) {
  html { font-size: 1.614530777vw; }
}
@media only screen and (max-width: 767px) {
  html { font-size: 2.08604954368vw; }
}
@media only screen and (max-width: 479px) {
  html { font-size: 4.2666666667vw; }
  .w-nav[data-collapse='medium'] .w-nav-button { display: none; }
}

/* Webflow utility classes */
body * { color: inherit; }
a, .w-input, .w-select, .w-tab-link, .w-nav-link,
.w-slider-arrow-left, .w-slider-arrow-right,
.w-dropdown-btn, .w-dropdown-toggle, .w-dropdown-link {
  color: inherit; text-decoration: inherit; font-size: inherit;
}
*[tabindex]:focus-visible, input[type="file"]:focus-visible {
  outline: 0.125rem solid #4d65ff;
  outline-offset: 0.125rem;
}
.w-richtext > :not(div):first-child, .w-richtext > div:first-child > :first-child {
  margin-top: 0 !important;
}
.w-richtext > :last-child, .w-richtext ol li:last-child, .w-richtext ul li:last-child {
  margin-bottom: 0 !important;
}
.pointer-events-off { pointer-events: none; }
.pointer-events-on { pointer-events: auto; }
.container-medium, .container-small, .container-large {
  margin-right: auto !important;
  margin-left: auto !important;
}
.hide { display: none !important; }
@media screen and (max-width: 991px) {
  .hide, .hide-tablet { display: none !important; }
}
@media screen and (max-width: 767px) {
  .hide-mobile-landscape { display: none !important; }
}
@media screen and (max-width: 479px) {
  .hide-mobile { display: none !important; }
}

/* React pages: Webflow w-nav collapse may not init — hide full desktop navbar; MobileDock only */
@media screen and (max-width: 991px) {
  .navbar-no-shadow-container {
    display: none !important;
  }
}
`,
        }}
      />
    </>
  );
}

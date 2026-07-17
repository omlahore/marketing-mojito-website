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
      <link href="/css/mobile-fixes.css?v=20260717" rel="stylesheet" />
      {/* Design tokens — single source of truth for type/buttons/layout. Loads last. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/css/mm-tokens.css?v=20260717k" rel="stylesheet" />

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

/* Root font size is fixed by mm-tokens.css (the vw hack is retired). */
@media only screen and (max-width: 479px) {
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

/* Type system lives in mm-tokens.css — no font sizes here. */

/* ============================================================
   CENTER ALIGNMENT — Who We Are & Our Solutions
   ============================================================ */
@media (max-width: 991px) {
  /* Stack + center the whole Who We Are / Our Solutions blocks */
  .section-who-we-are .hero_header-wrapper,
  .section_gallery-text .hero_header-wrapper {
    flex-direction: column !important; align-items: center !important; text-align: center !important;
  }
  /* The heading/copy wrappers shrink-wrap and sit off to one side — force full width */
  .section-who-we-are .hero_header-text,
  .section-who-we-are .hero_header-left,
  .section-who-we-are .hero_header-right,
  .section-who-we-are .hero_header-para,
  .section_gallery-text .hero_header-text,
  .section_gallery-text .hero_header-left,
  .section_gallery-text .hero_header-right,
  .section_gallery-text .hero_header-para {
    width: 100% !important; max-width: 100% !important; text-align: center !important;
  }
  .section-who-we-are .heading-style-h2,
  .section-who-we-are .who-para,
  .section_gallery-text .heading-style-h2,
  .section_gallery-text .who-para,
  .section_gallery-text .heading-12 { width: 100% !important; display: block !important; text-align: center !important; }

  /* Our Solutions uses a different, right-aligned flex wrapper — neutralize it */
  .section_gallery-text .gallery_text-wrapper,
  .section_gallery-text .gallery_text-wrapper.right-align,
  .section_gallery-text .galler-wrapper {
    flex-direction: column !important; justify-content: center !important; align-items: center !important; text-align: center !important;
  }
  .section_gallery-text .hero_header-left-2,
  .section_gallery-text .hero_header-right-2,
  .section_gallery-text .hero_header-right--2 {
    width: 100% !important; max-width: 100% !important; text-align: center !important;
  }
  /* This subtitle carries its own text-align:right — force it centered */
  .section_gallery-text .our-sol-para { text-align: center !important; }

  /* Center both section images (books, lightbulb-in-hand) — override .left-align / .right-align */
  .section-who-we-are .header-image,
  .section-who-we-are .header-image.left-align,
  .section_gallery-text .header-image,
  .section_gallery-text .header-image.right-align {
    margin-left: auto !important; margin-right: auto !important; display: block !important; float: none !important;
  }

  /* Center every CTA button in these sections (About Us, Book A Free Call, Checkout Our Work) */
  .section-who-we-are .hero_header-list,
  .section_gallery-text .hero_header-list {
    display: flex !important; justify-content: center !important; align-items: center !important;
  }
  .seo-intro-cta { text-align: center !important; }

  /* Solutions cards: icon on top, title centered, and the accordion arrow pinned to a
     single consistent right-hand column (was scattering by title length). */
  .section_gallery-text .new-box,
  .section_gallery-text .content-box-wrapper,
  .section_gallery-text .content-box { text-align: center !important; align-items: center !important; }
  .section_gallery-text .web-box-icons { margin-left: auto !important; margin-right: auto !important; display: block !important; }
  .section_gallery-text .box-title-wrapper {
    position: relative !important; justify-content: center !important;
    padding-left: 40px !important; padding-right: 40px !important;
  }
  .section_gallery-text .arrow-icon {
    position: absolute !important; right: 12px !important; top: 50% !important;
    transform: translateY(-50%) !important; margin: 0 !important;
  }
  .section_gallery-text .add-left-space { padding-left: 0 !important; margin-left: 0 !important; }

  /* Self-audit CTA button was oversized — bring it in line with the type scale */
  .custom-form-wrapper button,
  .custom-form-wrapper form button,
  .custom-form-wrapper input[type="submit"] { font-size: 16px !important; line-height: 1.2 !important; }
}
`,
        }}
      />
    </>
  );
}

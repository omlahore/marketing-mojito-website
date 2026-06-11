'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ─── Data ─── */

interface NavCard {
  href: string;
  img: string;
  imgSrcSet?: string;
  title: string;
  className?: string;
  none?: boolean;
}

interface SubService {
  label: string;
}

interface SolutionTab {
  id: string;
  label: string;
  tagline: string;
  cards: NavCard[];
  subServices?: SubService[][];
}

interface FeaturedArticle {
  img: string;
  imgSrcSet?: string;
  title: string;
  href: string;
}

const FEATURED_ARTICLES: FeaturedArticle[] = [
  {
    img: '/images/42.png',
    imgSrcSet:
      '/images/42-p-500.png 500w, /images/42-p-800.png 800w, /images/42-p-1080.png 1080w, /images/42-p-1600.png 1600w, /images/42.png 1920w',
    title: '8 Most Effective Tips to Build Your Brand on Instagram',
    href: '/blog/8-most-effective-tips-to-build-your-brand-on-instagram/',
  },
  {
    img: '/images/41.png',
    imgSrcSet:
      '/images/41-p-500.png 500w, /images/41-p-800.png 800w, /images/41-p-1080.png 1080w, /images/41-p-1600.png 1600w, /images/41.png 1920w',
    title:
      'How and Why Video Marketing Needs to Become a Part of Your Business Strategy',
    href: '/blog/video-marketing-business-strategy/',
  },
];

const EXPLORE_CARDS: NavCard[] = [
  {
    href: '/about-us',
    img: '/images/About-Us_1.avif',
    imgSrcSet: '/images/About-Us_1About-Us.avif 500w, /images/About-Us_1.avif 1600w',
    title: 'About Us',
    className: '_1',
  },
  {
    href: '/career',
    img: '/images/Careers_1.avif',
    imgSrcSet: '/images/Careers_1Careers.avif 500w, /images/Careers_1.avif 1600w',
    title: 'Careers',
    className: '_2',
  },
];

const SOLUTION_TABS: SolutionTab[] = [
  {
    id: 'Tab 1',
    label: 'Digital transformation',
    tagline: "Website that wow. Tech that talks. Let's future-proof your business.",
    cards: [
      {
        href: '/websites-ecommerce',
        img: '/images/Website--E---Commerce_1.avif',
        imgSrcSet:
          '/images/Website--E---Commerce_1Website--E---Commerce.avif 500w, /images/Website--E---Commerce_1.avif 1600w',
        title: 'Websites & E-Commerce',
        className: '_1',
      },
      {
        href: '/ai-powered-automation',
        img: '/images/AI-Powered-Autiomation_1.avif',
        imgSrcSet:
          '/images/AI-Powered-Autiomation_1AI-Powered-Autiomation.avif 500w, /images/AI-Powered-Autiomation_1.avif 1600w',
        title: 'AI-Powered Automation',
        className: '_2',
      },
    ],
    subServices: [
      ['WordPress', 'Webflow', 'Shopify', 'Custom Web Apps'].map((s) => ({ label: s })),
      ['Chatbots', 'AI Agents', 'Work Flow Automation'].map((s) => ({ label: s })),
    ],
  },
  {
    id: 'Tab 2',
    label: 'Brand & Visual Identity',
    tagline: 'Sophistication in every pixel. Your story, artfully told.',
    cards: [
      {
        href: '/brand-visual-identity',
        img: '/images/Branding_1.avif',
        imgSrcSet: '/images/Branding_1Branding.avif 500w, /images/Branding_1.avif 1600w',
        title: 'Branding',
        className: '_1',
      },
      {
        href: '/motion-animation',
        img: '/images/Motion-and-Animation_1.avif',
        imgSrcSet:
          '/images/Motion-and-Animation_1Motion-and-Animation.avif 500w, /images/Motion-and-Animation_1.avif 1600w',
        title: 'Motion & Animation',
        className: '_2',
      },
      {
        href: '/photography-videography',
        img: '/images/Photography_1.avif',
        imgSrcSet:
          '/images/Photography_1Photography.avif 500w, /images/Photography_1.avif 1600w',
        title: 'Photography & Videography',
        className: '_3',
      },
    ],
    subServices: [
      ['Product', 'Fashion', 'Interior', 'Events'].map((s) => ({ label: s })),
      ['Logo', 'UI/UX', 'Packaging', 'Print'].map((s) => ({ label: s })),
      ['Product', 'Fashion', 'Interior', 'Events'].map((s) => ({ label: s })),
    ],
  },
  {
    id: 'Tab 3',
    label: 'Growth Marketing',
    tagline:
      'Leads, clicks, conversions — Served with a dash of strategy and science.',
    cards: [
      {
        href: '/paid-advertising',
        img: '/images/Paid-Advertising_1.avif',
        imgSrcSet:
          '/images/Paid-Advertising_1Paid-Advertising.avif 500w, /images/Paid-Advertising_1.avif 1600w',
        title: 'Paid Advertising',
        className: '_1',
      },
      {
        href: '/growth-marketing-seo-content-services',
        img: '/images/SEO--Content_1.avif',
        imgSrcSet:
          '/images/SEO--Content_1SEO--Content.avif 500w, /images/SEO--Content_1.avif 1600w',
        title: 'SEO - Content',
        className: '_2',
      },
      {
        href: '/performance-analytics-cro-services',
        img: '/images/Performance-Analytics--CRO_1.avif',
        imgSrcSet:
          '/images/Performance-Analytics--CRO_1Performance-Analytics--CRO.avif 500w, /images/Performance-Analytics--CRO_1.avif 1600w',
        title: 'Performance Analytics & CRO',
        className: '_3',
      },
    ],
    subServices: [
      ['Google', 'META', 'LinkedIN', 'Lead Gen'].map((s) => ({ label: s })),
      ['Technical SEO', 'Blogging', 'Local SEO'].map((s) => ({ label: s })),
      ['A/B Testing', 'Conversion Optimization'].map((s) => ({ label: s })),
    ],
  },
  {
    id: 'Tab 4',
    label: 'Social Media Marketing',
    tagline: "From zero to viral — let's make your brand scroll stopping.",
    cards: [
      {
        href: '/strategy-management',
        img: '/images/Strategy--Management_1.avif',
        imgSrcSet:
          '/images/Strategy--Management_1Strategy--Management.avif 500w, /images/Strategy--Management_1.avif 1600w',
        title: 'Strategy & Management',
        className: '_1',
      },
      {
        href: '/personal-branding',
        img: '/images/Personal-Branding_1.avif',
        imgSrcSet:
          '/images/Personal-Branding_1Personal-Branding.avif 500w, /images/Personal-Branding_1.avif 1600w',
        title: 'Personal Branding',
        className: '_2',
      },
      {
        href: '/viral-content-shorts-page',
        img: '/images/Viral-Content--Shots_1.avif',
        imgSrcSet:
          '/images/Viral-Content--Shots_1Viral-Content--Shots.avif 500w, /images/Viral-Content--Shots_1.avif 1600w',
        title: 'Viral Content & Shots',
        className: '_3',
      },
    ],
    subServices: [
      ['Instagram', 'Linked In', 'Facebook', 'Youtube'].map((s) => ({ label: s })),
      ['Linked In', 'Thought leadership'].map((s) => ({ label: s })),
    ],
  },
  {
    id: 'Tab 5',
    label: 'Industries we serve',
    tagline: "One size doesn't fit all. See how we tailor strategies that click.",
    cards: [],
  },
];

const INDUSTRY_LINKS = [
  { href: '/e-commerce-digital-marketing', label: 'E-Commerce' },
  { href: '/healthcare-marketing', label: 'Healthcare' },
  { href: '/real-estate-digital-marketing', label: 'Real - Estate' },
  { href: '/saas-digital-marketing', label: 'SaaS' },
  { href: '/hospitality-digital-marketing', label: 'Hospitality' },
  { href: '/entertainment-digital-marketing', label: 'Entertainment' },
];

const KNOWLEDGE_CARDS: NavCard[] = [
  {
    href: '/blog',
    img: '/images/Mojito-Lab_1.avif',
    imgSrcSet: '/images/Mojito-Lab_1Mojito-Lab.avif 500w, /images/Mojito-Lab_1.avif 1600w',
    title: 'Blog',
    className: '_1',
  },
  {
    href: '#',
    img: '/images/Marketing-Playbook_1.avif',
    imgSrcSet:
      '/images/Marketing-Playbook_1Marketing-Playbook.avif 500w, /images/Marketing-Playbook_1.avif 1600w',
    title: 'Marketing Playbooks',
    className: '_2',
    none: true,
  },
  {
    href: '/free-templates',
    img: '/images/Free-Templates_1.avif',
    imgSrcSet:
      '/images/Free-Templates_1Free-Templates.avif 500w, /images/Free-Templates_1.avif 1600w',
    title: 'Free Templates',
    className: '_3',
  },
  {
    href: '/free-tools',
    img: '/images/AI-Powered-Autiomation_1.avif',
    imgSrcSet:
      '/images/AI-Powered-Autiomation_1AI-Powered-Autiomation.avif 500w, /images/AI-Powered-Autiomation_1.avif 1600w',
    title: 'Free Tools',
    className: '_4',
  },
];

const GET_STARTED_CARDS: NavCard[] = [
  {
    href: '/contact-us',
    img: '/images/Book-a-Free-Strategy-Call_1.avif',
    imgSrcSet:
      '/images/Book-a-Free-Strategy-Call_1Book-a-Free-Strategy-Call.avif 500w, /images/Book-a-Free-Strategy-Call_1.avif 1600w',
    title: 'Contact us',
    className: '_1',
  },
  {
    href: '/partner-with-us',
    img: '/images/Partner-with-us.webp',
    imgSrcSet:
      '/images/Partner-with-us-p-500.webp 500w, /images/Partner-with-us-p-800.webp 800w, /images/Partner-with-us-p-1080.webp 1080w, /images/Partner-with-us.webp 1600w',
    title: 'partner with us',
    className: '_2',
  },
  {
    href: '#',
    img: '/images/Mojito-Match-Maker_1.avif',
    imgSrcSet:
      '/images/Mojito-Match-Maker_1Mojito-Match-Maker.avif 500w, /images/Mojito-Match-Maker_1.avif 1600w',
    title: 'Mojito Match Maker',
    className: '_3',
    none: true,
  },
];

/* ─── Subcomponents ─── */

function FeaturedCards({ articles }: { articles: FeaturedArticle[] }) {
  return (
    <div className="grid-wrap">
      {articles.map((a, i) => (
        <div className="featured-card" key={i}>
          <h4 className="heading-6">Featured from Blog</h4>
          <img
            sizes="100vw"
            srcSet={a.imgSrcSet}
            alt=""
            src={a.img}
            loading="lazy"
            className="image-12"
          />
          <h4 className="article-title">{a.title}</h4>
          <Link href={a.href} className="button caps-btn w-button">
            know more
          </Link>
        </div>
      ))}
    </div>
  );
}

function NavCardLink({ card }: { card: NavCard }) {
  return (
    <Link
      href={card.href}
      className={`tab-btn ${card.className || ''} ${card.none ? 'none' : ''} w-inline-block`}
    >
      <img
        sizes="100vw"
        srcSet={card.imgSrcSet}
        alt=""
        src={card.img}
        loading="lazy"
        className="image-12 side-card-images"
      />
      <div>
        <h3 className="heading-7">{card.title}</h3>
        <div className="text-block-20">Read More</div>
      </div>
    </Link>
  );
}

/* ─── Main Navbar ─── */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Tab 1');
  const [activeExploreCard, setActiveExploreCard] = useState(0);

  return (
    <div
      data-animation="default"
      data-collapse="medium"
      data-duration="400"
      data-easing="ease"
      data-easing2="ease"
      role="banner"
      className="navbar-no-shadow-container w-nav"
    >
      <div className="custome-container logo-container">
        <div className="navbar-wrapper-2">
          {/* Logo */}
          <Link href="/" className="navbar-brand w-nav-brand">
            <img
              loading="lazy"
              alt="Logo"
              src="/images/MM-1.png"
              className="logo"
            />
          </Link>

          {/* Navigation */}
          <nav
            role="navigation"
            className={`nav-menu-wrapper-2 my-wrap w-nav-menu ${mobileOpen ? 'w--open' : ''}`}
          >
            <ul role="list" className="nav-menu mynav w-list-unstyled">
              {/* ── Explore ── */}
              <li>
                <div data-delay="0" data-hover="true" className="nav-dropdown w-dropdown">
                  <div className="nav-dropdown-toggle w-dropdown-toggle">
                    <div className="nav-link-text">Explore</div>
                    <img loading="lazy" src="/images/icon.svg" alt="" className="image-10" />
                  </div>
                  <nav className="nav-dropdown-list shadow-three mobile-shadow-hide w-dropdown-list">
                    <div className="block">
                      <div className="w-row">
                        <div className="column-9 w-col w-col-4 w-col-stack w-col-small-small-stack">
                          <div className="tab_btn-wrapper">
                            {EXPLORE_CARDS.map((card, i) => (
                              <div
                                key={card.href}
                                onMouseEnter={() => setActiveExploreCard(i)}
                              >
                                <NavCardLink card={card} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="column-14 w-col w-col-8 w-col-stack w-col-small-small-stack">
                          <div
                            className={`tab-answer _${activeExploreCard + 1}`}
                            style={{ display: 'block' }}
                          >
                            <FeaturedCards articles={FEATURED_ARTICLES} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </li>

              {/* ── Solutions ── */}
              <li>
                <div data-delay="0" data-hover="true" className="nav-dropdown w-dropdown">
                  <div className="nav-dropdown-toggle w-dropdown-toggle">
                    <div className="nav-link-text">Solutions</div>
                    <img loading="lazy" src="/images/icon.svg" alt="" className="image-10" />
                  </div>
                  <nav className="nav-dropdown-list shadow-three mobile-shadow-hide w-dropdown-list">
                    <div className="block">
                      <div className="columns-5 w-row">
                        <div className="column-9 w-col w-col-9 w-col-stack w-col-small-small-stack">
                          <div className="tabs w-tabs">
                            <div className="tabs-menu w-tab-menu">
                              {SOLUTION_TABS.map((tab) => (
                                <a
                                  key={tab.id}
                                  className={`tab-link w-inline-block w-tab-link ${activeTab === tab.id ? 'w--current' : ''}`}
                                  onClick={() => setActiveTab(tab.id)}
                                  onMouseEnter={() => setActiveTab(tab.id)}
                                >
                                  <div className="sol-inner">
                                    <div className="sol-text">{tab.label}</div>
                                    <img
                                      loading="lazy"
                                      src="/images/caret-right.png"
                                      alt=""
                                      className="image-14"
                                    />
                                  </div>
                                </a>
                              ))}
                            </div>
                            <div className="tabs-content w-tab-content">
                              {SOLUTION_TABS.map((tab) => (
                                <div
                                  key={tab.id}
                                  className={`w-tab-pane ${activeTab === tab.id ? 'w--tab-active' : ''}`}
                                  style={{
                                    display: activeTab === tab.id ? 'block' : 'none',
                                  }}
                                >
                                  <div className="sol-title">{tab.tagline}</div>
                                  {tab.id === 'Tab 5' ? (
                                    /* Industries tab — links only */
                                    <div className="industries-tab-content">
                                      <div className="div-block-13 ind-tab-list-content">
                                        {INDUSTRY_LINKS.slice(0, 4).map((l) => (
                                          <Link
                                            key={l.href}
                                            href={l.href}
                                            className="service-sol-name"
                                          >
                                            {l.label}
                                          </Link>
                                        ))}
                                      </div>
                                      <div className="div-block-13 ind-tab-list-content">
                                        {INDUSTRY_LINKS.slice(4).map((l) => (
                                          <Link
                                            key={l.href}
                                            href={l.href}
                                            className="service-sol-name"
                                          >
                                            {l.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    /* Service cards + sub-services */
                                    <div className="w-row">
                                      <div
                                        className={`column-9 w-col w-col-${tab.cards.length > 2 ? '8' : '7'}`}
                                      >
                                        <div className="tab_btn-wrapper">
                                          {tab.cards.map((card) => (
                                            <NavCardLink key={card.href} card={card} />
                                          ))}
                                        </div>
                                      </div>
                                      <div
                                        className={`column-14 w-col w-col-${tab.cards.length > 2 ? '4' : '5'}`}
                                      >
                                        {tab.subServices?.map((group, gi) => (
                                          <div
                                            key={gi}
                                            className={`tab-answer _${gi + 1}`}
                                          >
                                            <div className="div-block-13">
                                              {group.map((s) => (
                                                <div
                                                  key={s.label}
                                                  className="service-sol-name"
                                                >
                                                  {s.label}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="column-10 w-col w-col-3 w-col-stack w-col-small-small-stack">
                          <div className="featured-card">
                            <h4 className="heading-6">Featured from Blog</h4>
                            <img
                              sizes="100vw"
                              srcSet={FEATURED_ARTICLES[0].imgSrcSet}
                              alt=""
                              src={FEATURED_ARTICLES[0].img}
                              loading="lazy"
                              className="image-12"
                            />
                            <h4 className="article-title">
                              {FEATURED_ARTICLES[0].title}
                            </h4>
                            <Link
                              href={FEATURED_ARTICLES[0].href}
                              className="button caps-btn w-button"
                            >
                              Know more
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </li>

              {/* ── Knowledge Hub ── */}
              <li>
                <div data-delay="0" data-hover="true" className="nav-dropdown w-dropdown">
                  <div className="nav-dropdown-toggle w-dropdown-toggle">
                    <div className="nav-link-text">Knowledge hub</div>
                    <img loading="lazy" src="/images/icon.svg" alt="" className="image-10" />
                  </div>
                  <nav className="nav-dropdown-list shadow-three mobile-shadow-hide w-dropdown-list">
                    <div className="block">
                      <div className="w-row">
                        <div className="column-9 w-col w-col-5 w-col-stack">
                          <div className="tab_btn-wrapper _1">
                            {KNOWLEDGE_CARDS.map((card) => (
                              <NavCardLink key={card.href + card.title} card={card} />
                            ))}
                          </div>
                        </div>
                        <div className="column-14 w-col w-col-7 w-col-stack">
                          <div className="tab-answer _1" style={{ display: 'block' }}>
                            <FeaturedCards articles={FEATURED_ARTICLES} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </li>

              {/* ── Portfolio ── */}
              <li>
                <div data-delay="0" data-hover="false" className="nav-dropdown w-dropdown">
                  <div className="nav-dropdown-toggle w-dropdown-toggle">
                    <Link href="/portfolio" className="nav-link-text">
                      Portfolio
                    </Link>
                    <img
                      loading="lazy"
                      src="/images/icon.svg"
                      alt=""
                      className="image-10 _1"
                    />
                  </div>
                </div>
              </li>

              {/* ── Get Started ── */}
              <li>
                <div data-delay="0" data-hover="true" className="nav-dropdown w-dropdown">
                  <div className="nav-dropdown-toggle w-dropdown-toggle">
                    <div className="nav-link-text">Get Started</div>
                    <img loading="lazy" src="/images/icon.svg" alt="" className="image-10" />
                  </div>
                  <nav className="nav-dropdown-list shadow-three mobile-shadow-hide w-dropdown-list">
                    <div className="block">
                      <div className="w-row">
                        <div className="column-9 w-col w-col-5 w-col-stack">
                          <div className="tab_btn-wrapper _11">
                            {GET_STARTED_CARDS.map((card) => (
                              <NavCardLink key={card.href + card.title} card={card} />
                            ))}
                          </div>
                        </div>
                        <div className="column-14 w-col w-col-7 w-col-stack">
                          <div className="tab-answer _1" style={{ display: 'block' }}>
                            <FeaturedCards articles={FEATURED_ARTICLES} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </li>
            </ul>

            {/* CTA Buttons (visible in mobile menu) */}
            <div className="div-block-88">
              <Link href="/contact-us" className="button new-w-arrow w-button">
                Contact Us
              </Link>
              <a
                href="https://people.marketingmojito.com"
                className="button new-w-arrow w-button"
              >
                Team Login
              </a>
            </div>
          </nav>

          {/* Hamburger */}
          <div
            className="menu-button-2 w-nav-button"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="icon-70 w-icon-nav-menu" />
          </div>
        </div>
      </div>
    </div>
  );
}

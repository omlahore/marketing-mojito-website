'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Data ─── */

interface DockSection {
  id: string;
  label: string;
  children: { href: string; label: string }[];
}

const SOLUTION_SECTIONS: DockSection[] = [
  {
    id: 'dt',
    label: 'Digital Transformation',
    children: [
      { href: '/websites-ecommerce', label: 'Websites & E‑Commerce' },
      { href: '/ai-powered-automation', label: 'AI‑Powered Automation' },
    ],
  },
  {
    id: 'bv',
    label: 'Brand & Visual Identity',
    children: [
      { href: '/brand-visual-identity', label: 'Brand & Visual ID' },
      { href: '/motion-animation', label: 'Motion & Animation' },
      { href: '/photography-videography', label: 'Photography & Videography' },
    ],
  },
  {
    id: 'gm',
    label: 'Growth Marketing',
    children: [
      { href: '/paid-advertising', label: 'Paid Advertising' },
      { href: '/growth-marketing-seo-content-services', label: 'Growth & SEO Content' },
      { href: '/performance-analytics-cro-services', label: 'Analytics & CRO' },
    ],
  },
  {
    id: 'sm',
    label: 'Social Media Marketing',
    children: [
      { href: '/strategy-management', label: 'Strategy & Management' },
      { href: '/personal-branding', label: 'Personal Branding' },
      { href: '/viral-content-shorts-page', label: 'Viral Content & Shorts' },
    ],
  },
  {
    id: 'iw',
    label: 'Industries we serve',
    children: [
      { href: '/e-commerce-digital-marketing', label: 'E-Commerce' },
      { href: '/healthcare-marketing', label: 'Healthcare' },
      { href: '/real-estate-digital-marketing', label: 'Real - Estate' },
      { href: '/saas-digital-marketing', label: 'SaaS' },
      { href: '/hospitality-digital-marketing', label: 'Hospitality' },
      { href: '/entertainment-digital-marketing', label: 'Entertainment' },
      { href: '/celebrity-brand-marketing', label: 'Celebrity & Artists' },
    ],
  },
];

/* ─── Icons ─── */

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
  </svg>
);

/**
 * Same dock rules as static HTML `public/footer.html` w-embed <style> (omit global `body {}`
 * so Webflow body/font styles stay intact). `public/css/mobile-dock.css` is only responsive
 * tweaks and does not define closed-submenu visibility — without this, panels stay visible.
 */
const MOBILE_DOCK_EMBED_CSS = `
  .mobile-dock {
    position: fixed;
    bottom: 16px; left: 50%;
    transform: translateX(-50%);
    display: flex; align-items: center; justify-content: center;
    gap: 1rem;
    padding: .75rem 1.25rem;
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.8);
    border-radius: 40px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  .dock-item {
   position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .dock-item:last-child .dock-submenu {
      left: auto;
      right: 0;
      transform: translateY(10px) scale(.9);
    }
    .dock-item:last-child .dock-submenu.open {
      transform: translateY(0) scale(1);
    }
  .dock-item img, .dock-item svg {
    width: 28px; height: 28px;
    margin-bottom: 4px;
    object-fit: contain;
    pointer-events: none;
  }
  .dock-item a,
  .dock-item button.toggle {
    all: unset;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .dock-item .label {
    font-size: .55rem;
    font-weight: 500;
    color: #333;
    line-height: 1;
    letter-spacing: -0.02em;
    user-select: none;
    text-transform: none;
  }
  .dock-submenu {
    position: absolute;
    bottom: calc(100% + 18px);
    left: 50%;
    transform: translate(-50%,10px) scale(.9);
    transform-origin: bottom center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    width: auto;
    min-width: 160px;
    max-width: 90vw;
    max-height: 60vh;
    overflow-y: auto;
    opacity: 0; visibility: hidden;
    pointer-events: none;
    transition: transform .25s, opacity .25s;
    font-size: .75rem;
    z-index: 1001;
  }
  .dock-submenu.open {
    opacity: 1; visibility: visible;
    pointer-events: auto;
    transform: translate(-50%,0) scale(1);
  }
  .dock-submenu ul {
    list-style: none; margin: 0; padding: .5rem 0;
  }
  .dock-submenu li + li {
    border-top: 1px solid #eee;
  }
  .dock-submenu a {
    display: block;
    padding: .75rem 1.25rem;
    color: #222;
    text-decoration: none;
    font-weight: 500;
    white-space: nowrap;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }
  .dock-submenu a:hover {
    background: rgba(0,0,0,0.05);
  }
  .dock-submenu strong.section-header {
    display: flex; justify-content: space-between;
    align-items: center;
    padding: .75rem 1.25rem;
    cursor: pointer; user-select: none;
    font-weight: 400; color: #333;
    background: #fff;
    white-space: nowrap;
  }
  .dock-submenu strong.section-header::after {
    content: '▸'; transition: transform .3s;
  }
  .dock-submenu strong.section-header.open::after {
    transform: rotate(90deg);
  }
  .dock-submenu .section-content {
    background: #f5f5f7;
    padding: .25rem 0;
    max-height: 0; overflow: hidden;
    transition: max-height .35s;
  }
  .dock-submenu .section-content.open {
    max-height: 300px;
  }
   .dock-submenu .section-content li a {
    padding-left: 1.5rem;
  }
`;

/* ─── Component ─── */

export default function MobileDock() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    setOpenSection(null);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [closeAll]);

  const toggleMenu = (id: string) => {
    setOpenMenu((prev) => (prev === id ? null : id));
    setOpenSection(null);
  };

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mobile-menu-wrap">
      <div className="code-embed-2 w-embed w-script">
        <style dangerouslySetInnerHTML={{ __html: MOBILE_DOCK_EMBED_CSS }} />
        <div className="mobile-dock" ref={dockRef}>
          {/* Connect */}
          <div className="dock-item">
            <button
              className="toggle"
              aria-label="Connect"
              onClick={(e) => { e.stopPropagation(); toggleMenu('connect'); }}
            >
              <PhoneIcon />
            </button>
            <span className="label">Connect</span>
            <div className={`dock-submenu ${openMenu === 'connect' ? 'open' : ''}`}>
              <ul>
                <li>
                  <a
                    href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0TsP5i42tYVxGSKLnyQSPuP2px8mxUmZfraM11FYQ-mk2-kM83oO6bGxBPqLV-IHeG4czTchxd?gv=true"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Schedule Appointment
                  </a>
                </li>
                <li><a href="/contact-us">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Explore */}
          <div className="dock-item">
            <button
              className="toggle"
              aria-label="Explore"
              onClick={(e) => { e.stopPropagation(); toggleMenu('explore'); }}
            >
              <SearchIcon />
            </button>
            <span className="label">Explore</span>
            <div className={`dock-submenu ${openMenu === 'explore' ? 'open' : ''}`}>
              <ul>
                <li><a href="/contact-us">Contact Us</a></li>
                <li><a href="/about-us">About Us</a></li>
                <li><a href="/career">Careers</a></li>
              </ul>
            </div>
          </div>

          {/* Home */}
          <div className="dock-item">
            <a href="/" aria-label="Home">
              <HomeIcon />
            </a>
            <span className="label">Home</span>
          </div>

          {/* Solutions */}
          <div className="dock-item">
            <button
              className="toggle"
              aria-label="Solutions"
              onClick={(e) => { e.stopPropagation(); toggleMenu('solutions'); }}
            >
              <LightbulbIcon />
            </button>
            <span className="label">Solutions</span>
            <div className={`dock-submenu ${openMenu === 'solutions' ? 'open' : ''}`}>
              <ul>
                {SOLUTION_SECTIONS.map((sec) => (
                  <li key={sec.id}>
                    <strong
                      className={`section-header ${openSection === sec.id ? 'open' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleSection(sec.id); }}
                    >
                      {sec.label}
                    </strong>
                    <ul className={`section-content ${openSection === sec.id ? 'open' : ''}`}>
                      {sec.children.map((child) => (
                        <li key={child.href}>
                          <a href={child.href}>{child.label}</a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="dock-item">
            <button
              className="toggle"
              aria-label="Resources"
              onClick={(e) => { e.stopPropagation(); toggleMenu('resources'); }}
            >
              <FolderIcon />
            </button>
            <span className="label">Resources</span>
            <div className={`dock-submenu ${openMenu === 'resources' ? 'open' : ''}`}>
              <ul>
                <li><a href="/blog">Mojito Labs</a></li>
                <li><a href="/free-templates">Free Templates</a></li>
                <li><a href="/free-tools">Free Tools</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    DarkReader?: {
      enable: (opts: { brightness: number; contrast: number; sepia: number }) => void;
      disable: () => void;
      isEnabled: () => boolean;
      setFetchMethod: (fetch: typeof window.fetch) => void;
    };
  }
}

const DARKREADER_SRC = 'https://cdn.jsdelivr.net/npm/darkreader@4.9.109/darkreader.min.js';
const OPTS = { brightness: 100, contrast: 90, sepia: 10 };

function enableDark() {
  try {
    window.DarkReader?.setFetchMethod(window.fetch);
    window.DarkReader?.enable(OPTS);
  } catch {
    /* DarkReader fetch may fail; ignore */
  }
}

/**
 * DarkModeToggle — floating dark-mode button, ported from the Webflow
 * code embed (darkBtn + DarkReader) used on the static pages.
 * Persists choice in localStorage("darkMode"), same key as static pages.
 */
export default function DarkModeToggle() {
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let cancelled = false;

    const apply = () => {
      if (cancelled) return;
      const isDark = localStorage.getItem('darkMode') === 'true';
      if (isDark) {
        enableDark();
        if (sunRef.current) sunRef.current.style.display = 'none';
        if (moonRef.current) moonRef.current.style.display = 'block';
      }
    };

    if (window.DarkReader) {
      apply();
    } else {
      const existing = document.querySelector(`script[src="${DARKREADER_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', apply, { once: true });
      } else {
        const s = document.createElement('script');
        s.src = DARKREADER_SRC;
        s.onload = apply;
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const onClick = () => {
    const DarkReader = window.DarkReader;
    if (!DarkReader) return;
    const sun = sunRef.current;
    const moon = moonRef.current;
    if (DarkReader.isEnabled()) {
      DarkReader.disable();
      localStorage.setItem('darkMode', 'false');
      if (sun) sun.style.display = 'block';
      if (moon) moon.style.display = 'none';
    } else {
      enableDark();
      localStorage.setItem('darkMode', 'true');
      if (sun) sun.style.display = 'none';
      if (moon) moon.style.display = 'block';
    }
  };

  return (
    <button
      id="darkBtn"
      data-darkreader-ignore=""
      onClick={onClick}
      aria-label="Toggle dark mode"
      style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
        width: '50px', height: '50px', background: 'white',
        border: '2px solid #ddd', borderRadius: '50%', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', outline: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg ref={sunRef} id="sunIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <svg ref={moonRef} id="moonIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'none' }}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}

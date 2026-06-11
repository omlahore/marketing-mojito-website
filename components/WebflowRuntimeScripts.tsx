'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Webflow?: {
      destroy?: () => void;
      ready?: () => void;
      require?: (name: string) => { init?: (config?: unknown) => void };
    };
  }
}

/** jQuery bundle URL Webflow exports use (same as `public/index.html`). */
const JQUERY_SRC =
  'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6821a11a1adb296fa1dad4b9';

function scriptAlreadyLoaded(srcSubstring: string): boolean {
  return Array.from(document.querySelectorAll('script[src]')).some((el) =>
    (el as HTMLScriptElement).src.includes(srcSubstring)
  );
}

function appendScript(src: string, attrs?: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        script.setAttribute(k, v);
      }
    }
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

/** Kick Webflow / IX2 after late script load (React has already painted the DOM). */
function reinitWebflow() {
  const Webflow = window.Webflow;
  if (!Webflow) return;
  try {
    Webflow.destroy?.();
  } catch {
    /* ignore */
  }
  try {
    Webflow.ready?.();
  } catch {
    /* ignore */
  }
  try {
    Webflow.require?.('ix2')?.init?.();
  } catch {
    /* ignore */
  }
  // IX2 initialized after the browser 'load' event never runs its initial
  // SCROLL_INTO_VIEW check — elements with load-time inline opacity:0 stay
  // invisible until the user scrolls. Nudge it with a synthetic event.
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
  });
}

/**
 * Loads jQuery + `public/js/webflow.js` so Webflow nav (dropdowns, hamburger),
 * IX2 interactions (e.g. marquee / loop-label), and related behavior match static HTML pages.
 * Does not load GSAP/Swiper/weblocks unless we add them later.
 */
export default function WebflowRuntimeScripts() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!scriptAlreadyLoaded('jquery-3.5.1.min')) {
          await appendScript(JQUERY_SRC, {
            integrity: 'sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=',
            crossorigin: 'anonymous',
          });
        }
        if (cancelled) return;

        if (!scriptAlreadyLoaded('webflow.js')) {
          await appendScript('/js/webflow.js');
        }
        if (cancelled) return;

        reinitWebflow();
      } catch (e) {
        console.warn('[WebflowRuntimeScripts]', e);
      }
    })();

    return () => {
      cancelled = true;
      try {
        window.Webflow?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return null;
}

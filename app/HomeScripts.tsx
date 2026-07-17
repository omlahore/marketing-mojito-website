'use client';

import { useEffect } from 'react';

/** Webflow page id from the original public/index.html <html data-wf-page>. */
const HOME_WF_PAGE_ID = '6821a11a1adb296fa1dad4c5';

/**
 * Homepage scripts. The Webflow export also loaded GSAP (+ 5 plugins), Swiper
 * and weblocks — audited 2026-07: nothing on the page uses them (marquees are
 * IX2/CSS; no .swiper elements; weblocks logged "no instances"). ~500KB cut.
 */
const HOME_SCRIPTS = [
  '/js/forms.js',
];

/** Loaded separately — the original tag is `type="module" async finsweet="components"`. */
const FINSWEET_SRC =
  'https://cdn.prod.website-files.com/6821a11a1adb296fa1dad4b9%2F6544eda5f000985a163a8687%2F685908194c193088f33e2f51%2Ffinsweetcomponentsconfig-1.0.12.js';

function scriptLoaded(src: string): boolean {
  const key = src.split('/').pop() || src;
  return Array.from(document.querySelectorAll('script[src]')).some((el) =>
    (el as HTMLScriptElement).src.includes(key)
  );
}

function appendScript(src: string, attrs?: Record<string, string>): Promise<void> {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    if (attrs) for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
    s.onload = () => resolve();
    s.onerror = () => {
      console.warn('[HomeScripts] failed to load', src);
      resolve(); // keep going; one CDN failure shouldn't kill the rest
    };
    document.body.appendChild(s);
  });
}

/** Wait until webflow.js (loaded by WebflowRuntimeScripts) is present, then re-init IX2. */
function reinitWebflowWhenReady(timeoutMs = 10000) {
  const start = Date.now();
  const tick = () => {
    const Webflow = (window as any).Webflow;
    if (Webflow) {
      try { Webflow.destroy?.(); } catch { /* ignore */ }
      try { Webflow.ready?.(); } catch { /* ignore */ }
      try { Webflow.require?.('ix2')?.init?.(); } catch { /* ignore */ }
      // Late IX2 init misses its initial SCROLL_INTO_VIEW evaluation —
      // synthesize a scroll/resize so in-view animations (e.g. hero) fire.
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
      });
      return;
    }
    if (Date.now() - start < timeoutMs) setTimeout(tick, 100);
  };
  tick();
}

/** Services list hover preview — ported from the Webflow code embed on index.html. */
function wireServicesHoverPreview(): () => void {
  const preview = document.getElementById('hover-preview');
  if (!preview) return () => {};
  const previewImg = preview.querySelector('img');
  if (!previewImg) return () => {};

  const cleanups: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>('.service-row').forEach((row) => {
    const enter = () => {
      (previewImg as HTMLImageElement).src = row.dataset.img || '';
      preview.style.opacity = '1';
      preview.style.transform = 'scale(1)';
    };
    const move = (e: MouseEvent) => {
      const offsetX = 20;
      const offsetY = 2;
      preview.style.left = e.pageX + offsetX + 'px';
      preview.style.top = e.pageY - preview.offsetHeight - offsetY + 'px';
    };
    const leave = () => {
      preview.style.opacity = '0';
      preview.style.transform = 'scale(0.7)';
    };
    row.addEventListener('mouseenter', enter);
    row.addEventListener('mousemove', move);
    row.addEventListener('mouseleave', leave);
    cleanups.push(() => {
      row.removeEventListener('mouseenter', enter);
      row.removeEventListener('mousemove', move);
      row.removeEventListener('mouseleave', leave);
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

/**
 * HomeScripts — loads the homepage-specific runtime (GSAP + plugins, Swiper,
 * weblocks animations, forms.js) and re-initializes Webflow IX2 with the
 * homepage's data-wf-page id so all original animations and form handlers run.
 *
 * jQuery + webflow.js themselves are loaded by WebflowRuntimeScripts (PageShell).
 */
export default function HomeScripts() {
  useEffect(() => {
    // IX2 keys "page load" interactions off this attribute — set before init.
    document.documentElement.setAttribute('data-wf-page', HOME_WF_PAGE_ID);

    let cancelled = false;
    let cleanupHover: () => void = () => {};

    (async () => {
      for (const src of HOME_SCRIPTS) {
        if (cancelled) return;
        if (!scriptLoaded(src)) await appendScript(src);
      }
      if (!scriptLoaded(FINSWEET_SRC)) {
        appendScript(FINSWEET_SRC, {
          type: 'module',
          siteid: '6821a11a1adb296fa1dad4b9',
          finsweet: 'components',
        });
      }
      if (cancelled) return;
      reinitWebflowWhenReady();
      cleanupHover = wireServicesHoverPreview();
    })();

    return () => {
      cancelled = true;
      cleanupHover();
    };
  }, []);

  return null;
}

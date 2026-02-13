'use client';

import { useEffect } from 'react';

const SCRIPTS = [
  'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6821a11a1adb296fa1dad4b9',
  '/js/webflow.js',
  'https://cdn.prod.website-files.com/gsap/3.14.2/gsap.min.js',
  'https://cdn.prod.website-files.com/gsap/3.14.2/ScrollTrigger.min.js',
  'https://cdn.prod.website-files.com/gsap/3.14.2/InertiaPlugin.min.js',
  'https://cdn.prod.website-files.com/gsap/3.14.2/Physics2DPlugin.min.js',
  'https://cdn.prod.website-files.com/gsap/3.14.2/PhysicsPropsPlugin.min.js',
  'https://cdn.prod.website-files.com/gsap/3.14.2/CustomEase.min.js',
  '/js/forms.js',
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const key = src.split('/').pop()?.split('?')[0] || src;
    if (Array.from(document.querySelectorAll('script[src]')).some((s) => (s as HTMLScriptElement).src.includes(key))) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function runGsapRegister() {
  const w = typeof window !== 'undefined' ? window : null;
  if (!w) return;
  const gsap = (w as unknown as { gsap?: { registerPlugin: (...plugins: unknown[]) => void } }).gsap;
  const plugins = (w as unknown as {
    ScrollTrigger?: unknown;
    InertiaPlugin?: unknown;
    Physics2DPlugin?: unknown;
    PhysicsPropsPlugin?: unknown;
    CustomEase?: unknown;
  });
  if (gsap && plugins.ScrollTrigger) {
    (gsap.registerPlugin as (...args: unknown[]) => void)(
      plugins.ScrollTrigger,
      plugins.InertiaPlugin,
      plugins.Physics2DPlugin,
      plugins.PhysicsPropsPlugin,
      plugins.CustomEase
    );
  }
}

export default function BlogScripts() {
  useEffect(() => {
    // w-mod-js: required by Webflow for interactions
    const d = document.documentElement;
    d.className += ' w-mod-js';
    if ('ontouchstart' in window) {
      d.className += ' w-mod-touch';
    }

    let cancelled = false;
    (async () => {
      for (const src of SCRIPTS) {
        if (cancelled) return;
        try {
          await loadScript(src);
        } catch (e) {
          console.warn('Script load failed:', src, e);
        }
      }
      if (!cancelled) {
        runGsapRegister();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

'use client';

import { useEffect } from 'react';

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

/**
 * Loads public/js/forms.js so `.web3-checklist-form` and other intercepts work on this route.
 */
export default function FreeTemplatesScripts() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadScript('/js/forms.js');
        if (!cancelled && typeof (window as unknown as { __mmInitForms?: () => void }).__mmInitForms === 'function') {
          (window as unknown as { __mmInitForms: () => void }).__mmInitForms();
        }
      } catch (e) {
        if (!cancelled) console.warn('forms.js load failed', e);
      }
 })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

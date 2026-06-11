'use client';

import { useEffect, useRef } from 'react';

const GCAL_SCRIPT = 'https://calendar.google.com/calendar/scheduling-button-script.js';
const GCAL_CSS = 'https://calendar.google.com/calendar/scheduling-button-script.css';
const SCHEDULE_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0TsP5i42tYVxGSKLnyQSPuP2px8mxUmZfraM11FYQ-mk2-kM83oO6bGxBPqLV-IHeG4czTchxd?gv=true';

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (opts: { url: string; color: string; label: string; target: HTMLElement }) => void;
      };
    };
  }
}

function ensureStylesheet() {
  const id = 'gcal-scheduling-button-css';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = GCAL_CSS;
  document.head.appendChild(link);
}

export default function GoogleCalendarSchedulingButton() {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureStylesheet();

    const runLoad = () => {
      const target = targetRef.current;
      if (!target || !window.calendar?.schedulingButton) return;
      window.calendar.schedulingButton.load({
        url: SCHEDULE_URL,
        color: '#82C341',
        label: 'Book A Strategy Call',
        target,
      });
    };

    const onWindowLoad = () => runLoad();

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GCAL_SCRIPT}"]`);
    if (existing) {
      window.addEventListener('load', onWindowLoad);
      if (document.readyState === 'complete') runLoad();
      return () => window.removeEventListener('load', onWindowLoad);
    }

    const script = document.createElement('script');
    script.src = GCAL_SCRIPT;
    script.async = true;
    script.onload = () => {
      window.addEventListener('load', onWindowLoad);
      if (document.readyState === 'complete') runLoad();
    };
    document.body.appendChild(script);

    return () => {
      window.removeEventListener('load', onWindowLoad);
    };
  }, []);

  return <div ref={targetRef} className="button2 call _1 w-embed w-script" />;
}

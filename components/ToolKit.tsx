'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

/**
 * Shared UI kit for the free interactive lead-gen tools.
 *  - <ToolStyles/>  : one brand-styled stylesheet (tk- prefixed), include once per tool page.
 *  - <ToolShell/>   : hero + body wrapper so every tool looks consistent.
 *  - useLeadGate()  : gate state + submit handler that POSTs to /api/lead-magnet.
 *  - <LeadGate/>    : the email-capture modal shown before revealing the full result.
 */

const CAL_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0TsP5i42tYVxGSKLnyQSPuP2px8mxUmZfraM11FYQ-mk2-kM83oO6bGxBPqLV-IHeG4czTchxd?gv=true';

export const TOOL_CAL_URL = CAL_URL;

export function ToolStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
.tk-hero { background: linear-gradient(135deg, #f7fbf3 0%, #fffce1 100%); }
.tk-hero-inner { padding: 3.5rem 0 2.5rem; max-width: 760px; }
.tk-eyebrow { display:inline-block; background:#82c341; color:#fff; font-family:Poppins,sans-serif; font-weight:600; font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; border-radius:2rem; padding:.4em 1em; margin-bottom:1rem; }
.tk-h1 { font-family:Unbounded,sans-serif; font-weight:600; font-size:2.5rem; line-height:1.15; color:#353535; margin:0 0 1rem; }
.tk-lede { font-family:Poppins,sans-serif; color:#474747; font-size:1.05rem; line-height:1.6; margin:0; }
.tk-body { padding:2.5rem 0 4rem; }
.tk-layout { display:grid; grid-template-columns: 1.1fr .9fr; gap:2rem; align-items:start; }
@media (max-width:860px){ .tk-layout{ grid-template-columns:1fr; } }
.tk-panel { background:#fff; border-radius:1rem; box-shadow:0 6px 24px rgba(53,53,53,.08); padding:1.75rem; font-family:Poppins,sans-serif; }
.tk-panel h2 { font-family:Unbounded,sans-serif; font-size:1.15rem; color:#353535; margin:0 0 1.25rem; }
.tk-field { margin-bottom:1.25rem; }
.tk-label { display:block; font-weight:600; font-size:.9rem; color:#353535; margin-bottom:.5rem; }
.tk-input, .tk-select { width:100%; border:1px solid #d9d9d9; border-radius:.5rem; padding:.7em .8em; font-size:.95rem; font-family:Poppins,sans-serif; color:#353535; background:#fff; }
.tk-input:focus, .tk-select:focus { outline:none; border-color:#82c341; }
.tk-range { width:100%; accent-color:#82c341; }
.tk-chips { display:flex; flex-wrap:wrap; gap:.5rem; }
.tk-chip { border:1px solid #d9d9d9; border-radius:2rem; padding:.45em 1em; font-size:.85rem; cursor:pointer; user-select:none; transition:all .15s; background:#fff; color:#474747; }
.tk-chip[data-on="1"] { background:#82c341; border-color:#82c341; color:#fff; font-weight:600; }
.tk-seg { display:flex; flex-wrap:wrap; gap:.5rem; }
.tk-seg button { flex:1; min-width:fit-content; border:1px solid #d9d9d9; background:#fff; border-radius:.5rem; padding:.6em .8em; font-size:.85rem; cursor:pointer; color:#474747; font-family:Poppins,sans-serif; transition:all .15s; }
.tk-seg button[data-on="1"] { background:#353535; border-color:#353535; color:#fff; font-weight:600; }
.tk-result { background:linear-gradient(135deg,#f7fbf3,#fffce1); border-radius:1rem; padding:1.75rem; font-family:Poppins,sans-serif; position:sticky; top:1rem; }
.tk-result-label { font-size:.8rem; text-transform:uppercase; letter-spacing:.06em; color:#474747; font-weight:600; }
.tk-result-big { font-family:Unbounded,sans-serif; font-weight:600; font-size:2rem; color:#353535; margin:.35rem 0 .25rem; line-height:1.1; }
.tk-result-note { font-size:.85rem; color:#666; margin:0 0 1.25rem; }
.tk-btn { display:inline-block; background-image:linear-gradient(45deg,#82c341,#09ce91); color:#fff!important; border:none; border-radius:.5625rem; padding:.85em 1.4em; font-weight:600; font-size:.95rem; cursor:pointer; text-decoration:none; font-family:Poppins,sans-serif; width:100%; text-align:center; }
.tk-btn:disabled { opacity:.5; cursor:not-allowed; }
.tk-locked { filter:blur(6px); pointer-events:none; user-select:none; }
.tk-breakdown { margin-top:1.25rem; }
.tk-row { display:flex; justify-content:space-between; padding:.55rem 0; border-bottom:1px solid #eee; font-size:.9rem; color:#353535; }
.tk-row span:last-child { font-weight:600; }
.tk-cta-foot { margin-top:1rem; text-align:center; font-size:.85rem; color:#474747; }
.tk-cta-foot a { color:#82c341; font-weight:600; }
/* modal */
.tk-overlay { position:fixed; inset:0; background:rgba(27,0,9,.55); display:flex; align-items:center; justify-content:center; z-index:10000; padding:1rem; }
.tk-modal { background:#fff; border-radius:1rem; max-width:420px; width:100%; padding:2rem; font-family:Poppins,sans-serif; }
.tk-modal h3 { font-family:Unbounded,sans-serif; font-size:1.25rem; color:#353535; margin:0 0 .5rem; }
.tk-modal p { color:#474747; font-size:.9rem; line-height:1.55; margin:0 0 1.25rem; }
.tk-modal .tk-close { background:none; border:none; color:#999; cursor:pointer; font-size:.85rem; margin-top:.75rem; width:100%; }
`,
      }}
    />
  );
}

export function ToolShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <>
      <ToolStyles />
      <section className="tk-hero">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="tk-hero-inner">
              <span className="tk-eyebrow">{eyebrow}</span>
              <h1 className="tk-h1">{title}</h1>
              <p className="tk-lede">{lede}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="tk-body">
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">{children}</div>
        </div>
      </section>
    </>
  );
}

interface GateConfig {
  toolName: string;
  pageName: string;
  toolPath: string; // e.g. /free-tools/website-cost-calculator
}

export interface SubmitExtras {
  /** Plain-text result block emailed to the user (cost estimates, etc.). */
  resultDetails?: string;
  /** When set, the server fetches this URL, scores it, and emails the report. */
  auditUrl?: string;
}

export function useLeadGate({ toolName, pageName, toolPath }: GateConfig) {
  const storageKey = `tool-lead-${toolPath}`;
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const o = JSON.parse(raw) as { email?: string };
        setSubmitted(true);
        setSubmittedEmail(o.email || '');
      }
    } catch {
      /* private mode */
    }
  }, [storageKey]);

  function requestUnlock() {
    if (submitted) return;
    setOpen(true);
  }

  function submit(name: string, email: string, company: string, extras?: SubmitExtras) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ email }));
    } catch {
      /* private mode */
    }
    void fetch('/api/lead-magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        company,
        pdfName: toolName,
        pageName,
        tool_link: `https://marketingmojito.com${toolPath}`,
        resultDetails: extras?.resultDetails,
        auditUrl: extras?.auditUrl,
        _loaded: Date.now() - 3000,
      }),
    }).catch(() => {});
    setSubmitted(true);
    setSubmittedEmail(email);
    setOpen(false);
  }

  // `unlocked` is an alias of `submitted` for tools (color, font) that reveal
  // visual extras on screen after capture rather than emailing a result.
  return { submitted, unlocked: submitted, submittedEmail, open, setOpen, requestUnlock, submit };
}

/** Confirmation panel shown after submit — never reveals the result on screen. */
export function ToolSuccess({ email }: { email: string }) {
  return (
    <div className="tk-result" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }} aria-hidden="true">✅</div>
      <div className="tk-result-big" style={{ fontSize: '1.4rem' }}>Check your inbox</div>
      <p className="tk-result-note">
        Your personalised result is on its way{email ? <> to <strong>{email}</strong></> : null}. It usually
        arrives within a couple of minutes — check spam if you don&apos;t see it.
      </p>
      <a href={TOOL_CAL_URL} className="tk-btn" style={{ marginTop: '.5rem' }}>
        Book a free 15-min call
      </a>
    </div>
  );
}

export function LeadGate({
  open,
  onClose,
  onSubmit,
  heading = 'See your full result',
  blurb = 'Enter your details to unlock the complete breakdown. No spam — just your result and the occasional useful tip.',
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, company: string) => void;
  heading?: string;
  blurb?: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit(name.trim(), email.trim(), company.trim());
  }

  return (
    <div className="tk-overlay" onClick={onClose}>
      <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{heading}</h3>
        <p>{blurb}</p>
        <form onSubmit={handle}>
          <div className="tk-field">
            <label className="tk-label" htmlFor="lg-name">Name</label>
            <input id="lg-name" className="tk-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="tk-field">
            <label className="tk-label" htmlFor="lg-email">Work email</label>
            <input id="lg-email" type="email" className="tk-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="tk-field">
            <label className="tk-label" htmlFor="lg-company">Company (optional)</label>
            <input id="lg-company" className="tk-input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          {/* honeypot — bots fill this, humans never see it */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
          <button type="submit" className="tk-btn">Unlock my result</button>
          <button type="button" className="tk-close" onClick={onClose}>Maybe later</button>
        </form>
      </div>
    </div>
  );
}

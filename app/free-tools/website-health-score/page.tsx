'use client';

import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { ToolShell, LeadGate, useLeadGate, ToolSuccess } from '@/components/ToolKit';

const CHECKS = [
  'Security (HTTPS)',
  'Load speed',
  'Page weight',
  'Title tag',
  'Meta description',
  'Mobile viewport',
  'H1 heading',
  'Open Graph / social tags',
  'Favicon',
  'Analytics tracking',
];

function normalize(url: string): string {
  const u = url.trim();
  if (!u) return '';
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

export default function WebsiteHealthScore() {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);
  const gate = useLeadGate({
    toolName: 'Website Health Score',
    pageName: 'Free Tools - Website Health Score',
    toolPath: '/free-tools/website-health-score',
  });

  const valid = /\.[a-z]{2,}/i.test(url.trim());

  function start() {
    setTouched(true);
    if (!valid) return;
    gate.requestUnlock();
  }

  return (
    <PageShell>
      <ToolShell
        eyebrow="Free Tool"
        title="Website Health Score"
        lede="Enter your website address and we'll run a real audit — security, speed, SEO, mobile, and conversion basics — then email you a scored report with a prioritized fix list. Free."
      >
        <div className="tk-layout">
          <div className="tk-panel">
            <h2>Audit your website</h2>
            <div className="tk-field">
              <label className="tk-label" htmlFor="url">Your website URL</label>
              <input
                id="url"
                className="tk-input"
                placeholder="yourbusiness.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => setTouched(true)}
                inputMode="url"
                autoComplete="url"
              />
              {touched && !valid && (
                <p className="tk-result-note" style={{ color: '#e8533f', marginTop: '.5rem' }}>
                  Enter a valid website address (e.g. yourbusiness.com).
                </p>
              )}
            </div>
            <p className="tk-result-note">
              We check {CHECKS.length} signals across security, speed, SEO, mobile, and conversion —
              all from your public homepage. No access or login needed.
            </p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', columns: 2, fontSize: '.85rem', color: '#474747', lineHeight: 1.9 }}>
              {CHECKS.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>

          {gate.submitted ? (
            <ToolSuccess email={gate.submittedEmail} />
          ) : (
            <div className="tk-result">
              <div className="tk-result-label">Your report</div>
              <div className="tk-result-big" style={{ fontSize: '1.4rem' }}>Scored & emailed to you</div>
              <p className="tk-result-note">
                We run the audit live against your URL and send the full scored report — with exactly
                what to fix first — straight to your inbox. Nothing to read on a tiny screen here.
              </p>
              <button className="tk-btn" onClick={start} disabled={touched && !valid}>
                Audit my website
              </button>
            </div>
          )}
        </div>
      </ToolShell>

      <LeadGate
        open={gate.open}
        onClose={() => gate.setOpen(false)}
        onSubmit={(n, e, c) => gate.submit(n, e, c, { auditUrl: normalize(url) })}
        heading="Where should we send your report?"
        blurb="Enter your details and we'll run the audit on your site and email you the full scored report within a couple of minutes."
      />
    </PageShell>
  );
}

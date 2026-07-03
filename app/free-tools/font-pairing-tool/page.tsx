'use client';

import { useEffect, useMemo, useState } from 'react';
import PageShell from '@/components/PageShell';
import { ToolShell, LeadGate, useLeadGate, TOOL_CAL_URL } from '@/components/ToolKit';

/* Curated heading -> body pairings (all Google Fonts). */
const PAIRINGS: Record<string, { vibe: string; body: string[] }> = {
  'Playfair Display': { vibe: 'Elegant / editorial', body: ['Source Sans 3', 'Montserrat', 'Inter'] },
  'Montserrat': { vibe: 'Modern / clean', body: ['Merriweather', 'Lora', 'Source Sans 3'] },
  'Oswald': { vibe: 'Bold / impactful', body: ['Merriweather', 'Lora', 'Work Sans'] },
  'DM Serif Display': { vibe: 'Luxury / classic', body: ['Inter', 'Work Sans', 'Montserrat'] },
  'Roboto Slab': { vibe: 'Sturdy / trustworthy', body: ['Inter', 'Work Sans'] },
  'Raleway': { vibe: 'Refined / minimal', body: ['Lora', 'Merriweather', 'Inter'] },
  'Unbounded': { vibe: 'Distinctive / brand-forward', body: ['Poppins', 'Inter', 'Work Sans'] },
};

const ALL_FAMILIES = Array.from(
  new Set([
    ...Object.keys(PAIRINGS),
    ...Object.values(PAIRINGS).flatMap((p) => p.body),
  ])
);

function googleHref(families: string[]) {
  const spec = families.map((f) => `family=${f.replace(/ /g, '+')}:wght@400;600;700`).join('&');
  return `https://fonts.googleapis.com/css2?${spec}&display=swap`;
}

export default function FontPairingTool() {
  const headings = Object.keys(PAIRINGS);
  const [heading, setHeading] = useState(headings[0]);
  const [bodyIdx, setBodyIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const gate = useLeadGate({
    toolName: 'Font Pairing Tool',
    pageName: 'Free Tools - Font Pairing Tool',
    toolPath: '/free-tools/font-pairing-tool',
  });

  // Load all curated fonts once.
  useEffect(() => {
    const id = 'fpt-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = googleHref(ALL_FAMILIES);
    document.head.appendChild(link);
  }, []);

  const bodyOptions = PAIRINGS[heading].body;
  const body = bodyOptions[Math.min(bodyIdx, bodyOptions.length - 1)];
  const embed = useMemo(() => googleHref([heading, body]), [heading, body]);

  function copyEmbed() {
    const code = `<link rel="stylesheet" href="${embed}">`;
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  return (
    <PageShell>
      <ToolShell
        eyebrow="Free Tool"
        title="Font Pairing Tool"
        lede="Great typography is half of great branding. Pick a heading font and preview expert-matched body fonts live. Unlock the ready-to-paste embed code for your site."
      >
        <div className="tk-layout">
          <div className="tk-panel">
            <h2>Pick your fonts</h2>
            <div className="tk-field">
              <label className="tk-label" htmlFor="heading-font">Heading font</label>
              <select id="heading-font" className="tk-select" value={heading} onChange={(e) => { setHeading(e.target.value); setBodyIdx(0); }}>
                {headings.map((h) => <option key={h} value={h}>{h} — {PAIRINGS[h].vibe}</option>)}
              </select>
            </div>
            <div className="tk-field">
              <span className="tk-label">Matched body font</span>
              <div className="tk-seg">
                {bodyOptions.map((b, i) => (
                  <button key={b} type="button" data-on={i === bodyIdx ? '1' : '0'} onClick={() => setBodyIdx(i)}>{b}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="tk-result">
            <div className="tk-result-label">Live preview</div>
            <div style={{ background: '#fff', borderRadius: '.75rem', padding: '1.5rem', margin: '.75rem 0' }}>
              <div style={{ fontFamily: `'${heading}', sans-serif`, fontWeight: 700, fontSize: '1.7rem', lineHeight: 1.2, color: '#353535' }}>
                Design. Think. Solve.
              </div>
              <p style={{ fontFamily: `'${body}', sans-serif`, fontSize: '.95rem', lineHeight: 1.7, color: '#474747', marginTop: '.75rem', marginBottom: 0 }}>
                This is how your body copy looks paired with the heading above. Good pairings balance
                personality and readability — a distinctive heading with a calm, legible body.
              </p>
            </div>
            <p className="tk-result-note"><strong>{heading}</strong> + <strong>{body}</strong></p>

            {gate.unlocked ? (
              <div className="tk-breakdown">
                <div className="tk-result-label">Embed code</div>
                <code style={{ display: 'block', background: '#fff', padding: '.6rem', borderRadius: '.4rem', fontSize: '.7rem', wordBreak: 'break-all', margin: '.5rem 0' }}>
                  {`<link rel="stylesheet" href="${embed}">`}
                </code>
                <button className="tk-btn" onClick={copyEmbed}>{copied ? 'Copied!' : 'Copy embed code'}</button>
                <p className="tk-cta-foot">Want a complete brand system? <a href={TOOL_CAL_URL}>Book a free 15-min call →</a></p>
              </div>
            ) : (
              <>
                <div className="tk-breakdown tk-locked" aria-hidden="true">
                  <code style={{ display: 'block', background: '#fff', padding: '.6rem', borderRadius: '.4rem', fontSize: '.7rem' }}>&lt;link rel=&quot;stylesheet&quot; href=&quot;...&quot;&gt;</code>
                </div>
                <button className="tk-btn" style={{ marginTop: '1rem' }} onClick={gate.requestUnlock}>Get the embed code</button>
              </>
            )}
          </div>
        </div>
      </ToolShell>

      <LeadGate
        open={gate.open}
        onClose={() => gate.setOpen(false)}
        onSubmit={gate.submit}
        heading="Get your font embed code"
        blurb="Enter your details to unlock the ready-to-paste Google Fonts embed code for your pairing."
      />
    </PageShell>
  );
}

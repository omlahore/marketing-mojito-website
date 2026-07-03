'use client';

import { useMemo, useState } from 'react';
import PageShell from '@/components/PageShell';
import { ToolShell, LeadGate, useLeadGate, TOOL_CAL_URL } from '@/components/ToolKit';

/* ---- color helpers (HSL <-> hex) ---- */
function hexToHsl(hex: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  const m = hex.replace('#', '');
  r = parseInt(m.slice(0, 2), 16) / 255;
  g = parseInt(m.slice(2, 4), 16) / 255;
  b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) => Math.round((v + mm) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

type Harmony = 'complementary' | 'analogous' | 'triadic' | 'monochromatic';
const HARMONIES: { id: Harmony; label: string }[] = [
  { id: 'analogous', label: 'Analogous' },
  { id: 'complementary', label: 'Complementary' },
  { id: 'triadic', label: 'Triadic' },
  { id: 'monochromatic', label: 'Monochromatic' },
];

function palette(base: string, mode: Harmony): string[] {
  const [h, s, l] = hexToHsl(base);
  switch (mode) {
    case 'complementary':
      return [base, hslToHex(h, s, Math.min(l + 18, 92)), hslToHex(h + 180, s, l), hslToHex(h + 180, s * 0.7, Math.min(l + 20, 90)), hslToHex(h, s * 0.5, 20)];
    case 'triadic':
      return [base, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l), hslToHex(h, s * 0.6, Math.min(l + 25, 92)), hslToHex(h, s * 0.5, 18)];
    case 'monochromatic':
      return [hslToHex(h, s, 92), hslToHex(h, s, 72), base, hslToHex(h, s, Math.max(l - 18, 22)), hslToHex(h, s, 14)];
    case 'analogous':
    default:
      return [hslToHex(h - 30, s, l), base, hslToHex(h + 30, s, l), hslToHex(h + 30, s * 0.6, Math.min(l + 22, 92)), hslToHex(h, s * 0.5, 18)];
  }
}

export default function ColorPaletteGenerator() {
  const [base, setBase] = useState('#82C341');
  const [mode, setMode] = useState<Harmony>('analogous');
  const [copied, setCopied] = useState('');

  const gate = useLeadGate({
    toolName: 'Brand Color Palette Generator',
    pageName: 'Free Tools - Color Palette Generator',
    toolPath: '/free-tools/color-palette-generator',
  });

  const colors = useMemo(() => palette(base, mode), [base, mode]);
  const tints = useMemo(() => {
    const [h, s] = hexToHsl(base);
    return [90, 75, 60, 45, 30].map((l) => hslToHex(h, s, l));
  }, [base]);

  function copy(hex: string) {
    navigator.clipboard?.writeText(hex).then(() => {
      setCopied(hex);
      setTimeout(() => setCopied(''), 1200);
    }).catch(() => {});
  }

  return (
    <PageShell>
      <ToolShell
        eyebrow="Free Tool"
        title="Brand Color Palette Generator"
        lede="Pick a base color and a harmony style to instantly generate a balanced brand palette. Click any swatch to copy its hex code. Unlock the full set with tints and shades to use as your brand sheet."
      >
        <div className="tk-layout">
          <div className="tk-panel">
            <h2>Choose your colors</h2>
            <div className="tk-field">
              <label className="tk-label" htmlFor="base">Base color</label>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                <input id="base" type="color" value={base} onChange={(e) => setBase(e.target.value.toUpperCase())} style={{ width: 56, height: 44, border: 'none', background: 'none', cursor: 'pointer' }} />
                <input className="tk-input" value={base} onChange={(e) => { const v = e.target.value.toUpperCase(); if (/^#[0-9A-F]{6}$/.test(v)) setBase(v); else setBase(v); }} style={{ maxWidth: 140 }} />
              </div>
            </div>
            <div className="tk-field">
              <span className="tk-label">Harmony style</span>
              <div className="tk-seg">
                {HARMONIES.map((hh) => (
                  <button key={hh.id} type="button" data-on={mode === hh.id ? '1' : '0'} onClick={() => setMode(hh.id)}>{hh.label}</button>
                ))}
              </div>
            </div>
            <p className="tk-result-note" style={{ marginTop: '1rem' }}>{copied ? `Copied ${copied}!` : 'Click a swatch to copy its hex code.'}</p>
          </div>

          <div className="tk-result">
            <div className="tk-result-label">Your palette</div>
            <div style={{ display: 'flex', gap: '.5rem', margin: '.75rem 0 1rem' }}>
              {colors.map((c, i) => (
                <button key={i} onClick={() => copy(c)} title={`Copy ${c}`} style={{ flex: 1, height: 88, background: c, border: 'none', borderRadius: '.5rem', cursor: 'pointer' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {colors.map((c, i) => (
                <code key={i} onClick={() => copy(c)} style={{ fontSize: '.72rem', cursor: 'pointer', background: '#fff', padding: '.25rem .45rem', borderRadius: '.3rem' }}>{c}</code>
              ))}
            </div>

            {gate.unlocked ? (
              <div className="tk-breakdown">
                <div className="tk-result-label" style={{ marginTop: '.5rem' }}>Tints & shades</div>
                <div style={{ display: 'flex', gap: '.5rem', margin: '.5rem 0' }}>
                  {tints.map((c, i) => (
                    <button key={i} onClick={() => copy(c)} title={`Copy ${c}`} style={{ flex: 1, height: 48, background: c, border: 'none', borderRadius: '.4rem', cursor: 'pointer' }} />
                  ))}
                </div>
                <p className="tk-cta-foot">Want a full brand identity, not just colors? <a href={TOOL_CAL_URL}>Book a free 15-min call →</a></p>
              </div>
            ) : (
              <>
                <div className="tk-breakdown tk-locked" aria-hidden="true">
                  <div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem' }}>
                    {tints.map((c, i) => <div key={i} style={{ flex: 1, height: 48, background: c, borderRadius: '.4rem' }} />)}
                  </div>
                </div>
                <button className="tk-btn" style={{ marginTop: '1rem' }} onClick={gate.requestUnlock}>Unlock tints, shades & brand sheet</button>
              </>
            )}
          </div>
        </div>
      </ToolShell>

      <LeadGate
        open={gate.open}
        onClose={() => gate.setOpen(false)}
        onSubmit={gate.submit}
        heading="Unlock your full palette"
        blurb="Enter your details to reveal tints, shades, and a shareable brand sheet — we'll email you a copy."
      />
    </PageShell>
  );
}

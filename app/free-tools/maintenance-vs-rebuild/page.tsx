'use client';

import { useMemo, useState } from 'react';
import PageShell from '@/components/PageShell';
import { ToolShell, LeadGate, useLeadGate, ToolSuccess } from '@/components/ToolKit';

const ISSUES: { id: string; label: string; weight: number }[] = [
  { id: 'slow', label: 'Loads slowly', weight: 18 },
  { id: 'mobile', label: 'Breaks on mobile', weight: 18 },
  { id: 'dated', label: 'Looks dated', weight: 14 },
  { id: 'hardedit', label: 'Hard to update content', weight: 12 },
  { id: 'security', label: 'Security / hacks', weight: 16 },
  { id: 'noconvert', label: "Doesn't convert visitors", weight: 14 },
  { id: 'noseo', label: 'Invisible on Google', weight: 12 },
  { id: 'noscale', label: "Can't add what we need", weight: 14 },
];

function inr(n: number) {
  return '\u20B9' + Math.round(n).toLocaleString('en-IN');
}

export default function MaintenanceVsRebuild() {
  const [age, setAge] = useState(3);
  const [issues, setIssues] = useState<string[]>(['dated']);
  const [reliance, setReliance] = useState<'low' | 'medium' | 'high'>('medium');

  const gate = useLeadGate({
    toolName: 'Patch or Rebuild Calculator',
    pageName: 'Free Tools - Maintenance vs Rebuild',
    toolPath: '/free-tools/maintenance-vs-rebuild',
  });

  const { score, verdict, rebuildLow, rebuildHigh, reasons } = useMemo(() => {
    const issueScore = ISSUES.filter((i) => issues.includes(i.id)).reduce((a, i) => a + i.weight, 0);
    const ageScore = Math.min(age, 8) * 5; // older = more rebuild pressure
    const relianceScore = reliance === 'high' ? 18 : reliance === 'medium' ? 10 : 4;
    const s = Math.min(100, issueScore + ageScore + relianceScore);
    const v = s >= 65 ? 'Rebuild' : s >= 40 ? 'Plan a rebuild soon' : 'Maintain & improve';
    const base = reliance === 'high' ? 140000 : reliance === 'medium' ? 90000 : 55000;
    const chosen = ISSUES.filter((i) => issues.includes(i.id));
    return {
      score: s,
      verdict: v,
      rebuildLow: base * 0.85,
      rebuildHigh: base * 1.5,
      reasons: chosen,
    };
  }, [age, issues, reliance]);

  function toggle(id: string) {
    setIssues((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function buildResult(): string {
    const relianceLabel = reliance === 'low' ? 'Nice to have' : reliance === 'medium' ? 'Important' : 'Business-critical';
    return [
      'Patch or Rebuild — Recommendation',
      '',
      `Current site age: ${age} year${age === 1 ? '' : 's'}`,
      `Issues: ${reasons.length ? reasons.map((r) => r.label).join(', ') : 'none selected'}`,
      `Business reliance: ${relianceLabel}`,
      '',
      `VERDICT: ${verdict}`,
      `Rebuild-pressure score: ${score}/100`,
      '',
      `Estimated rebuild budget (if you go that route): ${inr(rebuildLow)} – ${inr(rebuildHigh)}`,
      '',
      'Want a proper assessment of your site? Book a free 15-min call: https://marketingmojito.com/contact-us',
    ].join('\n');
  }

  return (
    <PageShell>
      <ToolShell
        eyebrow="Free Tool"
        title="Patch or Rebuild?"
        lede="Pouring money into an aging website can cost more than starting fresh. Answer a few questions and get a clear verdict — plus a realistic rebuild budget if that's the smarter move."
      >
        <div className="tk-layout">
          <div className="tk-panel">
            <h2>Tell us about your site</h2>

            <div className="tk-field">
              <label className="tk-label" htmlFor="age">How old is the current site? {age} year{age === 1 ? '' : 's'}</label>
              <input id="age" className="tk-range" type="range" min={0} max={10} value={age} onChange={(e) => setAge(Number(e.target.value))} />
            </div>

            <div className="tk-field">
              <span className="tk-label">What&apos;s frustrating you? (pick all that apply)</span>
              <div className="tk-chips">
                {ISSUES.map((i) => (
                  <span key={i.id} className="tk-chip" data-on={issues.includes(i.id) ? '1' : '0'} onClick={() => toggle(i.id)}>{i.label}</span>
                ))}
              </div>
            </div>

            <div className="tk-field">
              <span className="tk-label">How much does your business rely on the site?</span>
              <div className="tk-seg">
                {(['low', 'medium', 'high'] as const).map((r) => (
                  <button key={r} type="button" data-on={reliance === r ? '1' : '0'} onClick={() => setReliance(r)}>
                    {r === 'low' ? 'Nice to have' : r === 'medium' ? 'Important' : 'Business-critical'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {gate.submitted ? (
            <ToolSuccess email={gate.submittedEmail} />
          ) : (
            <div className="tk-result">
              <div className="tk-result-label">Your recommendation</div>
              <div className="tk-result-big" style={{ fontSize: '1.4rem' }}>Emailed to you, free</div>
              <p className="tk-result-note">
                Answer the questions on the left, then enter your details. We&apos;ll email you the
                verdict, the reasoning, and a realistic rebuild budget if that&apos;s the smarter move.
              </p>
              <button className="tk-btn" onClick={gate.requestUnlock}>
                Email me the verdict
              </button>
            </div>
          )}
        </div>
      </ToolShell>

      <LeadGate
        open={gate.open}
        onClose={() => gate.setOpen(false)}
        onSubmit={(n, e, c) => gate.submit(n, e, c, { resultDetails: buildResult() })}
        heading="Where should we send your recommendation?"
        blurb="Enter your details and we'll email you the verdict, the reasoning, and a realistic rebuild budget."
      />
    </PageShell>
  );
}

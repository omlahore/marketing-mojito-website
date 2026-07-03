'use client';

import { useMemo, useState } from 'react';
import PageShell from '@/components/PageShell';
import { ToolShell, LeadGate, useLeadGate, ToolSuccess } from '@/components/ToolKit';

type VType = 'explainer' | 'social' | 'product' | 'brand' | 'event' | 'ad';
const TYPES: { id: VType; label: string; base: number }[] = [
  { id: 'social', label: 'Social reel / short', base: 18000 },
  { id: 'explainer', label: 'Explainer / talking-head', base: 35000 },
  { id: 'product', label: 'Product video', base: 55000 },
  { id: 'brand', label: 'Brand film', base: 110000 },
  { id: 'event', label: 'Event coverage', base: 60000 },
  { id: 'ad', label: 'TV / commercial ad', base: 180000 },
];

const CREW = [
  { id: 'solo', label: 'Solo shooter', mult: 1 },
  { id: 'small', label: 'Small crew', mult: 1.5 },
  { id: 'full', label: 'Full crew', mult: 2.2 },
] as const;

const POST: { id: string; label: string; cost: number }[] = [
  { id: 'edit', label: 'Editing', cost: 12000 },
  { id: 'color', label: 'Color grade', cost: 9000 },
  { id: 'motion', label: 'Motion graphics', cost: 18000 },
  { id: 'sound', label: 'Sound design / mix', cost: 8000 },
  { id: 'subs', label: 'Subtitles / captions', cost: 4000 },
  { id: 'script', label: 'Scriptwriting', cost: 10000 },
];

function inr(n: number) {
  return '\u20B9' + Math.round(n).toLocaleString('en-IN');
}

export default function VideoProductionCostEstimator() {
  const [type, setType] = useState<VType>('explainer');
  const [minutes, setMinutes] = useState(2);
  const [crew, setCrew] = useState<(typeof CREW)[number]['id']>('small');
  const [post, setPost] = useState<string[]>(['edit', 'color']);
  const [deliverables, setDeliverables] = useState(1);

  const gate = useLeadGate({
    toolName: 'Video Production Cost Estimator',
    pageName: 'Free Tools - Video Production Cost Estimator',
    toolPath: '/free-tools/video-production-cost-estimator',
  });

  const calc = useMemo(() => {
    const t = TYPES.find((x) => x.id === type)!;
    const lengthMult = 0.7 + minutes * 0.35;
    const crewMult = CREW.find((c) => c.id === crew)!.mult;
    const shoot = t.base * lengthMult * crewMult;
    const postCost = POST.filter((p) => post.includes(p.id)).reduce((a, p) => a + p.cost, 0) * (0.8 + minutes * 0.15);
    const delivMult = 1 + Math.max(0, deliverables - 1) * 0.35;
    const subtotal = (shoot + postCost) * delivMult;
    return { shoot, postCost: postCost * delivMult, low: subtotal * 0.85, high: subtotal * 1.3 };
  }, [type, minutes, crew, post, deliverables]);

  function togglePost(id: string) {
    setPost((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function buildResult(): string {
    const typeLabel = TYPES.find((x) => x.id === type)!.label;
    const crewLabel = CREW.find((c) => c.id === crew)!.label;
    const postLabels = POST.filter((p) => post.includes(p.id)).map((p) => p.label);
    return [
      'Video Production Cost Estimate',
      '',
      `Video type: ${typeLabel}`,
      `Length: ${minutes} min`,
      `Crew: ${crewLabel}`,
      `Post-production: ${postLabels.length ? postLabels.join(', ') : 'none selected'}`,
      `Deliverables / cut-downs: ${deliverables}`,
      '',
      `ESTIMATED COST: ${inr(calc.low)} – ${inr(calc.high)}`,
      '',
      'Breakdown:',
      `  Shoot (crew + length): ${inr(calc.shoot)}`,
      `  Post-production: ${inr(calc.postCost)}`,
      '',
      'Indicative range for India-based production. Final quote depends on concept and locations.',
      'Want a firm quote and a creative concept? Book a free 15-min call: https://marketingmojito.com/contact-us',
    ].join('\n');
  }

  return (
    <PageShell>
      <ToolShell
        eyebrow="Free Tool"
        title="Video Production Cost Estimator"
        lede="Planning a video? Get an honest ballpark before you brief agencies. Choose your type, length, crew, and post-production for a realistic price range based on real production costs in India."
      >
        <div className="tk-layout">
          <div className="tk-panel">
            <h2>Spec your video</h2>

            <div className="tk-field">
              <span className="tk-label">Video type</span>
              <div className="tk-seg">
                {TYPES.map((t) => (
                  <button key={t.id} type="button" data-on={type === t.id ? '1' : '0'} onClick={() => setType(t.id)}>{t.label}</button>
                ))}
              </div>
            </div>

            <div className="tk-field">
              <label className="tk-label" htmlFor="mins">Length: {minutes} min</label>
              <input id="mins" className="tk-range" type="range" min={1} max={15} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
            </div>

            <div className="tk-field">
              <span className="tk-label">Crew level</span>
              <div className="tk-seg">
                {CREW.map((c) => (
                  <button key={c.id} type="button" data-on={crew === c.id ? '1' : '0'} onClick={() => setCrew(c.id)}>{c.label}</button>
                ))}
              </div>
            </div>

            <div className="tk-field">
              <span className="tk-label">Post-production</span>
              <div className="tk-chips">
                {POST.map((p) => (
                  <span key={p.id} className="tk-chip" data-on={post.includes(p.id) ? '1' : '0'} onClick={() => togglePost(p.id)}>{p.label}</span>
                ))}
              </div>
            </div>

            <div className="tk-field">
              <label className="tk-label" htmlFor="deliv">Deliverables / cut-downs: {deliverables}</label>
              <input id="deliv" className="tk-range" type="range" min={1} max={10} value={deliverables} onChange={(e) => setDeliverables(Number(e.target.value))} />
            </div>
          </div>

          {gate.submitted ? (
            <ToolSuccess email={gate.submittedEmail} />
          ) : (
            <div className="tk-result">
              <div className="tk-result-label">Your estimate</div>
              <div className="tk-result-big" style={{ fontSize: '1.4rem' }}>Emailed to you, free</div>
              <p className="tk-result-note">
                Spec your video on the left, then enter your details. We&apos;ll email you the full
                cost range with the shoot and post-production breakdown.
              </p>
              <button className="tk-btn" onClick={gate.requestUnlock}>Email me my estimate</button>
            </div>
          )}
        </div>
      </ToolShell>

      <LeadGate
        open={gate.open}
        onClose={() => gate.setOpen(false)}
        onSubmit={(n, e, c) => gate.submit(n, e, c, { resultDetails: buildResult() })}
        heading="Where should we send your estimate?"
        blurb="Enter your details and we'll email you the full cost range with the shoot and post-production breakdown."
      />
    </PageShell>
  );
}

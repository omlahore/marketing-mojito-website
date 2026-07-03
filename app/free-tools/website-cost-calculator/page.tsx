'use client';

import { useMemo, useState } from 'react';
import PageShell from '@/components/PageShell';
import { ToolShell, LeadGate, useLeadGate, ToolSuccess } from '@/components/ToolKit';

type SiteType = 'landing' | 'business' | 'ecommerce' | 'webapp';

const SITE_TYPES: { id: SiteType; label: string; base: number }[] = [
  { id: 'landing', label: 'Landing page', base: 25000 },
  { id: 'business', label: 'Business / multi-page', base: 60000 },
  { id: 'ecommerce', label: 'E-commerce store', base: 120000 },
  { id: 'webapp', label: 'Custom web app', base: 250000 },
];

const FEATURES: { id: string; label: string; cost: number }[] = [
  { id: 'cms', label: 'CMS / blog', cost: 20000 },
  { id: 'seo', label: 'SEO setup', cost: 18000 },
  { id: 'multilingual', label: 'Multilingual', cost: 25000 },
  { id: 'payments', label: 'Payments / checkout', cost: 35000 },
  { id: 'booking', label: 'Booking / scheduling', cost: 28000 },
  { id: 'customdesign', label: 'Custom design', cost: 40000 },
  { id: 'animation', label: 'Animations / motion', cost: 30000 },
  { id: 'integrations', label: 'CRM / API integrations', cost: 32000 },
];

const DESIGN_LEVELS = [
  { id: 'template', label: 'Template-based', mult: 1 },
  { id: 'semicustom', label: 'Semi-custom', mult: 1.4 },
  { id: 'bespoke', label: 'Fully bespoke', mult: 1.9 },
] as const;

function inr(n: number) {
  return '\u20B9' + Math.round(n).toLocaleString('en-IN');
}

export default function WebsiteCostCalculator() {
  const [type, setType] = useState<SiteType>('business');
  const [pages, setPages] = useState(8);
  const [features, setFeatures] = useState<string[]>(['cms', 'seo']);
  const [design, setDesign] = useState<(typeof DESIGN_LEVELS)[number]['id']>('semicustom');

  const gate = useLeadGate({
    toolName: 'Website Cost Calculator',
    pageName: 'Free Tools - Website Cost Calculator',
    toolPath: '/free-tools/website-cost-calculator',
  });

  const calc = useMemo(() => {
    const t = SITE_TYPES.find((s) => s.id === type)!;
    const pageCost = Math.max(0, pages - 1) * 4500;
    const featureCost = FEATURES.filter((f) => features.includes(f.id)).reduce((a, f) => a + f.cost, 0);
    const mult = DESIGN_LEVELS.find((d) => d.id === design)!.mult;
    const subtotal = (t.base + pageCost + featureCost) * mult;
    return {
      base: t.base,
      pageCost,
      featureCost: featureCost * mult,
      designUplift: (t.base + pageCost + featureCost) * (mult - 1),
      low: subtotal * 0.85,
      high: subtotal * 1.25,
    };
  }, [type, pages, features, design]);

  function toggleFeature(id: string) {
    setFeatures((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function buildResult(): string {
    const typeLabel = SITE_TYPES.find((s) => s.id === type)!.label;
    const featLabels = FEATURES.filter((f) => features.includes(f.id)).map((f) => f.label);
    const designLabel = DESIGN_LEVELS.find((d) => d.id === design)!.label;
    return [
      'Website Cost Estimate',
      '',
      `Project type: ${typeLabel}`,
      `Pages: ${pages}`,
      `Features: ${featLabels.length ? featLabels.join(', ') : 'none selected'}`,
      `Design level: ${designLabel}`,
      '',
      `ESTIMATED COST: ${inr(calc.low)} – ${inr(calc.high)}`,
      '',
      'Breakdown:',
      `  Base (${typeLabel}): ${inr(calc.base)}`,
      `  Additional pages: ${inr(calc.pageCost)}`,
      `  Features: ${inr(calc.featureCost)}`,
      `  Design uplift: ${inr(calc.designUplift)}`,
      '',
      'This is an indicative range for India-based delivery. Final quote depends on scope and content.',
      'Want a firm quote? Book a free 15-min call: https://marketingmojito.com/contact-us',
    ].join('\n');
  }

  return (
    <PageShell>
      <ToolShell
        eyebrow="Free Tool"
        title="Website Cost Calculator"
        lede="Get an honest ballpark for a new website or store in seconds. Pick your type, pages, and features — we'll show a realistic price range based on real project data, not a lowball teaser."
      >
        <div className="tk-layout">
          <div className="tk-panel">
            <h2>Build your estimate</h2>

            <div className="tk-field">
              <span className="tk-label">What are you building?</span>
              <div className="tk-seg">
                {SITE_TYPES.map((s) => (
                  <button key={s.id} type="button" data-on={type === s.id ? '1' : '0'} onClick={() => setType(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="tk-field">
              <label className="tk-label" htmlFor="pages">Number of pages: {pages}</label>
              <input id="pages" className="tk-range" type="range" min={1} max={40} value={pages} onChange={(e) => setPages(Number(e.target.value))} />
            </div>

            <div className="tk-field">
              <span className="tk-label">Features you need</span>
              <div className="tk-chips">
                {FEATURES.map((f) => (
                  <span key={f.id} className="tk-chip" data-on={features.includes(f.id) ? '1' : '0'} onClick={() => toggleFeature(f.id)}>
                    {f.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="tk-field">
              <span className="tk-label">Design level</span>
              <div className="tk-seg">
                {DESIGN_LEVELS.map((d) => (
                  <button key={d.id} type="button" data-on={design === d.id ? '1' : '0'} onClick={() => setDesign(d.id)}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {gate.submitted ? (
            <ToolSuccess email={gate.submittedEmail} />
          ) : (
            <div className="tk-result">
              <div className="tk-result-label">Your estimate</div>
              <div className="tk-result-big" style={{ fontSize: '1.4rem' }}>Emailed to you, free</div>
              <p className="tk-result-note">
                Adjust the options on the left, then enter your details. We&apos;ll email you the full
                line-by-line cost estimate — yours to keep and share with your team.
              </p>
              <button className="tk-btn" onClick={gate.requestUnlock}>
                Email me my estimate
              </button>
            </div>
          )}
        </div>
      </ToolShell>

      <LeadGate
        open={gate.open}
        onClose={() => gate.setOpen(false)}
        onSubmit={(n, e, c) => gate.submit(n, e, c, { resultDetails: buildResult() })}
        heading="Where should we send your estimate?"
        blurb="Enter your details and we'll email you the full line-by-line cost breakdown for the options you selected."
      />
    </PageShell>
  );
}

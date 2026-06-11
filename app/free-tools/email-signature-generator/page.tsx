'use client';

import PageShell from '@/components/PageShell';
import type { CSSProperties, DragEvent, FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSignatureHtml,
  type FontSizeKey,
  type SignatureFormState,
  type TemplateId,
} from './signature-html';

const BRAND_GREEN = '#82c341';
const BRAND_DARK = '#1b0009';
const BRAND_ACCENT = '#053a0c';

const STEPS = ['Details', 'Images', 'Templates', 'Styles'] as const;

const FONT_OPTIONS = ['Arial', 'Helvetica', 'Georgia', 'Verdana', 'Trebuchet MS', 'Courier New'] as const;

const IMG_MAX = 150;

const SIG_GEN_LEAD_STORAGE_KEY = 'sig-gen-lead';

/**
 * Copies signature HTML so pasting into Gmail/Outlook yields rendered content, not raw tags.
 * Primary: ClipboardItem with text/html + text/plain. Fallback: select rendered DOM + execCommand.
 */
async function copySignatureToClipboard(html: string): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  try {
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([html], { type: 'text/plain' });
    const item = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob,
    });
    await navigator.clipboard.write([item]);
    return true;
  } catch {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      selection?.removeAllRanges();
      document.body.removeChild(tempDiv);
    }
  }
}

function SectionDividerLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#888',
        margin: '4px 0 0',
        padding: '0 0 10px',
        borderBottom: '1px solid #eee',
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  );
}

function UploadIcon() {
  return (
    <svg width={44} height={44} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: '#999' }}>
      <path
        d="M12 16V7M8 11l4-4 4 4M5 20h14a1 1 0 001-1v-3"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageDropZone({
  label,
  previewUrl,
  inputId,
  onPick,
  onRemove,
}: {
  label: string;
  previewUrl: string | null;
  inputId: string;
  onPick: (file: File | null) => void;
  onRemove: () => void;
}) {
  const preventNav = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: DragEvent) => {
    preventNav(e);
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith('image/')) onPick(f);
  };

  return (
    <div
      style={{
        border: '2px dashed #ccc',
        borderRadius: 12,
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: previewUrl ? '#fff' : '#fafafa',
        overflow: 'hidden',
      }}
      onDragEnter={preventNav}
      onDragOver={preventNav}
      onDrop={onDrop}
    >
      <input
        id={inputId}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt=""
            style={{
              maxWidth: '100%',
              maxHeight: 220,
              objectFit: 'contain',
              display: 'block',
              padding: 12,
            }}
          />
          <button
            type="button"
            className="w-button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 8,
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              color: BRAND_DARK,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            Remove
          </button>
        </>
      ) : (
        <label
          htmlFor={inputId}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <UploadIcon />
          <span style={{ fontSize: 14, fontWeight: 600, color: BRAND_DARK }}>{label}</span>
          <span style={{ fontSize: 13, color: '#666' }}>Click or drag to upload</span>
        </label>
      )}
    </div>
  );
}

const sigGenScopedCss = `
.sig-gen-step1-grid,
.sig-gen-step2-uploads,
.sig-gen-social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.sig-gen-full-row {
  grid-column: 1 / -1;
}
.sig-gen-input,
.sig-gen-field input.sig-gen-input,
.sig-gen-field select.sig-gen-input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 10px 12px !important;
}
.sig-gen-input:focus,
.sig-gen-field input.sig-gen-input:focus,
.sig-gen-field select.sig-gen-input:focus {
  outline: none !important;
  border-color: #82c341 !important;
  box-shadow: 0 0 0 2px rgba(130, 195, 65, 0.28) !important;
}
@media (max-width: 767px) {
  .sig-gen-step1-grid,
  .sig-gen-step2-uploads,
  .sig-gen-social-grid {
    grid-template-columns: 1fr;
  }
}
@keyframes sig-gen-toast-in {
  from { opacity: 0; transform: translate(-50%, 12px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes sig-gen-toast-out {
  from { opacity: 1; transform: translate(-50%, 0); }
  to { opacity: 0; transform: translate(-50%, 8px); }
}
.sig-gen-toast {
  animation: sig-gen-toast-in 0.25s ease-out forwards;
}
.sig-gen-toast.sig-gen-toast--leaving {
  animation: sig-gen-toast-out 0.35s ease-in forwards;
}
`;

function initialFormState(): SignatureFormState {
  return {
    fullName: '',
    jobTitle: '',
    department: '',
    companyName: '',
    email: '',
    phone: '',
    mobilePhone: '',
    website: '',
    address: '',
    profilePhoto: null,
    companyLogo: null,
    linkedin: '',
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: '',
    template: 'classic',
    themeColor: BRAND_GREEN,
    textColor: BRAND_DARK,
    linkColor: BRAND_ACCENT,
    fontFamily: 'Arial',
    fontSize: 'medium',
  };
}

async function fileToResizedDataUrl(file: File, maxSide: number): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Image load failed'));
    el.src = dataUrl;
  });

  let w = img.naturalWidth;
  let h = img.naturalHeight;
  const scale = Math.min(maxSide / w, maxSide / h, 1);
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.88);
}

function TemplateMiniPreview({ templateId }: { templateId: TemplateId }) {
  const box: CSSProperties = {
    height: 100,
    borderRadius: 8,
    background: '#f6f6f6',
    border: '1px solid #e8e8e8',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  };
  const dot = { width: 22, height: 22, borderRadius: 4, background: '#ddd', flexShrink: 0 };
  const line = (w: string) => (
    <div style={{ height: 6, borderRadius: 3, background: '#ccc', width: w, marginBottom: 6 }} />
  );
  const accent = { height: 5, background: BRAND_GREEN, borderRadius: 2, marginBottom: 8 };

  if (templateId === 'classic') {
    return (
      <div style={{ ...box, flexDirection: 'row' }}>
        <div style={dot} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 10, width: '70%', background: BRAND_GREEN, borderRadius: 2, marginBottom: 8 }} />
          {line('90%')}
          {line('60%')}
        </div>
      </div>
    );
  }
  if (templateId === 'modern') {
    return (
      <div style={{ ...box, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 14, background: '#bbb', borderRadius: 4, marginBottom: 8 }} />
        <div style={dot} />
        <div style={{ height: 10, width: '55%', background: BRAND_GREEN, borderRadius: 2, marginTop: 8 }} />
        {line('50%')}
      </div>
    );
  }
  if (templateId === 'minimal') {
    return (
      <div style={{ ...box, flexDirection: 'column', borderTop: `3px solid ${BRAND_GREEN}`, borderBottom: `3px solid ${BRAND_GREEN}` }}>
        <div style={{ height: 10, width: '45%', background: BRAND_DARK, borderRadius: 2, marginBottom: 8 }} />
        {line('80%')}
        {line('40%')}
      </div>
    );
  }
  return (
    <div style={{ ...box, flexDirection: 'column', padding: 0, paddingTop: 0 }}>
      <div style={accent} />
      <div style={{ padding: 10, display: 'flex', gap: 8 }}>
        <div style={dot} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, width: '75%', background: BRAND_GREEN, borderRadius: 2, marginBottom: 8 }} />
          {line('70%')}
        </div>
      </div>
    </div>
  );
}

export default function EmailSignatureGeneratorPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<SignatureFormState>(initialFormState);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [exportHtml, setExportHtml] = useState('');
  const [toast, setToast] = useState<{ id: number; text: string; leaving: boolean } | null>(null);
  const toastSeq = useRef(0);

  const previewHtml = useMemo(() => buildSignatureHtml(state), [state]);

  const update = useCallback(<K extends keyof SignatureFormState>(key: K, value: SignatureFormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  }, []);

  const setImageField = useCallback(async (key: 'profilePhoto' | 'companyLogo', file: File | null) => {
    if (!file) {
      update(key, null);
      return;
    }
    if (!file.type.startsWith('image/')) return;
    try {
      const dataUrl = await fileToResizedDataUrl(file, IMG_MAX);
      update(key, dataUrl);
    } catch {
      update(key, null);
    }
  }, [update]);

  const clearAll = useCallback(() => {
    setState(initialFormState());
  }, []);

  const openExport = useCallback(() => {
    setExportHtml(buildSignatureHtml(state));
    setModalOpen(true);
  }, [state]);

  const openLeadGateOrExport = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem(SIG_GEN_LEAD_STORAGE_KEY) === '1') {
        openExport();
        return;
      }
    } catch {
      /* private mode */
    }
    setLeadName(state.fullName);
    setLeadEmail(state.email);
    setLeadCompany(state.companyName);
    setLeadGateOpen(true);
  }, [state, openExport]);

  const submitLeadGate = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const name = leadName.trim();
      const email = leadEmail.trim();
      if (!name || !email) return;

      try {
        sessionStorage.setItem(SIG_GEN_LEAD_STORAGE_KEY, '1');
      } catch {
        /* private mode */
      }

      void fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company: leadCompany.trim(),
          pdfName: 'Email Signature Generator',
          pageName: 'Free Tools - Email Signature Generator',
          tool_link: 'https://marketingmojito.com/free-tools/email-signature-generator',
          _loaded: Date.now() - 3000,
        }),
      });

      setLeadGateOpen(false);
      setExportHtml(buildSignatureHtml(state));
      setModalOpen(true);
    },
    [leadName, leadEmail, leadCompany, state]
  );

  const closeLeadGate = useCallback(() => {
    setLeadGateOpen(false);
  }, []);

  const showToast = useCallback((text: string) => {
    toastSeq.current += 1;
    setToast({ id: toastSeq.current, text, leaving: false });
  }, []);

  const copyHtml = useCallback(() => {
    const html = buildSignatureHtml(state);
    void (async () => {
      const ok = await copySignatureToClipboard(html);
      if (ok) {
        showToast('Copied to clipboard!');
      } else {
        showToast('Could not copy. Check permissions or try HTTPS / localhost.');
      }
    })();
  }, [state, showToast]);

  useEffect(() => {
    if (!toast || toast.leaving) return;
    const id = toast.id;
    const leaveT = window.setTimeout(() => {
      setToast((t) => (t && t.id === id ? { ...t, leaving: true } : t));
    }, 2600);
    return () => window.clearTimeout(leaveT);
  }, [toast?.id]);

  useEffect(() => {
    if (!toast || !toast.leaving) return;
    const id = toast.id;
    const removeT = window.setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, 400);
    return () => window.clearTimeout(removeT);
  }, [toast?.leaving, toast?.id]);

  useEffect(() => {
    if (!leadGateOpen && !modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (leadGateOpen) {
        closeLeadGate();
        return;
      }
      if (modalOpen) setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [leadGateOpen, modalOpen, closeLeadGate]);

  const templates: { id: TemplateId; title: string; blurb: string }[] = [
    { id: 'classic', title: 'Classic', blurb: 'Horizontal layout — photo left, details right.' },
    { id: 'modern', title: 'Modern', blurb: 'Centered logo, circular photo, bold name.' },
    { id: 'minimal', title: 'Minimal', blurb: 'Text only with subtle divider lines.' },
    { id: 'bold', title: 'Bold', blurb: 'Accent bar, large name, compact details.' },
  ];

  return (
    <PageShell>
      <style>{sigGenScopedCss}</style>
      <div className="q">
        <section className="section-brand" style={{ background: '#fff' }}>
          <div className="padding-global padding-section-small">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="heading-wrapper" style={{ marginBottom: 24 }}>
                <div className="heading-wrap-inner">
                  <h1 className="main-heading-style-h3" style={{ color: BRAND_DARK }}>
                    Email Signature Generator
                  </h1>
                  <p className="main-heading-para">
                    Build an HTML signature with optional fields, images, and layouts — then copy the inline HTML into your email client.
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <nav
                aria-label="Progress"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 28,
                  justifyContent: 'space-between',
                }}
              >
                {STEPS.map((label, i) => {
                  const active = i === step;
                  const done = i < step;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setStep(i)}
                      className="w-button"
                      style={{
                        flex: '1 1 120px',
                        minWidth: 100,
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: `2px solid ${active ? BRAND_GREEN : '#e0e0e0'}`,
                        background: active ? `${BRAND_GREEN}18` : '#fafafa',
                        color: BRAND_DARK,
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 14,
                        boxShadow: active ? `0 0 0 1px ${BRAND_GREEN}` : 'none',
                      }}
                    >
                      <span style={{ color: BRAND_ACCENT, fontSize: 12, display: 'block' }}>{done ? '✓ ' : ''}Step {i + 1}</span>
                      {label}
                    </button>
                  );
                })}
              </nav>

              <div className="columns-11 w-row">
                {/* Form column */}
                <div className="column-15 _1 w-col w-col-12 w-col-stack w-col-medium-6">
                  <div
                    style={{
                      background: '#fafafa',
                      border: `1px solid #eee`,
                      borderRadius: 16,
                      padding: '24px 20px',
                      marginBottom: 24,
                    }}
                  >
                    {step === 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <SectionDividerLabel>Personal Information</SectionDividerLabel>
                        <div className="sig-gen-step1-grid">
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="fullName" style={{ color: BRAND_DARK }}>
                              Full Name
                            </label>
                            <input
                              id="fullName"
                              className="w-input text-field sig-gen-input"
                              type="text"
                              value={state.fullName}
                              onChange={(e) => update('fullName', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="jobTitle" style={{ color: BRAND_DARK }}>
                              Job Title
                            </label>
                            <input
                              id="jobTitle"
                              className="w-input text-field sig-gen-input"
                              type="text"
                              value={state.jobTitle}
                              onChange={(e) => update('jobTitle', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="department" style={{ color: BRAND_DARK }}>
                              Department
                            </label>
                            <input
                              id="department"
                              className="w-input text-field sig-gen-input"
                              type="text"
                              value={state.department}
                              onChange={(e) => update('department', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="companyName" style={{ color: BRAND_DARK }}>
                              Company Name
                            </label>
                            <input
                              id="companyName"
                              className="w-input text-field sig-gen-input"
                              type="text"
                              value={state.companyName}
                              onChange={(e) => update('companyName', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <SectionDividerLabel>Contact Details</SectionDividerLabel>
                        <div className="sig-gen-step1-grid">
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="email" style={{ color: BRAND_DARK }}>
                              Email
                            </label>
                            <input
                              id="email"
                              className="w-input text-field sig-gen-input"
                              type="email"
                              value={state.email}
                              onChange={(e) => update('email', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="phone" style={{ color: BRAND_DARK }}>
                              Phone
                            </label>
                            <input
                              id="phone"
                              className="w-input text-field sig-gen-input"
                              type="tel"
                              value={state.phone}
                              onChange={(e) => update('phone', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="mobilePhone" style={{ color: BRAND_DARK }}>
                              Mobile / secondary phone
                            </label>
                            <input
                              id="mobilePhone"
                              className="w-input text-field sig-gen-input"
                              type="tel"
                              value={state.mobilePhone}
                              onChange={(e) => update('mobilePhone', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                          <div className="sig-gen-field">
                            <label className="field-label" htmlFor="website" style={{ color: BRAND_DARK }}>
                              Website URL
                            </label>
                            <input
                              id="website"
                              className="w-input text-field sig-gen-input"
                              type="text"
                              value={state.website}
                              onChange={(e) => update('website', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                          <div className="sig-gen-field sig-gen-full-row">
                            <label className="field-label" htmlFor="address" style={{ color: BRAND_DARK }}>
                              Address
                            </label>
                            <input
                              id="address"
                              className="w-input text-field sig-gen-input"
                              type="text"
                              value={state.address}
                              onChange={(e) => update('address', e.target.value)}
                              placeholder="Optional"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="sig-gen-step2-uploads">
                          <div>
                            <p className="field-label" style={{ color: BRAND_DARK, marginBottom: 8 }}>
                              Profile photo
                              <span style={{ fontWeight: 400, color: '#666', fontSize: 12 }}>
                                {' '}
                                (max {IMG_MAX}×{IMG_MAX}px in signature)
                              </span>
                            </p>
                            <ImageDropZone
                              label="Profile photo"
                              previewUrl={state.profilePhoto}
                              inputId="sig-profile-upload"
                              onPick={(f) => void setImageField('profilePhoto', f)}
                              onRemove={() => update('profilePhoto', null)}
                            />
                          </div>
                          <div>
                            <p className="field-label" style={{ color: BRAND_DARK, marginBottom: 8 }}>
                              Company logo
                            </p>
                            <ImageDropZone
                              label="Company logo"
                              previewUrl={state.companyLogo}
                              inputId="sig-logo-upload"
                              onPick={(f) => void setImageField('companyLogo', f)}
                              onRemove={() => update('companyLogo', null)}
                            />
                          </div>
                        </div>

                        <div>
                          <SectionDividerLabel>Social Profiles</SectionDividerLabel>
                          <p style={{ fontSize: 13, color: '#666', margin: '-4px 0 12px' }}>
                            Icons appear in the signature when a URL is provided.
                          </p>
                          <div className="sig-gen-social-grid">
                            <div className="sig-gen-field">
                              <label className="field-label" htmlFor="linkedin" style={{ fontSize: 13 }}>
                                LinkedIn URL
                              </label>
                              <input
                                id="linkedin"
                                className="w-input text-field sig-gen-input"
                                type="url"
                                placeholder="https://"
                                value={state.linkedin}
                                onChange={(e) => update('linkedin', e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                            <div className="sig-gen-field">
                              <label className="field-label" htmlFor="instagram" style={{ fontSize: 13 }}>
                                Instagram URL
                              </label>
                              <input
                                id="instagram"
                                className="w-input text-field sig-gen-input"
                                type="url"
                                placeholder="https://"
                                value={state.instagram}
                                onChange={(e) => update('instagram', e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                            <div className="sig-gen-field">
                              <label className="field-label" htmlFor="twitter" style={{ fontSize: 13 }}>
                                Twitter / X URL
                              </label>
                              <input
                                id="twitter"
                                className="w-input text-field sig-gen-input"
                                type="url"
                                placeholder="https://"
                                value={state.twitter}
                                onChange={(e) => update('twitter', e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                            <div className="sig-gen-field">
                              <label className="field-label" htmlFor="facebook" style={{ fontSize: 13 }}>
                                Facebook URL
                              </label>
                              <input
                                id="facebook"
                                className="w-input text-field sig-gen-input"
                                type="url"
                                placeholder="https://"
                                value={state.facebook}
                                onChange={(e) => update('facebook', e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                            <div className="sig-gen-field sig-gen-full-row">
                              <label className="field-label" htmlFor="youtube" style={{ fontSize: 13 }}>
                                YouTube URL
                              </label>
                              <input
                                id="youtube"
                                className="w-input text-field sig-gen-input"
                                type="url"
                                placeholder="https://"
                                value={state.youtube}
                                onChange={(e) => update('youtube', e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: 16,
                        }}
                      >
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => update('template', t.id)}
                            className="w-button"
                            style={{
                              textAlign: 'left',
                              padding: 14,
                              borderRadius: 12,
                              border: `3px solid ${state.template === t.id ? BRAND_GREEN : '#e5e5e5'}`,
                              background: '#fff',
                              cursor: 'pointer',
                              color: BRAND_DARK,
                              fontFamily: 'inherit',
                              boxShadow: state.template === t.id ? `0 4px 14px ${BRAND_GREEN}33` : 'none',
                            }}
                          >
                            <TemplateMiniPreview templateId={t.id} />
                            <p style={{ margin: '12px 0 4px', fontWeight: 700, fontSize: 16 }}>{t.title}</p>
                            <p style={{ margin: 0, fontSize: 13, opacity: 0.85, lineHeight: 1.4 }}>{t.blurb}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 3 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                          <div>
                            <label className="field-label">Theme color (accents &amp; name)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                              <input
                                type="color"
                                value={state.themeColor}
                                onChange={(e) => update('themeColor', e.target.value)}
                                aria-label="Theme color swatch"
                                style={{ width: 48, height: 40, border: 'none', cursor: 'pointer', padding: 0 }}
                              />
                              <input
                                className="w-input text-field"
                                style={{ maxWidth: 120 }}
                                value={state.themeColor}
                                onChange={(e) => update('themeColor', e.target.value)}
                                placeholder="#82c341"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="field-label">Text color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                              <input
                                type="color"
                                value={state.textColor}
                                onChange={(e) => update('textColor', e.target.value)}
                                aria-label="Text color swatch"
                                style={{ width: 48, height: 40, border: 'none', cursor: 'pointer', padding: 0 }}
                              />
                              <input
                                className="w-input text-field"
                                style={{ maxWidth: 120 }}
                                value={state.textColor}
                                onChange={(e) => update('textColor', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="field-label">Link color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                              <input
                                type="color"
                                value={state.linkColor}
                                onChange={(e) => update('linkColor', e.target.value)}
                                aria-label="Link color swatch"
                                style={{ width: 48, height: 40, border: 'none', cursor: 'pointer', padding: 0 }}
                              />
                              <input
                                className="w-input text-field"
                                style={{ maxWidth: 120 }}
                                value={state.linkColor}
                                onChange={(e) => update('linkColor', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="field-label" htmlFor="fontFamily">
                            Font family
                          </label>
                          <select
                            id="fontFamily"
                            className="w-input text-field"
                            value={state.fontFamily}
                            onChange={(e) => update('fontFamily', e.target.value)}
                          >
                            {FONT_OPTIONS.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>

                        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                          <legend className="field-label" style={{ marginBottom: 8 }}>
                            Font size
                          </legend>
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {(['small', 'medium', 'large'] as FontSizeKey[]).map((sz) => (
                              <label key={sz} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  name="fontSize"
                                  checked={state.fontSize === sz}
                                  onChange={() => update('fontSize', sz)}
                                />
                                <span style={{ textTransform: 'capitalize' }}>{sz}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        marginTop: 28,
                        paddingTop: 20,
                        borderTop: '1px solid #e5e5e5',
                      }}
                    >
                      <button
                        type="button"
                        className="w-button"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        style={{
                          padding: '12px 22px',
                          borderRadius: 999,
                          border: `2px solid ${BRAND_DARK}`,
                          background: '#fff',
                          color: BRAND_DARK,
                          fontWeight: 600,
                          opacity: step === 0 ? 0.45 : 1,
                          cursor: step === 0 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="w-button"
                        onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                        disabled={step === STEPS.length - 1}
                        style={{
                          padding: '12px 22px',
                          borderRadius: 999,
                          border: `2px solid ${BRAND_ACCENT}`,
                          background: '#fff',
                          color: BRAND_ACCENT,
                          fontWeight: 600,
                          opacity: step === STEPS.length - 1 ? 0.45 : 1,
                          cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Next
                      </button>
                      {step === STEPS.length - 1 && (
                        <>
                          <button
                            type="button"
                            className="w-button"
                            onClick={clearAll}
                            style={{
                              padding: '12px 22px',
                              borderRadius: 999,
                              border: '1px solid #ccc',
                              background: '#fff',
                              color: BRAND_DARK,
                              marginLeft: 'auto',
                            }}
                          >
                            Clear all input fields
                          </button>
                          <button
                            type="button"
                            className="w-button"
                            onClick={openLeadGateOrExport}
                            style={{
                              padding: '12px 28px',
                              borderRadius: 999,
                              border: 'none',
                              background: BRAND_GREEN,
                              color: '#fff',
                              fontWeight: 700,
                            }}
                          >
                            Create signature
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview column */}
                <div className="column-16 w-col w-col-12 w-col-medium-6">
                  <div
                    style={{
                      position: 'sticky',
                      top: 24,
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: `1px solid #e0e0e0`,
                      boxShadow: '0 12px 40px rgba(27,0,9,0.08)',
                      background: '#fff',
                    }}
                  >
                    <div
                      style={{
                        background: '#ececec',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                      <span style={{ marginLeft: 12, fontSize: 12, color: '#666' }}>Message</span>
                    </div>
                    <div style={{ padding: '16px 18px 20px', background: '#f9f9f9', minHeight: 280 }}>
                      <div style={{ fontSize: 13, color: BRAND_DARK, marginBottom: 6 }}>
                        <strong>To:</strong> Your Recipient
                      </div>
                      <div style={{ fontSize: 13, color: BRAND_DARK, marginBottom: 16 }}>
                        <strong>Subject:</strong> Check out my new Email Signature
                      </div>
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: 8,
                          padding: 16,
                          border: '1px solid #eee',
                          minHeight: 120,
                          fontSize: 14,
                          color: '#444',
                          marginBottom: 16,
                        }}
                      >
                        Hi there,
                        <br />
                        <br />
                        Here is a quick note…
                      </div>
                      <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', margin: '0 0 8px' }}>
                        Signature preview
                      </p>
                      <div
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                        style={{ overflow: 'auto', maxWidth: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {leadGateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sig-lead-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(27,0,9,0.45)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLeadGate();
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              maxWidth: 440,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            }}
            onClick={(ev) => ev.stopPropagation()}
          >
            <div style={{ padding: '16px 22px 0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="w-button"
                onClick={closeLeadGate}
                style={{ border: 'none', background: 'transparent', fontSize: 24, lineHeight: 1, cursor: 'pointer', color: BRAND_DARK }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ padding: '0 24px 20px' }}>
              <h2
                id="sig-lead-title"
                style={{ margin: '0 0 8px', fontSize: 22, color: BRAND_DARK, lineHeight: 1.25, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Almost there! <span aria-hidden>✨</span>
              </h2>
              <p style={{ margin: '0 0 18px', fontSize: 14, color: '#555', lineHeight: 1.5 }}>
                Enter your details to get your signature — we&apos;ll also email you a copy.
              </p>
              <form onSubmit={submitLeadGate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="sig-gen-field">
                    <label className="field-label" htmlFor="sig-lead-name" style={{ color: BRAND_DARK }}>
                      Name<span className="text-color-red">*</span>
                    </label>
                    <input
                      id="sig-lead-name"
                      className="w-input text-field sig-gen-input"
                      type="text"
                      required
                      autoComplete="name"
                      value={leadName}
                      onChange={(ev) => setLeadName(ev.target.value)}
                    />
                  </div>
                  <div className="sig-gen-field">
                    <label className="field-label" htmlFor="sig-lead-email" style={{ color: BRAND_DARK }}>
                      Email<span className="text-color-red">*</span>
                    </label>
                    <input
                      id="sig-lead-email"
                      className="w-input text-field sig-gen-input"
                      type="email"
                      required
                      autoComplete="email"
                      value={leadEmail}
                      onChange={(ev) => setLeadEmail(ev.target.value)}
                    />
                  </div>
                  <div className="sig-gen-field">
                    <label className="field-label" htmlFor="sig-lead-company" style={{ color: BRAND_DARK }}>
                      Company
                    </label>
                    <input
                      id="sig-lead-company"
                      className="w-input text-field sig-gen-input"
                      type="text"
                      autoComplete="organization"
                      value={leadCompany}
                      onChange={(ev) => setLeadCompany(ev.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <p style={{ margin: '14px 0 10px', fontSize: 13, color: '#666', lineHeight: 1.45 }}>
                  We&apos;ll send you a copy of your signature too!
                </p>
                <button
                  type="submit"
                  className="w-button"
                  style={{
                    width: '100%',
                    marginTop: 4,
                    padding: '14px 22px',
                    borderRadius: 999,
                    border: 'none',
                    background: BRAND_GREEN,
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Get My Signature
                </button>
                <p style={{ margin: '14px 0 0', fontSize: 12, color: '#888', textAlign: 'center', lineHeight: 1.4 }}>
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sig-export-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(27,0,9,0.45)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              maxWidth: 720,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 22px 0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="w-button"
                onClick={() => setModalOpen(false)}
                style={{ border: 'none', background: 'transparent', fontSize: 24, lineHeight: 1, cursor: 'pointer', color: BRAND_DARK }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                aria-hidden
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `${BRAND_GREEN}24`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: BRAND_GREEN,
                  fontSize: 26,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <div>
                <h2 id="sig-export-title" style={{ margin: '0 0 6px', fontSize: 22, color: BRAND_DARK, lineHeight: 1.2 }}>
                  Your Signature is Ready!
                </h2>
                <p style={{ margin: 0, fontSize: 14, color: '#555', lineHeight: 1.5 }}>
                  Your email signature HTML has been generated with inline styles for maximum compatibility.
                </p>
              </div>
            </div>
            <div
              style={{
                margin: '16px 24px',
                padding: 20,
                background: '#f9f9f9',
                borderRadius: 12,
                border: '1px solid #eee',
                overflow: 'auto',
              }}
            >
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', margin: '0 0 12px' }}>
                Preview
              </p>
              <div dangerouslySetInnerHTML={{ __html: exportHtml }} style={{ overflow: 'auto', maxWidth: '100%' }} />
            </div>
            <div
              style={{
                padding: '8px 24px 24px',
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                className="w-button"
                onClick={copyHtml}
                style={{
                  flex: '1 1 160px',
                  padding: '12px 24px',
                  borderRadius: 999,
                  background: BRAND_GREEN,
                  color: '#fff',
                  fontWeight: 700,
                  border: 'none',
                }}
              >
                Copy HTML
              </button>
              <button
                type="button"
                className="w-button"
                onClick={() => setModalOpen(false)}
                style={{
                  flex: '1 1 160px',
                  padding: '12px 20px',
                  borderRadius: 999,
                  border: '1px solid #ccc',
                  background: '#fff',
                  color: BRAND_DARK,
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className={`sig-gen-toast${toast.leaving ? ' sig-gen-toast--leaving' : ''}`}
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            maxWidth: 'min(420px, calc(100vw - 32px))',
            textAlign: 'center',
            background: BRAND_GREEN,
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 999,
            zIndex: 10002,
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          }}
        >
          {toast.text}
        </div>
      )}
    </PageShell>
  );
}

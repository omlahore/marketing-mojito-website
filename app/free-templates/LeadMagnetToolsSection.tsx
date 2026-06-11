'use client';

import { useCallback, useMemo, useState } from 'react';
import { freeTemplatesBaseSections } from '@/lib/free-templates-data';
import type { FreeTool } from '@/lib/free-templates-data';

/** Mirrors the embed styles from `public/free-tools-and-template.html` (tabs, cards, modal). */
const EMBED_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700&display=swap');
    .tabs-nav {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 auto 24px;
      padding: 0 40px;
      max-width: 1200px;
    }
    .tab-button {
      padding: 8px 16px;
      background: #eee;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Unbounded', sans-serif;
      font-size: 16px;
      font-weight: 700;
      white-space: nowrap;
      text-align: center;
    }
    .tab-button.active {
      background: #82C341;
      color: #fff;
    }
    #sectionsContainer {
      padding: 0 40px;
      max-width: 1200px;
      margin: 0 auto 40px;
    }
    .section-content {
      display: none;
    }
    .section-content.active {
      display: block;
    }
    .section-title {
      font-family: 'Unbounded', sans-serif;
      font-weight: 700;
      font-size: 32px;
      margin: 0 0 24px;
      text-align: center;
      padding: 24px 0;
    }
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    .tool-card {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 220px;
    }
    .tool-card h3 {
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
    .tool-card p {
      margin: 0 0 16px;
      font-size: 14px;
      color: #555;
      flex-grow: 1;
      text-align: center;
    }
    .tool-card button {
      padding: 10px 16px;
      background: #82C341;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      align-self: center;
    }
    #leadModal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    #leadModal > div {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      text-align: center;
      position: relative;
    }
    #leadModal h2 {
      font-family: 'Unbounded', sans-serif;
      font-weight: 700;
      font-size: 24px;
      margin: 0 0 16px;
      text-align: center;
    }
    #leadForm input {
      width: 100%;
      padding: 12px;
      margin: 8px 0;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    #leadForm button {
      width: 100%;
      padding: 12px;
      margin-top: 16px;
      background: #82C341;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    #leadMessage {
      display: none;
      margin-top: 16px;
      font-size: 16px;
      color: #333;
    }
    #closeModal {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
    @media (max-width: 767px) {
      .tools-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        overflow: scroll;
      }
      .tabs-nav {
        padding: 0 16px;
      }
      #leadModal > div {
        padding: 24px;
      }
      .tab-button{
        padding: 5px 10px;
        font-size: 12px;
        font-weight:500;
      }
       .section-title {
      font-weight: 700;
      font-size: 25px;
    }
    }
`;

function toPdf(docUrl: string): string {
  const match = docUrl.match(/\/d\/([^/]+)/);
  if (!match) return docUrl;
  return `https://docs.google.com/document/d/${match[1]}/export?format=pdf`;
}

/**
 * Category tabs, tool cards, and lead-magnet modal — same behavior as the inline script on
 * `public/free-tools-and-template.html`, driven by `freeTemplatesBaseSections`.
 */
export default function LeadMagnetToolsSection() {
  const sections = useMemo(() => {
    const allTools = freeTemplatesBaseSections.reduce<FreeTool[]>(
      (acc, sec) => acc.concat(sec.tools),
      []
    );
    return [{ title: 'All tools', tools: allTools }, ...freeTemplatesBaseSections];
  }, []);

  const [activeIdx, setActiveIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<FreeTool | null>(null);
  const [sending, setSending] = useState(false);

  const openModal = useCallback((tool: FreeTool) => {
    setSelectedTool(tool);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTool(null);
  }, []);

  const handleSendTool = useCallback(async () => {
    const form = document.getElementById('leadForm') as HTMLFormElement | null;
    const btn = document.getElementById('leadBtn') as HTMLButtonElement | null;
    if (!form || !selectedTool || !btn) return;

    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value?.trim() ?? '';
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim() ?? '';
    if (!name || !email) {
      window.alert('Please fill both your name and email.');
      return;
    }
    const pdfUrl = toPdf(selectedTool.docUrl);

    setSending(true);
    btn.disabled = true;
    const prevText = btn.textContent;
    btn.textContent = 'Sending...';
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          pdfName: selectedTool.title,
          pageName: 'Free Templates',
          tool_link: pdfUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send');
      }
      setModalOpen(false);
      window.open(pdfUrl, '_blank');
      form.reset();
      setSelectedTool(null);
    } catch (err) {
      console.error(err);
      window.alert('Something went wrong. Please try again.');
    } finally {
      setSending(false);
      btn.disabled = false;
      btn.textContent = prevText || 'Send me the tool';
    }
  }, [selectedTool]);

  return (
    <section>
      <div className="code-embed w-embed w-script">
        <style dangerouslySetInnerHTML={{ __html: EMBED_STYLES }} />
        <div className="tabs-nav" id="tabsNav">
          {sections.map((sec, i) => (
            <button
              key={sec.title}
              type="button"
              className={`tab-button${i === activeIdx ? ' active' : ''}`}
              data-idx={i}
              onClick={() => setActiveIdx(i)}
            >
              {sec.title}
            </button>
          ))}
        </div>
        <div id="sectionsContainer">
          {sections.map((sec, i) => (
            <div
              key={sec.title}
              className={`section-content${i === activeIdx ? ' active' : ''}`}
              id={`section-${i}`}
            >
              <h2 className="section-title">{sec.title}</h2>
              <div className="tools-grid">
                {sec.tools.map((tool, j) => (
                  <div key={`${sec.title}-${tool.title}`} className="tool-card">
                    <h3>{tool.title}</h3>
                    <p>{tool.desc}</p>
                    <button
                      type="button"
                      className="get-tool"
                      data-section={i}
                      data-idx={j}
                      onClick={() => openModal(tool)}
                    >
                      Get this tool
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          id="leadModal"
          style={{
            display: modalOpen ? 'flex' : 'none',
          }}
        >
          <div>
            <button type="button" id="closeModal" onClick={closeModal}>
              ×
            </button>
            <h2>Get Your Tool</h2>
            <form
              id="leadForm"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              onSubmit={(e) => e.preventDefault()}
            >
              {selectedTool ? (
                <>
                  <input type="hidden" name="tool_title" defaultValue={selectedTool.title} />
                  <input type="hidden" name="tool_link" defaultValue={toPdf(selectedTool.docUrl)} />
                </>
              ) : null}
              <input name="name" placeholder="Your name" required disabled={sending} />
              <input name="email" type="email" placeholder="Your email" required disabled={sending} />
              <button id="leadBtn" type="button" onClick={handleSendTool} disabled={sending}>
                Send me the tool
              </button>
            </form>
            <div id="leadMessage" />
          </div>
        </div>
      </div>
    </section>
  );
}

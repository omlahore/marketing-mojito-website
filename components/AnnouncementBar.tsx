'use client';

import { useState } from 'react';

export default function AnnouncementBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('First-name'),
          email: formData.get('Email'),
          company: formData.get('Company-name'),
          phone: formData.get('Phone'),
          subject: formData.get('Subject'),
          message: formData.get('Message'),
          _loaded: Date.now() - 3000,
        }),
      });
      if (res.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const marqueeItems = Array.from({ length: 8 }, (_, i) => (
    <span key={i}>
      <span className="text-loop-14">
        🧐 Not sure what service you need?  Book a FREE 15-min strategy call!
      </span>
      <span className="text-loop-14">👉 [Talk to an Expert]</span>
    </span>
  ));

  return (
    <div
      data-w-id="3f5624dc-7ecf-e5ab-271a-fb1f7d7222a5"
      className="loop-label"
      onClick={() => setModalOpen(true)}
      style={{ cursor: 'pointer' }}
    >
      <style>{`
.loop_label-wrapper {
  display: flex;
  animation: marquee-scroll 20s linear infinite;
  will-change: transform;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
      `}</style>
      <div className="loop_label-wrapper">{marqueeItems}</div>

      {/* Contact Modal */}
      <div
        className="modal-wrapper"
        style={{ display: modalOpen ? 'flex' : 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          <div className="adress-block-copy">
            <div className="forw-image-wrapper">
              <img
                sizes="(max-width: 1919px) 100vw, 1920px"
                srcSet="/images/MM-logo-revamp-finals-05-p-500.png 500w, /images/MM-logo-revamp-finals-05-p-800.png 800w, /images/MM-logo-revamp-finals-05-p-1080.png 1080w, /images/MM-logo-revamp-finals-05-p-1600.png 1600w, /images/MM-logo-revamp-finals-05.png 1920w"
                alt=""
                src="/images/MM-logo-revamp-finals-05.png"
                loading="lazy"
                className="image-26"
              />
            </div>
            <div className="contact-form-2">
              <div className="heading">
                <div className="text-20 _1">Let&apos;s get started ,</div>
              </div>
              <div className="w-form">
                {formStatus === 'idle' && (
                  <form
                    id="wf-form-Name"
                    name="wf-form-Name"
                    className="form-2"
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <label htmlFor="First-name" className="field-label">
                        Name<span className="text-color-red">*</span>
                      </label>
                      <input
                        className="text-field-2 w-input"
                        maxLength={256}
                        name="First-name"
                        placeholder=""
                        type="text"
                        id="First-name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="Company-name-2" className="field-label">
                        company name<span className="text-color-red">*</span>
                      </label>
                      <input
                        className="text-field-2 w-input"
                        maxLength={256}
                        name="Company-name"
                        placeholder=""
                        type="text"
                        id="Company-name-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="Email" className="field-label">
                        Email<span className="text-color-red">*</span>
                      </label>
                      <input
                        className="text-field-2 w-input"
                        maxLength={256}
                        name="Email"
                        placeholder=""
                        type="email"
                        id="Email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="Phone" className="field-label">
                        Phone no<span className="text-color-red">*</span>
                      </label>
                      <div className="div-block-74">
                        <input
                          className="text-field-2 w-input"
                          maxLength={256}
                          name="Phone"
                          placeholder=""
                          type="tel"
                          id="Phone"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="Subject" className="field-label">
                        Subject
                      </label>
                      <input
                        className="text-field-2 w-input"
                        maxLength={256}
                        name="Subject"
                        placeholder=""
                        type="text"
                        id="Subject"
                      />
                    </div>
                    <div>
                      <label htmlFor="Message" className="field-label">
                        Message
                      </label>
                      <input
                        className="text-field-2 message w-input"
                        maxLength={256}
                        name="Message"
                        placeholder=""
                        type="text"
                        id="Message"
                      />
                    </div>
                    <input
                      type="submit"
                      className="button-brand w-button"
                      value="Submit"
                    />
                  </form>
                )}
                {formStatus === 'success' && (
                  <div className="w-form-done" style={{ display: 'block' }}>
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="w-form-fail" style={{ display: 'block' }}>
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal-closer"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(false);
            setFormStatus('idle');
          }}
        >
          <div className="close-icon">
            <img alt="Close" src="/images/Close.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}

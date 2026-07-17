import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import FreeTemplatesScripts from '@/components/FreeTemplatesScripts';
import LeadMagnetToolsSection from './LeadMagnetToolsSection';

const CHECKLIST_EMBED_STYLES = `
.custom-form-wrapper {
  max-width: 430px;
  margin: 0 auto;
  padding: 15px;
  background: linear-gradient(135deg, #FDB913 0%, #F5A623 100%);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.custom-form-wrapper input[type="text"],
.custom-form-wrapper input[type="email"] {
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 8px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  background: #FFFFFF;
  color: #333;
  box-sizing: border-box;
  transition: all 0.3s ease;
  text-align: center;
}
.custom-form-wrapper input::placeholder {
  color: #B8B8B8;
  font-weight: 400;
  text-align: center;
}
.custom-form-wrapper input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}
.custom-form-wrapper button[type="submit"] {
  width: 100%;
  padding: 12px 20px;
  margin-top: 4px;
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-family: inherit;
  text-align: center;
}
.custom-form-wrapper button[type="submit"]:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
.custom-form-wrapper button[type="submit"]:active {
  transform: translateY(0);
}
.custom-form-wrapper button[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.hidden {
  display: none !important;
}
.success-message {
  padding: 20px;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}
@media screen and (max-width: 576px) {
  .custom-form-wrapper button[type="submit"] {
    padding: 0px 10px;
     font-size: 14px;
  }
}
`;

export const metadata: Metadata = {
  title: 'Free Marketing Templates',
  description:
    'Free digital marketing templates. Social media calendars, audit checklists & more. Download and start optimizing today.',
  alternates: { canonical: 'https://marketingmojito.com/free-templates' },
  openGraph: {
    title: 'Free Marketing Templates | Marketing Mojito',
    description: 'Free digital marketing templates. Download today.',
    url: 'https://marketingmojito.com/free-templates',
    images: [{ url: '/images/MM-1.png' }],
  },
};

export default function FreeTemplatesPage() {
  return (
    <PageShell hideAnnouncement>
      <div className="q">
        <section className="section_hero">
          <div className="padding-global inner-banner-padding">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="columns-11 w-row">
                <div className="column-15 _1 w-col w-col-6">
                  <div className="hero-left">
                    <h1 className="inner-banner-heading">Free Templates</h1>
                    <div className="hero_para">
                      <div className="inner-banner-para">
                        Work smarter, not harder. Gain instant access to these powerful, ready to use
                        marketing resources designed to accelerate your growth, carefully curated by our
                        in-house experts. Hope you enjoy them!
                      </div>
                    </div>
                    <div className="div-block-91">
                      <a
                        href="/contact-us"
                        target="_blank"
                        rel="noreferrer"
                        className="solid-button-wrapper hero-banner-btn w-button"
                      >
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
                <div className="column-16 w-col w-col-6">
                  <div className="hero-image-wrapper">
                    <img
                      sizes="(max-width: 767px) 96vw, (max-width: 991px) 354px, 460px"
                      srcSet="/images/Viral-Content-p-500.png 500w, /images/Viral-Content-p-800.png 800w, /images/Viral-Content.png 1080w"
                      alt="hero-image"
                      src="/images/Viral-Content.png"
                      loading="lazy"
                      className="header-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-brand">
          <div className="padding-section-small">
            <div className="brand_text-wrapper--1">
              <div className="heading-wrapper">
                <div className="heading-wrap-inner">
                  <div
                    data-w-id="db26c074-e2aa-82c5-ca27-f860657ed33a"
                    style={{
                      WebkitTransform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      MozTransform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      msTransform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      transform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      opacity: 0,
                      filter: 'blur(5px)',
                    }}
                    className="main-heading-style-h3"
                  >
                    Grab Your Free Plug-and-Play Templates Now!
                  </div>
                  <div
                    data-w-id="db26c074-e2aa-82c5-ca27-f860657ed33c"
                    style={{
                      WebkitTransform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      MozTransform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      msTransform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      transform:
                        'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                      opacity: 0,
                      filter: 'blur(5px)',
                    }}
                    className="main-heading-para"
                  >
                    Whether you&apos;re launching your brand, optimizing ad campaigns, or planning your
                    next big move—our free templates are your secret weapon. Developed by our
                    top strategists and creatives, they’re crafted to save you time while amplifying your
                    impact.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <LeadMagnetToolsSection />
        <section className="section-contact">
          <div className="padding-global padding-section-small">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="contacr-wrapperr">
                <div className="contact_text-wrapper">
                  <div className="cta-heading-wrapper">
                    <h3 className="heading-style-h3 white">Checklist of 30 animated videos</h3>
                    <h3 className="cta-yellow-heading">every SaaS startup needs in their sales journey.</h3>
                  </div>
                  <div className="contact_text-wrapper">
                    <div className="w-embed w-script">
                      <style dangerouslySetInnerHTML={{ __html: CHECKLIST_EMBED_STYLES }} />
                      <div className="custom-form-wrapper" data-form-wrapper="">
                        <form
                          action="#"
                          method="POST"
                          className="web3-checklist-form"
                          data-pdf-name="30 Animated Videos"
                          data-page-name="Free Templates"
                        >
                          <input type="hidden" name="subject" value="New Checklist Request" />
                          <input type="hidden" name="redirect" value="false" />
                          <input type="checkbox" name="botcheck" className="hidden" />
                          <input type="text" name="name" placeholder="Name" required />
                          <input type="email" name="email" placeholder="Your e-mail Address" required />
                          <button type="submit">Get the Checklist</button>
                        </form>
                        <div className="success-message hidden">
                          ✅ Thank you! Your message has been sent successfully.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cta-mail-infor-wrapper">
                    <p className="text-18 cta-info-para">If you need help making them, we are an email away!</p>
                    <p className="paragraph-4">hello@marketingmojito.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FreeTemplatesScripts />
    </PageShell>
  );
}

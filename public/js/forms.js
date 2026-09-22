// Form handler for Marketing Mojito
(function() {
  'use strict';

  let recaptchaSiteKey = null; // null = not fetched, '' = no key, 'xxx' = has key

  // Fetch config (reCAPTCHA site key) once
  function getRecaptchaKey(cb) {
    if (recaptchaSiteKey !== null) {
      cb(recaptchaSiteKey || '');
      return;
    }
    fetch('/api/config')
      .then(r => r.json())
      .then(d => { recaptchaSiteKey = d.recaptchaSiteKey || ''; cb(recaptchaSiteKey); })
      .catch(() => { recaptchaSiteKey = ''; cb(''); });
  }

  // Load reCAPTCHA script and get token
  function getRecaptchaToken(siteKey, action, cb) {
    if (!siteKey) { cb(''); return; }
    // grecaptcha.ready is required — calling execute before the API finishes
    // initialising throws, and the server now rejects an empty token outright.
    function doExecute() {
      if (typeof grecaptcha === 'undefined' || !grecaptcha.ready) { cb(''); return; }
      grecaptcha.ready(function () {
        try {
          grecaptcha.execute(siteKey, { action: action || 'submit' }).then(cb).catch(() => cb(''));
        } catch (e) {
          cb('');
        }
      });
    }
    if (typeof grecaptcha !== 'undefined') {
      doExecute();
    } else {
      const s = document.createElement('script');
      s.src = 'https://www.google.com/recaptcha/api.js?render=' + siteKey;
      s.onload = doExecute;
      document.head.appendChild(s);
    }
  }

  // Handle contact form submissions
  function handleContactForm(form, event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const submitButton = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
    const formWrapper = form.closest('.w-form');
    const successMessage = formWrapper?.querySelector('.w-form-done');
    const errorMessage = formWrapper?.querySelector('.w-form-fail');
    const wrapper = form.closest('.contact-form-wrapper, .custom-form-wrapper, .contact-form-2, .web3-checklist-form, .w-form');
    const originalButtonText = submitButton ? (submitButton.textContent || submitButton.value) : '';

    // Disable button and show loading
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.value = 'Sending...';
    }

    // Honeypot check - bots fill these, humans don't see them
    const honeypot = form.querySelector('input[name="website"]')?.value || '';
    const honeypot2 = form.querySelector('input[name="company_url"]')?.value || '';
    if (honeypot || honeypot2) {
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalButtonText; submitButton.value = originalButtonText; }
      return;
    }

    // Get form data - support multiple field name conventions
    const firstname = form.querySelector('input[name="firstname"]')?.value || '';
    const lastname = form.querySelector('input[name="lastname"]')?.value || '';
    const nameField = form.querySelector('input[name="name"]')?.value || '';
    const firstNameWebflow = form.querySelector('input[name="First-name"]')?.value || '';
    const formData = {
      name: nameField || firstNameWebflow || (firstname + ' ' + lastname).trim() || 'Unknown',
      email: form.querySelector('input[name="email"]')?.value || form.querySelector('input[name="Email"]')?.value || '',
      company: form.querySelector('input[name="company"]')?.value || form.querySelector('input[name="Company-name"]')?.value || form.querySelector('input[name="Company-name-2"]')?.value || '',
      phone: form.querySelector('input[name="phone"]')?.value || form.querySelector('input[name="Phone"]')?.value || '',
      subject: form.querySelector('input[name="subject"]')?.value || form.querySelector('input[name="Subject"]')?.value || '',
      message: form.querySelector('textarea[name="message"]')?.value || form.querySelector('input[name="Message"]')?.value || form.querySelector('textarea[name="Message"]')?.value || '',
      _loaded: form.querySelector('input[name="_loaded"]')?.value ? parseInt(form.querySelector('input[name="_loaded"]').value, 10) : Date.now()
    };

    function submitContact() {
      fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // GA4 key event - fires only on confirmed successful submission
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { lead_type: 'contact_form', form_id: form.id || 'contact' });
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) {
          form.style.display = 'none';
          successMessage.style.display = 'block';
        } else if (wrapper) {
          wrapper.innerHTML = '<div class="success-message">✅ Thank you! Your message has been sent successfully.</div>';
        } else {
          alert('✅ Thank you! Your message has been sent successfully.');
        }
        form.reset();
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      if (errorMessage) {
        errorMessage.style.display = 'block';
      } else {
        alert('⚠️ Something went wrong. Please try again.');
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.value = originalButtonText;
      }
    });
    }

    getRecaptchaKey(function(siteKey) {
      if (siteKey) {
        getRecaptchaToken(siteKey, 'contact', function(token) {
          formData.recaptchaToken = token;
          submitContact();
        });
      } else {
        submitContact();
      }
    });
  }

  // Handle lead magnet form submissions
  function handleLeadMagnetForm(form, event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const submitButton = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
    const successMessage = form.querySelector('.w-form-done');
    const errorMessage = form.querySelector('.w-form-fail');
    const wrapper = form.closest('.custom-form-wrapper, .contact_form-wrapper, .web3-checklist-form, .w-form');
    const originalButtonText = submitButton ? (submitButton.textContent || submitButton.value) : '';

    // Disable button and show loading
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.value = 'Sending...';
    }

    // Honeypot check - bots fill these, humans don't see them
    const honeypot = form.querySelector('input[name="website"]')?.value || '';
    const honeypot2 = form.querySelector('input[name="company_url"]')?.value || '';
    if (honeypot || honeypot2) {
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalButtonText; submitButton.value = originalButtonText; }
      return;
    }

    // Get PDF name and page name from form attributes or data
    const pdfName = form.dataset.pdfName || form.querySelector('input[name="pdfName"]')?.value || 'Resource';
    const pageName = form.dataset.pageName || form.querySelector('input[name="pageName"]')?.value || document.title || 'Website';

    // Get form data - support both name and firstname/lastname
    const nameField = form.querySelector('input[name="name"]')?.value || '';
    const firstname = form.querySelector('input[name="firstname"]')?.value || '';
    const lastname = form.querySelector('input[name="lastname"]')?.value || '';
    const formData = {
      name: nameField || (firstname + ' ' + lastname).trim() || 'Unknown',
      email: form.querySelector('input[name="email"]')?.value || form.querySelector('input[name="Email"]')?.value || '',
      pdfName: pdfName,
      pageName: pageName,
      _loaded: form.querySelector('input[name="_loaded"]')?.value ? parseInt(form.querySelector('input[name="_loaded"]').value, 10) : Date.now()
    };

    function submitLeadMagnet() {
      fetch('/api/lead-magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { lead_type: 'lead_magnet', resource: pdfName || 'unknown' });
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) {
          form.style.display = 'none';
          successMessage.style.display = 'block';
        } else if (wrapper) {
          wrapper.innerHTML = '<div class="success-message">✅ Checklist sent! Check your inbox.</div>';
        } else {
          alert('✅ Checklist sent! Check your inbox.');
        }
        form.reset();
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      if (errorMessage) {
        errorMessage.style.display = 'block';
      } else {
        alert('⚠️ Something went wrong. Please try again.');
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.value = originalButtonText;
      }
    });
    }

    getRecaptchaKey(function(siteKey) {
      if (siteKey) {
        getRecaptchaToken(siteKey, 'lead_magnet', function(token) {
          formData.recaptchaToken = token;
          submitLeadMagnet();
        });
      } else {
        submitLeadMagnet();
      }
    });
  }

  // Inject honeypot + timestamp fields (hidden from users, bots fill honeypots)
  function injectSpamFields(form) {
    const hiddenStyle = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
    const attrs = { tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' };

    if (!form.querySelector('input[name="website"]')) {
      const hp = document.createElement('input');
      hp.type = 'text'; hp.name = 'website';
      Object.entries(attrs).forEach(([k, v]) => hp.setAttribute(k, v));
      hp.style.cssText = hiddenStyle;
      form.appendChild(hp);
    }
    if (!form.querySelector('input[name="company_url"]')) {
      const hp2 = document.createElement('input');
      hp2.type = 'text'; hp2.name = 'company_url';
      Object.entries(attrs).forEach(([k, v]) => hp2.setAttribute(k, v));
      hp2.style.cssText = hiddenStyle;
      form.appendChild(hp2);
    }
    if (!form.querySelector('input[name="_loaded"]')) {
      const ts = document.createElement('input');
      ts.type = 'hidden'; ts.name = '_loaded';
      ts.value = String(Date.now());
      form.appendChild(ts);
    }
  }

  // Initialize forms when DOM is ready
  function initForms() {
    const boundForms = new Set();

    // Contact forms - full contact forms with name, email, message/company
    document.querySelectorAll('form#contact-form, form#wf-form-Name, form.form-2, .contact-form-2 form').forEach(form => {
      if (boundForms.has(form)) return;
      const hasMessage = form.querySelector('[name="message"], [name="Message"]');
      const hasCompany = form.querySelector('[name="company"], [name="Company-name"], [name="Company-name-2"]');
      if (hasMessage || hasCompany) {
        boundForms.add(form);
        injectSpamFields(form);
        form.addEventListener('submit', (e) => handleContactForm(form, e), true);
      }
    });

    // Lead magnet / checklist forms
    const leadMagnetSelectors = [
      'form#checklist-form',
      'form.web3-checklist-form',
      'form[data-pdf-name]',
      'form.lead-magnet-form'
    ];
    leadMagnetSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(form => {
        // Don't double-bind contact forms
        if (form.id === 'contact-form') return;
        if (form.dataset.mmFormsBound === '1') return;
        form.dataset.mmFormsBound = '1';
        injectSpamFields(form);
        form.addEventListener('submit', (e) => handleLeadMagnetForm(form, e), true);
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

  window.__mmInitForms = initForms;
})();

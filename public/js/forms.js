// Form handler for Marketing Mojito
(function() {
  'use strict';

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
      message: form.querySelector('textarea[name="message"]')?.value || form.querySelector('input[name="Message"]')?.value || form.querySelector('textarea[name="Message"]')?.value || ''
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
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
      pageName: pageName
    };

    fetch('/api/lead-magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
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
})();

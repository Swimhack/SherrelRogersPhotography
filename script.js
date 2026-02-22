/* ============================================
   Sherrel Rogers — Get Paid for Every Shoot
   Minimal JS: scroll animations + form handler
   ============================================ */

(function () {
  'use strict';

  // ---------- Scroll-reveal (fade-in) ----------
  function initFadeIn() {
    const targets = document.querySelectorAll(
      '.section-title, .section-intro, .pivot-card, .system-item, .tier-card, .step, .faq-item, .about-text, .cta-actions, .contact-form'
    );
    targets.forEach(function (el) { el.classList.add('fade-in'); });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // ---------- Form submission (Formsubmit.co AJAX) ----------
  function initForm() {
    var form = document.getElementById('contactForm');
    var success = document.getElementById('formSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var friction = form.querySelector('#friction');

      if (!name.value.trim() || !email.value.trim() || !friction.value) {
        form.removeAttribute('novalidate');
        form.reportValidity();
        form.setAttribute('novalidate', '');
        return;
      }

      // Disable submit button while sending
      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      // Send via Formsubmit.co AJAX endpoint
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          phone: form.querySelector('#phone').value.trim(),
          clients: form.querySelector('#clients').value.trim(),
          friction: friction.value,
          notes: form.querySelector('#notes').value.trim()
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.hidden = true;
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send details to James';
        alert('Something went wrong. Please try again or call (713) 444-6732.');
      });
    });
  }

  // ---------- Smooth scroll for anchor links ----------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', function () {
    initFadeIn();
    initForm();
    initSmoothScroll();
  });
})();

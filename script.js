(() => {
  'use strict';

  const modal = document.getElementById('modal');
  const modalFrame = document.getElementById('modalFrame');
  const modalImage = document.getElementById('modalImage');

  function isModalOpen() {
    return modal && !modal.classList.contains('hidden');
  }

  function openModal() {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (modalFrame) {
      modalFrame.src = '';
      modalFrame.classList.add('hidden');
    }
    if (modalImage) {
      modalImage.src = '';
      modalImage.classList.add('hidden');
    }
  }

  // Expose for inline onclick if ever needed
  window.closeModal = closeModal;

  function openPdf(src) {
    openModal();
    if (modalImage) modalImage.classList.add('hidden');
    if (modalFrame) {
      modalFrame.classList.remove('hidden');
      // Fit view; safe even if browser ignores fragment
      modalFrame.src = src + '#view=FitH';
    }
  }

  function openImage(src, alt) {
    openModal();
    if (modalFrame) modalFrame.classList.add('hidden');
    if (modalImage) {
      modalImage.classList.remove('hidden');
      modalImage.alt = alt || 'Immagine';
      modalImage.src = src;
    }
  }

  // Buttons that open PDFs
  document.querySelectorAll('[data-open-pdf]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-open-pdf');
      if (src) openPdf(src);
    });
  });

  // Images fullscreen: any with class 'zoomable' OR data-fullscreen=true
  document.querySelectorAll('img.zoomable, img[data-fullscreen="true"]').forEach((img) => {
    img.addEventListener('click', () => openImage(img.src, img.alt));
  });

  // Close modal on overlay / close button
  document.querySelectorAll('[data-close="true"]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen()) closeModal();
  });

  /* =========================
     THEMES
  ========================= */

  const THEME_KEY = 'unita_theme';
  const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));

  function setTheme(t) {
    // Remove previous theme classes
    document.body.classList.remove('classic', 'dark', 'elegant', 'sepia', 'lim');
    document.body.classList.add(t);

    // Active state on buttons
    themeButtons.forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute('data-theme') === t);
    });

    try { localStorage.setItem(THEME_KEY, t); } catch (_) {}
  }

  // Initialize
  const saved = (() => {
    try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
  })();

  setTheme(saved || 'classic');

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-theme');
      if (t) setTheme(t);
    });
  });

})();

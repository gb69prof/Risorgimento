(() => {
  "use strict";

  /* =========================
     HELPERS
  ========================= */
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* =========================
     SCROLL SOFT (data-scroll)
  ========================= */
  qsa('[data-scroll]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* =========================
     TABS SCHEMI (PDF/PPTX)
  ========================= */
  const tabPdf = qs('#tabSchemiPdf');
  const tabPptx = qs('#tabSchemiPptx');
  const panelPdf = qs('#panelSchemiPdf');
  const panelPptx = qs('#panelSchemiPptx');
  const pptxFrame = qs('#pptxFrame');
  const pptxNote = qs('#pptxNote');

  function setTab(active) {
    const isPdf = active === 'pdf';
    if (tabPdf) tabPdf.setAttribute('aria-selected', String(isPdf));
    if (tabPptx) tabPptx.setAttribute('aria-selected', String(!isPdf));
    if (panelPdf) panelPdf.hidden = !isPdf;
    if (panelPptx) panelPptx.hidden = isPdf;

    // PPTX viewer (Office) – funziona davvero quando sei su GitHub Pages
    if (!isPdf && pptxFrame) {
      const pptxPath = 'assets/Unita-schemi.pptx';
      // Usa URL assoluto della pagina corrente
      const absolute = new URL(pptxPath, window.location.href).toString();
      const office = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absolute)}`;
      pptxFrame.src = office;

      if (pptxNote) {
        pptxNote.textContent = 'Nota: la visualizzazione PPTX richiede hosting pubblico (GitHub Pages). Se non si carica, usa il download.';
      }
    }
    if (isPdf && pptxFrame) {
      pptxFrame.src = '';
      if (pptxNote) pptxNote.textContent = '';
    }
  }

  if (tabPdf) tabPdf.addEventListener('click', () => setTab('pdf'));
  if (tabPptx) tabPptx.addEventListener('click', () => setTab('pptx'));

  /* =========================
     MODALE (PDF + IMMAGINI)
  ========================= */
  const modal = qs('#uModal');
  const frame = qs('#uModalFrame');
  const img = qs('#uModalImg');

  function openModal() {
    if (!modal) return;
    modal.classList.remove('is-hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('is-hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (frame) {
      frame.src = '';
      frame.classList.add('is-hidden');
    }
    if (img) {
      img.src = '';
      img.classList.add('is-hidden');
    }
  }

  function openPdf(src) {
    openModal();
    if (img) img.classList.add('is-hidden');
    if (frame) {
      frame.classList.remove('is-hidden');
      frame.src = `${src}#view=FitH`;
    }
  }

  function openImage(src, alt = '') {
    openModal();
    if (frame) frame.classList.add('is-hidden');
    if (img) {
      img.classList.remove('is-hidden');
      img.alt = alt || 'Immagine';
      img.src = src;
    }
  }

  // Bottoni che aprono PDF in modale
  qsa('[data-open-pdf]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-open-pdf');
      if (src) openPdf(src);
    });
  });

  // Immagini fullscreen SOLO dove lo chiedi (data-fullscreen="true")
  qsa('img[data-fullscreen="true"]').forEach(im => {
    im.addEventListener('click', () => openImage(im.src, im.alt));
  });

  // Chiudi: overlay o bottone
  qsa('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

  // Chiudi con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('is-hidden')) closeModal();
  });

  /* =========================
     TEMI (select + localStorage)
  ========================= */
  const themeSelect = qs('#themeSelect');
  const html = document.documentElement;

  // Mantengo i tuoi 4 + aggiungo LIM
  const themes = [
    { value: 'aurora', label: 'Aurora' },
    { value: 'notte',  label: 'Notte'  },
    { value: 'neve',   label: 'Neve'   },
    { value: 'carta',  label: 'Carta'  },
    { value: 'lim',    label: 'LIM (alto contrasto)' }
  ];

  function setTheme(value) {
    html.setAttribute('data-theme', value);
    localStorage.setItem('theme', value);
  }

  function initThemeUI() {
    if (!themeSelect) return;

    themeSelect.innerHTML = '';
    themes.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value;
      opt.textContent = t.label;
      themeSelect.appendChild(opt);
    });

    const saved = localStorage.getItem('theme') || html.getAttribute('data-theme') || 'aurora';
    themeSelect.value = saved;
    setTheme(saved);

    themeSelect.addEventListener('change', () => setTheme(themeSelect.value));
  }

  initThemeUI();

  // Tab di default
  setTab('pdf');
})();

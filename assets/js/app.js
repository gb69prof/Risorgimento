(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];

  const root = document.documentElement;

  const savedTheme = localStorage.getItem("unita_theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  $("#btnTheme")?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("unita_theme", next);
  });

  const savedFs = localStorage.getItem("unita_fs");
  if (savedFs) root.style.setProperty("--fs", savedFs);

  const bumpFs = (delta) => {
    const cur = parseFloat(getComputedStyle(root).getPropertyValue("--fs")) || 16;
    const next = Math.min(20, Math.max(14, cur + delta));
    root.style.setProperty("--fs", `${next}px`);
    localStorage.setItem("unita_fs", `${next}px`);
  };
  $("#btnAPlus")?.addEventListener("click", () => bumpFs(+1));
  $("#btnAMinus")?.addEventListener("click", () => bumpFs(-1));

  const sections = $$("main .section[id]");
  const navLinks = $$(".nav a[data-target]");
  const setActive = (id) => navLinks.forEach(a => a.classList.toggle("active", a.dataset.target === id));

  const io = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.25, 0.35]});
  sections.forEach(s => io.observe(s));

  navLinks.forEach(a => a.addEventListener("click", (e) => {
    e.preventDefault();
    const el = document.getElementById(a.dataset.target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  const search = $("#q");
  const clearHighlights = () => {
    $$("mark[data-hl]").forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
  };
  const highlight = (el, term) => {
    if (!term) return;
    const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement?.tagName;
        if (p === "SCRIPT" || p === "STYLE") return NodeFilter.FILTER_REJECT;
        return rx.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.append(walker.currentNode);
  };

  // Lightweight search: filter index only (keeps the site fast on iPad)
  search?.addEventListener("input", () => {
    const term = search.value.trim().toLowerCase();
    navLinks.forEach(a => {
      const txt = a.textContent.toLowerCase();
      a.style.display = (!term || txt.includes(term)) ? "" : "none";
    });
    clearHighlights();
  });

  const lb = $("#lightbox");
  const lbImg = $("#lightbox img");
  const lbCap = $("#lightbox .captext");
  const openLb = (src, cap) => {
    lbImg.src = src;
    lbCap.textContent = cap || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const closeLb = () => {
    lb.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  };

  $$(".thumb").forEach(t => t.addEventListener("click", () => openLb(t.dataset.src, t.dataset.cap)));
  $$(".figure img[data-zoom]").forEach(img => {
    img.addEventListener("click", () => openLb(img.getAttribute("src"), img.dataset.cap || img.alt));
    img.style.cursor = "zoom-in";
  });

  $("#lbClose")?.addEventListener("click", closeLb);
  lb?.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

  $("#btnPrint")?.addEventListener("click", () => window.print());
})();

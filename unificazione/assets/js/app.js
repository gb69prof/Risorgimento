
(function(){
  const THEMES = [
    {id:"aurora", name:"Aurora (wow)"},
    {id:"neve",   name:"Neve (chiaro)"},
    {id:"carta",  name:"Carta (caldo)"},
    {id:"notte",  name:"Notte (scuro)"},
  ];

  const root = document.documentElement;
  const sel = document.getElementById("themeSelect");
  const saved = localStorage.getItem("unita_theme") || "aurora";
  root.setAttribute("data-theme", saved);

  if(sel){
    sel.innerHTML = THEMES.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
    sel.value = saved;
    sel.addEventListener("change", () => {
      root.setAttribute("data-theme", sel.value);
      localStorage.setItem("unita_theme", sel.value);
    });
  }

  document.querySelectorAll('a[data-scroll]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(id && id.startsWith('#')){
        const el = document.querySelector(id);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:"smooth", block:"start"});
          history.replaceState(null, "", id);
        }
      }
    });
  });

  const tabPdf = document.getElementById("tabSchemiPdf");
  const tabPptx = document.getElementById("tabSchemiPptx");
  const panelPdf = document.getElementById("panelSchemiPdf");
  const panelPptx = document.getElementById("panelSchemiPptx");
  const pptxFrame = document.getElementById("pptxFrame");
  const pptxNote = document.getElementById("pptxNote");

  function selectTab(which){
    const isPdf = which === "pdf";
    if(tabPdf) tabPdf.setAttribute("aria-selected", String(isPdf));
    if(tabPptx) tabPptx.setAttribute("aria-selected", String(!isPdf));
    if(panelPdf) panelPdf.hidden = !isPdf;
    if(panelPptx) panelPptx.hidden = isPdf;

    if(!isPdf && pptxFrame){
      const baseUrl = location.origin + location.pathname.replace(/index\.html$/,'');
      const pptxUrl = baseUrl + "assets/docs/Unita-schemi.pptx";
      const office = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(pptxUrl);
      pptxFrame.src = office;

      if(pptxNote){
        pptxNote.textContent = "Nota: la visualizzazione PPTX richiede che il sito sia pubblicato (GitHub Pages) e raggiungibile via HTTPS. In locale puoi sempre scaricare il file.";
      }
    }
  }

  if(tabPdf && tabPptx){
    tabPdf.addEventListener("click", ()=>selectTab("pdf"));
    tabPptx.addEventListener("click", ()=>selectTab("pptx"));
  }
  selectTab("pdf");
})();

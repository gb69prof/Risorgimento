
/* =========================
   MODALE UNIVERSALE
========================= */

const modal = document.getElementById("modal");
const modalFrame = document.getElementById("modalFrame");
const modalImage = document.getElementById("modalImage");

function openPdf(path) {
    modal.classList.remove("hidden");

    modalFrame.src = path;
    modalFrame.classList.remove("hidden");

    modalImage.classList.add("hidden");
}

function openImage(path) {
    modal.classList.remove("hidden");

    modalImage.src = path;
    modalImage.classList.remove("hidden");

    modalFrame.classList.add("hidden");
}

function closeModal() {
    modal.classList.add("hidden");

    modalFrame.src = "";
    modalImage.src = "";
}

/* =========================
   CHIUSURA CON ESC
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

/* =========================
   IMMAGINI CLICKABILI
========================= */

document.querySelectorAll("img").forEach(img => {
    img.addEventListener("click", () => {
        openImage(img.src);
    });
});

/* =========================
   SISTEMA TEMI
========================= */

const themes = {
    light: {
        "--bg": "#ffffff",
        "--text": "#111111",
        "--card": "#f5f5f5"
    },
    dark: {
        "--bg": "#111111",
        "--text": "#ffffff",
        "--card": "#1e1e1e"
    },
    sepia: {
        "--bg": "#f4ecd8",
        "--text": "#5b4636",
        "--card": "#e8dcc2"
    },
    contrast: {
        "--bg": "#000000",
        "--text": "#ffff00",
        "--card": "#000000"
    }
};

const themeSelect = document.getElementById("themeSelect");

function applyTheme(name) {
    const theme = themes[name];

    Object.keys(theme).forEach(variable => {
        document.documentElement.style.setProperty(variable, theme[variable]);
    });

    localStorage.setItem("theme", name);
}

/* =========================
   POPOLA SELECT TEMI
========================= */

function initThemes() {
    if (!themeSelect) return;

    Object.keys(themes).forEach(themeName => {
        const option = document.createElement("option");
        option.value = themeName;
        option.textContent = themeName;
        themeSelect.appendChild(option);
    });

    const savedTheme = localStorage.getItem("theme") || "light";

    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    themeSelect.addEventListener("change", () => {
        applyTheme(themeSelect.value);
    });
}

initThemes();

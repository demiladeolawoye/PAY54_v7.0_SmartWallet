// ============================================================
// PAY54 v7.0 • Theme Engine (Dark / Light)
// Uses data-theme on <html>
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

const THEME_KEY = "pay54_theme";

P.theme = {
  init() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    this.apply(saved);
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        this.apply(next);
      });
    }
  },

  apply(mode) {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem(THEME_KEY, mode);
    const toggle = document.querySelector("[data-theme-toggle-label]");
    if (toggle) {
      toggle.textContent = mode === "light" ? "Light" : "Dark";
    }
  }
};


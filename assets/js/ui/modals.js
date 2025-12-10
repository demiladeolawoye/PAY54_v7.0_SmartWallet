// ============================================================
// PAY54 v7.0 • Modals Manager
// Simple dynamic sheet builder
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.modals = (function () {
  let active;

  function close() {
    if (active) {
      active.remove();
      active = null;
    }
  }

  function open({ title, subtitle, bodyHtml, onSubmit, submitLabel = "Continue" }) {
    close();
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const sheet = document.createElement("div");
    sheet.className = "modal-sheet";

    sheet.innerHTML = `
      <div class="modal-header">
        <div>
          <div class="modal-title">${title}</div>
          ${subtitle ? `<div class="modal-sub">${subtitle}</div>` : ""}
        </div>
        <button class="modal-close" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        ${bodyHtml}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" data-dismiss>Cancel</button>
        <button class="btn btn-primary btn-sm" data-submit>${submitLabel}</button>
      </div>
    `;

    backdrop.appendChild(sheet);
    document.body.appendChild(backdrop);
    active = backdrop;

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.matches(".modal-close,[data-dismiss]")) {
        close();
      }
    });

    if (onSubmit) {
      sheet.querySelector("[data-submit]").addEventListener("click", () => {
        onSubmit(sheet, close);
      });
    }
  }

  return { open, close };
})();


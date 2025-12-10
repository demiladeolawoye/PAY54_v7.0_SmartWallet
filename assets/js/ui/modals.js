// assets/js/ui/modals.js

export function openModal(contentHtml) {
  let root = document.getElementById("modalRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "modalRoot";
    document.body.appendChild(root);
  }

  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        ${contentHtml}
      </div>
    </div>
  `;

  root.querySelector(".modal-backdrop").addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) closeModal();
  });

  const closeBtn = root.querySelector("[data-modal-close]");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
}

export function closeModal() {
  const root = document.getElementById("modalRoot");
  if (root) root.innerHTML = "";
}

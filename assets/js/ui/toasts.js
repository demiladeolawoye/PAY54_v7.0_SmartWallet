// assets/js/ui/toasts.js

export function showToast(message, type = "info", timeout = 3000) {
  let root = document.getElementById("toastRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "toastRoot";
    root.className = "toast-root";
    document.body.appendChild(root);
  }

  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.textContent = message;

  root.appendChild(el);

  setTimeout(() => {
    el.classList.add("toast-hide");
    setTimeout(() => el.remove(), 300);
  }, timeout);
}

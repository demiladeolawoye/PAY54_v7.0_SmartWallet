// ============================================================
// PAY54 v7.0 • Toast Notifications
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.toasts = (function () {
  let stack;

  function ensureStack() {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
  }

  function show(message, type = "success", ttl = 3500) {
    ensureStack();
    const node = document.createElement("div");
    node.className = "toast" + (type === "error" ? " toast-error" : "");
    node.textContent = message;
    stack.appendChild(node);
    setTimeout(() => {
      node.classList.add("toast-hide");
      node.style.opacity = "0";
      setTimeout(() => node.remove(), 260);
    }, ttl);
  }

  return { show };
})();


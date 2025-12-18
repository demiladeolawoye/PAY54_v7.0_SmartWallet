// session.js — PAY54 v7.0 FINAL
// Handles auth guard, redirects, logout

(function () {
  const SESSION_KEY = "pay54_session_active";

  function isLoggedIn() {
    return localStorage.getItem(SESSION_KEY) === "1";
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.replace("index.html");
    }
  }

  function preventAuthPages() {
    if (isLoggedIn()) {
      window.location.replace("dashboard.html");
    }
  }

  const path = window.location.pathname.toLowerCase();

  // 🔒 Protect dashboard
  if (path.endsWith("dashboard.html")) {
    requireAuth();
  }

  // 🔁 Prevent logged-in users from auth pages
  if (
    path.endsWith("index.html") ||
    path.endsWith("login.html") ||
    path.endsWith("signup.html") ||
    path.endsWith("verify.html") ||
    path.endsWith("reset-pin.html") ||
    path === "/" ||
    path === ""
  ) {
    preventAuthPages();
  }

  // 🔓 Logout
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#logoutBtn,[data-logout]");
    if (!btn) return;

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("pay54_verified");
    window.location.replace("index.html");
  });
})();

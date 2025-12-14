(function () {
  const SESSION_KEY = "p54_session";

  function isAuthenticated() {
    return localStorage.getItem(SESSION_KEY) === "active";
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      window.location.href = "login.html";
    }
  }

  function loginSession() {
    localStorage.setItem(SESSION_KEY, "active");
  }

  function logoutSession() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }

  // expose
  window.P54Session = {
    requireAuth,
    loginSession,
    logoutSession
  };
})();

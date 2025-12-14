/* PAY54 DEMO SESSION CONTROLLER */
/* v7.0 — UI Simulation Only */

window.PAY54_SESSION = {
  loginDemo() {
    localStorage.setItem("pay54_session", "active");
    window.location.replace("dashboard.html");
  },

  createDemoUser() {
    localStorage.setItem("pay54_session", "active");
    window.location.replace("dashboard.html");
  },

  resetDemoPin() {
    alert("Demo reset code sent.");
    window.location.replace("login.html");
  }
};

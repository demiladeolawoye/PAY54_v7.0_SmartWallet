// PAY54 v7.0 — Demo Session Controller (SAFE FOR GITHUB PAGES)

window.PAY54_SESSION = {
  login() {
    localStorage.setItem("p54_session", "active");
    window.location.href = "dashboard.html";
  },

  signup() {
    localStorage.setItem("p54_session", "active");
    window.location.href = "dashboard.html";
  },

  recover() {
    alert("Demo reset code sent (123456)");
  },

  resetDone() {
    alert("PIN updated (demo)");
    window.location.href = "login.html";
  }
};

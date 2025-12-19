document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorBox = document.getElementById("authError");

  const showError = (msg) => {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const pin = form.pin.value.trim();

    const user = JSON.parse(localStorage.getItem("pay54_demo_user"));
    const savedPin = localStorage.getItem("pay54_pin");

    if (!user || email !== user.email || pin !== savedPin) {
      return showError("Invalid login details");
    }

    localStorage.setItem("pay54_session_active", "1");
    window.location.href = "dashboard.html";
  });
});

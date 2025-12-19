document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const errorBox = document.getElementById("authError");

  const showError = (msg) => {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const pin = form.pin.value.trim();
    const confirmPin = form.confirmPin.value.trim();

    if (!name || !email || !phone || !pin || !confirmPin) {
      return showError("All fields are required");
    }

    if (pin !== confirmPin) {
      return showError("PINs do not match");
    }

    if (pin.length < 4) {
      return showError("PIN must be at least 4 digits");
    }

    const user = { name, email, phone };
    localStorage.setItem("pay54_demo_user", JSON.stringify(user));
    localStorage.setItem("pay54_pin", pin);
    localStorage.setItem("pay54_verified", "1");
    localStorage.setItem("pay54_session_active", "1");

    localStorage.setItem("pay54_dash_state_v70", JSON.stringify({
      activeCurrency: "NGN",
      balances: { NGN: 250000, USD: 0, GBP: 0, EUR: 0 },
      accountNo: "012 345 6789",
      payTag: "@pay54demo",
      kyc: "Tier 2 · Verified (Demo)"
    }));

    window.location.href = "dashboard.html";
  });
});

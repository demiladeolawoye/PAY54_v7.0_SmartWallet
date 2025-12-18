/* ============================================================
   PAY54 v7.0 — SIGNUP ENGINE (FULL)
   - Create account
   - Validate inputs
   - Save user
   - Create session
   - Redirect to dashboard
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const btn = document.getElementById("signupBtn");
  const errorBox = document.getElementById("signupError");

  if (!form) {
    console.error("Signup form not found");
    return;
  }

  const showError = (msg) => {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.style.display = "block";
    } else {
      alert(msg);
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // 🚨 CRITICAL

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const pin = form.querySelector('[name="pin"]')?.value.trim();

    if (!name || !email || !phone || !pin) {
      showError("All fields are required");
      return;
    }

    if (pin.length < 4) {
      showError("PIN must be at least 4 digits");
      return;
    }

    // Save user (v6.7 compatible)
    const user = {
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("pay54_demo_user", JSON.stringify(user));
    localStorage.setItem("pay54_verified", "1");
    localStorage.setItem("pay54_session_active", "1");

    // Initialise dashboard state if missing
    if (!localStorage.getItem("pay54_dash_state_v70")) {
      localStorage.setItem(
        "pay54_dash_state_v70",
        JSON.stringify({
          activeCurrency: "NGN",
          balances: { NGN: 250000, USD: 0, GBP: 0, EUR: 0 },
          accountNo: "012 345 6789",
          payTag: "@pay54demo",
          kyc: "Tier 2 · Verified (Demo)",
        })
      );
    }

    // Redirect
    window.location.href = "dashboard.html";
  });
});

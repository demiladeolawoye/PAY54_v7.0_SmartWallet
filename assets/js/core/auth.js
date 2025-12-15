/* auth.js — PAY54 v7.0 (FULL REPLACEMENT) */

const STORAGE_KEY = "pay54_user";

/* ---------- Utilities ---------- */
function getUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function setUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function showError(msg) {
  alert(msg);
}

/* ---------- Eye toggle ---------- */
document.querySelectorAll(".eye-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    target.type = target.type === "password" ? "text" : "password";
  });
});

/* ---------- SIGN UP ---------- */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = signupForm.signupName.value.trim();
    const email = signupForm.signupEmail.value.trim();
    const phone = signupForm.signupPhone.value.trim();
    const pin = signupForm.signupPin.value;
    const confirm = signupForm.signupPinConfirm.value;

    if (!name || !email || !phone) {
      return showError("All fields are required.");
    }
    if (pin.length !== 4 || isNaN(pin)) {
      return showError("PIN must be 4 digits.");
    }
    if (pin !== confirm) {
      return showError("PINs do not match.");
    }

    setUser({
      name,
      email,
      phone,
      pin
    });

    window.location.href = "index.html";
  });
}

/* ---------- LOGIN ---------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const id = loginForm.loginId.value.trim();
    const pin = loginForm.loginPin.value;
    const user = getUser();

    if (!user) {
      return showError("No account found. Please create one.");
    }

    const idMatch = id === user.email || id === user.phone;
    const pinMatch = pin === user.pin;

    if (!idMatch || !pinMatch) {
      return showError("Invalid credentials.");
    }

    localStorage.setItem("pay54_session", "active");
    window.location.href = "dashboard.html";
  });
}

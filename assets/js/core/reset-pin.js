/* reset-pin.js — PAY54 v7.0 (FULL REPLACEMENT) */

const STORAGE_KEY = "pay54_user";

function getUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function setUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function showError(msg) {
  alert(msg);
}

const resetForm = document.getElementById("resetPinForm");

if (resetForm) {
  resetForm.addEventListener("submit", e => {
    e.preventDefault();

    const id = resetForm.resetId.value.trim();
    const newPin = resetForm.resetNewPin.value;
    const confirm = resetForm.resetConfirmPin.value;

    const user = getUser();

    if (!user) {
      return showError("No account found.");
    }

    const idMatch = id === user.email || id === user.phone;
    if (!idMatch) {
      return showError("Email or phone not recognised.");
    }

    if (newPin.length !== 4 || isNaN(newPin)) {
      return showError("PIN must be 4 digits.");
    }
    if (newPin !== confirm) {
      return showError("PINs do not match.");
    }

    user.pin = newPin;
    setUser(user);

    alert("PIN updated successfully.");
    window.location.href = "index.html";
  });
}

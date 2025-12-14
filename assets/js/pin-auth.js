(function () {
  const PIN_KEY = "p54_user_pin"; // placeholder (backend later)

  // Set a demo PIN if none exists (REMOVE when backend wired)
  if (!localStorage.getItem(PIN_KEY)) {
    localStorage.setItem(PIN_KEY, "1234");
  }

  let pendingAction = null;

  function openPin(action) {
    pendingAction = action;
    document.getElementById("pinInput").value = "";
    document.getElementById("pinModal").style.display = "flex";
  }

  function closePin() {
    document.getElementById("pinModal").style.display = "none";
    pendingAction = null;
  }

  function confirmPin() {
    const entered = document.getElementById("pinInput").value;
    const saved = localStorage.getItem(PIN_KEY);

    if (entered !== saved) {
      alert("Incorrect PIN");
      return;
    }

    closePin();
    if (typeof pendingAction === "function") pendingAction();
  }

  // expose
  window.P54Pin = {
    openPin,
    confirmPin,
    closePin
  };
})();

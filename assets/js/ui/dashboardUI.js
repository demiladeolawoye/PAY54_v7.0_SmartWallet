// assets/js/ui/dashboardUI.js
// PAY54 v7.0 • Dashboard Engine (FX + Modals + UI)
// ONE WALLET. EVERYWHERE.

document.addEventListener("DOMContentLoaded", () => {

  // ====== ELEMENT HOOKS ======
  const body = document.body;

  const modeToggle = document.getElementById("modeToggle");
  const currencyToggle = document.getElementById("currencyToggle");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileBtn = document.getElementById("profileBtn");

  const walletBalanceEl = document.getElementById("walletBalance");
  const walletLabelEl = document.getElementById("walletLabel");
  const accountNumberEl = document.getElementById("accountNumber");

  const txListEl = document.getElementById("txList");
  const txEmptyEl = document.getElementById("txEmpty");

  const requestsListEl = document.getElementById("requestsList");
  const requestsEmptyEl = document.getElementById("requestsEmpty");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitleEl = document.getElementById("modalTitle");
  const modalBodyEl = document.getElementById("modalBody");
  const modalCloseBtn = document.getElementById("modalClose");
  const modalPrimaryBtn = document.getElementById("modalPrimary");

  const toastEl = document.getElementById("toast");

  // Money Moves
  const btnSend = document.getElementById("mmSend");
  const btnReceive = document.getElementById("mmReceive");
  const btnAdd = document.getElementById("mmAdd");
  const btnWithdrawMM = document.getElementById("mmWithdraw");
  const btnBankTransfer = document.getElementById("mmBankTransfer");
  const btnRequest = document.getElementById("mmRequest");

  // Services
  const btnFx = document.getElementById("svcFx");
  const btnSavings = document.getElementById("svcSavings");
  const btnBills = document.getElementById("svcBills");
  const btnCards = document.getElementById("svcCards");
  const btnCheckout = document.getElementById("svcCheckout");
  const btnShop = document.getElementById("svcShop");
  const btnInvest = document.getElementById("svcInvest");
  const btnBet = document.getElementById("svcBet");
  const btnRisk = document.getElementById("svcRisk");
  const btnAgent = document.getElementById("svcAgent");

  // Shortcuts
  const qsAgent = document.getElementById("qsAgent");
  const qsSavings = document.getElementById("qsSavings");
  const qsShop = document.getElementById("qsShop");
  const qsInvest = document.getElementById("qsInvest");

  // Requests / Alerts
  const btnClearAlerts = document.getElementById("btnClearAlerts");

  // Tx view all
  const btnViewAllTx = document.getElementById("btnViewAllTx");

  // Balance controls
  const btnAddMoney = document.getElementById("btnAddMoney");
  const btnWithdraw = document.getElementById("btnWithdraw");


  // ====== DEMO DATA & FX ENGINE ======

  // Base NGN balance
  const baseBalanceNgn = 540000; // demo figure

  // Mock FX rates: NGN value of 1 unit of each foreign currency
  const fxRates = {
    NGN: 1,
    USD: 1600, // 1 USD = 1,600 NGN
    GBP: 2000, // 1 GBP = 2,000 NGN
    EUR: 1700  // 1 EUR = 1,700 NGN
  };

  let currentCurrency = "NGN";

  function getSymbol(cur) {
    switch (cur) {
      case "USD": return "$";
      case "GBP": return "£";
      case "EUR": return "€";
      default: return "₦";
    }
  }

  function formatMoney(amount, currency = "NGN") {
    const symbol = getSymbol(currency);
    const value = Number(amount || 0);
    return `${symbol}${value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function computeBalanceFor(currency) {
    if (currency === "NGN") return baseBalanceNgn;
    const rate = fxRates[currency] || 1;
    return baseBalanceNgn / rate;
  }

  function updateBalanceUI() {
    const bal = computeBalanceFor(currentCurrency);
    walletBalanceEl.textContent = formatMoney(bal, currentCurrency);

    // Wallet label text
    walletLabelEl.textContent = `${currentCurrency} Wallet`;

    // Account number — keep same NGN account for demo simplicity
    accountNumberEl.textContent = "0224519873";
  }

  // Sample initial demo transactions
  const demoTransactions = [
    { text: "Wallet Top-Up • ₦52,000", currency: "NGN" },
    { text: "MTN Airtime • ₦12,000", currency: "NGN" },
    { text: "FX – USD Purchase • ₦10,000", currency: "NGN" },
    { text: "JumiaFood • ₦9,200", currency: "NGN" }
  ];

  function renderTransactions() {
    txListEl.innerHTML = "";

    if (!demoTransactions.length) {
      txEmptyEl.style.display = "block";
      return;
    }

    txEmptyEl.style.display = "none";

    demoTransactions.forEach((tx) => {
      const li = document.createElement("li");
      li.textContent = tx.text;
      txListEl.appendChild(li);
    });
  }

  // Requests / alerts list
  const requests = [];

  function renderRequests() {
    requestsListEl.innerHTML = "";

    if (!requests.length) {
      requestsEmptyEl.style.display = "block";
      return;
    }

    requestsEmptyEl.style.display = "none";

    requests.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      requestsListEl.appendChild(li);
    });
  }


  // ====== MODAL + TOAST UTILS ======

  function openModal(title, htmlBody) {
    modalTitleEl.textContent = title;
    modalBodyEl.innerHTML = htmlBody;
    modalOverlay.classList.add("show");
  }

  function closeModal() {
    modalOverlay.classList.remove("show");
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2800);
  }


  // ====== THEME TOGGLE ======

  let darkMode = true;

  function applyTheme() {
    if (darkMode) {
      body.classList.remove("pay54-light");
      body.classList.add("pay54-dark");
      modeToggle.textContent = "◐ Dark";
    } else {
      body.classList.remove("pay54-dark");
      body.classList.add("pay54-light");
      modeToggle.textContent = "◑ Light";
    }
  }

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      darkMode = !darkMode;
      applyTheme();
    });
  }


  // ====== CURRENCY TOGGLE ======

  function setActiveCurrencyButton(cur) {
    if (!currencyToggle) return;
    const buttons = currencyToggle.querySelectorAll("button[data-currency]");
    buttons.forEach((btn) => {
      const c = btn.getAttribute("data-currency");
      if (c === cur) {
        btn.classList.add("chip-active");
      } else {
        btn.classList.remove("chip-active");
      }
    });
  }

  if (currencyToggle) {
    currencyToggle.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-currency]");
      if (!btn) return;

      const cur = btn.getAttribute("data-currency");
      currentCurrency = cur;
      setActiveCurrencyButton(cur);
      updateBalanceUI();
      showToast(`Switched to ${cur} Wallet (FX simulated)`);
    });
  }


  // ====== LOGOUT + PROFILE ======

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      try {
        localStorage.removeItem("pay54_session_active");
      } catch (e) {
        // ignore
      }
      showToast("Signed out of PAY54 demo.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 600);
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      openModal(
        "PAY54 Profile",
        `
        <p>This is a demo PAY54 profile summary.</p>
        <ul>
          <li><strong>Name:</strong> Demi (Demo user)</li>
          <li><strong>Tag:</strong> @demi_p54</li>
          <li><strong>KYC:</strong> Tier 2 • Verified (demo)</li>
        </ul>
        <p>Use this demo to showcase:</p>
        <ul>
          <li>Settings &amp; Support Centre flows</li>
          <li>Logout and device sign-in model</li>
        </ul>
        `
      );
    });
  }


  // ====== MONEY MOVES HANDLERS ======

  if (btnSend) {
    btnSend.addEventListener("click", () => {
      openModal(
        "Send PAY54 → PAY54",
        `
        <p>Demo flow:</p>
        <ul>
          <li>Choose PAY54 Tag / phone / email</li>
          <li>Enter amount in ${currentCurrency}</li>
          <li>Preview fee (₦0.00 in demo)</li>
          <li>Confirm • balance updates • receipt generated</li>
          <li>Share via WhatsApp / email</li>
        </ul>
        <p><em>Note: This is a UI simulation only – no real money moves.</em></p>
        `
      );
      showToast("Send PAY54 → PAY54 (demo)");
    });
  }

  if (btnReceive) {
    btnReceive.addEventListener("click", () => {
      openModal(
        "Receive Money",
        `
        <p>Your PAY54 details (demo):</p>
        <ul>
          <li><strong>Account:</strong> 0224519873</li>
          <li><strong>Tag:</strong> @demi_p54</li>
          <li><strong>QR Code:</strong> (placeholder)</li>
        </ul>
        <p>You can share these via WhatsApp or SMS in a real build.</p>
        `
      );
      showToast("Receive money details shown (demo)");
    });
  }

  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      openModal(
        "Add Money",
        `
        <p>Select top-up source:</p>
        <ul>
          <li>Linked debit card</li>
          <li>Bank transfer reference</li>
          <li>PAY54 Agent deposit</li>
        </ul>
        <p>Confirm amount • Preview • Add transaction to Recent Transactions.</p>
        `
      );
      showToast("Add money flow (demo)");
    });
  }

  if (btnWithdrawMM) {
    btnWithdrawMM.addEventListener("click", () => {
      openModal(
        "Withdraw",
        `
        <p>Withdraw from PAY54 wallet to:</p>
        <ul>
          <li>NUBAN bank account</li>
          <li>PAY54 Agent cash-out</li>
        </ul>
        <p>Enter amount • Confirm • show receipt &amp; update balance.</p>
        `
      );
      showToast("Withdraw flow (demo)");
    });
  }

  if (btnBankTransfer) {
    btnBankTransfer.addEventListener("click", () => {
      openModal(
        "Bank Transfer",
        `
        <p>Demo NGN bank transfer:</p>
        <ul>
          <li>Select bank from dropdown</li>
          <li>Enter NUBAN account number</li>
          <li>Enter amount in ${currentCurrency}</li>
          <li>Confirm • show mock receipt &amp; update transactions.</li>
        </ul>
        `
      );
      showToast("Bank transfer (demo)");
    });
  }

  if (btnRequest) {
    btnRequest.addEventListener("click", () => {
      const label = `Request ₦25,000 from @friend_p54 (demo)`;
      requests.push(label);
      renderRequests();
      openModal(
        "Request Money",
        `
        <p>A demo money request has been added:</p>
        <p><strong>${label}</strong></p>
        <p>This would appear in the recipient’s PAY54 app as a pending request.</p>
        `
      );
      showToast("Request created (demo)");
    });
  }


  // Balance card Add / Withdraw buttons (same as Money Moves)
  if (btnAddMoney) {
    btnAddMoney.addEventListener("click", () => {
      if (btnAdd) btnAdd.click();
    });
  }
  if (btnWithdraw) {
    btnWithdraw.addEventListener("click", () => {
      if (btnWithdrawMM) btnWithdrawMM.click();
    });
  }


  // ====== SERVICES HANDLERS ======

  if (btnFx) {
    btnFx.addEventListener("click", () => {
      openModal(
        "Cross-border FX (Demo)",
        `
        <p>FX demo flow:</p>
        <ul>
          <li>You send: NGN / USD / GBP / EUR</li>
          <li>They receive: picked currency in NG, GH, KE, ZA</li>
          <li>Show mock FX rate and payout estimate</li>
          <li>Confirm • generate FX receipt for records (demo only)</li>
        </ul>
        `
      );
      showToast("Cross-border FX preview (demo)");
    });
  }

  if (btnSavings) {
    btnSavings.addEventListener("click", () => {
      openModal(
        "Savings & Goals",
        `
        <p>Create a savings goal:</p>
        <ul>
          <li>Goal name • Target amount</li>
          <li>Frequency (daily/weekly/monthly)</li>
          <li>Track progress with a simple progress bar</li>
        </ul>
        <p>Demo only – no real savings integration yet.</p>
        `
      );
      showToast("Savings & Goals (demo)");
    });
  }

  if (btnBills) {
    btnBills.addEventListener("click", () => {
      openModal(
        "Pay Bills & Top-Up",
        `
        <p>Select service type:</p>
        <ul>
          <li>Airtime • Data</li>
          <li>Power (Disco)</li>
          <li>TV (DSTV/GOtv etc.)</li>
        </ul>
        <p>Pick bundle • Show amount • Confirm • log transaction (demo).</p>
        `
      );
      showToast("Bills & Top-up (demo)");
    });
  }

  if (btnCards) {
    btnCards.addEventListener("click", () => {
      openModal(
        "Virtual & Linked Cards",
        `
        <p>Card demo:</p>
        <ul>
          <li>Show masked virtual card</li>
          <li>List linked bank cards</li>
          <li>Actions: Set default • Freeze • Remove (UI only)</li>
        </ul>
        `
      );
      showToast("Cards control (demo)");
    });
  }

  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      openModal(
        "PAY54 Smart Checkout",
        `
        <p>Demo use-case:</p>
        <ul>
          <li>User selects PAY54 at an e-commerce checkout</li>
          <li>PAY54 app pops up with payment approval screen</li>
          <li>On approve → site confirms payment</li>
        </ul>
        <p>This screen is to explain how PAY54 would behave like PayPal/Flutterwave at checkout.</p>
        `
      );
      showToast("Smart Checkout concept (demo)");
    });
  }

  if (btnShop) {
    btnShop.addEventListener("click", () => {
      openModal(
        "Shop on the Fly",
        `
        <p>Partner categories:</p>
        <ul>
          <li>Taxi (Uber/Bolt)</li>
          <li>Food (Jumia Food, JustEat)</li>
          <li>Tickets &amp; Events</li>
          <li>Online shops</li>
        </ul>
        <p>In production: click → open partner site with PAY54 linked as a funding source.</p>
        `
      );
      showToast("Shop on the Fly (demo)");
    });
  }

  if (btnInvest) {
    btnInvest.addEventListener("click", () => {
      openModal(
        "Investments & Stocks",
        `
        <p>Demo portfolio:</p>
        <ul>
          <li>US stocks (e.g. AAPL, TSLA)</li>
          <li>Index funds</li>
          <li>Lagos fractional real estate</li>
        </ul>
        <p>Balance in ${currentCurrency} converts to NGN equivalent for local reporting.</p>
        `
      );
      showToast("Investments & Stocks (demo)");
    });
  }

  if (btnBet) {
    btnBet.addEventListener("click", () => {
      openModal(
        "Bet Funding (+18)",
        `
        <p>Age-gated flow:</p>
        <ul>
          <li>Verify DOB / ID (18+)</li>
          <li>Select bet platform (Bet9ja, 1xBet, etc.)</li>
          <li>Enter customer ID &amp; amount</li>
        </ul>
        <p>Demo: Show responsible gaming messaging and educational prompts.</p>
        `
      );
      showToast("Bet funding (demo)");
    });
  }

  if (btnRisk) {
    btnRisk.addEventListener("click", () => {
      const alertMsg = "AI Risk Watch: Unusual login from new device (demo).";
      requests.push(alertMsg);
      renderRequests();
      openModal(
        "AI Risk Watch",
        `
        <p>Example alerts:</p>
        <ul>
          <li>Unusual high-value transfer</li>
          <li>Login from new country/device</li>
          <li>Multiple failed PIN attempts</li>
        </ul>
        <p>This educates users on risk, even in demo mode.</p>
        `
      );
      showToast("AI Risk Watch alert (demo)");
    });
  }

  if (btnAgent) {
    btnAgent.addEventListener("click", () => {
      openModal(
        "Become an Agent",
        `
        <p>Agent onboarding form (demo):</p>
        <ul>
          <li>Full name &amp; business name</li>
          <li>Address &amp; location</li>
          <li>NIN / ID details</li>
          <li>Photo / selfie capture (future)</li>
        </ul>
        <p>After approval, agents can onboard users &amp; perform cash in/out.</p>
        `
      );
      showToast("Agent onboarding (demo)");
    });
  }


  // Shortcuts reuse the same handlers
  if (qsAgent && btnAgent) qsAgent.addEventListener("click", () => btnAgent.click());
  if (qsSavings && btnSavings) qsSavings.addEventListener("click", () => btnSavings.click());
  if (qsShop && btnShop) qsShop.addEventListener("click", () => btnShop.click());
  if (qsInvest && btnInvest) qsInvest.addEventListener("click", () => btnInvest.click());


  // ====== REQUESTS & TX EXTRA CONTROLS ======

  if (btnClearAlerts) {
    btnClearAlerts.addEventListener("click", () => {
      requests.splice(0, requests.length);
      renderRequests();
      showToast("All requests & alerts cleared (demo).");
    });
  }

  if (btnViewAllTx) {
    btnViewAllTx.addEventListener("click", () => {
      openModal(
        "All Transactions (Demo)",
        `
        <p>This would show a full transaction history screen.</p>
        <p>For now, only a small sample is loaded for demo purposes.</p>
        `
      );
      showToast("Viewing demo transaction history.");
    });
  }


  // ====== MODAL CLOSE EVENTS ======
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalPrimaryBtn) modalPrimaryBtn.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }


  // ====== INITIALISE DASHBOARD ======

  applyTheme();
  updateBalanceUI();
  renderTransactions();
  renderRequests();
});

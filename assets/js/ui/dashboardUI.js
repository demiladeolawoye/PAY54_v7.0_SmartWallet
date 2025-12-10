// assets/js/ui/dashboardUI.js
// PAY54 v7.0 • Dashboard wiring

import {
  getActiveUser,
  clearSession,
  getWallet,
  saveWallet,
  getSettings,
  saveSettings,
  getTransactions,
  applyCredit,
  applyDebit,
  formatAmount,
  fxConvert,
  addTransaction,
} from "../core/session.js";

import { openModal, closeModal } from "./modals.js";
import { showToast } from "./toasts.js";

// ---------- Guard: only allow dashboard if logged in ----------

const user = getActiveUser();
if (!user) {
  window.location.href = "login.html";
}

// ---------- DOM refs ----------

const balanceAmountEl = document.getElementById("balanceAmount");
const balanceSubEl = document.getElementById("balanceSub");
const alertsListEl = document.getElementById("alertsList");
const txListEl = document.getElementById("txList");
const logoutBtn = document.getElementById("logoutBtn");
const profileBtn = document.getElementById("profileBtn");
const profileNameEl = document.getElementById("profileName");
const profileTagEl = document.getElementById("profileTag");
const profileInitialEl = document.getElementById("profileInitial");
const clearAlertsBtn = document.getElementById("clearAlertsBtn");
const viewAllTxBtn = document.getElementById("viewAllTxBtn");
const themeToggleBtn = document.getElementById("themeToggle");

const currencyButtons = document.querySelectorAll("[data-currency]");

// ---------- Initial hydrate ----------

function hydrateProfile() {
  if (!user) return;
  profileNameEl.textContent = user.name || "PAY54 User";
  profileTagEl.textContent = `${user.tag || "@pay54user"} • PAY54 demo profile`;
  profileInitialEl.textContent = (user.name || "P")[0].toUpperCase();
}

function hydrateTheme() {
  const settings = getSettings();
  document.documentElement.dataset.theme = settings.theme || "dark";
  themeToggleBtn.textContent = settings.theme === "light" ? "◐ Light" : "◑ Dark";
}

function hydrateCurrencyButtons() {
  const settings = getSettings();
  const current = settings.currency || "NGN";
  currencyButtons.forEach((btn) => {
    const c = btn.dataset.currency;
    btn.classList.toggle("pill-active", c === current);
  });
}

function hydrateBalance() {
  const settings = getSettings();
  const wallet = getWallet();
  const c = settings.currency || wallet.currency || "NGN";
  const value = wallet.balances[c] || 0;
  balanceAmountEl.textContent = formatAmount(value, c);
  balanceSubEl.textContent = `FX wallets: NGN • USD • GBP (demo) • Viewing: ${c}`;
}

function hydrateTransactions() {
  const settings = getSettings();
  const c = settings.currency || "NGN";
  const list = getTransactions().slice(0, 6);

  if (!list.length) {
    txListEl.innerHTML = `<li class="list-empty">No activity yet. Try a demo transfer ✨</li>`;
    return;
  }

  txListEl.innerHTML = list
    .map((tx) => {
      const sign = tx.type === "debit" ? "-" : "+";
      const cls = tx.type === "debit" ? "tx-debit" : "tx-credit";
      const txt = tx.description || tx.title || "Wallet activity";
      const displayCurrency = tx.currency || c;
      return `
        <li class="tx-row ${cls}">
          <div class="tx-main">
            <div class="tx-title">${txt}</div>
            <div class="tx-meta">${new Date(tx.createdAt).toLocaleString()}</div>
          </div>
          <div class="tx-amount">
            ${sign}${formatAmount(tx.amount, displayCurrency)}
          </div>
        </li>
      `;
    })
    .join("");
}

function seedDemoAlertsIfEmpty() {
  if (alertsListEl.children.length) return;
  alertsListEl.innerHTML = `
    <li>Prem requested ₦12,000</li>
    <li>Agent onboarding pending</li>
    <li>AI Risk Watch flagged unusual login</li>
  `;
}

// ---------- Simple modal forms ----------

function openAmountModal({ title, actionLabel, onSubmit }) {
  openModal(`
    <header class="modal-header">
      <h2>${title}</h2>
      <button class="modal-close" data-modal-close>✕</button>
    </header>
    <div class="modal-body">
      <label>Amount</label>
      <input id="modalAmount" type="number" min="1" placeholder="10000" />
      <label>Note (optional)</label>
      <input id="modalNote" type="text" placeholder="What is this for?" />
      <button class="modal-btn primary" id="modalSubmit">${actionLabel}</button>
    </div>
  `);

  const amountInput = document.getElementById("modalAmount");
  const noteInput = document.getElementById("modalNote");
  const submitBtn = document.getElementById("modalSubmit");

  submitBtn.addEventListener("click", () => {
    const amount = Number(amountInput.value || 0);
    const note = noteInput.value.trim();
    if (!amount || amount <= 0) {
      showToast("Enter a valid amount.", "error");
      return;
    }
    try {
      onSubmit({ amount, note });
      closeModal();
    } catch (err) {
      showToast(err.message || "Operation failed", "error");
    }
  });
}

function openInfoModal(title, bodyHtml) {
  openModal(`
    <header class="modal-header">
      <h2>${title}</h2>
      <button class="modal-close" data-modal-close>✕</button>
    </header>
    <div class="modal-body">
      ${bodyHtml}
      <button class="modal-btn" data-modal-close>Close</button>
    </div>
  `);
}

// ---------- Actions wiring ----------

function handleSendP2P() {
  openAmountModal({
    title: "Send PAY54 → PAY54",
    actionLabel: "Send now",
    onSubmit: ({ amount, note }) => {
      const recipient = prompt("Enter recipient PAY54 tag or email:");
      if (!recipient) throw new Error("Recipient is required.");

      const { wallet, tx } = applyDebit(amount, getSettings().currency, {
        title: `Transfer to ${recipient}`,
        description: note || `Sent to ${recipient}`,
      });

      showToast("P2P transfer completed (demo).", "success");
      hydrateBalance();
      hydrateTransactions();

      // Pretend WhatsApp share link
      console.log("WHATSAPP DEMO:", `Sent ${amount} to ${recipient}. Ref: ${tx.id}`, wallet);
    },
  });
}

function handleAddMoney() {
  openAmountModal({
    title: "Add money",
    actionLabel: "Add to wallet",
    onSubmit: ({ amount, note }) => {
      applyCredit(amount, getSettings().currency, {
        title: "Wallet top-up",
        description: note || "Top-up via card/bank (demo)",
      });
      showToast("Wallet topped up (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
    },
  });
}

function handleWithdraw() {
  openAmountModal({
    title: "Withdraw to bank",
    actionLabel: "Withdraw",
    onSubmit: ({ amount, note }) => {
      const bank = prompt("Destination bank (demo):");
      const acc = prompt("Account number (10 digits, demo):");
      if (!bank || !acc) throw new Error("Bank and account required.");

      applyDebit(amount, getSettings().currency, {
        title: "Withdrawal to bank",
        description: note || `${bank} • ${acc}`,
      });

      showToast("Withdrawal submitted (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
    },
  });
}

function handleBankTransfer() {
  openAmountModal({
    title: "Bank transfer",
    actionLabel: "Send to bank",
    onSubmit: ({ amount, note }) => {
      const bank = prompt("Bank name (demo):");
      const acc = prompt("Account number (demo):");
      if (!bank || !acc) throw new Error("Bank and account required.");

      applyDebit(amount, getSettings().currency, {
        title: "Bank transfer",
        description: note || `${bank} • ${acc}`,
      });

      showToast("Bank transfer processed (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
    },
  });
}

function handleRequestMoney() {
  openAmountModal({
    title: "Request money",
    actionLabel: "Create request",
    onSubmit: ({ amount, note }) => {
      const msg = `${user.name || "Your contact"} requested ${formatAmount(
        amount,
        getSettings().currency
      )} on PAY54. ${note || ""}`.trim();

      const li = document.createElement("li");
      li.textContent = msg;
      alertsListEl.prepend(li);

      showToast("Money request created (demo).", "success");
    },
  });
}

function handleReceive() {
  const tag = user.tag || "@pay54user";
  openInfoModal(
    "Receive money",
    `
      <p>Share your PAY54 details to receive money:</p>
      <ul>
        <li><strong>PAY54 Tag:</strong> ${tag}</li>
        <li><strong>Account (demo):</strong> 1234567890</li>
      </ul>
      <p>QR code placeholder is shown here in the real app.</p>
      <button class="modal-btn" onclick="navigator.clipboard.writeText('${tag}')">
        Copy tag to clipboard
      </button>
    `
  );
}

// ---- Services handlers ----

function handleFX() {
  openAmountModal({
    title: "Cross-border FX",
    actionLabel: "Preview FX",
    onSubmit: ({ amount }) => {
      const from = getSettings().currency || "NGN";
      const to = from === "NGN" ? "USD" : "NGN";
      const { converted, rate } = fxConvert(amount, from, to);

      openInfoModal(
        "FX Preview",
        `
          <p>You send: <strong>${formatAmount(amount, from)}</strong></p>
          <p>They receive: <strong>${formatAmount(converted, to)}</strong></p>
          <p>Rate: 1 ${from} ≈ ${rate.toFixed(4)} ${to}</p>
          <p>This is a demo-only mock – no real FX happens.</p>
        `
      );
    },
  });
}

function handleBills() {
  openAmountModal({
    title: "Pay bills & top-up",
    actionLabel: "Pay bill",
    onSubmit: ({ amount }) => {
      const kind = prompt("Service: Airtime / Data / Power / TV (demo)");
      applyDebit(amount, getSettings().currency, {
        title: `Bill payment (${kind || "Service"})`,
        description: "PAY54 bills demo",
      });
      showToast("Bill paid (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
    },
  });
}

function handleSavings() {
  openAmountModal({
    title: "Open savings pot",
    actionLabel: "Save now",
    onSubmit: ({ amount, note }) => {
      applyDebit(amount, getSettings().currency, {
        title: "Savings deposit",
        description: note || "Savings pot (demo)",
      });

      // Re-credit in NGN as “savings balance” in a real version – here we log TX only
      showToast("Savings deposit created (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
    },
  });
}

function handleInvest() {
  openAmountModal({
    title: "Investments & stocks",
    actionLabel: "Invest",
    onSubmit: ({ amount, note }) => {
      applyDebit(amount, getSettings().currency, {
        title: "Investment purchase",
        description: note || "Demo ETF/stock",
      });
      showToast("Investment simulated (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
    },
  });
}

function handleCheckout() {
  openInfoModal(
    "PAY54 Smart Checkout",
    `
      <p>This demo simulates PAY54 appearing on e-commerce checkout (like PayPal).</p>
      <p>In the real product, selecting PAY54 on a website would open this app to approve payment.</p>
      <p>For now, we just log a mock “checkout approved” transaction.</p>
      <button class="modal-btn primary" id="checkoutApproveBtn">Approve mock payment</button>
    `
  );

  const btn = document.getElementById("checkoutApproveBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      applyDebit(15000, "NGN", {
        title: "Smart checkout",
        description: "Demo partner payment",
      });
      showToast("Checkout approved (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
      closeModal();
    });
  }
}

function handleShop() {
  openInfoModal(
    "Shop on the Fly",
    `
      <p>Choose a category and we’ll simulate redirecting to a partner:</p>
      <ul>
        <li>🚕 Taxi (Uber, Bolt)</li>
        <li>🍔 Food (JumiaFood, JustEat)</li>
        <li>🎟 Tickets & cinema</li>
        <li>🛒 Fashion & retail</li>
      </ul>
      <p>In this demo, we simply show a toast instead of real redirects.</p>
    `
  );
}

function handleCards() {
  openInfoModal(
    "Virtual & linked cards",
    `
      <p>In the live PAY54 app you’d manage:</p>
      <ul>
        <li>Virtual cards for online payments</li>
        <li>Linked debit cards</li>
        <li>Freeze / unfreeze controls</li>
      </ul>
      <p>This demo keeps it simple and logs card events only.</p>
    `
  );
}

function handleBet() {
  openAmountModal({
    title: "Bet funding (18+)",
    actionLabel: "Fund wallet",
    onSubmit: ({ amount }) => {
      const dob = prompt("Enter DOB (YYYY-MM-DD) – demo age check:");
      if (!dob) throw new Error("DOB required for 18+ verification.");
      applyDebit(amount, getSettings().currency, {
        title: "Bet funding",
        description: `Age-verified funding (demo) • DOB: ${dob}`,
      });
      showToast("Bet wallet funded (demo).", "success");
      hydrateBalance();
      hydrateTransactions();
    },
  });
}

function handleAgent() {
  openInfoModal(
    "Become an Agent",
    `
      <p>Agent onboarding demo form:</p>
      <ul>
        <li>Name & business name</li>
        <li>Location & KYC</li>
        <li>Expected monthly volume</li>
      </ul>
      <p>Submitting this in the real app would send to PAY54 backoffice.</p>
    `
  );

  const li = document.createElement("li");
  li.textContent = "Agent onboarding pending (demo).";
  alertsListEl.prepend(li);
}

function handleRisk() {
  openInfoModal(
    "AI Risk Watch",
    `
      <p>Demo risk feed:</p>
      <ul>
        <li>Unusual login from new device.</li>
        <li>High-value transfer flagged for review.</li>
        <li>Multiple failed PIN attempts detected.</li>
      </ul>
      <p>AI Risk Watch does not block anything in this demo, it only educates.</p>
    `
  );
}

// ---------- Event listeners ----------

document.querySelectorAll("[data-action]").forEach((btn) => {
  const action = btn.dataset.action;
  btn.addEventListener("click", () => {
    switch (action) {
      case "send-p2p":
        handleSendP2P();
        break;
      case "receive":
        handleReceive();
        break;
      case "add-money":
        handleAddMoney();
        break;
      case "withdraw":
        handleWithdraw();
        break;
      case "bank-transfer":
        handleBankTransfer();
        break;
      case "request-money":
        handleRequestMoney();
        break;
      case "fx":
        handleFX();
        break;
      case "bills":
        handleBills();
        break;
      case "savings":
        handleSavings();
        break;
      case "invest":
        handleInvest();
        break;
      case "checkout":
        handleCheckout();
        break;
      case "shop":
        handleShop();
        break;
      case "bet":
        handleBet();
        break;
      case "risk":
        handleRisk();
        break;
      case "cards":
        handleCards();
        break;
      case "agent":
        handleAgent();
        break;
      default:
        console.log("Unhandled action", action);
    }
  });
});

// Quick shortcuts reuse same handlers
document.querySelectorAll("[data-shortcut]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.shortcut;
    switch (key) {
      case "agent":
        handleAgent();
        break;
      case "savings":
        handleSavings();
        break;
      case "shop":
        handleShop();
        break;
      case "invest":
        handleInvest();
        break;
    }
  });
});

// Currency switching
currencyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currency = btn.dataset.currency;
    saveSettings({ currency });
    hydrateCurrencyButtons();
    hydrateBalance();
    showToast(`Viewing wallet in ${currency}.`, "info");
  });
});

// Theme toggle
themeToggleBtn.addEventListener("click", () => {
  const current = getSettings().theme || "dark";
  const next = current === "dark" ? "light" : "dark";
  saveSettings({ theme: next });
  hydrateTheme();
});

// Logout
logoutBtn.addEventListener("click", () => {
  clearSession();
  showToast("Logged out of PAY54.", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 500);
});

// Profile click
profileBtn.addEventListener("click", () => {
  openInfoModal(
    "Profile",
    `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>PAY54 Tag:</strong> ${user.tag}</p>
    `
  );
});

// Clear alerts
clearAlertsBtn.addEventListener("click", () => {
  alertsListEl.innerHTML = `<li class="list-empty">No alerts. You’re all clear ✅</li>`;
});

// View all TX (simple info modal)
viewAllTxBtn.addEventListener("click", () => {
  const list = getTransactions().slice(0, 20);
  if (!list.length) {
    showToast("No transactions yet.", "info");
    return;
  }

  const html = list
    .map(
      (tx) => `
      <li>
        <strong>${tx.title || tx.description || "Activity"}</strong>
        <br/>
        ${tx.type === "debit" ? "-" : "+"}${formatAmount(
        tx.amount,
        tx.currency
      )} · ${new Date(tx.createdAt).toLocaleString()}
      </li>`
    )
    .join("");

  openInfoModal(
    "Transaction history (demo)",
    `<ul class="modal-list">${html}</ul>`
  );
});

// ---------- Boot ----------

hydrateProfile();
hydrateTheme();
hydrateCurrencyButtons();
hydrateBalance();
hydrateTransactions();
seedDemoAlertsIfEmpty();
showToast("Welcome back to PAY54 v7.0", "success");

// assets/js/ui/dashboardUI.js
import {
  getUser,
  ensureLoggedIn,
  logout,
  getTheme,
  setTheme,
  getFxCurrency,
  setFxCurrency,
} from "../core/session.js";

ensureLoggedIn();

const user = getUser();
const state = {
  currency: getFxCurrency(),
  theme: getTheme(),
  balance: 0,
  transactions: [],
  alerts: [
    "Prem requested ₦12,000",
    "Agent onboarding pending",
    "AI Risk Watch flagged unusual login",
  ],
};

const els = {
  balanceAmount: document.getElementById("balanceAmount"),
  balanceSub: document.getElementById("balanceSub"),
  fxWallets: document.getElementById("fxWallets"),
  alertsList: document.getElementById("alertsList"),
  txList: document.getElementById("txList"),
  profileName: document.getElementById("profileName"),
  logoutBtn: document.getElementById("logoutBtn"),
  profileBtn: document.getElementById("profileBtn"),
  clearAlerts: document.getElementById("btnClearAlerts"),
  viewAllTx: document.getElementById("btnViewAllTx"),
  themeToggle: document.getElementById("themeToggle"),
  fxButtons: Array.from(document.querySelectorAll(".pill-fx")),
  addMoneyBtn: document.getElementById("btnAddMoney"),
  withdrawBtn: document.getElementById("btnWithdraw"),
  tiles: Array.from(document.querySelectorAll(".tile")),
  modalRoot: document.getElementById("modalRoot"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalFooter: document.getElementById("modalFooter"),
  modalClose: document.getElementById("modalClose"),
  toastContainer: document.getElementById("toastContainer"),
};

/* ---------- INIT ---------- */

function initTheme() {
  const t = state.theme;
  document.body.classList.toggle("theme-dark", t === "dark");
  document.body.classList.toggle("theme-light", t === "light");
  els.themeToggle.textContent = t === "dark" ? "◐ Dark" : "◑ Light";
}

function initFxButtons() {
  els.fxButtons.forEach((btn) => {
    if (btn.dataset.currency === state.currency) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  els.fxWallets.textContent = `FX wallets: NGN • USD • GBP (demo, base ${state.currency})`;
}

function initProfile() {
  if (!user) return;
  els.profileName.textContent = user.name || "PAY54 User";
}

/* ---------- Render ---------- */

function formatMoney(amount, currency = "NGN") {
  const prefix = currency === "NGN" ? "₦" : currency === "USD" ? "$" : "£";
  return `${prefix}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function renderBalance() {
  els.balanceAmount.textContent = formatMoney(state.balance, state.currency);
  els.balanceSub.textContent = state.balance === 0 ? "Today +₦0 • This month +₦0" : "";
}

function renderAlerts() {
  els.alertsList.innerHTML = "";
  if (!state.alerts.length) {
    const li = document.createElement("li");
    li.textContent = "No active alerts.";
    li.style.opacity = "0.7";
    els.alertsList.appendChild(li);
    return;
  }
  state.alerts.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    els.alertsList.appendChild(li);
  });
}

function renderTxList(limit = 4) {
  els.txList.innerHTML = "";
  if (!state.transactions.length) {
    const li = document.createElement("li");
    li.textContent = "No transactions yet.";
    li.style.opacity = "0.7";
    els.txList.appendChild(li);
    return;
  }
  state.transactions.slice(-limit).reverse().forEach((tx) => {
    const li = document.createElement("li");
    li.textContent = `${tx.type.toUpperCase()} · ${tx.label} · ${formatMoney(
      tx.amount,
      tx.currency
    )}`;
    els.txList.appendChild(li);
  });
}

/* ---------- Modals & Toasts ---------- */

function openModal(title, bodyHtml, footerButtons = []) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = bodyHtml;
  els.modalFooter.innerHTML = "";

  footerButtons.forEach((btnCfg) => {
    const b = document.createElement("button");
    b.textContent = btnCfg.label;
    b.className = "btn-chip btn-small";
    b.addEventListener("click", btnCfg.onClick);
    els.modalFooter.appendChild(b);
  });

  els.modalRoot.classList.remove("hidden");
}

function closeModal() {
  els.modalRoot.classList.add("hidden");
}

function showToast(message) {
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = message;
  els.toastContainer.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 3000);
}

/* ---------- Action handlers ---------- */

function recordTx({ type, label, amount, currency }) {
  state.transactions.push({
    type,
    label,
    amount,
    currency,
    ts: new Date().toISOString(),
  });
  renderTxList();
}

function handleAddMoney() {
  openModal(
    "Add money",
    `
      <p>Top up your PAY54 wallet (demo only).</p>
      <label>Amount (NGN)</label>
      <input id="addAmount" type="number" min="1" placeholder="5000" />
      <label>Source</label>
      <select id="addSource">
        <option value="card">Linked card</option>
        <option value="bank">Bank transfer</option>
        <option value="agent">Agent deposit</option>
      </select>
    `,
    [
      {
        label: "Cancel",
        onClick: closeModal,
      },
      {
        label: "Add funds",
        onClick: () => {
          const amount = Number(
            document.getElementById("addAmount").value || "0"
          );
          if (!amount || amount <= 0) {
            alert("Enter a valid amount.");
            return;
          }
          const source = document.getElementById("addSource").value;
          state.balance += amount;
          renderBalance();
          recordTx({
            type: "credit",
            label: `Wallet top-up (${source})`,
            amount,
            currency: "NGN",
          });
          closeModal();
          showToast("Wallet topped up (demo).");
        },
      },
    ]
  );
}

function handleWithdraw() {
  openModal(
    "Withdraw",
    `
      <p>Withdraw funds to your bank (demo).</p>
      <label>Amount (NGN)</label>
      <input id="wdAmount" type="number" min="1" placeholder="5000" />
      <label>Destination bank</label>
      <input id="wdBank" placeholder="UBA / GTBank / Access…" />
      <label>Account number</label>
      <input id="wdAccount" placeholder="0123456789" />
    `,
    [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Withdraw",
        onClick: () => {
          const amount = Number(
            document.getElementById("wdAmount").value || "0"
          );
          if (!amount || amount <= 0 || amount > state.balance) {
            alert("Invalid amount or insufficient balance.");
            return;
          }
          state.balance -= amount;
          renderBalance();
          recordTx({
            type: "debit",
            label: "Withdrawal to bank",
            amount,
            currency: "NGN",
          });
          closeModal();
          showToast("Withdrawal simulated.");
        },
      },
    ]
  );
}

function handleSend() {
  openModal(
    "Send PAY54 → PAY54",
    `
      <p>Send money to another PAY54 wallet (demo).</p>
      <label>Recipient PayTag / Email / Phone</label>
      <input id="sendRecipient" placeholder="@prem54 / user@example.com" />
      <label>Amount (NGN)</label>
      <input id="sendAmount" type="number" min="1" placeholder="2000" />
      <label>Note (optional)</label>
      <input id="sendNote" placeholder="Match day snacks…" />
    `,
    [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Send now",
        onClick: () => {
          const amount = Number(
            document.getElementById("sendAmount").value || "0"
          );
          const rec = document.getElementById("sendRecipient").value.trim();
          if (!rec || !amount || amount <= 0 || amount > state.balance) {
            alert("Enter recipient and a valid amount within your balance.");
            return;
          }
          state.balance -= amount;
          renderBalance();
          recordTx({
            type: "debit",
            label: `P2P to ${rec}`,
            amount,
            currency: "NGN",
          });
          closeModal();
          showToast("P2P transfer simulated.");
        },
      },
    ]
  );
}

function handleReceive() {
  const tag = "@pay54/" + (user?.name?.split(" ")[0] || "user");
  openModal(
    "Receive money",
    `
      <p>Share your details to receive PAY54 transfers (demo).</p>
      <label>Wallet ID</label>
      <input value="PAY54-${user?.phone || "0000"}" readonly />
      <label>PayTag</label>
      <input value="${tag}" readonly />
      <p>QR code (placeholder):</p>
      <div style="padding:16px;border-radius:12px;background:#020617;text-align:center;">
        <span>QR • Demo Only</span>
      </div>
      <p style="font-size:12px;opacity:0.8;margin-top:8px;">
        Use WhatsApp or SMS to share your PayTag with friends &amp; family.
      </p>
    `,
    [
      { label: "Close", onClick: closeModal },
      {
        label: "Copy tag",
        onClick: () => {
          navigator.clipboard
            .writeText(tag)
            .then(() => showToast("PayTag copied"))
            .catch(() => showToast("Copy failed (browser limit)"));
        },
      },
    ]
  );
}

function handleRequestMoney() {
  openModal(
    "Request money",
    `
      <p>Create a payment request (demo only).</p>
      <label>From (name or PayTag)</label>
      <input id="rqFrom" placeholder="@friend54" />
      <label>Amount (NGN)</label>
      <input id="rqAmount" type="number" min="1" placeholder="5000" />
      <label>Message</label>
      <input id="rqMessage" placeholder="For match tickets…" />
    `,
    [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Create request",
        onClick: () => {
          const from = document.getElementById("rqFrom").value.trim();
          const amount = Number(
            document.getElementById("rqAmount").value || "0"
          );
          if (!from || !amount || amount <= 0) {
            alert("Enter who and how much.");
            return;
          }
          state.alerts.unshift(`Request sent to ${from} for ₦${amount}`);
          renderAlerts();
          closeModal();
          showToast("Request created (demo).");
        },
      },
    ]
  );
}

function handleFx() {
  openModal(
    "Cross-border FX",
    `
      <p>Simulate sending NGN abroad (demo).</p>
      <label>You send (NGN)</label>
      <input id="fxAmount" type="number" min="1" placeholder="50000" />
      <label>They receive currency</label>
      <select id="fxCurrency">
        <option value="USD">USD</option>
        <option value="GBP">GBP</option>
        <option value="EUR">EUR</option>
      </select>
      <label>Country</label>
      <select id="fxCountry">
        <option value="US">United States</option>
        <option value="UK">United Kingdom</option>
        <option value="NG">Nigeria</option>
        <option value="GH">Ghana</option>
        <option value="KE">Kenya</option>
        <option value="ZA">South Africa</option>
      </select>
    `,
    [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Preview FX",
        onClick: () => {
          const amount = Number(
            document.getElementById("fxAmount").value || "0"
          );
          const ccy = document.getElementById("fxCurrency").value;
          if (!amount || amount <= 0) {
            alert("Enter amount in NGN.");
            return;
          }
          const rate = ccy === "USD" ? 1500 : ccy === "GBP" ? 1900 : 1600;
          const fxValue = amount / rate;
          alert(
            `FX preview (demo): You send ₦${amount.toLocaleString()} → They receive ${ccy} ${fxValue.toFixed(
              2
            )}`
          );
        },
      },
    ]
  );
}

function handleBills() {
  openModal(
    "Pay bills",
    `
      <p>Simulate airtime or utility top-up.</p>
      <label>Service</label>
      <select id="billService">
        <option value="airtime">Airtime</option>
        <option value="data">Data</option>
        <option value="power">Power</option>
        <option value="tv">TV</option>
      </select>
      <label>Account / Meter / Phone</label>
      <input id="billRef" placeholder="0803…, meter ID, IUC no…" />
      <label>Amount (NGN)</label>
      <input id="billAmount" type="number" min="1" placeholder="3000" />
    `,
    [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Pay bill",
        onClick: () => {
          const amount = Number(
            document.getElementById("billAmount").value || "0"
          );
          if (!amount || amount <= 0 || amount > state.balance) {
            alert("Enter a valid amount within your balance.");
            return;
          }
          const svc = document.getElementById("billService").value;
          state.balance -= amount;
          renderBalance();
          recordTx({
            type: "debit",
            label: `Bill payment (${svc})`,
            amount,
            currency: "NGN",
          });
          closeModal();
          showToast("Bill payment simulated.");
        },
      },
    ]
  );
}

function simpleInfoAction(title, message) {
  openModal(
    title,
    `<p>${message}</p><p style="font-size:12px;opacity:0.8;">This is a demo preview. No real payments are processed.</p>`,
    [{ label: "Close", onClick: closeModal }]
  );
}

/* ---------- Wire events ---------- */

function wireEvents() {
  // Header
  els.logoutBtn.addEventListener("click", () => logout());

  els.profileBtn.addEventListener("click", () => {
    const nm = user?.name || "PAY54 User";
    const em = user?.email || "demo@example.com";
    const ph = user?.phone || "N/A";
    simpleInfoAction(
      "Profile",
      `Name: ${nm}<br />Email: ${em}<br />Phone: ${ph}<br />Tier: Demo wallet`
    );
  });

  els.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    setTheme(state.theme);
    initTheme();
  });

  // FX buttons
  els.fxButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currency = btn.dataset.currency;
      setFxCurrency(state.currency);
      initFxButtons();
      renderBalance();
    });
  });

  // Balance buttons
  els.addMoneyBtn.addEventListener("click", handleAddMoney);
  els.withdrawBtn.addEventListener("click", handleWithdraw);

  // Tiles
  els.tiles.forEach((tile) => {
    const action = tile.dataset.action;
    tile.addEventListener("click", () => {
      switch (action) {
        case "send":
          handleSend();
          break;
        case "receive":
          handleReceive();
          break;
        case "add":
          handleAddMoney();
          break;
        case "withdraw":
          handleWithdraw();
          break;
        case "bank-transfer":
          handleBills(); // simple reuse
          break;
        case "request":
          handleRequestMoney();
          break;
        case "fx":
          handleFx();
          break;
        case "savings":
          simpleInfoAction(
            "Savings & goals",
            "Create and track savings pots. In this demo, behaviour is mocked."
          );
          break;
        case "bills":
          handleBills();
          break;
        case "cards":
          simpleInfoAction(
            "Virtual & linked cards",
            "Manage virtual cards, lock/unlock and choose default card. UI demo only."
          );
          break;
        case "checkout":
          simpleInfoAction(
            "PAY54 Smart Checkout",
            "When you choose PAY54 at checkout, payment requests will appear here for approval."
          );
          break;
        case "shop":
          simpleInfoAction(
            "Shop on the Fly",
            "Browse partner categories like Taxi, Food, Tickets, and Shops. Demo only."
          );
          break;
        case "invest":
          simpleInfoAction(
            "Investments & stocks",
            "View mock assets, see performance, and simulate small investments."
          );
          break;
        case "bet":
          simpleInfoAction(
            "Bet funding",
            "Simulates topping up licensed betting wallets with age verification (18+)."
          );
          break;
        case "risk":
          simpleInfoAction(
            "AI Risk Watch",
            "Preview of suspicious logins and high-risk activities monitored by PAY54."
          );
          break;
        case "agent":
          simpleInfoAction(
            "Become an Agent",
            "Submit details to become a PAY54 agent. In this demo, we show a preview only."
          );
          break;
        default:
          showToast("Coming soon (demo).");
      }
    });
  });

  // Alerts
  els.clearAlerts.addEventListener("click", () => {
    state.alerts = [];
    renderAlerts();
    showToast("Alerts cleared (demo).");
  });

  // Transactions
  els.viewAllTx.addEventListener("click", () => {
    if (!state.transactions.length) {
      simpleInfoAction("Transactions", "No transactions yet in this demo.");
      return;
    }
    const rows = state.transactions
      .slice()
      .reverse()
      .map(
        (tx) =>
          `<li>${tx.type.toUpperCase()} · ${tx.label} · ${formatMoney(
            tx.amount,
            tx.currency
          )}</li>`
      )
      .join("");
    openModal(
      "All transactions",
      `<ul class="list-plain">${rows}</ul>`,
      [{ label: "Close", onClick: closeModal }]
    );
  });

  // Modal
  els.modalClose.addEventListener("click", closeModal);
  els.modalRoot.addEventListener("click", (e) => {
    if (e.target === els.modalRoot) closeModal();
  });
}

/* ---------- Initial boot ---------- */

function init() {
  initTheme();
  initFxButtons();
  initProfile();
  renderBalance();
  renderAlerts();
  renderTxList();
  wireEvents();
}

init();

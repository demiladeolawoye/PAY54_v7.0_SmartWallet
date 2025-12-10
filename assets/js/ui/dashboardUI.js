// ============================================================
// PAY54 v7.0 • Dashboard UI Wiring
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.dashboardUI = (function () {
  function renderBalance() {
    const acct = P.walletEngine.getActiveAccount();
    if (!acct) return;

    const balanceEl = document.querySelector("[data-balance-amount]");
    const kycEl = document.querySelector("[data-balance-kyc]");
    const acctEl = document.querySelector("[data-balance-account]");
    const tagEl = document.querySelector("[data-balance-tag]");

    if (balanceEl) {
      balanceEl.textContent = P.utils.formatMoney(acct.balance, acct.currency);
    }
    if (kycEl) {
      kycEl.textContent = P.user.kycTier;
    }
    if (acctEl) {
      acctEl.textContent = `${acct.number} • ${acct.bank}`;
    }
    if (tagEl) {
      tagEl.textContent = P.user.tag;
    }
  }

  function renderCurrencies() {
    document
      .querySelectorAll("[data-currency-pill]")
      .forEach((pill) => {
        const code = pill.dataset.currencyPill;
        pill.classList.toggle("active", code === P.walletEngine.currentCurrency);
        pill.addEventListener("click", () => {
          P.walletEngine.setCurrency(code);
          renderCurrencies();
        });
      });
  }

  function renderTransactions() {
    const list = document.querySelector("[data-tx-list]");
    if (!list) return;
    const txs = P.walletEngine.getTransactions(6);
    list.innerHTML = txs
      .map((tx) => {
        const sign = tx.type === "debit" ? "-" : "+";
        const cls = tx.type === "debit" ? "debit" : "credit";
        return `
          <li class="tx-item">
            <div class="tx-meta">
              <div class="tx-title">${tx.title}</div>
              <div class="tx-sub">${new Date(tx.createdAt).toLocaleString()}</div>
            </div>
            <div class="tx-amount ${cls}">
              ${sign}${P.utils.formatMoney(Math.abs(tx.amount), tx.currency)}
            </div>
          </li>`;
      })
      .join("");
  }

  function renderRequests() {
    const list = document.querySelector("[data-requests-list]");
    if (!list) return;
    list.innerHTML = P.user.requests
      .map((r) => `<li class="request-item">${r.text}</li>`)
      .join("");
  }

  function initProfile() {
    const pill = document.querySelector("[data-profile-pill]");
    if (!pill) return;
    const initial = pill.querySelector("[data-profile-initial]");
    const name = pill.querySelector("[data-profile-name]");
    const meta = pill.querySelector("[data-profile-meta]");
    if (initial) initial.textContent = P.user.name[0] || "P";
    if (name) name.textContent = P.user.name;
    if (meta) meta.textContent = "PAY54 demo profile";

    pill.addEventListener("click", () => {
      P.modals.open({
        title: "Profile & Settings",
        subtitle: "Demo profile information",
        submitLabel: "Close",
        onSubmit: (_, close) => close(),
        bodyHtml: `
          <div class="receipt-block">
            <div class="receipt-row"><span>Name</span><span>${P.user.name}</span></div>
            <div class="receipt-row"><span>PayTag</span><span>${P.user.tag}</span></div>
            <div class="receipt-row"><span>KYC Tier</span><span>${P.user.kycTier}</span></div>
            <div class="receipt-row"><span>Wallet ID</span><span>${P.user.accounts.NGN.number}</span></div>
          </div>
        `
      });
    });
  }

  function init() {
    renderBalance();
    renderCurrencies();
    renderTransactions();
    renderRequests();
    initProfile();

    document.addEventListener("pay54:wallet:update", () => {
      renderBalance();
      renderTransactions();
    });

    document.addEventListener("pay54:wallet:change", () => {
      renderBalance();
      renderTransactions();
    });
  }

  return { init };
})();


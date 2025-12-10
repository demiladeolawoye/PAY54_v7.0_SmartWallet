
// ============================================================
// PAY54 v7.0 • Wallet Engine
// Handles balances & transactions collection
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.walletEngine = {
  currentCurrency: "NGN",

  setCurrency(code) {
    if (!P.user.accounts[code]) return;
    this.currentCurrency = code;
    document.dispatchEvent(new CustomEvent("pay54:wallet:change", {
      detail: { currency: code }
    }));
  },

  getActiveAccount() {
    return P.user.accounts[this.currentCurrency];
  },

  getTransactions(limit = 6) {
    return P.user.transactions.slice(0, limit);
  },

  applyDelta(amount, currency = this.currentCurrency, meta = {}) {
    const account = P.user.accounts[currency];
    if (!account) return false;
    account.balance += amount;
    P.user.transactions.unshift({
      id: P.utils.uid("tx"),
      amount,
      currency,
      type: amount >= 0 ? "credit" : "debit",
      title: meta.title || "Wallet update",
      subtitle: meta.subtitle || "",
      createdAt: P.utils.now()
    });
    document.dispatchEvent(new CustomEvent("pay54:wallet:update"));
    return true;
  }
};

// ============================================================
// PAY54 v7.0 • Core Utils
// Global namespace + helpers
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.utils = {
  formatMoney(amount, currency = "NGN") {
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(amount);
    const locale = currency === "USD" ? "en-US" :
                   currency === "GBP" ? "en-GB" : "en-NG";
    const code = currency;
    return (
      sign +
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2
      }).format(abs)
    );
  },

  now() {
    return new Date().toISOString();
  },

  uid(prefix = "tx") {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
  }
};


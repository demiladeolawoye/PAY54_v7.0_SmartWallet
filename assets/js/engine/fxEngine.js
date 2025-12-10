// ============================================================
// PAY54 v7.0 • FX Engine (Demo Rates)
// Handles NGN ⇄ USD/GBP/EUR conversions
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

const RATES = {
  NGN: { USD: 0.0010, GBP: 0.0008, EUR: 0.0009 },
  USD: { NGN: 1000 },
  GBP: { NGN: 1200 },
  EUR: { NGN: 1100 }
};

P.fxEngine = {
  quote({ from, to, amount }) {
    const map = RATES[from] || {};
    const rate = map[to] || 0;
    const receive = amount * rate;
    return { rate, receive };
  },

  convert({ from, to, amount }) {
    const { rate, receive } = this.quote({ from, to, amount });
    if (!rate) throw new Error("FX pair not supported in demo.");
    // adjust balances
    P.walletEngine.applyDelta(-amount, from, {
      title: `FX • ${from} → ${to}`,
      subtitle: "Cross-border rails"
    });
    P.walletEngine.applyDelta(receive, to, {
      title: `FX credit • ${to}`,
      subtitle: "Cross-border rails"
    });
    return { rate, receive, reference: P.utils.uid("fx") };
  }
};


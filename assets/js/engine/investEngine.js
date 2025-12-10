// ============================================================
// PAY54 v7.0 • Investments & Stocks Engine (Demo)
// Tracks simple local portfolio
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

const storeKey = "pay54_demo_portfolio";

function loadPortfolio() {
  try {
    const raw = localStorage.getItem(storeKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePortfolio(items) {
  localStorage.setItem(storeKey, JSON.stringify(items));
}

P.investEngine = {
  getPortfolio() {
    return loadPortfolio();
  },

  buy({ symbol, amountNGN }) {
    const acct = P.walletEngine.getActiveAccount();
    if (acct.currency !== "NGN") {
      throw new Error("Demo investments use NGN wallet only.");
    }
    if (amountNGN <= 0 || amountNGN > acct.balance) {
      throw new Error("Invalid amount or insufficient balance.");
    }

    P.walletEngine.applyDelta(-amountNGN, "NGN", {
      title: `Invest in ${symbol}`,
      subtitle: "Mock portfolio"
    });

    const items = loadPortfolio();
    items.push({
      id: P.utils.uid("inv"),
      symbol,
      amountNGN,
      createdAt: P.utils.now()
    });
    savePortfolio(items);

    return {
      symbol,
      amountNGN,
      reference: P.utils.uid("inv_rcpt")
    };
  }
};


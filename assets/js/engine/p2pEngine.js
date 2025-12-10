// ============================================================
// PAY54 v7.0 • P2P Engine
// Send, Receive, Request money (demo)
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.p2pEngine = {
  send({ recipient, amount, note }) {
    const acct = P.walletEngine.getActiveAccount();
    if (amount <= 0 || amount > acct.balance) {
      throw new Error("Insufficient balance or invalid amount.");
    }
    P.walletEngine.applyDelta(-amount, acct.currency, {
      title: `Send to ${recipient}`,
      subtitle: note || "Instant P2P transfer"
    });
    return {
      reference: P.utils.uid("p2p"),
      recipient,
      amount,
      currency: acct.currency,
      note,
      fee: 0
    };
  },

  add({ amount, source }) {
    const acct = P.walletEngine.getActiveAccount();
    P.walletEngine.applyDelta(amount, acct.currency, {
      title: "Wallet top-up",
      subtitle: source || "Linked card"
    });
    return {
      reference: P.utils.uid("topup"),
      amount,
      currency: acct.currency,
      source
    };
  },

  withdraw({ amount, bank, account }) {
    const acct = P.walletEngine.getActiveAccount();
    if (amount <= 0 || amount > acct.balance) {
      throw new Error("Insufficient balance or invalid amount.");
    }
    P.walletEngine.applyDelta(-amount, acct.currency, {
      title: "Withdrawal",
      subtitle: `${bank} • ${account}`
    });
    return {
      reference: P.utils.uid("wd"),
      amount,
      currency: acct.currency,
      bank,
      account
    };
  }
};


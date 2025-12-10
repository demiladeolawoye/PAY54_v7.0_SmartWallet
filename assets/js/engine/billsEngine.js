// ============================================================
// PAY54 v7.0 • Bills Engine (Airtime/Data/Power/TV)
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.billsEngine = {
  pay({ category, referenceId, amount }) {
    const acct = P.walletEngine.getActiveAccount();
    if (amount <= 0 || amount > acct.balance) {
      throw new Error("Insufficient balance.");
    }
    P.walletEngine.applyDelta(-amount, acct.currency, {
      title: `Pay bills • ${category}`,
      subtitle: referenceId
    });
    return {
      reference: P.utils.uid("bill"),
      category,
      referenceId,
      amount,
      currency: acct.currency
    };
  }
};


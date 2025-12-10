// ============================================================
// PAY54 v7.0 • User Model (Demo)
// Single mock user for UI simulation
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

P.user = {
  id: "user_001",
  name: "Demi Olawoye",
  tag: "@pay54demo",
  kycTier: "Tier 2 • NG+Global",
  accounts: {
    NGN: {
      number: "0123456789",
      bank: "PAY54 MFB (Demo)",
      balance: 880000,
      currency: "NGN"
    },
    USD: {
      number: "US-001-8890",
      bank: "PAY54 Global Wallet",
      balance: 1200,
      currency: "USD"
    },
    GBP: {
      number: "GB-088-0091",
      bank: "PAY54 UK Wallet",
      balance: 880,
      currency: "GBP"
    }
  },
  transactions: [
    {
      id: "tx_1",
      title: "Wallet top-up",
      subtitle: "Visa • 0893",
      amount: 52000,
      currency: "NGN",
      type: "credit",
      createdAt: P.utils.now()
    },
    {
      id: "tx_2",
      title: "MTN Airtime",
      subtitle: "Pay bills • Airtime",
      amount: -12000,
      currency: "NGN",
      type: "debit",
      createdAt: P.utils.now()
    },
    {
      id: "tx_3",
      title: "FX → USD",
      subtitle: "Cross-border FX",
      amount: -10000,
      currency: "NGN",
      type: "debit",
      createdAt: P.utils.now()
    }
  ],
  requests: [
    { id: "rq_1", text: "Prem requested ₦12,000", createdAt: P.utils.now() },
    { id: "rq_2", text: "Agent onboarding pending", createdAt: P.utils.now() },
    { id: "rq_3", text: "AI Risk Watch flagged unusual login", createdAt: P.utils.now() }
  ]
};


// assets/js/core/session.js
// PAY54 v7.0 • Session, Wallet & Storage helpers

const USER_KEY = "pay54_user";
const SETTINGS_KEY = "pay54_settings";
const WALLET_KEY = "pay54_wallet";
const TX_KEY = "pay54_transactions";

// ---------- User helpers ----------

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("PAY54 getUser error", e);
    return null;
  }
}

export function saveUser(user) {
  const payload = { ...user };
  localStorage.setItem(USER_KEY, JSON.stringify(payload));
  return payload;
}

export function getActiveUser() {
  const user = getUser();
  if (user && user.loggedIn) return user;
  return null;
}

export function setLoggedIn(flag) {
  const user = getUser();
  if (!user) return null;
  const updated = { ...user, loggedIn: !!flag };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSession() {
  // Keep profile & wallet, just mark logged out
  setLoggedIn(false);
}

// ---------- Settings (currency + theme) ----------

const defaultSettings = {
  currency: "NGN",
  theme: "dark",
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings) {
  const merged = { ...getSettings(), ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  return merged;
}

// ---------- Wallet & Transactions ----------

const defaultWallet = {
  currency: "NGN",
  balances: {
    NGN: 0,
    USD: 0,
    GBP: 0,
  },
};

export function getWallet() {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    return raw ? { ...defaultWallet, ...JSON.parse(raw) } : { ...defaultWallet };
  } catch {
    return { ...defaultWallet };
  }
}

export function saveWallet(wallet) {
  localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  return wallet;
}

export function getTransactions() {
  try {
    const raw = localStorage.getItem(TX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(list) {
  localStorage.setItem(TX_KEY, JSON.stringify(list));
  return list;
}

export function addTransaction(tx) {
  const list = getTransactions();
  const withId = {
    id: `TX-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    createdAt: new Date().toISOString(),
    ...tx,
  };
  list.unshift(withId);
  saveTransactions(list);
  return withId;
}

// ---------- Utility helpers for currency & amounts ----------

export function formatAmount(amount, currency = "NGN") {
  const num = Number(amount) || 0;
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "₦";
  return `${symbol}${num.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function applyDebit(amount, currency = "NGN", meta = {}) {
  const wallet = getWallet();
  const c = currency || wallet.currency || "NGN";

  const current = Number(wallet.balances[c] || 0);
  const value = Number(amount || 0);

  if (value <= 0) throw new Error("Amount must be greater than zero.");
  if (value > current) throw new Error("Insufficient balance.");

  wallet.balances[c] = current - value;
  saveWallet(wallet);

  const tx = addTransaction({
    type: "debit",
    currency: c,
    amount: value,
    ...meta,
  });

  return { wallet, tx };
}

export function applyCredit(amount, currency = "NGN", meta = {}) {
  const wallet = getWallet();
  const c = currency || wallet.currency || "NGN";

  const current = Number(wallet.balances[c] || 0);
  const value = Number(amount || 0);

  if (value <= 0) throw new Error("Amount must be greater than zero.");

  wallet.balances[c] = current + value;
  saveWallet(wallet);

  const tx = addTransaction({
    type: "credit",
    currency: c,
    amount: value,
    ...meta,
  });

  return { wallet, tx };
}

// ---------- Simple FX helper (mock rates) ----------

const FX_RATES = {
  NGN: { NGN: 1, USD: 0.00086, GBP: 0.00067 },
  USD: { NGN: 1160, USD: 1, GBP: 0.78 },
  GBP: { NGN: 1360, USD: 1.28, GBP: 1 },
};

export function fxConvert(amount, from = "NGN", to = "USD") {
  const value = Number(amount || 0);
  const rate = FX_RATES[from]?.[to] ?? 1;
  const converted = value * rate;
  return {
    converted,
    rate,
  };
}

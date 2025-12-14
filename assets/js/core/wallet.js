(function () {
  const WALLET_KEY = "p54_wallet";
  const DEFAULT_WALLET = {
    currency: "NGN",
    balances: {
      NGN: 52000,
      USD: 120,
      GBP: 80,
      EUR: 95
    },
    transactions: []
  };

  function loadWallet() {
    return JSON.parse(localStorage.getItem(WALLET_KEY)) || DEFAULT_WALLET;
  }

  function saveWallet(wallet) {
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  }

  function getSymbol(c) {
    return { NGN: "₦", USD: "$", GBP: "£", EUR: "€" }[c];
  }

  function setCurrency(currency) {
    const wallet = loadWallet();
    wallet.currency = currency;
    saveWallet(wallet);
    render();
  }

  function adjust(amount, type, note) {
    const wallet = loadWallet();
    wallet.balances[wallet.currency] += amount;
    wallet.transactions.unshift({
      type,
      amount,
      currency: wallet.currency,
      note,
      date: new Date().toISOString()
    });
    saveWallet(wallet);
    render();
  }

  function render() {
    const wallet = loadWallet();
    const balanceEl = document.getElementById("walletBalance");
    const txEl = document.getElementById("txList");

    if (balanceEl) {
      balanceEl.innerText =
        getSymbol(wallet.currency) +
        wallet.balances[wallet.currency].toFixed(2);
    }

    if (txEl) {
      txEl.innerHTML = "";
      wallet.transactions.slice(0, 5).forEach(tx => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${tx.note}</span>
          <strong>${getSymbol(tx.currency)}${tx.amount.toFixed(2)}</strong>
        `;
        txEl.appendChild(li);
      });
    }
  }

  // expose
  window.P54Wallet = {
    render,
    setCurrency,
    add: (amt) => adjust(amt, "credit", "Wallet top-up"),
    send: (amt) => adjust(-amt, "debit", "Send money"),
    withdraw: (amt) => adjust(-amt, "debit", "Withdraw")
  };

  document.addEventListener("DOMContentLoaded", render);
})();

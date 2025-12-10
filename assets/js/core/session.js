// assets/js/core/session.js

const USER_KEY = "pay54:user";
const THEME_KEY = "pay54:theme";
const FX_KEY = "pay54:fxCurrency";

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getUser();
}

export function ensureLoggedIn() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  window.location.href = "login.html";
}

// THEME (dark / light)

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

// FX currency preference

export function getFxCurrency() {
  return localStorage.getItem(FX_KEY) || "NGN";
}

export function setFxCurrency(code) {
  localStorage.setItem(FX_KEY, code);
}

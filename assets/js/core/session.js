/* ============================================================
   PAY54 v7.0 • Session Manager
   Handles: signup, login, logout, user storage
   ============================================================ */

const KEY = "pay54_user";

export function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function updateUser(patch) {
  const existing = getUser();
  if (!existing) return;
  const updated = { ...existing, ...patch };
  saveUser(updated);
}

export function logout() {
  localStorage.removeItem(KEY);
  window.location.href = "login.html";
}

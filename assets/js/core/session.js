/* ============================================================
   PAY54 v7.0 • Session Manager
   Handles login, logout, and user persistence
   ============================================================ */

export function saveUser(user) {
    localStorage.setItem("pay54_user", JSON.stringify(user));
}

export function getUser() {
    const u = localStorage.getItem("pay54_user");
    return u ? JSON.parse(u) : null;
}

export function logout() {
    localStorage.removeItem("pay54_user");
    window.location.href = "index.html";
}

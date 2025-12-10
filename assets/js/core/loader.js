// loader.js — FIXED for GitHub Pages

import { getUser } from "./session.js";

const root = document.getElementById("app");

// Always use relative paths for GitHub Pages
const ROUTES = {
    login: "./login.html",
    dashboard: "./dashboard.html",
};

export function loadPage(page) {
    const url = ROUTES[page];

    fetch(url)
        .then(res => res.text())
        .then(html => {
            root.innerHTML = html;
        })
        .catch(err => {
            root.innerHTML = `<p style="color:#fff">Error loading ${page}: ${err}</p>`;
        });
}

// Auto-launch behaviour
window.addEventListener("DOMContentLoaded", () => {
    const user = getUser();

    if (user) {
        loadPage("dashboard");
    } else {
        loadPage("login");
    }
});

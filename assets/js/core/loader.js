/* ============================================================
   PAY54 v7.0 • App Loader
   Loads theme, session, router, and mounts UI
   ============================================================ */

import { loadPage } from "./router.js";
import { getUser } from "./session.js";

window.addEventListener("load", () => {
    const user = getUser();

    if (!document.getElementById("app")) {
        console.error("APP ROOT NOT FOUND");
        return;
    }

    if (user) {
        loadPage("dashboard.html");
    } else {
        loadPage("login.html");
    }
});


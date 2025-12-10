/* ============================================================
   PAY54 v7.0 • Loader
   Decides where index.html sends the user:
   - If logged in  → dashboard.html
   - If not logged → login.html
   ============================================================ */

import { getUser } from "./session.js";

window.addEventListener("load", () => {
  const user = getUser();
  if (user) {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "login.html";
  }
});

/* ============================================================
   PAY54 v7.0 • Router System
   Controls: Page switching, authentication redirects
   ============================================================ */

export function loadPage(page) {
    fetch(page)
        .then(res => res.text())
        .then(html => {
            document.getElementById("app").innerHTML = html;
        })
        .catch(err => console.error("Router error:", err));
}

export function goto(page) {
    loadPage(page);
}


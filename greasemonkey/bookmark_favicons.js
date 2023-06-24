// ==UserScript==
// @name        favicons in qutebrowser's bookmarks page
// @include     qute://bookmarks/
// ==/UserScript==

window.addEventListener("load", () => {
    const selector = "table > tbody > tr";
    for (const row of document.querySelectorAll(selector)) {
        const url = row.querySelector("td.url > a[href]")?.href;
        if (url) {
            const cell = document.createElement("td");
            cell.className = "icon";
            const icon = document.createElement("img");
            const src = new URL("http://www.google.com/s2/favicons");
            src.searchParams.append("domain", url);
            icon.src = src;
            cell.appendChild(icon);
            row.insertBefore(cell, row.firstChild);
        }
    }
});
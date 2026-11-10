// Builds the "On this page" list from each section's <h2> and highlights the section being read.
// A section can set a shorter label with data-toc="...".
(function () {
    const list = document.querySelector(".toc-list");
    if (!list) return;

    const slug = (text) =>
        text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

    const used = new Set();
    const items = [];

    document.querySelectorAll(".container section").forEach((section) => {
        const heading = section.querySelector("h2");
        if (!heading) return;

        let id = section.id || slug(heading.textContent);
        while (used.has(id)) id += "-2";
        used.add(id);
        section.id = id;

        const link = document.createElement("a");
        link.href = "#" + id;
        link.textContent = section.dataset.toc || heading.textContent.trim();

        const li = document.createElement("li");
        li.appendChild(link);
        list.appendChild(li);
        items.push({ section, link });
    });

    let ticking = false;
    function update() {
        ticking = false;
        const offset = 140;
        let current = items[0];
        for (const item of items) {
            if (item.section.getBoundingClientRect().top - offset <= 0) current = item;
        }
        // At the very bottom, highlight the last section even if it is short.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            current = items[items.length - 1];
        }
        items.forEach((item) => {
            const on = item === current;
            item.link.classList.toggle("active", on);
            if (on) item.link.setAttribute("aria-current", "location");
            else item.link.removeAttribute("aria-current");
        });
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    update();
})();

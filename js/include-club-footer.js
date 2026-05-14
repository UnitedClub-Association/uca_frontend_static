document.addEventListener("DOMContentLoaded", function () {
    const clubThemes = {
        'ulic-club': 'theme-ict'
    };

    const currentPath = window.location.pathname;
    let activeTheme = '';

    for (const pathKey in clubThemes) {
        if (currentPath.includes(pathKey)) {
            activeTheme = clubThemes[pathKey];
            break;
        }
    }

    // Apply theme directly to the body if found
    if (activeTheme && !document.body.classList.contains(activeTheme)) {
        document.body.classList.add(activeTheme);
    }

    // Create a placeholder element for the footer
    let footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) {
        footerPlaceholder = document.createElement("div");
        footerPlaceholder.id = "footer-placeholder";
        document.body.appendChild(footerPlaceholder);
    }

    // Fetch the footer HTML
    fetch("/components/footer.html")
        .then((response) => {
            if (!response.ok) throw new Error("Footer component not found");
            return response.text();
        })
        .then((data) => {
            footerPlaceholder.innerHTML = data;

            // GUARANTEED execution to set the year the exact moment HTML is injected
            const yearSpan = document.getElementById("copyright-year");
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }

            // Initialize Feather Icons if available
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        })
        .catch((error) => console.error("Error loading themed footer:", error));
});
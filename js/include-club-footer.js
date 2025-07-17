document.addEventListener("DOMContentLoaded", function () {
    const clubThemes = {
        'debate-club': 'theme-debate',
        'photography-club': 'theme-photo',
        'sports-club': 'theme-sports',
        'quiz-club': 'theme-quiz',
        'science-club': 'theme-science',
        'ict-club': 'theme-ict',
        'language-club': 'theme-language',
        'cultural-club': 'theme-cultural',
        'green-club': 'theme-green',
        'literature-club': 'theme-literature'
    };

    const currentPath = window.location.pathname;
    let activeTheme = '';

    for (const pathKey in clubThemes) {
        if (currentPath.includes(pathKey)) {
            activeTheme = clubThemes[pathKey];
            break;
        }
    }

    // This script assumes the theme class is already on the body
    // from the navbar include script. If not, uncomment the next block.
    /*
    if (activeTheme && !document.body.classList.contains(activeTheme)) {
        document.body.classList.add(activeTheme);
    }
    */

    // Create a placeholder element for the footer
    const footerPlaceholder = document.getElementById("footer-placeholder") || document.createElement("div");
    if (!footerPlaceholder.id) {
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

            // Initialize Feather Icons if available
            if (typeof feather !== 'undefined') {
                feather.replace({ 'aria-hidden': 'true' });
            }
        })
        .catch((error) => console.error("Error loading themed footer:", error));
});

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

  if (activeTheme) {
    document.body.classList.add(activeTheme);
  }

  // Create a placeholder element for the navbar
  const navbarPlaceholder = document.getElementById("navbar-placeholder") || document.createElement("div");
  if (!navbarPlaceholder.id) {
    navbarPlaceholder.id = "navbar-placeholder";
    document.body.prepend(navbarPlaceholder);
  }

  // Fetch the navbar HTML
  fetch("/components/navbar.html")
    .then((response) => {
      if (!response.ok) throw new Error("Navbar component not found");
      return response.text();
    })
    .then((data) => {
      navbarPlaceholder.innerHTML = data;

      // Inject the logo
      const logoContainer = document.createElement("a");
      logoContainer.href = "/index.html";
      logoContainer.classList.add("logo-container");
      logoContainer.innerHTML = `
        <img src="/images/uca_logo.png" alt="UCA Logo" class="logo-img">
        <div class="logo-text">
          <span class="logo-text-main">UCA</span>
          <span class="logo-text-sub">United Club Association</span>
        </div>
      `;
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        navbar.prepend(logoContainer);
      }

      // Load main navbar script
      const script = document.createElement("script");
      script.src = "/js/navbar.js";
      document.head.appendChild(script);
    })
    .catch((error) => console.error("Error loading themed navbar:", error));
});

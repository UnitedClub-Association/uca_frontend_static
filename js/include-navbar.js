document.addEventListener("DOMContentLoaded", function () {
  // 1. Safely find or create the placeholder (Fixes the double navbar bug)
  let navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (!navbarPlaceholder) {
    navbarPlaceholder = document.createElement("div");
    navbarPlaceholder.id = "navbar-placeholder";
    document.body.prepend(navbarPlaceholder);
  }

  // 2. Fetch the navbar HTML
  fetch("/components/navbar.html")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((data) => {
      navbarPlaceholder.innerHTML = data;

      // 3. Initialize Feather Icons
      if (typeof feather !== "undefined") {
        feather.replace();
      }

      // 4. Safely load the navbar functionality script
      if (!window.enhancedNavbarScriptLoaded) {
        const script = document.createElement("script");
        script.src = "/js/navbar.js";
        document.head.appendChild(script);
        window.enhancedNavbarScriptLoaded = true;
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));
});
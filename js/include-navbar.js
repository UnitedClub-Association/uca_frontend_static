document.addEventListener("DOMContentLoaded", function () {
  // Create a placeholder element for the navbar
  const navbarPlaceholder = document.createElement("div");
  navbarPlaceholder.id = "navbar-placeholder";
  document.body.prepend(navbarPlaceholder); // Insert at the top of the body

  // Fetch the navbar HTML
  fetch("/html/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      
      // Clear existing content safely
      while (navbarPlaceholder.firstChild) {
        navbarPlaceholder.removeChild(navbarPlaceholder.firstChild);
      }
      
      // Create and append navbar elements safely
      const navContent = doc.querySelector('nav');
      if (navContent) {
        const safeNav = document.createElement('nav');
        safeNav.className = navContent.className;
        
        // Transfer nav items safely
        Array.from(navContent.children).forEach(child => {
          const safeChild = document.createElement(child.tagName.toLowerCase());
          
          // Copy safe attributes
          for (const attr of child.attributes) {
            if (['class', 'id', 'href', 'role', 'aria-label'].includes(attr.name)) {
              safeChild.setAttribute(attr.name, attr.value);
            }
          }
          
          safeChild.textContent = child.textContent;
          safeNav.appendChild(safeChild);
        });
        
        navbarPlaceholder.appendChild(safeNav);
      }
  
      // Create and append logo elements (existing code remains the same)
      const logoContainer = document.createElement("a");
      logoContainer.href = "/index.html";
      logoContainer.classList.add("logo-container");
  
      const logoImg = document.createElement("img");
      logoImg.src = "/images/DU_Logo.png";
      logoImg.alt = "UCA Logo";
      logoImg.classList.add("logo-img");
  
      const logoText = document.createElement("div");
      logoText.classList.add("logo-text");
  
      const logoTextMain = document.createElement("span");
      logoTextMain.classList.add("logo-text-main");
      logoTextMain.textContent = "UCA";
  
      const logoTextSub = document.createElement("span");
      logoTextSub.classList.add("logo-text-sub");
      logoTextSub.textContent = "United Club Association";
  
      // Safe DOM manipulation using appendChild
      logoText.appendChild(logoTextMain);
      logoText.appendChild(logoTextSub);
      logoContainer.appendChild(logoImg);
      logoContainer.appendChild(logoText);
  
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        navbar.prepend(logoContainer);
      }
  
      // Event listeners remain the same as they don't involve innerHTML
      const burger = document.querySelector(".navbar__toggle");
      const navLinks = document.querySelector(".navbar__menu");
      if (burger && navLinks) {
        burger.addEventListener("click", function () {
          navLinks.classList.toggle("active");
        });
      }
  
      // Outside click handler
      document.addEventListener("click", function (event) {
        if (burger && navLinks && 
            !burger.contains(event.target) && 
            !navLinks.contains(event.target)) {
          navLinks.classList.remove("active");
        }
      });
  
      // Initialize Feather Icons if available
      if (window.feather) {
        feather.replace();
      }
    })
    .catch((error) => {
      console.error('Error loading navbar:', error);
    });
});

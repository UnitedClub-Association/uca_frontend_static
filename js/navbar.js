document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navbarToggle = document.querySelector(".navbar__toggle");
  const navbarMenu = document.querySelector(".navbar__menu");
  const dropdownItems = document.querySelectorAll(".navbar__item.dropdown");

  if (!navbar || !navbarToggle || !navbarMenu) return;

  // Toggle mobile menu
  navbarToggle.addEventListener("click", () => {
    navbarToggle.classList.toggle("active");
    navbarMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Handle dropdowns on mobile
  dropdownItems.forEach((item) => {
    const link = item.querySelector(":scope > .navbar__link");
    if (link) {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdownItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove("active");
              const otherMenu = other.querySelector(".dropdown__menu");
              if (otherMenu) otherMenu.style.maxHeight = "0";
            }
          });
          item.classList.toggle("active");
          const menu = item.querySelector(".dropdown__menu");
          if (menu) {
            menu.style.maxHeight = item.classList.contains("active") ? `${menu.scrollHeight}px` : "0";
          }
        }
      });
    }
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!navbarMenu.contains(e.target) && !navbarToggle.contains(e.target) && navbarMenu.classList.contains("active")) {
      navbarMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
      dropdownItems.forEach((item) => {
        item.classList.remove("active");
        const menu = item.querySelector(".dropdown__menu");
        if (menu) menu.style.maxHeight = "0";
      });
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navbarMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
      dropdownItems.forEach((item) => {
        item.classList.remove("active");
        const menu = item.querySelector(".dropdown__menu");
        if (menu) menu.style.maxHeight = "";
      });
    }
  });

  // Scroll effect
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.pageYOffset > 50);
  }, { passive: true });
});
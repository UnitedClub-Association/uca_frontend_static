document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const navbar = document.querySelector(".navbar");
  const navbarToggle = document.querySelector(".navbar__toggle");
  const navbarMenu = document.querySelector(".navbar__menu");
  const dropdownItems = document.querySelectorAll(".navbar__item.dropdown");

  if (!navbar || !navbarToggle || !navbarMenu) return;

  // GSAP timeline for mobile menu animation
  const menuItems = gsap.utils.toArray(".navbar__item");
  const menuTl = gsap.timeline({ paused: true, reversed: true });

  menuTl.to(navbarMenu, { right: 0, duration: 0.4, ease: "power2.inOut" })
        .fromTo(menuItems, {
            opacity: 0,
            x: 30
        }, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power2.out",
            stagger: 0.05
        }, "-=0.2");

  // Toggle mobile menu
  navbarToggle.addEventListener("click", () => {
    navbarToggle.classList.toggle("active");
    document.body.classList.toggle("menu-open");
    menuTl.reversed() ? menuTl.play() : menuTl.reverse();
  });

  // Handle dropdowns on mobile
  dropdownItems.forEach((item) => {
    const link = item.querySelector(":scope > .navbar__link");
    if (link) {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const wasActive = item.classList.contains("active");

          // Close other dropdowns
          dropdownItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove("active");
              const otherMenu = other.querySelector(".dropdown__menu");
              if (otherMenu) gsap.to(otherMenu, { maxHeight: 0, duration: 0.3, ease: "power1.inOut" });
            }
          });

          // Toggle current dropdown
          item.classList.toggle("active");
          const menu = item.querySelector(".dropdown__menu");
          if (menu) {
            const newMaxHeight = !wasActive ? menu.scrollHeight : 0;
            gsap.to(menu, { maxHeight: newMaxHeight, duration: 0.4, ease: "power2.inOut" });
          }
        }
      });
    }
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!navbarMenu.contains(e.target) && !navbarToggle.contains(e.target) && !menuTl.reversed()) {
      navbarToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
      menuTl.reverse();
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      document.body.classList.remove("menu-open");
      navbarToggle.classList.remove("active");
      if (!menuTl.reversed()) {
        menuTl.reverse().then(() => menuTl.seek(0)); // Reverse and reset
      }
      dropdownItems.forEach((item) => {
        item.classList.remove("active");
        const menu = item.querySelector(".dropdown__menu");
        if (menu) gsap.set(menu, { clearProps: "maxHeight" });
      });
    }
  });

  // Scroll effect using GSAP for smoothness
  ScrollTrigger.create({
    start: "top top-=" + (navbar.offsetHeight + 1),
    onUpdate: self => {
      navbar.classList.toggle("scrolled", self.direction === 1);
    },
    onLeaveBack: () => {
      navbar.classList.remove("scrolled");
    }
  });
});
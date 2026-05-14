document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // --- 1. Robust Feather Icons Initialization ---
  const initIcons = () => {
    if (typeof feather !== "undefined") {
      feather.replace();
    } else {
      setTimeout(initIcons, 50);
    }
  };
  initIcons();

  // --- 2. Deep Starry Night Background ---
  const initStarfield = () => {
    if (prefersReducedMotion || typeof anime === "undefined") return; 

    const starBg = document.querySelector(".constellation-bg");
    if (!starBg) return;

    const numStars = isDesktop ? 120 : 50;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        let size = Math.random() < 0.85 ? (Math.random() * 1.5 + 0.5) : (Math.random() * 2.5 + 1);
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.opacity = Math.random() * 0.7 + 0.1;
        starBg.appendChild(star);
    }
    
    anime({
        targets: '.star',
        opacity: [
            { value: () => anime.random(0.1, 0.3), duration: () => anime.random(4000, 7000) },
            { value: () => anime.random(0.6, 1), duration: () => anime.random(4000, 7000) }
        ],
        scale: [
            { value: 1, duration: () => anime.random(4000, 7000) },
            { value: () => anime.random(1.1, 1.4), duration: () => anime.random(4000, 7000) }
        ],
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
        delay: anime.stagger(25),
    });
  };

  // --- 3. GSAP Reveals ---
  const initGsapAnimations = () => {
    if (prefersReducedMotion || typeof gsap === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".gsap-fade-up, .gsap-hero-item", {
      opacity: 0,
      y: 35
    });

    // Hero Entry
    gsap.timeline({ defaults: { ease: "power2.out", duration: 1.8 }})
      .to(".gsap-hero-item", { opacity: 1, y: 0, stagger: 0.25, delay: 0.2 });
      
    // Category Fades
    gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
      gsap.to(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
        opacity: 1, y: 0, duration: 1.5, ease: "power2.out"
      });
    });
  };

  // --- 4. Smooth Accordion Logic ---
  const initAccordion = () => {
    const triggers = document.querySelectorAll(".accordion-trigger");

    triggers.forEach(trigger => {
      trigger.addEventListener("click", function() {
        const item = this.closest(".accordion-item");
        const content = item.querySelector(".accordion-content");
        const isActive = item.classList.contains("is-active");

        // Close all other items in the same list
        const parentList = item.closest(".accordion-list");
        const allItems = parentList.querySelectorAll(".accordion-item");
        
        allItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains("is-active")) {
            otherItem.classList.remove("is-active");
            otherItem.querySelector(".accordion-content").style.maxHeight = null;
          }
        });

        // Toggle clicked item
        if (isActive) {
          item.classList.remove("is-active");
          content.style.maxHeight = null;
        } else {
          item.classList.add("is-active");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
  };

  initStarfield();
  initGsapAnimations();
  initAccordion();
  
});
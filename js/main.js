document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Check for a desktop environment (has a mouse pointer for hovering)
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // --- Constellation Background with anime.js ---
  const initStarfield = () => {
    // Exit if the user prefers reduced motion or the library isn't loaded
    if (prefersReducedMotion || typeof anime === "undefined") {
      return; 
    }

    const starBg = document.querySelector(".constellation-bg");
    if (!starBg) return;

    // Use fewer stars on mobile for better performance
    const numStars = isDesktop ? 150 : 50;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        const size = Math.random() * 1.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        starBg.appendChild(star);
    }
    
    // Twinkling animation for all devices
    anime({
        targets: '.star',
        opacity: [
            { value: () => anime.random(0.2, 0.8), duration: () => anime.random(500, 1500) },
            { value: 0, duration: () => anime.random(500, 1500) }
        ],
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        delay: anime.stagger(10),
    });

    // --- ENHANCEMENT: Only run mouse-move parallax on desktop ---
    if (isDesktop) {
      const { width, height } = starBg.getBoundingClientRect();
      starBg.addEventListener('mousemove', (e) => {
          const mouseX = e.clientX / width - 0.5;
          const mouseY = e.clientY / height - 0.5;
          
          anime({
              targets: '.star',
              translateX: () => mouseX * (Math.random() * 15 + 5),
              translateY: () => mouseY * (Math.random() * 15 + 5),
              easing: 'easeOutQuad',
              duration: 500
          });
      });
    }
  };

  // --- GSAP One-Time Scroll Animations ---
  const initGsapAnimations = () => {
    if (prefersReducedMotion || typeof gsap === "undefined") {
      console.warn("GSAP not loaded or motion disabled, skipping animations.");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states for elements to be animated
    gsap.set(".gsap-fade-up, .gsap-stagger-item, .gsap-hero-item", {
      opacity: 0,
      y: 40
    });

    // Hero Animation (runs on page load)
    gsap.timeline({ defaults: { ease: "power3.out", duration: 1 }})
      .to(".gsap-hero-item", {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        delay: 0.5
      });
      
    // Generic Fade-Up elements on scroll
    gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
      gsap.to(elem, {
        scrollTrigger: { 
          trigger: elem, 
          start: "top 85%", 
          // This is the key for a ONE-TIME animation. It plays and then does nothing else.
          toggleActions: "play none none none" 
        },
        opacity: 1, y: 0, duration: 1, ease: "power3.out"
      });
    });

    // Staggered Grids on scroll
    gsap.utils.toArray(".about-stats, .club-grid, .event-grid").forEach(container => {
        gsap.to(container.querySelectorAll(".gsap-stagger-item"), {
            scrollTrigger: { 
              trigger: container, 
              start: "top 85%", 
              toggleActions: "play none none none" // ONE-TIME animation
            },
            opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out"
        });
    });
    
    // Stats Counter on scroll
    gsap.utils.toArray(".stat-number").forEach(stat => {
      const target = parseInt(stat.dataset.count, 10);
      ScrollTrigger.create({
        trigger: stat,
        start: "top 85%",
        once: true, // Another way to ensure it only runs once
        onEnter: () => {
          gsap.fromTo(stat, { innerText: 0 }, {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            onUpdate: function() {
              const currentVal = Math.ceil(this.targets()[0].innerText);
              // Logic to add a '+' for numbers over 100
              if (target >= 100 && this.progress() === 1) {
                stat.innerText = currentVal + "+";
              } else {
                stat.innerText = currentVal;
              }
            }
          });
        }
      });
    });
  };

  // --- Initializers ---
  // These functions will now run reliably after the page content is loaded.
  initStarfield();
  initGsapAnimations();
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Feather Icons
  if (typeof feather !== "undefined") {
    // Use a small timeout to allow content to render before replacing icons
    setTimeout(() => feather.replace({ width: "1em", height: "1em", "stroke-width": 1.5 }), 100);
  }
});
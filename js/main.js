document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- NEW: High-Quality Constellation Background with anime.js ---
  const initStarfield = () => {
    if (prefersReducedMotion || typeof anime === "undefined") {
      return; // Don't run animation if disabled or library not loaded
    }

    const starBg = document.querySelector(".constellation-bg");
    if (!starBg) return;

    const numStars = 150;
    const layers = [
      { selector: '.star-layer-1', z: 1, count: Math.floor(numStars * 0.3), size: 1 }, // Far
      { selector: '.star-layer-2', z: 2, count: Math.floor(numStars * 0.4), size: 1.5 }, // Mid
      { selector: '.star-layer-3', z: 3, count: Math.floor(numStars * 0.3), size: 2.2 }  // Near
    ];

    const { width, height } = starBg.getBoundingClientRect();

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        const size = Math.random() * 1.5 + 0.5; // Random base size
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        starBg.appendChild(star);
    }
    
    // Animate stars with anime.js
    anime({
        targets: '.star',
        opacity: [
            { value: () => anime.random(0.2, 0.8), duration: () => anime.random(500, 1500) },
            { value: 0, duration: () => anime.random(500, 1500) }
        ],
        scale: [
            { value: () => anime.random(1, 1.5), duration: () => anime.random(800, 1600) }
        ],
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        delay: anime.stagger(10),
    });

    // Parallax effect on mouse move
    starBg.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / width - 0.5;
        const mouseY = e.clientY / height - 0.5;
        
        anime({
            targets: '.star',
            translateX: (el) => mouseX * (Math.random() * 15 + 5),
            translateY: (el) => mouseY * (Math.random() * 15 + 5),
            easing: 'easeOutQuad',
            duration: 500
        });
    });
  };

  // --- GSAP Animations ---
  const initGsapAnimations = () => {
    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded, skipping animations.");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states
    if (!prefersReducedMotion) {
      gsap.set(".gsap-fade-up, .gsap-stagger-item, .gsap-hero-item", {
        opacity: 0,
        y: 40
      });
    }

    // Hero Animation
    gsap.timeline({ defaults: { ease: "power3.out", duration: 1 }})
      .to(".gsap-hero-item", {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        delay: 0.5
      });
      
    // Generic Fade-Up
    gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
      gsap.to(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
        opacity: 1, y: 0, duration: 1, ease: "power3.out"
      });
    });

    // Staggered Grids
    gsap.utils.toArray(".about-stats, .club-grid, .event-grid").forEach(container => {
        gsap.to(container.querySelectorAll(".gsap-stagger-item"), {
            scrollTrigger: { trigger: container, start: "top 85%", toggleActions: "play none none none" },
            opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out"
        });
    });
    
    // Stats Counter
    gsap.utils.toArray(".stat-number").forEach(stat => {
      const target = parseInt(stat.dataset.count, 10);
      ScrollTrigger.create({
        trigger: stat,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (!prefersReducedMotion) {
            gsap.fromTo(stat, { innerText: 0 }, {
              innerText: target,
              duration: 2,
              ease: "power2.out",
              snap: { innerText: 1 },
              onUpdate: function() {
                const currentVal = Math.ceil(this.targets()[0].innerText);
                stat.innerText = currentVal + (target >= 100 && this.progress() === 1 ? "+" : "");
              }
            });
          } else {
            stat.textContent = target >= 100 ? `${target}+` : target;
          }
        }
      });
    });
  };

  // --- Initializers ---
  // Wait for animation libraries to be ready
  const libsReady = (callback, libs = ['gsap', 'ScrollTrigger', 'anime']) => {
    const check = () => {
        if (libs.every(lib => window[lib] || (window.gsap && window.gsap[lib]))) {
            callback();
        } else {
            setTimeout(check, 50);
        }
    };
    check();
  };

  libsReady(() => {
    initStarfield();
    initGsapAnimations();
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Feather Icons
  if (typeof feather !== "undefined") {
    const initFeather = () => feather.replace({ width: "1em", height: "1em", "stroke-width": 1.5 });
    setTimeout(initFeather, 100);
  }
});
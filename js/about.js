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

  // --- 2. Professional Deep Starry Night Background (Tailored for About Hero) ---
  const initStarfield = () => {
    if (prefersReducedMotion || typeof anime === "undefined") return; 

    const starBg = document.querySelector(".constellation-bg");
    if (!starBg) return;

    // Density adjusted for the shorter hero height
    const numStars = isDesktop ? 150 : 60;

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
    
    // Slow, elegant astronomical twinkle
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

  // --- 3. Buttery Smooth GSAP Reveals & Timeline Animation ---
  const initGsapAnimations = () => {
    if (prefersReducedMotion || typeof gsap === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Initial states for smooth slide-ups
    gsap.set(".gsap-fade-up, .gsap-stagger-item, .gsap-hero-item", {
      opacity: 0,
      y: 35
    });

    // Hero timeline entry
    gsap.timeline({ defaults: { ease: "power2.out", duration: 1.8 }})
      .to(".gsap-hero-item", { opacity: 1, y: 0, stagger: 0.25, delay: 0.2 });
      
    // Standard section fades
    gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
      gsap.to(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
        opacity: 1, y: 0, duration: 1.5, ease: "power2.out"
      });
    });

    // Custom animation for the Constellation Timeline line
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        gsap.fromTo(timelineLine, 
            { scaleY: 0, transformOrigin: "top center" },
            { 
                scaleY: 1, 
                duration: 2.5, 
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: ".timeline-container",
                    start: "top 75%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Staggered grids (Timeline nodes, Mission panels, Values catalog)
    gsap.utils.toArray(".timeline-container, .editorial-grid, .catalog-grid").forEach(container => {
        gsap.to(container.querySelectorAll(".gsap-stagger-item"), {
            scrollTrigger: { trigger: container, start: "top 85%", toggleActions: "play none none none" },
            opacity: 1, y: 0, stagger: 0.2, duration: 1.2, ease: "power2.out"
        });
    });
  };

  // Ensure DOM is ready, then initialize
  initStarfield();
  initGsapAnimations();
  
});
document.addEventListener("DOMContentLoaded", () => {
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof gsap === "undefined" || typeof Flip === "undefined") {
    console.warn("GSAP/Flip not loaded, skipping animations and showing content.");
    document.querySelectorAll(".gsap-hero-item, .event-card, .gsap-fade-up > *, .gsap-cta .cta-content > *").forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger, Flip);

  function initAnimations() {
    if (prefersReducedMotion) {
      gsap.set(".gsap-hero-item, .event-card, .gsap-fade-up > *, .gsap-cta .cta-content > *", { opacity: 1, visibility: 'visible', y: 0 });
    } else {
      animateHero();
      animateGrid();
      setupScrollTriggers();
      if (isDesktop) {
        animateHeroBackground();
      }
    }
    if (typeof feather !== "undefined") {
      setTimeout(() => feather.replace({ width: "1em", height: "1em", "stroke-width": 1.5 }), 200);
    }
  }

  const animateHero = () => {
    gsap.set(".gsap-hero-item", { opacity: 0, y: 40 });
    gsap.to(".gsap-hero-item", {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      delay: 0.2,
      duration: 1.2,
      ease: "power3.out"
    });
  };

  const animateHeroBackground = () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    const layers = gsap.utils.toArray(".constellation-layer");
    
    const moveX = gsap.quickTo(layers, "x", { duration: 0.7, ease: "power3" });
    const moveY = gsap.quickTo(layers, "y", { duration: 0.7, ease: "power3" });

    heroSection.addEventListener("mousemove", e => {
      const { width, height } = heroSection.getBoundingClientRect();
      const x = e.clientX - width / 2;
      const y = e.clientY - height / 2;
      
      layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed || 1);
        moveX(x * 0.02 * speed);
        moveY(y * 0.03 * speed);
      });
    });
  };

  const animateGrid = () => {
    const container = document.querySelector(".gsap-flip-container");
    const cards = gsap.utils.toArray(".gsap-event-card");
    if (!container || !cards.length) return;

    ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const state = Flip.getState(cards);
        container.classList.add("simple-grid-for-flip");
        gsap.set(cards, { autoAlpha: 0, yPercent: 30 });
        Flip.from(state, {
          duration: 1.4,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
          autoAlpha: 1,
          yPercent: 0,
          onComplete: () => {
            container.classList.remove("simple-grid-for-flip");
            gsap.set(cards, { clearProps: "all" }); 
            if (isDesktop) {
              cards.forEach(apply3dCardHover);
            }
          }
        });
      }
    });
  };
  
  const apply3dCardHover = (card) => {
    const ROTATION_FACTOR = 8;
    const SCALE_FACTOR = 1.04;
    const Y_TRANSLATE = -10;

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.6 }});
    tl.to(card, { scale: SCALE_FACTOR, y: Y_TRANSLATE });

    card.addEventListener('mouseenter', () => tl.play());
    card.addEventListener('mouseleave', () => {
      tl.reverse();
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
    });

    card.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotationY = ROTATION_FACTOR * ((x - width / 2) / width);
      const rotationX = -ROTATION_FACTOR * ((y - height / 2) / height);
      
      gsap.to(card, { rotationY, rotationX, ease: "power1.out", duration: 1 });
    });
  };

  const setupScrollTriggers = () => {
    // === THE FIX IS HERE ===
    // This now correctly animates the "Featured Events" heading.
    gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
      // 1. Set the initial state directly in JavaScript
      gsap.set(elem.children, { opacity: 0, y: 40 });
      // 2. Animate TO the final state on scroll
      gsap.to(elem.children, {
        scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power3.out", 
        stagger: 0.1
      });
    });

    gsap.utils.toArray(".gsap-cta").forEach(section => {
      gsap.from(section.querySelectorAll(".cta-content > *"), {
        scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        opacity: 0, y: 50, duration: 1.2, ease: "power3.out", stagger: 0.15
      });
      
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        '--glow-opacity': 1,
        '--glow-scale': 1.2,
        ease: 'power1.inOut'
      });
    });
  };

  initAnimations();
});
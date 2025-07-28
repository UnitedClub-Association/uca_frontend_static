document.addEventListener('DOMContentLoaded', () => {
  const checkDependencies = setInterval(() => {
    if (window.gsap && window.ScrollTrigger && window.feather) {
      clearInterval(checkDependencies);
      initPageAnimations();
    }
  }, 100);

  function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    feather.replace();

    // Set initial states for all animated elements
    gsap.set('.club-title, .club-subtitle, .deco-bg-text', { opacity: 0 });
    gsap.set('.ui-panel', { opacity: 0, y: 50 });
    gsap.set('.subsection-title, .contribution-list, .feature-list li, .action-link', { opacity: 0, y: 20 });
    
    // --- Master Page Load Animation Timeline ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.deco-bg-text', { opacity: 1, duration: 1.5 })
      .to('.club-title', { opacity: 1, duration: 1 }, 0.5)
      .from('.club-title', { y: 30, duration: 1 }, 0.5)
      .to('.club-subtitle', { opacity: 1, duration: 1 }, 0.8)
      .from('.club-subtitle', { y: 20, duration: 1 }, 0.8)
      
      .to('.ui-panel:nth-of-type(1)', { opacity: 1, y: 0, duration: 1 }, 1.2)
      .to('.ui-panel:nth-of-type(1) .panel-header, .ui-panel:nth-of-type(1) p', { opacity: 1, y: 0, stagger: 0.1 }, 1.5)
      .to('.ui-panel:nth-of-type(1) .subsection-title', { opacity: 1, y: 0 }, 1.8)
      .to('.ui-panel:nth-of-type(1) .contribution-list', { opacity: 1, y: 0, stagger: 0.2 }, 2.0)
      .to('.ui-panel:nth-of-type(1) .feature-list li', { opacity: 1, y: 0, stagger: 0.1 }, 2.2)

      .to('.ui-panel:nth-of-type(2)', { opacity: 1, y: 0, duration: 1 }, 1.5)
      .to('.ui-panel:nth-of-type(2) .panel-header, .ui-panel:nth-of-type(2) p', { opacity: 1, y: 0, stagger: 0.1 }, 1.8)
      .to('.ui-panel:nth-of-type(2) .action-link', { opacity: 1, y: 0, stagger: 0.1 }, 2.0);

    // --- NEW: Parallax Scroll for "GRID" Text ---
    gsap.to('.deco-bg-text', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
  }
});
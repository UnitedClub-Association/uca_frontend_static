document.addEventListener('DOMContentLoaded', () => {
  const checkDependencies = setInterval(() => {
    if (window.gsap && window.ScrollTrigger && window.feather) {
      clearInterval(checkDependencies);
      initPageAnimations();
    }
  }, 100);

  function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Sometimes icons are added dynamically; ensure they are rendered.
    feather.replace();

    // --- 1. Header Entrance Animation ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.club-logo-container', { 
        duration: 1.2, 
        scale: 0.5, 
        opacity: 0, 
        ease: 'elastic.out(1, 0.75)' 
      })
      .from('.club-title', { 
        duration: 0.8, 
        y: 50, 
        opacity: 0 
      }, '-=0.8')
      .from('.club-subtitle', { 
        duration: 0.8, 
        y: 30, 
        opacity: 0 
      }, '-=0.6');

    // --- 2. Content Cards Scroll Animation ---
    const contentCards = gsap.utils.toArray('.content-card');
    contentCards.forEach(card => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // --- 3. Staggered Feature List Animation ---
    const featureItems = gsap.utils.toArray('.feature-list li');
    gsap.from(featureItems, {
      opacity: 0,
      x: -30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.feature-list',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
});
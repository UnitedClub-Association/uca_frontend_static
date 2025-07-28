document.addEventListener('DOMContentLoaded', () => {
  const checkDependencies = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(checkDependencies);
      initPageAnimations();
    }
  }, 100);

  function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Header Drawing Animation ---
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Animate the SVG border to "draw" itself
    tl.to('.header-ornament path', {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: 'power1.inOut'
      })
      // Fade in the text after the drawing starts
      .from('.club-title, .club-tagline', {
        opacity: 0,
        y: 30,
        duration: 1.5,
        stagger: 0.2
      }, '-=1.5');


    // --- 2. Scroll-Triggered Section Reveals ---
    const sections = gsap.utils.toArray('.fade-in-section');
    
    sections.forEach(section => {
      gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }
});
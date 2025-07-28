document.addEventListener('DOMContentLoaded', () => {
  const checkDependencies = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(checkDependencies);
      initPageAnimations();
    }
  }, 100);

  function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Shimmering Header Gradient ---
    gsap.to('.club-header', {
      backgroundPosition: '150% 150%',
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // --- 2. Parallax Logo ---
    gsap.to('.club-logo', {
      yPercent: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.club-header',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // --- 3. Page Load Animations ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.club-logo', { opacity: 0, scale: 0.5, y: 50, duration: 1 })
      .from('.club-title', { opacity: 0, y: 30, duration: 1 }, "-=0.7")
      .from('.club-description', { opacity: 0, y: 20, duration: 0.8 }, "-=0.7");
    
    // --- 4. Scroll-Triggered Animations ---
    const scrollElements = gsap.utils.toArray('.about-section, .connect-section');
    scrollElements.forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.from('.feature-list li', {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.feature-list',
            start: 'top 85%'
        }
    });
  }
});
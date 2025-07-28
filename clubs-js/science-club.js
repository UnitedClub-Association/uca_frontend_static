document.addEventListener('DOMContentLoaded', () => {
  const checkDependencies = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(checkDependencies);
      initPageAnimations();
    }
  }, 100);

  function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Interactive Nebula Background ---
    const body = document.body;
    body.addEventListener('mousemove', e => {
      gsap.to(body, {
        '--mouse-x': `${(e.clientX / window.innerWidth) * 100}%`,
        '--mouse-y': `${(e.clientY / window.innerHeight) * 100}%`,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // --- 2. Header Entrance Animation ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});

    tl.from('.header-title', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1.2
      })
      .from('.club-description', {
        opacity: 0,
        y: 30,
        duration: 1
      }, '-=0.8');

    // --- 3. Scroll-Triggered Animations ---
    const labCards = gsap.utils.toArray('.lab-card');
    labCards.forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Staggered animation for the experiment list
    const experimentItems = gsap.utils.toArray('.experiment-list li');
    gsap.from(experimentItems, {
      opacity: 0,
      x: -40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.experiment-list',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
});
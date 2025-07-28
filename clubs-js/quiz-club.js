document.addEventListener('DOMContentLoaded', () => {
  const checkDependencies = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(checkDependencies);
      initPageAnimations();
    }
  }, 100);

  function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Interactive Card Glow Effect ---
    const cards = document.querySelectorAll('.question-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(card, {
          '--mouse-x': `${(x / rect.width) * 100}%`,
          '--mouse-y': `${(y / rect.height) * 100}%`,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            '--mouse-x': '50%',
            '--mouse-y': '50%',
            duration: 0.6,
            ease: 'power2.out'
        });
      });
    });

    // --- 2. Page Load Animations ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    tl.from('.club-logo', { scale: 0.5, opacity: 0, ease: 'back.out(1.7)' })
      .from('.club-title', { y: 40, opacity: 0 }, '-=0.8')
      .from('.club-description', { y: 20, opacity: 0 }, '-=0.7');

    // --- 3. Scroll-Triggered Card Animation ---
    gsap.from('.question-card', {
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.club-content',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }
});
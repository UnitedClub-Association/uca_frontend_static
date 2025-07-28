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

    // --- 1. Interactive Header Animation ---
    const header = document.querySelector('.club-header');
    if (header) {
      // Add a subtle 3D tilt effect on mouse move
      header.addEventListener('mousemove', (e) => {
        const { offsetWidth: width, offsetHeight: height } = header;
        const { clientX, clientY } = e;
        
        // Calculate mouse position from center
        const x = (clientX / width - 0.5) * 2;
        const y = (clientY / window.innerHeight - 0.5) * 2;

        gsap.to(header, {
          rotationY: x * 5,
          rotationX: y * -5,
          transformPerspective: 500,
          ease: 'power1.out',
          duration: 1.5
        });
      });
      // Reset on mouse leave
      header.addEventListener('mouseleave', () => {
        gsap.to(header, {
          rotationY: 0,
          rotationX: 0,
          ease: 'power3.out',
          duration: 1
        });
      });
    }

    // --- 2. Page Load Animations ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.club-title, .club-subtitle', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.2
      })
      .from('.club-tagline', { opacity: 0, y: 20, duration: 1 }, "-=0.8");

    // --- 3. Scroll-Triggered Animations ---
    
    // Animate "About" section
    gsap.fromTo('.about-content', 
      { opacity: 0, x: -50 }, 
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.split-layout',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Animate Photo Gallery
    gsap.fromTo('.photo-gallery',
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.split-layout',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Staggered animation for gallery items
    gsap.from('.gallery-item', {
      opacity: 0,
      scale: 0.9,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.photo-gallery',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Animate "Join CTA" section
    gsap.fromTo('.join-cta',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.join-cta',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }
});
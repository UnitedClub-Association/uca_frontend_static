/**
 * Snapfest 2024 - Revamped Interactive Animations
 *
 * This script uses GSAP for a full "scrollytelling" experience, including
 * parallax effects, sequential timeline animations, and interactive 3D elements.
 *
 * @version 2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for GSAP and SplitText to be available
    const checkLibraries = setInterval(() => {
        if (window.gsap && window.SplitText) {
            clearInterval(checkLibraries);
            initAnimations();
        }
    }, 100);
});

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Set initial states for all animated elements to prevent flashing
    gsap.set("[data-animate]", { autoAlpha: 0 });

    initHeroAnimation();
    initTimelineAnimation();
    initGalleryAnimation();
    initCtaAnimation();
    initInteractiveCards();
}

/**
 * Creates the hero section entrance and parallax background effect.
 */
function initHeroAnimation() {
    // Parallax background
    gsap.to('.hero-background', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        },
    });

    // Animate hero text content on load
    const heroTitle = new SplitText('[data-animate="hero-title"]', { type: 'chars' });
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to('[data-animate="hero-title"]', { autoAlpha: 1 })
      .from(heroTitle.chars, {
          y: 80,
          opacity: 0,
          stagger: 0.03,
          ease: 'power3.out',
          duration: 1,
      })
      .to('[data-animate="hero-subtitle"]', { autoAlpha: 1, y: 0 }, '-=0.8')
      .to('[data-animate="hero-text"]', { autoAlpha: 1, y: 0 }, '-=0.7')
      .to('[data-animate="hero-scroll"]', { autoAlpha: 1 }, '-=0.5');

    gsap.set('[data-animate="hero-subtitle"], [data-animate="hero-text"]', { y: 30 });
}

/**
 * Animates the timeline section, including the line and cards.
 */
function initTimelineAnimation() {
    // Animate the vertical timeline line drawing down
    gsap.to('.timeline-line', {
        scaleY: 1,
        scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top center',
            end: 'bottom bottom',
            scrub: 1,
        },
    });

    // Animate each card as it enters the viewport
    document.querySelectorAll('[data-animate="timeline-card"]').forEach(card => {
        gsap.from(card, {
            y: 100,
            autoAlpha: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
            },
        });
    });
}

/**
 * Animates the gallery section.
 */
function initGalleryAnimation() {
    const galleryTitle = new SplitText('[data-animate="gallery-title"]', { type: 'chars, words' });
    
    gsap.from(galleryTitle.chars, {
        autoAlpha: 0,
        y: 50,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '[data-animate="gallery-title"]',
            start: 'top 85%',
        }
    });

    gsap.from('[data-animate="gallery-item"]', {
        autoAlpha: 0,
        y: 50,
        scale: 0.95,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 80%',
        },
    });
}

/**
 * Animates the final Call-to-Action section.
 */
function initCtaAnimation() {
    gsap.from('[data-animate="cta-content"] > *', {
        autoAlpha: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 75%',
        },
    });
}

/**
 * Adds interactive 3D tilt effect to timeline cards on hover.
 */
function initInteractiveCards() {
    const cards = document.querySelectorAll('.timeline-card');

    cards.forEach(card => {
        const intensity = 20; // Max rotation in degrees

        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
            const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5

            gsap.to(card, {
                duration: 0.8,
                rotationY: x * intensity,
                rotationX: -y * intensity,
                transformPerspective: 1000,
                ease: 'power3.out',
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 1.2,
                rotationY: 0,
                rotationX: 0,
                ease: 'elastic.out(1, 0.5)',
            });
        });
    });
}
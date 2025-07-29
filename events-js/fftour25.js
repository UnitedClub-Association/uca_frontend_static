/**
 * Esports Tournament: Free Fire - Animations
 *
 * This script uses GSAP to create a high-energy, animated experience
 * for the Free Fire tournament event page.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Short delay to ensure assets are ready
    setTimeout(() => {
        if (typeof feather !== 'undefined') {
            feather.replace({
                'stroke-width': 1.5,
                color: 'currentColor'
            });
        }
        initAnimations();
    }, 100);
});

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded. Animations disabled.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Entrance Animation ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .from('[data-animate="hero-title"]', { autoAlpha: 0, y: 40, duration: 1 })
        .from('[data-animate="hero-subtitle"]', { autoAlpha: 0, y: 20, duration: 0.8 }, '-=0.7');

    // --- Scroll-Triggered Animations ---
    
    // Animate each major section as it enters the view
    gsap.utils.toArray('[data-animate="section"]').forEach(section => {
        gsap.from(section, {
            autoAlpha: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true
            }
        });
    });

    // Staggered animation for the details grid
    gsap.from('[data-animate="details-grid"] .detail-card', {
        autoAlpha: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '[data-animate="details-grid"]',
            start: 'top 80%',
            once: true
        }
    });

    // Animate the final CTA button
    gsap.from('[data-animate="cta"]', {
        autoAlpha: 0,
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '[data-animate="cta"]',
            start: 'top 90%',
            once: true
        }
    });
}
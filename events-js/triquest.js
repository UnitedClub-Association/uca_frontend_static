/**
 * TriQuest: Battle of Knowledge - Redesigned Animations
 *
 * This script uses GSAP to add premium entrance and scroll-triggered
 * animations to the redesigned event page.
 *
 * @version 2.2 - Final fix. Restored stats card animation and applied a targeted fix for winner cards.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay to ensure all elements, especially icons, are fully rendered before initializing.
    setTimeout(() => {
        if (typeof feather !== 'undefined') {
            feather.replace({
                'stroke-width': 1.5,
                color: 'currentColor',
            });
        }
        initAnimations();
    }, 100);
});

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Section Animation ---
    // This timeline animates the hero elements into view on page load.
    const heroTl = gsap.timeline({
        defaults: {
            autoAlpha: 0,
            y: 30,
            ease: 'power3.out'
        }
    });
    heroTl.from('[data-animate="hero-title"]', { duration: 1 })
        .from('[data-animate="hero-subtitle"]', { duration: 0.8 }, "-=0.7")
        .from('[data-animate="hero-date"]', { duration: 0.8 }, "-=0.6")
        .from('[data-animate="hero-hosts"]', { y: 50, duration: 1 }, "-=0.5");


    // --- Scroll-Triggered Animations ---

    // Animate Event Details section
    gsap.from('[data-animate="details"]', {
        y: 50,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '[data-animate="details"]',
            start: 'top 85%',
            once: true,
        }
    });

    // Animate Winners Section Title
    gsap.from('[data-animate="winners-title"]', {
        y: 50,
        autoAlpha: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '[data-animate="winners-title"]',
            start: 'top 85%',
            once: true,
        }
    });

    // **TARGETED FIX for Winner Cards**
    // This was the original problem. We manually set their initial state
    // and then animate them TO a visible state. This is more robust.
    const winnerCards = document.querySelectorAll('[data-animate="winner-card"]');
    gsap.set(winnerCards, { y: 50, autoAlpha: 0 });

    gsap.to(winnerCards, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.winners-grid',
            start: 'top 85%',
            once: true,
        }
    });

    // **RESTORED Original Stats Grid Animation**
    // This animation was working correctly, so it has been restored.
    gsap.from('.stat-card', {
        y: 50,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 85%',
            once: true,
        }
    });
}
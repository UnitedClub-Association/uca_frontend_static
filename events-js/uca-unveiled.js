/**
 * UCA Unveiled 2025 - Revamped Animations
 *
 * This script brings the UCA Unveiled page to life with animations
 * consistent with the main UCA Clubs theme, using GSAP.
 *
 * @version 1.1 - Corrected visibility for stat and club cards.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay to ensure all elements, especially icons, are fully rendered
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
        console.error('GSAP is not loaded. Animations disabled.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Entrance Animation ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .from('[data-animate="hero-title"]', { autoAlpha: 0, y: 40, duration: 1 })
        .from('[data-animate="hero-subtitle"]', { autoAlpha: 0, y: 20, duration: 0.8 }, '-=0.7')
        .from('[data-animate="hero-text"]', { autoAlpha: 0, y: 20, duration: 0.8 }, '-=0.6');

    // --- Scroll-Triggered Animations ---

    // Animate single elements like titles and the CTA
    const animateUp = (element) => {
        gsap.from(element, {
            autoAlpha: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                once: true,
            }
        });
    };
    
    gsap.utils.toArray('[data-animate="section-title"]').forEach(animateUp);
    animateUp('[data-animate="cta"]');
    
    // **REVISED & FIXED LOGIC for Card Grids**

    // Stats Cards Animation
    const statCards = gsap.utils.toArray('[data-animate="stat-card"]');
    gsap.set(statCards, { autoAlpha: 0, y: 40 }); // 1. Set initial hidden state
    gsap.to(statCards, { // 2. Animate TO the visible state
        autoAlpha: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.stats-grid', // Use the parent grid as the trigger
            start: 'top 85%',
            once: true,
        }
    });

    // Club Cards Animation
    const clubCards = gsap.utils.toArray('[data-animate="club-card"]');
    gsap.set(clubCards, { autoAlpha: 0, y: 40 }); // 1. Set initial hidden state
    gsap.to(clubCards, { // 2. Animate TO the visible state
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.clubs-grid', // Use the parent grid as the trigger
            start: 'top 85%',
            once: true,
        }
    });
    
    // --- Interactive Hover Animations for Club Cards (No changes needed here) ---
    const cards = gsap.utils.toArray('[data-animate="club-card"]');
    cards.forEach(card => {
        const tl = gsap.timeline({ paused: true });
        
        tl.to(card, { 
            y: -8, 
            boxShadow: '0 10px 30px -10px var(--card-glow, var(--color-primary-glow))',
            borderColor: 'var(--card-glow, var(--color-primary-glow))',
            duration: 0.4, 
            ease: 'power2.out' 
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
    });
}
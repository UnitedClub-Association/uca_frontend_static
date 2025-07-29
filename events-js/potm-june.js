/**
 * Photographer of the Month: June - Revamped Animations
 *
 * This script introduces premium animations to match the Photography Club's
 * high-fashion theme, including a 3D interactive hero and scroll reveals.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Short delay to ensure assets are ready before animating
    setTimeout(initAnimations, 100);
});

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded. Animations disabled.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Interactive 3D Hero Header ---
    const hero = document.querySelector('.club-header');
    if (hero) {
        const intensity = 15; // Max rotation in degrees

        hero.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = hero.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
            const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5

            gsap.to(hero, {
                duration: 1.5,
                rotationY: x * intensity,
                rotationX: -y * intensity,
                ease: 'power3.out',
            });
        });

        hero.addEventListener('mouseleave', () => {
            gsap.to(hero, {
                duration: 1.5,
                rotationY: 0,
                rotationX: 0,
                ease: 'elastic.out(1, 0.5)',
            });
        });

        // Initial entrance animation for the hero
        gsap.from(hero, { autoAlpha: 0, scale: 0.95, duration: 1, ease: 'power2.out' });
    }

    // --- Scroll-Triggered Animations ---

    // Animate winner entries
    gsap.utils.toArray('[data-animate="winner-entry"]').forEach(entry => {
        gsap.from(entry, {
            autoAlpha: 0,
            y: 60,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: entry,
                start: 'top 85%',
                once: true,
            }
        });
    });

    // Animate section title for weekly highlights
    gsap.from('[data-animate="section-title"]', {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '[data-animate="section-title"]',
            start: 'top 85%',
            once: true,
        }
    });

    // Staggered animation for the weekly image grid
    gsap.from('[data-animate="week-image"]', {
        autoAlpha: 0,
        scale: 0.9,
        y: 40,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.week-grid',
            start: 'top 80%',
            once: true,
        }
    });
}
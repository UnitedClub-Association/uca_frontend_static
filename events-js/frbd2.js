/**
 * Frame of Revolution: Bangladesh 2.0 - Revamped Animations
 *
 * This script introduces premium animations inspired by the potm-june page,
 * including a 3D interactive hero and elegant scroll reveals.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A brief delay to ensure assets are ready before animating
    setTimeout(initAnimations, 100);
});

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded. Animations disabled.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Interactive 3D Hero Header ---
    const hero = document.querySelector('.event-header');
    if (hero) {
        const intensity = 10; // A more subtle intensity for this theme

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

    // Animate the main description
    gsap.from('[data-animate="description"]', {
        autoAlpha: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '[data-animate="description"]',
            start: 'top 90%',
            once: true,
        }
    });

    // Animate segment columns to fade in
    gsap.utils.toArray('[data-animate="segment-column"]').forEach(column => {
        gsap.from(column, {
            autoAlpha: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: column,
                start: 'top 85%',
                once: true,
            }
        });
    });
    
    // Staggered animation for cards within each column
     gsap.utils.toArray('[data-animate="segment-column"]').forEach(column => {
        gsap.from(column.querySelectorAll('[data-animate="segment-card"]'), {
            autoAlpha: 0,
            x: -20,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: column,
                start: 'top 80%',
                once: true,
            }
        });
    });


    // Animate the final timeline section
    gsap.from('[data-animate="timeline"]', {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '[data-animate="timeline"]',
            start: 'top 90%',
            once: true,
        }
    });
}

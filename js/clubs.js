document.addEventListener('DOMContentLoaded', () => {
    // --- Safe Initialization ---
    try {
        gsap.registerPlugin(Flip);
    } catch (e) {
        console.error("GSAP or Flip plugin failed to load. Animations will be disabled.", e);
        return; // Exit if GSAP is not available
    }

    if (typeof feather !== 'undefined') {
        feather.replace({ 'stroke-width': 2, 'aria-hidden': true });
    }

    // --- Element Selections ---
    const grid = document.getElementById('clubs-grid');
    if (!grid) return; // Exit if the main grid is not found

    const gridWrapper = document.querySelector('.clubs-grid-wrapper');
    const cards = gsap.utils.toArray('.club-card');
    const clubFilterButtons = document.getElementById('club-filter-buttons');
    const viewFilterButtons = document.getElementById('view-filter-buttons');
    const detailToggleButtons = document.querySelector('.detail-toggle-group');

    // --- State Management ---
    const state = {
        category: 'all',
        view: 'grid',
        detail: 'simple'
    };
    
    // --- Carousel Animation State ---
    let carouselTimeline = null;
    // Define listener variables to hold function references
    let pauseCarousel, resumeCarousel;


    // --- Initial Page Setup ---
    grid.classList.add(`view-${state.view}`);
    
    gsap.set(cards, { autoAlpha: 1 });
    gsap.from(cards, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.2
    });

    // --- Carousel Animation Functions (REBUILT FOR CORRECTNESS) ---
    const startCarouselAnimation = () => {
        gsap.delayedCall(0.1, () => {
            const visibleCards = cards.filter(card => card.style.display !== 'none' && !card.classList.contains('is-clone'));
            if (visibleCards.length < 4) return;

            killCarouselAnimation();

            // Add class to wrapper to hide overflow
            gridWrapper.classList.add('is-carouselling');

            visibleCards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.add('is-clone');
                applyCardHoverAnimation(clone);
                grid.appendChild(clone);
            });

            // Use scrollWidth for a reliable calculation of the full content width
            const singleSetWidth = grid.scrollWidth / 2;
            
            const DURATION = 20; // User-defined duration

            carouselTimeline = gsap.to(grid, {
                x: `-=${singleSetWidth}`,
                duration: DURATION,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize(gsap.utils.wrap(-singleSetWidth, 0)),
                }
            });

            // Assign the listener functions to variables
            pauseCarousel = () => carouselTimeline?.pause();
            resumeCarousel = () => carouselTimeline?.resume();

            // Add listeners using the function references
            gridWrapper.addEventListener('mouseenter', pauseCarousel);
            gridWrapper.addEventListener('mouseleave', resumeCarousel);
        });
    };

    const killCarouselAnimation = () => {
        // Remove the helper class from the wrapper
        gridWrapper.classList.remove('is-carouselling');

        // CORRECTLY remove listeners using the same function references
        gridWrapper.removeEventListener('mouseenter', pauseCarousel);
        gridWrapper.removeEventListener('mouseleave', resumeCarousel);
        
        if (carouselTimeline) {
            carouselTimeline.kill();
            carouselTimeline = null;
        }
        grid.querySelectorAll('.is-clone').forEach(clone => clone.remove());
        gsap.set(grid, { clearProps: "transform" });
    };

    // --- Core Layout Update Function (No changes needed here) ---
    const updateLayout = () => {
        killCarouselAnimation();

        const flipState = Flip.getState(cards, { props: "display" });
        
        const currentViewClass = `view-${state.view}`;
        const detailClass = 'view-detailed';
        grid.classList.remove('view-grid', 'view-list', 'view-carousel', 'view-detailed');
        grid.classList.add(currentViewClass);
        if (state.detail === 'detailed') {
            grid.classList.add(detailClass);
        }
        
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            const matchesCategory = state.category === 'all' || state.category === cardCategory;
            card.style.display = matchesCategory ? (state.view === 'list' ? 'flex' : 'block') : 'none';
        });

        Flip.from(flipState, {
            duration: 0.7,
            stagger: 0.03,
            ease: 'power3.inOut',
            scale: true,
            onEnter: elements => gsap.fromTo(elements, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.5 }),
            onLeave: elements => gsap.to(elements, { autoAlpha: 0, scale: 0.8, duration: 0.5 }),
            onComplete: () => {
                if (state.view === 'carousel') {
                    startCarouselAnimation();
                }
            }
        });
    };

    // --- Event Listener Setup Function ---
    const addClickListener = (container, selector, callback) => {
        if (!container) return;
        container.addEventListener('click', e => {
            const button = e.target.closest(selector);
            if (!button || button.classList.contains('active')) return;
            container.querySelector('.active')?.classList.remove('active');
            button.classList.add('active');
            callback(button.dataset);
        });
    };

    addClickListener(clubFilterButtons, '.filter-btn', (dataset) => {
        state.category = dataset.filter;
        updateLayout();
    });

    addClickListener(viewFilterButtons, '.view-btn', (dataset) => {
        state.view = dataset.view;
        updateLayout();
    });

    addClickListener(detailToggleButtons, '.detail-btn', (dataset) => {
        state.detail = dataset.detail;
        updateLayout();
    });

    // --- Hover Animations ---
    const applyCardHoverAnimation = (card) => {
        if (card.dataset.hoverApplied) return;
        card.dataset.hoverApplied = 'true';

        const bg = card.querySelector('.card-bg');
        const tl = gsap.timeline({ paused: true });

        tl.to(card, { 
            y: -8, 
            boxShadow: '0 0 25px -5px var(--card-glow, var(--color-primary-glow))',
            borderColor: 'var(--card-border, var(--color-border-hover))',
            duration: 0.4, 
            ease: 'power2.out' 
        })
        .to(bg, { scale: 1.05, duration: 0.6, ease: 'power3.out' }, '<');

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
    };
    
    cards.forEach(applyCardHoverAnimation);

    // Anime.js Hover on Filter Buttons
    document.querySelectorAll('.filter-btn, .detail-btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('active')) {
                anime({ targets: button, translateY: -2, duration: 200, easing: 'easeOutSine' });
            }
        });
        button.addEventListener('mouseleave', () => {
            anime({ targets: button, translateY: 0, duration: 400, easing: 'easeOutBounce' });
        });
    });
});
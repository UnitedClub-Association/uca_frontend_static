document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Feather Icons
    if (typeof feather !== "undefined") {
        feather.replace();
    }

    // 1. Generate Abstract Hero Grid (Digital Space aesthetic)
    const initHeroGrid = () => {
        const heroGrid = document.getElementById('hero-grid');
        if (!heroGrid) return;

        const isMobile = window.innerWidth < 768;
        const dotCount = isMobile ? 50 : 120;

        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'grid-dot';
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.animationDelay = `${Math.random() * 5}s`;
            heroGrid.appendChild(dot);
        }
    };
    initHeroGrid();

    // 2. Custom Tabs Logic with sliding Highlighter
    const initTabs = () => {
        const tabs = document.querySelectorAll('.highlight-tab');
        const contents = document.querySelectorAll('.highlight-content');
        const highlighter = document.querySelector('.tab-highlighter');

        const updateHighlighter = (activeTab) => {
            if (!highlighter || !activeTab) return;
            // Get position relative to the parent container
            const leftPos = activeTab.offsetLeft;
            const width = activeTab.offsetWidth;
            highlighter.style.transform = `translateX(${leftPos - 6}px)`; // -6px for parent padding
            highlighter.style.width = `${width}px`;
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Reset all
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Activate clicked
                tab.classList.add('active');
                const targetId = `tab-content-${tab.getAttribute('data-tab')}`;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Move pill
                updateHighlighter(tab);
            });
        });

        // Initial Setup and Resize Handling
        const initializePill = () => {
            const activeTab = document.querySelector('.highlight-tab.active');
            updateHighlighter(activeTab);
        };
        
        // Wait briefly for CSS to render widths before setting highlighter
        setTimeout(initializePill, 100);
        window.addEventListener('resize', initializePill);
    };
    initTabs();

    // 3. Setup GSAP Scroll Animations
    const initGsapAnimations = () => {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
        gsap.registerPlugin(ScrollTrigger);

        // Hero Entry Animation
        gsap.fromTo(".anim-hero-entry", 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
        );

        // Fade in headers
        gsap.utils.toArray('.anim-fade-in').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                { scrollTrigger: { trigger: el, start: "top 85%" }, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
        });

        // Slide up single elements (cards, links)
        gsap.utils.toArray('.anim-slide-up').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 40 },
                { scrollTrigger: { trigger: el, start: "top 85%" }, opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );
        });

        // Staggered Cards (Only animate them when their section is visible)
        gsap.utils.toArray('.cards-grid, .events-grid').forEach(grid => {
            gsap.fromTo(grid.querySelectorAll('.anim-card'),
                { opacity: 0, y: 30 },
                { scrollTrigger: { trigger: grid, start: "top 85%" }, opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
            );
        });
    };
    
    // Wait for external scripts to load before firing GSAP
    const checkDependencies = setInterval(() => {
        if (window.gsap && window.ScrollTrigger) {
            clearInterval(checkDependencies);
            initGsapAnimations();
        }
    }, 100);

});
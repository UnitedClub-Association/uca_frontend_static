document.addEventListener('DOMContentLoaded', () => {
  const checkDependencies = setInterval(() => {
    if (window.gsap && window.ScrollTrigger && window.anime && window.feather) {
      clearInterval(checkDependencies);
      initPage();
    }
  }, 100);

  function initPage() {
    gsap.registerPlugin(ScrollTrigger);
    feather.replace();

    // --- Dynamic Content Loading ---
    loadDebates();

    // --- Animations ---
    animateHeader();
    animateContentCards();
    animateButton();
  }

  async function loadDebates() {
    const listContainer = document.getElementById('debates-list-container');
    if (!listContainer) return;

    try {
      const response = await fetch('/json/debate-club.json');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const debates = await response.json();

      listContainer.innerHTML = ''; // Clear any fallback content

      debates.forEach(debate => {
        // Create elements safely
        const li = document.createElement('li');

        const eventSpan = document.createElement('span');
        eventSpan.className = 'debate-event';
        eventSpan.textContent = debate.event_name;

        const topicSpan = document.createElement('span');
        topicSpan.className = 'debate-topic';
        topicSpan.textContent = `"${debate.topic}"`;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'debate-date';
        dateSpan.textContent = debate.date_string;

        // Append newly created elements to the list item
        li.appendChild(eventSpan);
        li.appendChild(topicSpan);
        li.appendChild(dateSpan);

        // Append the completed list item to the main container
        listContainer.appendChild(li);
      });
      
      // Animate the list items now that they exist in the DOM
      animateDebateList();
      
    } catch (error) {
      console.error("Could not load debate data:", error);
      listContainer.innerHTML = '<li>Error: Could not load recent debates.</li>';
    }
  }

  function animateHeader() {
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });

    tl.from('.club-logo', { scale: 0.5, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.75)' })
      .from('.club-title', { y: 50, opacity: 0 }, '-=0.7')
      .from('.club-tagline, .club-description', { y: 20, opacity: 0, stagger: 0.2 }, '-=0.6');

    // **FIX APPLIED HERE**
    // Changed 'background-position' to 'backgroundPosition' (camelCase)
    // to be a valid JavaScript object key.
    gsap.to('.club-header', {
        backgroundPosition: '50% 100%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.club-header',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });
  }

  function animateContentCards() {
    const cards = gsap.utils.toArray('.section-card:not(.debates-section)');
    cards.forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    // Enhanced: Animate feature list icons
    const featureIcons = gsap.utils.toArray('.features-list li i');
    gsap.from(featureIcons, {
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.features-list',
            start: 'top 85%',
            toggleActions: 'play none none none',
        }
    });
  }

  function animateDebateList() {
    const debateItems = gsap.utils.toArray('#debates-list-container li');
    if (debateItems.length === 0) return;

    gsap.to(debateItems, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#debates-list-container',
            start: 'top 85%',
            toggleActions: 'play none none none',
        }
    });
  }

  function animateButton() {
    const primaryButton = document.querySelector('.button-primary');
    if (primaryButton) {
        const arrowIcon = primaryButton.querySelector('i');
        primaryButton.addEventListener('mouseenter', () => {
            anime({
                targets: arrowIcon,
                translateX: [0, 8, -5, 0],
                scale: [1, 1.2, 1],
                duration: 400,
                easing: 'easeInOutSine'
            });
        });
    }
  }
});
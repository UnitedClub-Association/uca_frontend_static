document.addEventListener("DOMContentLoaded", () => {
  // --- DOM element references ---
  const eventsGrid = document.getElementById("events-grid");
  const noResultsMessage = document.getElementById("no-results");
  
  const sortFilter = document.getElementById("sort-filter");
  const clubTypeFilter = document.getElementById("club-type-filter");
  const clubFilter = document.getElementById("club-filter");
  
  const detailLevelFilter = document.getElementById("detail-level-filter");
  const viewModeFilter = document.getElementById("view-mode-filter");

  const sliderNav = document.getElementById("slider-nav");
  const prevButton = document.getElementById("slider-prev");
  const nextButton = document.getElementById("slider-next");

  // --- State ---
  let allEvents = [];
  let sliderState = {
    initialized: false,
    currentIndex: 0,
    tween: null,
    events: []
  };

  /**
   * Main function to fetch data and initialize the page
   */
  async function init() {
    await fetchEvents();
    setupEventListeners();
    updateEventView(); 
    setupAnimations(); // Run animations after initial render
  }

  /**
   * Fetches event data from the JSON file.
   */
  async function fetchEvents() {
    try {
      const response = await fetch('/json/all-events.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      allEvents = await response.json();
    } catch (error) {
      console.error("Could not fetch events:", error);
      noResultsMessage.style.display = 'block';
      noResultsMessage.querySelector('p').textContent = 'Error loading events. Please try again later.';
    }
  }
  
  /**
   * Sets up all event listeners for the filter controls.
   */
  function setupEventListeners() {
    const filters = [sortFilter, clubTypeFilter, clubFilter, detailLevelFilter, viewModeFilter];
    filters.forEach(filter => filter.addEventListener("change", updateEventView));
  }

  /**
   * Renders a list of event cards to the grid.
   * @param {Array} eventsToRender - The filtered list of events.
   */
  function renderEvents(eventsToRender) {
    eventsGrid.innerHTML = "";
    noResultsMessage.style.display = eventsToRender.length === 0 ? "block" : "none";

    eventsToRender.forEach(event => {
      const card = document.createElement("a");
      card.href = event.href;
      card.className = `event-card gsap-animate ${event.cardClass || ''}`; // Add animation hook
      card.innerHTML = `
        <div class="event-image">
          <img src="${event.imgSrc}" alt="${event.imgAlt}" loading="lazy" />
        </div>
        <div class="event-content">
          <div class="event-date">${event.displayDate}</div>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <span class="read-more"><span>View Details</span><i data-feather="arrow-right"></i></span>
        </div>
      `;
      eventsGrid.appendChild(card);
    });

    if (typeof feather !== 'undefined') feather.replace();
  }

  /**
   * The main controller function. Applies filters, sorting, and view modes.
   */
  function updateEventView() {
    // Kill any ongoing animations to prevent conflicts
    if (sliderState.tween) sliderState.tween.kill();
    gsap.killTweensOf(".gsap-animate");

    let filteredEvents = [...allEvents];

    // --- Filtering ---
    const type = clubTypeFilter.value;
    const club = clubFilter.value;
    if (type !== "all") filteredEvents = filteredEvents.filter(e => e.type.includes(type));
    if (club !== "all") filteredEvents = filteredEvents.filter(e => e.clubs.includes(club));

    // --- Sorting ---
    filteredEvents.sort((a, b) => {
      return sortFilter.value === 'latest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    });

    // --- Render the cards ---
    renderEvents(filteredEvents);

    // --- View & Detail Level ---
    const detailLevel = detailLevelFilter.value;
    const viewMode = viewModeFilter.value;
    
    eventsGrid.className = 'events-grid'; // Reset classes
    eventsGrid.classList.add(`view-${viewMode}`, `view-${detailLevel}`);
    
    // --- Slider Handling ---
    if (viewMode === 'slider' && filteredEvents.length > 0) {
        initSlider(filteredEvents);
    } else {
        destroySlider();
    }

    // --- Animate new cards into view ---
    gsap.fromTo(".event-card.gsap-animate", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
    );
  }

  /**
   * Initializes and manages the slider view.
   */
  function initSlider(events) {
    sliderNav.style.display = 'flex';
    sliderState.initialized = true;
    sliderState.currentIndex = 0;
    sliderState.events = events;

    const cards = Array.from(eventsGrid.querySelectorAll('.event-card'));
    if (cards.length === 0) return;
    
    const containerWidth = eventsGrid.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(window.getComputedStyle(eventsGrid).gap, 10);
    const centeringOffset = (containerWidth - cardWidth) / 2;

    const updateSlider = (instant = false) => {
      const newX = -(sliderState.currentIndex * (cardWidth + gap)) + centeringOffset;
      
      if (sliderState.tween) sliderState.tween.kill();

      sliderState.tween = gsap.to(eventsGrid, { 
          x: newX,
          duration: instant ? 0 : 0.7,
          ease: 'power3.inOut'
      });

      cards.forEach((card, index) => {
          card.classList.toggle('is-active', index === sliderState.currentIndex);
      });
      
      prevButton.disabled = sliderState.currentIndex === 0;
      nextButton.disabled = sliderState.currentIndex === cards.length - 1;
    }
    
    nextButton.onclick = () => {
      if (sliderState.currentIndex < cards.length - 1) {
        sliderState.currentIndex++;
        updateSlider();
      }
    };

    prevButton.onclick = () => {
      if (sliderState.currentIndex > 0) {
        sliderState.currentIndex--;
        updateSlider();
      }
    };
    
    // Recalculate on window resize
    window.onresize = () => updateSlider(true);
    
    updateSlider(true); // Initial state
  }
  
  /**
   * Cleans up slider styles and event listeners.
   */
  function destroySlider() {
    if (!sliderState.initialized) return;
    sliderNav.style.display = 'none';
    gsap.set(eventsGrid, { x: 0 }); // Reset position
    eventsGrid.querySelectorAll('.event-card').forEach(c => c.classList.remove('is-active'));
    window.onresize = null; // Remove resize listener
    sliderState.initialized = false;
  }

  /**
   * Sets up smooth, staggered, scroll-triggered animations for static content.
   */
  function setupAnimations() {
    gsap.utils.toArray('[data-animate-group]').forEach((group, i) => {
      const elems = group.querySelectorAll('.gsap-animate');
      gsap.fromTo(elems, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }
  
  // --- Start the application ---
  init();
});
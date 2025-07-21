document.addEventListener("DOMContentLoaded", () => {
  // DOM element references
  const eventsGrid = document.getElementById("events-grid");
  const noResultsMessage = document.getElementById("no-results");
  
  // Filter and sort controls
  const sortFilter = document.getElementById("sort-filter");
  const clubTypeFilter = document.getElementById("club-type-filter");
  const clubFilter = document.getElementById("club-filter");
  const collabFilter = document.getElementById("collab-filter");

  let allEvents = []; // To store the master list of events

  /**
   * Fetches event data from the JSON file.
   */
  async function fetchEvents() {
    try {
      const response = await fetch('/json/all-events.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allEvents = await response.json();
      // Initial render of events
      applyFiltersAndSort();
    } catch (error) {
      console.error("Could not fetch events:", error);
      eventsGrid.innerHTML = "<p>Error loading events. Please try again later.</p>";
    }
  }

  /**
   * Renders a list of event cards to the grid.
   * @param {Array} eventsToRender - The filtered and sorted list of events to display.
   */
  function renderEvents(eventsToRender) {
    // Clear the grid before rendering new cards
    eventsGrid.innerHTML = "";

    if (eventsToRender.length === 0) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }

    // Create and append a card for each event
    eventsToRender.forEach(event => {
      const card = document.createElement("a");
      card.href = event.href;
      card.className = `event-card ${event.cardClass}`;
      
      card.innerHTML = `
        <div class="event-image">
          <img src="${event.imgSrc}" alt="${event.imgAlt}" loading="lazy" />
        </div>
        <div class="event-content">
          <div class="event-date">${event.displayDate}</div>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <span class="read-more">View Details <i data-feather="arrow-right"></i></span>
        </div>
      `;
      eventsGrid.appendChild(card);
    });

    // Re-apply Feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  /**
   * Filters and sorts the master event list based on current filter values.
   */
  function applyFiltersAndSort() {
    let filteredEvents = [...allEvents];

    // Get current filter values
    const type = clubTypeFilter.value;
    const club = clubFilter.value;
    const collab = collabFilter.value;
    const sortOrder = sortFilter.value;

    // Apply filters
    // 1. Club Type Filter
    if (type !== "all") {
      filteredEvents = filteredEvents.filter(event => event.type.includes(type));
    }
    // 2. Club Filter
    if (club !== "all") {
      filteredEvents = filteredEvents.filter(event => event.clubs.includes(club));
    }
    // 3. Collaboration Filter
    if (collab !== "all") {
      filteredEvents = filteredEvents.filter(event => event.collab === collab);
    }

    // Apply sorting
    filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    // Render the final list of events
    renderEvents(filteredEvents);
  }

  // Add event listeners to all filter controls
  sortFilter.addEventListener("change", applyFiltersAndSort);
  clubTypeFilter.addEventListener("change", applyFiltersAndSort);
  clubFilter.addEventListener("change", applyFiltersAndSort);
  collabFilter.addEventListener("change", applyFiltersAndSort);

  // Initial fetch of events when the page loads
  fetchEvents();
});

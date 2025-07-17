document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather Icons
  if (typeof feather !== 'undefined') {
    feather.replace({
      'stroke-width': 2,
      'aria-hidden': true
    });
  }

  // --- Club Filtering Logic ---
  const filterContainer = document.querySelector('.clubs-filter');
  const clubCards = document.querySelectorAll('.club-card');

  if (filterContainer && clubCards.length > 0) {
    filterContainer.addEventListener('click', (e) => {
      // Only act on button clicks
      if (!e.target.matches('.filter-btn')) {
        return;
      }

      const clickedButton = e.target;
      
      // Prevent running if already active
      if (clickedButton.classList.contains('active')) {
        return;
      }

      // Update active state on buttons
      filterContainer.querySelector('.active').classList.remove('active');
      clickedButton.classList.add('active');

      const filterValue = clickedButton.dataset.filter;

      // Show/hide cards based on filter
      clubCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const shouldShow = filterValue === 'all' || filterValue === cardCategory;
        
        // Use a class to handle the animation for smoother transitions
        if (shouldShow) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  }
});

// Add this small CSS snippet directly to your clubs.css file
// or embed it in a <style> tag in the head of clubs.html
// This handles the hide/show animation for the filter.

/*
  In clubs.css, add:

  .club-card.is-hidden {
    transform: scale(0.9);
    opacity: 0;
    pointer-events: none;
    height: 0;
    padding: 0;
    margin: 0;
    border: none;
    transition: opacity 0.4s ease, transform 0.4s ease, height 0.4s 0.2s, padding 0.4s 0.2s, margin 0.4s 0.2s, border 0.4s 0.2s;
  }
  
  .clubs-grid {
    transition: all 0.4s ease;
  }
*/

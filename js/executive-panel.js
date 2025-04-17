document.addEventListener('DOMContentLoaded', function() {
  // Initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace({
      'stroke-width': 2,
      'color': 'currentColor',
      'size': 20
    });
  }
  
  // Update the current date display
  updateCurrentDate();
  
  // Calculate and update the timeline progress
  updateTimelineProgress();
  
  // Add animation to timeline items
  animateTimelineItems();
  
  // Initialize filtering functionality
  initializeFiltering();
});

/**
 * Calculates and updates the timeline progress bar based on current date
 */
function updateTimelineProgress() {
  const progressBar = document.getElementById('timeline-progress');
  if (!progressBar) return;
  
  // Define start and end dates for the current council term
  const startDate = new Date('2024-10-10');
  const endDate = new Date('2025-12-31');
  const currentDate = new Date();
  
  // Calculate progress percentage
  let progressPercentage = 0;
  if (currentDate >= startDate && currentDate <= endDate) {
    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;
    progressPercentage = (elapsedDuration / totalDuration) * 100;
  } else if (currentDate > endDate) {
    progressPercentage = 100;
  }
  
  // Apply the progress with a smooth animation
  setTimeout(() => {
    progressBar.style.width = `${progressPercentage}%`;
  }, 300);
}

/**
 * Updates the current date display in the timeline
 */
function updateCurrentDate() {
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
  }
}

/**
 * Adds animation to timeline items when they come into view
 */
function animateTimelineItems() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  // Observe each timeline item
  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

/**
 * Initializes the filtering functionality for executive cards
 */
function initializeFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const executiveCards = document.querySelectorAll('.executive-card');
  
  if (!filterButtons.length || !executiveCards.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get the filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter the executive cards
      executiveCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          // Add animation delay for staggered appearance
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50 * parseInt(card.style.getPropertyValue('--i') || 1));
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Trigger the "All" filter on load
  const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
  if (allFilter) {
    allFilter.click();
  }
}

/**
 * Adds animation to executive cards when they come into view
 */
function animateExecutiveCards() {
  const executiveCards = document.querySelectorAll('.executive-card');
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get the index for staggered animation
        const index = parseInt(entry.target.style.getPropertyValue('--i') || 1);
        
        // Add animation with delay based on index
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100 * index);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Set initial styles and observe each card
  executiveCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}
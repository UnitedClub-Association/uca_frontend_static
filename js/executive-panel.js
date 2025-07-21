document.addEventListener('DOMContentLoaded', function() {
  // Initialize Feather Icons
  if (typeof feather !== 'undefined') {
    feather.replace({
      'stroke-width': 1.5,
      color: 'currentColor'
    });
  }

  const filterContainer = document.querySelector('.executives-filter');
  const executiveGrid = document.querySelector('.executives-grid');
  
  if (!filterContainer || !executiveGrid) return;

  const filterButtons = filterContainer.querySelectorAll('.filter-btn');
  const executiveCards = Array.from(executiveGrid.querySelectorAll('.executive-card'));

  // Initial load animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.index * 80;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  executiveCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.dataset.index = index; // Store index for staggered animation
    observer.observe(card);
  });
  
  // Filter logic
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      // Fade out all cards first
      executiveCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      });

      // After fade out, filter and fade in
      setTimeout(() => {
        let visibleIndex = 0;
        executiveCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          const shouldShow = (filterValue === 'all' || cardCategory === filterValue);

          if (shouldShow) {
            card.style.display = 'block'; // Or 'flex', 'grid' etc. depending on card layout
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 100 * visibleIndex);
            visibleIndex++;
          } else {
            card.style.display = 'none';
          }
        });
      }, 400); // Wait for fade-out transition to complete
    });
  });
});
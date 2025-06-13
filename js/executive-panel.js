document.addEventListener('DOMContentLoaded', function() {
  if (typeof feather !== 'undefined') {
    feather.replace({
      'stroke-width': 1.5,
      'color': 'currentColor',
      'width': 20,
      'height': 20
    });
  }
  
  initializeFiltering();
  animateExecutiveCards();
  addCardHoverEffects();
});

function initializeFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const executiveCards = document.querySelectorAll('.executive-card');
  
  if (!filterButtons.length || !executiveCards.length) return;
  
  executiveCards.forEach(card => {
    card.style.display = 'flex';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filterValue = button.getAttribute('data-filter');
      let visibleIndex = 0;
      
      executiveCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50 * visibleIndex);
          visibleIndex++;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

function animateExecutiveCards() {
  const executiveCards = document.querySelectorAll('.executive-card');
  if (!executiveCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(executiveCards).indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 80 * (index % 10));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  });
  
  executiveCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(card);
  });
}

function addCardHoverEffects() {
  const cards = document.querySelectorAll('.executive-card, .structure-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 12px 35px rgba(255, 189, 89, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = `0 8px 25px rgba(0, 0, 0, 0.4)`;
    });
  });
}
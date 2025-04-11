// Create a new file for general site interactions
document.addEventListener("DOMContentLoaded", function() {
  // Add scroll animations
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
});
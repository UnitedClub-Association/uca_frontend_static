(function() {
  'use strict';

  if (window.enhancedNavbarScriptInitialized) return;
  window.enhancedNavbarScriptInitialized = true;

  const initializeNavbar = () => {
      const header = document.querySelector('.navbar-header');
      
      // 1. Scroll Effect
      if (header) {
          window.addEventListener("scroll", () => {
             if (window.scrollY > 50) header.classList.add('scrolled');
             else header.classList.remove('scrolled');
          }, { passive: true });
      }

      // 2. Immersive Mobile Menu Overlay
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      const mobileMenuClose = document.querySelector('.mobile-menu-close');
      const sidebarWrapper = document.querySelector('.sidebar-wrapper');
      const sidebarItems = document.querySelectorAll('.sidebar-item-anim');

      const toggleSidebar = (forceClose = false) => {
          const isOpen = forceClose ? false : !sidebarWrapper.classList.contains('is-open');
          
          if (isOpen) {
              sidebarWrapper.classList.add('is-open');
              document.body.style.overflow = 'hidden'; // Lock scroll
              
              // Staggered Animation
              sidebarItems.forEach((item, index) => {
                  item.style.opacity = '0';
                  item.style.transform = 'translateY(20px)';
                  item.style.transition = 'none';
                  
                  void item.offsetWidth; // Trigger reflow
                  
                  setTimeout(() => {
                      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                      item.style.opacity = '1';
                      item.style.transform = 'translateY(0)';
                  }, 100 + (index * 60));
              });
          } else {
              sidebarWrapper.classList.remove('is-open');
              document.body.style.overflow = ''; // Unlock scroll
              
              // Reset items
              sidebarItems.forEach(item => {
                  item.style.opacity = '0';
                  item.style.transform = 'translateY(20px)';
              });
          }
      };
      
      if (mobileMenuToggle && sidebarWrapper) {
          mobileMenuToggle.addEventListener('click', () => toggleSidebar(false));
      }
      if (mobileMenuClose) {
          mobileMenuClose.addEventListener('click', () => toggleSidebar(true));
      }

      // 3. Mobile Accordion Logic
      const dropdowns = document.querySelectorAll('.sidebar-dropdown');
      dropdowns.forEach(dropdown => {
          const link = dropdown.querySelector('.sidebar-link');
          if (link) {
              link.addEventListener('click', function(e) {
                  e.preventDefault();
                  // Close others
                  dropdowns.forEach(d => {
                      if (d !== dropdown) d.classList.remove('is-open');
                  });
                  // Toggle clicked
                  dropdown.classList.toggle('is-open');
              });
          }
      });

      // 4. Reset on Resize
      window.addEventListener("resize", () => {
          if (window.innerWidth > 900 && sidebarWrapper && sidebarWrapper.classList.contains('is-open')) {
              toggleSidebar(true);
          }
      });
  };

  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeNavbar);
  } else {
      initializeNavbar();
  }
})();
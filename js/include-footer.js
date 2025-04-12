fetch("/html/footer.html")
  .then((response) => response.text())
  .then((data) => {
    // Parse HTML safely using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    
    // Clear existing content safely
    while (footerPlaceholder.firstChild) {
      footerPlaceholder.removeChild(footerPlaceholder.firstChild);
    }
    
    // Safely transfer the footer content
    const footerContent = doc.querySelector('footer');
    if (footerContent) {
      // Create new elements for each footer section
      const safeFooter = document.createElement('footer');
      safeFooter.className = footerContent.className;
      
      // Transfer content safely using DOM methods
      Array.from(footerContent.children).forEach(child => {
        const safeChild = document.createElement(child.tagName.toLowerCase());
        
        // Copy safe attributes
        for (const attr of child.attributes) {
          if (attr.name === 'class' || attr.name === 'id' || attr.name.startsWith('data-')) {
            safeChild.setAttribute(attr.name, attr.value);
          }
        }
        
        // Set text content safely
        safeChild.textContent = child.textContent;
        safeFooter.appendChild(safeChild);
      });
      
      footerPlaceholder.appendChild(safeFooter);
    }

    // Load footer.js safely
    const script = document.createElement('script');
    script.src = '/js/footer.js';
    script.onload = () => console.log('footer.js loaded successfully');
    script.onerror = () => console.error('Error loading footer.js');
    document.head.appendChild(script);
  })
  .catch(error => {
    console.error('Error loading footer:', error);
  });

// include-fonts.js
document.addEventListener("DOMContentLoaded", function () {
  // Create a placeholder element for the fonts
  const fontPlaceholder = document.createElement("div");
  fontPlaceholder.id = "font-placeholder";
  document.head.appendChild(fontPlaceholder); // Insert into the <head>

  // Fetch the font HTML
  fetch("/html/fonts.html")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      
      // Clear existing content safely
      while (fontPlaceholder.firstChild) {
        fontPlaceholder.removeChild(fontPlaceholder.firstChild);
      }
      
      // Only process and append link elements for fonts
      const linkElements = doc.getElementsByTagName('link');
      Array.from(linkElements).forEach(link => {
        if (link.rel === 'stylesheet' && link.href) {
          const safeLink = document.createElement('link');
          safeLink.rel = 'stylesheet';
          safeLink.href = link.href;
          fontPlaceholder.appendChild(safeLink);
        }
      });
    })
    .catch((error) => {
      console.error('Error loading fonts:', error);
    });
});

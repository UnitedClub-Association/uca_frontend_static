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
      // Create a temporary element to sanitize the content
      const sanitizer = new DOMParser();
      const doc = sanitizer.parseFromString(data, 'text/html');
      
      // Clear the existing content safely
      while (fontPlaceholder.firstChild) {
        fontPlaceholder.removeChild(fontPlaceholder.firstChild);
      }
      
      // Append the sanitized content
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

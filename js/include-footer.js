document.addEventListener("DOMContentLoaded", function () {
  const footerPlaceholder = document.createElement("div");
  footerPlaceholder.id = "footer-placeholder";
  document.body.appendChild(footerPlaceholder);

  fetch("/components/footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      // Parse the HTML safely
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      
      // Clear existing content safely
      while (footerPlaceholder.firstChild) {
        footerPlaceholder.removeChild(footerPlaceholder.firstChild);
      }
      
      // Get the footer content and safely transfer it
      const footerContent = doc.body.children;
      Array.from(footerContent).forEach(element => {
        const safeElement = document.createElement(element.tagName);
        // Copy safe attributes
        Array.from(element.attributes).forEach(attr => {
          if (attr.name.startsWith('data-') || ['id', 'class'].includes(attr.name)) {
            safeElement.setAttribute(attr.name, attr.value);
          }
        });
        safeElement.textContent = element.textContent;
        footerPlaceholder.appendChild(safeElement);
      });

      // Load footer.js script safely
      const script = document.createElement("script");
      script.src = "/js/footer.js";
      script.onload = () => console.log("footer.js loaded successfully.");
      script.onerror = () => console.error("Error loading footer.js.");
      document.head.appendChild(script);
    })
    .catch((error) => {
      console.error("Error loading footer:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Bulletproof Dynamic Year & Icon Injection
  // Because your footer is loaded dynamically via include-footer.js, 
  // standard DOMContentLoaded fires BEFORE the footer actually exists in the DOM.
  // This interval safely waits for the HTML to be injected, sets the data, and stops.
  
  const setupFooter = setInterval(() => {
    const yearSpan = document.getElementById("copyright-year");
    
    if (yearSpan) {
      // Set the year
      yearSpan.textContent = new Date().getFullYear();
      
      // Inject Feather Icons specifically for the footer elements once they exist
      if (typeof feather !== "undefined") {
        feather.replace({ width: "1em", height: "1em", "stroke-width": 1.5 });
      }
      
      // Clear the interval so it stops running once successfully applied
      clearInterval(setupFooter);
    }
  }, 100); // Checks every 100 milliseconds until the footer is found

  // Safety fallback: Stop checking after 5 seconds if something goes terribly wrong
  setTimeout(() => clearInterval(setupFooter), 5000);

});
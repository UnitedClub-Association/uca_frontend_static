document.addEventListener("DOMContentLoaded", function () {
  let footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) {
    footerPlaceholder = document.createElement("div");
    footerPlaceholder.id = "footer-placeholder";
    document.body.appendChild(footerPlaceholder);
  }

  fetch("/components/footer.html")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((data) => {
      footerPlaceholder.innerHTML = data;
      
      // GUARANTEED execution to set the year the exact moment HTML is injected
      const yearSpan = document.getElementById("copyright-year");
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
      
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    })
    .catch((error) => console.error("Error loading footer:", error));
});
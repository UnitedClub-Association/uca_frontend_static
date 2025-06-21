document.addEventListener("DOMContentLoaded", function () {
  const clubTypeFilter = document.querySelector("#club-type-filter");
  const clubFilter = document.querySelector("#club-filter");
  const collabFilter = document.querySelector("#collab-filter");
  const eventCards = document.querySelectorAll(".event-card");

  function applyFilters() {
    const clubType = clubTypeFilter.value;
    const club = clubFilter.value;
    const collab = collabFilter.value;
    let visibleIndex = 0;

    eventCards.forEach((card) => {
      const cardType = card.getAttribute("data-type");
      const cardClubs = card.getAttribute("data-club").split(" ");
      const cardCollab = card.getAttribute("data-collab");

      const matchesType = clubType === "all" || cardType === clubType;
      const matchesClub = club === "all" || cardClubs.includes(club);
      const matchesCollab = collab === "all" || cardCollab === collab;

      if (matchesType && matchesClub && matchesCollab) {
        card.style.display = "block";
        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 50 * visibleIndex);
        visibleIndex++;
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 200);
      }
    });
  }

  clubTypeFilter.addEventListener("change", applyFilters);
  clubFilter.addEventListener("change", applyFilters);
  collabFilter.addEventListener("change", applyFilters);

  // Initial filter application
  applyFilters();
});
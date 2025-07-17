document.addEventListener("DOMContentLoaded", () => {
  // List of all clubs
  const allClubs = [
    { name: "Debate Club", link: "/clubs/debate-club.html" },
    { name: "Photography Club", link: "/clubs/photography-club.html" },
    { name: "Sports Club", link: "/clubs/sports-club.html" },
    { name: "Quiz Club", link: "/clubs/quiz-club.html" },
    { name: "Science Club", link: "/clubs/science-club.html" },
    { name: "Language Club", link: "/clubs/language-club.html" },
    { name: "ICT Club", link: "/clubs/ict-club.html" },
    { name: "Literature Club", link: "/clubs/literature-club.html" },
    { name: "Cultural Club", link: "/clubs/cultural-club.html" },
  ];

  // Shuffle clubs
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Display 5 random clubs
  function displayRandomClubs() {
    const clubsList = document.getElementById("clubs-list");
    if (!clubsList) return;

    const storedData = JSON.parse(localStorage.getItem("randomClubs") || "{}");
    const now = new Date().getTime();
    let shuffledClubs;

    if (storedData.clubs && storedData.expiry > now) {
      shuffledClubs = storedData.clubs;
    } else {
      shuffledClubs = shuffleArray(allClubs).slice(0, 5);
      localStorage.setItem("randomClubs", JSON.stringify({
        clubs: shuffledClubs,
        expiry: now + 24 * 60 * 60 * 1000,
      }));
    }

    clubsList.innerHTML = "";
    shuffledClubs.forEach((club) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = club.link;
      a.textContent = club.name;
      li.appendChild(a);
      clubsList.appendChild(li);
    });
  }

  // Update copyright year
  const yearSpan = document.getElementById("copyright-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({ width: "1em", height: "1em", "stroke-width": 1.5 });
  }

  // Call random clubs function
  displayRandomClubs();
});
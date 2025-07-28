document.addEventListener("DOMContentLoaded", () => {
  // --- Existing Club Shuffling Logic (Unchanged) ---
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

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function displayRandomClubs() {
    const clubsList = document.getElementById("clubs-list");
    if (!clubsList) return;
    const shuffledClubs = shuffleArray(allClubs).slice(0, 5);
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

  // --- Existing Copyright Year Logic (Unchanged) ---
  const yearSpan = document.getElementById("copyright-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- NEW: Anime.js Footer Sparkle Animation ---
  function initSparkleAnimation() {
    const container = document.querySelector(".sparkle-container");
    if (!container || typeof anime === 'undefined') return;

    const starColors = ['#FFFFFF', '#FFD700', '#87CEEB', '#E6E6FA'];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("sparkle");
        star.style.top = `${anime.random(0, 100)}%`;
        star.style.left = `${anime.random(0, 100)}%`;
        star.style.backgroundColor = starColors[anime.random(0, starColors.length - 1)];
        container.appendChild(star);
    }

    anime({
        targets: '.sparkle',
        opacity: [
            { value: () => anime.random(0.1, 0.9), duration: () => anime.random(500, 2000) },
            { value: 0, duration: () => anime.random(500, 2000) }
        ],
        width: () => `${anime.random(1, 3)}px`,
        height: (el) => el.style.width,
        translateX: () => `${anime.random(-25, 25)}px`,
        translateY: () => `${anime.random(-25, 25)}px`,
        scale: () => anime.random(1, 1.5),
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        delay: anime.stagger(10)
    });
  }

  // --- NEW: GSAP Social Icon Hover Effect ---
  function initSocialIconHovers() {
      gsap.utils.toArray('.social-icon').forEach(icon => {
          const tl = gsap.timeline({ paused: true });
          tl.to(icon, {
              y: -8,
              scale: 1.1,
              duration: 0.2,
              ease: 'power1.out'
          }).to(icon, {
              y: 0,
              duration: 0.4,
              ease: 'bounce.out'
          }, '-=0.1');

          icon.addEventListener('mouseenter', () => tl.restart());
      });
  }


  // --- Initialize All Functions ---
  displayRandomClubs();
  initSparkleAnimation();
  initSocialIconHovers();

  if (typeof feather !== "undefined") {
    feather.replace({ width: "1em", height: "1em", "stroke-width": 1.5 });
  }
});
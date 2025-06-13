document.addEventListener("DOMContentLoaded", function () {
  console.log("Join Us page loaded");

  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({
      "aria-hidden": "true",
      "stroke-width": 1.5,
      "color": "currentColor",
      "size": 20
    });
  }

  // Starfall animation
  const starryBg = document.createElement("div");
  starryBg.className = "starry-bg";
  document.body.appendChild(starryBg);

  function createStar() {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${-10}px`;
    const duration = Math.random() * 2 + 1; // 1-3s for fall speed
    star.style.animation = `fall ${duration}s linear`;
    starryBg.appendChild(star);

    star.addEventListener("animationend", () => star.remove());
    return duration;
  }

  function startStarfall() {
    const duration = createStar();
    const delay = Math.random() * 9000 + 1000; // 1-10s
    setTimeout(() => {
      setInterval(startStarfall, duration * 1000 + Math.random() * 9000 + 1000);
    }, delay);
  }

  // Initialize 20 stars
  for (let i = 0; i < 20; i++) {
    startStarfall();
  }
});

// Inline keyframes for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fall {
    0% { transform: translateY(-10px); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
`;
document.head.appendChild(style);
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({ "aria-hidden": "true" });
  }

  // Generate Stars
  const starsContainer = document.querySelector(".stars");
  const starCount = 50;

  for (let i = 1; i <= starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random properties
    const tailLength = randomRange(500, 750) / 100;
    const topOffset = randomRange(0, 10000) / 100;
    const fallDuration = randomRange(6000, 12000) / 1000;
    const fallDelay = randomRange(0, 10000) / 1000;

    star.style.setProperty("--star-tail-length", `${tailLength}em`);
    star.style.setProperty("--top-offset", `${topOffset}vh`);
    star.style.setProperty("--fall-duration", `${fallDuration}s`);
    star.style.setProperty("--fall-delay", `${fallDelay}s`);

    starsContainer.appendChild(star);
  }
});

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
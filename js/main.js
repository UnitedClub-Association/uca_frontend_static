document.addEventListener("DOMContentLoaded", () => {
  // Performance monitoring
  if (window.performance) {
    window.addEventListener("load", () => {
      const timing = performance.timing;
      console.log(`Page load time: ${timing.loadEventEnd - timing.navigationStart}ms`);
    });
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animate on scroll
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add("animated");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach((element) => observer.observe(element));
  } else {
    animatedElements.forEach((element) => element.classList.add("animated"));
  }

  // Constellation background
  const constellationBg = document.querySelector(".constellation-bg");
  if (constellationBg) {
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.style.position = "absolute";
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.backgroundColor = "white";
      star.style.borderRadius = "50%";
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.opacity = Math.random() * 0.6 + 0.1;
      star.style.animation = `twinkle ${Math.random() * 5 + 5}s infinite alternate`;
      constellationBg.appendChild(star);
    }
    const styleSheet = document.createElement("style");
    styleSheet.id = "twinkle-animation";
    styleSheet.innerText = `@keyframes twinkle { 0% { opacity: 0.2; transform: scale(0.8); } 100% { opacity: 0.7; transform: scale(1.2); } }`;
    document.head.appendChild(styleSheet);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Stats counter animation
  const stats = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !prefersReducedMotion) {
        const stat = entry.target;
        if (stat.classList.contains("is-counting")) return;
        stat.classList.add("is-counting");
        const target = parseInt(stat.getAttribute("data-count"), 10);
        let count = 0;
        const duration = 2000;
        const stepTime = Math.max(16, duration / target);
        const updateCount = () => {
          const increment = Math.ceil(target / (duration / stepTime));
          count += increment;
          stat.textContent = count >= 100 ? `${count}+` : count;
          if (count < target) {
            setTimeout(updateCount, stepTime);
          } else {
            stat.textContent = target >= 100 ? `${target}+` : target;
          }
        };
        updateCount();
        statsObserver.unobserve(stat);
      }
    });
  }, { threshold: 0.8 });
  stats.forEach((stat) => statsObserver.observe(stat));

  // Feather Icons Initialization
  if (typeof feather !== "undefined") {
    feather.replace({ width: "1em", height: "1em", "stroke-width": 1.5 });
  }
});
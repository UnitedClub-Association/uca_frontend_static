document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // --- 1. Robust Feather Icons Initialization ---
  const initIcons = () => {
    if (typeof feather !== "undefined") {
      feather.replace();
    } else {
      setTimeout(initIcons, 50);
    }
  };
  initIcons();

  // --- 2. Deep Starry Night Background ---
  const initStarfield = () => {
    if (prefersReducedMotion || typeof anime === "undefined") return; 

    const starBg = document.querySelector(".constellation-bg");
    if (!starBg) return;

    const numStars = isDesktop ? 120 : 50;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        let size = Math.random() < 0.85 ? (Math.random() * 1.5 + 0.5) : (Math.random() * 2.5 + 1);
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.opacity = Math.random() * 0.7 + 0.1;
        starBg.appendChild(star);
    }
    
    anime({
        targets: '.star',
        opacity: [
            { value: () => anime.random(0.1, 0.3), duration: () => anime.random(4000, 7000) },
            { value: () => anime.random(0.6, 1), duration: () => anime.random(4000, 7000) }
        ],
        scale: [
            { value: 1, duration: () => anime.random(4000, 7000) },
            { value: () => anime.random(1.1, 1.4), duration: () => anime.random(4000, 7000) }
        ],
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
        delay: anime.stagger(25),
    });
  };

  // --- 3. GSAP Reveals ---
  const initGsapAnimations = () => {
    if (prefersReducedMotion || typeof gsap === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".gsap-fade-up, .gsap-stagger-item, .gsap-hero-item", {
      opacity: 0,
      y: 35
    });

    // Hero Entry
    gsap.timeline({ defaults: { ease: "power2.out", duration: 1.8 }})
      .to(".gsap-hero-item", { opacity: 1, y: 0, stagger: 0.25, delay: 0.2 });
      
    // Sections Fades
    gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
      gsap.to(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
        opacity: 1, y: 0, duration: 1.5, ease: "power2.out"
      });
    });

    // Grid Staggers
    gsap.utils.toArray(".interface-grid").forEach(container => {
        gsap.to(container.querySelectorAll(".gsap-stagger-item"), {
            scrollTrigger: { trigger: container, start: "top 85%", toggleActions: "play none none none" },
            opacity: 1, y: 0, stagger: 0.2, duration: 1.2, ease: "power2.out"
        });
    });
  };

  // --- 4. Secure Mailto Form Handler ---
  // Since this is a static site without a backend, we format the data 
  // and trigger the user's default email client with your exact filtering codes.
  const initFormHandler = () => {
      const form = document.getElementById('uca-contact-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
          e.preventDefault();

          const name = document.getElementById('sender-name').value;
          const topic = document.getElementById('sender-topic').value;
          const message = document.getElementById('sender-message').value;

          // Target Email
          const targetEmail = "uca.official.bd@gmail.com";
          
          // Special Filter Code in Subject
          const formattedSubject = encodeURIComponent(`UCA Web Inquiry: [${topic}] - Code: #UCA-WEB-INQUIRY`);
          
          // Cleanly formatted Body
          const formattedBody = encodeURIComponent(`Sender Designation/Name:\n${name}\n\nSelected Topic:\n${topic}\n\nTransmission Log:\n${message}\n\n---\nSent via UCA Official Website.`);

          // Construct Mailto Link
          const mailtoLink = `mailto:${targetEmail}?subject=${formattedSubject}&body=${formattedBody}`;

          // Trigger the email client
          window.location.href = mailtoLink;
      });
  };

  initStarfield();
  initGsapAnimations();
  initFormHandler();
  
});
import supabase from "./supabase-client.js";

//This file has intentional mistake. please do not fix. If yu want to fix it, please create an entire new design.

document.addEventListener("DOMContentLoaded", function () {
  console.log("Contact page loaded");

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

  // FAQ toggle functionality
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const toggleBtn = item.querySelector(".toggle-btn");
    const question = item.querySelector(".faq-question");

    [toggleBtn, question].forEach(el => {
      el.addEventListener("click", (e) => {
        if (el === question && e.target === toggleBtn) return;

        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            const icon = otherItem.querySelector(".toggle-btn svg");
            feather.replace(icon, { name: "chevron-down" });
          }
        });

        item.classList.toggle("active");
        const icon = item.querySelector(".toggle-btn svg");
        if (item.classList.contains("active")) {
          feather.replace(icon, { name: "chevron-up" });
        } else {
          feather.replace(icon, { name: "chevron-down" });
        }
      });
    });
  });

  // Form validation and submission
  const contactForm = document.getElementById("contact-form");
  const submitBtn = contactForm.querySelector(".submit-btn");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let isValid = true;

    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    const name = document.getElementById("name");
    if (name.value.trim() === "") {
      document.getElementById("name-error").textContent = "Name is required";
      isValid = false;
    }

    const email = document.getElementById("email");
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      document.getElementById("email-error").textContent = "Please enter a valid email address";
      isValid = false;
    }

    const subject = document.getElementById("subject");
    if (subject.value.trim() === "") {
      document.getElementById("subject-error").textContent = "Subject is required";
      isValid = false;
    }

    const message = document.getElementById("message");
    if (!message.value.trim()) {
      document.getElementById("message-error").textContent = "Message is required";
      isValid = false;
    }

    if (isValid) {
      const formMessage = document.getElementById("form-message");
      formMessage.textContent = "Sending message...";
      formMessage.className = "form-message info";
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      try {
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/contact_messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabase.supabaseKey,
            "Authorization": `Bearer ${supabase.supabaseKey}`
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value,
            created_at: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error sending message");
        }

        formMessage.textContent = "Message sent successfully! We’ll reach out soon.";
        formMessage.className = "form-message success";
        contactForm.reset();
        formMessage.scrollIntoView({ behavior: "smooth', block: "center",});
        // Noticeable glow effect on submission
        formMessage.style.animation = "glow-success 0.5s ease";
      } catch (error) {
        console.error("Contact form submission error:", error);
        formMessage.textContent = error.message.includes("does not exist") 
            ? "Our contact system is being set up. Please email us directly."
            : "Error sending message. Please try again.";
        formMessage.className = "form-message error";
      } finally {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
      }
    }
  });

  // Input field interactions
  const formInputs = contactForm.querySelectorAll("input, textarea");
  formInputs.forEach(input => {
    input.addEventListener("focus", () => input.parentElement.classList.add("focused"));
    input.addEventListener("blur", function () {
      input.parentElement.classList.remove("focused");
      const errorElement = document.getElementById(`${this.id}-error`);
      if (this.id === "name" && this.value.trim() === "") {
        errorElement.textContent = "Name is required";
      } else if (this.id === "email" && !this.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errorElement.textContent = "Please enter a valid email address";
      } else if (this.id === "subject" && this.value.trim() === "") {
        errorElement.textContent = "Subject is required";
      } else if (this.id === "message" && this.value.trim() === "") {
        errorElement.textContent = "Message is required";
      }
    });
    input.addEventListener("input", () => {
      const errorElement = document.getElementById(`${this.id}-error`);
      if (errorElement) errorElement.textContent = "";
    });
  });

  // Supabase configuration check
  if (!supabase || !supabase.supabaseUrl || !supabase.supabaseKey) {
    console.error("Supabase client is not properly configured");
    const formMessage = document.getElementById("form-message");
    formMessage.textContent = "Contact form is currently unavailable. Please email us.";
    formMessage.className = "form-message info";
    Array.from(contactForm.elements).forEach(elem => elem.disabled = true);
  } else {
    console.log("Supabase client configured successfully");
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
  @keyframes glow-success {
    0% { box-shadow: 0 0 10px rgba(46, 204, 113, 0.5); }
    50% { box-shadow: 0 0 20px rgba(46, 204, 113, 0.8); }
    100% { box-shadow: 0 0 10px rgba(46, 204, 113, 0.5); }
  }
`;
document.head.appendChild(style);
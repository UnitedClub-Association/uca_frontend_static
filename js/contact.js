import supabase from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({
      "aria-hidden": "true",
    });
  }

  // FAQ toggle functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const toggleBtn = item.querySelector('.toggle-btn');
    toggleBtn.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const icon = otherItem.querySelector('.toggle-btn svg');
          feather.replace(icon, { name: 'chevron-down' });
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
      const icon = item.querySelector('.toggle-btn svg');
      if (item.classList.contains('active')) {
        feather.replace(icon, { name: 'chevron-up' });
      } else {
        feather.replace(icon, { name: 'chevron-down' });
      }
    });
  });

  // Form validation
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let isValid = true;

    // Reset error messages
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));

    // Name validation
    const name = document.getElementById("name");
    if (name.value.trim() === "") {
      document.getElementById("name-error").textContent = "Name is required";
      isValid = false;
    }

    // Email validation
    const email = document.getElementById("email");
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      document.getElementById("email-error").textContent =
        "Please enter a valid email address";
      isValid = false;
    }

    // Subject validation
    const subject = document.getElementById("subject");
    if (subject.value.trim() === "") {
      document.getElementById("subject-error").textContent =
        "Subject is required";
      isValid = false;
    }

    // Message validation
    const message = document.getElementById("message");
    if (message.value.trim() === "") {
      document.getElementById("message-error").textContent =
        "Message is required";
      isValid = false;
    }

    // If form is valid, submit it to Supabase
    if (isValid) {
      const formMessage = document.getElementById("form-message");
      formMessage.textContent = "Sending message...";
      formMessage.className = "form-message";
  
      try {
        // Use Supabase REST endpoint with anonymous key
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/contact_messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value,
            created_at: new Date().toISOString(),
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error sending message');
        }
  
        formMessage.textContent = "Thank you for your message! We'll get back to you soon.";
        formMessage.className = "form-message success";
  
        // Reset form
        contactForm.reset();
      } catch (error) {
        formMessage.textContent = error.message || "Error sending message. Please try again.";
        formMessage.className = "form-message error";
      }
    }
  });
});

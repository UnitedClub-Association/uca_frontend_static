import supabase from "./supabase-client.js";

// Add console logs to debug
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({
      "aria-hidden": "true",
    });
    console.log("Feather icons initialized");
  }

  // Check if forms exist
  const registrationForm = document.getElementById("registration-form");
  const loginForm = document.getElementById("login-form");

  console.log("Registration form:", registrationForm);
  console.log("Login form:", loginForm);

  // Check if Supabase is initialized
  console.log("Supabase client:", supabase);

  // Tab switching functionality
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons and contents
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Show corresponding content
      const tabId = this.getAttribute("data-tab") + "-tab";
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Toggle password visibility for all password fields
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordField = this.parentElement.querySelector("input");
      const type =
        passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);

      // Toggle icon
      const icon = this.querySelector("svg");
      if (type === "password") {
        feather.replace(icon, { name: "eye" });
      } else {
        feather.replace(icon, { name: "eye-off" });
      }
    });
  });

  // Toggle class field based on role selection
  const roleStudent = document.getElementById("role-student");
  const roleTeacher = document.getElementById("role-teacher");
  const classField = document.getElementById("class-field");
  const classSelect = document.getElementById("class");

  function toggleClassField() {
    if (roleTeacher.checked) {
      classField.classList.add("disabled");
      classSelect.disabled = true;
      classSelect.required = false;
    } else {
      classField.classList.remove("disabled");
      classSelect.disabled = false;
      classSelect.required = true;
    }
  }

  roleStudent.addEventListener("change", toggleClassField);
  roleTeacher.addEventListener("change", toggleClassField);

  // Password strength meter
  const passwordInput = document.getElementById("reg-password");
  const strengthMeter = document.getElementById("strength-meter-fill");
  const strengthText = document.getElementById("strength-text");

  passwordInput.addEventListener("input", function () {
    const password = this.value;
    let strength = 0;
    let status = "";

    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;

    strengthMeter.className = "strength-meter-fill";

    if (password.length === 0) {
      strengthMeter.style.width = "0";
      strengthText.textContent = "Password strength";
    } else if (strength < 2) {
      strengthMeter.classList.add("weak");
      strengthText.textContent = "Weak password";
      strengthText.style.color = "var(--join-error)";
    } else if (strength < 4) {
      strengthMeter.classList.add("medium");
      strengthText.textContent = "Medium password";
      strengthText.style.color = "var(--join-warning)";
    } else {
      strengthMeter.classList.add("strong");
      strengthText.textContent = "Strong password";
      strengthText.style.color = "var(--join-success)";
    }
  });

  // Form validation
  // Registration form is already declared above, no need to redeclare
  // loginForm is already declared at the top of the file
  const confirmPassword = document.getElementById("confirm-password");
  const mobileInput = document.getElementById("mobile");
  const termsCheckbox = document.getElementById("terms");

  // Mobile number validation
  mobileInput.addEventListener("input", function () {
    // Remove non-numeric characters
    this.value = this.value.replace(/\D/g, "");

    // Limit to exactly 10 digits
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
    }
  });

  // Add tooltips to required fields
  const requiredLabels = document.querySelectorAll("label .required");
  requiredLabels.forEach((label) => {
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = "This field is required";
    label.appendChild(tooltip);
  });

  // Validate registration form
  registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let isValid = true;

    // Reset error messages
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));

    // First name validation
    const firstName = document.getElementById("firstName");
    if (firstName.value.trim() === "") {
      document.getElementById("firstName-error").textContent =
        "First name is required";
      isValid = false;
    }

    // Last name validation
    const lastName = document.getElementById("lastName");
    if (lastName.value.trim() === "") {
      document.getElementById("lastName-error").textContent =
        "Last name is required";
      isValid = false;
    }

    // Email validation
    const email = document.getElementById("email");
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      document.getElementById("email-error").textContent =
        "Please enter a valid email address";
      isValid = false;
    }

    // Password validation - keep only the minimum length requirement
    if (passwordInput.value.length < 6) {
      document.getElementById("password-error").textContent =
        "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (passwordInput.value !== confirmPassword.value) {
      document.getElementById("confirm-password-error").textContent =
        "Passwords do not match";
      isValid = false;
    }

    // Mobile number validation
    if (mobileInput.value.length !== 10) {
      document.getElementById("mobile-error").textContent =
        "Mobile number must be exactly 10 digits";
      isValid = false;
    }

    // Class validation for students
    if (roleStudent.checked && classSelect.value === "") {
      document.getElementById("class-error").textContent =
        "Please select your class";
      isValid = false;
    }

    // Terms validation
    if (!termsCheckbox.checked) {
      document.getElementById("terms-error").textContent =
        "You must agree to the terms and conditions";
      isValid = false;
    }

    // If form is valid, submit it
    if (isValid) {
      const formMessage = document.getElementById("register-message");
      formMessage.textContent = "Processing registration...";
      formMessage.className = "form-message";

      const email = document.getElementById("email").value;
      const password = passwordInput.value;

      try {
        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
            options: {
              data: {
                first_name: document.getElementById("firstName").value,
                last_name: document.getElementById("lastName").value,
                mobile: document.getElementById("mobile").value,
                role: document.querySelector('input[name="role"]:checked')
                  .value,
                class: document.getElementById("class").value || null,
              },
            },
          }
        );

        if (authError) throw authError;

        // No need to insert into profiles table manually
        // Supabase will handle this with the right triggers

        formMessage.textContent =
          "Registration successful! Please check your email to confirm your account.";
        formMessage.className = "form-message success";

        // Clear the form
        registrationForm.reset();
      } catch (error) {
        formMessage.textContent =
          error.message || "Registration failed. Please try again.";
        formMessage.className = "form-message error";
      }
    }
  });

  // Validate login form
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      console.log("Login form submitted");
      event.preventDefault();
      let isValid = true;

      // Reset error messages
      document
        .querySelectorAll(".error-message")
        .forEach((el) => (el.textContent = ""));

      // Email validation
      const loginEmail = document.getElementById("login-email");
      if (!loginEmail.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById("login-email-error").textContent =
          "Please enter a valid email address";
        isValid = false;
      }

      // Password validation
      const loginPassword = document.getElementById("password");
      if (loginPassword.value.length < 1) {
        document.getElementById("login-password-error").textContent =
          "Please enter your password";
        isValid = false;
      }

      // If form is valid, sign in with Supabase
      if (isValid) {
        const formMessage = document.getElementById("login-message");
        formMessage.textContent = "Signing in...";
        formMessage.className = "form-message";

        try {
          console.log("Attempting to sign in with:", loginEmail.value);
          const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail.value,
            password: loginPassword.value,
          });

          console.log("Sign in response:", data, error);

          if (error) throw error;

          formMessage.textContent = "Login successful! Redirecting...";
          formMessage.className = "form-message success";

          // Redirect to the UCA app site
          console.log("Redirecting to UCA app...");
          setTimeout(() => {
            window.location.href = "https://uca-app.netlify.app";
          }, 2000);
        } catch (error) {
          console.error("Login error:", error);
          formMessage.textContent =
            error.message || "Login failed. Please check your credentials.";
          formMessage.className = "form-message error";
        }
      }
    });
  }
});

// Add a more thorough email validation function
function isValidEmail(email) {
  // Basic format check
  const basicCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!basicCheck) return false;

  // Check for common domains and proper TLD length
  const parts = email.split("@");
  const domain = parts[1];
  const tld = domain.split(".").pop();

  // TLD should be at least 2 characters and domain should have at least one character before the dot
  return tld.length >= 2 && domain.indexOf('.') > 0;
}

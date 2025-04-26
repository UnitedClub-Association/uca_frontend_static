import supabase from "./supabase-client.js";

// REMOVE: Helper function to generate Device ID (Supabase handles sessions)
// function generateDeviceId() {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0,
//       v = c == "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// --- NEW: Math Puzzle Generation ---
function generateMathPuzzle() {
  const num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
  const num2 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
  const expectedAnswer = num1 + num2;
  const questionLabel = document.getElementById("math-question-label");
  const expectedAnswerInput = document.getElementById("math-expected-answer");
  const mathAnswerInput = document.getElementById("math-answer"); // Get the user input field

  if (questionLabel && expectedAnswerInput && mathAnswerInput) {
    questionLabel.textContent = `Verification: What is ${num1} + ${num2}?`;
    expectedAnswerInput.value = expectedAnswer;
    mathAnswerInput.value = ''; // Clear previous user answer
    clearFieldError('math-error'); // Clear previous math error
  } else {
    console.error("Math puzzle elements not found.");
  }
}
// --- END NEW ---

// --- NEW: Password Strength Calculation ---
function calculatePasswordStrength(password) {
  let score = 0;
  if (!password) return 0;

  // Award points for length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Award points for character types
  if (/[a-z]/.test(password)) score++; // Lowercase
  if (/[A-Z]/.test(password)) score++; // Uppercase
  if (/\d/.test(password)) score++;   // Digits
  if (/[^A-Za-z0-9]/.test(password)) score++; // Symbols

  // Simple score to category mapping
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

function updatePasswordStrengthUI(password) {
  const strengthMeterFill = document.getElementById('strength-meter-fill');
  const strengthText = document.getElementById('strength-text');
  if (!strengthMeterFill || !strengthText) return;

  const strength = calculatePasswordStrength(password);

  strengthMeterFill.className = 'strength-meter-fill'; // Reset classes
  strengthText.textContent = 'Password strength'; // Reset text

  if (password.length > 0) {
    strengthMeterFill.classList.add(strength);
    strengthText.textContent = `Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}`;
  } else {
     strengthText.textContent = 'Password strength'; // Default text when empty
  }
}
// --- END NEW ---


// --- NEW: Toggle Password Visibility ---
function togglePasswordVisibility(button) {
    const wrapper = button.closest('.password-input-wrapper');
    if (!wrapper) return;
    const passwordInput = wrapper.querySelector('input[type="password"], input[type="text"]');
    const icon = button.querySelector('i');

    if (!passwordInput || !icon) return;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.setAttribute('data-feather', 'eye-off');
    } else {
        passwordInput.type = 'password';
        icon.setAttribute('data-feather', 'eye');
    }
    // Re-initialize Feather icons for the changed icon
    if (typeof feather !== 'undefined') {
        feather.replace({ 'aria-hidden': 'true' });
    }
}
// --- END NEW ---


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({
      "aria-hidden": "true",
    });
    console.log("Feather icons initialized");
  }

  // Get form elements
  const registrationForm = document.getElementById("registration-form");
  const loginForm = document.getElementById("login-form");
  const registrationMessage = document.getElementById("register-message");
  const loginMessage = document.getElementById("login-message");
  const registerSubmitBtn = document.getElementById("register-submit-btn");
  // REMOVE: const captchaErrorElement = document.getElementById("captcha-error");

  // REMOVE: window.validatedUserData = null;

  // --- NEW: Generate Math Puzzle on Load ---
  if (document.getElementById("math-puzzle-group")) {
    generateMathPuzzle();
  }
  // --- END NEW ---

  // --- Form Interaction Logic ---
  // Handle institution type selection
  const institutionUlsc = document.getElementById("institution-ulsc");
  const institutionOther = document.getElementById("institution-other");
  const otherInstitutionField = document.getElementById(
    "other-institution-field"
  );
  const institutionNameInput = document.getElementById("institution-name");

  if (
    institutionUlsc &&
    institutionOther &&
    otherInstitutionField &&
    institutionNameInput
  ) {
    // Initial state setup
    if (institutionUlsc.checked) {
      otherInstitutionField.style.display = "none";
      institutionNameInput.required = false;
    } else if (institutionOther.checked) {
      otherInstitutionField.style.display = "block";
      institutionNameInput.required = true;
    }

    institutionUlsc.addEventListener("change", function () {
      otherInstitutionField.style.display = "none";
      institutionNameInput.required = false;
      institutionNameInput.value = ""; // Clear the field
    });

    institutionOther.addEventListener("change", function () {
      otherInstitutionField.style.display = "block";
      institutionNameInput.required = true;
    });
  } else {
    console.warn("Institution fields not found.");
  }

  // Handle role selection for class field
  const roleStudent = document.getElementById("role-student");
  const roleTeacher = document.getElementById("role-teacher");
  const classField = document.getElementById("class-field");
  const classSelect = document.getElementById("class");

  if (roleStudent && roleTeacher && classField && classSelect) {
    // Initial state setup
    if (roleStudent.checked) {
      classField.classList.remove("disabled");
      classSelect.disabled = false;
      classSelect.required = true;
    } else if (roleTeacher.checked) {
      classField.classList.add("disabled");
      classSelect.disabled = true;
      classSelect.required = false;
    }

    roleStudent.addEventListener("change", function () {
      classField.classList.remove("disabled");
      classSelect.disabled = false;
      classSelect.required = true;
    });

    roleTeacher.addEventListener("change", function () {
      classField.classList.add("disabled");
      classSelect.disabled = true;
      classSelect.required = false;
      classSelect.value = ""; // Reset selection
    });
  } else {
    console.warn("Role or Class fields not found.");
  }

  // --- Registration Logic ---
  if (registrationForm && registerSubmitBtn) {
    registrationForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Clear previous messages and disable submit button
      registerSubmitBtn.disabled = true;
      clearErrorMessages(registrationForm); // Includes clearing math error now
      if (registrationMessage) {
        registrationMessage.textContent = ""; // Clear previous status messages
        registrationMessage.className = "form-message";
      }

      // --- NEW: Honeypot Check ---
      const honeypotInput = document.getElementById("website");
      if (honeypotInput && honeypotInput.value !== "") {
          console.warn("Honeypot field filled, likely a bot.");
          // Optionally display a generic error or just block submission silently
          if (registrationMessage) {
              registrationMessage.textContent = "Registration failed. Please try again.";
              registrationMessage.className = "form-message error";
          }
          registerSubmitBtn.disabled = false; // Re-enable button
          return; // Stop submission
      }
      // --- END NEW ---


      if (validateRegistrationForm()) { // Validation now includes the math puzzle
        // Validation now includes the math puzzle
        // Collect user data after validation passes
        const userData = {
          first_name: document.getElementById("firstName").value.trim(),
          last_name: document.getElementById("lastName").value.trim(),
          username: document.getElementById("username").value.trim(),
          email: document.getElementById("email").value.trim(),
          password: document.getElementById("reg-password").value, // **INSECURE - HASH ON BACKEND**
          institution_type: institutionUlsc.checked ? "ulsc" : "other",
          institution_name: institutionUlsc.checked
            ? "University Laboratory School and College"
            : institutionNameInput.value.trim(),
          phone: "+880" + document.getElementById("mobile").value.trim(), // Assuming +880 prefix
          role: roleStudent.checked ? "student" : "teacher",
          class:
            roleStudent.checked && classSelect.value ? classSelect.value : null,
          // Add a default verification status if needed for manual approval later
          // is_verified: false // Example: Add this if your backend expects it
        };

        // REMOVE: window.validatedUserData = userData;

        // Display message and call registration directly
        if (registrationMessage) {
          registrationMessage.textContent = "Registering...";
          registrationMessage.className = "form-message info";
        }
        console.log("Form validated, attempting registration directly...");

        // REMOVE hCaptcha execution logic
        // if (typeof hcaptcha !== 'undefined') { ... } else { ... }

        // Call completeRegistration directly (no captcha token needed)
        try {
          await completeRegistration(userData); // Pass only userData
        } catch (error) {
          // Error handling is mostly within completeRegistration,
          // but ensure button is re-enabled if an error bubbles up here.
          console.error("Error during registration submission:", error);
          if (registrationMessage) {
            registrationMessage.textContent =
              "An unexpected error occurred during submission.";
            registrationMessage.className = "form-message error";
          }
          registerSubmitBtn.disabled = false; // Ensure button is re-enabled
        }
      } else {
        // If validation fails, re-enable the button
        registerSubmitBtn.disabled = false;
        console.log("Registration form validation failed.");
        // Regenerate puzzle on failed attempt to prevent simple retries
        if (document.getElementById("math-puzzle-group")) {
          generateMathPuzzle();
        }
      }
    });
  } else {
    console.warn("Registration form or submit button not found.");
  }

  // --- Login Logic ---
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("Login form submitted");

      if (!loginMessage) {
        console.error("Login message element not found.");
        return;
      }

      loginMessage.textContent = ""; // Clear previous messages
      loginMessage.className = "form-message";

      const identifierInput = document.getElementById("login-identifier");
      const passwordInput = document.getElementById("password");

      if (!identifierInput || !passwordInput) {
        loginMessage.textContent = "Login failed: Form fields missing.";
        loginMessage.className = "form-message error";
        return;
      }

      const identifier = identifierInput.value.trim();
      const password = passwordInput.value;

      if (!identifier || !password) {
        loginMessage.textContent = "Please fill in all fields.";
        loginMessage.className = "form-message error";
        return;
      }

      try {
        loginMessage.textContent = "Signing in...";
        loginMessage.className = "form-message info";

        const isEmail = identifier.includes("@");
        const { data: userArray, error: fetchError } = await supabase
          .from("members")
          .select("*")
          .or(isEmail ? `email.eq.${identifier}` : `username.eq.${identifier}`)
          .limit(1);

        if (fetchError) throw fetchError;

        if (!userArray || userArray.length === 0) {
          loginMessage.textContent =
            "User not found. Please check your username/email.";
          loginMessage.className = "form-message error";
          return;
        }

        const user = userArray[0];

        if (user.password !== password) {
          loginMessage.textContent = "Invalid password. Please try again.";
          loginMessage.className = "form-message error";
          return;
        }

        loginMessage.textContent = "Password verified. Completing login...";
        loginMessage.className = "form-message info";

        const deviceId = generateDeviceId();
        localStorage.setItem("deviceId", deviceId);

        const { data, error } = await supabase
          .from("members")
          .update({ device_id: deviceId })
          .or(isEmail ? `email.eq.${identifier}` : `username.eq.${identifier}`)
          .select();

        if (error) throw error;

        console.log("Login successful:", data); // This 'data' is from the device_id update
        window.location.href = "/"; // Redirects to the root on successful login
        // --- End Login Success Path ---
      } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent =
          "Login failed: " + (error.message || "An unexpected error occurred.");
        loginMessage.className = "form-message error";
      } finally {
        // Always re-enable button unless redirecting
        if (window.location.pathname !== '/') { // Simple check if not redirected yet
             loginSubmitBtn.disabled = false;
        }
      }
    });
  } else {
    console.warn("Login form not found.");
  }

  async function completeRegistration(userData, captchaToken) {
    // Added captchaToken parameter
    const registrationMessage = document.getElementById("register-message");
    const registerSubmitBtn = document.getElementById("register-submit-btn"); // Get button again
    if (!registrationMessage || !registerSubmitBtn) {
      console.error(
        "Registration message or submit button element not found in completeRegistration."
      );
      return; // Exit if elements aren't found
    }

    console.log("Attempting completeRegistration with data:", userData); // Log incoming data
    // Ensure message is still 'Verifying...' before Supabase call
    registrationMessage.textContent = "Verifying registration...";
    registrationMessage.className = "form-message info";

    try {
      // Add device ID and timestamp just before insertion
      userData.device_id = generateDeviceId();
      localStorage.setItem("deviceId", userData.device_id);
      userData.created_at = new Date().toISOString();

      console.log("Data prepared for insertion:", userData); // Log data before insert

      // Attempt to insert the user data
      console.log("Calling supabase.from('members').insert()..."); // Log before Supabase call
      const { data, error } = await supabase
        .from("members")
        .insert([userData])
        .select();
      console.log("Supabase insert call finished."); // Log after Supabase call returns

      if (error) {
        console.error("Supabase insert error object:", error); // Log the specific error object
        // Check for unique constraint violation (PostgreSQL error code 23505)
        if (error.code === "23505") {
          if (error.message.includes("members_email_unique")) {
            displayFieldError(
              "email-error",
              "This email address is already registered."
            );
            throw new Error("Email already registered."); // Throw specific error
          } else if (error.message.includes("members_username_unique")) {
            displayFieldError(
              "username-error",
              "This username is already taken."
            );
            throw new Error("Username already taken."); // Throw specific error
          }
        }
        // Throw other errors
        throw error;
      }

      console.log("Registration successful (Supabase data):", data); // Log success data
      console.log("Attempting to update message to success..."); // <<< ADDED LOG
      registrationMessage.textContent =
        "Registration successful! You can now log in.";
      registrationMessage.className = "form-message success";
      console.log("Message updated to success."); // <<< ADDED LOG

      registrationForm.reset(); // Reset the form on success
      // Optionally switch to login tab
      const loginTab = document.querySelector('[data-tab="login"]');
      if (loginTab) loginTab.click();
    } catch (error) {
      console.error("Caught error during registration process:", error); // Log any caught error
      console.log("Attempting to update message to error..."); // <<< ADDED LOG
      // Display specific errors caught above, or a generic one
      registrationMessage.textContent =
        error.message.includes("already registered") ||
        error.message.includes("already taken")
          ? error.message // Show specific duplicate message
          : "Registration failed. Please check the details and try again."; // Generic failure
      registrationMessage.className = "form-message error";
      console.log("Message updated to error."); // <<< ADDED LOG
      // Do not re-throw here unless needed upstream, but re-enable button
    } finally {
      console.log("Executing finally block of completeRegistration."); // Log finally block entry
      // Always re-enable the submit button after attempt (success or fail)
      if (registerSubmitBtn) registerSubmitBtn.disabled = false;
      window.validatedUserData = null; // Clear global data after attempt
      // Reset hcaptcha
      // --- EDIT: Add check before resetting hCaptcha in finally block ---
      if (typeof hcaptcha !== "undefined") {
        try {
          hcaptcha.reset();
        } catch (e) {
          console.warn("Could not reset hCaptcha in finally block", e);
        }
      } else {
        console.warn(
          "hCaptcha object not found in finally block, cannot reset."
        );
      }
      // --- END EDIT ---
      console.log(
        "Registration attempt finished, button re-enabled, captcha reset."
      ); // Log end of finally
    }
  }

  // --- Validation and Helper Functions ---
  function validateRegistrationForm() {
    const termsCheckbox = document.getElementById("terms");
    let isValid = true;

    const requiredFields = registrationForm.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        displayFieldError(`${field.id}-error`, "This field is required.");
        isValid = false;
      } else {
        clearFieldError(`${field.id}-error`);
      }
    });

    if (!termsCheckbox || !termsCheckbox.checked) {
      displayFieldError(
        "terms-error",
        "You must agree to the terms and conditions."
      );
      isValid = false;
    } else {
      clearFieldError("terms-error");
    }

    // REMOVE Captcha validation check if any existed here

    return isValid;
  }

  function clearFieldError(errorId) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) {
      errorSpan.textContent = "";
    }
  }

  function displayFieldError(errorId, message) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function clearErrorMessages(form) {
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((el) => (el.textContent = ""));
    // Also clear math error specifically if it exists outside the standard querySelector scope
    const mathError = document.getElementById('math-error');
    if (mathError) mathError.textContent = '';
  }

  // Modify displayFieldError to handle ID strings or element references
  function displayFieldError(elementOrId, message) {
      let element;
      if (typeof elementOrId === 'string') {
          element = document.getElementById(elementOrId);
      } else {
          element = elementOrId; // Assume it's already an element
      }

      if (element) {
          element.textContent = message;
      } else {
          console.warn("Could not find error element:", elementOrId);
      }
  }


  // --- completeRegistration function ---
  // REMOVE the captchaToken parameter and any logic using it
  async function completeRegistration(userData /* REMOVE: , captchaToken */) {
    const registrationMessage = document.getElementById("register-message");
    const registerSubmitBtn = document.getElementById("register-submit-btn");
    // ... rest of the function remains largely the same, just ensure no captchaToken is used ...

    console.log("Attempting completeRegistration with data:", userData);
    registrationMessage.textContent = "Verifying registration...";
    registrationMessage.className = "form-message info";

    try {
      // ... (add device_id, created_at) ...
      userData.device_id = generateDeviceId();
      localStorage.setItem("deviceId", userData.device_id);
      userData.created_at = new Date().toISOString();

      console.log("Data prepared for insertion:", userData);

      // ... (Supabase insert call) ...
      const { data, error } = await supabase
        .from("members")
        .insert([userData])
        .select();

      // ... (Error handling for Supabase insert) ...
      if (error) {
        console.error("Supabase insert error object:", error);
        if (error.code === "23505") {
          if (error.message.includes("members_email_unique")) {
            displayFieldError("email-error", "This email address is already registered.");
            throw new Error("Email already registered.");
          } else if (error.message.includes("members_username_unique")) {
            displayFieldError("username-error", "This username is already taken.");
            throw new Error("Username already taken.");
          }
        }
        throw error; // Re-throw other errors
      }

      // ... (Success handling) ...
      console.log("Registration successful (Supabase data):", data);
      registrationMessage.textContent =
        "Registration successful! Redirecting...";
      registrationMessage.className = "form-message success";

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/"; // Redirect to homepage or login page
      }, 2000);

    } catch (error) {
      console.error("Error in completeRegistration:", error);
      // Display specific errors caught from Supabase or generic error
      if (registrationMessage) {
          // Use the error message thrown if available (e.g., "Email already registered.")
          registrationMessage.textContent = error.message || "Registration failed. Please check your details and try again.";
          registrationMessage.className = "form-message error";
      }
      // Regenerate puzzle on failed registration attempt
      if (document.getElementById("math-puzzle-group")) {
          generateMathPuzzle();
      }
      // Ensure button is re-enabled ONLY if the error wasn't a success-redirect scenario
      if (registerSubmitBtn) registerSubmitBtn.disabled = false;
    }
  }

  // ... rest of the existing code ...
});

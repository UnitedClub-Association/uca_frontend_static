import supabase from "./supabase-client.js";

// Helper function to generate Device ID
function generateDeviceId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// --- Global reCAPTCHA Success Callback ---
window.onRecaptchaSuccess = async function(token) {
  console.log("reCAPTCHA verification successful");
  const registrationMessage = document.getElementById("register-message");
  const registerSubmitBtn = document.getElementById('register-submit-btn');

  if (!window.validatedUserData) {
    console.error("No validated user data found");
    if (registrationMessage) {
      registrationMessage.textContent = "An unexpected error occurred. Please try again.";
      registrationMessage.className = "form-message error";
    }
    grecaptcha.reset();
    if(registerSubmitBtn) registerSubmitBtn.disabled = false;
    return;
  }

  try {
    await completeRegistration(window.validatedUserData);
    window.validatedUserData = null;
    grecaptcha.reset();
  } catch (error) {
    grecaptcha.reset();
    if(registerSubmitBtn) registerSubmitBtn.disabled = false;
    window.validatedUserData = null;
  }
};

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
  const captchaContainer = document.getElementById('captcha-container');
  const registerSubmitBtn = document.getElementById('register-submit-btn');

  // --- State for Registration Flow ---
  let isCaptchaRequired = false;

  // Store validated data globally
  window.validatedUserData = null;

  // --- Form Interaction Logic ---

  // Handle institution type selection
  const institutionUlsc = document.getElementById("institution-ulsc");
  const institutionOther = document.getElementById("institution-other");
  const otherInstitutionField = document.getElementById("other-institution-field");
  const institutionNameInput = document.getElementById("institution-name");

  if (institutionUlsc && institutionOther && otherInstitutionField && institutionNameInput) {
    // Initial state setup
    if (institutionUlsc.checked) {
      otherInstitutionField.style.display = "none";
      institutionNameInput.required = false;
    } else if (institutionOther.checked) {
      otherInstitutionField.style.display = "block";
      institutionNameInput.required = true;
    }

    institutionUlsc.addEventListener("change", function() {
      otherInstitutionField.style.display = "none";
      institutionNameInput.required = false;
      institutionNameInput.value = ""; // Clear the field
    });

    institutionOther.addEventListener("change", function() {
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

    roleStudent.addEventListener("change", function() {
      classField.classList.remove("disabled");
      classSelect.disabled = false;
      classSelect.required = true;
    });

    roleTeacher.addEventListener("change", function() {
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
      clearErrorMessages(registrationForm);
      if (registrationMessage) {
        registrationMessage.textContent = ""; // Clear previous status messages
        registrationMessage.className = "form-message";
      }

      if (validateRegistrationForm()) {
        // Collect user data after validation passes
        const userData = {
          first_name: document.getElementById("firstName").value.trim(),
          last_name: document.getElementById("lastName").value.trim(),
          username: document.getElementById("username").value.trim(),
          email: document.getElementById("email").value.trim(),
          password: document.getElementById("reg-password").value, // **INSECURE - HASH ON BACKEND**
          institution_type: institutionUlsc.checked ? 'ulsc' : 'other',
          institution_name: institutionUlsc.checked ? 'University Laboratory School and College' : institutionNameInput.value.trim(),
          phone: '+880' + document.getElementById("mobile").value.trim(), // Assuming +880 prefix
          role: roleStudent.checked ? 'student' : 'teacher',
          class: (roleStudent.checked && classSelect.value) ? classSelect.value : null
        };

        // Store data globally for the CAPTCHA callback
        window.validatedUserData = userData;

        // Display message and execute CAPTCHA
        if (registrationMessage) {
            registrationMessage.textContent = "Verifying...";
            registrationMessage.className = "form-message info";
        }
        console.log("Form validated, executing reCAPTCHA...");
        grecaptcha.execute(); // Trigger the invisible reCAPTCHA

        // NOTE: The actual insertion now happens in onRecaptchaSuccess -> completeRegistration
        // We removed the pre-check for existing users here. Database constraints will handle uniqueness.

      } else {
        // Validation failed
        console.log("Registration form validation failed.");
        if (registrationMessage) {
            registrationMessage.textContent = "Please correct the errors above.";
            registrationMessage.className = "form-message error";
        }
        registerSubmitBtn.disabled = false; // Re-enable button if validation fails
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

        const isEmail = identifier.includes('@');
        const { data: userArray, error: fetchError } = await supabase
          .from('members')
          .select('*')
          .or(isEmail ? `email.eq.${identifier}` : `username.eq.${identifier}`)
          .limit(1);

        if (fetchError) throw fetchError;

        if (!userArray || userArray.length === 0) {
          loginMessage.textContent = "User not found. Please check your username/email.";
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
        localStorage.setItem('deviceId', deviceId);

        const { data, error } = await supabase
          .from('members')
          .update({ device_id: deviceId })
          .or(isEmail ? `email.eq.${identifier}` : `username.eq.${identifier}`)
          .select();

        if (error) throw error;

        console.log("Login successful:", data); // This 'data' is from the device_id update
        window.location.href = "/"; // Redirects to the root on successful login
        // --- End Login Success Path ---

      } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent = "Login failed: " + (error.message || "An unexpected error occurred.");
        loginMessage.className = "form-message error";
      }
    });
  } else {
    console.warn("Login form not found.");
  }

  async function completeRegistration(userData) {
    const registrationMessage = document.getElementById("register-message");
    const registerSubmitBtn = document.getElementById('register-submit-btn'); // Get button again
    if (!registrationMessage || !registerSubmitBtn) {
        console.error("Registration message or submit button element not found in completeRegistration.");
        return; // Exit if elements aren't found
    }

    console.log("Attempting completeRegistration with data:", userData); // Log incoming data

    try {
        // Add device ID and timestamp just before insertion
        userData.device_id = generateDeviceId();
        localStorage.setItem('deviceId', userData.device_id);
        userData.created_at = new Date().toISOString();

        console.log("Data prepared for insertion:", userData); // Log data before insert

        // Attempt to insert the user data
        console.log("Calling supabase.from('members').insert()..."); // Log before Supabase call
        const { data, error } = await supabase
            .from('members')
            .insert([userData])
            .select();
        console.log("Supabase insert call finished."); // Log after Supabase call returns

        if (error) {
            console.error("Supabase insert error object:", error); // Log the specific error object
            // Check for unique constraint violation (PostgreSQL error code 23505)
            if (error.code === '23505') {
                if (error.message.includes('members_email_unique')) {
                    displayFieldError('email-error', 'This email address is already registered.');
                    throw new Error("Email already registered."); // Throw specific error
                } else if (error.message.includes('members_username_unique')) {
                    displayFieldError('username-error', 'This username is already taken.');
                    throw new Error("Username already taken."); // Throw specific error
                }
            }
            // Throw other errors
            throw error;
        }

        console.log("Registration successful (Supabase data):", data); // Log success data
        registrationMessage.textContent = "Registration successful! You can now log in.";
        registrationMessage.className = "form-message success";

        registrationForm.reset(); // Reset the form on success
        // Optionally switch to login tab
        const loginTab = document.querySelector('[data-tab="login"]');
        if (loginTab) loginTab.click();

    } catch (error) {
        console.error("Caught error during registration process:", error); // Log any caught error
        // Display specific errors caught above, or a generic one
        registrationMessage.textContent = error.message.includes("already registered") || error.message.includes("already taken")
            ? error.message // Show specific duplicate message
            : "Registration failed. Please check the details and try again."; // Generic failure
        registrationMessage.className = "form-message error";
        // Do not re-throw here unless needed upstream, but re-enable button
    } finally {
        console.log("Executing finally block of completeRegistration."); // Log finally block entry
        // Always re-enable the submit button after attempt (success or fail)
        if(registerSubmitBtn) registerSubmitBtn.disabled = false;
        window.validatedUserData = null; // Clear global data after attempt
        grecaptcha.reset(); // Reset captcha widget
        console.log("Registration attempt finished, button re-enabled, captcha reset."); // Log end of finally
    }
  }

  // --- Validation and Helper Functions ---
  function validateRegistrationForm() {
    const termsCheckbox = document.getElementById('terms');
    let isValid = true;

    const requiredFields = registrationForm.querySelectorAll("[required]");
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        displayFieldError(`${field.id}-error`, "This field is required.");
        isValid = false;
      } else {
        clearFieldError(`${field.id}-error`);
      }
    });

    if (!termsCheckbox || !termsCheckbox.checked) {
      displayFieldError('terms-error', 'You must agree to the terms and conditions.');
      isValid = false;
    } else {
      clearFieldError('terms-error');
    }

    return isValid;
  }

  function clearFieldError(errorId) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  }

  function displayFieldError(errorId, message) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function clearErrorMessages(form) {
    const errorSpans = form.querySelectorAll(".error-message");
    errorSpans.forEach(span => {
      span.textContent = '';
    });
  }

  // --- Password Strength Meter ---
  const regPasswordInput = document.getElementById('reg-password');
  const strengthMeterFill = document.querySelector('.strength-meter-fill');
  const strengthText = document.querySelector('.strength-text');

  if (regPasswordInput && strengthMeterFill && strengthText) {
    regPasswordInput.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      let text = '';
      let className = '';

      if (password.length >= 8) strength++;
      if (password.match(/[a-z]/)) strength++;
      if (password.match(/[A-Z]/)) strength++;
      if (password.match(/[0-9]/)) strength++;
      if (password.match(/[^a-zA-Z0-9]/)) strength++;

      switch (strength) {
        case 0:
        case 1:
        case 2:
          text = 'Weak';
          className = 'weak';
          break;
        case 3:
        case 4:
          text = 'Medium';
          className = 'medium';
          break;
        case 5:
          text = 'Strong';
          className = 'strong';
          break;
        default:
          text = '';
          className = '';
      }

      strengthMeterFill.className = `strength-meter-fill ${className}`;
      strengthText.textContent = `Password strength: ${text}`;
    });
  }

  // --- Toggle Password Visibility ---
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");

  if (togglePasswordBtns.length) {
    togglePasswordBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const wrapper = this.closest('.password-input-wrapper');
        if (!wrapper) {
          console.error("Could not find parent '.password-input-wrapper'.");
          return;
        }

        const passwordInput = wrapper.querySelector('input');
        const iconSvg = this.querySelector('svg');

        if (passwordInput && iconSvg) {
          if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            const tempIcon = document.createElement('i');
            tempIcon.setAttribute('data-feather', 'eye-off');
            this.innerHTML = '';
            this.appendChild(tempIcon);
            if (typeof feather !== 'undefined') {
              feather.replace({ 'aria-hidden': 'true' });
            }
          } else {
            passwordInput.type = 'password';
            const tempIcon = document.createElement('i');
            tempIcon.setAttribute('data-feather', 'eye');
            this.innerHTML = '';
            this.appendChild(tempIcon);
            if (typeof feather !== 'undefined') {
              feather.replace({ 'aria-hidden': 'true' });
            }
          }
        } else {
          if (!passwordInput) {
            console.error("Could not find 'input' element within the wrapper.");
          }
          if (!iconSvg) {
            console.error("Could not find 'svg' element within the button.");
          }
        }
      });
    });
  } else {
    console.warn("No toggle password buttons found.");
  }

  // --- Tab Switching Functionality ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabBtns.length && tabContents.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        this.classList.add("active");
        const tabId = this.getAttribute("data-tab");
        const correspondingContent = document.getElementById(`${tabId}-tab`);
        if (correspondingContent) {
          correspondingContent.classList.add("active");
        } else {
          console.warn(`Tab content not found for ID: ${tabId}-tab`);
        }
      });
    });
  } else {
    console.warn("Tab buttons or content not found.");
  }

}); // End DOMContentLoaded

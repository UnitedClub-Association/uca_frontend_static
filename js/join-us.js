import supabase from "./supabase-client.js";

// --- REMOVE: Generate Device ID (UUID v4) ---
// function generateDeviceId() { ... }
// --- END REMOVE ---

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
  if (/\d/.test(password)) score++; // Digits
  if (/[^A-Za-z0-9]/.test(password)) score++; // Symbols

  // Simple score to category mapping
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

function updatePasswordStrengthUI(password) {
  const strengthMeterFill = document.getElementById("strength-meter-fill");
  const strengthText = document.getElementById("strength-text");
  if (!strengthMeterFill || !strengthText) return;

  const strength = calculatePasswordStrength(password);

  strengthMeterFill.className = "strength-meter-fill"; // Reset classes
  strengthText.textContent = "Password strength"; // Reset text

  if (password.length > 0) {
    strengthMeterFill.classList.add(strength);
    strengthText.textContent = `Strength: ${
      strength.charAt(0).toUpperCase() + strength.slice(1)
    }`;
  } else {
    strengthText.textContent = "Password strength"; // Default text when empty
  }
}
// --- END NEW ---

// --- NEW: Toggle Password Visibility ---
function togglePasswordVisibility(button) {
  const wrapper = button.closest(".password-input-wrapper");
  if (!wrapper) return;
  const passwordInput = wrapper.querySelector(
    'input[type="password"], input[type="text"]'
  );
  const icon = button.querySelector("i");

  if (!passwordInput || !icon) return;

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.setAttribute("data-feather", "eye-off");
  } else {
    passwordInput.type = "password";
    icon.setAttribute("data-feather", "eye");
  }
  // Re-initialize Feather icons for the changed icon
  if (typeof feather !== "undefined") {
    feather.replace({ "aria-hidden": "true" });
  }
}
// --- END NEW ---

// --- Form Error Handling Functions ---
function displayFieldError(errorElementId, message) {
  const errorElement = document.getElementById(errorElementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function clearErrorMessages(form) {
  const errorElements = form.getElementsByClassName("error-message");
  Array.from(errorElements).forEach((element) => {
    element.textContent = "";
    element.style.display = "none";
  });
}

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
          password: document.getElementById("reg-password").value,
          institution_type: institutionUlsc.checked ? "ulsc" : "other",
          institution_name: institutionUlsc.checked
            ? "University Laboratory School and College"
            : institutionNameInput.value.trim(),
          phone: "+880" + document.getElementById("mobile").value.trim(),
          role: roleStudent.checked ? "student" : "teacher",
          class:
            roleStudent.checked && classSelect.value ? classSelect.value : null,
        };

        // Display message and call registration directly
        if (registrationMessage) {
          registrationMessage.textContent = "Registering...";
          registrationMessage.className = "form-message info";
        }
        console.log("Form validated, attempting registration directly...");

        try {
          await completeRegistration(userData);
        } catch (error) {
          console.error("Error during registration submission:", error);
          if (registrationMessage) {
            registrationMessage.textContent =
              "An unexpected error occurred during submission.";
            registrationMessage.className = "form-message error";
          }
          registerSubmitBtn.disabled = false;
        }
      } else {
        registerSubmitBtn.disabled = false;
        console.log("Registration form validation failed.");
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

        // IMPORTANT: This is comparing plain text passwords!
        // This should be replaced with a secure backend authentication method.
        if (user.password !== password) {
          loginMessage.textContent = "Invalid password. Please try again.";
          loginMessage.className = "form-message error";
          return;
        }

        loginMessage.textContent = "Password verified. Completing login...";
        loginMessage.className = "form-message info";

        // Direct Redirect on Success
        console.log("Login successful for user:", user.username);
        window.location.href = "/";

      } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent =
          "Login failed: " + (error.message || "An unexpected error occurred.");
        loginMessage.className = "form-message error";
      } finally {
        const loginSubmitBtn = loginForm.querySelector('button[type="submit"]');
        if (loginSubmitBtn && window.location.pathname !== "/") {
          loginSubmitBtn.disabled = false;
        }
      }
    });
  } else {
    console.warn("Login form not found.");
  }

  // This function handles inserting the profile data after successful auth
  async function completeRegistration(userData) {
    const registrationMessage = document.getElementById("register-message");
    const registerSubmitBtn = document.getElementById("register-submit-btn");
    if (!registrationMessage || !registerSubmitBtn) {
      console.error("Registration message or submit button element not found in completeRegistration.");
      return;
    }

    // *** ADD THIS LOG ***
    console.log("Data received by completeRegistration:", JSON.stringify(userData));

    console.log("Attempting completeRegistration with data:", userData);
    registrationMessage.textContent = "Creating your account...";
    registrationMessage.className = "form-message info";

    // Keep a copy of the password for auth, but don't store it in members table
    const passwordForAuth = userData.password;
    // Create a copy of userData to modify for insertion, removing the password
    const memberData = { ...userData };
    delete memberData.password; // *** IMPORTANT: Remove password before inserting into members ***

    try {
      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from("members")
        .select("email")
        .eq("email", userData.email)
        .single();

      if (existingEmail) {
        displayFieldError("email-error", "This email address is already registered.");
        throw new Error("Email already registered.");
      }

      // Check if username already exists
      const { data: existingUsername } = await supabase
        .from("members")
        .select("username")
        .eq("username", userData.username)
        .single();

      if (existingUsername) {
        displayFieldError("username-error", "This username is already taken.");
        throw new Error("Username already taken.");
      }

      // Check if phone already exists
      const { data: existingPhone } = await supabase
        .from("members")
        .select("phone")
        .eq("phone", userData.phone)
        .single();

      if (existingPhone) {
        displayFieldError("mobile-error", "This phone number is already registered.");
        throw new Error("Phone number already registered.");
      }

      // First, sign up the user with Supabase Auth
      // *** ADD LOG BEFORE AUTH SIGNUP ***
      console.log("Calling supabase.auth.signUp with options.data:", JSON.stringify({
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name
      }));

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: passwordForAuth, // Use the original password here
        options: {
          data: {
            username: userData.username,
            first_name: userData.first_name,
            last_name: userData.last_name
            // Add any other metadata fields here if needed
          }
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        // Log the authData if user is missing
        console.error("Auth successful, but no user object returned:", authData);
        throw new Error("Failed to create user account (no user object).");
      }

      // *** DEBUGGING: Log the user ID ***
      console.log("Auth successful. User ID:", authData.user.id);
      // *** ADD LOG: Check auth metadata ***
      console.log("Auth user metadata after signup:", JSON.stringify(authData.user.user_metadata));


      // Add the user_id to the memberData object (which doesn't have the password)
      memberData.user_id = authData.user.id;
      memberData.created_at = new Date().toISOString();
      memberData.email_verified = false; // Assuming email verification is off or handled later

      // *** DEBUGGING: Log the data being inserted ***
      console.log("Attempting to insert member data:", JSON.stringify(memberData)); // Stringify for clarity

      // Insert the user data (without password) into the members table
      const { error: insertError } = await supabase
        .from("members")
        .insert([memberData]); // Use memberData here

      if (insertError) {
        console.error("Database insert error:", insertError);
        // Attempt to delete the auth user if insert fails
        // WARNING: This requires admin privileges and might fail on the frontend.
        // Consider moving cleanup logic to a backend function if this is critical.
        try {
            console.warn("Attempting to clean up auth user:", authData.user.id);
            // Note: supabase.auth.admin is typically not available/permissible in browser clients.
            // This call will likely fail unless using a service_role key, which is unsafe in the browser.
            // const { data: adminData, error: adminError } = await supabase.auth.admin.deleteUser(authData.user.id);
            // if(adminError) console.error("Failed to cleanup auth user:", adminError);
            // else console.log("Auth user cleanup successful.");
             console.error("Frontend cannot perform admin user deletion. Manual cleanup might be required if insert fails.");
        } catch (cleanupError) {
             console.error("Error during auth user cleanup attempt:", cleanupError);
        }
        throw insertError; // Re-throw the original insert error
      }

      // *** ADD LOG: Confirm insert success ***
      console.log("Insert into members table successful for user_id:", memberData.user_id);

      console.log("Registration successful!");
      registrationMessage.textContent = "Registration successful! Please check your email to verify your account, then you can log in.";
      registrationMessage.className = "form-message success";

      // Reset form and switch to login tab
      registrationForm.reset();
      const loginTab = document.querySelector('[data-tab="login"]');
      if (loginTab) loginTab.click();

    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific error messages
      if (error.message.includes("already registered") || 
          error.message.includes("already taken")) {
        registrationMessage.textContent = error.message;
      } else if (error.message.includes("duplicate key")) {
        if (error.message.includes("members_email_key")) {
          displayFieldError("email-error", "This email address is already registered.");
        } else if (error.message.includes("members_username_key")) {
          displayFieldError("username-error", "This username is already taken.");
        } else if (error.message.includes("members_phone_key")) {
          displayFieldError("mobile-error", "This phone number is already registered.");
        }
        registrationMessage.textContent = "Registration failed: A field you entered is already in use.";
      } else {
        registrationMessage.textContent = "Registration failed. Please try again later.";
      }
      registrationMessage.className = "form-message error";
    } finally {
      registerSubmitBtn.disabled = false;
      console.log("Registration attempt finished, button re-enabled.");
    }
  }

  // --- Validation and Helper Functions ---
  function validateRegistrationForm() {
    const termsCheckbox = document.getElementById("terms");
    let isValid = true;

    const requiredFields = registrationForm.querySelectorAll("[required]:not(:disabled)");
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
          displayFieldError(`${field.id}-error`, "This field is required.");
          isValid = false;
      }
    });

    if (!termsCheckbox || !termsCheckbox.checked) {
        displayFieldError(
            "terms-error",
            "You must agree to the terms and conditions."
        );
        isValid = false;
    }

    const emailInput = document.getElementById("email");
    if (emailInput && emailInput.value.trim() && !/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
        displayFieldError("email-error", "Please enter a valid email address.");
        isValid = false;
    }

    const mobileInput = document.getElementById("mobile");
    if (mobileInput && mobileInput.value.trim() && !/^\d+$/.test(mobileInput.value.trim())) {
        displayFieldError("mobile-error", "Please enter a valid phone number (digits only).");
        isValid = false;
    }

    const passwordInput = document.getElementById("reg-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    if (passwordInput && confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
        displayFieldError("confirm-password-error", "Passwords do not match.");
        isValid = false;
    }
    return isValid;
  }
}); // End DOMContentLoaded

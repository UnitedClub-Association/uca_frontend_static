import supabase from "./supabase-client.js";

// Helper function to generate OTP
function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// Helper function to generate Device ID
function generateDeviceId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Main DOMContentLoaded listener
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
  const otpModal = document.getElementById("otp-modal");
  const otpInputs = document.querySelectorAll('.otp-input');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const resendOtpBtn = document.getElementById('resend-otp-btn');
  const otpMessage = document.getElementById('otp-message');
  const registrationMessage = document.getElementById("registration-message"); // Corrected ID
  const loginMessage = document.getElementById("login-message");

  // Ensure OTP modal is hidden on page load
  if (otpModal) {
    otpModal.style.display = "none";
    otpModal.classList.remove("active");
  }

  console.log("Registration form:", registrationForm);
  console.log("Login form:", loginForm);

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

  // --- OTP Functionality ---
  let currentOtp = '';
  let pendingAction = null; // 'register' or 'login'
  let userDataForRegistration = null;

  // Auto-focus next OTP input
  if (otpInputs.length) {
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', function() {
        // Move focus forward
        if (this.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
        // Combine OTP when last input is filled
        if (index === otpInputs.length - 1 && this.value.length === 1) {
           const enteredOtp = Array.from(otpInputs).map(inp => inp.value).join('');
           if (enteredOtp.length === otpInputs.length) {
               // Optionally auto-submit or enable verify button
               // verifyOTP(); // Example: auto-submit
           }
        }
      });

      input.addEventListener('keydown', function(e) {
        // Move focus backward on backspace
        if (e.key === 'Backspace' && this.value === '' && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });
  } else {
      console.warn("OTP input fields not found.");
  }

  // Function to show OTP modal
  function showOtpModal(email, action, userData = null) {
    if (!otpModal || !otpMessage || !otpInputs.length) {
        console.error("OTP Modal elements not found. Cannot show modal.");
        // Display error to user if appropriate
        if (registrationMessage && action === 'register') {
            registrationMessage.textContent = "Error: Could not initialize verification process.";
            registrationMessage.className = "form-message error";
        } else if (loginMessage && action === 'login') {
            loginMessage.textContent = "Error: Could not initialize verification process.";
            loginMessage.className = "form-message error";
        }
        return;
    }

    currentOtp = generateOTP();
    pendingAction = action;
    userDataForRegistration = userData;

    // In a real app, you would send this OTP to the user's email via a backend service
    console.log(`OTP for ${email}: ${currentOtp}`); // For debugging/demo ONLY

    otpMessage.textContent = `Enter the code sent to ${email}`; // Provide context
    otpMessage.className = 'form-message info'; // Use info class

    // Clear previous inputs
    otpInputs.forEach(input => input.value = '');

    // Show modal with animation
    otpModal.style.display = "flex"; // Set display first
    setTimeout(() => {
      otpModal.classList.add('active'); // Add class for transition
    }, 10); // Small delay ensures transition works

    otpInputs[0].focus(); // Focus the first input

    // In a real implementation, you would call your backend to send the OTP email
    // sendOtpEmail(email, currentOtp);
  }

  // Function to verify OTP
  function verifyOTP() {
    if (!otpModal || !otpMessage) {
        console.error("OTP Modal elements not found. Cannot verify OTP.");
        return;
    }
    const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');

    if (enteredOtp.length !== 6) {
        otpMessage.textContent = 'Please enter the full 6-digit code.';
        otpMessage.className = 'form-message error';
        return;
    }

    if (enteredOtp === currentOtp) {
      otpMessage.textContent = 'Verification successful!';
      otpMessage.className = 'form-message success';

      setTimeout(() => {
        otpModal.classList.remove('active');
        // Hide modal after animation
        setTimeout(() => {
            otpModal.style.display = "none";
        }, 300); // Match transition duration

        // Complete the pending action
        if (pendingAction === 'register' && userDataForRegistration) {
          completeRegistration(userDataForRegistration);
        } else if (pendingAction === 'login') {
          completeLogin();
        }
        // Reset state
        pendingAction = null;
        userDataForRegistration = null;
        currentOtp = '';

      }, 1000); // Show success message for 1 second
    } else {
      otpMessage.textContent = 'Invalid verification code. Please try again.';
      otpMessage.className = 'form-message error';
      // Optionally clear inputs or shake animation
      otpInputs.forEach(input => input.value = '');
      otpInputs[0].focus();
    }
  }

  // Attach event listeners to OTP buttons
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', verifyOTP);
  } else {
    console.warn("Verify OTP button not found.");
  }

  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', function() {
      // Need email associated with the current OTP attempt
      let emailForResend = '';
      if (pendingAction === 'register' && userDataForRegistration) {
          emailForResend = userDataForRegistration.email;
      } else if (pendingAction === 'login') {
          // Need to get email from login form or stored context
          const identifierInput = document.getElementById("login-identifier");
          if (identifierInput && identifierInput.value.includes('@')) {
              emailForResend = identifierInput.value;
          } else {
              // If username was used, we might need to fetch email based on username
              // This requires more complex state management or fetching user data again
              console.warn("Cannot resend OTP: Email not available for username login.");
              otpMessage.textContent = 'Cannot resend code. Please use email to login if needed.';
              otpMessage.className = 'form-message error';
              return;
          }
      }

      if (!emailForResend) {
          console.error("Cannot resend OTP: Email address is missing.");
          otpMessage.textContent = 'Error: Cannot resend code.';
          otpMessage.className = 'form-message error';
          return;
      }

      currentOtp = generateOTP();
      console.log(`New OTP for ${emailForResend}: ${currentOtp}`); // For debugging/demo ONLY
      otpMessage.textContent = `New verification code sent to ${emailForResend}!`;
      otpMessage.className = 'form-message info';
      // In a real app, trigger backend to send new OTP
      // sendOtpEmail(emailForResend, currentOtp);
      otpInputs.forEach(input => input.value = '');
      otpInputs[0].focus();
    });
  } else {
    console.warn("Resend OTP button not found.");
  }

  // --- Registration and Login Logic ---

  // Complete registration after OTP verification
  async function completeRegistration(userData) {
    if (!registrationMessage) {
        console.error("Registration message element not found.");
        return;
    }
    try {
      // Store device identifier in local storage
      const deviceId = generateDeviceId();
      localStorage.setItem('deviceId', deviceId);

      // Add device ID and institution info to user data
      userData.device_id = deviceId;

      // **IMPORTANT**: Password should be hashed on the backend, not stored plaintext.
      // This example sends plaintext for simplicity, but is insecure.
      console.warn("Sending plaintext password - insecure for production!");

      // Insert into Supabase
      const { data, error } = await supabase.from('members').insert([userData]).select(); // Use select() to get back data

      if (error) {
          // Handle specific Supabase errors if needed
          if (error.message.includes("duplicate key value violates unique constraint")) {
              if (error.message.includes("members_email_key")) {
                  throw new Error("This email is already registered.");
              } else if (error.message.includes("members_username_key")) {
                  throw new Error("This username is already taken.");
              }
          }
          throw error; // Rethrow other errors
      }

      console.log("Registration successful:", data);
      registrationMessage.textContent = "Registration successful! You can now log in.";
      registrationMessage.className = "form-message success";

      // Optionally clear the registration form
      if (registrationForm) registrationForm.reset();

      // Switch to login tab
      const loginTabButton = document.querySelector('[data-tab="login"]');
      if (loginTabButton) loginTabButton.click();

    } catch (error) {
      console.error("Error during registration completion:", error);
      registrationMessage.textContent = "Registration failed: " + (error.message || "Unknown error");
      registrationMessage.className = "form-message error";
    }
  }

  // Complete login after OTP verification (or directly if same device)
  async function completeLogin() {
     if (!loginMessage) {
        console.error("Login message element not found.");
        return;
    }
    // Store device identifier in local storage
    const deviceId = generateDeviceId();
    localStorage.setItem('deviceId', deviceId);

    // Get identifier used for login
    const identifierInput = document.getElementById("login-identifier");
    if (!identifierInput) {
        loginMessage.textContent = "Login failed: Cannot find login identifier field.";
        loginMessage.className = "form-message error";
        return;
    }
    const identifier = identifierInput.value;
    const isEmail = identifier.includes('@');

    try {
      // Update user's device ID in the database
      const { data, error } = await supabase
        .from('members')
        .update({ device_id: deviceId })
        .or(isEmail ? `email.eq.${identifier}` : `username.eq.${identifier}`) // Match either email or username
        .select(); // Select to confirm update

      if (error) throw error;

      if (!data || data.length === 0) {
          // This case shouldn't happen if OTP was verified, but good to check
          throw new Error("Failed to update device ID for user.");
      }

      console.log("Device ID updated successfully for:", identifier);

      // Redirect to dashboard or home page
      // **TODO**: Replace "/" with the actual dashboard URL
      window.location.href = "/";

    } catch (error) {
      console.error("Error updating device ID during login:", error);
      loginMessage.textContent = "Login failed: " + (error.message || "Could not finalize login.");
      loginMessage.className = "form-message error";
    }
  }

  // Registration form submission handler
  if (registrationForm) {
    registrationForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("Registration form submitted");
      if (!registrationMessage) {
          console.error("Registration message element not found.");
          return;
      }
      registrationMessage.textContent = ""; // Clear previous messages
      registrationMessage.className = "form-message";

      // Clear previous errors
      document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

      // Validate form
      let isValid = true;

      // Helper function for validation
      function validateField(inputId, errorId, message, validationFn = null) {
          const input = document.getElementById(inputId);
          const errorSpan = document.getElementById(errorId);
          if (!input || !errorSpan) {
              console.warn(`Validation elements not found for ${inputId}`);
              return false; // Consider this a failure?
          }
          if (input.value.trim() === "") {
              errorSpan.textContent = message;
              return false;
          }
          if (validationFn && !validationFn(input.value)) {
              // Use specific message from validationFn if provided
              errorSpan.textContent = typeof validationFn(input.value) === 'string' ? validationFn(input.value) : "Invalid format";
              return false;
          }
          return true;
      }

      // Perform validations
      isValid = validateField("firstName", "firstName-error", "First name is required") && isValid;
      isValid = validateField("lastName", "lastName-error", "Last name is required") && isValid;
      isValid = validateField("username", "username-error", "Username is required") && isValid;
      isValid = validateField("email", "email-error", "Email is required", (val) => /^\S+@\S+\.\S+$/.test(val) || "Please enter a valid email") && isValid;

      const password = document.getElementById("reg-password");
      const confirmPassword = document.getElementById("confirm-password");
      const passwordError = document.getElementById("password-error");
      const confirmPasswordError = document.getElementById("confirm-password-error");

      if (!password || !confirmPassword || !passwordError || !confirmPasswordError) {
          console.warn("Password fields not found");
          isValid = false;
      } else {
          if (password.value.trim() === "") {
              passwordError.textContent = "Password is required";
              isValid = false;
          } else if (password.value.length < 6) { // Example: Minimum length
              passwordError.textContent = "Password must be at least 6 characters";
              isValid = false;
          }
          if (confirmPassword.value.trim() === "") {
              confirmPasswordError.textContent = "Please confirm your password";
              isValid = false;
          } else if (password.value !== confirmPassword.value) {
              confirmPasswordError.textContent = "Passwords do not match";
              isValid = false;
          }
      }

      isValid = validateField("mobile", "mobile-error", "Mobile number is required", (val) => /^\d{10}$/.test(val) || "Enter a valid 10-digit number (e.g., 1XXXXXXXXX)") && isValid;

      // Institution validation
      const institutionNameError = document.getElementById("institution-name-error");
      if (institutionOther && institutionOther.checked && institutionNameInput && institutionNameInput.value.trim() === "") {
          if (institutionNameError) institutionNameError.textContent = "School/College Name is required when 'Other' is selected";
          isValid = false;
      }

      // Class validation (only if student)
      const classError = document.getElementById("class-error");
      if (roleStudent && roleStudent.checked && classSelect && classSelect.value === "") {
          if(classError) classError.textContent = "Please select your class";
          isValid = false;
      }

      // Terms validation
      const termsCheckbox = document.getElementById("terms");
      const termsError = document.getElementById("terms-error");
      if (!termsCheckbox || !termsError) {
          console.warn("Terms elements not found");
          isValid = false;
      } else if (!termsCheckbox.checked) {
          termsError.textContent = "You must agree to the terms";
          isValid = false;
      }


      if (isValid) {
        console.log("Registration form is valid. Preparing data...");
        // Prepare user data
        const userData = {
          first_name: document.getElementById("firstName").value.trim(),
          last_name: document.getElementById("lastName").value.trim(),
          username: document.getElementById("username").value.trim(),
          email: document.getElementById("email").value.trim(),
          password: password.value, // **INSECURE - HASH ON BACKEND**
          institution_type: institutionUlsc.checked ? 'ulsc' : 'other',
          institution_name: institutionUlsc.checked ? 'University Laboratory School and College' : institutionNameInput.value.trim(),
          phone: '+880' + document.getElementById("mobile").value.trim(), // Assuming +880 prefix
          role: roleStudent.checked ? 'student' : 'teacher',
          // Only include class if student and class is selected
          class: (roleStudent.checked && classSelect.value) ? classSelect.value : null,
          created_at: new Date().toISOString()
        };

        console.log("User data prepared:", userData);

        // Check if username or email already exists before showing OTP
        try {
          registrationMessage.textContent = "Checking availability...";
          registrationMessage.className = "form-message info";

          const { data: existingUser, error: checkError } = await supabase
            .from('members')
            .select('email, username')
            .or(`email.eq.${userData.email},username.eq.${userData.username}`);

          if (checkError) throw checkError;

          if (existingUser && existingUser.length > 0) {
            if (existingUser[0].email === userData.email) {
              registrationMessage.textContent = "This email is already registered.";
            } else {
              registrationMessage.textContent = "This username is already taken.";
            }
            registrationMessage.className = "form-message error";
            return; // Stop registration
          }

          // If checks pass, show OTP modal
          registrationMessage.textContent = ""; // Clear checking message
          registrationMessage.className = "form-message";
          console.log("Username/Email available. Showing OTP modal.");
          showOtpModal(userData.email, 'register', userData);

        } catch (error) {
          console.error("Error checking existing user:", error);
          registrationMessage.textContent = "Registration failed: " + (error.message || "Could not check user details.");
          registrationMessage.className = "form-message error";
        }
      } else {
          console.log("Registration form is invalid.");
          registrationMessage.textContent = "Please fix the errors above.";
          registrationMessage.className = "form-message error";
      }
    });
  } else {
      console.warn("Registration form not found.");
  }

  // Login form submission handler
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

      // Clear previous errors
      document.getElementById("login-identifier-error").textContent = '';
      document.getElementById("login-password-error").textContent = '';


      const identifierInput = document.getElementById("login-identifier");
      const passwordInput = document.getElementById("password"); // Corrected ID for login password

      if (!identifierInput || !passwordInput) {
          loginMessage.textContent = "Login failed: Form fields missing.";
          loginMessage.className = "form-message error";
          return;
      }

      const identifier = identifierInput.value.trim();
      const password = passwordInput.value; // Don't trim password

      let isValid = true;
      if (!identifier) {
          document.getElementById("login-identifier-error").textContent = "Username or Email is required";
          isValid = false;
      }
      if (!password) {
          document.getElementById("login-password-error").textContent = "Password is required";
          isValid = false;
      }

      if (!isValid) {
          loginMessage.textContent = "Please fill in all fields.";
          loginMessage.className = "form-message error";
          return;
      }

      try {
        loginMessage.textContent = "Signing in...";
        loginMessage.className = "form-message info";

        // Check if user exists and password matches
        const isEmail = identifier.includes('@');
        const { data: userArray, error: fetchError } = await supabase
          .from('members')
          .select('*') // Select all fields to get device_id and email
          .or(isEmail ? `email.eq.${identifier}` : `username.eq.${identifier}`)
          .limit(1); // Expect only one user

        if (fetchError) throw fetchError;

        if (!userArray || userArray.length === 0) {
          loginMessage.textContent = "User not found. Please check your username/email.";
          loginMessage.className = "form-message error";
          return;
        }

        const user = userArray[0];

        // **INSECURE**: Compare plaintext passwords. Use hashing in production.
        console.warn("Comparing plaintext passwords - insecure for production!");
        if (user.password !== password) {
          loginMessage.textContent = "Invalid password. Please try again.";
          loginMessage.className = "form-message error";
          return;
        }

        // Password matches, proceed with device check / OTP
        loginMessage.textContent = "Password verified. Checking device...";
        loginMessage.className = "form-message info";

        const storedDeviceId = localStorage.getItem('deviceId');
        if (storedDeviceId && storedDeviceId === user.device_id) {
          // Same device, proceed directly with login completion
          console.log("Same device detected. Completing login.");
          completeLogin();
        } else {
          // Different device or no stored ID, require OTP verification
          console.log("Different device or no stored ID. Showing OTP modal.");
          showOtpModal(user.email, 'login'); // Pass user's email for OTP
        }

      } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent = "Login failed: " + (error.message || "An unexpected error occurred.");
        loginMessage.className = "form-message error";
      }
    });
  } else {
      console.warn("Login form not found.");
  }

  // --- Tab Switching Functionality ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabBtns.length && tabContents.length) {
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          // Remove active class from all buttons and content
          tabBtns.forEach((b) => b.classList.remove("active"));
          tabContents.forEach((c) => c.classList.remove("active"));

          // Add active class to the clicked button and corresponding content
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

  // --- Password Toggle Visibility ---
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");

  if (togglePasswordBtns.length) {
      togglePasswordBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const passwordInput = this.previousElementSibling; // Assumes button is immediately after input
              const icon = this.querySelector('i');

              if (passwordInput && icon) {
                  if (passwordInput.type === 'password') {
                      passwordInput.type = 'text';
                      icon.setAttribute('data-feather', 'eye-off');
                  } else {
                      passwordInput.type = 'password';
                      icon.setAttribute('data-feather', 'eye');
                  }
                  feather.replace({"aria-hidden": "true"}); // Re-render the icon
              } else {
                  console.warn("Could not find password input or icon for toggle button.");
              }
          });
      });
  } else {
      console.warn("Toggle password buttons not found.");
  }

  // --- Password Strength Meter (Example - adapt as needed) ---
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
          if (password.match(/[^a-zA-Z0-9]/)) strength++; // Special character

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
  } else {
      // console.warn("Password strength meter elements not found."); // Optional warning
  }

}); // End of main DOMContentLoaded listener

document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize Feather Icons
  const initIcons = () => {
    if (typeof feather !== "undefined") {
      feather.replace();
    } else {
      setTimeout(initIcons, 50);
    }
  };
  initIcons();

  // 2. Tab Switching Logic
  const tabBtns = document.querySelectorAll(".tab-btn");
  const forms = document.querySelectorAll(".uca-form");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      forms.forEach(f => f.classList.remove("active"));
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target") + "-form";
      const targetForm = document.getElementById(targetId);
      if (targetForm) {
        targetForm.classList.add("active");
      }
    });
  });

  // Helper function: strict validation check
  const validateForm = (formData, formType) => {
    // Check Bengali fields
    const bengaliRegex = /^[\u0980-\u09FF\s\.\-]+$/;
    for (let [key, value] of formData.entries()) {
      if (key.endsWith('_bn') && value.trim() !== '') {
        if (!bengaliRegex.test(value)) {
          return { isValid: false, message: "Please use strictly Bengali characters for Bengali name fields." };
        }
      }
    }

    // Check individual phone format strictly
    if (formType === 'individual') {
      const phone = formData.get('ind_phone');
      const phoneRegex = /^\+8801[3-9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        return { isValid: false, message: "Phone must be +8801 followed by 9 digits with no spaces." };
      }
    }

    // Check email sanity
    const emailKeys = ['ind_email', 'club_email', 'corp_email'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (let key of emailKeys) {
      if (formData.has(key)) {
        if (!emailRegex.test(formData.get(key))) {
          return { isValid: false, message: "Please provide a valid email address." };
        }
      }
    }

    return { isValid: true };
  };

  // 3. Form Submission Handling
  forms.forEach(form => {
    form.addEventListener("submit", async function (e) {
      e.preventDefault(); 
      
      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      // Gather data
      const formData = new FormData(this);
      const formType = this.id.split('-')[0]; 
      
      // Run custom strict validation
      const validation = validateForm(formData, formType);
      
      if (!validation.isValid) {
        alert(validation.message); // Simple alert to stop garbage data
        return;
      }

      // Visual loading state
      submitBtn.innerHTML = `<span>Processing...</span> <i data-feather="loader" class="spin"></i>`;
      if(typeof feather !== 'undefined') feather.replace();
      submitBtn.disabled = true;

      const dataObj = {};
      formData.forEach((value, key) => {
        dataObj[key] = value;
      });
      dataObj['registration_type'] = formType;

      try {
        const response = await fetch('/.netlify/functions/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataObj)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);

        // Success UI Feedback
        submitBtn.innerHTML = `<span>Submitted Successfully</span> <i data-feather="check"></i>`;
        submitBtn.style.background = "#25D366"; 
        if(typeof feather !== 'undefined') feather.replace();

        setTimeout(() => {
          this.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = ""; 
          submitBtn.disabled = false;
          if(typeof feather !== 'undefined') feather.replace();
        }, 3000);

      } catch (error) {
        console.error('Error submitting form:', error);
        
        // Error UI Feedback
        submitBtn.innerHTML = `<span>Error - Try Again</span> <i data-feather="alert-circle"></i>`;
        submitBtn.style.background = "#E4405F";
        if(typeof feather !== 'undefined') feather.replace();
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = ""; 
          submitBtn.disabled = false;
          if(typeof feather !== 'undefined') feather.replace();
        }, 3000);
      }
    });
  });
});
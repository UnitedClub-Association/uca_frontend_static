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
      // Remove active class from all buttons and forms
      tabBtns.forEach(b => b.classList.remove("active"));
      forms.forEach(f => f.classList.remove("active"));

      // Add active class to clicked button
      btn.classList.add("active");

      // Show corresponding form
      const targetId = btn.getAttribute("data-target") + "-form";
      const targetForm = document.getElementById(targetId);
      if (targetForm) {
        targetForm.classList.add("active");
      }
    });
  });

  // 3. Form Submission Handling connected to Netlify Function
  forms.forEach(form => {
    form.addEventListener("submit", async function (e) {
      e.preventDefault(); 
      
      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      // Visual loading state
      submitBtn.innerHTML = `<span>Processing...</span> <i data-feather="loader" class="spin"></i>`;
      if(typeof feather !== 'undefined') feather.replace();
      submitBtn.disabled = true;

      // Gather data
      const formData = new FormData(this);
      const dataObj = {};
      
      formData.forEach((value, key) => {
        dataObj[key] = value;
      });

      // Extract the form type (individual, club, or corporate) and add it to the payload
      const formType = this.id.split('-')[0]; 
      dataObj['registration_type'] = formType;

      try {
        // Send data to Netlify serverless function
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

        // Reset the form after 3 seconds
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
// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Enhanced form validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function showValidationMessage(element, message) {
  // Remove any existing validation message
  hideValidationMessage(element);

  // Create and show new validation message
  const validationDiv = document.createElement("div");
  validationDiv.className = "validation-message";
  validationDiv.textContent = message;

  element.parentNode.appendChild(validationDiv);
  validationDiv.style.display = "block";

  // Add error class to input
  element.classList.add("input-error");
  element.classList.remove("input-success");
}

function hideValidationMessage(element) {
  const existingMessage = element.parentNode.querySelector(
    ".validation-message"
  );
  if (existingMessage) {
    existingMessage.remove();
  }

  element.classList.remove("input-error");
}

function showSuccessState(element) {
  element.classList.remove("input-error");
  element.classList.add("input-success");

  // Remove success class after a delay
  setTimeout(() => {
    element.classList.remove("input-success");
  }, 2000);
}

// Real-time form validation
document.addEventListener("DOMContentLoaded", function () {
  // Email validation
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      if (this.value && !validateEmail(this.value)) {
        showValidationMessage(this, "Please enter a valid email address");
      } else if (this.value) {
        hideValidationMessage(this);
        showSuccessState(this);
      }
    });
  }

  // Name validation
  const nameInput = document.getElementById("name");
  if (nameInput) {
    nameInput.addEventListener("blur", function () {
      if (this.value && this.value.length < 2) {
        showValidationMessage(
          this,
          "Name should be at least 2 characters long"
        );
      } else if (this.value) {
        hideValidationMessage(this);
        showSuccessState(this);
      }
    });
  }

  // Message validation with character counter
  const messageInput = document.getElementById("message");
  if (messageInput) {
    // Create character counter
    const charCounter = document.createElement("div");
    charCounter.className = "char-counter";
    charCounter.textContent = "0/500 characters";
    messageInput.parentNode.appendChild(charCounter);

    // Update counter on input
    messageInput.addEventListener("input", function () {
      const length = this.value.length;
      charCounter.textContent = `${length}/500 characters`;

      if (length > 450 && length <= 500) {
        charCounter.classList.add("warning");
        charCounter.classList.remove("error");
      } else if (length > 500) {
        charCounter.classList.remove("warning");
        charCounter.classList.add("error");
      } else {
        charCounter.classList.remove("warning", "error");
      }
    });

    // Validate on blur
    messageInput.addEventListener("blur", function () {
      if (this.value && this.value.length < 10) {
        showValidationMessage(
          this,
          "Message should be at least 10 characters long"
        );
      } else if (this.value.length > 500) {
        showValidationMessage(this, "Message exceeds 500 characters limit");
      } else if (this.value) {
        hideValidationMessage(this);
        showSuccessState(this);
      }
    });
  }

  // Enhanced subject dropdown
  const subjectDropdown = document.getElementById("subject");
  if (subjectDropdown) {
    // Remove the default option when dropdown is clicked
    subjectDropdown.addEventListener("mousedown", function () {
      const defaultOption = this.querySelector('option[value=""]');
      if (defaultOption && this.value === "") {
        setTimeout(() => {
          this.removeChild(defaultOption);
        }, 10);
      }
    });

    // Validate on change
    subjectDropdown.addEventListener("change", function () {
      if (this.value) {
        hideValidationMessage(this);
        showSuccessState(this);
      }
    });

    // Prevent selecting the default option with keyboard
    subjectDropdown.addEventListener("keydown", function (e) {
      if (this.value === "" && (e.key === "ArrowDown" || e.key === "Enter")) {
        const defaultOption = this.querySelector('option[value=""]');
        if (defaultOption) {
          setTimeout(() => {
            this.removeChild(defaultOption);
            if (this.options.length > 0) {
              this.selectedIndex = 0;
            }
          }, 10);
        }
      }
    });
  }
});

// Enhanced form submission handling
document.getElementById("messageForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Validate form
  let isValid = true;

  if (!name) {
    showValidationMessage(
      document.getElementById("name"),
      "Please enter your name"
    );
    isValid = false;
  } else if (name.length < 2) {
    showValidationMessage(
      document.getElementById("name"),
      "Name should be at least 2 characters long"
    );
    isValid = false;
  }

  if (!email) {
    showValidationMessage(
      document.getElementById("email"),
      "Please enter your email address"
    );
    isValid = false;
  } else if (!validateEmail(email)) {
    showValidationMessage(
      document.getElementById("email"),
      "Please enter a valid email address"
    );
    isValid = false;
  }

  if (!subject) {
    showValidationMessage(
      document.getElementById("subject"),
      "Please select a subject"
    );
    isValid = false;
  }

  if (!message) {
    showValidationMessage(
      document.getElementById("message"),
      "Please enter your message"
    );
    isValid = false;
  } else if (message.length < 10) {
    showValidationMessage(
      document.getElementById("message"),
      "Message should be at least 10 characters long"
    );
    isValid = false;
  } else if (message.length > 500) {
    showValidationMessage(
      document.getElementById("message"),
      "Message exceeds 500 characters limit"
    );
    isValid = false;
  }

  if (!isValid) {
    // Shake the form to indicate errors
    this.classList.add("input-error");
    setTimeout(() => {
      this.classList.remove("input-error");
    }, 500);

    // Scroll to first error
    const firstError = this.querySelector(".input-error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return;
  }

  // Show loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.classList.add("btn-loading");
  submitBtn.disabled = true;

  // Simulate API call (replace with actual form submission)
  setTimeout(() => {
    // In a real application, you would send this data to a server
    showToast(
      `Thanks, ${name}! Your message has been sent. We'll respond soon.`
    );

    // Clear the form
    this.reset();

    // Reset character counter if exists
    const charCounter = document.querySelector(".char-counter");
    if (charCounter) {
      charCounter.textContent = "0/500 characters";
      charCounter.classList.remove("warning", "error");
    }

    // Add the default option back if it was removed
    const subjectDropdown = document.getElementById("subject");
    if (subjectDropdown) {
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Select a subject";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.hidden = true;

      subjectDropdown.insertBefore(defaultOption, subjectDropdown.firstChild);
      subjectDropdown.value = "";
    }

    // Reset button state
    submitBtn.classList.remove("btn-loading");
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
});

// Enhanced subscription form handling
document
  .getElementById("subscribeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("subscriberEmail").value;

    // Email validation
    if (!validateEmail(email)) {
      showValidationMessage(
        document.getElementById("subscriberEmail"),
        "Please enter a valid email address"
      );
      document.getElementById("subscriberEmail").classList.add("input-error");
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.classList.add("btn-loading");
    submitBtn.disabled = true;

    // In a real application, you would send this to a server
    setTimeout(() => {
      showToast(`Thank you for subscribing with ${email}!`);

      // Clear the form
      document.getElementById("subscriberEmail").value = "";

      // Reset button state
      submitBtn.classList.remove("btn-loading");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1000);
  });

// Enhanced copy email function
document.getElementById("copyButton").addEventListener("click", function () {
  const email = "info@quitemugcafe.com";

  // Using the Clipboard API
  navigator.clipboard
    .writeText(email)
    .then(() => {
      showToast("Email address copied to clipboard!");

      // Add visual feedback
      this.innerHTML = '<i class="fas fa-check"></i> Copied!';
      this.classList.add("input-success");

      // Reset after 2 seconds
      setTimeout(() => {
        this.innerHTML = "Copy";
        this.classList.remove("input-success");
      }, 2000);
    })
    .catch((err) => {
      // Fallback for browsers that don't support Clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          showToast("Email address copied to clipboard!");

          // Add visual feedback
          this.innerHTML = '<i class="fas fa-check"></i> Copied!';
          this.classList.add("input-success");

          // Reset after 2 seconds
          setTimeout(() => {
            this.innerHTML = "Copy";
            this.classList.remove("input-success");
          }, 2000);
        } else {
          showToast("Failed to copy email address");
        }
      } catch (err) {
        showToast("Failed to copy email address");
      }

      document.body.removeChild(textArea);
    });
});

// Enhanced Instagram link handling
document.querySelector(".social-link").addEventListener("click", function (e) {
  e.preventDefault();

  // Add animation to the icon
  const icon = this.querySelector("i");
  icon.style.transition = "transform 0.5s";
  icon.style.transform = "rotate(15deg) scale(1.2)";

  showToast("Opening Instagram profile...");

  // After a delay, actually open the link
  setTimeout(() => {
    window.open(this.href, "_blank");

    // Reset icon animation
    setTimeout(() => {
      icon.style.transform = "";
    }, 500);
  }, 1000);
});

// Enhanced toast notification function
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast"; // Reset classes

  // Add type class if provided
  if (type) {
    toast.classList.add(type);
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Enhanced scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.visibility = "visible";
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all sections and items
  document
    .querySelectorAll(
      ".contact-info, .contact-form, .subscription, .email-help, .map-section, .info-item"
    )
    .forEach((section) => {
      section.style.visibility = "hidden";
      observer.observe(section);
    });
}

// Parallax effect for background
function initParallax() {
  const background = document.querySelector("body");
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    background.style.backgroundPosition = `0px ${rate}px`;
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initScrollAnimations();
  initParallax();

  // Add animated class to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.add("btn-animated");
  });

  // Add floating animation to icons on hover
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      icon.style.animation = "float 2s ease-in-out infinite";
    });

    icon.addEventListener("mouseleave", () => {
      icon.style.animation = "";
    });
  });

  // Pulse animation for CTA elements
  setInterval(() => {
    document.querySelectorAll(".btn, .social-link").forEach((el) => {
      el.style.animation = "pulse 2s";
      setTimeout(() => {
        el.style.animation = "";
      }, 2000);
    });
  }, 10000);
});

// Enhanced input focus effects
document.querySelectorAll("input, textarea, select").forEach((input) => {
  // Add floating label functionality
  if (
    input.id !== "subject" &&
    !input.parentNode.querySelector(".floating-label")
  ) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      const floatingLabel = document.createElement("span");
      floatingLabel.className = "floating-label";
      floatingLabel.textContent = label.textContent;

      const wrapper = document.createElement("div");
      wrapper.className = "floating-label-group";

      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      wrapper.appendChild(floatingLabel);
      label.style.display = "none";
    }
  }

  // Add focus effects
  input.addEventListener("focus", function () {
    this.parentNode.classList.add("focused");
  });

  input.addEventListener("blur", function () {
    if (!this.value) {
      this.parentNode.classList.remove("focused");
    }
  });
});

document.getElementById("messageForm").addEventListener("submit", function (e) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (!isLoggedIn) {
    e.preventDefault();
    alert("You must be a Logged in User before sending messages.");
    return;
  }

  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Validate form
  let isValid = true;

  if (!name) {
    showValidationMessage(
      document.getElementById("name"),
      "Please enter your name"
    );
    isValid = false;
  } else if (name.length < 2) {
    showValidationMessage(
      document.getElementById("name"),
      "Name should be at least 2 characters long"
    );
    isValid = false;
  }

  if (!email) {
    showValidationMessage(
      document.getElementById("email"),
      "Please enter your email address"
    );
    isValid = false;
  } else if (!validateEmail(email)) {
    showValidationMessage(
      document.getElementById("email"),
      "Please enter a valid email address"
    );
    isValid = false;
  }

  if (!subject) {
    showValidationMessage(
      document.getElementById("subject"),
      "Please select a subject"
    );
    isValid = false;
  }

  if (!message) {
    showValidationMessage(
      document.getElementById("message"),
      "Please enter your message"
    );
    isValid = false;
  } else if (message.length < 10) {
    showValidationMessage(
      document.getElementById("message"),
      "Message should be at least 10 characters long"
    );
    isValid = false;
  } else if (message.length > 500) {
    showValidationMessage(
      document.getElementById("message"),
      "Message exceeds 500 characters limit"
    );
    isValid = false;
  }

  if (!isValid) {
    this.classList.add("input-error");
    setTimeout(() => {
      this.classList.remove("input-error");
    }, 500);

    const firstError = this.querySelector(".input-error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return;
  }

  // Continue with submission logic...
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.classList.add("btn-loading");
  submitBtn.disabled = true;

  setTimeout(() => {
    showToast(
      `Thanks, ${name}! Your message has been sent. We'll respond soon.`
    );
    this.reset();

    const charCounter = document.querySelector(".char-counter");
    if (charCounter) {
      charCounter.textContent = "0/500 characters";
      charCounter.classList.remove("warning", "error");
    }

    const subjectDropdown = document.getElementById("subject");
    if (subjectDropdown) {
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Select a subject";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.hidden = true;

      subjectDropdown.insertBefore(defaultOption, subjectDropdown.firstChild);
      subjectDropdown.value = "";
    }

    submitBtn.classList.remove("btn-loading");
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
});

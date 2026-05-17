
// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});// Subscription form handling
document.getElementById('subscribeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('subscriberEmail').value;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
    }
    
    // In a real application, you would send this to a server
    showToast(`Thank you for subscribing with ${email}!`);
    
    // Clear the form
    document.getElementById('subscriberEmail').value = '';
});

// Copy email function
document.getElementById('copyButton').addEventListener('click', function() {
    const email = 'info@quitemugcafe.com';
    
    // Using the Clipboard API
    navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
    }).catch(err => {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('Email address copied to clipboard!');
            } else {
                showToast('Failed to copy email address');
            }
        } catch (err) {
            showToast('Failed to copy email address');
        }
        
        document.body.removeChild(textArea);
    });
});
// Dropdown default text removal
document.addEventListener('DOMContentLoaded', function() {
    const subjectDropdown = document.getElementById('subject');
    
    if (subjectDropdown) {
        // Remove the default option when dropdown is clicked
        subjectDropdown.addEventListener('mousedown', function() {
            const defaultOption = this.querySelector('option[value=""]');
            if (defaultOption && this.value === "") {
                setTimeout(() => {
                    this.removeChild(defaultOption);
                }, 10);
            }
        });
        
        // Prevent selecting the default option with keyboard
        subjectDropdown.addEventListener('keydown', function(e) {
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

// Form submission handling (updated)
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // For subject, check if it exists and has a value
    let subject = "";
    const subjectElement = document.getElementById('subject');
    if (subjectElement) {
        subject = subjectElement.value;
        // If subject is required, add validation here
    }
    
    // Validate form
    if (!name || !email || !message) {
        showToast('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
    }
    
    // In a real application, you would send this data to a server
    showToast(`Thanks, ${name}! Your message has been sent. We'll respond soon.`);
    
    // Clear the form
    document.getElementById('messageForm').reset();
    
    // Add the default option back if it was removed
    const subjectDropdown = document.getElementById('subject');
    if (subjectDropdown) {
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Select a subject";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.hidden = true;
        
        subjectDropdown.insertBefore(defaultOption, subjectDropdown.firstChild);
        subjectDropdown.value = "";
    }
});
// Toast notification function
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Instagram link handling (for demonstration)
document.querySelector('.social-link').addEventListener('click', function(e) {
    // In a real application, this would open Instagram
    // For this demo, we'll prevent the default and show a message
    e.preventDefault();
    showToast('Opening Instagram profile...');
    
    // After a delay, actually open the link
    setTimeout(() => {
        window.open(this.href, '_blank');
    }, 1500);
});

// Toast notification function
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add animation to elements when they come into view
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.contact-info, .contact-form, .subscription, .email-help').forEach(section => {
        observer.observe(section);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Email form handler loaded - version 3.0');
    
    // Remove required attribute to prevent HTML5 validation
    const emailInput = document.getElementById("visitor-email");
    if (emailInput) {
        emailInput.removeAttribute("required");
        emailInput.setAttribute("novalidate", "");
        console.log("Removed required attribute from email input");
    }
    
    // Prevent any default validation messages
    const emailFormElement = document.getElementById('email-form');
    if (emailFormElement) {
        emailFormElement.setAttribute("novalidate", "");
        console.log("Added novalidate to form");
    }
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // FAQ accordion functionality
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Close other open FAQs
            faqToggles.forEach(otherToggle => {
                if (otherToggle !== this) {
                    const otherContent = otherToggle.nextElementSibling;
                    const otherIcon = otherToggle.querySelector('i');
                    otherContent.classList.add('hidden');
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ
            content.classList.toggle('hidden');
            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form submission handling
    const emailForm = document.querySelector('form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Clear any existing error messages
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            if (email && isValidEmail(email)) {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                // Send email notification
                sendEmailNotification(email)
                    .then(() => {
                        showNotification('Thank you! Check your email for your wellness plan.', 'success');
                        emailForm.reset();
                    })
                    .catch((error) => {
                        console.error('Error sending email:', error);
                        showNotification('Thank you for signing up! We\'ll be in touch soon.', 'success');
                        emailForm.reset();
                    })
                    .finally(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    });
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
        
        // Clear error on input
        const emailInput = emailForm.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                // Clear any existing error messages when user starts typing
                const existingError = document.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            });
        }
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set notification styles based on type
    if (type === 'success') {
        notification.className += ' bg-green-500 text-white';
    } else if (type === 'error') {
        notification.className += ' bg-red-500 text-white';
    } else {
        notification.className += ' bg-blue-500 text-white';
    }
    
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Add loading animation for app store button
document.addEventListener('DOMContentLoaded', function() {
    const appStoreButton = document.querySelector('a[href="#download"]');
    if (appStoreButton) {
        appStoreButton.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Redirecting to App Store...', 'info');
            
            // Simulate redirect delay
            setTimeout(() => {
                // In a real implementation, this would redirect to the actual App Store
                showNotification('App Store link would open here!', 'success');
            }, 1000);
        });
    }
});

// Add hover effects for feature cards
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('#features .grid > div');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add scroll-based navbar background
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/98');
        navbar.classList.remove('bg-white/95');
    } else {
        navbar.classList.remove('bg-white/98');
        navbar.classList.add('bg-white/95');
    }
}); 

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Email form functionality
    const emailForm = document.getElementById('email-form');
    const visitorEmailInput = document.getElementById('visitor-email');

    if (emailForm && visitorEmailInput) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const visitorEmail = visitorEmailInput.value.trim();
            
            if (!visitorEmail) {
                showNotification('Please enter your email address.', 'error');
                return;
            }

            // Show loading state
            const submitButton = emailForm.querySelector('button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Send email notification
            sendEmailNotification(visitorEmail)
                .then(() => {
                    showNotification('Thank you! Check your email for your wellness plan.', 'success');
                    emailForm.reset();
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    showNotification('Thank you for signing up! We\'ll be in touch soon.', 'success');
                    emailForm.reset();
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
});

// Function to send email notification
async function sendEmailNotification(visitorEmail) {
    try {
        const response = await fetch('/api/email-handler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: visitorEmail
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending email notification:', error);
        // Fallback: store email locally
        storeEmailLocally(visitorEmail);
        throw error;
    }
}

// Fallback function to store email locally
function storeEmailLocally(visitorEmail) {
    const storedEmails = JSON.parse(localStorage.getItem('visitorEmails') || '[]');
    storedEmails.push({
        email: visitorEmail,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('visitorEmails', JSON.stringify(storedEmails));
    console.log('Email stored locally. Check localStorage for visitor emails.');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set notification styles based on type
    if (type === 'success') {
        notification.className += ' bg-green-500 text-white';
    } else if (type === 'error') {
        notification.className += ' bg-red-500 text-white';
    } else {
        notification.className += ' bg-blue-500 text-white';
    }
    
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
} 
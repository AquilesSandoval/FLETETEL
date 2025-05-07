/**
 * Fletetel Account Dashboard Animations
 * This script adds interactive animations for various elements in the dashboard.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Truck animation in dashboard header
    animateTruck();
    
    // Add hover effects to important elements
    addHoverEffects();
    
    // Add form field animations
    addFormFieldAnimations();
});

/**
 * Creates a moving truck animation in the dashboard
 */
function animateTruck() {
    const truckIcon = document.querySelector('.truck-animation');
    if (truckIcon) {
        // Initial animation
        setTimeout(() => {
            truckIcon.classList.add('drive');
            setTimeout(() => {
                truckIcon.classList.remove('drive');
            }, 2000);
        }, 1000);
        
        // Repeating animation every 5 seconds
        setInterval(() => {
            truckIcon.classList.add('drive');
            setTimeout(() => {
                truckIcon.classList.remove('drive');
            }, 2000);
        }, 5000);
    }
}

/**
 * Adds subtle hover and interaction effects to various elements
 */
function addHoverEffects() {
    // Dashboard cards ripple effect
    const cards = document.querySelectorAll('.account-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle shadow pulse animation
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset to original transition
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn, .btn-download, .btn-add');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Navigation item effects
    const navItems = document.querySelectorAll('.account-nav a');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.paddingLeft = '1.7rem';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.paddingLeft = '1.5rem';
            }
        });
    });
}

/**
 * Adds animations to form fields for better user feedback
 */
function addFormFieldAnimations() {
    // Focus effects for form inputs
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Add subtle scale animation to label
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transition = 'all 0.2s ease';
                label.style.color = '#0A2F50';
                label.style.transform = 'translateY(-2px)';
            }
        });
        
        input.addEventListener('blur', function() {
            // Reset label style
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.color = '';
                label.style.transform = '';
            }
        });
    });
    
    // Form submission animation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                // Only add this effect if form is valid
                if (form.checkValidity()) {
                    this.classList.add('submitting');
                    
                    // Add a slight delay for feedback
                    setTimeout(() => {
                        this.classList.remove('submitting');
                    }, 500);
                }
            });
        }
    });
}
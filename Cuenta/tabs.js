/**
 * Fletetel Account Dashboard Tabs
 * This script handles the tab switching functionality in the account dashboard.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and tab contents
    const navLinks = document.querySelectorAll('.account-nav a');
    const cards = document.querySelectorAll('.account-card');
    const tabContents = document.querySelectorAll('.tab-content');
    
    /**
     * Shows a specific tab content and updates the active state in the navigation
     * @param {string} tabId - The ID of the tab to show
     */
    function showTab(tabId) {
        // Hide all tab contents with smooth transition
        tabContents.forEach(content => {
            if (content.classList.contains('active')) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(10px)';
                
                // Use setTimeout to allow for the CSS transition to complete
                setTimeout(() => {
                    content.classList.remove('active');
                }, 200);
            }
        });
        
        // Show the selected tab content after a slight delay
        setTimeout(() => {
            // Show the selected tab content
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
                
                // Trigger reflow for animation
                void selectedTab.offsetWidth;
                
                selectedTab.style.opacity = '1';
                selectedTab.style.transform = 'translateY(0)';
            }
            
            // Update active state in sidebar navigation
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-tab') === tabId) {
                    link.classList.add('active');
                }
            });
            
            // Save the active tab to sessionStorage
            sessionStorage.setItem('activeTab', tabId);
        }, 200);
    }
    
    // Set up click event for sidebar navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                showTab(tabId);
            }
        });
    });
    
    // Set up click event for dashboard cards
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                showTab(tabId);
            }
        });
    });
    
    // Check if there's a saved active tab in sessionStorage
    const activeTab = sessionStorage.getItem('activeTab');
    
    // Show the saved tab or default to dashboard
    if (activeTab && document.getElementById(activeTab)) {
        showTab(activeTab);
    } else {
        showTab('tab-dashboard');
    }
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const formId = this.id;
            const successMessage = document.querySelector(`#${formId}-success`);
            
            if (successMessage) {
                successMessage.style.display = 'block';
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        });
    });
    
    // Order details toggle
    const viewDetailsButtons = document.querySelectorAll('.view-order-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const orderId = this.getAttribute('data-order');
            const orderDetails = document.querySelector(`.order-details-expanded[data-order="${orderId}"]`);
            
            if (orderDetails) {
                if (orderDetails.style.display === 'block') {
                    // Hide details
                    orderDetails.style.opacity = '0';
                    orderDetails.style.transform = 'translateY(-10px)';
                    
                    // Use setTimeout to allow for the CSS transition to complete
                    setTimeout(() => {
                        orderDetails.style.display = 'none';
                    }, 200);
                    
                    this.textContent = 'Ver detalles';
                } else {
                    // Show details
                    orderDetails.style.display = 'block';
                    
                    // Trigger reflow for animation
                    void orderDetails.offsetWidth;
                    
                    orderDetails.style.opacity = '1';
                    orderDetails.style.transform = 'translateY(0)';
                    this.textContent = 'Ocultar detalles';
                }
            }
        });
    });
    
    // Address editing
    const editButtons = document.querySelectorAll('.btn-edit-address');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const addressId = this.getAttribute('data-address');
            const addressCard = document.querySelector(`.address-card[data-address="${addressId}"]`);
            const addressForm = document.querySelector(`#edit-address-${addressId}`);
            
            if (addressCard && addressForm) {
                // Hide card with animation
                addressCard.style.opacity = '0';
                addressCard.style.transform = 'translateY(-10px)';
                
                // Use setTimeout to allow for the CSS transition to complete
                setTimeout(() => {
                    addressCard.style.display = 'none';
                    
                    // Show form with animation
                    addressForm.style.display = 'block';
                    
                    // Trigger reflow for animation
                    void addressForm.offsetWidth;
                    
                    addressForm.style.opacity = '1';
                    addressForm.style.transform = 'translateY(0)';
                }, 200);
            }
        });
    });
    
    // Cancel address editing
    const cancelButtons = document.querySelectorAll('.btn-cancel-edit');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const addressId = this.getAttribute('data-address');
            const addressCard = document.querySelector(`.address-card[data-address="${addressId}"]`);
            const addressForm = document.querySelector(`#edit-address-${addressId}`);
            
            if (addressCard && addressForm) {
                // Hide form with animation
                addressForm.style.opacity = '0';
                addressForm.style.transform = 'translateY(-10px)';
                
                // Use setTimeout to allow for the CSS transition to complete
                setTimeout(() => {
                    addressForm.style.display = 'none';
                    
                    // Show card with animation
                    addressCard.style.display = 'block';
                    
                    // Trigger reflow for animation
                    void addressCard.offsetWidth;
                    
                    addressCard.style.opacity = '1';
                    addressCard.style.transform = 'translateY(0)';
                }, 200);
            }
        });
    });
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method-card');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
});
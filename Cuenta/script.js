document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and tab contents
    const navLinks = document.querySelectorAll('.account-nav a');
    const cards = document.querySelectorAll('.account-card');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Function to show a specific tab
    function showTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show the selected tab content
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
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
    }
    
    // Set up click event for sidebar navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    // Set up click event for dashboard cards
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
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
            
            // Reset form
            this.reset();
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
    
    // Address editing
    const editButtons = document.querySelectorAll('.btn-edit-address');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const addressId = this.getAttribute('data-address');
            const addressCard = document.querySelector(`.address-card[data-address="${addressId}"]`);
            const addressForm = document.querySelector(`#edit-address-${addressId}`);
            
            if (addressCard && addressForm) {
                addressCard.style.display = 'none';
                addressForm.style.display = 'block';
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
                addressCard.style.display = 'block';
                addressForm.style.display = 'none';
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
                    orderDetails.style.display = 'none';
                    this.textContent = 'Ver detalles';
                } else {
                    orderDetails.style.display = 'block';
                    this.textContent = 'Ocultar detalles';
                }
            }
        });
    });
    
    // Add a shipping animation to represent a freight company
    const truckIcon = document.querySelector('.truck-animation');
    if (truckIcon) {
        setInterval(() => {
            truckIcon.classList.add('drive');
            setTimeout(() => {
                truckIcon.classList.remove('drive');
            }, 2000);
        }, 5000);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar la URL base para que apunte a la carpeta fletes
    const API_BASE_URL = 'http://localhost/fletes';
    
    // Códigos postales predefinidos para pruebas
    const codigosPostales = {
        '03940': 'Ciudad de México - Col. Crédito Constructor',
        '44690': 'Guadalajara - Col. Vallarta Norte',
        '64000': 'Monterrey - Centro'
    };

    // Elementos del DOM
    const quoteForm = document.getElementById('quoteForm');
    const quoteModal = document.getElementById('quoteModal');
    const closeQuoteModalBtn = document.getElementById('closeQuoteModal');
    const quoteDetailsContainer = document.getElementById('quoteDetails');
    const paypalButtonContainer = document.getElementById('paypal-button-container');

    // Elementos para autenticación
    const loginModal = document.getElementById('loginModal');
    const closeLoginModalBtn = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const showRegisterModalLink = document.getElementById('showRegisterModalLink');
    const registerModal = document.getElementById('registerModal');
    const closeRegisterModalBtn = document.getElementById('closeRegisterModal');
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    const showLoginModalLink = document.getElementById('showLoginModalLink');
    const logoutButton = document.getElementById('logoutButton');

    let currentUser = null;
    let currentQuoteData = null;

    // Inicialización
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    checkUserSession();

    // Funciones de Modal
    function openModal(modalElement) {
        if (modalElement) modalElement.classList.add('active');
    }
    
    function closeModal(modalElement) {
        if (modalElement) modalElement.classList.remove('active');
    }

    // Event Listeners para modales
    if (closeQuoteModalBtn) closeQuoteModalBtn.onclick = () => closeModal(quoteModal);
    if (closeLoginModalBtn) closeLoginModalBtn.onclick = () => { closeModal(loginModal); loginMessage.textContent = ''; };
    if (closeRegisterModalBtn) closeRegisterModalBtn.onclick = () => { closeModal(registerModal); registerMessage.textContent = ''; };

    window.onclick = (event) => {
        if (event.target === quoteModal) closeModal(quoteModal);
        if (event.target === loginModal) { closeModal(loginModal); loginMessage.textContent = ''; }
        if (event.target === registerModal) { closeModal(registerModal); registerMessage.textContent = ''; }
    };

    if (showRegisterModalLink) {
        showRegisterModalLink.onclick = (e) => {
            e.preventDefault();
            closeModal(loginModal);
            loginMessage.textContent = '';
            openModal(registerModal);
            registerForm.reset();
        };
    }
    
    if (showLoginModalLink) {
        showLoginModalLink.onclick = (e) => {
            e.preventDefault();
            closeModal(registerModal);
            registerMessage.textContent = '';
            openModal(loginModal);
            loginForm.reset();
        };
    }

    // Verificar sesión
    async function checkUserSession() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateNavOnLogin();
        }
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginMessage.textContent = '';
            loginMessage.className = 'form-message';

            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_BASE_URL}/fletes.php?action=login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    currentUser = data.user;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    loginMessage.textContent = `¡Bienvenido ${currentUser.nombre}!`;
                    loginMessage.classList.add('success');
                    updateNavOnLogin();
                    
                    setTimeout(() => {
                        closeModal(loginModal);
                        loginForm.reset();
                        if (currentQuoteData) {
                            quoteForm.dispatchEvent(new Event('submit', { cancelable: true }));
                        }
                    }, 1500);
                } else {
                    loginMessage.textContent = data.message;
                    loginMessage.classList.add('error');
                }
            } catch (error) {
                loginMessage.textContent = 'Error de conexión';
                loginMessage.classList.add('error');
            }
        });
    }

    // Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerMessage.textContent = '';
            registerMessage.className = 'form-message';

            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const nombre = document.getElementById('registerNombre').value;
            const email = document.getElementById('registerEmail').value;

            try {
                const response = await fetch(`${API_BASE_URL}/fletes.php?action=register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, nombre, email })
                });

                const data = await response.json();

                if (data.success) {
                    registerMessage.textContent = 'Registro exitoso. Puedes iniciar sesión ahora.';
                    registerMessage.classList.add('success');
                    
                    setTimeout(() => {
                        closeModal(registerModal);
                        registerForm.reset();
                        openModal(loginModal);
                    }, 1500);
                } else {
                    registerMessage.textContent = data.message;
                    registerMessage.classList.add('error');
                }
            } catch (error) {
                registerMessage.textContent = 'Error de conexión';
                registerMessage.classList.add('error');
            }
        });
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            currentUser = null;
            updateNavOnLogin();
            alert('Has cerrado sesión exitosamente.');
        });
    }

    function updateNavOnLogin() {
        if (currentUser) {
            if (logoutButton) logoutButton.style.display = 'flex';
        } else {
            if (logoutButton) logoutButton.style.display = 'none';
        }
    }

    // Cálculo de precios por servicio
    function calculatePrices(weight, postalCode) {
        const basePrice = parseFloat(weight) * 25 + 500;
        
        return {
            regular: {
                price: basePrice,
                time: "3-5 días hábiles",
                description: "Servicio estándar con entrega programada"
            },
            fast: {
                price: basePrice * 1.3,
                time: "2-3 días hábiles",
                description: "Servicio express con prioridad de envío"
            },
            fastPlus: {
                price: basePrice * 1.8,
                time: "24 horas",
                description: "Servicio premium con entrega garantizada al siguiente día"
            }
        };
    }

    // Manejo del formulario de cotización
    if (quoteForm) {
        const formHTML = `
            <div class="input-group">
                <i class="fas fa-map-marker-alt"></i>
                <input type="text" id="destino" placeholder="Código Postal" required
                       pattern="[0-9]{5}" title="Ingresa un código postal válido de 5 dígitos">
            </div>
            <div class="input-group">
                <i class="fas fa-weight-hanging"></i>
                <input type="number" id="peso" placeholder="Peso aproximado (kg)" required min="1" max="10000">
            </div>
            <button type="submit" class="submit-btn">
                <i class="fas fa-calculator"></i>
                Cotizar Envío
            </button>
        `;
        
        quoteForm.innerHTML = formHTML;

        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const destino = document.getElementById('destino').value;
            if (!codigosPostales[destino]) {
                alert('Por favor, ingresa uno de los siguientes códigos postales de prueba:\n' +
                      Object.keys(codigosPostales).join(', '));
                return;
            }

            const formData = {
                destino: destino,
                ubicacion_destino: codigosPostales[destino],
                peso: document.getElementById('peso').value
            };

            currentQuoteData = formData;

            if (!currentUser) {
                openModal(loginModal);
                loginMessage.textContent = 'Por favor, inicia sesión para cotizar.';
                loginMessage.className = 'form-message';
                return;
            }

            const prices = calculatePrices(formData.peso, formData.destino);
            
            quoteDetailsContainer.innerHTML = `
                <div class="quote-item">
                    <span class="quote-label">Destino:</span>
                    <span class="quote-value">${formData.ubicacion_destino}</span>
                </div>
                <div class="quote-item">
                    <span class="quote-label">Peso:</span>
                    <span class="quote-value">${formData.peso} kg</span>
                </div>
                
                <div class="service-options">
                    <h3>Selecciona tu servicio:</h3>
                    
                    <div class="service-option" data-service="fastPlus">
                        <div class="service-header">
                            <h4>Fast+ Premium</h4>
                            <span class="service-price">$${prices.fastPlus.price.toFixed(2)} MXN</span>
                        </div>
                        <p class="service-time"><i class="fas fa-clock"></i> ${prices.fastPlus.time}</p>
                        <p class="service-description">${prices.fastPlus.description}</p>
                        <button class="select-service-btn" data-service="fastPlus">
                            Seleccionar Fast+
                        </button>
                    </div>
                    
                    <div class="service-option" data-service="fast">
                        <div class="service-header">
                            <h4>Fast</h4>
                            <span class="service-price">$${prices.fast.price.toFixed(2)} MXN</span>
                        </div>
                        <p class="service-time"><i class="fas fa-clock"></i> ${prices.fast.time}</p>
                        <p class="service-description">${prices.fast.description}</p>
                        <button class="select-service-btn" data-service="fast">
                            Seleccionar Fast
                        </button>
                    </div>
                    
                    <div class="service-option" data-service="regular">
                        <div class="service-header">
                            <h4>Regular</h4>
                            <span class="service-price">$${prices.regular.price.toFixed(2)} MXN</span>
                        </div>
                        <p class="service-time"><i class="fas fa-clock"></i> ${prices.regular.time}</p>
                        <p class="service-description">${prices.regular.description}</p>
                        <button class="select-service-btn" data-service="regular">
                            Seleccionar Regular
                        </button>
                    </div>
                </div>
            `;

            document.querySelectorAll('.select-service-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const serviceType = this.dataset.service;
                    const selectedPrice = prices[serviceType].price;
                    
                    currentQuoteData.servicio = serviceType;
                    currentQuoteData.precio = selectedPrice;
                    
                    try {
                        const response = await fetch(`${API_BASE_URL}/fletes.php?action=crear_cotizacion`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(currentQuoteData)
                        });

                        const data = await response.json();

                        if (data.success) {
                            const paymentOptionsHTML = `
                                <div class="payment-options">
                                    <h4>Confirmar y Pagar con:</h4>
                                    <button id="payWithCashBtn" class="submit-btn" style="background-color: #4CAF50;">
                                        <i class="fas fa-money-bill-wave"></i> Efectivo
                                    </button>
                                </div>
                            `;
                            
                            document.querySelector('.service-options').style.display = 'none';
                            quoteDetailsContainer.insertAdjacentHTML('beforeend', paymentOptionsHTML);
                            
                            document.getElementById('payWithCashBtn').onclick = () => handlePayment('efectivo', currentQuoteData);
                            
                            paypalButtonContainer.innerHTML = '';
                            if (window.paypal && typeof window.paypal.Buttons === 'function') {
                                renderPayPalButtons(selectedPrice.toFixed(2));
                            }
                        } else {
                            alert('Error al guardar la cotización: ' + data.message);
                        }
                    } catch (error) {
                        alert('Error de conexión al guardar la cotización');
                    }
                });
            });

            openModal(quoteModal);
        });
    }

    function renderPayPalButtons(amount) {
        if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
            console.error("PayPal SDK no disponible");
            paypalButtonContainer.innerHTML = '<p style="color:red;">Error al cargar PayPal</p>';
            return;
        }

        try {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { 
                                value: amount,
                                currency_code: 'MXN'
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(function(details) {
                        handlePayment('paypal', {
                            ...currentQuoteData,
                            paypal_order_id: details.id
                        });
                    });
                }
            }).render('#paypal-button-container');
        } catch (error) {
            console.error("Error al renderizar botones PayPal:", error);
            paypalButtonContainer.innerHTML = '<p style="color:red;">Error al inicializar PayPal</p>';
        }
    }

    function handlePayment(method, quoteData) {
        if (!currentUser) {
            alert('Por favor, inicia sesión para continuar.');
            openModal(loginModal);
            return;
        }

        alert(`Pago con ${method} procesado. ¡Gracias por tu compra!`);
        closeModal(quoteModal);
        quoteForm.reset();
        currentQuoteData = null;
    }
});
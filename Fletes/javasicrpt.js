document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN ---
    // Cambia esta URL a la ubicación de tu api.php
    // Ejemplo si api.php está en una carpeta 'api' en la raíz de tu servidor local:
    const API_BASE_URL = 'http://localhost:8000/fletes.php'; 
    // Ejemplo si usas el servidor de desarrollo de PHP en el puerto 8000 y api.php está en la raíz:
    // const API_BASE_URL = 'http://localhost:8000/api.php';


    // Elementos del DOM para Cotización
    const quoteForm = document.getElementById('quoteForm');
    const quoteModal = document.getElementById('quoteModal');
    const closeQuoteModalBtn = document.getElementById('closeQuoteModal');
    const quoteDetailsContainer = document.getElementById('quoteDetails');
    const paypalButtonContainer = document.getElementById('paypal-button-container');

    // Elementos del DOM para Login
    const loginModal = document.getElementById('loginModal');
    const closeLoginModalBtn = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const showRegisterModalLink = document.getElementById('showRegisterModalLink');

    // Elementos del DOM para Registro
    const registerModal = document.getElementById('registerModal');
    const closeRegisterModalBtn = document.getElementById('closeRegisterModal');
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    const showLoginModalLink = document.getElementById('showLoginModalLink');

    const logoutButton = document.getElementById('logoutButton');

    let currentUser = null;
    let currentQuoteData = null;

    // --- INICIALIZACIÓN ---
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.min = today;
    }
    checkUserSession(); // Verificar si hay sesión al cargar

    // --- FUNCIONES DE MODAL ---
    function openModal(modalElement) {
        if (modalElement) modalElement.classList.add('active');
    }
    function closeModal(modalElement) {
        if (modalElement) modalElement.classList.remove('active');
    }

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
            closeModal(loginModal); loginMessage.textContent = '';
            openModal(registerModal); registerForm.reset();
        };
    }
    if (showLoginModalLink) {
        showLoginModalLink.onclick = (e) => {
            e.preventDefault();
            closeModal(registerModal); registerMessage.textContent = '';
            openModal(loginModal); loginForm.reset();
        };
    }

    // --- LÓGICA DE AUTENTICACIÓN ---
    async function checkUserSession() {
        try {
            const response = await fetch(`${API_BASE_URL}?action=check_session`, { method: 'GET' });
            const result = await response.json();
            if (result.success && result.loggedIn && result.user) {
                currentUser = result.user;
                updateNavOnLogin();
                console.log("Sesión activa:", currentUser.username);
            } else {
                currentUser = null;
                updateNavOnLogin();
            }
        } catch (error) {
            console.error("Error verificando sesión:", error);
            currentUser = null;
            updateNavOnLogin();
        }
    }


    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginMessage.textContent = ''; loginMessage.className = 'form-message';
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_BASE_URL}?action=login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                if (result.success && result.user) {
                    currentUser = result.user;
                    loginMessage.textContent = `¡Bienvenido ${currentUser.nombre || currentUser.username}!`;
                    loginMessage.classList.add('success');
                    updateNavOnLogin();
                    setTimeout(() => {
                        closeModal(loginModal); loginForm.reset();
                        if (currentQuoteData) { // Si había una cotización pendiente
                            quoteForm.dispatchEvent(new Event('submit', { cancelable: true }));
                        }
                    }, 1500);
                } else {
                    loginMessage.textContent = result.message || 'Error desconocido.';
                    loginMessage.classList.add('error');
                }
            } catch (error) {
                loginMessage.textContent = 'Error de conexión al servidor.';
                loginMessage.classList.add('error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerMessage.textContent = ''; registerMessage.className = 'form-message';
            const nombre = document.getElementById('registerNombre').value;
            const email = document.getElementById('registerEmail').value;
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch(`${API_BASE_URL}?action=register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, username, password })
                });
                const result = await response.json();
                if (result.success) {
                    registerMessage.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
                    registerMessage.classList.add('success');
                    setTimeout(() => {
                        closeModal(registerModal); registerForm.reset();
                        openModal(loginModal);
                    }, 2000);
                } else {
                    registerMessage.textContent = result.message || 'Error desconocido.';
                    registerMessage.classList.add('error');
                }
            } catch (error) {
                registerMessage.textContent = 'Error de conexión al servidor.';
                registerMessage.classList.add('error');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch(`${API_BASE_URL}?action=logout`, { method: 'POST' }); // o GET si lo prefieres para logout
                currentUser = null;
                updateNavOnLogin();
                alert('Has cerrado sesión.');
                // Opcional: recargar la página o redirigir
                // window.location.reload(); 
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                alert("Error al cerrar sesión. Intenta de nuevo.");
            }
        });
    }

    function updateNavOnLogin() {
        if (currentUser) {
            if (logoutButton) logoutButton.style.display = 'flex';
             // Podrías ocultar un botón de "Login/Registro" si lo tuvieras en la navbar
        } else {
            if (logoutButton) logoutButton.style.display = 'none';
        }
    }

    // --- LÓGICA DE COTIZACIÓN ---
    function calculatePrice(weight, origin, destination) {
        const pricePerKg = 25;
        const distanceMultiplier = 1.5;
        let price = parseFloat(weight) * pricePerKg;
        price *= distanceMultiplier;
        const serviceFee = 500;
        price += serviceFee;
        return price;
    }

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                origen: document.getElementById('origen').value,
                destino: document.getElementById('destino').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                peso: document.getElementById('peso').value
            };
            currentQuoteData = formData;

            if (!currentUser) {
                openModal(loginModal);
                loginMessage.textContent = 'Por favor, inicia sesión para cotizar.';
                loginMessage.className = 'form-message';
                return;
            }

            const estimatedPrice = calculatePrice(formData.peso, formData.origen, formData.destino);
            currentQuoteData.precio_estimado = estimatedPrice;

            quoteDetailsContainer.innerHTML = `
                <div class="quote-item"><span class="quote-label">Origen:</span><span class="quote-value">${formData.origen}</span></div>
                <div class="quote-item"><span class="quote-label">Destino:</span><span class="quote-value">${formData.destino}</span></div>
                <div class="quote-item"><span class="quote-label">Fecha:</span><span class="quote-value">${formData.fecha}</span></div>
                <div class="quote-item"><span class="quote-label">Hora:</span><span class="quote-value">${formData.hora}</span></div>
                <div class="quote-item"><span class="quote-label">Peso:</span><span class="quote-value">${formData.peso} kg</span></div>
                <div class="quote-item quote-price"><span class="quote-label">Precio Estimado:</span><span class="quote-value">$${estimatedPrice.toFixed(2)} MXN</span></div>
                <div class="payment-options">
                    <h4>Confirmar y Pagar con:</h4>
                    <button id="payWithCashBtn" class="submit-btn" style="background-color: #4CAF50;"><i class="fas fa-money-bill-wave"></i> Efectivo</button>
                    </div>
            `;
            paypalButtonContainer.innerHTML = ''; // Limpiar por si acaso

            if (window.paypal && typeof window.paypal.Buttons === 'function') {
                renderPayPalButtons(estimatedPrice.toFixed(2));
            } else {
                paypalButtonContainer.innerHTML = '<p style="color:red;">Error al cargar SDK de PayPal. Asegúrate que tu Client ID es correcto y tienes conexión.</p>';
                console.error("PayPal SDK no está listo o no se cargó correctamente.");
            }

            const payWithCashBtn = document.getElementById('payWithCashBtn');
            if (payWithCashBtn) {
                payWithCashBtn.onclick = () => handlePayment('efectivo', currentQuoteData);
            }
            openModal(quoteModal);
        });
    }

    // --- LÓGICA DE PAGO ---
    function renderPayPalButtons(amount) {
        if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
            console.error("Intentando renderizar botones PayPal, pero el SDK no está disponible.");
            paypalButtonContainer.innerHTML = '<p style="color:red;">Error crítico: SDK de PayPal no disponible.</p>';
            return;
        }
        try {
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: amount, currency_code: 'MXN' },
                            description: `Flete de ${currentQuoteData.origen || 'N/A'} a ${currentQuoteData.destino || 'N/A'}`
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        const paymentData = {
                            ...currentQuoteData,
                            metodo_pago: 'paypal',
                            estado_pago: 'pagado',
                            id_transaccion_paypal: details.id,
                            confirmado: true
                        };
                        saveFleteToDB(paymentData, 'PayPal');
                    });
                },
                onError: function(err) {
                    console.error('Error de PayPal o pago cancelado:', err);
                    alert('Ocurrió un error con el pago de PayPal o fue cancelado.');
                },
                onCancel: function (data) {
                    alert('El pago con PayPal fue cancelado.');
                }
            }).render('#paypal-button-container').catch(err => {
                console.error("Error al renderizar botones de PayPal:", err);
                paypalButtonContainer.innerHTML = '<p style="color:red;">No se pudieron mostrar los botones de PayPal.</p>';
            });
        } catch (sdkError) {
            console.error("Excepción al intentar renderizar botones PayPal:", sdkError);
            paypalButtonContainer.innerHTML = '<p style="color:red;">Error al iniciar PayPal. Revisa la consola.</p>';
        }
    }

    async function handlePayment(method, quoteData) {
        if (!currentUser) {
            alert('Por favor, inicia sesión para confirmar el pago.');
            openModal(loginModal);
            return;
        }
        const dataToSend = { ...quoteData, metodo_pago: method, confirmado: true };
        if (method === 'efectivo') {
            dataToSend.estado_pago = 'pendiente';
            saveFleteToDB(dataToSend, 'Efectivo');
        }
    }

    async function saveFleteToDB(fleteData, paymentMethodReadable) {
        if (!currentUser) {
            alert("Error: No hay usuario logueado para guardar el flete.");
            return;
        }
        // El id_usuario ya está en currentUser, no es necesario pasarlo explícitamente
        // ya que el backend lo tomará de la sesión PHP.
        // Solo necesitamos asegurarnos que el resto de los datos del flete estén correctos.

        const dataToBackend = {
            origen: fleteData.origen,
            destino: fleteData.destino,
            fecha: fleteData.fecha,
            hora: fleteData.hora,
            peso: fleteData.peso,
            precio_estimado: fleteData.precio_estimado,
            metodo_pago: fleteData.metodo_pago,
            estado_pago: fleteData.estado_pago,
            id_transaccion_paypal: fleteData.id_transaccion_paypal || null,
            confirmado: fleteData.confirmado
        };


        try {
            const response = await fetch(`${API_BASE_URL}?action=crear_flete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToBackend)
            });
            const result = await response.json();
            if (result.success) {
                alert(`¡Cotización para pago en ${paymentMethodReadable} confirmada y guardada! ID Flete: ${result.flete_id}. Nos pondremos en contacto.`);
                closeModal(quoteModal);
                quoteForm.reset();
                currentQuoteData = null;
            } else {
                alert(`Error al guardar la cotización: ${result.message || 'Error desconocido'}.`);
            }
        } catch (error) {
            console.error("Error al guardar flete:", error);
            alert('Hubo un problema al guardar tu cotización. Intenta más tarde.');
        }
    }
});

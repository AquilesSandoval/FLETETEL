const partners = [
    {
        name: "COSTCO WHOLESALE",
        description: "Siempre que compres algo en Costco no temas en preguntar por nosotros",
        logo: "https://www.costco.com/wcsstore/CostcoGLOBALSAS/images/Costco_Logo-1.png"
    },
    {
        name: "FEDEX",
        description: "Algunos de los paquetes de Fedex nosotros nos encargamos de entregar",
        logo: "https://www.fedex.com/content/dam/fedex-com/logos/FedEx-Logo.png"
    },
    {
        name: "PRIVADO",
        description: "También nos puedes encontrar por privado",
        logo: "faviconblue.png"
    }
];

let currentPartner = 0;
const partnerContent = document.querySelector('.partner-content');
const partnerLogo = document.getElementById('partnerLogo');
const partnerName = document.getElementById('partnerName');
const partnerDescription = document.getElementById('partnerDescription');

function updatePartner() {
 
    partnerContent.classList.add('fade-out');
    partnerLogo.classList.add('fade-out');

    setTimeout(() => {
        
        currentPartner = (currentPartner + 1) % partners.length;
        partnerName.textContent = partners[currentPartner].name;
        partnerDescription.textContent = partners[currentPartner].description;
        partnerLogo.src = partners[currentPartner].logo;
        partnerLogo.alt = `${partners[currentPartner].name} Logo`;

      
        partnerContent.classList.remove('fade-out');
        partnerLogo.classList.remove('fade-out');
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('trackingForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const trackingNumber = document.getElementById('trackingNumber').value;
        const trackingResult = document.getElementById('trackingResult');
        if (trackingNumber.length === 6) {
            trackingResult.innerText = 'Número de guía válido. Mostrando estado del envío...';
            trackingResult.classList.remove('error-message');
            trackingResult.classList.add('success-message');
            const statusBar = document.getElementById('statusBar');
            statusBar.style.display = 'flex';
            const steps = statusBar.getElementsByClassName('status-step');
            const logoIcon = statusBar.getElementsByClassName('logo-icon')[0];
            for (let i = 0; i < steps.length; i++) {
                steps[i].classList.remove('active');
                const dateInfo = steps[i].querySelector('.date-info');
                if (dateInfo) {
                    dateInfo.innerHTML = ''; // Clear previous date info
                }
            }
            steps[0].classList.add('active');
            addDateInfo(steps[0], 'Enviado');
            logoIcon.classList.remove('move');
            logoIcon.style.left = '0';
            setTimeout(() => {
                steps[1].classList.add('active');
                addDateInfo(steps[1], 'En camino');
                logoIcon.style.left = 'calc(50% - 37.5px)';
            }, 2000);
            setTimeout(() => {
                steps[2].classList.add('active');
                addDateInfo(steps[2], 'Entregado');
                logoIcon.style.left = 'calc(100% - 37.5px)'; // Move to the center of the last status
            }, 4000);
        } else {
            trackingResult.innerText = 'Número de guía inválido. Por favor, ingrese un número de guía de 6 dígitos.';
            trackingResult.classList.remove('success-message');
            trackingResult.classList.add('error-message');
            document.getElementById('statusBar').style.display = 'none';
        }
    });

    function addDateInfo(stepElement, status) {
        const now = new Date();
        const dateString = `${status}: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const dateElement = document.createElement('div');
        dateElement.classList.add('date-info');
        dateElement.innerText = dateString;
        stepElement.appendChild(dateElement);
    }
});

setInterval(updatePartner, 4000);

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('accountLink');
    const loginPopup = document.getElementById('loginPopup');
    const closeBtn = document.getElementById('closeBtn');
    const loginForm = document.getElementById('loginForm');
    const accountText = document.getElementById('accountText');

    loginBtn.addEventListener('click', function(event) {
        if (accountText.innerText === 'Iniciar Sesión') {
            event.preventDefault();
            loginPopup.style.display = 'block';
        } else {
            location.href = 'cuenta.html';
        }
    });

    closeBtn.addEventListener('click', function() {
        loginPopup.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == loginPopup) {
            loginPopup.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Aquí puedes agregar la lógica para verificar las credenciales del usuario
        // Si las credenciales son correctas, actualiza el enlace de la cuenta
        accountText.innerText = 'Mi Cuenta';
        loginBtn.href = 'cuenta.html';
        loginPopup.style.display = 'none';
    });
});

// Abrir y cerrar el popup de Servicios
const servicesLink = document.getElementById('servicesLink');
const popupServicios = document.getElementById('popup-servicios');
const closeServiciosBtn = document.getElementById('closeServiciosBtn');

// Abrir el popup
servicesLink.addEventListener('click', (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
    popupServicios.style.display = 'flex';
});

// Cerrar el popup al hacer clic en el botón de cerrar
closeServiciosBtn.addEventListener('click', () => {
    popupServicios.style.display = 'none';
});

// Cerrar el popup al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === popupServicios) {
        popupServicios.style.display = 'none';
    }
});
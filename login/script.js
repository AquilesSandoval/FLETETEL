async function handleLogin(event) {
    event.preventDefault();

    const errorMessage = document.getElementById('error-message');
    const loginForm = document.getElementById('loginForm');
    const welcomeMessage = document.getElementById('welcome-message');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    errorMessage.style.display = 'none';

    // Disable button and show loading state
    submitButton.disabled = true;
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = 'Iniciando sesión...';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Verificar credenciales de superusuario
        if (username === 'admin' && password === '12345') {
            // Guardar información del usuario
            localStorage.setItem('user', JSON.stringify({
                id: 'admin',
                username: 'admin',
                role: 'superuser'
            }));
            
            // Redirigir a cuenta.html
            window.location.href = '../Cuenta/cuenta.html';
            return;
        }

        // Si no es superusuario, continuar con la verificación normal
        const response = await fetch('http://localhost:8000/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Guardar información del usuario
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirigir a cuenta.html
            window.location.href = '../Cuenta/cuenta.html';

            // Mostrar mensaje de bienvenida
            loginForm.style.opacity = '0';
            setTimeout(() => {
                loginForm.parentElement.style.display = 'none';
                welcomeMessage.style.display = 'flex';
            }, 300);
        } else {
            // Mostrar error
            errorMessage.innerText = data.message;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.innerText = 'Error de conexión al servidor.';
        errorMessage.style.display = 'block';
    } finally {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}
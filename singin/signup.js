async function handleSignup(event) {
    event.preventDefault();

    const errorMessage = document.getElementById('error-message');
    const signupForm = document.getElementById('signupForm');
    const welcomeMessage = document.getElementById('welcome-message');
    const submitButton = signupForm.querySelector('button[type="submit"]');

    errorMessage.style.display = 'none';

    // Disable button and show loading state
    submitButton.disabled = true;
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = 'Registrando...';

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Mostrar mensaje de éxito
            signupForm.style.opacity = '0';
            setTimeout(() => {
                signupForm.parentElement.style.display = 'none';
                welcomeMessage.style.display = 'flex';
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    window.location.href = '../login/login.html';
                }, 2000);
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
document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quoteForm');
    const modal = document.getElementById('quoteModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const confirmBtn = document.getElementById('confirmQuote');
    const quoteDetails = document.getElementById('quoteDetails');

    // Asegurarse de que el modal esté oculto inicialmente
    modal.style.display = 'none';

    // Set minimum date to today
    const fechaInput = document.getElementById('fecha');
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;

    // Calculate price based on weight and distance
    function calculatePrice(weight, origin, destination) {
        // Base price per kg
        const pricePerKg = 25;
        
        // Distance multiplier (simplified example)
        const distanceMultiplier = 1.5;
        
        // Calculate basic price
        let price = weight * pricePerKg;
        
        // Add distance factor
        price *= distanceMultiplier;
        
        // Add service fee
        const serviceFee = 500;
        price += serviceFee;
        
        return price;
    }

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            origen: document.getElementById('origen').value,
            destino: document.getElementById('destino').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            peso: document.getElementById('peso').value
        };

        // Calculate estimated price
        const estimatedPrice = calculatePrice(parseFloat(formData.peso), formData.origen, formData.destino);

        // Display quote details
        quoteDetails.innerHTML = `
            <div class="quote-item">
                <span class="quote-label">Origen:</span>
                <span class="quote-value">${formData.origen}</span>
            </div>
            <div class="quote-item">
                <span class="quote-label">Destino:</span>
                <span class="quote-value">${formData.destino}</span>
            </div>
            <div class="quote-item">
                <span class="quote-label">Fecha:</span>
                <span class="quote-value">${formData.fecha}</span>
            </div>
            <div class="quote-item">
                <span class="quote-label">Hora:</span>
                <span class="quote-value">${formData.hora}</span>
            </div>
            <div class="quote-item">
                <span class="quote-label">Peso:</span>
                <span class="quote-value">${formData.peso} kg</span>
            </div>
            <div class="quote-item">
                <span class="quote-label">Precio Estimado:</span>
                <span class="quote-value">$${estimatedPrice.toFixed(2)} MXN</span>
            </div>
        `;

        // Show modal
        modal.style.display = 'flex';
    });

    // Close modal when clicking the close button
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Handle quote confirmation
    confirmBtn.onclick = () => {
        alert('¡Cotización confirmada! Nos pondremos en contacto contigo pronto.');
        modal.style.display = 'none';
        quoteForm.reset();
    };
});

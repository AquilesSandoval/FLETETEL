document.addEventListener('DOMContentLoaded', function() {
    // Shipping details database
    const shipments = {
        '123456': {
            status: 'delivered',
            origin: 'Ciudad de México',
            destination: 'Guadalajara',
            type: 'Mudanza Residencial',
            weight: '2,500 kg',
            vehicle: 'Camión 3.5 toneladas',
            driver: 'Miguel Hernández',
            price: '$12,500 MXN',
            timeline: [
                { status: 'Enviado', date: '2024-03-20 08:00' },
                { status: 'En camino', date: '2024-03-20 10:30' },
                { status: 'Entregado', date: '2024-03-20 16:45' }
            ]
        },
        '789012': {
            status: 'in_transit',
            origin: 'Monterrey',
            destination: 'Puebla',
            type: 'Flete Comercial',
            weight: '1,800 kg',
            vehicle: 'Camión 5 toneladas',
            driver: 'Carlos Mendoza',
            price: '$8,750 MXN',
            timeline: [
                { status: 'Enviado', date: '2024-03-21 09:15' },
                { status: 'En camino', date: '2024-03-21 11:00' }
            ]
        },
        '345678': {
            status: 'pending',
            origin: 'Tijuana',
            destination: 'Mérida',
            type: 'Mudanza Empresarial',
            weight: '4,200 kg',
            vehicle: 'Camión 10 toneladas',
            driver: 'Roberto Sánchez',
            price: '$28,900 MXN',
            timeline: [
                { status: 'Enviado', date: '2024-03-21 14:30' }
            ]
        }
    };

    document.getElementById('trackingForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const trackingNumber = document.getElementById('trackingNumber').value;
        const trackingResult = document.getElementById('trackingResult');
        const shipmentDetails = document.getElementById('shipmentDetails');
        
        if (shipments[trackingNumber]) {
            const shipment = shipments[trackingNumber];
            
            // Show tracking result
            trackingResult.innerHTML = `
                <div class="tracking-info">
                    <h2>Información del Envío</h2>
                    <div class="shipment-grid">
                        <div class="info-item">
                            <span class="label">Origen:</span>
                            <span class="value">${shipment.origin}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Destino:</span>
                            <span class="value">${shipment.destination}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Tipo de Servicio:</span>
                            <span class="value">${shipment.type}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Peso:</span>
                            <span class="value">${shipment.weight}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Vehículo:</span>
                            <span class="value">${shipment.vehicle}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Conductor:</span>
                            <span class="value">${shipment.driver}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Precio:</span>
                            <span class="value">${shipment.price}</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Show status bar
            const statusBar = document.getElementById('statusBar');
            statusBar.style.display = 'flex';
            statusBar.innerHTML = `
                <div class="status-timeline">
                    ${shipment.timeline.map((step, index) => `
                        <div class="timeline-step ${index === shipment.timeline.length - 1 ? 'current' : 'completed'}">
                            <div class="step-icon">
                                <i class="fas ${getStatusIcon(step.status)}"></i>
                            </div>
                            <div class="step-content">
                                <div class="step-title">${step.status}</div>
                                <div class="step-date">${formatDate(step.date)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Add animation class
            setTimeout(() => {
                document.querySelector('.truck-animation').classList.add('moving');
            }, 100);
            
        } else {
            trackingResult.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Número de guía no encontrado. Por favor, verifique e intente nuevamente.
                </div>
            `;
            statusBar.style.display = 'none';
        }
    });
    
    function getStatusIcon(status) {
        switch(status) {
            case 'Enviado': return 'fa-box';
            case 'En camino': return 'fa-truck-moving';
            case 'Entregado': return 'fa-check-circle';
            default: return 'fa-circle';
        }
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
});
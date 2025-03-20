document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    

    const fechaInput = document.getElementById('fecha');
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
    

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            origen: document.getElementById('origen').value,
            destino: document.getElementById('destino').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value
        };
        
    
        if (formData.fecha < today) {
            alert('Por favor selecciona una fecha válida');
            return;
        }
        

        console.log('Datos del formulario:', formData);
        
     
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10B981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        successMessage.textContent = '¡Búsqueda enviada correctamente!';
        
        document.body.appendChild(successMessage);
        
     
        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        }, 3000);
        
 
        searchForm.reset();
    });
    
 
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
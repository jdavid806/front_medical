       // Current Date and Time
       function updateDateTime() {
        const now = new Date();
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        
        document.getElementById('currentDate').textContent = now.toLocaleDateString('es-ES', dateOptions);
        document.getElementById('currentTime').textContent = now.toLocaleTimeString('es-ES', timeOptions);
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Order Timer
    function updateOrderTimer() {
        const timerEl = document.getElementById('orderTimer');
        const timeParts = timerEl.textContent.split(':');
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);
        let seconds = parseInt(timeParts[2]);
        
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        
        timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    setInterval(updateOrderTimer, 1000);
    
    // Search Orders
    const searchOrder = document.getElementById('searchOrder');
    searchOrder.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const orderItems = document.querySelectorAll('.order-item');
        
        orderItems.forEach(item => {
            const orderNumber = item.querySelector('h6').textContent.toLowerCase();
            const customerName = item.querySelector('.text-muted').textContent.toLowerCase();
            
            if (orderNumber.includes(searchTerm) || customerName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        item.addEventListener('click', function() {
            orderItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const verifyButton = document.getElementById('verifyButton');
    const barcodeInput = document.getElementById('barcodeInput');
    const verificationStatus = document.getElementById('verificationStatus');
    
    verifyButton.addEventListener('click', function() {
        const barcode = barcodeInput.value.trim();
        
        if (barcode) {
            verificationStatus.innerHTML = `
                <i class="fas fa-check-circle text-success fs-3 mb-2"></i>
                <div class="fw-medium">Medicamento verificado correctamente</div>
                <div class="text-muted small">Código: ${barcode}</div>
            `;
            verificationStatus.classList.add('verification-success');
            verificationStatus.classList.remove('verification-error');
            
            // Enable complete button
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('verificationModal'));
                modal.hide();
                
                // Update the medication status in the table
                const medicationItems = document.querySelectorAll('.medication-item');
                medicationItems[2].classList.add('verified');
                medicationItems[2].querySelector('.badge').className = 'badge bg-success';
                medicationItems[2].querySelector('.badge').textContent = 'Verificado';
                medicationItems[2].querySelector('.btn').innerHTML = '<i class="fas fa-redo"></i>';
                medicationItems[2].querySelector('.btn').className = 'btn btn-sm btn-outline-primary';
                
                // Update the alert in the delivery modal
                const deliveryAlert = document.querySelector('#deliveryModal .alert');
                deliveryAlert.className = 'alert alert-success mb-4';
                deliveryAlert.innerHTML = `
                    <div class="d-flex">
                        <i class="fas fa-check-circle me-2 mt-1"></i>
                        <div>
                            <div class="fw-bold">Todos los medicamentos verificados</div>
                            <div>Puede proceder con la entrega del pedido.</div>
                        </div>
                    </div>
                `;
            }, 1500);
        } else {
            verificationStatus.innerHTML = `
                <i class="fas fa-exclamation-circle text-danger fs-3 mb-2"></i>
                <div class="fw-medium">Error de verificación</div>
                <div class="text-muted small">Por favor ingrese un código de barras válido</div>
            `;
            verificationStatus.classList.add('verification-error');
            verificationStatus.classList.remove('verification-success');
        }
    });
    
    // Signature Pad
    let signaturePad;
    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.getElementById('signaturePad');
        signaturePad = new SignaturePad(canvas);
    });
    
    const clearSignature = document.getElementById('clearSignature');
    clearSignature.addEventListener('click', function() {
        signaturePad.clear();
    });
    
    // Complete Delivery
    const completeDeliveryBtn = document.getElementById('completeDeliveryBtn');
    completeDeliveryBtn.addEventListener('click', function() {
        const idCheck = document.getElementById('idCheck');
        const ageCheck = document.getElementById('ageCheck');
        const confirmCheck = document.getElementById('confirmCheck');
        
        if (idCheck.checked && ageCheck.checked && confirmCheck.checked && !signaturePad.isEmpty()) {
            // Simulate delivery completion
            const modal = bootstrap.Modal.getInstance(document.getElementById('deliveryModal'));
            modal.hide();
            
            // Show success message
            alert('Pedido #12346 entregado correctamente.');
            
            // Remove the order from the list
            const activeOrder = document.querySelector('.order-item.active');
            activeOrder.remove();
            
            // Select the next order
            const nextOrder = document.querySelector('.order-item');
            if (nextOrder) {
                nextOrder.classList.add('active');
            }
        } else {
            alert('Por favor complete todos los campos requeridos y asegúrese de que el cliente haya firmado.');
        }
    });
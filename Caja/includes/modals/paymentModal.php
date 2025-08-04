<div class="payment-modal" id="paymentModal">
        <div class="payment-content">
            <h4 class="mb-4">Procesar Pago</h4>

            <div class="mb-4">
                <div class="d-flex justify-content-between mb-3">
                    <span class="text-muted">Total a pagar:</span>
                    <span class="fw-bold text-success" id="modalTotal">$0.00</span>
                </div>

                <div class="mb-3">
                    <label class="form-label">Cliente</label>
                    <select class="form-select" id="patient-select" style="width: 100%">
                        <option value="">Seleccione</option>
                    </select>
                </div>


                <div>
                    <label class="form-label">Método de Pago</label>
                    <div class="row g-2" id="payment-methods-container">
                        <!-- Aquí se insertarán dinámicamente los métodos de pago -->
                    </div>
                </div>

            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary flex-grow-1" id="cancelPaymentBtn">Cancelar</button>
                <button class="btn btn-success flex-grow-1" id="confirmPaymentBtn">Confirmar Pago</button>
            </div>
        </div>
    </div>
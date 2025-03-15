<div class="modal fade modal-xl" id="modalNuevaVacuna" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nueva Vacuna</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
                <!-- Indicadores de progreso -->
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Información General</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Detalles de la Vacuna</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Lote y Proveedor</span>
                        </li>
                    </ul>
                </div>

                <form id="formNuevaVacuna" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <!-- Paso 1: Información General -->
                        <div class="wizard-step active" data-step="1">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="name" name="name" required>
                                        <label for="name">Nombre de la vacuna</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="manufacturer" name="manufacturer" required>
                                        <label for="manufacturer">Fabricante</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="vaccine_type" name="vaccine_type" required>
                                        <label for="vaccine_type">Tipo de vacuna</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="storage_temperature" name="storage_temperature" required>
                                        <label for="storage_temperature">Temperatura de almacenamiento</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Paso 2: Detalles de la Vacuna -->
                        <div class="wizard-step" data-step="2">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="date" class="form-control" id="expiration_date" name="expiration_date" required>
                                        <label for="expiration_date">Fecha de caducidad</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="doses" name="doses" required>
                                        <label for="doses">Dosis recomendadas</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="application_method" name="application_method" required>
                                        <label for="application_method">Método de aplicación</label>
                                    </div>
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="mandatory" name="mandatory">
                                        <label class="form-check-label" for="mandatory">Vacuna obligatoria</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Paso 3: Lote y Proveedor -->
                        <div class="wizard-step" data-step="3">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="batch_number" name="batch_number" required>
                                        <label for="batch_number">Número de lote</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="number" class="form-control" id="stock" name="stock" required>
                                        <label for="stock">Cantidad en stock</label>
                                    </div>
                                    <div class="col-12 mt-3">
                                        <label class="form-label" for="cantidadStock">Cantidad minima en stock</label>
                                        <input class="form-check-input" id="cantidadStock" type="checkbox" />
                                    </div>

                                    <div class="input-group mt-3" id="divInputStock" style="display: none;">
                                        <div class="form-floating" style="width: 100%">
                                            <input type="number" class="form-control" min="0" id="stockMinimoVacuna"
                                                name="stockMinimoVacuna" placeholder="Ingrese la cantidad minima que desea manejar en stock">
                                            <label for="stockMinimoVacuna" class="form-label">Ingrese la cantidad minima que desea manejar en stock</label>
                                            <div class="invalid-feedback">Por favor ingrese la cantidad minima de stock.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="number" class="form-control" id="supplier_id" name="supplier_id" required>
                                        <label for="supplier_id">Proveedor</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="number" class="form-control" id="purchase_price" name="purchase_price" required>
                                        <label for="purchase_price">Precio de compra</label>
                                    </div>
                                    <div class="form-floating mb-6">
                                        <input type="number" class="form-control" id="sale_price" name="sale_price" required>
                                        <label for="sale_price">Precio de venta</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStepVac" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStepVac" type="button">Siguiente</button>
                <button class="btn btn-primary d-none" id="finishStepVac" type="submit">Finalizar</button>
            </div>
        </div>
    </div>
</div>



<script>
    let currentStepVac = 1;

    const updateWizardVac = () => {
        // Actualizar los pasos visuales
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStepVac);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStepVac);
        });

        // Controlar los botones
        document.getElementById('prevStepVac').disabled = currentStepVac === 1;
        document.getElementById('nextStepVac').classList.toggle('d-none', currentStepVac === 3);
        document.getElementById('finishStepVac').classList.toggle('d-none', currentStepVac !== 3);
    };

    document.getElementById('nextStepVac').addEventListener('click', () => {
        const currentForm = document.querySelector(`.wizard-step[data-step="${currentStepVac}"]`);
        if (currentForm.querySelector(':invalid')) {
            currentForm.querySelector(':invalid').focus();
            currentForm.classList.add('was-validated');
        } else {
            currentStepVac++;
            updateWizardVac();
        }
    });

    document.getElementById('prevStepVac').addEventListener('click', () => {
        currentStepVac--;
        updateWizardVac();
    });


    updateWizardVac();

    function controlarVistaStock() {
        const checkStock = document.getElementById('cantidadStock');
        const estadoCheckStock = document.getElementById('cantidadStock').checked;
        const divInputStock = document.getElementById('divInputStock');

        divInputStock.style.display = estadoCheckStock ? 'block' : 'none';
        if (divInputStock.style.display === "block") {
            const inputStock = document.getElementById('stockMedicamento');
            inputStock.required = true;
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        controlarVistaStock();
        document.getElementById('cantidadStock').addEventListener('change', controlarVistaStock);
    });
</script>

<script type="module" src="../Inventario/js/inventarioVacunas.js"></script>
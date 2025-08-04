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
                                        <label for="reference">Referencia</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="storage_temperature" name="storage_temperature" required>
                                        <label for="sanitary_registration">Registro Sanitario</label>
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
                                        <label for="capacity">Capacidad</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="application_method" name="application_method" required>
                                        <label for="weight">Peso</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="concentration" name="concentration" required>
                                        <label for="weight">Conectración</label>
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
                                        <input type="number" class="form-control" id="stock_alert" name="stock_alert" required>
                                        <label for="supplier_id">Alerta de Stock</label>
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

document.getElementById('finishStepVac').addEventListener('click', function () {
    const form = document.getElementById('formNuevaVacuna');
    if (form.checkValidity()) {
        enviarVacuna(); // Ejecuta la función para enviar los datos
    } else {
        form.classList.add('was-validated'); // Activa estilos de validación
    }
});

    // Obtener datos del formulario
    const obtenerDatosVacuna = () => {
        return {
            name: document.getElementById('name').value,
            manufacturer: document.getElementById('manufacturer').value,
            vaccine_type: document.getElementById('vaccine_type').value,
            storage_temperature: document.getElementById('storage_temperature').value,
            expiration_date: document.getElementById('expiration_date').value,
            doses: document.getElementById('doses').value,
            application_method: document.getElementById('application_method').value,
            concentration: document.getElementById('concentration').value,
            batch_number: document.getElementById('batch_number').value,
            stock: parseInt(document.getElementById('stock').value),
            stock_minimum: document.getElementById('cantidadStock').checked
                ? parseInt(document.getElementById('stockMinimoVacuna').value)
                : null,
            stock_alert: parseInt(document.getElementById('stock_alert').value),
            purchase_price: parseFloat(document.getElementById('purchase_price').value),
            sale_price: parseFloat(document.getElementById('sale_price').value)
        };
    };

    // Enviar datos al servidor
    const enviarVacuna = async () => {
        console.log("Ejecutando función enviarVacuna");
        const data = obtenerDatosVacuna();

        try {
            const response = await fetch('https://dev.monaros.co/api/v1/admin/products/vacunas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer TU_TOKEN' // Descomenta y coloca tu token si es necesario
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al enviar la vacuna:', errorData);
                alert("Hubo un error al guardar la vacuna.");
            } else {
                const result = await response.json();
                console.log('Vacuna registrada con éxito:', result);
                alert("Vacuna registrada con éxito.");
                // Aquí podrías cerrar el modal, limpiar el formulario, etc.
                document.getElementById('formNuevaVacuna').reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaVacuna'));
                modal.hide();
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            alert("Error de conexión al guardar la vacuna.");
        }
    };

    // Manejar evento submit del formulario
    document.getElementById('formNuevaVacuna').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevenir el comportamiento por defecto
        enviarVacuna();     // Ejecutar envío
    });
</script>


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

    // function controlarVistaStock() {
    //     const checkStock = document.getElementById('cantidadStock');
    //     const estadoCheckStock = document.getElementById('cantidadStock').checked;
    //     const divInputStock = document.getElementById('divInputStock');

    //     divInputStock.style.display = estadoCheckStock ? 'block' : 'none';
    //     if (divInputStock.style.display === "block") {
    //         const inputStock = document.getElementById('stockMedicamento');
    //         inputStock.required = true;
    //     }
    // }

    // document.addEventListener("DOMContentLoaded", function() {
    //     controlarVistaStock();
    //     document.getElementById('cantidadStock').addEventListener('change', controlarVistaStock);
    // });
</script>

<script type="module" src="../Inventario/js/inventarioVacunas.js"></script>
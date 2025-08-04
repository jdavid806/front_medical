<div class="modal fade modal-xl" id="modalNuevoInsumo" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Insumo</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <!-- Indicadores de progreso -->
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Datos Generales</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Información precio</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevoInsumo" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">
                                <div class="col-12">

                                    <div class="input-group">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="nombreMedicamento" required
                                                name="nombreMedicamento">
                                            <label for="nombreMedicamento" class="form-label">Nombre del
                                                Medicamento</label>
                                            <div class="invalid-feedback">Por favor ingrese el nombre del medicamento.
                                            </div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <select class="form-select" name="tipoMedicamento" id="tipoMedicamento"
                                                required>
                                                <option value="" disabled selected>Presentación del medicamento</option>
                                                <option value="tableta">Tableta</option>
                                                <option value="jarabe">Jarabe</option>
                                                <option value="inyeccion">Inyección</option>
                                            </select>
                                            <label for="tipoMedicamento" class="form-label">Presentación</label>
                                            <div class="invalid-feedback">Por favor seleccione la Presentación.</div>
                                        </div>
                                    </div>

                                    <div class="mt-1">
                                        <label for="" class="form-label">Concentración</label>
                                    </div>


                                    <div class="row">
                                        <div class="col">
                                            <div class="input-group">
                                                <div class="form-floating">
                                                    <input type="number" class="form-control" min="0" id="volumenConcentracion"
                                                        required name="volumenConcentracion">
                                                    <label for="volumenConcentracion" class="form-label">Volumen</label>
                                                    <div class="invalid-feedback">Por favor ingrese la via de administración.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col">
                                            <div class="input-group">
                                                <div class="form-floating">
                                                    <select class="form-select" name="unidadConcentracion" id="unidadConcentracion"
                                                        required>
                                                        <option value="" disabled selected>Seleccione</option>
                                                        <option value="ml">ml</option>
                                                        <option value="mg">mg</option>
                                                        <option value="ui">UI</option>
                                                    </select>
                                                    <label for="unidadConcentracion" class="form-label">Unidad</label>
                                                    <div class="invalid-feedback">Por favor seleccione la Concentración.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" min="0" id="viaAdministracion"
                                                required name="viaAdministracion">
                                            <label for="viaAdministracion" class="form-label">Via de administración</label>
                                            <div class="invalid-feedback">Por favor ingrese la via de administración.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" min="0" id="laboratorio"
                                                required name="laboratorio">
                                            <label for="laboratorio" class="form-label">Laboratorio</label>
                                            <div class="invalid-feedback">Por favor ingrese el laboratorio.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="number" class="form-control" min="0" id="stockMedicamento"
                                                name="stockMedicamento">
                                            <label for="stockMedicamento" class="form-label">Cantidad en Stock</label>
                                            <div class="invalid-feedback">Por favor ingrese la cantidad en stock.</div>
                                        </div>
                                    </div>

                                    <div class="col-12 mt-3">
                                        <label class="form-label" for="cantidadStock">Cantidad minima en stock</label>
                                        <input class="form-check-input" id="cantidadStock" type="checkbox" />
                                    </div>

                                    <div class="input-group mt-3" id="divInputStock" style="display: none;">
                                        <div class="form-floating" style="width: 100%">
                                            <input type="number" class="form-control" min="0" id="stockMinimoMedicamento"
                                                name="stockMinimoMedicamento" placeholder="Ingrese la cantidad minima que desea manejar en stock">
                                            <label for="stockMinimoMedicamento" class="form-label">Ingrese la cantidad minima que desea manejar en stock</label>
                                            <div class="invalid-feedback">Por favor ingrese la cantidad minima de stock.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input class="form-control datetimepicker" id="fechaCaducidad" type="text"
                                                required="required" />
                                            <label for="fechaCaducidad" class="form-label">Fecha de Caducidad</label>
                                            <div class="invalid-feedback">Por favor seleccione una fecha válida.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input class="form-control" id="loteMedicamento" name="loteMedicamento"
                                                type="text" required />
                                            <label for="loteMedicamento" class="form-label">Número de Lote</label>
                                            <div class="invalid-feedback">Por favor ingrese el número de lote.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <textarea class="form-control" id="descripcionMedicamento"
                                                name="descripcionMedicamento" rows="3"></textarea>
                                            <label for="descripcionMedicamento" class="form-label">Descripción
                                                (Opcional)</label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="wizard-step" data-step="2">

                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="pesoMedicamento" name="pesoMedicamento"
                                        type="number" />
                                    <label for="pesoMedicamento" class="form-label">Peso del Medicamento</label>

                                </div>
                            </div>
                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="capacidadMedicamento" name="capacidadMedicamento"
                                        type="number" />
                                    <label for="capacidadMedicamento" class="form-label">Capacidad de Medicamento</label>

                                </div>
                            </div>
                            <!-- <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="concentracionMedicamento" name="concentracionMedicamento"
                                        type="number" />
                                    <label for="concentracionMedicamento" class="form-label">Concentración</label>
                                </div>
                            </div> -->

                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="precioCompraMedicamento" name="precioCompraMedicamento"
                                        type="number" />
                                    <label for="precioCompraMedicamento" class="form-label">Precio de compra</label>
                                    <div class="invalid-feedback">Ingrese el precio de compra</div>
                                </div>
                            </div>

                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="precioVentaMedicamento" name="precioVentaMedicamento"
                                        type="venta" />
                                    <label for="precioVentaMedicamento" class="form-label">Precio de venta</label>
                                    <div class="invalid-feedback">Ingrese el precio de venta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStep" type="submit"
                    form="formNuevoInsumo">Finalizar</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('formNuevoInsumo');
        const finishBtn = document.getElementById('finishStep');
        const imageInput = document.getElementById('uploadMedicamentoImage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            const formData = new FormData();
            formData.append('nombre', form.nombreMedicamento.value);
            formData.append('tipo', form.tipoMedicamento.value);
            formData.append('volumen', form.volumenConcentracion.value);
            formData.append('unidad', form.unidadConcentracion.value);
            formData.append('viaAdministracion', form.viaAdministracion.value);
            formData.append('laboratorio', form.laboratorio.value);
            formData.append('stock', form.stockMedicamento.value);
            formData.append('stockMinimo', document.getElementById('cantidadStock').checked ? form.stockMinimoMedicamento.value : 0);
            formData.append('fechaCaducidad', form.fechaCaducidad.value);
            formData.append('lote', form.loteMedicamento.value);
            formData.append('descripcion', form.descripcionMedicamento.value);
            formData.append('peso', form.pesoMedicamento.value);
            formData.append('capacidad', form.capacidadMedicamento.value);
            formData.append('precioCompra', form.precioCompraMedicamento.value);
            formData.append('precioVenta', form.precioVentaMedicamento.value);

            // Si hay imagen seleccionada
            if (imageInput.files.length > 0) {
                formData.append('imagen', imageInput.files[0]);
            }

            try {
                const response = await fetch('https://dev.monaros.co/api/v1/admin/products/insumos', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    console.error('Error al guardar:', error);
                    alert('Error al registrar el medicamento.');
                } else {
                    alert('Medicamento registrado exitosamente.');
                    form.reset();
                    document.getElementById('divInputStock').style.display = 'none';
                    form.classList.remove('was-validated');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoInsumo'));
                    modal.hide();
                    // puedes recargar la lista si es necesario
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert('Ocurrió un error inesperado.');
            }
        });

        // Mostrar/ocultar campo de stock mínimo
        document.getElementById('cantidadStock').addEventListener('change', function() {
            const stockDiv = document.getElementById('divInputStock');
            stockDiv.style.display = this.checked ? 'block' : 'none';
        });
    });
</script>



<style>
    .profile-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ddd;
    }

    video {
        display: none;
        width: 100%;
        max-width: 300px;
        border-radius: 10px;
        border: 2px solid #ddd;
    }

    .steps-container {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .steps {
        list-style: none;
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
    }

    .step {
        text-align: center;
        position: relative;
        flex: 1;
    }

    .step-number {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        background-color: #e9ecef;
        color: #0d6efd;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .step.active .step-number {
        background-color: #0d6efd;
        color: #fff;
    }

    .wizard-step {
        display: none;
    }

    .wizard-step.active {
        display: block;
    }
</style>

<script type="module" src="../Inventario/js/inventarioMedicamentos.js"></script>

<script>
    let currentStep = 1;

    const updateWizard = () => {
        // Actualizar los pasos visuales
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Controlar los botones
        document.getElementById('prevStep').disabled = currentStep === 1;
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === 2);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 2);
    };

    document.getElementById('nextStep').addEventListener('click', () => {
        const currentForm = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        if (currentForm.querySelector(':invalid')) {
            currentForm.querySelector(':invalid').focus();
            currentForm.classList.add('was-validated');
        } else {
            currentStep++;
            updateWizard();
        }
    });

    document.getElementById('prevStep').addEventListener('click', () => {
        currentStep--;
        updateWizard();
    });

    updateWizard();

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
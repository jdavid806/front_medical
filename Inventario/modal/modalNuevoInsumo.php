<div class="modal fade modal-xl" id="modalNuevoInsumo" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo insumo</h5>
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
                            <span class="step-label">Información insumo</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Información precio</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevoInsumo" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">
                                <div class="col-8 col-sm-6">

                                    <div class="input-group">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="name" required name="name">
                                            <label for="name" class="form-label">Nombre del insumo</label>
                                            <div class="invalid-feedback">Por favor ingrese el nombre del insumo</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3" style="display: none;">
                                        <div class="form-floating">
                                            <select class="form-select" name="tipoProducto" id="tipoProducto" required>
                                                <option value="" disabled selected>Seleccione el tipo del producto</option>
                                                <option value="producto">producto</option>
                                                <option value="servicio">servicio</option>
                                                <option value="insumo" selected>insumo</option>
                                            </select>
                                            <label for="tipoProducto" class="form-label">Tipo de producto</label>
                                            <div class="invalid-feedback">Por favor seleccione un tipo de producto.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="number" class="form-control" min="0" id="stockInsumo" required name="stockInsumo">
                                            <label for="stockInsumo" class="form-label">Cantidad en Stock</label>
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
                                            <input class="form-control datetimepicker" id="fechaCaducidad" type="text" required="required" />
                                            <label for="fechaCaducidad" class="form-label">Fecha de Caducidad</label>
                                            <div class="invalid-feedback">Por favor seleccione una fecha válida.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input class="form-control" id="loteInsumo" name="loteInsumo" type="text" required />
                                            <label for="loteInsumo" class="form-label">Número de Lote</label>
                                            <div class="invalid-feedback">Por favor ingrese el número de lote.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <textarea class="form-control" id="descripcionInsumo" name="descripcionInsumo" rows="3"></textarea>
                                            <label for="descripcionInsumo" class="form-label">Descripción (Opcional)</label>
                                        </div>
                                    </div>

                                </div>

                                <div class="col-4 col-sm-6">

                                    <div class="row justify-content-center">
                                        <div class="col-md-6 text-center">
                                            <h2>Imagen de Insumo</h2>
                                            <!-- Imagen de previsualización -->
                                            <div class="mt-3 d-flex justify-content-center">
                                                <img id="insumoPreview" src="https://via.placeholder.com/150" alt="Previsualización" class="profile-img">
                                            </div>
                                            <!-- Botones de acción -->
                                            <div class="mt-4">
                                                <label for="uploadInsumoImage" class="btn btn-primary">
                                                    <i class="fa-solid fa-upload me-1"></i> Subir Imagen
                                                </label>
                                                <!-- Input oculto para subir imagen -->
                                                <input type="file" id="uploadInsumoImage" class="d-none" accept="image/*">
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>


                        <div class="wizard-step" data-step="2">

                            <div class="mb-2">
                                <label class="form-check-label" for="esCodificado">¿Incluye código de barras?</label>
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" id="esCodificado"
                                        onchange="setupToggleSwitch('esCodificado', ['codigoBarras']);" type="checkbox" />
                                </div>

                                <div id="codigoBarras" class="d-none mb-2">
                                    <div class="mb-2 form-floating">
                                        <input class="form-control" id="codigoBarrasInput" name="codigoBarras" type="text" />
                                        <label for="codigoBarrasInput" class="form-label">Código de barras</label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-2">
                                <label class="form-check-label" for="tieneEtiqueta">¿Incluye etiqueta RFID?</label>
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" id="tieneEtiqueta"
                                        onchange="setupToggleSwitch('tieneEtiqueta', ['etiquetaRfid']);" type="checkbox" />
                                </div>

                                <div id="etiquetaRfid" class="d-none mb-2">
                                    <div class="mb-2 form-floating">
                                        <input class="form-control" id="rfidInput" name="etiquetaRfid" type="text" />
                                        <label for="rfidInput" class="form-label">Etiqueta RFID</label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-2">
                                <label class="form-check-label" for="tieneQr">¿Incluye código QR?</label>
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" id="tieneQr"
                                        onchange="setupToggleSwitch('tieneQr', ['codigoQr']);" type="checkbox" />
                                </div>

                                <div id="codigoQr" class="d-none mb-2">
                                    <div class="mb-2 form-floating">
                                        <input type="file" class="form-control" id="qrInput" name="codigoQr" accept="image/*"></input>
                                        <label for="qrInput" class="form-label">Código QR</label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-2">
                                <label class="form-check-label" for="otrosIdentificadoresCheck">¿Otros identificadores?</label>
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" id="otrosIdentificadoresCheck"
                                        onchange="setupToggleSwitch('otrosIdentificadoresCheck', ['otrosIdentificadores']);" type="checkbox" />
                                </div>

                                <div id="otrosIdentificadores" class="d-none">
                                    <div class="form-floating">
                                        <textarea class="form-control" id="otrosIdentificadoresInput" name="otrosIdentificadores"
                                            style="height: 100px"></textarea>
                                        <label for="otrosIdentificadoresInput">Descripción de identificadores adicionales</label>
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div class="wizard-step" data-step="3">

                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="precioCompraInsumo" name="precioCompraInsumo" type="number" />
                                    <label for="precioCompraInsumo" class="form-label">Precio de compra</label>
                                    <div class="invalid-feedback">Ingrese el precio de compra</div>
                                </div>
                            </div>

                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="precioVentaInsumo" name="precioVentaInsumo" type="venta" />
                                    <label for="precioVentaInsumo" class="form-label">Precio de venta</label>
                                    <div class="invalid-feedback">Ingrese el precio de venta</div>
                                </div>
                            </div>

                            <div class="mb-2 form-floating mt-3">
                                <select class="form-select" id="sucursalInsumo" name="sucursalInsumo">
                                    <option selected disabled value="">Seleccione</option>
                                    <option value="Bogotá">Bogotá</option>
                                    <option value="Medellín">Medellín</option>
                                    <option value="Cali">Cali</option>
                                    <option value="Barranquilla">Barranquilla</option>
                                    <option value="Cartagena">Cartagena</option>
                                </select>
                                <label for="sucursalInsumo" class="form-label">Sucursal</label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStepIns" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStepIns" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStepIns" type="submit" form="wizardForm">Finalizar</button>
            </div>
        </div>
    </div>
</div>

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

<script type="module" src="./Inventario/js/inventarioGeneral.js"></script>

<script>
    let currentStepIns = 1;

    const updateWizardIns = () => {
        // Actualizar los pasos visuales
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStepIns);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStepIns);
        });

        // Controlar los botones
        document.getElementById('prevStepIns').disabled = currentStepIns === 1;
        document.getElementById('nextStepIns').classList.toggle('d-none', currentStepIns === 3);
        document.getElementById('finishStepIns').classList.toggle('d-none', currentStepIns !== 3);
    };

    document.getElementById('nextStepIns').addEventListener('click', () => {
        const currentForm = document.querySelector(`.wizard-step[data-step="${currentStepIns}"]`);
        if (currentForm.querySelector(':invalid')) {
            currentForm.querySelector(':invalid').focus();
            currentForm.classList.add('was-validated');
        } else {
            currentStepIns++;
            updateWizardIns();
        }
    });

    document.getElementById('prevStepIns').addEventListener('click', () => {
        currentStepIns--;
        updateWizardIns();
    });

    // document.getElementById('modalGrupoVacuna').addEventListener('submit', function(event) {
    //     if (!this.checkValidity()) {
    //         event.preventDefault();
    //         this.classList.add('was-validated');
    //     }
    // });

    updateWizardIns();

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
<script>
    const profilePreview = document.getElementById('profilePreview');
    const uploadImage = document.getElementById('uploadImage');
    const takePhoto = document.getElementById('takePhoto');
    const capturePhoto = document.getElementById('capturePhoto');
    const camera = document.getElementById('camera');
    let stream;

    // Manejar carga de imagen
    uploadImage.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Activar la cámara
    takePhoto.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            camera.srcObject = stream;
            camera.style.display = "block";
            takePhoto.classList.add("d-none");
            capturePhoto.classList.remove("d-none");
        } catch (err) {
            alert('No se pudo acceder a la cámara: ' + err.message);
        }
    });

    // Capturar foto
    capturePhoto.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = camera.videoWidth;
        canvas.height = camera.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);

        // Mostrar la foto capturada
        profilePreview.src = canvas.toDataURL('image/png');

        // Detener la cámara
        stream.getTracks().forEach(track => track.stop());
        camera.style.display = "none";
        capturePhoto.classList.add("d-none");
        takePhoto.classList.remove("d-none");
    });
</script>
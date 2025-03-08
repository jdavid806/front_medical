<div class="modal fade modal-xl" id="modalVacuna" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nueva Vacuna</h5>
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
                            <span class="step-label">Información Vacuna</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Información precio</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevoPaciente" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">
                                <div class="col-8 col-sm-6">

                                    <div class="input-group">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="nombreVacuna" required name="nombreVacuna">
                                            <label for="nombreVacuna" class="form-label">Nombre de la Vacuna</label>
                                            <div class="invalid-feedback">Por favor ingrese el nombre de la vacuna.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <select class="form-select" name="tipoVacuna" id="tipoVacuna" required>
                                                <option value="" disabled selected>Seleccione el tipo de vacuna</option>
                                                <option value="inactivada">Inactivada</option>
                                                <option value="arnm">ARNm</option>
                                                <option value="combinada">Combinada</option>
                                                <option value="oral">Oral</option>
                                                <option value="vector_viral">Vector Viral</option>
                                            </select>
                                            <label for="tipoVacuna" class="form-label">Tipo de Vacuna</label>
                                            <div class="invalid-feedback">Por favor seleccione un tipo de vacuna.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="number" class="form-control" min="0" id="stockVacuna" required name="stockVacuna">
                                            <label for="stockVacuna" class="form-label">Cantidad en Stock</label>
                                            <div class="invalid-feedback">Por favor ingrese la cantidad en stock.</div>
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
                                            <input class="form-control" id="loteVacuna" name="loteVacuna" type="text" required />
                                            <label for="loteVacuna" class="form-label">Número de Lote</label>
                                            <div class="invalid-feedback">Por favor ingrese el número de lote.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <textarea class="form-control" id="descripcionVacuna" name="descripcionVacuna" rows="3"></textarea>
                                            <label for="descripcionVacuna" class="form-label">Descripción (Opcional)</label>
                                        </div>
                                    </div>

                                </div>

                                <div class="col-4 col-sm-6">

                                    <div class="row justify-content-center">
                                        <div class="col-md-6 text-center">
                                            <h2>Imagen de Vacuna</h2>
                                            <!-- Imagen de previsualización -->
                                            <div class="mt-3">
                                                <img id="vacunaPreview" src="https://via.placeholder.com/150" alt="Previsualización" class="profile-img">
                                            </div>
                                            <!-- Botones de acción -->
                                            <div class="mt-4">
                                                <label for="uploadVacunaImage" class="btn btn-primary me-2">
                                                    <i class="fa-solid fa-upload me-1"></i> Subir Imagen
                                                </label>
                                                <!-- Input oculto para subir imagen -->
                                                <input type="file" id="uploadVacunaImage" class="d-none" accept="image/*">
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
                                        <textarea class="form-control" id="qrInput" name="codigoQr" style="height: 100px"></textarea>
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
                                    <input class="form-control" id="precioCompraVacuna" name="precioCompraVacuna" type="number" />
                                    <label for="precioCompraVacuna" class="form-label">Precio de combra</label>
                                    <div class="invalid-feedback">Ingrese el precio de compra</div>
                                </div>
                            </div>

                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="precioVentaVacuna" name="precioVentaVacuna" type="venta" />
                                    <label for="precioVentaVacuna" class="form-label">Precio de venta</label>
                                    <div class="invalid-feedback">Ingrese el precio de venta</div>
                                </div>
                            </div>

                            <div class="mb-2 form-floating">
                                <select class="form-select" id="sucursalVacuna" name="sucursalVacuna">
                                    <option selected disabled value="">Seleccione</option>
                                    <option value="Bogotá">Bogotá</option>
                                    <option value="Medellín">Medellín</option>
                                    <option value="Cali">Cali</option>
                                    <option value="Barranquilla">Barranquilla</option>
                                    <option value="Cartagena">Cartagena</option>
                                </select>
                                <label for="sucursalVacuna" class="form-label">Sucursal</label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStep" type="submit" form="wizardForm">Finalizar</button>
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
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === 3);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 3);
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

    // document.getElementById('modalGrupoVacuna').addEventListener('submit', function(event) {
    //     if (!this.checkValidity()) {
    //         event.preventDefault();
    //         this.classList.add('was-validated');
    //     }
    // });

    updateWizard();
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
<div class="modal fade modal-xl" id="modalNuevoMedicamento" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Medicamento</h5>
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
                <form id="formNuevoMedicamento" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">
                                <div class="col-8 col-sm-6">

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

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="number" class="form-control" min="0" id="stockMedicamento"
                                                required name="stockMedicamento">
                                            <label for="stockMedicamento" class="form-label">Cantidad en Stock</label>
                                            <div class="invalid-feedback">Por favor ingrese la cantidad en stock.</div>
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

                                <div class="col-4 col-sm-6">
                                    <div class="row justify-content-center">
                                        <div class="col-md-6 text-center">
                                            <h2>Imagen del Medicamento</h2>
                                            <div class="mt-3">
                                                <img id="medicamentoPreview" src="https://via.placeholder.com/150"
                                                    alt="Previsualización" class="profile-img">
                                            </div>
                                            <div class="mt-4">
                                                <label for="uploadMedicamentoImage" class="btn btn-primary me-2">
                                                    <i class="fa-solid fa-upload me-1"></i> Subir Imagen
                                                </label>
                                                <input type="file" id="uploadMedicamentoImage" class="d-none"
                                                    accept="image/*">
                                            </div>
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
                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input class="form-control" id="concentracionMedicamento" name="concentracionMedicamento"
                                        type="number" />
                                    <label for="concentracionMedicamento" class="form-label">Concentración</label>                                    
                                </div>
                            </div>

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
                    form="formNuevoMedicamento">Finalizar</button>
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
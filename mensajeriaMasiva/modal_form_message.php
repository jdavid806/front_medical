<style>
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

    .filters-container {
        border: 1px solid #ddd;
        padding: 10px;
        width: 300px;
        border-radius: 5px;
    }

    .filters-options {
        display: none;
        margin-top: 10px;
    }

    .previewMessage {
        font-family: sans-serif !important;
        margin: 10px 0 0 5px;
    }

    .previewContainerEmail {
        max-width: 600px;
        margin: auto;
    }

    .emailPreview {
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .emailPreview h3 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #333;
    }

    .emailPreview .field {
        margin-bottom: 15px;
    }

    .emailPreview .field strong {
        display: inline-block;
        min-width: 50px;
        color: #555;
    }

    .emailPreview .emailBody {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 15px;
        white-space: pre-wrap;
        margin-top: 10px;
    }

    .emailPreview .attachments {
        margin-top: 15px;
    }

    .emailPreview .attachments ul {
        list-style-type: none;
        padding: 0;
    }

    .emailPreview .attachments li {
        background-color: #f1f1f1;
        padding: 8px 10px;
        margin-bottom: 5px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .emailPreview .attachments li img {
        max-width: 50px;
        max-height: 50px;
        border-radius: 5px;
    }
</style>
<div class="modal fade" id="newMessage" tabindex="-1" aria-labelledby="newMessageLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo mensaje</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Segmentación</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Formato de envio</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Vista previa</span>
                        </li>
                    </ul>
                </div>

                <form id="formNuevoMensaje" class="needs-validation" novalidate>
                    <div class="wizard-content">
                        <!-- Paso 1: segmentación -->
                        <div class="wizard-step active" data-step="1">
                            <div class="mb-2">
                                <label class="col-form-label pt-0">Filtro [A-Z]</label>
                                <select class="form-select" name="filterGroups" id="filterGroups">
                                    <option value="" disabled selected>Seleccione un filtrio</option>
                                    <option value="group1">De la A a la I grupo 1</option>
                                    <option value="group2">De la J a la M grupo 2</option>
                                    <option value="group3">De la N a la Z grupo 3</option>
                                </select>
                            </div>
                            <div class="mb-2">
                                <label class="col-form-label pt-0">Filtros personalizados</label>
                                <select class="form-select" name="filterCustom" id="filterCustom">
                                    <option value="" disabled selected>Seleccione un filtro</option>
                                    <option value="1">Filtro de prueba</option>
                                    <option value="2">Filtro de test</option>
                                </select>
                            </div>
                            <div class="mb-2">
                                <div class="filters-container">
                                    <a href="#" id="toggleFilters">Configurar filtros de cliente</a>
                                    <div class="filters-options" id="filtersOptions">
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="age-range"> Rango de edades</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="gender"> Género</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="country"> País</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="last-consultation"> Fecha de última consulta</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="appointments"> Cantidad de citas</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="appointments-from-date"> Cantidad de citas desde una fecha</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="marital-status"> Estado civil</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="blood-type"> Tipo de sangre</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="donor"> ¿Es donante?</label></div>
                                        <div class="filter-item d-flex flex-column"><label><input type="checkbox" class="filter-checkbox" data-filter="health-entity"> Entidad de salud</label></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Paso 2: formato -->
                        <div class="wizard-step" data-step="2">
                            <div class="row">
                                <div class="mb-2">
                                    <label for="messageMethod">Selecciona el método de envío:</label>
                                    <select id="messageMethod" class="form-select" required onchange="toggleFields()">
                                        <option value="">Selecciona una opción</option>
                                        <option value="whatsapp">Whatsapp</option>
                                        <option value="email">Correo electrónico</option>
                                    </select>
                                </div>
                                <div class="col-6 mb-2">
                                    <label class="form-label" for="fechaCita">Fecha de envio</label>
                                    <input class="form-control datetimepicker" id="datepicker" type="text" placeholder="dd/mm/yyyy" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' required />
                                    <div class="invalid-feedback">Por favor selecciona una fecha válida.</div>
                                </div>
                                <div class="col-6 mb-2">
                                    <label class="form-label" for="consulta-hora">Hora de envio</label>
                                    <input class="form-control datetimepicker" id="timepicker1" type="text" placeholder="hour : minute" data-options='{"enableTime":true,"noCalendar":true,"dateFormat":"H:i","disableMobile":true}' required />
                                    <div class="invalid-feedback">Por favor selecciona la hora de envio del mensaje.
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <div id="whatsappFields" class="visually-hidden">
                                        <h3>Enviar por Whatsapp</h3>
                                        <label for="whatsappMessage">Mensaje:</label>
                                        <textarea class="form-control optionWhatsapp" id="whatsappMessage" rows="4" cols="50" placeholder="Escribe tu mensaje..."></textarea>

                                        <label for="whatsappFile">Adjuntar archivo:</label>
                                        <input class="form-control optionWhatsapp" type="file" id="whatsappFile">
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <div id="emailFields" class="visually-hidden">
                                        <h3>Enviar por Correo Electrónico</h3>
                                        <label for="emailTo">Para:</label>
                                        <input class="form-control optionEmail" type="email" id="emailTo" placeholder="Correo del destinatario">

                                        <label for="emailSubject">Asunto:</label>
                                        <input class="form-control optionEmail" type="text" id="emailSubject" placeholder="Asunto del correo">

                                        <label for="emailBody">Mensaje:</label>
                                        <textarea class="form-control optionEmail" id="emailBody" rows="6" cols="50" placeholder="Escribe tu correo..."></textarea>

                                        <label for="emailAttachments">Adjuntar archivos:</label>
                                        <input class="form-control optionEmail" type="file" id="emailAttachments" multiple>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!--paso:3 vista previa-->
                        <div class="wizard-step" data-step="3">

                            <div class="d-flex justify-content-center">
                                <div id="previewWhatsapp" class="card visually-hidden p-2">
                                    <div class="visually-hidden" id="previewAttachment">
                                        <img id="previewImage" class="card-img-top" src="" alt="Imagen adjunta" />
                                    </div>
                                    <div class="previewMessage" id="previewMessage"></div>
                                </div>

                                <div class="previewContainerEmail">
                                    <div id="emailPreview" class="emailPreview visually-hidden">
                                        <h3>Vista Previa del Correo</h3>

                                        <div class="field">
                                            <strong>Para:</strong> <span id="previewTo"></span>
                                        </div>

                                        <div class="field">
                                            <strong>Asunto:</strong> <span id="previewSubject"></span>
                                        </div>

                                        <div class="emailBody" id="previewBody"></div>

                                        <div class="attachments visually-hidden" id="previewAttachments">
                                            <h4>Archivos Adjuntos:</h4>
                                            <ul id="attachmentList"></ul>
                                        </div>
                                    </div>
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

<div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="imageModalLabel">Vista previa de la imagen</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body text-center">
                <img id="modalImage" src="" alt="Imagen Adjunta" class="img-fluid">
            </div>
        </div>
    </div>
</div>

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

    document.getElementById('newMessage').addEventListener('submit', function(event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            this.classList.add('was-validated');
        }
    });

    updateWizard();

    document.addEventListener("DOMContentLoaded", function() {
        var toggleButton = document.getElementById("toggleFilters");
        if (toggleButton) {
            toggleButton.addEventListener("click", function(event) {
                event.preventDefault();
                var opciones = document.getElementById("filtersOptions");
                if (opciones.style.display === "none" || opciones.style.display === "") {
                    opciones.style.display = "flex";
                    opciones.style.flexDirection = 'column';
                } else {
                    opciones.style.display = "none";
                }
            });
        }
    });

    function toggleFields() {
        const method = document.getElementById('messageMethod').value;
        const whatsappFields = document.getElementById('whatsappFields');
        const emailFields = document.getElementById('emailFields');
        const previewWhatsapp = document.getElementById('previewWhatsapp');
        const emailPreview = document.getElementById('emailPreview');
        console.log(method);
        // Ocultar todos los campos inicialmente
        whatsappFields.classList.add('visually-hidden');
        emailFields.classList.add('visually-hidden');

        // Mostrar campos según la selección
        if (method === 'whatsapp') {
            whatsappFields.classList.remove('visually-hidden');
            emailPreview.classList.add('visually-hidden');
            document.querySelectorAll(".optionWhatsapp").forEach(input => {
                input.required = true;
            });
            document.querySelectorAll(".optionEmail").forEach(input => {
                input.required = false;
            });
        } else if (method === 'email') {
            emailFields.classList.remove('visually-hidden');
            previewWhatsapp.classList.add('visually-hidden');
            document.querySelectorAll(".optionWhatsapp").forEach(input => {
                input.required = false;
            });
            document.querySelectorAll(".optionEmail").forEach(input => {
                input.required = true;
            });
        }
    }

    const messageInput = document.getElementById('whatsappMessage');
    const fileInput = document.getElementById('whatsappFile');
    const previewWhatsapp = document.getElementById('previewWhatsapp');
    const previewMessage = document.getElementById('previewMessage');
    const previewAttachment = document.getElementById('previewAttachment');
    const previewImage = document.getElementById('previewImage');

    function updatePreviewMessageWP() {
        const message = messageInput.value;
        previewMessage.textContent = message || 'Sin mensaje';

        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewAttachment.classList.remove('visually-hidden');
            };

            reader.readAsDataURL(file);
        } else {
            previewAttachment.classList.add('visually-hidden');
        }

        previewWhatsapp.classList.remove('visually-hidden');
    }

    messageInput.addEventListener('input', updatePreviewMessageWP);
    fileInput.addEventListener('change', updatePreviewMessageWP);

    const emailTo = document.getElementById('emailTo');
    const emailSubject = document.getElementById('emailSubject');
    const emailBody = document.getElementById('emailBody');
    const emailAttachments = document.getElementById('emailAttachments');

    const emailPreview = document.getElementById('emailPreview');
    const previewTo = document.getElementById('previewTo');
    const previewSubject = document.getElementById('previewSubject');
    const previewBody = document.getElementById('previewBody');
    const previewAttachments = document.getElementById('previewAttachments');
    const attachmentList = document.getElementById('attachmentList');
    const modalImage = document.getElementById('modalImage');
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));

    function updatePreviewEmail() {
        // Mostrar los campos básicos del correo
        previewTo.textContent = emailTo.value || 'Sin destinatario';
        previewSubject.textContent = emailSubject.value || 'Sin asunto';
        previewBody.textContent = emailBody.value || 'Sin mensaje';

        // Manejar archivos adjuntos
        attachmentList.innerHTML = '';
        if (emailAttachments.files.length > 0) {
            Array.from(emailAttachments.files).forEach(file => {
                const listItem = document.createElement('li');

                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        img.src = e.target.result;
                        img.addEventListener('click', () => {
                            modalImage.src = e.target.result;
                            imageModal.show();
                        });
                    };

                    reader.readAsDataURL(file);
                    listItem.appendChild(img);
                }

                const text = document.createTextNode(file.name);
                listItem.appendChild(text);
                attachmentList.appendChild(listItem);
            });

            previewAttachments.classList.remove('visually-hidden');
        } else {
            previewAttachments.classList.add('visually-hidden');
        }

        emailPreview.classList.remove('visually-hidden');
    }

    emailTo.addEventListener('input', updatePreviewEmail);
    emailSubject.addEventListener('input', updatePreviewEmail);
    emailBody.addEventListener('input', updatePreviewEmail);
    emailAttachments.addEventListener('change', updatePreviewEmail);

    //selectores dependiendo del checkbox
    const filterOptions = {
        "age-range": ["18-25", "26-35", "36-45", "46+"],
        "gender": ["Masculino", "Femenino", "Otro"],
        "country": ["Colombia", "México", "Argentina", "España"],
        "last-consultation": ["Última semana", "Último mes", "Últimos 6 meses"],
        "appointments": ["1-3 citas", "4-6 citas", "7+ citas"],
        "appointments-from-date": ["Última semana", "Último mes", "Último año"],
        "marital-status": ["Soltero", "Casado", "Divorciado", "Viudo"],
        "blood-type": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        "donor": ["Sí", "No"],
        "health-entity": ["EPS", "Privado", "Sin cobertura"]
    };

    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let filterItem = this.closest('.filter-item');
            let filterType = this.getAttribute('data-filter');
            let existingSelector = filterItem.querySelector(`select[data-filter="${filterType}"]`);


            if (this.checked && !existingSelector) {
                let select = document.createElement('select');
                select.setAttribute('data-filter', filterType);
                select.innerHTML = `<option value="">Seleccione</option>` +
                    filterOptions[filterType].map(option => `<option value="${option}">${option}</option>`).join('');
                filterItem.appendChild(select);
            } else if (!this.checked && existingSelector) {
                existingSelector.remove();
            }
        });
    });
</script>
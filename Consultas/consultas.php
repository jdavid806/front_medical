<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item"><a href="consultas-especialidad?patient_id=<?php echo $_GET['patient_id']; ?>&especialidad=<?php echo $_GET['especialidad']; ?>">Consultas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Consulta Primera vez</li>
            </ol>
        </nav>
        <div class="row">
            <div class="col-12">
                <div class="row align-items-center justify-content-between">
                    <div class="col-md-6">
                        <h2 class="mb-0">Nueva Consulta</h2>
                        <small class="patientName">
                            Cargando...
                        </small>
                    </div>
                    <div class="col-5">
                        <button class="btn btn-primary" type="button" data-bs-toggle="modal"
                            data-bs-target="#modalAgregarParaclinico">
                            <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar Paraclínico
                        </button>
                        <button class="btn btn-primary" id="detallePacienteBtn" type="button" data-bs-toggle="modal"
                            data-bs-target="#modalDetallePaciente">Ver Información Paciente</button>

                    </div>
                </div>
            </div>

        </div>

        <div class="row g-0 g-md-4 g-xl-6 p-3">

            <div class="col-md-12 col-lg-12 col-xl-12">

                <div class="container mt-4 w-100 mw-100">

                    <!-- Contenedor de tabs -->
                    <ul class="nav nav-tabs" id="formContainer">
                    </ul>
                    <!-- Contenedor de contenido de tabs -->
                    <div class="tab-content mt-3" id="tabsContainer">
                    </div>
                </div>

                <!-- <button class="btn btn-primary mt-4" id="mostrarFormulario">Generar con IA</button> -->

                <div class="modal-footer">
                    <!-- <button class="btn btn-secondary me-2" id="prevStep" type="button" disabled>Anterior</button>
                    <button class="btn btn-primary me-2" id="nextStep" type="button">Siguiente</button>
                    <button class="btn btn-secondary d-none" id="finishStep" type="submit"
                        form="wizardForm">Finalizar</button> -->
                </div>
                <!-- <div id="formularioPrescripciones" style="display: block;">
                    <form class="needs-validation">
                        <div class="tab-content mt-3" id="myTabContent">
                            <div class="tab-pane fade show active" id="prescripcionesTab" role="tabpanel"
                                aria-labelledby="prescripciones-tab">
                                <div class="d-flex justify-content-between gap-2">
                                    <div class="col-md-3">
                                        <ul class="nav flex-column nav-underline fs-9" id="myTab" role="tablist">
                                            <li class="nav-item" role="presentation">
                                                <a class="nav-link active" id="paraclinicos-tab" data-bs-toggle="tab"
                                                    href="#paraclinicosTab" role="tab" aria-controls="paraclinicosTab"
                                                    aria-selected="false">
                                                    <span class="text-primary uil-clipboard"></span> Paraclínicos
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-md-9 p-3">
                                        <div class="tab-content">
                                            <div class="tab-pane fade show active" id="paraclinicosTab" role="tabpanel">
                                                <h4>Paraclínicos</h4>
                                                <button class="btn btn-primary" type="button" data-bs-toggle="modal"
                                                    data-bs-target="#modalAgregarParaclinico">
                                                    <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar Paraclínico
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div> -->





                <!-- <div class="col-md-5 col-lg-5 col-xl-4">
                <div class="sticky-leads-sidebar">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
                        id="productFilterColumn">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center g-3 text-center text-xxl-start">
                                    <div class="col-12 col-xxl-auto">
                                        <div class="avatar avatar-5xl"><img class="rounded-circle"
                                                src="<?= $ConfigNominaUser['logoBase64'] ?>" alt="" /></div>
                                    </div>
                                    <div class="col-12 col-sm-auto flex-1">
                                        <h3 class="fw-bold mb-2">Miguel Angel Castro Franco</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Genero
                                    </div>
                                    <div>
                                        Masculino
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Edad
                                    </div>
                                    <div>
                                        21 Años
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Tipo de Sangre
                                    </div>
                                    <div>
                                        A Positivo
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Condicion Especial
                                    </div>
                                    <div>
                                        TDHA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Antecedentes
                                    </div>
                                    <div>
                                        TDHA, ASMA, HTA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Whatsapp
                                    </div>
                                    <div>
                                        +57350........
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->

                <div class="col-md-12 col-lg-12 col-xl-12">
                    <div>
                        <div class="container">
                            <div class="row align-items-center">
                                <div class="col-6">
                                    <div class="timer">
                                        Tiempo en consulta: <span id="timer">00:00:00</span>
                                        <script>
                                            let start = new Date().getTime();
                                            setInterval(function() {
                                                let now = new Date().getTime();
                                                let diff = (now - start) / 1000;
                                                let minutes = Math.floor(diff / 60);
                                                let seconds = Math.floor(diff % 60);
                                                document.getElementById("timer").innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                            }, 1000);
                                        </script>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <a href="consultas-especialidad?patient_id=<?php echo $_GET['patient_id']; ?>&especialidad=<?php echo $_GET['especialidad']; ?>" class="btn btn-danger" id="cancelBtn">Cancelar consulta</a>
                                </div>
                                <div class="col-3">
                                    <button class="btn btn-primary" id="finishBtn" type="button" data-bs-toggle="modal"
                                        data-bs-target="#finishModal">Terminar consulta</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
    <!-- <script src="vendors/tinymce/tinymce.min.js"></script> -->
</div>

<?php
include "../footer.php";
// include "../Pacientes/modalPacientes.php";
include "./modalDetallePaciente.php";
include "./modalAntecedenteNecesario.php";
include "../Incapacidades/modalIncapacidad.php";
include "../Recetas/modalReceta.php";
include "../Paraclinicos/modalParaclinico.php";
include "../Remisiones/modalRemisiones.php";
include "./modalTerminarConsulta.php";
?>

<script type="module" src="Consultas/scripts/form.js"></script>
<script>
    // document.getElementById("mostrarFormulario").addEventListener("click", function () {
    //     var formulario = document.getElementById("formularioPrescripciones");
    //     formulario.style.display = (formulario.style.display === "none") ? "block" : "none";
    // });    
</script>

<!-- <script>
    let formValues = {};
    document.addEventListener("DOMContentLoaded", async function () {
        const params = new URLSearchParams(window.location.search);
        const tipoHistoria = params.get("tipo_historia");
        const jsonPath = `../ConsultasJson/${tipoHistoria}.json`;
        

        console.log(jsonPath);

        try {
            const response = await fetch(jsonPath);
            const formData = await response.json();

            generateForm(formData.form1);
            updateWizard(formData.form1.steps.length);

            document.getElementById("finalizarConsulta").addEventListener("click", function () {
                captureFormValues(formData.form1);
                console.log("dentro del try", formValues); // Ahora funciona porque formValues es global
            });
        } catch (error) {
            console.error("Error cargando el JSON:", error);
        }
    });


    function generateForm(formData) {
        formContainer.innerHTML = "";
        stepsContainer.innerHTML = "";

        formData.steps.forEach(step => {
            // Generar indicador de paso en la barra de navegación
            let stepItem = document.createElement("li");
            stepItem.classList.add("step");
            stepItem.setAttribute("data-step", step.step);
            stepItem.innerHTML = `<span class="step-number">${step.step}</span>`;
            stepsContainer.appendChild(stepItem);

            let stepDiv = document.createElement("div");
            stepDiv.classList.add("wizard-step");
            stepDiv.setAttribute("data-step", step.step);

            let rowDiv = document.createElement("div");
            rowDiv.classList.add("row", "g-3");

            step.fields.forEach(field => {
                let fieldDiv = document.createElement("div");
                fieldDiv.classList.add("col-6", "form-floating");

                if (field.type === "number" || field.type === "text" || field.type === "date" || field.type === "select-multiple") {
                    let input = document.createElement("input");
                    input.classList.add("form-control");
                    input.setAttribute("type", field.type);
                    input.setAttribute("id", field.id);
                    input.setAttribute("name", field.name);
                    if (field.min !== undefined) {
                        input.setAttribute("min", field.min);
                    }

                    let label = document.createElement("label");
                    label.setAttribute("for", field.id);
                    label.textContent = field.label;

                    fieldDiv.appendChild(input);
                    fieldDiv.appendChild(label);
                    //<textarea class="tinymce" name="content" data-tinymce="{}"></textarea>
                } else if (field.type === "textarea") {
                    let textarea = document.createElement("textarea");
                    textarea.classList.add("form-control");
                    textarea.setAttribute("id", field.id);
                    textarea.setAttribute("name", field.name);
                    textarea.setAttribute("style", "height: 100px");
                    // textarea.setAttribute("data-tinymce", "{}");
                    if (field.placeholder) {
                        textarea.setAttribute("placeholder", field.placeholder);
                    }

                    let label = document.createElement("label");
                    label.setAttribute("for", field.id);
                    label.textContent = field.label;

                    fieldDiv.appendChild(textarea);
                    fieldDiv.appendChild(label);
                } else if (field.type === "checkbox") {
                    let label = document.createElement("label");
                    label.classList.add("form-check-label", "mt-2");
                    label.setAttribute("for", field.id);
                    label.textContent = field.label;

                    let checkbox = document.createElement("input");
                    checkbox.classList.add("form-check-input");
                    checkbox.setAttribute("id", field.id);
                    checkbox.setAttribute("name", field.name);
                    checkbox.setAttribute("type", "checkbox");

                    let switchDiv = document.createElement("div");
                    switchDiv.classList.add("form-check", "form-switch", "mb-2");
                    switchDiv.appendChild(checkbox);
                    fieldDiv.appendChild(label);
                    fieldDiv.appendChild(switchDiv);

                    let subFieldsContainer = document.createElement("div");
                    subFieldsContainer.setAttribute("id", `${field.id}-subfields`);
                    subFieldsContainer.classList.add("d-none");

                    field.toggleFields.forEach(subField => {
                        let subFieldDiv = document.createElement("div");
                        subFieldDiv.classList.add("mb-2", "form-floating");

                        if (subField.type === "select") {
                            let select = document.createElement("select");
                            select.classList.add("form-select");
                            select.setAttribute("id", subField.id);
                            select.setAttribute("name", subField.name);

                            subField.options.forEach(optionText => {
                                let option = document.createElement("option");
                                option.value = optionText;
                                option.textContent = optionText;
                                select.appendChild(option);
                            });

                            let selectLabel = document.createElement("label");
                            selectLabel.setAttribute("for", subField.id);
                            selectLabel.textContent = subField.label;

                            subFieldDiv.appendChild(select);
                            subFieldDiv.appendChild(selectLabel);
                        } else if (subField.type === "textarea") {
                            let textarea = document.createElement("textarea");
                            textarea.classList.add("form-control");
                            textarea.setAttribute("id", subField.id);
                            textarea.setAttribute("name", subField.name);
                            textarea.setAttribute("style", "height: 100px");
                            if (subField.placeholder) {
                                textarea.textContent = subField.placeholder;
                            }

                            let textareaLabel = document.createElement("label");
                            textareaLabel.setAttribute("for", subField.id);
                            textareaLabel.textContent = subField.label;

                            subFieldDiv.appendChild(textarea);
                            subFieldDiv.appendChild(textareaLabel);
                        }

                        subFieldsContainer.appendChild(subFieldDiv);
                    });

                    fieldDiv.appendChild(subFieldsContainer);

                    checkbox.addEventListener("change", () => {
                        subFieldsContainer.classList.toggle("d-none", !checkbox.checked);
                    });
                } else if (field.type === "select") {
                    let label = document.createElement("label");
                    label.textContent = field.label;
                    label.setAttribute("for", field.id);

                    let select = document.createElement("select");
                    select.id = field.id;
                    select.name = field.name;
                    select.classList.add("form-control");

                    field.options.forEach(option => {
                        let opt = document.createElement("option");
                        opt.value = option.value;
                        opt.textContent = option.text;
                        select.appendChild(opt);
                    });

                    fieldDiv.appendChild(label);
                    fieldDiv.appendChild(select);
                }

                rowDiv.appendChild(fieldDiv);
            });
            // initTinyMCE();
            stepDiv.appendChild(rowDiv);
            formContainer.appendChild(stepDiv);
        });
    }

    function captureFormValues(formData) {
        formData.steps.forEach(step => {
            step.fields.forEach(field => {
                if (field.type === "checkbox" && document.getElementById(field.id).checked) {
                    // Si el checkbox está marcado, captura los valores de los campos dependientes
                    field.toggleFields.forEach(toggleField => {
                        if (toggleField.type === "select") {
                            formValues[toggleField.name] = document.getElementById(toggleField.id).value;
                        } else if (toggleField.type === "textarea") {
                            formValues[toggleField.name] = document.getElementById(toggleField.id).value;
                        }
                    });
                } else if (field.type !== "checkbox") {
                    formValues[field.name] = document.getElementById(field.id).value;
                }
            });
        });

        console.log("funcion" + formValues);
        return formValues;
    }




    const formContainer = document.getElementById("form-container");
    const stepsContainer = document.getElementById("steps");
    let currentStep = 1;

    function updateWizard(totalSteps) {
        document.querySelectorAll(".step").forEach(step => {
            step.classList.toggle("active", step.dataset.step == currentStep);
        });

        document.querySelectorAll(".wizard-step").forEach(step => {
            step.classList.toggle("active", step.dataset.step == currentStep);
        });

        document.getElementById("prevStep").disabled = currentStep === 1;
        document.getElementById("nextStep").classList.toggle("d-none", currentStep === totalSteps);
        document.getElementById("finishStep").classList.toggle("d-none", currentStep !== totalSteps);
    }

    document.getElementById("nextStep").addEventListener("click", () => {
        currentStep++;
        updateWizard(document.querySelectorAll(".wizard-step").length);
    });

    document.getElementById("prevStep").addEventListener("click", () => {
        currentStep--;
        updateWizard(document.querySelectorAll(".wizard-step").length);
    });


    function initTinyMCE() {
    setTimeout(() => {
        tinymce.init({
            selector: ".tinymce",
            menubar: false, 
            plugins: "lists link image table code", 
            toolbar: "undo redo | bold italic | bullist numlist | link image | code",
            height: 200,
            setup: function (editor) {
                editor.on("init", function () {
                    console.log("TinyMCE listo en:", editor.id);
                });
            }
        });
    }, 100); 
}
</script> -->

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
    const patientId = new URLSearchParams(window.location.search).get('patient_id');
</script>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PastMedicalHistoryForm
    } from './react-dist/past-medical-history/PastMedicalHistoryForm.js';
    import {
        clinicalRecordService
    } from "./services/api/index.js";

    ReactDOMClient.createRoot(document.getElementById('form-content')).render(React.createElement(PastMedicalHistoryForm, {
        onFinishSave: () => {
            validatePastMedicalHistory();
        }
    }));

    async function validatePastMedicalHistory() {
        const antecedentes = await clinicalRecordService.ofParentByType(
            "PAST_MEDICAL_HISTORY",
            patientId
        );

        if (antecedentes.length === 0) {
            const modal = new bootstrap.Modal(document.getElementById('modalAntecedenteNecesario'));
            modal.show();
            document.getElementById('modalAntecedenteNecesario').addEventListener('hidden.bs.modal', async () => {
                const antecedentes2 = await clinicalRecordService.ofParentByType(
                    "PAST_MEDICAL_HISTORY",
                    patientId
                );
                if (antecedentes2.length === 0) {
                    modal.show();
                }
            });
        }
    }

    validatePastMedicalHistory()
</script>

<script type="module">
    import {
        appointmentService
    } from "../../services/api/index.js";

    const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');

    if (appointmentId) {
        const appointment = await appointmentService.get(appointmentId);

        console.log('Cita:', appointment);


        if (appointment.appointment_state.name === 'pending_consultation') {
            appointmentService.changeStatus(appointmentId, 'in_consultation')
        }
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No fue posible encontrar la cita relacionada.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            //window.history.back();
        });
    }
</script>

<script type="module">
    import {
        patientService,
        clinicalRecordService
    } from "../../services/api/index.js";
    import {
        formatDate
    } from "../../services/utilidades.js";

    const patientPromise = patientService.get(patientId);

    const [patient] = await Promise.all([patientPromise]);

    document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`
        }
    })
</script>
<div class="sticky-leads-sidebar">
    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
        id="productFilterColumn">
        <div class="d-flex justify-content-between align-items-center mb-2 d-md-none">
            <h3 class="mb-0">Información del Paciente</h3>
            <button class="btn p-0" data-phoenix-dismiss="offcanvas"><span
                    class="uil uil-times fs-7"></span></button>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-center flex-wrap gap-3">
                    <!-- Imagen del avatar -->
                    <div class="avatar avatar-5xl">
                        <img class="rounded-circle" src="https://i.pravatar.cc/150?img=52" alt="Avatar">
                    </div>
                    <!-- Información personal -->
                    <div class="flex-grow-1 text-center">
                        <!-- Nombre -->
                        <h5 class="fw-bold mb-2 mb-3" id="name"></h5>
                        <!-- Datos adicionales -->
                        <div class="d-flex flex-wrap align-items-center justify-content-center gap-3">
                            <!-- ID -->
                            <div class="d-flex align-items-center">
                                <i class="fa-solid far fa-id-card text-primary me-2"></i>
                                <span class="fw-bold">Identificación</span>
                                <span class="text-muted ms-1" id="id">...</span>
                            </div>
                            <!-- RH -->
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-droplet text-primary me-2"></i>
                                <span class="fw-bold">RH</span>
                                <span class="text-muted ms-1" id="rh">...</span>
                            </div>
                            <!-- Teléfono -->
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-phone text-primary me-2"></i>
                                <span class="fw-bold">Celular:</span>
                                <span class="text-muted ms-1 small" id="phone">...</span>
                            </div>
                            <!-- Correo -->
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-envelope text-primary me-2"></i>
                                <span class="fw-bold">Email:</span>
                                <span class="text-muted ms-1 small" id="email">...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <!-- Encabezado con título y botón al lado -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3>Antecendentes médicos</h3>
                    <button class="btn text-primary p-0 d-flex align-items-center gap-2"
                        title="ver detalles de consulta" data-value="mostrar" type="button" data-bs-toggle="modal"
                        data-bs-target="#modalVerAntecedentesClinicos">
                        <i class="fa-solid fa-file-medical"></i>
                        Ver más
                    </button>

                </div>

                <!-- Última consulta -->
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-1">
                        <span class="me-2 uil uil-clock"></span>
                        <h5 class="text-body-highlight mb-0">Última Consulta</h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="last-visit">...</p>
                </div>

                <!-- Campos básicos de antecedentes médicos -->
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-1">
                        <span class="me-2 uil uil-medkit"></span>
                        <h5 class="text-body-highlight mb-0">Alergias: </h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="allergies">...</p>
                </div>

                <div class="mb-4">
                    <div class="d-flex align-items-center mb-1">
                        <span class="me-2 uil uil-heart"></span>
                        <h5 class="text-body-highlight mb-0">Enfermedades Crónicas</h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="chronic-diseases">...</p>
                </div>

                <div class="mb-4">
                    <div class="d-flex align-items-center mb-1">
                        <span class="me-2 uil uil-swimmer"></span>
                        <h5 class="text-body-highlight mb-0">Hábitos Relevantes</h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="relevant-habits">...</p>
                </div>
            </div>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex align-items-center mb-5">
                    <h3>Información de Contacto</h3>
                    <button class="btn text-primary p-0 d-flex align-items-center gap-2"
                        title="ver información del paciente" data-value="mostrar" type="button" data-bs-toggle="modal"
                        data-bs-target="#modalVerInfoPaciente">
                        <i class="fa-solid fa-file-medical"></i>
                        Ver más
                    </button>
                    <!-- <button class="btn btn-link" type="button">Editar</button> -->
                </div>
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-estate"></span>
                        <h5 class="mb-0">Dirección</h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="address"></p>
                </div>
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-map"></span>
                        <h5 class="mb-0 text-body-highlight">Ciudad</h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="city"></p>
                </div>
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-windsock"></span>
                        <h5 class="mb-0 text-body-highlight">País</h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="country"></p>
                </div>
                <div>
                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-file-info-alt"></span>
                        <h5 class="mb-0 text-body-highlight"> Razón Última Consulta</h5>
                    </div>
                    <p class="mb-0 text-body-secondary" id="last-visit-reason"></p>
                </div>
            </div>
        </div>
    </div>
    <div class="phoenix-offcanvas-backdrop d-lg-none top-0" data-phoenix-backdrop="data-phoenix-backdrop"></div>
</div>

<?php
include "../Consultas/modalAntencedentes.php";
include "../Consultas/modalInfoPacientes.php";
?>
<?php
include "./modalPacientes.php";
?>

<script type="module">
    import {
        patientService
    } from "../../services/api/index.js";
    import {
        formatDate
    } from "../../services/utilidades.js";
    import {
        bloodType
    } from "../../services/commons.js";

    const patientId = new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("patient_id");

    document.addEventListener("DOMContentLoaded", async () => {
        try {
            if (id) {
                // Filtrar el paciente por ID
                const paciente = await patientService.get(patientId);

                displayPatientData(paciente);
            }

        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    });

    function filterPatientById(pacientes, id) {

        return pacientes.find(paciente => paciente.id === parseInt(id)); // Asegúrate de que el ID es numérico
    }

    function displayPatientData(paciente) {
        if (!paciente) {
            console.log("Paciente no encontrado");
            return;
        }

        document.getElementById("id").textContent = paciente.document_number;
        document.getElementById("name").textContent = `${paciente.first_name} ${paciente.last_name}`;
        document.getElementById("phone").textContent = paciente.validated_data?.whatsapp || "No disponible"; // Si tienes el campo de teléfono
        document.getElementById("email").textContent = paciente.validated_data?.email || "No disponible";
        document.getElementById("allergies").textContent = paciente.has_allergies ? paciente.allergies || "No especificado" : "No tiene alergias";
        document.getElementById("chronic-diseases").textContent = paciente.has_special_condition ? paciente.special_condition || "No especificado" : "No tiene enfermedades crónicas";


        document.getElementById("address").textContent = paciente.address || "No disponible";
        document.getElementById("city").textContent = paciente.city_id || "No especificada";
        document.getElementById("country").textContent = paciente.country_id || "No especificado";

        // Información adicional
        document.getElementById("relevant-habits").textContent = paciente.relevant_habits || "No especificado";

        const sortedClinicalRecords = paciente.clinical_records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const lastClinicalRecord = sortedClinicalRecords[0];
        document.getElementById("last-visit").textContent = lastClinicalRecord ? formatDate(lastClinicalRecord.created_at) : "Fecha no disponible";
        document.getElementById("last-visit-reason").textContent = lastClinicalRecord && lastClinicalRecord.description ? lastClinicalRecord.description : "No especificado";

        document.getElementById("rh").textContent = bloodType[paciente.blood_type] || "No especificado";

        const nameBreadcumb = document.getElementById("nameBradcumb");

        if (nameBreadcumb) {
            nameBreadcumb.textContent = paciente.first_name + paciente.last_name;
        }
        document.querySelectorAll(".patientName").forEach(element => {
            element.textContent = paciente.first_name + paciente.last_name
            if (element.tagName === 'A') {
                element.href = `verPaciente?id=${paciente.id}`
            }
        })
    }
</script>
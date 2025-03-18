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
                <li class="breadcrumb-item"><a href="historialConsultasEspecialidad?patient_id=<?php echo $_GET['patient_id']; ?>&especialidad=<?php echo $_GET['especialidad']; ?>">Consultas</a></li>
            </ol>
        </nav>
        <div class="row">
            <div class="col-12">
                <div class="row align-items-center justify-content-between">
                    <div class="col-md-6">
                        <h2 class="mb-0">Detalle Consulta</h2>
                        <small class="patientName">
                            Cargando...
                        </small>
                    </div>
                    <div class="col-5 d-flex justify-content-end">
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
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
include "./modalDetallePaciente.php";
include "./modalAntecedenteNecesario.php";
include "../Incapacidades/modalIncapacidad.php";
include "../Recetas/modalReceta.php";
include "../Paraclinicos/modalParaclinico.php";
include "../Remisiones/modalRemisiones.php";
include "./modalTerminarConsulta.php";
?>

<script src="Consultas/scripts/detail.js"></script>

<script type="module">
    import {
        patientService,
        clinicalRecordService
    } from "../../services/api/index.js";
    import {
        formatDate
    } from "../../services/utilidades.js";

    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const patientPromise = patientService.get(patientId);

    const [patient] = await Promise.all([patientPromise]);

    document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`
        }
    })
</script>
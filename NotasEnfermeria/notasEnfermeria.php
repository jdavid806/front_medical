<?php
include "../menu.php";
include "../header.php";
$historialData = [
  [
    "titulo" => "Accion paciente",
    "Nota" => "Paciente se le aplica una vacuna para el dolor",
    "fecha de nota" => "2024-01-01",
    "Enfermera" => "Juanita"
  ],
  [
    "titulo" => "Paciente se le seda",
    "Nota" => "Paciente se le aplica un sedante",
    "fecha de nota" => "2024-01-01",
    "Enfermera" => "Juanita"

  ]
];

$jsonData = json_encode($historialData);

?>

<style type="text/css">
.custom-btn {
    width: 150px;
    /* Establece el ancho fijo */
    height: 40px;
    /* Establece la altura fija */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 5px;
    /* Espaciado opcional entre botones */
}

.custom-btn i {
    margin-right: 5px;
    /* Espaciado entre el ícono y el texto */
}

.timeline {
    list-style: none;
    padding: 0;
    position: relative;
}

.timeline-item {
    margin: 20px 0;
    position: relative;
    padding-left: 40px;
}

.timeline-item h5 {
    margin-bottom: 5px;
    color: #495057;
}

.timeline-item p {
    margin: 0;
}

.calendar {
    width: 100%;
    max-width: 600px;
    margin: auto;
    text-align: center;
    border: 1px solid #ddd;
}

.month {
    background: #0d6efd;
    color: #fff;
    padding: 15px;
}

.weekdays,
.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.weekdays div {
    background: #f1f1f1;
    padding: 10px 0;
    font-weight: bold;
}

.days div {
    padding: 15px;
    border: 1px solid #ddd;
    min-height: 80px;
    position: relative;
}

.event {
    background: #198754;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    font-size: 12px;
    display: inline-block;
    margin-top: 10px;
}
</style>
<div class="componete">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?id=1" class="patientName"
                        id="nameBradcumb">Cargando...</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Notas de Enfermeria</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="row align-items-center justify-content-between">
                        <div class="col-md-6">

                        </div>
                        <div class="col-md-6 text-md-end text-start mt-2 mt-md-0">
                            <?php
              // echo $dropdownNew; 
              ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-0 g-md-4 g-xl-6 p-5">
                <h2 class="mb-0 patientName">Cargando...</h2>
                <div class="col-4">
                    <?php include "../Pacientes/infoPaciente.php"; ?>
                </div>

                <div class="col-8">
                    <h3>Notas de Enfermeria</h3>
                    <button type="button" class="btn btn-primary mt-3 mb-3" data-bs-toggle="modal"
                        data-bs-target="#nuevaNotaModal">
                        Agregar Nueva Nota
                    </button>
                    <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#tab-home" role="tab"
                                aria-controls="tab-home" aria-selected="true">
                                <i class="fas fa-notes-medical"></i> Notas de Enfermería
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content mt-3" id="myTabContent">
                        <div class="tab-pane fade show active" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
                            <!-- Filtros de búsqueda -->

                            <div class="accordion mb-4" id="accordionFiltros">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingFiltros">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseFiltros" aria-expanded="false"
                                            aria-controls="collapseFiltros">
                                            Filtros
                                        </button>
                                    </h2>
                                    <div id="collapseFiltros" class="accordion-collapse collapse"
                                        aria-labelledby="headingFiltros" data-bs-parent="#accordionFiltros">
                                        <div class="accordion-body">
                                            <form id="filtroForm" class="d-flex align-items-end gap-2">
                                                <!-- Filtro por Enfermera -->
                                                <div class="flex-grow-1">
                                                    <label for="filtroEnfermera" class="form-label">Enfermera</label>
                                                    <select class="form-select" id="filtroEnfermera">
                                                        <option value="">Todas las enfermeras</option>
                                                    </select>
                                                </div>

                                                <!-- Filtro por Fecha -->
                                                <div class="flex-grow-1">
                                                    <label for="filtroFecha" class="form-label">Fecha</label>
                                                    <input class="form-control datetimepicker" id="filtroFecha"
                                                        type="text" placeholder="dd/mm/yyyy"
                                                        data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                                                </div>

                                                <!-- Botón para aplicar filtros -->
                                                <button type="submit" class="btn btn-primary align-self-end">Buscar
                                                    Nota</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Acordeón -->
                            <div id="accordionHistorial"></div>
                            <div class="accordion" id="accordionHistorial">
                                <!-- El contenido será generado dinámicamente -->
                            </div>
                            <div id="mensajeNoResultados" class="card text-white bg-secondary" style="display: none;">
                                No se han encontrado resultados con los parametros .
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</div>
<script type="module">
import {
    patientNursingNoteService
} from "./services/api/index.js";
import {
    usersSelect
} from "./services/selects.js";

let historialData = []
const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('patient_id');

document.addEventListener("DOMContentLoaded", async () => {
    const accordionContainer = document.getElementById("accordionHistorial");
    const filtroForm = document.getElementById("filtroForm");
    const mensajeNoResultados = document.getElementById("mensajeNoResultados");
    usersSelect(document.getElementById('filtroEnfermera'))
    historialData = await patientNursingNoteService.ofParent(patientId)

    // console.log(historialData);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
        return formattedDate;
    }

    // Función para renderizar el acordeón
    function renderAcordeon(data) {
        accordionContainer.innerHTML = ""; // Limpiar el acordeón actual

        if (data.length === 0) {
            // Mostrar mensaje si no hay resultados
            mensajeNoResultados.style.display = "block";
        } else {
            // Ocultar mensaje si hay resultados
            mensajeNoResultados.style.display = "none";

            // Renderizar el acordeón con los datos
            data.forEach((section, index) => {
                const isActive = index === 0 ? "show" : "";
                const isCollapsed = index !== 0 ? "collapsed" : "";

                const accordionItem = `
                    <div class="card mt-5">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${index}">
                                <button class="accordion-button ${isCollapsed}" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                                        aria-expanded="${index === 0}" aria-controls="collapse${index}">
                                Nota de enfermería n°	${index + 1} - ${formatDate(section.created_at)}
                                </button>
                            </h2>
                            <div id="collapse${index}" class="accordion-collapse collapse ${isActive}" 
                                 aria-labelledby="heading${index}" data-bs-parent="#accordionHistorial">
                                <div class="accordion-body">
                                    <ul class="timeline">
                                        <li class="timeline-item">
                                            <p class="text-muted mb-1">${section.note}</p>
                                            <p class="text-muted mb-1">Fecha: ${formatDate(section.created_at)}</p>
                                            <p class="text-muted mb-1">Enfermera: ${section.user_id}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                accordionContainer.innerHTML += accordionItem;
            });
        }
    }

    // Función para filtrar los datos
    function filtrarDatos() {
        const filtroEnfermera = document.getElementById("filtroEnfermera").value.trim().toLowerCase();
        const filtroFecha = document.getElementById("filtroFecha").value.trim();

        const datosFiltrados = historialData.filter((section) => {
            // Asumiendo que "Enfermera" representa "user_id"
            const coincideEnfermera = filtroEnfermera === "" || section.user_id.toString() ===
                filtroEnfermera;

            // Convertir `created_at` a `DD/MM/YYYY` asegurando ceros iniciales
            const fechaObjeto = new Date(section.created_at);
            const dia = fechaObjeto.getDate().toString().padStart(2, "0");
            const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2,
            "0"); // `getMonth()` devuelve 0-11
            const año = fechaObjeto.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${año}`;

            // Convertir `filtroFecha` a `DD/MM/YYYY` si es necesario
            let filtroFechaFormateada = filtroFecha;
            if (filtroFecha.includes("-")) { // Si el input tiene formato YYYY-MM-DD
                const partes = filtroFecha.split("-");
                filtroFechaFormateada =
                    `${partes[2].padStart(2, "0")}/${partes[1].padStart(2, "0")}/${partes[0]}`;
            }

            // console.log("Fecha en BD:", fechaFormateada, "Fecha en Input:", filtroFechaFormateada);

            const coincideFecha = filtroFecha === "" || fechaFormateada === filtroFechaFormateada;

            return coincideEnfermera && coincideFecha;
        });

        renderAcordeon(datosFiltrados); // Renderizar el acordeón con los datos filtrados
    }

    filtroForm.addEventListener("submit", (event) => {
        event.preventDefault();
        filtrarDatos();
    });


    renderAcordeon(historialData);
});
</script>


<?php
include "modalNotasEnfermeria.php";
include "../Consultas/modalAntencedentes.php";
include "../footer.php";
?>
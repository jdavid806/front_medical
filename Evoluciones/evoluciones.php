<?php
include "../menu.php";
include "../header.php";

// Datos de ejemplo para evoluciones
$evolucionesData = [
    [
        "titulo" => "Evolución del paciente",
        "Descripcion" => "El paciente presenta mejoría en los síntomas de dolor abdominal.",
        "fecha" => "2024-01-01",
        "Medico" => "Dr. Pérez"
    ],
    [
        "titulo" => "Seguimiento postoperatorio",
        "Descripcion" => "Paciente estable, sin complicaciones postoperatorias.",
        "fecha" => "2024-01-08",
        "Medico" => "Dra. Gómez"
    ]
];

$jsonData = json_encode($evolucionesData);
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        EvolutionsContent
    } from './react-dist/evolutions/EvolutionsContent.js';

    ReactDOMClient.createRoot(document.getElementById('evolution-data-content')).render(React.createElement(EvolutionsContent));
</script>

<style type="text/css">
    /* Estilos existentes (puedes reutilizarlos) */
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
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
</style>

<div class="componete">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Evoluciones</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="row align-items-center justify-content-between">
                        <div class="col-md-6"></div>
                        <div class="col-md-6 text-md-end text-start mt-2 mt-md-0">
                            <!-- Botones adicionales (si los hay) -->
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
                    <h3>Evoluciones</h3>
                    <button type="button" class="btn btn-primary mt-3 mb-3" data-bs-toggle="modal"
                        data-bs-target="#nuevaEvolucionModal">
                        Agregar Nueva Evolución
                    </button>
                    <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="evoluciones-tab" data-bs-toggle="tab" href="#tab-evoluciones"
                                role="tab" aria-controls="tab-evoluciones" aria-selected="true">
                                <i class="fas fa-chart-line"></i> Evoluciones
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content mt-3" id="myTabContent">
                        <div class="tab-pane fade show active" id="tab-evoluciones" role="tabpanel" aria-labelledby="evoluciones-tab">
                            <div id="evolution-data-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const evolucionesData = <?php echo $jsonData; ?>;
</script>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        const accordionContainer = document.getElementById("accordionEvoluciones");
        const filtroForm = document.getElementById("filtroForm");
        const mensajeNoResultados = document.getElementById("mensajeNoResultados");

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
                                    ${section.titulo} - ${section.fecha}
                                </button>
                            </h2>
                            <div id="collapse${index}" class="accordion-collapse collapse ${isActive}" 
                                 aria-labelledby="heading${index}" data-bs-parent="#accordionEvoluciones">
                                <div class="accordion-body">
                                    <ul class="timeline">
                                        <li class="timeline-item">
                                            <h5 class="fw-bold">${section.titulo}</h5>
                                            <p class="text-muted mb-1">${section.Descripcion}</p>
                                            <p class="text-muted mb-1">Fecha: ${section.fecha}</p>
                                            <p class="text-muted mb-1">Médico: ${section.Medico}</p>
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
            const filtroMedico = document.getElementById("filtroMedico").value.toLowerCase();
            const filtroFecha = document.getElementById("filtroFecha").value;

            let fechaInicio = null;
            let fechaFin = null;

            if (filtroFecha.includes(" to ")) {
                const [inicioStr, finStr] = filtroFecha.split(" to ");

                // Convertimos el formato "dd/mm/yy" a números enteros (año, mes, día)
                const parseFecha = (fechaStr) => {
                    const [dia, mes, año] = fechaStr.split("/").map(Number);
                    return new Date(2000 + año, mes - 1, dia); // Se ajusta el año y el mes (0-based index)
                };

                fechaInicio = parseFecha(inicioStr);
                fechaFin = parseFecha(finStr);

                fechaInicio.setHours(0, 0, 0, 0);
                fechaFin.setHours(23, 59, 59, 999); // Incluir toda la fecha final
            }

            const datosFiltrados = evolucionesData.filter((section) => {
                const coincideMedico = filtroMedico === "" || section.Medico.toLowerCase() === filtroMedico;
                const fechaEvolucion = new Date(section.fecha);
                fechaEvolucion.setHours(0, 0, 0, 0);

                let coincideFecha = true;
                if (fechaInicio && fechaFin) {
                    coincideFecha = fechaEvolucion >= fechaInicio && fechaEvolucion <= fechaFin;
                }

                return coincideMedico && coincideFecha;
            });

            renderAcordeon(datosFiltrados);
        }



        // Evento para el formulario de filtrado
        filtroForm.addEventListener("submit", (event) => {
            event.preventDefault();
            filtrarDatos();
        });

        // Renderizar el acordeón al cargar la página
        renderAcordeon(evolucionesData);
    });
</script>

<?php
include "modalEvoluciones.php";
include "../footer.php";
?>
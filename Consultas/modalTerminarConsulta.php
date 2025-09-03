<?php
include "../ConsultasJson/dataPaciente.php";
?>

<div class="modal fade modal-xl" id="finishModal" tabindex="-1" aria-labelledby="finishModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="finishModalLabel">Finalizar consulta</h5>
                <button type="button" id="btnCloseFinish" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="d-flex gap-4 mb-3">
                    <div class="d-flex" style="min-width: 200px">
                        <ul class="nav flex-column nav-underline fs-9" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="examenes-tab" data-bs-toggle="tab" href="#examenesClinicosTab"
                                    role="tab" aria-controls="examenesClinicosTab" aria-selected="true">
                                    <span class="text-primary uil uil-file-alt"></span> Exámenes
                                    clínicos
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="incapacidades-tab" data-bs-toggle="tab"
                                    href="#incapacidadesClinicasTab" role="tab" aria-controls="incapacidadesClinicasTab"
                                    aria-selected="false">
                                    <span class="text-primary uil uil-wheelchair"></span> Incapacidades
                                    clínicas
                                </a>
                            </li>
                            <li class="nav-item" role="presentation" id="tabRecetas">
                                <a class="nav-link" id="recetas-tab" data-bs-toggle="tab" href="#recetasTab" role="tab"
                                    aria-controls="recetasTab" aria-selected="false">
                                    <span class="text-primary uil-clipboard"></span> Recetas médicas
                                </a>
                            </li>
                            <li class="nav-item" role="presentation" id="tabRecetasOptometria">
                                <a class="nav-link" id="recetas-optometria-tab" data-bs-toggle="tab"
                                    href="#recetasOptometriaTab" role="tab" aria-controls="recetasOptometriaTab"
                                    aria-selected="false">
                                    <span class="text-primary uil-eye"></span> Recetas optometría
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="vacunas-tab" data-bs-toggle="tab" href="#vacunasTab" role="tab"
                                    aria-controls="vacunasTab" aria-selected="false">
                                    <span class="text-primary uil-syringe"></span> Vacunas
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="remisiones-tab" data-bs-toggle="tab" href="#remisionesTab"
                                    role="tab" aria-controls="remisionesTab" aria-selected="false">
                                    <span class="text-primary uil-sync"></span> Remisión
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="cita-tab" data-bs-toggle="tab" href="#citaTab" role="tab"
                                    aria-controls="citaTab" aria-selected="false">
                                    <span class="text-primary uil-calender"></span> Cita
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="turnos-tab" data-bs-toggle="tab" href="#turnosTab" role="tab"
                                    aria-controls="turnosTab" aria-selected="false">
                                    <span class="text-primary uil-receipt-alt"></span> Turnos
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="flex-grow-1">
                        <div class="tab-content">
                            <div class="tab-pane fade" id="examenesClinicosTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Exámenes clínicos</h4>
                                    <button id="btnAgregarExamenes" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar exámenes
                                    </button>
                                    <button id="btnCancelarExamenes" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                                    </button>
                                </div>
                                <hr>
                                <div id="examsFormReact" style="display: none;"></div>
                            </div>

                            <div class="tab-pane fade" id="incapacidadesClinicasTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Incapacidades clínicas</h4>
                                    <button id="btnAgregarIncapacidad" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar incapacidad
                                    </button>
                                    <button id="btnCancelarIncapacidad" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                                    </button>
                                </div>
                                <hr>
                                <div id="contenidoIncapacidad" style="display: none;">
                                    <?php include "../Incapacidades/formIncapacidad.php"; ?>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="recetasTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Recetas médicas</h4>
                                    <button id="btnAgregarReceta" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar receta
                                    </button>
                                    <button id="btnCancelarReceta" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                                    </button>
                                </div>
                                <br>
                                <div class="col-12" id="lastRecipe" style="display: none;">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="lastRecipeSwitch" />
                                        <label class="form-check-label" for="lastRecipeSwitch">Agregar última
                                            receta</label>
                                    </div>
                                </div>
                                <hr>
                                <div id="prescriptionFormReact" style="display: none;">
                                </div>
                            </div>

                            <div class="tab-pane fade" id="recetasOptometriaTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Recetas optometría</h4>
                                    <button id="btnAgregarRecetaOptometria" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar receta
                                    </button>
                                    <button id="btnCancelarRecetaOptometria" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                                    </button>
                                </div>
                                <br>
                                <hr>
                                <div id="contenidoRecetaOptometria" style="display: none;">
                                    <?php include "../Recetas/formRecetaOptometria.php"; ?>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="vacunasTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Vacunas</h4>
                                    <button id="btnAgregarVacuna" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar vacuna
                                    </button>
                                    <button id="btnCancelarVacuna" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                                    </button>
                                </div>
                                <hr>
                                <div id="contenidoVacuna" style="display: none;">
                                    <?php include "../vacunas/formVacunas.php"; ?>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="remisionesTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Remisión</h4>
                                    <button id="btnAgregarRemision" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar remisión
                                    </button>
                                    <button id="btnCancelarRemision" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                                    </button>
                                </div>
                                <hr>
                                <div id="remisionFormReact" style="display: none;"></div>
                            </div>

                            <div class="tab-pane fade" id="citaTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Cita</h4>
                                    <button id="btnCrearCita" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Crear cita
                                    </button>
                                    <button id="btnCancelarCita" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar cita
                                    </button>
                                </div>
                                <hr>
                                <div id="contenidoCita" style="display: none;">
                                    <?php
                                    include '../Citas/disponibilidadCitas.php';
                                    ?>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="turnosTab" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>Turnos</h4>
                                    <button id="btnGenerarTurno" class="btn btn-primary" type="button">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Generar turno
                                    </button>
                                    <button id="btnCancelarTurno" class="btn btn-danger" type="button"
                                        style="display: none;">
                                        <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                                    </button>
                                </div>
                                <hr>
                                <div id="generateTicketReact" style="display: none;"></div>
                            </div>

                        </div>
                    </div>
                </div>

                <p class="fs-9 text-danger">Antes de finalizar la consulta por favor complete la siguiente información:
                </p>

                <!-- Sección: Motivo & Observaciones de la consulta -->
                <form class="needs-validation" novalidate>
                    <!-- Sección: RIPS -->
                    <h6 class="mt-4 mb-3">Diagnósticos</h6>
                    <div class="mb-2">
                        <!-- <label class="form-check-label" for="gneraRipsCheck">Generar Rips</label> -->

                        <div id="generarRips">

                            <!-- <div class="form-floating mb-3">
                <select class="form-select" id="tipoRip" required>
                  <option value="" selected disabled>Seleccione</option>
                  <option value="consulta">Consulta</option>
                  <option value="procedimiento">Procedimiento</option>
                </select>
                <label for="tipoRip">Tipo de RIPS *</label>
                <div class="invalid-feedback">Por favor seleccione el tipo de RIPS.</div>
              </div> -->

                            <!-- <div class="form-floating mb-3">
                <select class="form-select" id="tipoConsulta">
                  <option value="" selected disabled>Seleccione</option>
                  <option value="control">Control</option>
                  <option value="urgencia">Urgencia</option>
                  <option value="primera_vez">Primera vez</option>
                  <option value="seguimiento">Seguimiento</option>
                </select>
                <label for="tipoConsulta">Tipo de consulta</label>
              </div> -->

                            <!-- Diagnóstico principal -->
                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <select class="form-select" id="diagnosticoPrincipal" required>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <select class="form-select" id="tipoDiagnostico"
                                            style="min-height: 40px; height: 40px; padding: 0 20px; color: #989ba4">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Diagnósticos relacionados -->
                            <div class="row g-3 mb-3">
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <select class="form-select" id="diagnosticoRel1">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <select class="form-select" id="diagnosticoRel2">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <select class="form-select" id="diagnosticoRel3">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Finalidad de consulta -->
                            <!-- <div class="form-floating mb-3">
                <select class="form-select" id="finalidadConsulta">
                  <option value="" selected disabled>Seleccione</option>
                  <option value="promocion">Promoción</option>
                  <option value="prevencion">Prevención</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="rehabilitacion">Rehabilitación</option>
                </select>
                <label for="finalidadConsulta">Finalidad de consulta</label>
              </div> -->

                            <!-- Causa externa -->
                            <!-- <div class="form-floating mb-3">
                <select class="form-select" id="causaExterna">
                  <option value="" selected disabled>Seleccione</option>
                  <option value="otra">Otra</option>
                  <option value="no_aplica">No aplica</option>
                </select>
                <label for="causaExterna">Causa externa</label>
              </div> -->

                            <!-- Número de autorización -->
                            <!-- <div class="form-floating mb-3">
                <input type="text" class="form-control" id="numeroAutorizacion" placeholder="Número de autorización">
                <label for="numeroAutorizacion">Número de autorización</label>
              </div> -->
                            <h6 class="mb-3">Plan de tratamiento</h6>
                            <div class="form-floating mb-3" style="z-index: 0">
                                <textarea required class="rich-text" id="motivo" rows="3"></textarea>
                                <!-- <label for="motivo">Plan de tratamiento</label> -->
                                <div class="invalid-feedback">Por favor llene el motivo de consulta.</div>
                            </div>
                </form>
            </div>
        </div>

        <div class="modal-footer d-flex justify-content-between">
            <!-- <span class="timer text-danger">Tiempo en consulta: <span id="modalTimerDisplay">00:00:00</span></span> -->


            <script>
                let start = new Date().getTime();
                let timerInterval;
                let tiempoTranscurrido = 0;

                function formatTime(totalSegundos) {
                    let horas = Math.floor(totalSegundos / 3600);
                    let remainingSeconds = totalSegundos % 3600;
                    let minutos = Math.floor(remainingSeconds / 60);
                    let segundos = remainingSeconds % 60;
                    return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
                }

                function iniciarCronometro() {
                    timerInterval = setInterval(() => {
                        let now = new Date().getTime();
                        tiempoTranscurrido = Math.floor((now - start) / 1000);
                        document.getElementById("timer").textContent =
                            formatTime(tiempoTranscurrido);
                    }, 1000);
                }

                document.addEventListener("DOMContentLoaded", function() {
                    iniciarCronometro();
                });

                // document.getElementById("btnCloseFinish").addEventListener("click", function() {
                //     const tiempoActual = formatTime(tiempoTranscurrido);
                // })
                // let startTime = 0;
                // let intervalId = 0;

                // function startTimer() {
                //     startTime = Date.now();
                //     intervalId = setInterval(function() {
                //         const elapsedTime = Date.now() - startTime;
                //         const h = Math.floor(elapsedTime / 1000 / 60 / 60);
                //         const m = Math.floor(elapsedTime / 1000 / 60) % 60;
                //         const s = Math.floor(elapsedTime / 1000) % 60;
                //         // document.getElementById('modalTimerDisplay').innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                //     }, 1000);
                // }

                // function stopTimer() {
                //     clearInterval(intervalId);
                // }

                // document.addEventListener('DOMContentLoaded', function() {
                //     startTimer();
                // });
            </script>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Volver</button>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-primary" id="finalizarConsulta">Finalizar consulta</button>
            </div>

        </div>
    </div>
</div>
</div>
<script type="module">
    import {
        getUserLogged
    } from './services/utilidades.js';


    document.addEventListener('DOMContentLoaded', function() {

        let userLogged = getUserLogged();
        const cie11 = userLogged.specialty.specializables.filter(item => item.specializable_type == "CIE-11")
        cargarCie11(cie11)
        cargarTipoDiagnostico();
    })

    function cargarTipoDiagnostico() {
        const tipoDiagnostico = document.getElementById('tipoDiagnostico');

        const options = [{
                value: '',
                text: 'Seleccione',
                disabled: true,
                selected: true
            },
            {
                value: 'definitivo',
                text: 'Definitivo'
            },
            {
                value: 'presuntivo',
                text: 'Presuntivo'
            },
            {
                value: 'diferencial',
                text: 'Diferencial'
            }
        ];

        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            if (optionData.disabled) option.disabled = true;
            if (optionData.selected) option.selected = true;
            tipoDiagnostico.appendChild(option);
        });
    }

    function cargarCie11(cie11) {

        // Obtenemos referencias a todos los selects
        const selects = [
            document.getElementById('diagnosticoPrincipal'),
            document.getElementById('diagnosticoRel1'),
            document.getElementById('diagnosticoRel2'),
            document.getElementById('diagnosticoRel3'),
        ];

        // Limpiamos y configuramos cada select
        selects.forEach(select => {
            // Limpiar el select
            select.innerHTML = '';

            if (cie11.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.text = 'Esta especialidad no tiene CIE-11';
                select.appendChild(option);
            } else {
                // Opción por defecto (placeholder)
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.text = 'Seleccione CIE-11';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

                // Agregar opciones de CIE-11
                cie11.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.specializable_id + ' - ' + item.description;
                    option.text = item.description || item.specializable_id;
                    select.appendChild(option);
                });
            }
        });
        configurarSelectCie11();
    }

    function configurarSelectCie11() {
        // Obtenemos todas las referencias a selects
        const selects = [
            document.getElementById('diagnosticoPrincipal'),
            document.getElementById('diagnosticoRel1'),
            document.getElementById('diagnosticoRel2'),
            document.getElementById('diagnosticoRel3'),
        ];

        // Verificamos una sola vez si Choices está definido
        if (typeof Choices === 'undefined') return;

        // Configuramos cada select con Choices
        selects.forEach(select => {
            new Choices(select, {
                removeItemButton: true,
                placeholder: true
            });
        });
    }
</script>

<script>
    const especialidad = new URLSearchParams(window.location.search).get("especialidad").normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    // if (especialidad === "oftalmologia") {
    if (especialidad === "optometria") {
        document.getElementById('tabRecetas').style.display = 'none';
        document.getElementById('tabRecetasOptometria').style.display = 'block';
    } else {
        document.getElementById('tabRecetas').style.display = 'block';
        document.getElementById('tabRecetasOptometria').style.display = 'none';
    }
    // const tipoHistoria = new URLSearchParams(window.location.search).get("tipo_historia");
    // if (tipoHistoria === "historiaOptometriaD") {
    //     document.getElementById('tabRecetas').style.display = 'none';
    //     document.getElementById('tabRecetasOptometria').style.display = 'block';
    // } else {
    //     document.getElementById('tabRecetas').style.display = 'block';
    //     document.getElementById('tabRecetasOptometria').style.display = 'none';
    // }

    document.getElementById('btnAgregarIncapacidad').addEventListener('click', function() {
        document.getElementById('contenidoIncapacidad').style.display = 'block';
        document.getElementById('btnAgregarIncapacidad').style.display = 'none';
        document.getElementById('btnCancelarIncapacidad').style.display = 'block';
    });
    document.getElementById('btnCancelarIncapacidad').addEventListener('click', function() {
        document.getElementById('contenidoIncapacidad').style.display = 'none';
        document.getElementById('btnCancelarIncapacidad').style.display = 'none';
        document.getElementById('btnAgregarIncapacidad').style.display = 'block';
    });

    document.getElementById('btnAgregarReceta').addEventListener('click', function() {
        document.getElementById('prescriptionFormReact').style.display = 'block';
        document.getElementById('lastRecipe').style.display = 'block';
        document.getElementById('btnAgregarReceta').style.display = 'none';
        document.getElementById('btnCancelarReceta').style.display = 'block';
    });
    document.getElementById('btnCancelarReceta').addEventListener('click', function() {
        document.getElementById('prescriptionFormReact').style.display = 'none';
        document.getElementById('lastRecipe').style.display = 'none';
        document.getElementById('btnCancelarReceta').style.display = 'none';
        document.getElementById('btnAgregarReceta').style.display = 'block';
    });

    document.getElementById('btnAgregarRecetaOptometria').addEventListener('click', function() {
        document.getElementById('btnCancelarRecetaOptometria').style.display = 'block';
        document.getElementById('btnAgregarRecetaOptometria').style.display = 'none';
        document.getElementById('contenidoRecetaOptometria').style.display = 'block';
    });
    document.getElementById('btnCancelarRecetaOptometria').addEventListener('click', function() {
        document.getElementById('btnCancelarRecetaOptometria').style.display = 'none';
        document.getElementById('btnAgregarRecetaOptometria').style.display = 'block';
        document.getElementById('contenidoRecetaOptometria').style.display = 'none';
    });

    document.getElementById('btnAgregarVacuna').addEventListener('click', function() {
        document.getElementById('contenidoVacuna').style.display = 'block';
        document.getElementById('btnAgregarVacuna').style.display = 'none';
        document.getElementById('btnCancelarVacuna').style.display = 'block';
    });
    document.getElementById('btnCancelarVacuna').addEventListener('click', function() {
        document.getElementById('contenidoVacuna').style.display = 'none';
        document.getElementById('btnCancelarVacuna').style.display = 'none';
        document.getElementById('btnAgregarVacuna').style.display = 'block';
    });

    document.getElementById('btnAgregarRemision').addEventListener('click', function() {
        document.getElementById('remisionFormReact').style.display = 'block';
        document.getElementById('btnAgregarRemision').style.display = 'none';
        document.getElementById('btnCancelarRemision').style.display = 'block';
    });
    document.getElementById('btnCancelarRemision').addEventListener('click', function() {
        document.getElementById('remisionFormReact').style.display = 'none';
        document.getElementById('btnCancelarRemision').style.display = 'none';
        document.getElementById('btnAgregarRemision').style.display = 'block';
    });
    document.getElementById('btnAgregarExamenes').addEventListener('click', function() {
        document.getElementById('examsFormReact').style.display = 'block';
        document.getElementById('btnAgregarExamenes').style.display = 'none';
        document.getElementById('btnCancelarExamenes').style.display = 'block';
    });
    document.getElementById('btnCancelarExamenes').addEventListener('click', function() {
        document.getElementById('examsFormReact').style.display = 'none';
        document.getElementById('btnCancelarExamenes').style.display = 'none';
        document.getElementById('btnAgregarExamenes').style.display = 'block';
    });

    document.getElementById('btnCrearCita').addEventListener('click', function() {
        document.getElementById('contenidoCita').style.display = 'block';
        document.getElementById('btnCrearCita').style.display = 'none';
        document.getElementById('btnCancelarCita').style.display = 'block';
    });
    document.getElementById('btnCancelarCita').addEventListener('click', function() {
        document.getElementById('contenidoCita').style.display = 'none';
        document.getElementById('btnCancelarCita').style.display = 'none';
        document.getElementById('btnCrearCita').style.display = 'block';
    });

    document.getElementById('btnGenerarTurno').addEventListener('click', async function() {
        const patientId = new URLSearchParams(window.location.search).get('patient_id');
        document.getElementById('generateTicketReact').style.display = 'block';
        document.getElementById('btnGenerarTurno').style.display = 'none';
        document.getElementById('btnCancelarTurno').style.display = 'block';
        const dataPaciente = await obtenerDatosPorId('patients', patientId);
        document.querySelector('input[placeholder="Ingrese identificación"]').value = dataPaciente
            .document_number;
        // document.querySelector('.input-group button').disabled = false;
        // document.querySelector('.input-group button').click();

    });
    document.getElementById('btnCancelarTurno').addEventListener('click', function() {
        document.getElementById('generateTicketReact').style.display = 'none';
        document.getElementById('btnCancelarTurno').style.display = 'none';
        document.getElementById('btnGenerarTurno').style.display = 'block';
    });
</script>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import PrescriptionForm from './react-dist/prescriptions/components/PrescriptionForm.js';
    import {
        remissionsForm
    } from './react-dist/remissions/RemissionsForm.js';
    import {
        ExamForm
    } from './react-dist/exams/components/ExamForm.js';
    import {
        packagesService,
        clinicalRecordService,
        clinicalRecordTypeService,
        appointmentService,
        prescriptionService
    } from "./services/api/index.js";
    import {
        AlertManager
    } from "./services/alertManager.js";
    import UserManager from "./services/userManager.js";
    import {
        LeavingConsultationGenerateTicket
    } from './react-dist/tickets/LeavingConsultationGenerateTicket.js';
    import {
        FinishClinicalRecordModal
    } from './react-dist/clinical-records/FinishClinicalRecordModal.js';

    import {
        getUserLogged
    } from './services/utilidades.js';

    const clinicalRecordModalRef = React.createRef();
    const prescriptionFormRef = React.createRef();
    const remissionFormRef = React.createRef();
    const examFormRef = React.createRef();
    const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');
    let currentAppointment = null;

    document.addEventListener('DOMContentLoaded', async function() {
        currentAppointment = await appointmentService.get(appointmentId);
    });

    ReactDOMClient.createRoot(document.getElementById('clinicalRecordModalRoot')).render(React.createElement(
        FinishClinicalRecordModal, {
            ref: clinicalRecordModalRef,
            externalDynamicData: basicCaptureFormValues(formData.form1),
            onClose: () => {
                ReactDOMClient.createRoot(document.getElementById('clinicalRecordModalRoot')).unmount();
            }
        }));

    ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React.createElement(
        PrescriptionForm, {
            ref: prescriptionFormRef,
            formId: 'createPrescription',
            handleSubmit: (medicines) => {}
        }));
    ReactDOMClient.createRoot(document.getElementById('remisionFormReact')).render(React.createElement(remissionsForm, {
        ref: remissionFormRef,
    }));
    ReactDOMClient.createRoot(document.getElementById('examsFormReact')).render(React.createElement(ExamForm, {
        ref: examFormRef
    }));

    ReactDOMClient.createRoot(document.getElementById('generateTicketReact')).render(React.createElement(
        LeavingConsultationGenerateTicket));

    document.getElementById('lastRecipeSwitch').addEventListener('change', async function() {

        const patientId = new URLSearchParams(window.location.search).get('patient_id');

        if (this.checked) {
            const lastRecipe = await prescriptionService.getLastByPatientId(patientId);
            ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React
                .createElement(PrescriptionForm, {
                    ref: prescriptionFormRef,
                    initialData: {
                        medicines: lastRecipe.data.recipe_items
                    },
                    formId: 'createPrescription',
                    handleSubmit: () => {}
                }));
        } else {
            ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React
                .createElement(PrescriptionForm, {
                    ref: prescriptionFormRef,
                    initialData: {
                        medicines: []
                    },
                    formId: 'createPrescription',
                    handleSubmit: () => {}
                }));
        }
    });

    function obtenerEstadoRecetas() {
        if (prescriptionFormRef.current) {
            const estado = prescriptionFormRef.current.getFormData();
            return estado;
        }
    }

    function obtenerEstadoRemisiones() {
        if (remissionFormRef.current) {
            const estado = remissionFormRef.current.getFormData();
            return estado;
        }
    }

    function obtenerEstadoExamenes() {
        if (examFormRef.current) {
            const estado = examFormRef.current.getFormData();
            return estado;
        }
    }

    let dataIncapacidad = {}

    const [packages, clinicalRecordTypes] = await Promise.all([
        packagesService.getPackagesByExams(),
        clinicalRecordTypeService.getAll()
    ]);
    const urlClinicalRecordType = new URLSearchParams(window.location.search).get("tipo_historia");
    const currentClinicalRecordType = clinicalRecordTypes.find((type) => type.key_ === urlClinicalRecordType);

    const formIncapacidad = document.getElementById('formCrearIncapacidad');
    const getDataFromFormIncapacidad = () => {
        let userLogged = getUserLogged();
        const formData = new FormData(formIncapacidad);
        dataIncapacidad = {};
        for (const pair of formData.entries()) {
            if (pair[0] === 'user_id') {
                if (!dataIncapacidad.hasOwnProperty('user_id')) {
                    dataIncapacidad['user_id'] = (userLogged.id).toString();
                }
            } else {
                dataIncapacidad[pair[0]] = pair[1];
            }
        }
        return dataIncapacidad;
    }

    const formRecetaOptometria = document.getElementById('formRecetaOptometria');

    function getDataFormRecetaOptometria() {
        const formDataOpt = new FormData(formRecetaOptometria);
        let dataRecetaOptometria = {};
        for (const pair of formDataOpt.entries()) {
            dataRecetaOptometria[pair[0]] = pair[1];
        }

        const camposQueratometria = [
            "queratometriaOjoDerecho",
            "esferaOjoDerecho",
            "cilindroOjoDerecho",
            "ejeOjoDerecho",
            "adicionOjoDerecho",
            "alturaOjoDerecho",
            "dpOjoDerecho",
            "queratometriaOjoIzquierdo",
            "esferaOjoIzquierdo",
            "cilindroOjoIzquierdo",
            "ejeOjoIzquierdo",
            "adicionOjoIzquierdo",
            "alturaOjoIzquierdo",
            "dpOjoIzquierdo"
        ]

        camposQueratometria.forEach(campo => {
            dataRecetaOptometria[campo] = document.getElementById(campo).value
        })

        return dataRecetaOptometria;
    }

    const params = new URLSearchParams(window.location.search);
    const jsonPath = `../../ConsultasJson/${params.get("tipo_historia")}.json`;

    const response = await fetch(jsonPath);
    const formData = await response.json();

    let formValues = {}

    document.getElementById("herramientasIABtn").addEventListener("click", function() {})

    document.getElementById("finalizarConsulta").addEventListener("click", function() {

        const valueCie11 = document.getElementById("diagnosticoPrincipal").value;
        const typeCie11 = document.getElementById("tipoDiagnostico").value;

        if (valueCie11 == "") {
            AlertManager.error({
                title: "Error",
                text: "Debe seleccionar un diagnostico principal"
            })
            return;
        }

        if (typeCie11 == "") {
            AlertManager.error({
                title: "Error",
                text: "Debe seleccionar un tipo de diagnostico"
            })
            return;
        }

        const especialidad = new URLSearchParams(window.location.search).get('especialidad').normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
        captureFormValues(formData.form1);
        const dataIncapacidad = getDataFromFormIncapacidad();
        let dataRecetas = "";
        if (especialidad == "oftalmologia") {
            dataRecetas = getDataFormRecetaOptometria();
        } else {
            dataRecetas = obtenerEstadoRecetas();
        }
        const dataRemisiones = obtenerEstadoRemisiones();
        const dataExamenes = obtenerEstadoExamenes();
        const dataVacunas = capturarDatosVacunas();
        const tiempoConsulta = formatTime(tiempoTranscurrido);
        const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');
        const patientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(
            window.location.search).get('id') || 0;
        // const tipoHistoria = new URLSearchParams(window.location.search).get("tipo_historia");
        // if (tipoHistoria == "historiaOptometriaD") {
        //     data['recipes'] = {
        //         user_id: UserManager.getUser().id,
        //         patient_id: patientId,
        //         medicines: dataRecetas,
        //         is_active: true,
        //         type: 'general'
        //     }
        // }


        const planTratamiento = tinymce.get("motivo");

        let data = {
            "appointment_id": appointmentId,
            "clinical_record_type_id": currentClinicalRecordType.id,
            "created_by_user_id": UserManager.getUser().id,
            "description": planTratamiento.getContent(),
            "branch_id": 1,
            "data": captureFormValues(formData.form1),
            "consultation_duration": tiempoConsulta,
            "exam_recipes": dataExamenes,
            "patient_disabilities": dataIncapacidad,
            "recipe": dataRecetas,
            "remissions": dataRemisiones,
            "exam_vaccines": dataVacunas,
            // "vaccine_applications": dataVacunas
        }

        const hasDisplayNone = (id) => {
            const element = document.getElementById(id);
            return window.getComputedStyle(element).display === 'none';
        }

        if (!hasDisplayNone('contenidoIncapacidad')) {
            data['patient_disability'] = dataIncapacidad;
        }

        if (!hasDisplayNone('examsFormReact')) {
            data['exam_order'] = dataExamenes.map(examen => ({
                "patient_id": patientId,
                "exam_order_state_id": 1,
                "exam_order_item_id": examen.id,
                "exam_order_item_type": "exam_type"
            }));
        }

        if (!hasDisplayNone('prescriptionFormReact')) {
            data['recipe'] = {
                user_id: UserManager.getUser().id,
                patient_id: patientId,
                medicines: dataRecetas,
                is_active: true,
                type: 'general'
            };
        }

        if (!hasDisplayNone('contenidoRecetaOptometria')) {
            data['recipe'] = {
                user_id: UserManager.getUser().id,
                patient_id: patientId,
                optometry: dataRecetas,
                is_active: true,
                type: 'optometry'
            };
        }

        if (!hasDisplayNone('remisionFormReact')) {
            data['remission'] = dataRemisiones;
        }

        if (!hasDisplayNone('contenidoVacuna')) {
            capturarDatosVacunas();
        }

        function getPurpuse(purpuse) {

            switch (purpuse) {
                case "Tratamiento":
                    return "TREATMENT";
                    break;
                case "Promoción":
                    return "PROMOTION";
                    break;
                case "Rehabilitación":
                    return "REHABILITATION";
                    break;
                case "Prevención":
                    return "PREVENTION";
                    break;
            }

        }
        const requestDataAppointments = {
            assigned_user_specialty_id: currentAppointment.user_availability.user.user_specialty_id,
            appointment_date: document.getElementById('fechaCita').value,
            appointment_time: document.getElementById('appointment_time').value + ':00',
            assigned_user_availability_id: currentAppointment.assigned_user_availability_id,
            attention_type: currentAppointment.attention_type,
            product_id: currentAppointment.product_id,
            consultation_purpose: getPurpuse(currentAppointment.consultation_purpose),
            consultation_type: "FOLLOW_UP",
            external_cause: "OTHER",
            frecuenciaCita: "",
            numRepeticiones: 0,
            selectPaciente: currentAppointment.patient_id,
            telefonoPaciente: currentAppointment.patient.whatsapp,
            correoPaciente: currentAppointment.patient.email,
            patient_id: currentAppointment.patient_id,
            appointment_state_id: currentAppointment.appointment_state_id,
            assigned_user_id: document.getElementById('assigned_user_availability_id').value,
            created_by_user_id: currentAppointment.created_by_user_id,
            duration: currentAppointment.user_availability.appointment_duration,
            branch_id: currentAppointment.user_availability.branch_id,
            phone: currentAppointment.patient.whatsapp,
            email: currentAppointment.patient.email
        };

        if (!hasDisplayNone('contenidoCita')) {
            appointmentService
                .createForParent(requestDataAppointments.patient_id, requestDataAppointments)
                .then((response) => {})
                .catch((err) => {

                });
        }

        console.log(data);

        clinicalRecordService.clinicalRecordsParamsStore(patientId, data)
            .then(async (response) => {
                await appointmentService.changeStatus(appointmentId, 'consultation_completed')
                    .then((res) => {
                        createHistoryMessage(response.clinical_record.id, response.clinical_record
                            .patient_id).then(() => {
                            Swal.fire({
                                icon: "success",
                                title: "Se ha creado el registro exitosamente",
                                text: "Por favor espere un momento mientras se envía el mensaje",
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            }).then(() => {
                                $("#modalCrearCita").modal("hide");
                                const patientId = new URLSearchParams(window.location
                                        .search).get('patient_id') ||
                                    new URLSearchParams(window.location.search).get(
                                        'id') || 0;
                                const especialidad = new URLSearchParams(window.location
                                        .search).get('especialidad') ||
                                    'medicina_general';
                                //window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${especialidad}`;
                            });
                        })
                    })
                AlertManager.success({
                    text: 'Se ha creado el registro exitosamente'
                })
                $("#finishModal").modal('hide');
                setTimeout(() => {
                    const patientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || 0;
                    const especialidad = new URLSearchParams(window.location.search).get('especialidad') || 'medicina_general';
                    //window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${especialidad}`;
                }, 1000);
            }).catch(err => {
                if (err.data?.errors) {
                    AlertManager.formErrors(err.data.errors);
                } else {
                    AlertManager.error({
                        text: err.message || 'Ocurrió un error inesperado'
                    });
                }
            });
    });

    function capturarDatosVacunas() {
        const tablaVacunas = document.getElementById("tablaVacunas");

        if (!tablaVacunas) {
            return;
        }

        const filas = tablaVacunas.querySelectorAll("tbody tr");
        const dataVacunas = [];

        filas.forEach(fila => {
            const celdas = fila.querySelectorAll("td");

            if (celdas.length >= 2) {
                const nombreVacuna = celdas[0].textContent.trim();
                const inputDosis = celdas[1].querySelector("input");
                const esquema = celdas[2].querySelector("input").value;
                const refuerzo = celdas[3].querySelector("input").value;

                if (inputDosis) {
                    const dosis = inputDosis.value;

                    if (dosis && dosis > 0) {
                        dataVacunas.push({
                            nombre: nombreVacuna,
                            dosis: parseInt(dosis),
                            scheme: esquema,
                            booster_frequency: refuerzo
                        });
                    }
                }
            }
        });

        return dataVacunas;
    }

    function guardarResumengenerado() {
        let resumenHistoria = "";
        if (responseIA && responseIA.aprobar === true) {
            resumenHistoria = responseIA.resumenHistoria;
        }
        return resumenHistoria;
    }

    function basicCaptureFormValues(formData) {
        const formValues = {
            tabsStructure: [],
            values: {}
        };

        formData.tabs.forEach((tab, tabIndex) => {
            const tabInfo = {
                tabName: tab.tab,
                tabOrder: tabIndex,
                cards: []
            };

            Object.keys(tab).forEach(key => {
                if (key.startsWith('card') && Array.isArray(tab[key])) {
                    const cardArray = tab[key];

                    cardArray.forEach((card, cardIndex) => {
                        const cardInfo = {
                            cardTitle: card.title || '',
                            cardOrder: cardIndex,
                            fields: []
                        };

                        if (card.fields && Array.isArray(card.fields)) {
                            card.fields.forEach(field => {
                                // Información básica del campo
                                const fieldInfo = {
                                    id: field.id,
                                    name: field.name,
                                    type: field.type,
                                    label: field.label || ''
                                };

                                // Incluir toggleFields en la estructura si es un checkbox y los tiene
                                if (field.type === "checkbox" && field.toggleFields) {
                                    fieldInfo.toggleFields = field.toggleFields.map(
                                        toggleField => ({
                                            type: toggleField.type,
                                            id: toggleField.id,
                                            name: toggleField.name,
                                            label: toggleField.label || ''
                                        }));
                                }

                                // Capturar valores
                                if (field.type === "checkbox" && document.getElementById(field.id)?.checked) {
                                    formValues.values[field.name] = document.getElementById(field.id).checked;

                                    if (field.toggleFields) {
                                        field.toggleFields.forEach(toggleField => {
                                            if (toggleField.type === "select") {
                                                formValues.values[toggleField.name] = document.getElementById(toggleField.id)?.value;
                                            } else if (toggleField.type === "textarea") {
                                                const editor = tinymce.get(toggleField.id);
                                                if (editor) {
                                                    formValues.values[toggleField.name] = editor.getContent();
                                                }
                                            } else if (toggleField.type === "radio") {
                                                const radioGroup = document.getElementsByName(toggleField.name);
                                                let selectedValue = null;
                                                let selectedText = null;

                                                for (let i = 0; i < radioGroup.length; i++) {
                                                    if (radioGroup[i].checked) {
                                                        selectedValue = radioGroup[i].value;
                                                        const selectedOption = toggleField.options?.find(
                                                            opt => opt.value === selectedValue);
                                                        selectedText = selectedOption?.text || '';
                                                        break;
                                                    }
                                                }

                                                formValues.values[toggleField.name] = {
                                                    value: selectedValue,
                                                    text: selectedText
                                                };
                                            }
                                        });
                                    }
                                } else if (field.type === "radio") {
                                    const radioGroup = document.getElementsByName(field.name);
                                    let selectedValue = null;
                                    let selectedText = null;

                                    // Buscar la opción seleccionada
                                    for (let i = 0; i < radioGroup.length; i++) {
                                        if (radioGroup[i].checked) {
                                            selectedValue = radioGroup[i].value;
                                            // Obtener el texto correspondiente de las opciones del campo
                                            const selectedOption = field.options?.find(
                                                opt => opt.value === selectedValue);
                                            selectedText = selectedOption?.text || '';
                                            break;
                                        }
                                    }

                                    // Almacenar objeto con value y text en values
                                    formValues.values[field.name] = {
                                        value: selectedValue,
                                        text: selectedText
                                    };
                                } else if (field.type !== "checkbox") {
                                    const element = document.getElementById(field.id);
                                    if (element) {
                                        const fieldValue = element.value;

                                        if (fieldValue) {
                                            const fieldUnits = {
                                                peso: " Lbs",
                                                altura: " cm",
                                                imc: " kg/m²",
                                                porcentajeGrasaCorporal: " %",
                                                tensionDiastólica: " mmHg",
                                                tensionSistólica: " mmHg",
                                                tensionDiastolica: " mmHg",
                                                tensionSistolica: " mmHg",
                                                tensionArterialMedia: " mmHg",
                                                saturacion: " %",
                                                circunferenciaAbdominal: " cm",
                                                circunferenciaCintura: " cm",
                                                perimetroCefalico: " cm",
                                                frecuenciaRespiratoria: " rpm",
                                                frecuenciaCardiaca: " lpm",
                                                temperatura: " °C",
                                                glucemia: " mg/dL"
                                            };

                                            if (fieldUnits.hasOwnProperty(field.id)) {
                                                formValues.values[field.name] = fieldValue + fieldUnits[field.id];
                                            } else {
                                                formValues.values[field.name] = fieldValue;
                                            }
                                        }
                                    }

                                    const editor = tinymce.get(field.id);
                                    if (editor) {
                                        formValues.values[field.name] = editor.getContent();
                                    }
                                }

                                cardInfo.fields.push(fieldInfo);
                            });
                        }

                        tabInfo.cards.push(cardInfo);
                    });
                }
            });

            formValues.tabsStructure.push(tabInfo);
        });

        return formValues;
    }

    function captureFormValues(formData) {
        const dataIncapacidad = getDataFromFormIncapacidad();
        const especialidad = new URLSearchParams(window.location.search).get('especialidad').normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();;
        let dataRecetas = "";
        if (especialidad == "oftalmologia") {
            dataRecetas = getDataFormRecetaOptometria();
        } else {
            dataRecetas = obtenerEstadoRecetas();
        }
        const dataRemisiones = obtenerEstadoRemisiones();
        const dataExamenes = obtenerEstadoExamenes();
        const dataVacunas = capturarDatosVacunas();
        const fechaCita = document.getElementById('fechaCita').value || null;
        const horaCita = document.getElementById('appointment_time').value || null;
        const doctorCita = document.getElementById('assigned_user_availability_id').value || null;

        const resumenGenerado = guardarResumengenerado();

        const notasMedicas = {
            exists: false,
            registros: []
        };

        const observacionesPostQuirurgicas = {
            exists: false,
            registros: []
        };

        const informeMensualTrimestral = {
            exists: false,
            registros: []
        };

        const tablaNotes = document.getElementById('tablaNotes');
        if (tablaNotes) {
            notasMedicas.exists = true;
            const filas = tablaNotes.querySelectorAll('tbody tr');

            filas.forEach((fila, index) => {
                const celdas = fila.querySelectorAll('td');
                if (celdas.length >= 4) {
                    notasMedicas.registros.push({
                        index: index + 1,
                        fechaHora: celdas[1].textContent.trim(),
                        medicamento: celdas[2].textContent.trim(),
                        observaciones: celdas[3].textContent.trim()
                    });
                }
            });
        }

        const tablaObservaciones = document.getElementById('tablaObservaciones');
        if (tablaObservaciones) {
            observacionesPostQuirurgicas.exists = true;
            const filas = tablaObservaciones.querySelectorAll('tbody tr');

            filas.forEach((fila, index) => {
                const celdas = fila.querySelectorAll('td');
                if (celdas.length >= 3) {
                    observacionesPostQuirurgicas.registros.push({
                        index: index + 1,
                        fechaHora: celdas[1].textContent.trim(),
                        observacion: celdas[2].textContent.trim()
                    });
                }
            });
        }

        const tablaInforme = document.getElementById('tablaInforme');
        if (tablaInforme) {
            informeMensualTrimestral.exists = true;
            const filas = tablaInforme.querySelectorAll('tbody tr');

            filas.forEach((fila, index) => {
                const celdas = fila.querySelectorAll('td');
                if (celdas.length >= 3) {
                    informeMensualTrimestral.registros.push({
                        index: index + 1,
                        tipoTitulo: celdas[1].textContent.trim(),
                        detalle: celdas[2].textContent.trim()
                    });
                }
            });
        }

        const formValues = {
            tabsStructure: [],
            values: {},
            rips: {
                diagnosticoPrincipal: document.getElementById('diagnosticoPrincipal')?.value || 'null',
                tipoDiagnostico: document.getElementById('tipoDiagnostico')?.value || 'null',
                diagnosticoRel1: document.getElementById('diagnosticoRel1')?.value || 'null',
                diagnosticoRel2: document.getElementById('diagnosticoRel2')?.value || 'null',
                diagnosticoRel3: document.getElementById('diagnosticoRel3')?.value || 'null'
            },
            examenes: dataExamenes,
            incapacidad: dataIncapacidad,
            receta: dataRecetas,
            remision: dataRemisiones,
            notasMedicas: notasMedicas,
            observacionesPostQuirurgicas: observacionesPostQuirurgicas,
            informeMensualTrimestral: informeMensualTrimestral,
            cita: {
                fecha: fechaCita,
                hora: horaCita,
                doctor: doctorCita
            }
        };

        formData.tabs.forEach((tab, tabIndex) => {
            const tabInfo = {
                tabName: tab.tab,
                tabOrder: tabIndex,
                cards: []
            };

            Object.keys(tab).forEach(key => {
                if (key.startsWith('card') && Array.isArray(tab[key])) {
                    const cardArray = tab[key];

                    cardArray.forEach((card, cardIndex) => {
                        const cardInfo = {
                            cardTitle: card.title || '',
                            cardOrder: cardIndex,
                            fields: []
                        };

                        if (card.fields && Array.isArray(card.fields)) {
                            card.fields.forEach(field => {
                                // Información básica del campo
                                const fieldInfo = {
                                    id: field.id,
                                    name: field.name,
                                    type: field.type,
                                    label: field.label || ''
                                };

                                // Incluir toggleFields en la estructura si es un checkbox y los tiene
                                if (field.type === "checkbox" && field.toggleFields) {
                                    fieldInfo.toggleFields = field.toggleFields.map(
                                        toggleField => ({
                                            type: toggleField.type,
                                            id: toggleField.id,
                                            name: toggleField.name,
                                            label: toggleField.label || ''
                                        }));
                                }

                                // Capturar valores
                                if (field.type === "checkbox" && document.getElementById(
                                        field.id)?.checked) {
                                    formValues.values[field.name] = document.getElementById(
                                        field.id).checked;

                                    if (field.toggleFields) {
                                        field.toggleFields.forEach(toggleField => {
                                            if (toggleField.type === "select") {
                                                formValues.values[toggleField
                                                        .name] = document
                                                    .getElementById(toggleField.id)
                                                    ?.value;
                                            } else if (toggleField.type ===
                                                "textarea") {
                                                const editor = tinymce.get(
                                                    toggleField.id);
                                                if (editor) {
                                                    formValues.values[toggleField
                                                            .name] = editor
                                                        .getContent();
                                                }
                                            } else if (toggleField.type ===
                                                "radio") {
                                                const radioGroup = document
                                                    .getElementsByName(toggleField
                                                        .name);
                                                let selectedValue = null;
                                                let selectedText = null;

                                                for (let i = 0; i < radioGroup
                                                    .length; i++) {
                                                    if (radioGroup[i].checked) {
                                                        selectedValue = radioGroup[
                                                            i].value;
                                                        const selectedOption =
                                                            toggleField.options
                                                            ?.find(
                                                                opt => opt.value ===
                                                                selectedValue);
                                                        selectedText =
                                                            selectedOption?.text ||
                                                            '';
                                                        break;
                                                    }
                                                }

                                                formValues.values[toggleField
                                                    .name] = {
                                                    value: selectedValue,
                                                    text: selectedText
                                                };
                                            }
                                        });
                                    }
                                } else if (field.type === "radio") {
                                    const radioGroup = document.getElementsByName(field
                                        .name);
                                    let selectedValue = null;
                                    let selectedText = null;

                                    // Buscar la opción seleccionada
                                    for (let i = 0; i < radioGroup.length; i++) {
                                        if (radioGroup[i].checked) {
                                            selectedValue = radioGroup[i].value;
                                            // Obtener el texto correspondiente de las opciones del campo
                                            const selectedOption = field.options?.find(
                                                opt => opt.value === selectedValue);
                                            selectedText = selectedOption?.text || '';
                                            break;
                                        }
                                    }

                                    // Almacenar objeto con value y text en values
                                    formValues.values[field.name] = {
                                        value: selectedValue,
                                        text: selectedText
                                    };
                                } else if (field.type !== "checkbox") {
                                    const element = document.getElementById(field.id);
                                    if (element) {
                                        const fieldValue = element.value;

                                        if (fieldValue) {
                                            const fieldUnits = {
                                                peso: " Lbs",
                                                altura: " cm",
                                                imc: " kg/m²",
                                                porcentajeGrasaCorporal: " %",
                                                tensionDiastólica: " mmHg",
                                                tensionSistólica: " mmHg",
                                                tensionDiastolica: " mmHg",
                                                tensionSistolica: " mmHg",
                                                tensionArterialMedia: " mmHg",
                                                saturacion: " %",
                                                circunferenciaAbdominal: " cm",
                                                circunferenciaCintura: " cm",
                                                perimetroCefalico: " cm",
                                                frecuenciaRespiratoria: " rpm",
                                                frecuenciaCardiaca: " lpm",
                                                temperatura: " °C",
                                                glucemia: " mg/dL"
                                            };

                                            if (fieldUnits.hasOwnProperty(field.id)) {
                                                formValues.values[field.name] = fieldValue +
                                                    fieldUnits[field.id];
                                            } else {
                                                formValues.values[field.name] = fieldValue;
                                            }
                                        }
                                    }

                                    const editor = tinymce.get(field.id);
                                    if (editor) {
                                        formValues.values[field.name] = editor.getContent();
                                    }
                                }

                                cardInfo.fields.push(fieldInfo);
                            });
                        }

                        tabInfo.cards.push(cardInfo);
                    });
                }
            });

            formValues.tabsStructure.push(tabInfo);
        });

        return formValues;
    }

    document.getElementById('diagnosticoPrincipal').addEventListener('change', async function() {
        let packageByCie11 = await packagesService.getPackageByCie11(this.value);

        if (packageByCie11.data.length) {

            document.getElementById("btnAgregarReceta").click();
            document.getElementById("btnAgregarIncapacidad").click();
            document.getElementById("btnAgregarRemision").click();

            const incapacidad = packageByCie11.data[0].package_items.filter(item => item.item_type ==
                'Incapacidad')[0];
            const remision = packageByCie11.data[0].package_items.filter(item => item.item_type == "Remision")[
                0];

            document.getElementById('dias').value = incapacidad.prescription.days_incapacity;
            document.getElementById('reason').value = incapacidad.prescription.reason;
            const today = new Date();
            const daysIncapacity = incapacidad.prescription.days_incapacity;
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + daysIncapacity);
            const formattedEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            document.getElementById('hasta').value = formattedEndDate;

            const mappedData = packageByCie11.data[0].package_items.filter(item => item.item_type ==
                'medicamento' || item.item_type == 'Vacunas').map(item => item.prescription);

            ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React
                .createElement(PrescriptionForm, {
                    ref: prescriptionFormRef,
                    initialData: {
                        medicines: mappedData
                    },
                    formId: 'createPrescription',
                    handleSubmit: () => {}
                }));
        }

    });

    // document.getElementById('aprobarBtn').addEventListener('click', function() {
    //     const responseIA = JSON.parse(document.getElementById("dataIA").value);
    //     document.getElementById("btnAgregarReceta").click();
    //     const mappedDataPrescription = [{
    //         medication: responseIA.tratamientoSugerido.medicacionSugerida[0].nombre,
    //         concentration: responseIA.tratamientoSugerido.medicacionSugerida[0].concentracion,
    //         duration: responseIA.tratamientoSugerido.medicacionSugerida[0].duracion,
    //     }]
    //     ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React
    //         .createElement(PrescriptionForm, {
    //             ref: prescriptionFormRef,
    //             initialData: {
    //                 medicines: mappedDataPrescription
    //             },
    //             formId: 'createPrescription',
    //             handleSubmit: () => {}
    //         }));
    // })
</script>
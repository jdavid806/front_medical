<?php
include "../menu.php";
include "../header.php";
?>

<style type="text/css">
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

    /* Estilos para las tarjetas */
    .card-paciente {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .card-paciente:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .card-paciente .card-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
    }

    .card-paciente .avatar {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
    }

    .card-paciente .badge {
        font-size: 12px;
        margin-bottom: 10px;
    }

    .card-paciente .info-paciente {
        width: 100%;
        text-align: left;
    }

    .card-paciente .info-paciente p {
        margin-bottom: 8px;
        font-size: 14px;
        white-space: normal;
        overflow: visible;

    }

    .card-paciente .btn-ver {
        width: 100%;
        margin-top: auto;
        font-size: 14px;
    }

    /* Estilos para las columnas */
    .info-paciente .row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .info-paciente .col-6 {
        flex: 1 1 45%;
        min-width: 45%;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .card-paciente .avatar {
            width: 60px;
            height: 60px;
        }

        .card-paciente .info-paciente p {
            font-size: 12px;
        }

        .card-paciente .btn-ver {
            font-size: 12px;
        }

        .info-paciente .col-6 {
            flex: 1 1 100%;
            /* En móviles, una columna por fila */
            min-width: 100%;
        }
    }
</style>



<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
                </ol>
            </nav>

            <div class="tab-content mt-3" id="myTabContent">
                <div class="tab-pane fade show active" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="pb-9">
                        <div class="row align-items-center justify-content-between mb-4">
                            <div class="col-md-6">
                                <h2 class="mb-0">Pacientes</h2>
                            </div>
                            <div class="col-md-6 text-md-end">
                                <button class="btn btn-primary" type="button" data-bs-toggle="modal"
                                    data-bs-target="#modalCrearPaciente">
                                    <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo Paciente
                                </button>
                            </div>
                        </div>

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
                                        <div class="row g-3 mb-4">
                                            <div class="col-12 col-md-6">
                                                <label for="searchPaciente" class="form-label">Buscar Paciente</label>
                                                <input type="text" id="searchPaciente" class="form-control"
                                                    placeholder="Buscar por nombre o documento">
                                            </div>
                                            <!-- <div class="col-12 col-md-4">
                                                <label for="fechaRango" class="form-label">Fecha de Última
                                                    Consulta</label>
                                                <input class="form-control datetimepicker" id="fechaRango" type="text"
                                                    placeholder="d/m/y to d/m/y"
                                                    data-options='{"mode":"range","dateFormat":"d/m/y","disableMobile":true}' />
                                            </div> -->
                                            <div class="col-12 col-md-6">
                                                <label for="statusPaciente" class="form-label">Filtrar por
                                                    Estado</label>
                                                <select id="statusPaciente" class="form-select">
                                                    <option value="">Seleccione Estado</option>
                                                    <option value="pending">Pendiente</option>
                                                    <option value="pending_consultation">En espera</option>
                                                    <option value="in_consultation">En proceso</option>
                                                    <option value="consultation_completed">Finalizada</option>
                                                    <option value="cancelled">Cancelada</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="container">
                            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
                                id="pacientesList">
                                <!-- Aquí se generarán las tarjetas de paciente dinámicamente -->
                            </div>
                        </div>

                        <div class="d-flex justify-content-center mt-4" id="paginationControls">
                            <!-- Los botones de paginación se generarán aquí -->
                        </div>
                    </div>
                </div>

                <div class="tab-pane fade" id="tab-profile" role="tabpanel" aria-labelledby="profile-tab"></div>
                <div class="tab-pane fade" id="tab-contact" role="tabpanel" aria-labelledby="contact-tab"></div>
            </div>
        </div>
    </div>
</div>

<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>

<script type="module">
    import {
        patientService,
        appointmentStateService
    } from "../../services/api/index.js";
    import {
        formatDate,
        parseFechaDMY
    } from "../../services/utilidades.js";
    import {
        appointmentStates,
        appointmentStatesColors
    } from "../../services/commons.js";
    import {
        reestructurarPacientes
    } from '../Pacientes/js/reestructurarPacientes.js';

    document.addEventListener("DOMContentLoaded", async () => {

        let pacientesData = await patientService.getByUser();
        const appointmentStates = await appointmentStateService.getAll();

        function procesarPacientes(pacientes) {
            const hoy = new Date().toISOString().split('T')[0];

            return pacientes
                .map(paciente => {
                    // Ordenar citas por fecha y hora
                    const citasOrdenadas = paciente.appointments
                        .sort((a, b) => {
                            const fechaHoraA = new Date(`${a.appointment_date}T${a.appointment_time}`);
                            const fechaHoraB = new Date(`${b.appointment_date}T${b.appointment_time}`);
                            return fechaHoraA - fechaHoraB;
                        });

                    // Obtener la primera cita
                    const primeraCita = citasOrdenadas[0];

                    // Determinar el estado de la primera cita
                    const estado = primeraCita ? primeraCita.appointment_state.name : null;

                    // Determinar si la cita de hoy está finalizada o cancelada
                    const citaHoy = paciente.appointments.find(c => c.appointment_date === hoy);
                    const esFinalizadaOCancelada = citaHoy &&
                        (citaHoy.appointment_state.name === 'consultation_completed' ||
                            citaHoy.appointment_state.name === 'cancelled');

                    return {
                        ...paciente,
                        estado,
                        primeraCita,
                        _esFinalizadaOCancelada: esFinalizadaOCancelada,
                        _fechaHoraPrimeraCita: primeraCita ?
                            new Date(`${primeraCita.appointment_date}T${primeraCita.appointment_time}`) : new Date(0)
                    };
                })
                .sort((a, b) => {
                    // Ordenar primero por si la cita de hoy está finalizada o cancelada
                    if (a._esFinalizadaOCancelada && !b._esFinalizadaOCancelada) return 1;
                    if (!a._esFinalizadaOCancelada && b._esFinalizadaOCancelada) return -1;

                    // Ordenar por fecha y hora de la primera cita
                    return a._fechaHoraPrimeraCita - b._fechaHoraPrimeraCita;
                })
                .map(({
                    _esFinalizadaOCancelada,
                    _fechaHoraPrimeraCita,
                    ...paciente
                }) => paciente);
        }

        pacientesData = procesarPacientes(pacientesData);



        var pusher = new Pusher('5e57937071269859a439', {
            cluster: 'us2'
        });
        var hostname = window.location.hostname.split('.')[0];
        var channel = pusher.subscribe('waiting-room.' + hostname);

        channel.bind('appointment.created', function(data) {

            pacientesData.forEach(paciente => {
                if (paciente.id === data.appointment.patient_id) {
                    paciente.appointments.push(data.appointment);
                }
            })
            pacientesData = procesarPacientes(pacientesData);

            renderPacientes(pacientesData)
        });

        channel.bind('appointment.state.updated', function(data) {
            pacientesData.forEach(paciente => {
                paciente.appointments.forEach(cita => {
                    if (cita.id === data.appointmentId) {
                        cita.appointment_state = appointmentStates.find(state => state.id === data.newState);
                    }
                })
            })
            pacientesData = procesarPacientes(pacientesData);

            renderPacientes(pacientesData)
        });

        channel.bind('appointment.inactivated', function(data) {
            pacientesData.forEach(paciente => {
                paciente.appointments.forEach(cita => {
                    if (cita.id === data.appointmentId) {
                        cita.appointment_state = appointmentStates.find(state => state.name === 'cancelled');
                    }
                })
            })
            pacientesData = procesarPacientes(pacientesData);

            renderPacientes(pacientesData)
        });

        const itemsPerPage = 8; // Número de pacientes por página

        // Función para filtrar y mostrar los pacientes
        const filterPacientes = () => {
            const searchText = document.getElementById("searchPaciente").value.toLowerCase();
            // const fechaRango = document.getElementById("fechaRango").value;
            const status = document.getElementById("statusPaciente").value;

            const filteredPacientes = pacientesData.filter(paciente => {
                let isMatch = true;

                // Filtro de búsqueda por nombre o documento
                if (searchText && !paciente.fullName?.toLowerCase().includes(searchText) && !
                    paciente.document_number.includes(searchText)) {
                    isMatch = false;
                }

                // Filtro de fechas
                // const sortedClinicalRecords = paciente.clinical_records.sort((a, b) => new Date(b
                //     .created_at) - new Date(a.created_at));
                // const lastClinicalRecord = sortedClinicalRecords[0];
                // const fechaRangoValue = document.getElementById("fechaRango").value;
                // const [fechaInicio, fechaFin] = fechaRangoValue.split(" to ");
                // let lastClinicalRecordDate = null

                // if (lastClinicalRecord) {
                //     lastClinicalRecordDate = new Date(lastClinicalRecord.created_at);
                // }

                // if (fechaRangoValue && ((lastClinicalRecordDate < parseFechaDMY(fechaInicio) ||
                //             lastClinicalRecordDate > parseFechaDMY(fechaFin)) || !
                //         lastClinicalRecordDate)) {
                //     isMatch = false;
                // }
                // Filtro por status


                if (status && paciente.estado != status) {
                    isMatch = false;
                }

                return isMatch;
            });

            renderPacientes(filteredPacientes);
            renderPagination(filteredPacientes);
        };

        // Función para renderizar las tarjetas de pacientes
        const renderPacientes = (pacientes) => {
            const pacientesReestructurados = reestructurarPacientes(pacientes);


            const pacientesList = document.getElementById("pacientesList");
            pacientesList.innerHTML = ""; // Limpiar los resultados anteriores

            const currentPage = getCurrentPage();
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedPacientes = pacientesReestructurados.slice(startIndex, startIndex + itemsPerPage);

            paginatedPacientes.forEach(paciente => {
                const idPaciente = paciente.id;

                const pacienteFiltrado = pacientesReestructurados.filter(
                    paciente => paciente.id === idPaciente
                )[0];

                if (pacienteFiltrado) {
                    const estadoActual = pacienteFiltrado.appointment_state.estadoActual;
                    const estadoColor = pacienteFiltrado.appointment_state.colorEstado;

                    const cardHtml = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div class="card card-paciente">
        <div class="card-body">
            <!-- Imagen del paciente -->
            <div class="avatar avatar-xl rounded-circle">
                <img class="rounded-circle" src="<?= $ConfigNominaUser['logoBase64'] ?>" alt="Paciente" onerror="this.onerror=null; this.src='../assets/img/profile/profile_default.jpg';" />
            </div>

            <!-- Estado del paciente -->
           <span class="badge badge-phoenix badge-phoenix-${estadoColor} fs-10 mb-3">
                    ${estadoActual}
            </span>

            <!-- Información del paciente en columnas -->
            <div class="info-paciente row">
                <div class="col-6">
                    <div class="d-flex align-items-center">
                        <span class="fa-solid fa-id-card me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0">Documento</p>
                    </div>
                    <p class="text-body-emphasis mb-3">${paciente.document_number}</p>
                </div>

             

                <div class="col-6">
                    <div class="d-flex align-items-center">
                        <span class="fa-solid fa-cake-candles me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0">Edad</p>
                    </div>
                    <p class="text-body-emphasis  mb-3">${calculateAge(paciente.date_of_birth)} Años</p>
                </div>

                <div class="col-6">
                    <div class="d-flex align-items-center">
                        <span class="far fa-calendar-check me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0">Fecha</p>
                    </div>
                    <p class="text-body-emphasis  mb-3">
                        ${pacienteFiltrado.cita.appointment_date || "Fecha no disponible"}
                    </p>
                </div>

                <div class="col-6">
                    <div class="d-flex align-items-center">
                        <span class="far fa-clock me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0">Hora</p>
                    </div>
                    <p class="text-body-emphasis">
                        ${pacienteFiltrado.cita.appointment_time || "Hora no disponible"}
                    </p>
                </div>


                   <div class="col-6">
                    <div class="d-flex align-items-center">
                        <span class="fa-solid fa-user me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0">Nombre</p>
                    </div>
                    <p class="text-body-emphasis">
                        ${paciente.first_name ? `${paciente.first_name}` : ''} 
                        ${paciente.middle_name ? ` ${paciente.middle_name}` : ''} 
                        ${paciente.last_name ? ` ${paciente.last_name}` : ''} 
                        ${paciente.second_last_name ? ` ${paciente.second_last_name}` : ''}
                    </p>
                </div>
            </div>
            



            <!-- Botón para ver el paciente -->
            <button class="btn btn-primary btn-ver" onclick="window.location.href='verPaciente?id=${paciente.id}'">
                Ver Paciente
            </button>
        </div>
    </div>
</div>
        `;
                    pacientesList.innerHTML += cardHtml;
                }
            });
        };

        function calculateAge(dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            const currentDate = new Date();
            let age = currentDate.getFullYear() - birthDate.getFullYear();
            const monthDifference = currentDate.getMonth() - birthDate.getMonth();

            // Si aún no ha pasado su cumpleaños este año, restamos 1
            if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
                age--;
            }

            return age;
        }

        // Función para renderizar los controles de paginación
        const renderPagination = (pacientes) => {
            const totalPages = Math.ceil(pacientes.filter(paciente => paciente.appointments.length).length / itemsPerPage);
            const paginationControls = document.getElementById("paginationControls");
            paginationControls.innerHTML = ""; // Limpiar los controles anteriores

            if (totalPages > 1) {
                const currentPage = getCurrentPage();

                let paginationHtml = `
          <ul class="pagination">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="window.location.href='?page=${currentPage - 1}'">&laquo;</a>
            </li>`;

                for (let page = 1; page <= totalPages; page++) {
                    paginationHtml += `
            <li class="page-item ${page === currentPage ? 'active' : ''}">
              <a class="page-link" href="#" onclick="window.location.href='?page=${page}'">${page}</a>
            </li>`;
                }

                paginationHtml += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="window.location.href='?page=${currentPage + 1}'">&raquo;</a>
            </li>
          </ul>`;

                paginationControls.innerHTML = paginationHtml;
            }
        };

        // Función para obtener la página actual desde la URL
        const getCurrentPage = () => {
            const urlParams = new URLSearchParams(window.location.search);
            return parseInt(urlParams.get("page") || "1");
        };

        // Función para cambiar de página
        const changePage = (page) => {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("page", page);
            window.location.search = urlParams.toString();
        };

        document.getElementById("searchPaciente").addEventListener("input", filterPacientes);
        // document.getElementById("fechaRango").addEventListener("input", filterPacientes);
        document.getElementById("statusPaciente").addEventListener("change", filterPacientes);

        // Inicializa el filtro con todos los pacientes al cargar
        filterPacientes();
    });
</script>



<?php

include "../footer.php";
include "./modalPacientes.php";
?>
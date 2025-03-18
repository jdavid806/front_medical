<?php
include "../menu.php";
include "../header.php";
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
                <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalCrearPaciente">
                  <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo Paciente
                </button>
              </div>
            </div>

            <div class="accordion mb-4" id="accordionFiltros">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingFiltros">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFiltros" aria-expanded="false" aria-controls="collapseFiltros">
                    Filtros
                  </button>
                </h2>
                <div id="collapseFiltros" class="accordion-collapse collapse" aria-labelledby="headingFiltros" data-bs-parent="#accordionFiltros">
                  <div class="accordion-body">
                    <div class="row g-3 mb-4">
                      <div class="col-12 col-md-4">
                        <label for="searchPaciente" class="form-label">Buscar Paciente</label>
                        <input type="text" id="searchPaciente" class="form-control" placeholder="Buscar por nombre o documento">
                      </div>
                      <div class="col-12 col-md-4">
                        <label for="fechaRango" class="form-label">Fecha de Última Consulta</label>
                        <input class="form-control datetimepicker" id="fechaRango" type="text" placeholder="d/m/y to d/m/y" data-options='{"mode":"range","dateFormat":"d/m/y","disableMobile":true}' />
                      </div>
                      <div class="col-12 col-md-4">
                        <label for="statusPaciente" class="form-label">Filtrar por Estado</label>
                        <select id="statusPaciente" class="form-select">
                          <option value="">Seleccione Estado</option>
                          <option value="1">Pendiente</option>
                          <option value="2">En espera de consulta</option>
                          <option value="3">En consulta</option>
                          <option value="4">Consulta finalizada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="container">
              <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="pacientesList">
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
    patientService
  } from "../../services/api/index.js";
  import {
    formatDate,
    parseFechaDMY
  } from "../../services/utilidades.js";
  import {
    appointmentStates,
    appointmentStatesColors
  } from "../../services/commons.js";

  document.addEventListener("DOMContentLoaded", async () => {
    let pacientesData = await patientService.getAll();

    function procesarPacientes(pacientes) {
      // 1. Configuración - CAMBIAR ESTOS VALORES PARA PRUEBAS
      const SUCURSAL_ACTUAL = 1; // Sucursal del usuario (1-5)
      const ESTADO_CANCELADO = 4; // Estado para citas canceladas
      const PRIORIDAD_ESTADOS = {
        ACTIVO: 1, // Citas activas y estado != 4
        ESTADO_4: 2, // Citas activas con estado 4
        INACTIVO: 3 // Citas inactivas
      };

      const hoy = new Date().toISOString().split('T')[0];

      return pacientes
        .map(paciente => {

          // 4. Filtrar citas para hoy en sucursal actual
          const citasHoy = paciente.appointments.filter(c =>
            c.appointment_date === hoy &&
            (c.userAvailability?.branch_id || 1) === SUCURSAL_ACTUAL
          );


          // 5. Clasificar citas en grupos de prioridad
          let estado = null;
          let horaOrden = null;
          let prioridad = null;

          if (citasHoy.length > 0) {
            // Separar en grupos
            const grupoActivo = citasHoy.filter(c =>
              c.is_active && c.appointment_state_id !== ESTADO_CANCELADO
            ).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

            const grupoEstado4 = citasHoy.filter(c =>
              c.is_active && c.appointment_state_id === ESTADO_CANCELADO
            ).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

            const grupoInactivo = citasHoy.filter(c =>
              !c.is_active
            ).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

            // Determinar grupo prioritario
            const grupoPrincipal = [{
                prioridad: PRIORIDAD_ESTADOS.ACTIVO,
                citas: grupoActivo
              },
              {
                prioridad: PRIORIDAD_ESTADOS.ESTADO_4,
                citas: grupoEstado4
              },
              {
                prioridad: PRIORIDAD_ESTADOS.INACTIVO,
                citas: grupoInactivo
              }
            ].find(g => g.citas.length > 0);

            if (grupoPrincipal) {
              const primeraCita = grupoPrincipal.citas[0];
              prioridad = grupoPrincipal.prioridad;
              horaOrden = primeraCita.appointment_time;
              estado = grupoPrincipal.prioridad === PRIORIDAD_ESTADOS.INACTIVO ?
                5 : primeraCita.appointment_state_id;
            }
          }

          // 6. Obtener última consulta clínica
          const ultimaConsulta = paciente.clinical_records
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]?.created_at;

          return {
            ...paciente,
            appointments: paciente.appointments,
            status: estado,
            _prioridad: prioridad,
            _horaOrden: horaOrden,
            _ultimaConsulta: ultimaConsulta
          };
        })
        .sort((a, b) => {
          // 7. Lógica de ordenamiento mejorada
          const tieneCitaA = a._prioridad !== null;
          const tieneCitaB = b._prioridad !== null;

          // Caso 1: Ambos tienen citas hoy
          if (tieneCitaA && tieneCitaB) {
            if (a._prioridad === b._prioridad) {
              return a._horaOrden.localeCompare(b._horaOrden);
            }
            return a._prioridad - b._prioridad;
          }

          // Caso 2: Solo uno tiene cita hoy
          if (tieneCitaA) return -1;
          if (tieneCitaB) return 1;

          // Caso 3: Ninguno tiene cita hoy - ordenar por última consulta
          const fechaA = a._ultimaConsulta ? new Date(a._ultimaConsulta) : new Date(0);
          const fechaB = b._ultimaConsulta ? new Date(b._ultimaConsulta) : new Date(0);
          return fechaB - fechaA;
        })
        .map(({
          _prioridad,
          _horaOrden,
          _ultimaConsulta,
          ...paciente
        }) => paciente);
    }

    pacientesData = procesarPacientes(pacientesData);


    var pusher = new Pusher('5e57937071269859a439', {
      cluster: 'us2'
    });

    var channel = pusher.subscribe('waiting-room.consultorio2.3');

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
            cita.appointment_state_id = data.newState;
            paciente.status = data.newState;
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
            cita.is_active = false;
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
      const fechaRango = document.getElementById("fechaRango").value;
      const status = document.getElementById("statusPaciente").value;

      const filteredPacientes = pacientesData.filter(paciente => {
        let isMatch = true;

        // Filtro de búsqueda por nombre o documento
        if (searchText && !paciente.first_name.toLowerCase().includes(searchText) && !paciente.document_number.includes(searchText)) {
          isMatch = false;
        }

        // Filtro de fechas
        const sortedClinicalRecords = paciente.clinical_records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const lastClinicalRecord = sortedClinicalRecords[0];
        const fechaRangoValue = document.getElementById("fechaRango").value;
        const [fechaInicio, fechaFin] = fechaRangoValue.split(" to ");
        let lastClinicalRecordDate = null

        if (lastClinicalRecord) {
          lastClinicalRecordDate = new Date(lastClinicalRecord.created_at);
        }


        if (fechaRangoValue && ((lastClinicalRecordDate < parseFechaDMY(fechaInicio) || lastClinicalRecordDate > parseFechaDMY(fechaFin)) || !lastClinicalRecordDate)) {
          isMatch = false;
        }

        // Filtro por status
        if (status && paciente.status != status) {
          isMatch = false;
        }

        return isMatch;
      });

      renderPacientes(filteredPacientes);
      renderPagination(filteredPacientes);
    };

    // Función para renderizar las tarjetas de pacientes
    const renderPacientes = (pacientes) => {
      const pacientesList = document.getElementById("pacientesList");
      pacientesList.innerHTML = ""; // Limpiar los resultados anteriores

      // Obtener la página actual desde el parámetro en la URL o predeterminado
      const currentPage = getCurrentPage();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedPacientes = pacientes.slice(startIndex, startIndex + itemsPerPage);

      paginatedPacientes.forEach(paciente => {
        const sortedClinicalRecords = paciente.clinical_records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const lastClinicalRecord = sortedClinicalRecords[0];

        const cardHtml = `
          <div class="col">
  <div class="card h-100 hover-actions-trigger">
    <div class="card-body d-flex flex-column align-items-center text-center">
      
      <!-- Imagen arriba -->
      <div class="avatar avatar-xl rounded-circle mb-3">
        <img class="rounded-circle" src="<?= $ConfigNominaUser['logoBase64'] ?>" alt="Paciente" onerror="this.onerror=null; this.src='../assets/img/profile/profile_default.jpg';" />
      </div>

      <!-- Información del paciente -->
      <span class="badge badge-phoenix fs-10 mb-3 badge-phoenix-${appointmentStatesColors[paciente.status] || 'secondary'}">
        ${appointmentStates[paciente.status] || 'Sin estado'}
      </span>

      <div class="d-flex flex-column align-items-start w-100">
        <div class="d-flex align-items-center">
          <span class="fa-solid fa-id-card me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
          <p class="fw-bold mb-0">Documento:</p>
        </div>
        <p class="text-body-emphasis ms-3 mb-2">${paciente.document_number}</p>
        
        <div class="d-flex align-items-center">
          <span class="fa-solid fa-user me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
          <p class="fw-bold mb-0">Nombre:</p>
        </div>
        <p class="text-body-emphasis ms-3 mb-2">${paciente.first_name ? `${paciente.first_name}` : ''} ${paciente.middle_name ? ` ${paciente.middle_name}` : ''} ${paciente.last_name ? ` ${paciente.last_name}` : ''} ${paciente.second_last_name ? ` ${paciente.second_last_name}` : ''}</p>
        
        <div class="d-flex align-items-center">
          <span class="fa-solid fa-cake-candles me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
          <p class="fw-bold mb-0">Edad:</p>
        </div>
        <p class="text-body-emphasis ms-3 mb-2">
  ${calculateAge(paciente.date_of_birth)} Años
</p>
        
        <div class="d-flex align-items-center text-start">
        <span class="far fa-calendar-check me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
          <p class="mb-0 fw-bold">Fecha de Última Consulta: </p>
        </div>
        <p class="text-body-emphasis ms-3 mb-2 text-start">
  ${lastClinicalRecord ? formatDate(lastClinicalRecord.created_at).split(',')[0] : "Fecha no disponible"}
</p>
      </div>

      <!-- Botón abajo -->
      <button class="btn btn-primary btn-icon mt-auto w-100" 
        data-bs-toggle="modal" 
        onclick="window.location.href='verPaciente?id=${paciente.id}'">
        Ver Paciente
      </button>
      
    </div>
  </div>
</div>
`;

        pacientesList.innerHTML += cardHtml;
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
      const totalPages = Math.ceil(pacientes.length / itemsPerPage);
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
    document.getElementById("fechaRango").addEventListener("input", filterPacientes);
    document.getElementById("statusPaciente").addEventListener("change", filterPacientes);

    // Inicializa el filtro con todos los pacientes al cargar
    filterPacientes();
  });
</script>



<?php

include "../footer.php";
include "./modalPacientes.php";
?>
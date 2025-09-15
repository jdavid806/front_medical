<?php

include "../menu.php";
include "../header.php";

$baner = "https://placecats.com/3000/200";
$baner = "";

?>

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    AppointmentsSummaryCard
  } from './react-dist/AppointmentsSummaryCard.js';

  ReactDOMClient.createRoot(document.getElementById('appointmentsSummaryCardReact')).render(React.createElement(AppointmentsSummaryCard));
</script>

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

  .banner {
    display: inline-block;
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .banner img {
    max-width: 90%;
    height: auto;
  }
  
  /* Contenedor unificado para las tarjetas */
  .dashboard-cards-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 2rem;
  }
  
  .dashboard-card-wrapper {
    flex: 0 0 auto;
    margin-bottom: 1rem;
  }
  
  .dashboard-card {
    width: 250px;
    height: 235px;
    border-radius: 10%;
    background-color: var(--fc-button-active-border-color) !important;
    color: #f8f9fa !important;
    display: flex;
    flex-direction: column;
  }
  
  .dashboard-card .card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 1.25rem;
  }
  
  .dashboard-card .card-title {
    text-align: center;
    color: #f8f9fa !important;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap:10px;
  }
  
  .dashboard-card .card-title span[data-feather] {
    margin-right: 8px;
  }
  
  .dashboard-card .card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0;
  }
  
  .dashboard-card h3 {
    text-align: center;
    color: #f8f9fa !important;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  .text-span-descripcion {
    text-align: center;
    font-weight: 700;
    color: rgba(var(--phoenix-secondary-lighter-rgb), var(--phoenix-text-opacity)) !important;
    margin-bottom: 0.5rem;
  }
  
  .dashboard-card .card-button {
    display: flex;
    justify-content: center;
    margin-top: auto;
  }
  
  /* Estilos específicos para el componente React */
  #appointmentsSummaryCardReact {
    display: flex;
    justify-content: center;
  }
  
  #appointmentsSummaryCardReact .card {
    width: 250px !important;
    height: 235px !important;
    border-radius: 10% !important;
    background-color: var(--fc-button-active-border-color) !important;
    color: #f8f9fa !important;
    display: flex !important;
    flex-direction: column !important;
  }
  
  #appointmentsSummaryCardReact .card-body {
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    height: 100% !important;
    padding: 1.25rem !important;
  }
  
  #appointmentsSummaryCardReact .card-title {
    text-align: center !important;
    color: #f8f9fa !important;
    font-size: 1.1rem !important;
    margin-bottom: 0.5rem !important;
    min-height: 2.5rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  #appointmentsSummaryCardReact .card-content {
    flex-grow: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    margin: 0.5rem 0 !important;
  }
  
  #appointmentsSummaryCardReact h3 {
    text-align: center !important;
    color: #f8f9fa !important;
    margin-bottom: 0.5rem !important;
    font-size: 1.8rem !important;
    font-weight: bold !important;
  }
  
  #appointmentsSummaryCardReact .text-span-descripcion {
    text-align: center !important;
    font-weight: 700 !important;
    color: rgba(var(--phoenix-secondary-lighter-rgb), var(--phoenix-text-opacity)) !important;
    margin-bottom: 0.5rem !important;
  }
  
  #appointmentsSummaryCardReact .card-button {
    display: flex !important;
    justify-content: center !important;
    margin-top: auto !important;
  }
</style>
<div class="componete">
  <div class="content">
    <div class="col-12 col-xxl-12">
      <?php if ($baner != ""): ?>
        <div class="mb-8 text-center">
          <div class="banner">
            <img src="https://placecats.com/3000/200" alt="Banner de Dashboard" class="img-fluid">
          </div>
        </div>
      <?php endif ?>
      
      <div class="dashboard-cards-container">
        <!-- Tarjeta de Pacientes -->
        <div class="dashboard-card-wrapper" data-menu-role="pacientes">
          <div class="card bg-secondary dashboard-card">
            <div class="card-body">
              <h5 class="card-title"><span class="ml-10" data-feather="user"></span> Pacientes</h5>
              <div class="card-content">
                <h3 id="patientsActiveCount">Cargando...</h3>
                <span class="text-span-descripcion">Pacientes Creados</span>
              </div>
              <div class="card-button">
                <button class="btn btn-phoenix-secondary me-1 mb-1" type="button"
                  onclick="window.location.href='pacientes'">
                  <span data-feather="users"></span> Ver Consultas
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Componente React -->
        <div class="dashboard-card-wrapper" id="appointmentsSummaryCardReact"></div>
        
        <!-- Tarjeta de Consultas -->
        <div class="dashboard-card-wrapper">
          <div class="card dashboard-card">
            <div class="card-body">
              <h5 class="card-title"><span data-feather="file-text"></span> Consultas</h5>
              <div class="card-content">
                <h3>0/2</h3>
                <span class="text-span-descripcion">Consultas para Hoy</span>
              </div>
              <div class="card-button">
                <button class="btn btn-phoenix-secondary me-1 mb-1" type="button"
                  onclick="window.location.href='citasControl'">
                  <span data-feather="file-plus"></span> Ver Citas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <hr class="bg-body-secondary mb-6 mt-4" />

      <div class="accordion mb-4" id="accordionFiltros">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingFiltros">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFiltros" aria-expanded="false" aria-controls="collapseFiltros">
              Filtros
            </button>
          </h2>
          <div id="collapseFiltros" class="accordion-collapse collapse" aria-labelledby="headingFiltros" data-bs-parent="#accordionFiltros">
            <div class="accordion-body">
              <div class="row">
                <div class="col-md-6">
                  <label for="specialtyFilter" class="form-label">Especialidad Médica</label>
                  <select class="form-select" id="specialtyFilter">
                    <option value="">Seleccionar Especialidad</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="doctorFilter" class="form-label">Médico</label>
                  <select class="form-select" id="doctorFilter">
                    <option value="">Seleccionar Médico</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id='calendar'></div>
      <hr class="bg-body-secondary mb-6 mt-4" />

    </div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {

    createDoughnutChart(
      "pie-chart-1",
      "Inventario de productos",
      "Cantidad de producto",
      "Productos",
      [{
          value: 20,
          name: "Vitaminas A"
        },
        {
          value: 10,
          name: "supositorios"
        },
        {
          value: 5,
          name: "Vendajes"
        },
      ]
    );

    createDoughnutChart(
      "pie-chart-2",
      "Pacientes por genero",
      "Pacientes creados por genero",
      "Generos",
      [{
          value: 100,
          name: "Masculino"
        },
        {
          value: 123,
          name: "Femenino"
        },
      ]
    );
  });
</script>

<script type="module">
  import {
    appointmentService,
    inventoryService,
    userSpecialtyService,
    patientService,
    userService
  } from "./services/api/index.js";
  import {
    rips,
    typeConsults,
    externalCauses,
    purposeConsultations
  } from "./services/commons.js";
  import {
    usersSelect,
    userSpecialtiesSelect
  } from "./services/selects.js";

  document.addEventListener('DOMContentLoaded', async function() {

    const specialtySelect = document.getElementById('specialtyFilter');
    const doctorSelect = document.getElementById('doctorFilter');

    var calendarEl = document.getElementById('calendar');

    window.calendarGlobal = initCalendar();
    const calendar = window.calendarGlobal;
    calendar.render();

    const specialties = await userSpecialtyService.getAll();
    const doctors = await userService.getAll();

    usersSelect(doctorSelect);
    userSpecialtiesSelect(specialtySelect);

    specialtySelect.addEventListener('change', filterCalendar);
    doctorSelect.addEventListener('change', filterCalendar);

    const patientsCount = await patientService.activeCount();
    const patientsActiveCount = document.getElementById('patientsActiveCount');

    if (patientsActiveCount) {
      patientsActiveCount.textContent = patientsCount;
    }

    const appointmentsCount = await appointmentService.activeCount();

    // Buscar el elemento de conteo de citas dentro del componente React
    setTimeout(() => {
      const reactCountElement = document.querySelector('#appointmentsSummaryCardReact [id*="appointmentsActiveCount"]');
      if (reactCountElement) {
        reactCountElement.textContent = appointmentsCount;
      }
      
      // Asegurar que el componente React tenga la misma estructura
      const reactCard = document.querySelector('#appointmentsSummaryCardReact .card');
      if (reactCard) {
        const reactBody = reactCard.querySelector('.card-body');
        if (reactBody && !reactBody.querySelector('.card-content')) {
          const title = reactBody.querySelector('.card-title');
          const content = reactBody.querySelector('.card-text');
          const button = reactBody.querySelector('.card-button');
          
          if (title && content && button) {
            // Reorganizar el contenido para que coincida con nuestra estructura
            const newContent = document.createElement('div');
            newContent.className = 'card-content';
            newContent.innerHTML = content.innerHTML;
            content.replaceWith(newContent);
          }
        }
      }
    }, 1000); // Pequeño delay para asegurar que el componente React se haya renderizado

    function filterCalendar() {
      calendar.refetchEvents();
    }

    function initCalendar() {
      var todayDate = moment().startOf('day');
      var YM = todayDate.format('YYYY-MM');
      var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
      var TODAY = todayDate.format('YYYY-MM-DD');
      var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

      return new FullCalendar.Calendar(calendarEl, {
        lang: 'es',
        locale: 'es',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
          today: 'Dia Actual',
          month: 'Mes',
          week: 'Semana',
          day: 'Dia',
        },

        // configruación:

        editable: true,
        dayMaxEvents: true,
        navLinks: true,

        editable: true,
        eventDurationEditable: false,
        selectable: true,
        droppable: true,

        height: 800,
        contentHeight: 780,
        aspectRatio: 3, // see: https://fullcalendar.io/docs/aspectRatio

        nowIndicator: true,
        now: TODAY,

        navLinks: true, // can click day/week names to navigate views
        businessHours: true,

        views: {
          dayGridMonth: {
            buttonText: 'month'
          },
          timeGridWeek: {
            buttonText: 'week'
          },
          timeGridDay: {
            buttonText: 'day'
          }
        },

        eventDurationEditable: false,

        initialView: 'dayGridMonth',
        initialDate: TODAY,

        events: function(fetchInfo, successCallback, failureCallback) {

          (async () => {
            try {
              const startDate = moment(fetchInfo.start).format('YYYY-MM-DD');
              const endDate = moment(fetchInfo.end).format('YYYY-MM-DD');
              const selectedSpecialty = specialtySelect.value;
              const selectedDoctor = doctorSelect.value;

              const appointments = await appointmentService.filterAppointments({
                per_page: 10,
                page: 1,
                search: "",
                sort: "-appointment_date,appointment_time",
                appointmentDate: startDate + "," + endDate,
              });

              const filteredEvents = appointments?.data?.data
                .filter(appointment => {
                  return appointment.is_active &&
                    (
                      (selectedDoctor ? appointment.user_availability.user_id == selectedDoctor : true) &&
                      (selectedSpecialty ? appointment.user_availability.user.user_specialty_id == selectedSpecialty : true)
                    )
                })
                .map((appointment) => {
                  const {
                    appointment_date,
                    appointment_time,
                    user_availability,
                    patient,
                    attention_type,
                    consultation_purpose,
                    consultation_type,
                    external_cause
                  } = appointment

                  const patientName = `${patient.first_name} ${patient.last_name}`
                  const date = moment(appointment_date).format('D-MM-YYYY')
                  const time = moment(appointment_time, 'HH:mm:ss').format('h:mm a')
                  const appointmentTimeEnd = moment(appointment_time, 'HH:mm:ss').add(user_availability.appointment_duration, 'minutes')
                  const start = `${appointment_date}T${appointment_time}`
                  const attentionType = rips[attention_type];
                  const consultationType = typeConsults[consultation_type];

                  const externalCause = externalCauses[external_cause];
                  const consultationPurpose = purposeConsultations[consultation_purpose];

                  const description = `Cita de ${patientName} el dia ${date} a las ${time}`;
                  return {
                    title: patientName,
                    start: `${appointment_date}T${appointment_time}`,
                    end: `${appointment_date}T${appointmentTimeEnd}`,
                    description,
                    extendedProps: {
                      doctor_name: user_availability.user.first_name + " " + user_availability.user.last_name,
                      end: `${appointment_date}T${appointmentTimeEnd}`,
                      appointment: appointment
                    }
                  }
                });

              // ¡IMPORTANTE! Usar el callback de éxito
              successCallback(filteredEvents);

            } catch (error) {
              console.error("Error:", error);
              // ¡IMPORTANTE! Usar el callback de error
              failureCallback(error);
            }
          })();
        },

        eventClick: async function(info) {

          const product = await inventoryService.getById(info.event._def.extendedProps.appointment.id) || "sin producto";

          const titulo = info.event.title || "Título no disponible";
          const descripcion = info.event.extendedProps?.description + " para " + product.name || "Descripción no disponible";
          const url = info.event.url || "";
          const start = moment(info.event.start).format('D-MM-YYYY, h:mm a');
          const endDate = info.event.extendedProps?.end || "Fecha no disponible";
          // Parse the input date string
          const parsedDate = moment(endDate, "YYYY-MM-DD[T]ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
          // Format it into the desired output
          const formattedDate = parsedDate.format("YYYY-MM-DDTHH:mm:ssZ");
          const end = moment(formattedDate).format('D-MM-YYYY, h:mm a');



          // Inserta los valores en el modal
          $('#tituloEvento').text(titulo);
          $('#descripcionEvento').text(descripcion);
          $('#startEvento').text(start);
          $('#endEvento').text(end);
          $('#medicoEvento').text(info.event.extendedProps.doctor_name);

          // Muestra el modal
          $('#modalEvento').modal('show');

        },

        // Esta función lo que hace es que al darle clic a un lugar del calendario abrira un modal de agendamiento
        select: function(info) {
          var fechaInicioInicial = moment(info.start);
          var fechaFinalInicial = moment(info.end);

          // Formatear fechas y horas por separado usando moment.js
          var fechaInicio = fechaInicioInicial.format('YYYY-MM-DD');
          var horaInicio = fechaInicioInicial.format('HH:mm');
          var fechaFinal = fechaFinalInicial.format('YYYY-MM-DD');
          var horaFinal = fechaFinalInicial.format('HH:mm');

          // Asignar datos a los campos del modal
          document.getElementById('fechaCita').value = fechaInicio; // Asignar la fecha de inicio
          document.getElementById('consulta-hora').value = horaInicio; // Asignar la hora de inicio

          // Mostrar el modal usando Bootstrap 5
          var modalCrearCita = new bootstrap.Modal(document.getElementById('modalCrearCita'), {
            keyboard: false
          });
          modalCrearCita.show();
        },

        // Esta función lo que hace es que al una cita se reagende
        eventDrop: function(arg) {

          let FechaHoraInicio = moment(arg.event.start).format();
          var usuario_modificar_cita = arg.event.extendedProps.resourceId;

          Swal.fire({
            title: '¿Estás seguro?',
            text: 'Si Acepta, Se movera la cita a la fecha ' + FechaHoraInicio.replace('T', ' '),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
            } else {
              arg.revert();
            }

          })
        }

      });
    }
  });
</script>

<script src="./Portada/graficas/crearGrafica.js"></script>

<?php
include "../footer.php";
// include "../Citas/modalCitas.php";
include "./modalEventos.php";
?>
<?php
include "../menu.php";
include "../header.php";
include "../ConsultasJson/dataPaciente.php";

$dropdownNew =
  '<div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="fas fa-plus"></i> &nbsp; Nuevo
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#">Consulta</a></li>
    </ul>
  </div>';


$consultas = [
  ['fecha' => '2024-11-20', 'descripcion' => 'Consulta sobre productos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
];

$tabs = [
  ['id' => 'consulta', 'icono' => 'fas fa-address-book', 'titulo' => 'Consultas medicas', 'texto' => 'Revisa o crea historias médicas', 'url' => 'consulta?patient_id=' . $_GET['id']],
  ['id' => 'citas', 'icono' => 'calendar-days', 'titulo' => 'Citas', 'texto' => 'Agenda una nueva cita o revisa todas las citas agendadas a este paciente', 'url' => 'verCitas?patient_id=' . $_GET['id']],
  ['id' => 'llamar-paciente', 'icono' => 'fas fa-address-book', 'titulo' => 'Llamar al paciente', 'texto' => 'Revisa o crea historias médicas', 'url' => 'llamar_paciente'],
  ['id' => 'ordenes-medicas', 'icono' => 'file-circle-plus', 'titulo' => 'Ordenes médicas', 'texto' => 'Revisa todos los exámenes clínicos recetados a este paciente', 'url' => 'verExamenes?patient_id=' . $_GET['id']],
  ['id' => 'ordenes-laboratorio', 'icono' => 'fas fa-microscope', 'titulo' => 'Laboratorio', 'texto' => 'Revisa todos los exámenes de laboratorio ordenados a este paciente', 'url' => 'verOrdenesExamenes?patient_id=' . $_GET['id']],
  ['id' => 'recetas', 'icono' => 'kit-medical', 'titulo' => 'Recetas médicas', 'texto' => 'Genera y revisa todas las recetas médicas para este paciente', 'url' => 'verRecetas?patient_id=' . $_GET['id']],
  ['id' => 'recetas-optometria', 'icono' => 'kit-medical', 'titulo' => 'Recetas Optometría', 'texto' => 'Genera y revisa todas las recetas médicas de optometría para este paciente', 'url' => 'verRecetasOptometria?patient_id=' . $_GET['id'] . '&especialidad=Optometria'],
  ['id' => 'incapacidades', 'icono' => 'wheelchair', 'titulo' => 'Incapacidades clínicas', 'texto' => 'Consulta todas las incapacidades clínicas para este paciente', 'url' => 'verIncapacidades?patient_id=' . $_GET['id']],
  ['id' => 'antecedentes', 'icono' => 'hospital', 'titulo' => 'Antecedentes personales', 'texto' => 'Revisa todos los antecedentes personales registrados para este paciente', 'url' => 'verAntecedentes?patient_id=' . $_GET['id']],
  ['id' => 'consentimientos', 'icono' => 'book-medical', 'titulo' => 'Consentimientos', 'texto' => 'Genera y revisa todos los consentimientos y certificados registrados para este paciente', 'url' => 'verConcentimientos?patient_id=' . $_GET['id']],
  ['id' => 'presupuestos', 'icono' => 'file-invoice-dollar', 'titulo' => 'Presupuestos', 'texto' => 'Genera y revisa todos los presupuestos elaborados para este paciente', 'url' => 'registros-presupuestos?patient_id=' . $_GET['id']],
  ['id' => 'esquema-vacunacion', 'icono' => 'syringe', 'titulo' => 'Esquema de vacunación', 'texto' => 'Revisa el esquema de vacunación o genera un nuevo esquema', 'url' => 'esquemaVacunacion?patient_id=' . $_GET['id']],
  //['icono' => 'book-medical', 'titulo' => 'Exámenes de laboratorio', 'texto' => 'Revisa los exámenes de laboratorio', 'url' => 'laboratorio'],
  ['id' => 'notas-enfermeria', 'icono' => 'fas fa-user-nurse', 'titulo' => 'Notas de Enfermeria', 'texto' => 'Revisa las notas de enfermeria del paciente', 'url' => 'enfermeria?patient_id=' . $_GET['id']],
  ['id' => 'evoluciones', 'icono' => 'fas fa-external-link-alt', 'titulo' => 'Evoluciones', 'texto' => 'Revisa la evoluciones del paciente', 'url' => 'evoluciones?patient_id=' . $_GET['id']],
  ['id' => 'remisiones', 'icono' => 'fas fa-retweet', 'titulo' => 'Remisiones', 'texto' => 'Revisa la remisiones del paciente', 'url' => 'remisiones?patient_id=' . $_GET['id']],
  ['id' => 'preadmisiones', 'icono' => 'far fa-address-book', 'titulo' => 'Preadmisiones', 'texto' => 'Revisa las preadmisiones del paciente', 'url' => 'preadmisiones?patient_id=' . $_GET['id']],
];

$resumenPaciente = [
  'contenido' => '<h3>Antecedentes Médicos Relevantes</h3>
        <ul>
            <li>Hipertensión arterial controlada</li>
            <li>Dislipidemia en tratamiento</li>
            <li>Exfumador (último consumo hace más de 2 años)</li>
        </ul>

        <h3>Exploración Física y Pruebas</h3>
        <ul>
            <li>Presión arterial: 135/85 mmHg</li>
            <li>Frecuencia cardiaca: 76 lpm</li>
            <li>Electrocardiograma: signos de isquemia subendocárdica</li>
            <li>Troponinas: dentro de rango normal</li>
        </ul>

        <h3>Diagnóstico Presuntivo</h3>
        <p>Angina de pecho estable posiblemente relacionada con enfermedad coronaria crónica.</p>

        <h3>Plan de Tratamiento</h3>
        <ul>
            <li>Beta bloqueadores</li>
            <li>Antiagregante plaquetario (aspirina)</li>
            <li>Estatinas</li>
            <li>Modificación del estilo de vida: dieta, ejercicio moderado, evitar tabaco y alcohol</li>
        </ul>

        <h3>Seguimiento</h3>
        <p>Control clínico en 1 mes y evaluación con prueba de esfuerzo o ecocardiograma de estrés según disponibilidad.</p>
    '
]

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
<div class="componete">
  <div class="content">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()" id="nameBradcumb"></li>
      </ol>
    </nav>
    <div class="pb-9">

      <div class="row g-0 g-md-4 g-xl-6 p-5 justify-content-center">
        <h2 class="mb-0">
          <? echo $nombres ?>
        </h2>
        <div class="col-4">
          <?php
          include './infoPaciente.php';
          ?>
        </div>

        <div class="col-md-7 col-lg-7 col-xl-8 data">

          <div class="card">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item border border-0">
                <h2 class="accordion-header px-3" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    <h5 class="card-title mb-0">Evolución del paciente</h5>
                  </button>
                </h2>
                <div class="accordion-collapse collapse" id="collapseOne" aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body pt-3">
                    <div class="timeline-vertical" id="patient-evolution-container">

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mt-2">
            <div class="accordion" id="resumenAccordion">
              <div class="accordion-item border border-0">
                <h2 class="accordion-header px-3" id="resumenHeading">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="#resumenCollapse" aria-expanded="false"
                    aria-controls="resumenCollapse">
                    <h5 class="card-title mb-0">Resumen del paciente</h5>
                  </button>
                </h2>
                <div class="accordion-collapse collapse" id="resumenCollapse"
                  aria-labelledby="resumenHeading" data-bs-parent="#resumenAccordion">
                  <div class="accordion-body pt-3">
                    <div class="patient-summary-container" id="resumenPacienteContainer"
                      style="margin-left: 1.2rem;">
                      <!-- Contenido del resumen irá aquí -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="contenedor-tabs"
            class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-3 mt-2 d-none">

            <?php foreach ($tabs as $tab) { ?>
              <div class="col card-tab" id="col-<?= $tab['id'] ?>">
                <div class="card text-center" style="max-width:15rem;  min-height: 15em;">
                  <div class="card-body d-flex flex-column justify-content-between align-items-center"
                    style="height: 100%;">
                    <!-- Icono en la parte superior -->
                    <div class="mb-2">
                      <i class="fas fa-<?= $tab['icono'] ?> fa-2x"></i>
                    </div>
                    <!-- Título -->
                    <h5 class="card-title"><?= $tab['titulo'] ?></h5>
                    <!-- Texto -->
                    <p class="card-text fs-9 text-center">
                      <?= $tab['texto'] ?>
                    </p>
                    <!-- Botón siempre al fondo -->
                    <button class="btn btn-primary btn-icon mt-auto btn-tab"
                      data-url="<?= $tab['url'] ?>" id="<?= $tab['id'] ?>">
                      <span class="fa-solid fa-chevron-right"></span>
                    </button>
                  </div>
                </div>
              </div>
            <?php } ?>


          </div>

          <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-3 mt-2">
            <div id="tabs-loading-container" class="d-flex justify-content-center align-items-center"
              style="width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.5);">
              <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</div>

<template id="patient-evolution">
  <div class="timeline-item align-items-start">
    <div class="row g-md-3 align-items-start mb-8 mb-lg-5">
      <div class="col-12 col-md-auto d-flex">
        <div class="timeline-item-date text-end order-1 order-md-0 me-md-4">
          <p class="fs-10 fw-semibold text-body-tertiary mb-0">23 August, 2023<br class="d-none d-md-block">
            10:30 AM</p>
        </div>
        <div class="timeline-item-bar position-relative me-3 me-md-0">
          <div class="icon-item icon-item-sm bg-success" data-bs-theme="light"><span
              class="fa-solid fa-check text-white fs-10"></span></div><span
            class="timeline-bar border-end border-success"></span>
        </div>
      </div>
      <div class="col">
        <div class="timeline-item-content text-start ps-6 ps-md-3">
          <h5 class="text-start">Order is processing</h5>
          <p class="fs-9 text-body-secondary mb-0"
            style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
            Your package is ready for the seller to prepare.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const resumenPaciente = {
    resumenGeneral: "Paciente masculino de mediana edad, con cuadro clínico estable, bajo tratamiento por enfermedad cardiovascular crónica. Evolución favorable en los últimos controles, adherente al tratamiento y con seguimiento activo en consultas ambulatorias.",

    diagnosticos: [
      "Angina de pecho estable",
      "Hipertensión arterial esencial",
      "Dislipidemia mixta"
    ],

    antecedentes: [
      "Hipertensión diagnosticada hace 8 años",
      "Exfumador (último consumo hace 2 años)",
      "Antecedentes familiares de cardiopatía isquémica",
      "Colesterol elevado desde hace 5 años"
    ],

    citasRecientes: [{
        fecha: "2025-03-20",
        especialidad: "Cardiología",
        motivo: "Control de angina y ajuste de tratamiento",
        observaciones: "Paciente sin dolor torácico, se mantiene con buena tolerancia al esfuerzo"
      },
      {
        fecha: "2025-02-15",
        especialidad: "Medicina Interna",
        motivo: "Control general",
        observaciones: "Se solicitó perfil lipídico y ECG de control"
      }
    ],

    tratamientos: [
      "Control farmacológico de factores de riesgo cardiovascular",
      "Modificación de estilo de vida: alimentación saludable y ejercicio regular",
      "Monitoreo periódico con pruebas funcionales"
    ],

    medicamentos: [{
        nombre: "Aspirina",
        dosis: "100 mg",
        frecuencia: "1 vez al día"
      },
      {
        nombre: "Atorvastatina",
        dosis: "20 mg",
        frecuencia: "1 vez al día"
      },
      {
        nombre: "Metoprolol",
        dosis: "50 mg",
        frecuencia: "2 veces al día"
      }
    ],

    planManejo: "Continuar con tratamiento actual. Se recomienda control cardiológico trimestral, adherencia al tratamiento, realizar dieta baja en grasas saturadas, mantener ejercicio regular y evitar factores de riesgo como el estrés y el consumo de alcohol."
  };

  function mostrarResumenPacienteTextual(resumenPaciente) {
    const container = document.getElementById('resumenPacienteContainer');

    container.innerHTML = `
    <div class="resumen-textual">
      <div class="mb-4">
        <h6 class="fw-bold">Resumen general</h6>
        <p class="mb-0">${resumenPaciente.resumenGeneral}</p>
      </div>
      
      <div class="mb-4">
        <h6 class="fw-bold">Diagnósticos</h6>
        <p class="mb-2">El paciente presenta los siguientes diagnósticos registrados:</p>
        <ul class="ps-3">
          ${resumenPaciente.diagnosticos.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
      
      <div class="mb-4">
        <h6 class="fw-bold">Antecedentes relevantes</h6>
        <p class="mb-2">En su historial médico se destacan:</p>
        <ul class="ps-3">
          ${resumenPaciente.antecedentes.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      
      <div class="mb-4">
        <h6 class="fw-bold">Medicamentos</h6>
        <p class="mb-2">Al paciente se le han recetado los siguientes medicamentos:</p>
        <ul class="ps-3">
          ${resumenPaciente.medicamentos.map(m => 
            `<li>${m.nombre} (${m.dosis}, ${m.frecuencia})</li>`
          ).join('')}
        </ul>
      </div>
      
      <div class="mb-4">
        <h6 class="fw-bold">Tratamiento actual</h6>
        <p class="mb-2">El plan de manejo incluye:</p>
        <ul class="ps-3">
          ${resumenPaciente.tratamientos.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
      
      <div>
        <h6 class="fw-bold">Plan de seguimiento</h6>
        <p>${resumenPaciente.planManejo}</p>
      </div>
    </div>
  `;
  }

  // Llamar a la función con los datos del paciente
  mostrarResumenPacienteTextual(resumenPaciente);
</script>

<script type="module">
  import {
    patientService
  } from './services/api/index.js';
  import {
    getPatientNextAppointment
  } from './services/patientHelpers.js';

  const tabsContainer = document.getElementById('contenedor-tabs');
  const tabsLoadingContainer = document.getElementById('tabs-loading-container');
  const patientId = new URLSearchParams(window.location.search).get('id') || new URLSearchParams(window
    .location.search).get('patient_id');

  const patient = await patientService.get(patientId);
  const currentAppointment = getPatientNextAppointment(patient);
  const attentionType = currentAppointment?.attention_type;

  tabsContainer.classList.remove('d-none');
  tabsLoadingContainer.classList.remove('d-flex');
  tabsLoadingContainer.classList.add('d-none');

  if (currentAppointment && attentionType === 'REHABILITATION') {

    const tabsToDisplay = [
      'col-consulta',
      'col-citas',
      'col-llamar-paciente',
      'col-antecedentes',
      'col-consentimientos',
      'col-notas-enfermeria',
      'col-evoluciones',
      'col-remisiones'
    ];

    const tabs = document.querySelectorAll('.card-tab');
    tabs.forEach(tab => {
      const id = tab.id;

      if (!tabsToDisplay.includes(`${id}`)) {
        tab.style.display = 'none';
      }
    });
  }
</script>

<script type="module">
  import {
    patientService
  } from './services/api/index.js';
  import UserManager from './services/userManager.js';

  document.addEventListener('DOMContentLoaded', async function() {
    const clinicalRecordCard = document.getElementById('consulta');
    clinicalRecordCard.style.display = 'none';
    const patientId = new URLSearchParams(window.location.search).get('id') || new URLSearchParams(window
      .location.search).get('patient_id');
    const exampleData = await patientService.evolution(patientId);

    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        clinicalRecordCard.style.display = 'block';
        clinicalRecordCard.setAttribute('data-url',
          `historialConsultasEspecialidad?patient_id=${patientId}&especialidad=${user.specialty.name}`
        );
      }
    })

    const container = document.getElementById('patient-evolution-container');
    const template = document.getElementById('patient-evolution').content;

    exampleData.forEach(item => {
      const clone = document.importNode(template, true);
      const date = new Date(item.created_at);
      clone.querySelector('.timeline-item-date').innerHTML =
        `${date.toLocaleDateString()}<br>${date.toLocaleTimeString()}`;
      clone.querySelector('.timeline-item-content h5').textContent = item.title;
      clone.querySelector('.timeline-item-content p').textContent = item.content;
      container.appendChild(clone);
    });
  });
</script>

<script type="module">
  import {
    patientService,
    appointmentService,
    msMasivaService,
    templateService,
    infoCompanyService,
    ticketService
  } from './services/api/index.js';

  import {
    formatWhatsAppMessage,
    getIndicativeByCountry,
    formatDate,
  } from "../services/utilidades";

  import {
    createMassMessaging
  } from '../funciones/funcionesJS/massMessage.js';

  document.addEventListener('DOMContentLoaded', async () => {
    const tenant = window.location.hostname.split(".")[0];
    const data = {
      tenantId: tenant,
      belongsTo: "turnos-llamadoPaciente",
      type: "whatsapp",
    };
    const companies = await infoCompanyService.getCompany();
    const communications = await infoCompanyService.getInfoCommunication(companies.data[0].id);
    const template = await templateService.getTemplate(data);
    const infoInstance = {
      api_key: communications.api_key,
      instance: communications.instance
    }

    const messaging = createMassMessaging(infoInstance);

    function sendMessageWhatsapp(data, currentAppointment) {
      const replacements = {
        NOMBRE_PACIENTE: `${data?.patient?.first_name ?? ""} ${data?.patient?.middle_name ?? ""
          } ${data?.patient?.last_name ?? ""} ${data?.patient?.second_last_name ?? ""
          }`,
        TICKET: `${data?.ticket_number ?? ""}`,
        MODULO: `${data?.module?.name ?? ""}`,
        ESPECIALISTA: `${currentAppointment?.user_availability?.user?.specialty?.name ?? ""}`,
        CONSULTORIO: `${data?.branch?.address ?? ""}`,
      };

      const templateFormatted = formatWhatsAppMessage(
        template.data.template,
        replacements
      );

      const dataMessage = {
        channel: "whatsapp",
        message_type: "text",
        recipients: [
          getIndicativeByCountry(data?.patient.country_id) +
          data?.patient.whatsapp,
        ],
        message: templateFormatted,
        webhook_url: "https://example.com/webhook",
      };
      messaging.sendMessage(dataMessage).then(() => {});
    }

    function handleTabClick(element) {
      const url = element.getAttribute('data-url');
      switch (url) {
        case 'llamar_paciente':
          Swal.fire({
            title: '¿Estás seguro de llamar al paciente al consultorio?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, llamar'
          }).then(async (result) => {
            if (result.isConfirmed) {
              const patientId = new URLSearchParams(window.location.search).get('id') ||
                new URLSearchParams(window.location.search).get('patient_id');
              const patient = await patientService.get(patientId);
              const currentAppointment = patient.appointments.find(appointment => (
                appointment.appointment_state.name === 'pending_consultation' &&
                appointment.appointment_date == new Date().toISOString().split('T')[0]
              ));


              if (currentAppointment) {
                await appointmentService.changeStatus(currentAppointment.id, 'called');
                await ticketService.lastByPatient(patientId).then((response) => {

                  if (response?.patient?.whatsapp_notifications) {
                    sendMessageWhatsapp(response, currentAppointment);
                  }
                  Swal.fire(
                    '¡Paciente llamado!',
                    'Se ha llamado al paciente para que se acerque al consultorio.',
                    'success'
                  )

                });
              } else {
                Swal.fire(
                  'Error',
                  'El paciente no está en espera de consulta.',
                  'error'
                )
              }
            }
          });
          break;
          // case 'verRecetasOptometria':
          //   async function consultarDatosDoctor(doctorId) {
          //       let data = await obtenerDatosPorId("users", doctorId);

          //       let especialidad = await getSpecialtyName(data.user_specialty_id);
          //       // pendiente consultar
          //       // Datos firma
          //       return {
          //         especialidad,
          //       };
          //     }
          //     (async () => {
          //       try {
          //         const resultado = await consultarDatosDoctor(doctorId);
          //         url += '&especialidad=' + encodeURIComponent(resultado.especialidad);
          //         window.location.href = url;
          //       } catch (error) {
          //         console.error('Error al obtener datos del doctor:', error);
          //         window.location.href = url;
          //       }
          //     })();
          //   break;
        default:
          window.location.href = url;
          break;
      }
    }
    const buttons = document.querySelectorAll('.btn-tab');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        handleTabClick(button);
      });
    });
  });
</script>

<style>
  .card-text {
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 3em;
    /* Limita el texto */
    line-height: 1.5;
  }

  .timeline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin: 20px 0;
    padding: 0 10px;
    width: 100%;
    overflow-x: auto;
  }

  .timeline::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #0d6efd;
    z-index: -1;
  }

  .timeline-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 0 20px;
  }

  .timeline-item .date {
    font-weight: bold;
    padding: 5px 10px;
    border: 1px solid;
    border-radius: 5px;
    margin-bottom: 10px;
    z-index: 1;
  }

  .timeline-item .card {
    position: relative;
    border: 1px solid;
    padding: 15px;
    border-radius: 5px;
    min-width: 200px;
    text-align: center;
    z-index: 1;
  }

  .timeline-item .card::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -40px;
    transform: translateY(-50%);
    width: 40px;
    height: 4px;
    background-color: #0d6efd;
  }
</style>


<?php
include "../Consultas/modalAntencedentes.php";
include "../Consultas/modalInfoPacientes.php";
include "../footer.php";
?>
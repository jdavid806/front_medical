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
  ['icono' => 'calendar-days', 'titulo' => 'Citas', 'texto' => 'Agenda una nueva cita o revisa todas las citas agendadas a este paciente', 'url' => 'verCitas?patient_id=' . $_GET['id']],
  ['icono' => 'fas fa-address-book', 'titulo' => 'Llamar al paciente', 'texto' => 'Revisa o crea historias médicas', 'url' => 'llamar_paciente'],
  ['icono' => 'file-circle-plus', 'titulo' => 'Ordenes médicas', 'texto' => 'Revisa todos los exaenes clínicos generados a este paciente', 'url' => 'verExamenes?patient_id=' . $_GET['id']],
  ['icono' => 'kit-medical', 'titulo' => 'Recetas médicas', 'texto' => 'Genera y revisatodas las recetas médicas para este paciente', 'url' => 'verRecetas?patient_id=' . $_GET['id']],
  ['icono' => 'wheelchair', 'titulo' => 'Incapacidades clínicas', 'texto' => 'Consulta todas las incapacidades clínicas para este paciente', 'url' => 'verIncapacidades?patient_id=' . $_GET['id']],
  ['icono' => 'hospital', 'titulo' => 'Antecedentes personales', 'texto' => 'Revisa todos los antecedentes personales registrados para este paciente', 'url' => 'verAntecedentes?patient_id=' . $_GET['id']],
  ['icono' => 'book-medical', 'titulo' => 'Consentimientos', 'texto' => 'Genera y revisa todos los consentimientos y certificados registrados para este paciente', 'url' => 'verConcentimientos?patient_id=' . $_GET['id']],
  ['icono' => 'file-invoice-dollar', 'titulo' => 'Presupuestos', 'texto' => 'Genera y revisa todos los presupuestos elaborados para este paciente', 'url' => 'registros-presupuestos?patient_id=' . $_GET['id']],
  // ['icono' => 'syringe', 'titulo' => 'Esquema de vacunación', 'texto' => 'Revisa el esquema de vacunación o genera un nuevo esquema', 'url' => 'esquemaVacunacion?patient_id=' . $_GET['id']],
  //['icono' => 'book-medical', 'titulo' => 'Exámenes de laboratorio', 'texto' => 'Revisa los exámenes de laboratorio', 'url' => 'laboratorio'],
  ['icono' => 'fas fa-user-nurse', 'titulo' => 'Notas de Enfermeria', 'texto' => 'Revisa las notas de enfermeria del paciente', 'url' => 'enfermeria?patient_id=' . $_GET['id']],
  ['icono' => 'fas fa-external-link-alt', 'titulo' => 'Evoluciones', 'texto' => 'Revisa la evoluciones del paciente', 'url' => 'evoluciones?patient_id=' . $_GET['id']],
  ['icono' => 'fas fa-retweet', 'titulo' => 'Remisiones', 'texto' => 'Revisa la remisiones del paciente', 'url' => 'remisiones?patient_id=' . $_GET['id']],
];

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
        <h2 class="mb-0"><? echo $nombres ?></h2>
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
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    <h5 class="card-title mb-0">Evolución del paciente</h5>
                  </button>
                </h2>
                <div class="accordion-collapse collapse" id="collapseOne" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="accordion-body pt-3">
                    <div class="timeline-vertical" id="patient-evolution-container">

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-3 mt-2">

            <?php foreach ($tabs as $tab) { ?>
              <div class="col">
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
                    <button class="btn btn-primary btn-icon mt-auto" data-url="<?= $tab['url'] ?>" id="<?= $tab['id'] ?>" onclick="handleTabClick(this)">
                      <span class="fa-solid fa-chevron-right"></span>
                    </button>
                  </div>
                </div>
              </div>
            <?php } ?>


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
          <p class="fs-10 fw-semibold text-body-tertiary mb-0">23 August, 2023<br class="d-none d-md-block"> 10:30 AM</p>
        </div>
        <div class="timeline-item-bar position-relative me-3 me-md-0">
          <div class="icon-item icon-item-sm bg-success" data-bs-theme="light"><span class="fa-solid fa-check text-white fs-10"></span></div><span class="timeline-bar border-end border-success"></span>
        </div>
      </div>
      <div class="col">
        <div class="timeline-item-content text-start ps-6 ps-md-3">
          <h5 class="text-start">Order is processing</h5>
          <p class="fs-9 text-body-secondary mb-0" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">Your package is ready for the seller to prepare.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="module">
  import {
    patientService
  } from './services/api/index.js';
  import UserManager from './services/userManager.js';

  document.addEventListener('DOMContentLoaded', async function() {
    const clinicalRecordCard = document.getElementById('consulta');
    clinicalRecordCard.style.display = 'none';
    const patientId = new URLSearchParams(window.location.search).get('id') || new URLSearchParams(window.location.search).get('patient_id');
    const exampleData = await patientService.evolution(patientId);

    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        clinicalRecordCard.style.display = 'block';
        clinicalRecordCard.setAttribute('data-url', `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}`);
      }
    })

    const container = document.getElementById('patient-evolution-container');
    const template = document.getElementById('patient-evolution').content;

    exampleData.forEach(item => {
      const clone = document.importNode(template, true);
      const date = new Date(item.created_at);
      clone.querySelector('.timeline-item-date').innerHTML = `${date.toLocaleDateString()}<br>${date.toLocaleTimeString()}`;
      clone.querySelector('.timeline-item-content h5').textContent = item.title;
      clone.querySelector('.timeline-item-content p').textContent = item.content;
      container.appendChild(clone);
    });
  });
</script>

<script>
  function handleTabClick(element) {
    const url = element.getAttribute('data-url');
    switch (url) {
      case 'llamar_paciente':
        console.log("llamar al paciente");
        Swal.fire({
          title: '¿Estás seguro de llamar al paciente al consultorio?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, llamar'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              '¡Paciente llamado!',
              'Se ha llamado al paciente para que se acerque al consultorio.',
              'success'
            )
          }
        });
        break;
      default:
        window.location.href = url;
        break;
    }
  }
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
<?php
include "../menu.php";
include "../header.php";
?>

<style>
  .custom-btn {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }

  .custom-btn i {
    margin-right: 5px;
  }
</style>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Consentimientos Informados</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-0">Consentimientos Informados</h2>
            <small class="patientName">Cargando...</small>
          </div>
          <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalCrearDocumento">
            <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo Consentimientos</button>
        </div>
      </div>
    </div>

    <div class="row mt-4">

      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th class="sort" data-sort="fecha">Fecha</th>
            <th class="sort" data-sort="motivo">titulo</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody class="list" id="tablaPlantillasC">
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php
include "./modalDocumento.php";
?>

<script type="module">
  import {
    patientService
  } from "../../services/api/index.js";

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

<?php
include "../footer.php";
?>
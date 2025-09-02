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
     .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }

  .custom-btn i {
    margin-right: 5px;
  }
</style>

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    PrescriptionApp
  } from './react-dist/prescriptions/PrescriptionApp.js';

  ReactDOMClient.createRoot(document.getElementById('prescriptionAppReact')).render(React.createElement(PrescriptionApp));
</script>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Recetas</li>
      </ol>
    </nav>

    <div class="row mt-4">

      <div id="prescriptionAppReact"></div>

    </div>

  </div>
</div>

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

<?php include "../footer.php";
include "./modalAgregarReceta.php";
?>
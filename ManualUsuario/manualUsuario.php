<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <!-- <li class="breadcrumb-item"><a href="pacientes">Manual de Usuario</a></li> -->
        <!-- <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li> -->
        <li class="breadcrumb-item active" onclick="location.reload()">Manual de Usuario</li>
      </ol>
    </nav>

    <!-- <div class="d-flex justify-content-end mb-3">
      <a class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalCrearCita">
        <i class="fas fa-calendar-plus"></i> Nueva Cita
      </a>
    </div> -->
    <div id="ManualUsuario"></div>
  </div>
</div>
<?php include "../Citas//modalCitas.php"; ?>
<?php include "../footer.php"; ?>

<!-- <script type="module">
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
</script> -->

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    ManualUsuario
  } from './react-dist/manual-usuario/ManualUsuario.js';

  ReactDOMClient.createRoot(document.getElementById('ManualUsuario')).render(React.createElement(ManualUsuario));
</script>
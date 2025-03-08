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

<?php include "../footer.php";
include "./modalAgregarReceta.php";
?>
<div class="modal fade modal-xl" id="modalVerInfoPaciente" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-xl">
    <div class="modal-content">

      <!-- Encabezado del modal -->
      <div class="modal-header">
        <h5 class="modal-title fw-bold" id="exampleModalLabel">Datos del paciente</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <!-- Cuerpo del modal -->
      <div class="modal-body">
        <!-- Datos Generales -->
        <div id="modalBodyInfoPacientesReact"></div>

      </div>

      <!-- Footer del modal -->
      <!-- <div class="modal-footer d-flex justify-content-end">
        <div class="btn-group me-3">
          <a href="#<?php echo $consulta['historiaId']; ?>" title="Imprimir antecedentes" class="btn text-primary p-0">
            <i class="fa-solid fa-print"></i>
          </a>
          <a href="#<?php echo $consulta['historiaId']; ?>" title="Descargar antecedentes" class="btn text-primary p-0 ms-3">
            <i class="fa-solid fa-download"></i>
          </a>
          <div class="dropdown ms-3">
            <a class="btn text-primary p-0" href="#" role="button" title="Compartir" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="fa-solid fa-share-nodes"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#"><i class="fa-brands fa-whatsapp"></i> Compartir por Whatsapp</a></li>
              <li><a class="dropdown-item" href="#"><i class="fa-solid fa-envelope"></i> Compartir por Correo</a></li>
            </ul>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</div>

<?php
include "../Pacientes/modalPacientes.php";
?>

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    PatientInfoContainer
  } from './react-dist/patients/PatientInfoContainer.js';

  ReactDOMClient.createRoot(document.getElementById('modalBodyInfoPacientesReact')).render(React.createElement(PatientInfoContainer, {
    patientId: (
      new URLSearchParams(window.location.search).get('id') ||
      new URLSearchParams(window.location.search).get('patient_id')
    )
  }));
</script>

<style>
  .logo {
    font-size: 24px;
    /* Tamaño del ícono */
    border: 2px solid #000;
    /* Borde cuadrado */
    background-color: #d3d3d3;
    /* Fondo gris */
    padding: 5px;
    /* Espacio interno para el ícono */
    border-radius: 4px;
    /* Opcional: hace que los bordes sean ligeramente redondeados */
  }
</style>
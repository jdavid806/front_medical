<?php
$generoPaciente = 'femenino';

$consultas = [
  ['fecha' => '2024-11-20', 'descripcion' => 'Consulta sobre productos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
  ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
];
?>

<div class="modal fade" id="modalDetallePaciente" tabindex="-1" aria-labelledby="modalAntecedenteLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="modalAntecedenteLabel">Información del Paciente</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

        <div class="steps-container mb-4">
          <ul class="stepsC">
            <li class="stepM active" data-step="1">
              <span class="step-number">1</span>
              <span class="step-label">Datos generales</span>
            </li>
            <li class="stepM" data-step="2">
              <span class="step-number">2</span>
              <span class="step-label">Antecedentes</span>
            </li>
            <li class="stepM" data-step="3">
              <span class="step-number">3</span>
              <span class="step-label">Historial del paciente</span>
            </li>
          </ul>
        </div>

        <!-- Datos generales -->
        <div class="wizard-content">
          <div class="p-3 wizard-stepM active" data-step="1">
            <div id="modalBodyInfoPacientesReact"></div>
          </div>


          <!-- Antecedentes -->
          <div class="p-3 wizard-stepM" data-step="2">
            <div id="modalBodyAntecedentesDetalleReact"></div>
          </div>

          <!-- Historial -->
          <div class="p-3 wizard-stepM" data-step="3">
            <div id="modalBodyHistorialReact"></div>
          </div>

        </div>

      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="prevStepDatos" type="button" disabled>Anterior</button>
        <button class="btn btn-primary" id="nextStepDatos" type="button">Siguiente</button>
        <button class="btn btn-secondary d-none" id="finishStepDatos" type="submit" form="wizardForm">Finalizar</button>
      </div>
    </div>
  </div>
</div>

<style>
  .steps-container {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: scroll;
  }

  .stepsC {
    list-style: none;
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin: 0;
  }

  .stepM {
    text-align: center;
    position: relative;
    flex: 1;
    min-width: 200px
  }

  .step-number {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    background-color: #e9ecef;
    color: #0d6efd;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .stepM.active .step-number {
    background-color: #0d6efd;
    color: #fff;
  }

  .wizard-stepM {
    display: none;
  }

  .wizard-stepM.active {
    display: block;
  }

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

<script>
  const modalContainer = document.getElementById("modalDetallePaciente");
  const stepsContainerM = document.getElementById("stepsC");
  let currentStepM = 1;

  function updateWizardM(totalStepsM) {
    document.querySelectorAll(".stepM").forEach(step => {
      step.classList.toggle("active", step.dataset.step == currentStepM);
    });

    document.querySelectorAll(".wizard-stepM").forEach(step => {
      step.classList.toggle("active", step.dataset.step == currentStepM);
    });

    document.getElementById("prevStepDatos").disabled = currentStepM === 1;
    document.getElementById("nextStepDatos").classList.toggle("d-none", currentStepM === totalStepsM);
    // document.getElementById("finishStepDatos").classList.toggle("d-none", currentStepM !== totalSteps);
  }

  document.getElementById("nextStepDatos").addEventListener("click", () => {
    currentStepM++;
    updateWizardM(document.querySelectorAll(".wizard-stepM").length);
  });

  document.getElementById("prevStepDatos").addEventListener("click", () => {
    currentStepM--;
    updateWizardM(document.querySelectorAll(".wizard-stepM").length);
  });
</script>

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    PatientInfoContainer
  } from './react-dist/patients/PatientInfoContainer.js';
  import {
    PastMedicalHistoryDetail
  } from './react-dist/past-medical-history/PastMedicalHistoryDetail.js';
  import {
    PatientEvolution
  } from './react-dist/patients/PatientEvolution.js';

  ReactDOMClient.createRoot(document.getElementById('modalBodyInfoPacientesReact')).render(React.createElement(PatientInfoContainer, {
    patientId: (
      new URLSearchParams(window.location.search).get('id') ||
      new URLSearchParams(window.location.search).get('patient_id')
    )
  }));
  ReactDOMClient.createRoot(document.getElementById('modalBodyAntecedentesDetalleReact')).render(React.createElement(PastMedicalHistoryDetail));
  ReactDOMClient.createRoot(document.getElementById('modalBodyHistorialReact')).render(React.createElement(PatientEvolution));
</script>
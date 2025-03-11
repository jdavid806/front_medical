<?php
include "../ConsultasJson/dataPaciente.php";
?>

<div class="modal fade modal-xl" id="finishModal" tabindex="-1" aria-labelledby="finishModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="finishModalLabel">Finalizar consulta</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="d-flex gap-4 mb-3">
          <div class="d-flex" style="min-width: 200px">
            <ul class="nav flex-column nav-underline fs-9" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <a class="nav-link" id="examenes-tab" data-bs-toggle="tab"
                  href="#examenesClinicosTab" role="tab"
                  aria-controls="examenesClinicosTab" aria-selected="true">
                  <span class="text-primary uil uil-file-alt"></span> Exámenes
                  clínicos
                </a>
              </li>
              <li class="nav-item" role="presentation">
                <a class="nav-link" id="incapacidades-tab" data-bs-toggle="tab"
                  href="#incapacidadesClinicasTab" role="tab"
                  aria-controls="incapacidadesClinicasTab" aria-selected="false">
                  <span class="text-primary uil uil-wheelchair"></span> Incapacidades
                  clínicas
                </a>
              </li>
              <li class="nav-item" role="presentation">
                <a class="nav-link" id="recetas-tab" data-bs-toggle="tab"
                  href="#recetasTab" role="tab" aria-controls="recetasTab"
                  aria-selected="false">
                  <span class="text-primary uil-clipboard"></span> Recetas médicas
                </a>
              </li>
              <li class="nav-item" role="presentation">
                <a class="nav-link" id="remisiones-tab" data-bs-toggle="tab"
                  href="#remisionesTab" role="tab" aria-controls="remisionesTab"
                  aria-selected="false">
                  <span class="text-primary uil-sync"></span> Remisión
                </a>
              </li>
            </ul>
          </div>
          <div class="flex-grow-1">
            <div class="tab-content">
              <div class="tab-pane fade" id="examenesClinicosTab" role="tabpanel">
                <div class="d-flex justify-content-between align-items-center">
                  <h4>Exámenes clínicos</h4>
                  <button id="btnAgregarExamenes" class="btn btn-primary" type="button">
                    <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar exámenes
                  </button>
                  <button id="btnCancelarExamenes" class="btn btn-danger" type="button" style="display: none;">
                    <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                  </button>
                </div>
                <hr>
                <div id="examsFormReact" style="display: none;"></div>
              </div>

              <div class="tab-pane fade" id="incapacidadesClinicasTab" role="tabpanel">
                <div class="d-flex justify-content-between align-items-center">
                  <h4>Incapacidades clínicas</h4>
                  <button id="btnAgregarIncapacidad" class="btn btn-primary" type="button">
                    <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar incapacidad
                  </button>
                  <button id="btnCancelarIncapacidad" class="btn btn-danger" type="button" style="display: none;">
                    <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                  </button>
                </div>
                <hr>
                <div id="contenidoIncapacidad" style="display: none;">
                  <?php include "../Incapacidades/formIncapacidad.php"; ?>
                </div>
              </div>

              <div class="tab-pane fade" id="recetasTab" role="tabpanel">
                <div class="d-flex justify-content-between align-items-center">
                  <h4>Recetas médicas</h4>
                  <button id="btnAgregarReceta" class="btn btn-primary" type="button">
                    <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar receta
                  </button>
                  <button id="btnCancelarReceta" class="btn btn-danger" type="button" style="display: none;">
                    <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                  </button>
                </div>
                <hr>
                <div id="prescriptionFormReact" style="display: none;"></div>
              </div>

              <div class="tab-pane fade" id="remisionesTab" role="tabpanel">
                <div class="d-flex justify-content-between align-items-center">
                  <h4>Remisión</h4>
                  <button id="btnAgregarRemision" class="btn btn-primary" type="button">
                    <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar remisión
                  </button>
                  <button id="btnCancelarRemision" class="btn btn-danger" type="button" style="display: none;">
                    <span class="fa-solid fa-times me-2 fs-9"></span> Cancelar
                  </button>
                </div>
                <hr>
                <div id="remisionFormReact" style="display: none;"></div>
              </div>
            </div>
          </div>
        </div>

        <p class="fs-9 text-danger">Antes de finalizar la consulta por favor complete la siguiente información:</p>

        <!-- Sección: Motivo & Observaciones de la consulta -->
        <form class="needs-validation" novalidate>
          <!-- Sección: RIPS -->
          <h6 class="mt-4 mb-3">RIPS</h6>
          <div class="mb-2">
            <label class="form-check-label" for="gneraRipsCheck">Generar Rips</label>

            <div id="generarRips">

              <!-- <div class="form-floating mb-3">
                <select class="form-select" id="tipoRip" required>
                  <option value="" selected disabled>Seleccione</option>
                  <option value="consulta">Consulta</option>
                  <option value="procedimiento">Procedimiento</option>
                </select>
                <label for="tipoRip">Tipo de RIPS *</label>
                <div class="invalid-feedback">Por favor seleccione el tipo de RIPS.</div>
              </div> -->

              <!-- <div class="form-floating mb-3">
                <select class="form-select" id="tipoConsulta">
                  <option value="" selected disabled>Seleccione</option>
                  <option value="control">Control</option>
                  <option value="urgencia">Urgencia</option>
                  <option value="primera_vez">Primera vez</option>
                  <option value="seguimiento">Seguimiento</option>
                </select>
                <label for="tipoConsulta">Tipo de consulta</label>
              </div> -->

              <!-- Diagnóstico principal -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <div class="form-floating">
                    <select class="form-select" id="diagnosticoPrincipal" required>
                      <option value="" selected disabled>Seleccione</option>
                      <option value="A00">A00 - Cólera</option>
                      <option value="B01">B01 - Varicela</option>
                      <option value="C34">C34 - Neoplasia maligna del pulmón</option>
                      <option value="E11">E11 - Diabetes mellitus tipo 2</option>
                    </select>
                    <label for="diagnosticoPrincipal">Diagnóstico principal *</label>
                    <div class="invalid-feedback">Por favor seleccione un diagnóstico principal.</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <select class="form-select" id="tipoDiagnostico">
                      <option value="" selected disabled>Seleccione</option>
                      <option value="definitivo">Definitivo</option>
                      <option value="presuntivo">Presuntivo</option>
                      <option value="diferencial">Diferencial</option>
                    </select>
                    <label for="tipoDiagnostico">Tipo de diagnóstico</label>
                  </div>
                </div>
              </div>

              <!-- Diagnósticos relacionados -->
              <div class="row g-3 mb-3">
                <div class="col-md-4">
                  <div class="form-floating">
                    <select class="form-select" id="diagnosticoRel1">
                      <option value="" selected disabled>Seleccione</option>
                      <option value="J18">J18 - Neumonía</option>
                      <option value="M79">M79 - Dolor muscular</option>
                      <option value="K35">K35 - Apendicitis aguda</option>
                      <option value="N39">N39 - Infección del tracto urinario</option>
                    </select>
                    <label for="diagnosticoRel1">Diagnóstico relacionado 1</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <select class="form-select" id="diagnosticoRel2">
                      <option value="" selected disabled>Seleccione</option>
                      <option value="J18">J18 - Neumonía</option>
                      <option value="M79">M79 - Dolor muscular</option>
                      <option value="K35">K35 - Apendicitis aguda</option>
                      <option value="N39">N39 - Infección del tracto urinario</option>
                    </select>
                    <label for="diagnosticoRel2">Diagnóstico relacionado 2</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <select class="form-select" id="diagnosticoRel3">
                      <option value="" selected disabled>Seleccione</option>
                      <option value="J18">J18 - Neumonía</option>
                      <option value="M79">M79 - Dolor muscular</option>
                      <option value="K35">K35 - Apendicitis aguda</option>
                      <option value="N39">N39 - Infección del tracto urinario</option>
                    </select>
                    <label for="diagnosticoRel3">Diagnóstico relacionado 3</label>
                  </div>
                </div>
              </div>

              <!-- Finalidad de consulta -->
              <!-- <div class="form-floating mb-3">
                <select class="form-select" id="finalidadConsulta">
                  <option value="" selected disabled>Seleccione</option>
                  <option value="promocion">Promoción</option>
                  <option value="prevencion">Prevención</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="rehabilitacion">Rehabilitación</option>
                </select>
                <label for="finalidadConsulta">Finalidad de consulta</label>
              </div> -->

              <!-- Causa externa -->
              <!-- <div class="form-floating mb-3">
                <select class="form-select" id="causaExterna">
                  <option value="" selected disabled>Seleccione</option>
                  <option value="otra">Otra</option>
                  <option value="no_aplica">No aplica</option>
                </select>
                <label for="causaExterna">Causa externa</label>
              </div> -->

              <!-- Número de autorización -->
              <!-- <div class="form-floating mb-3">
                <input type="text" class="form-control" id="numeroAutorizacion" placeholder="Número de autorización">
                <label for="numeroAutorizacion">Número de autorización</label>
              </div> -->
              <h6 class="mb-3">observaciones y diagnosticos sugeridos</h6>
              <div class="form-floating mb-3">
                <textarea required class="form-control" id="motivo" rows="3"></textarea>
                <label for="motivo">Observaciones</label>
                <div class="invalid-feedback">Por favor llene el motivo de consulta.</div>
              </div>
        </form>
      </div>
    </div>

    <div class="modal-footer d-flex justify-content-between">
      <!-- <span class="timer text-danger">Tiempo en consulta: <span id="modalTimerDisplay">00:00:00</span></span> -->
      <div>
        <script>
          let startTime = 0;
          let intervalId = 0;

          function startTimer() {
            startTime = Date.now();
            intervalId = setInterval(function() {
              const elapsedTime = Date.now() - startTime;
              const h = Math.floor(elapsedTime / 1000 / 60 / 60);
              const m = Math.floor(elapsedTime / 1000 / 60) % 60;
              const s = Math.floor(elapsedTime / 1000) % 60;
              // document.getElementById('modalTimerDisplay').innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }, 1000);
          }

          function stopTimer() {
            clearInterval(intervalId);
          }

          document.addEventListener('DOMContentLoaded', function() {
            startTimer();
          });
        </script>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Volver</button>
        <button type="button" class="btn btn-primary" id="finalizarConsulta">Finalizar</button>
      </div>
    </div>
  </div>
</div>
</div>


<script>
  document.getElementById('btnAgregarIncapacidad').addEventListener('click', function() {
    document.getElementById('contenidoIncapacidad').style.display = 'block';
    document.getElementById('btnAgregarIncapacidad').style.display = 'none';
    document.getElementById('btnCancelarIncapacidad').style.display = 'block';
  });
  document.getElementById('btnCancelarIncapacidad').addEventListener('click', function() {
    document.getElementById('contenidoIncapacidad').style.display = 'none';
    document.getElementById('btnCancelarIncapacidad').style.display = 'none';
    document.getElementById('btnAgregarIncapacidad').style.display = 'block';
  });

  document.getElementById('btnAgregarReceta').addEventListener('click', function() {
    document.getElementById('prescriptionFormReact').style.display = 'block';
    document.getElementById('btnAgregarReceta').style.display = 'none';
    document.getElementById('btnCancelarReceta').style.display = 'block';
  });
  document.getElementById('btnCancelarReceta').addEventListener('click', function() {
    document.getElementById('prescriptionFormReact').style.display = 'none';
    document.getElementById('btnCancelarReceta').style.display = 'none';
    document.getElementById('btnAgregarReceta').style.display = 'block';
  });

  document.getElementById('btnAgregarRemision').addEventListener('click', function() {
    document.getElementById('remisionFormReact').style.display = 'block';
    document.getElementById('btnAgregarRemision').style.display = 'none';
    document.getElementById('btnCancelarRemision').style.display = 'block';
  });
  document.getElementById('btnCancelarRemision').addEventListener('click', function() {
    document.getElementById('remisionFormReact').style.display = 'none';
    document.getElementById('btnCancelarRemision').style.display = 'none';
    document.getElementById('btnAgregarRemision').style.display = 'block';
  });
  document.getElementById('btnAgregarExamenes').addEventListener('click', function() {
    document.getElementById('examsFormReact').style.display = 'block';
    document.getElementById('btnAgregarExamenes').style.display = 'none';
    document.getElementById('btnCancelarExamenes').style.display = 'block';
  });
  document.getElementById('btnCancelarExamenes').addEventListener('click', function() {
    document.getElementById('examsFormReact').style.display = 'none';
    document.getElementById('btnCancelarExamenes').style.display = 'none';
    document.getElementById('btnAgregarExamenes').style.display = 'block';
  });
</script>

<script type="module">
  import {
    clinicalRecordService
  } from "../../services/api/index.js";
  import {
    AlertManager
  } from "../../services/alertManager.js";
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import PrescriptionForm from './react-dist/prescriptions/components/PrescriptionForm.js';
  import {
    remissionsForm
  } from './react-dist/remissions/RemissionsForm.js';
  import {
    ExamForm
  } from './react-dist/exams/components/ExamForm.js';
  import {
    packagesService
  } from "./services/api/index.js";

  let formValues = {};
  ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React.createElement(PrescriptionForm, {
    formId: 'createPrescription',
    handleSubmit: (medicines) => {
      console.log(medicines);
    }
  }));
  ReactDOMClient.createRoot(document.getElementById('remisionFormReact')).render(React.createElement(remissionsForm));
  ReactDOMClient.createRoot(document.getElementById('examsFormReact')).render(React.createElement(ExamForm));


  document.addEventListener("DOMContentLoaded", async function() {
    const params = new URLSearchParams(window.location.search);
    const jsonPath = `../../ConsultasJson/${params.get("tipo_historia")}.json`;
    // const timerElement = document.getElementById('timer');
    // const finishBtn = document.getElementById('finishBtn');
    // const modalTimer = document.getElementById('modalTimer');
    // let startTime = new Date();

    console.log("Cargado", jsonPath);
    try {
      const response = await fetch(jsonPath);
      const formData = await response.json();

      generateForm(formData.form1);
      // updateTimer();

      // document.getElementById("finalizarConsulta").addEventListener("click", function () {
      //     captureFormValues(formData.form1);
      //     console.log("Valores capturados:", formValues);
      //     clinicalRecordService.createForParent(1, {
      //         "clinical_record_type_id": 1,
      //         "created_by_user_id": 1,
      //         "branch_id": 1,
      //         "data": formValues
      //     }).then(() => AlertManager.success({
      //         text: 'Se ha creado el registro exitosamente',
      //         onClose: () => {
      //             window.location.reload();
      //         }
      //     })).catch(err => {
      //         if (err.data?.errors) {
      //             AlertManager.formErrors(err.data.errors);
      //         } else {
      //             AlertManager.error({
      //                 text: err.message || 'Ocurrió un error inesperado'
      //             });
      //         }
      //     });
      // });'

      const packages = await packagesService.getAllPackages();
      let data = {}

      const formIncapacidad = document.getElementById('formCrearIncapacidad');
      const getDataFromFormIncapacidad = () => {
        const formData = new FormData(formIncapacidad);
        data = {};
        for (const pair of formData.entries()) {
          data[pair[0]] = pair[1];
        }
        return data;
      }

      document.getElementById("finalizarConsulta").addEventListener("click", function() {
        captureFormValues(formData.form1);
        console.log("Valores capturados:", formValues);
        console.log(getDataFromFormIncapacidad());

        // clinicalRecordService.createForParent(1, {
        //     "clinical_record_type_id": 1,
        //     "created_by_user_id": 1,
        //     "branch_id": 1,
        //     "data": formValues
        // }).then(() => AlertManager.success({
        //     text: 'Se ha creado el registro exitosamente',
        //     onClose: () => {
        //         window.location.reload();
        //     }
        // })).catch(err => {
        //     if (err.data?.errors) {
        //         AlertManager.formErrors(err.data.errors);
        //     } else {
        //         AlertManager.error({
        //             text: err.message || 'Ocurrió un error inesperado'
        //         });
        //     }
        // });
      });

      console.log('Paquetes', packages);
    } catch (error) {
      console.error("Error cargando el JSON:", error);
    }
  });

  function createSelect(field) {
    const div = document.createElement("div");
    // div.className = "mb-3 form-floating";
    if (!field.class) {
      // div.className = "mb-3 form-floating";  
      div.className = "col-12 mb-3";
    } else {
      div.className = field.class;
    }

    const select = document.createElement("select");
    select.className = "form-select";
    select.id = field.id;
    select.name = field.id;

    const defaultOption = document.createElement("option");
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione";
    select.appendChild(defaultOption);

    field.options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.text;
      select.appendChild(opt);
    });

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", field.id);
    labelEl.className = "form-label";
    labelEl.textContent = field.label;
    // labelEl.style = "margin-left: 20px";

    div.appendChild(labelEl);
    div.appendChild(select);
    return div;
  }

  // function createSelect(id, label, options) {
  //     const div = document.createElement("div");
  //     div.className = "mb-3 form-floating";

  //     const select = document.createElement("select");
  //     select.className = "form-select";
  //     select.id = id;
  //     select.name = id;

  //     const defaultOption = document.createElement("option");
  //     defaultOption.selected = true;
  //     defaultOption.disabled = true;
  //     defaultOption.value = "";
  //     defaultOption.textContent = "Seleccione";
  //     select.appendChild(defaultOption);

  //     options.forEach((option) => {
  //         const opt = document.createElement("option");
  //         opt.value = option.value;
  //         opt.textContent = option.text;
  //         select.appendChild(opt);
  //     });

  //     const labelEl = document.createElement("label");
  //     labelEl.setAttribute("for", id);
  //     labelEl.className = "form-label";
  //     labelEl.textContent = label;

  //     div.appendChild(select);
  //     div.appendChild(labelEl);
  //     return div;
  // }

  function createDropzone(field) {
    // Crear el elemento div principal
    const div = document.createElement("div");
    div.className = "dropzone dropzone-multiple p-0 dz-clickable";
    div.id = field.id;
    div.setAttribute("data-dropzone", "data-dropzone");

    // Crear el mensaje de dropzone
    const messageDiv = document.createElement("div");
    messageDiv.className = "dz-message";
    messageDiv.setAttribute("data-dz-message", "data-dz-message");

    // Crear la imagen del ícono
    const icon = document.createElement("img");
    icon.className = "me-2";
    icon.src = field.iconSrc || "../../../assets/img/icons/cloud-upload.svg";
    icon.width = 25;
    icon.alt = "";

    // Agregar el ícono y el texto al mensaje
    messageDiv.appendChild(icon);
    messageDiv.appendChild(document.createTextNode(field.message || "Cargar archivos"));

    // Crear modal de previsualización de la imagen
    const previewModal = document.createElement("div");
    previewModal.className = "modal fade";
    previewModal.id = `${field.id}-preview-modal`;
    previewModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vista Previa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img id="${field.id}-full-preview" class="img-fluid" src="" alt="Vista previa">
          </div>
        </div>
      </div>
    `;

    // Agregar modal al documento
    document.body.appendChild(previewModal);

    // Agregar todos los elementos al div principal
    div.appendChild(messageDiv);

    // Configurar Dropzone con opciones adicionales
    const dropzoneInstance = new Dropzone(div, {
      url: field.uploadUrl || "/upload",
      paramName: "file",
      maxFilesize: field.maxFilesize || 10,
      acceptedFiles: field.acceptedFiles || "image/*",
      dictDefaultMessage: "Arrastra los archivos aquí para subirlos.",
      dictFallbackMessage: "Tu navegador no soporta la funcionalidad de arrastrar y soltar archivos.",
      dictInvalidFileType: "Tipo de archivo no permitido.",
      dictFileTooBig: "El archivo es demasiado grande ({{filesize}}MB). El tamaño máximo permitido es {{maxFilesize}}MB.",
      dictResponseError: "Error al subir el archivo.",

      // Personalizar la previsualización para agregar botones de acciones
      previewTemplate: `
        <div class="dz-preview dz-file-preview d-flex align-items-center mb-2 position-relative">
          <div class="dz-image me-2" style="max-width: 80px; max-height: 80px;">
            <img data-dz-thumbnail class="img-fluid" />
          </div>
          <div class="dz-details-wrapper position-relative flex-grow-1" style="height: 80px; max-width: calc(100% - 210px); overflow: hidden;">
            <div class="dz-details bg-dark bg-opacity-75 text-white p-1 text-center w-100" style="font-size: 0.7rem;">
              <div class="dz-filename text-truncate"><span data-dz-name></span></div>
              <div class="dz-size" style="font-size: 0.6rem;"><span data-dz-size></span></div>
            </div>
          </div>
          <div class="dz-actions d-flex justify-content-end gap-2" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%);">
            <!-- Botones con un pequeño espacio entre ellos -->
            <button type="button" class="btn btn-info btn-sm d-flex justify-content-center align-items-center p-1 dz-preview-btn" style="width: 50px; height: 30px;" data-bs-toggle="modal">
              <i class="far fa-eye"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm d-flex justify-content-center align-items-center p-1" style="width: 50px; height: 30px;" data-dz-remove>
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `,

      // Agregar eventos personalizados
      init: function() {
        // Manejar la eliminación de archivos
        this.on("removedfile", function(file) {
          console.log("Archivo eliminado:", file.name);

          // Lógica opcional para eliminar del servidor
          if (file.serverFileName) {
            fetch('/delete-file', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  filename: file.serverFileName
                })
              })
              .then(response => response.json())
              .then(data => {
                console.log('Archivo eliminado del servidor:', data);
              })
              .catch(error => {
                console.error('Error al eliminar el archivo:', error);
              });
          }
        });

        // Configurar eventos de vista previa
        this.on("addedfile", function(file) {
          // Seleccionar elementos relevantes
          const previewButton = file.previewElement.querySelector('.dz-preview-btn');
          const detailsWrapper = file.previewElement.querySelector('.dz-details-wrapper');
          const detailsDiv = file.previewElement.querySelector('.dz-details');

          // Configurar el evento de clic para abrir la vista previa
          previewButton.addEventListener('click', function() {
            // Obtener la referencia del modal y la imagen
            const modal = document.getElementById(`${field.id}-preview-modal`);
            const fullPreviewImg = document.getElementById(`${field.id}-full-preview`);

            // Establecer la imagen en el modal
            fullPreviewImg.src = file.dataURL;

            // Usar Bootstrap Modal para mostrar (asume que Bootstrap JS está incluido)
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
          });
        });
      }
    });

    return div;
  }

  function createSingleFileDropzone(field) {
    // Crear el elemento div principal
    const div = document.createElement("div");
    div.className = "dropzone dropzone-single p-0 dz-clickable position-relative overflow-hidden d-flex flex-column align-items-center";
    div.id = field.id;
    div.setAttribute("data-dropzone", "data-dropzone");
    div.style.minHeight = "550px"; // Aumentar altura para incluir botón
    div.style.border = "none"; // Eliminar borde
    div.style.outline = "none"; // Eliminar contorno

    // Crear el contenedor de previsualización
    const previewContainer = document.createElement("div");
    previewContainer.className = "dz-preview-container position-relative w-100";
    previewContainer.style.height = "500px";
    previewContainer.style.display = "flex";
    previewContainer.style.alignItems = "center";
    previewContainer.style.justifyContent = "center";

    // Crear el mensaje de dropzone
    const messageDiv = document.createElement("div");
    messageDiv.className = "dz-message d-flex flex-column align-items-center justify-content-center text-center";

    // Crear la imagen del ícono
    const icon = document.createElement("img");
    icon.className = "mb-2";
    icon.src = field.iconSrc || "../../../assets/img/icons/cloud-upload.svg";
    icon.width = 50;
    icon.alt = "Upload icon";

    // Crear el texto del mensaje
    const messageText = document.createElement("span");
    messageText.textContent = field.message || "Arrastra tu archivo aquí o haz clic para seleccionar";

    // Crear el contenedor de imagen previa
    const previewImageContainer = document.createElement("div");
    previewImageContainer.className = "dz-preview-image position-absolute w-100 h-100 d-none";
    previewImageContainer.style.top = "0";
    previewImageContainer.style.left = "0";

    const previewImage = document.createElement("img");
    previewImage.className = "img-fluid w-100 h-100 object-fit-contain";

    // Crear contenedor para los botones
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "mt-3 d-none d-flex gap-2 justify-content-center";

    // Crear botón de cambiar imagen
    const changeImageButton = document.createElement("button");
    changeImageButton.className = "btn btn-primary btn-sm";
    changeImageButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Cambiar imagen';

    // Crear botón de eliminar imagen
    const deleteImageButton = document.createElement("button");
    deleteImageButton.className = "btn btn-danger btn-sm";
    deleteImageButton.innerHTML = '<i class="fas fa-trash-alt me-2"></i>Eliminar imagen';

    // Agregar elementos
    messageDiv.appendChild(icon);
    messageDiv.appendChild(messageText);

    buttonContainer.appendChild(changeImageButton);
    buttonContainer.appendChild(deleteImageButton);

    previewImageContainer.appendChild(previewImage);
    previewContainer.appendChild(messageDiv);
    previewContainer.appendChild(previewImageContainer);

    div.appendChild(previewContainer);
    div.appendChild(buttonContainer);

    // Configurar Dropzone
    const dropzoneInstance = new Dropzone(div, {
      url: field.uploadUrl || "/upload",
      paramName: "file",
      maxFilesize: field.maxFilesize || 10,
      acceptedFiles: field.acceptedFiles || "image/*",
      maxFiles: 1, // Limitar a un solo archivo
      dictDefaultMessage: "Arrastra tu archivo aquí o haz clic para seleccionar",
      dictInvalidFileType: "Tipo de archivo no permitido",
      dictFileTooBig: "El archivo es demasiado grande ({{filesize}}MB). El tamaño máximo permitido es {{maxFilesize}}MB",

      // Desactivar previewTemplate predeterminado
      previewTemplate: '<div></div>',

      // Configuración personalizada
      clickable: true,
      createImageThumbnails: false,

      // Eventos personalizados
      init: function() {
        const dropzone = this;
        const message = messageDiv;
        const previewCont = previewImageContainer;
        const dropzoneElement = div;
        const changeBtn = buttonContainer;
        const changeImageBtn = changeImageButton;
        const deleteImageBtn = deleteImageButton;

        // Evento cuando se agrega un archivo
        this.on("addedfile", function(file) {
          // Ocultar completamente el mensaje y los elementos de dropzone
          message.style.display = 'none';
          dropzoneElement.classList.remove('dz-clickable');

          // Mostrar imagen de previsualización
          previewCont.classList.remove('d-none');
          previewImage.src = URL.createObjectURL(file);

          // Mostrar botones de cambiar y eliminar imagen
          changeBtn.classList.remove('d-none');
        });

        // Evento de eliminación de archivo
        this.on("removedfile", function() {
          // Restaurar mensaje y elementos de dropzone
          message.style.display = 'flex';
          dropzoneElement.classList.add('dz-clickable');

          // Ocultar previsualización
          previewCont.classList.add('d-none');
          previewImage.src = '';

          // Ocultar botones de cambiar y eliminar imagen
          changeBtn.classList.add('d-none');
        });

        // Configurar botón de cambiar imagen
        changeImageBtn.addEventListener('click', function() {
          // Abrir diálogo de selección de archivos
          dropzone.hiddenFileInput.click();
        });

        // Configurar botón de eliminar imagen
        deleteImageBtn.addEventListener('click', function() {
          // Eliminar todos los archivos
          dropzone.removeAllFiles(true);
        });
      }
    });

    return div;
  }



  function createImageField(field) {
    const div = document.createElement("div");
    div.className = "mb-3";

    const img = document.createElement("img");
    img.id = field.id;
    // img.name = field.name;
    img.src = field.src;
    img.alt = field.alt;
    img.className = "img-fluid"; // Bootstrap para que sea responsiva
    img.style.width = field.width || "100px";
    img.style.height = field.height || "100px";

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", field.id);
    labelEl.className = "form-label";
    labelEl.textContent = field.label;

    div.appendChild(labelEl);
    div.appendChild(img);

    return div;
  }



  function createCheckboxWithSubfields(field) {
    let fieldDiv = document.createElement("div");
    // fieldDiv.classList.add("form-check", "mb-3", "p-0");
    if (field.class) {
      fieldDiv.classList.add(field.class);
    } else {
      fieldDiv.classList.add("form-check", "mb-3", "p-0", "col-12");
    }

    let checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input");
    checkbox.setAttribute("id", field.id);
    checkbox.setAttribute("name", field.name);
    checkbox.setAttribute("type", "checkbox");

    let label = document.createElement("label");
    label.classList.add("form-check-label", "mt-0", "mb-0");
    label.setAttribute("for", field.id);
    label.textContent = field.label;

    let switchDiv = document.createElement("div");
    switchDiv.classList.add("form-check", "form-switch", "mb-2");
    switchDiv.appendChild(checkbox);

    fieldDiv.appendChild(label);
    fieldDiv.appendChild(switchDiv);

    let subFieldsContainer = document.createElement("div");
    subFieldsContainer.setAttribute("id", `${field.id}-subfields`);
    subFieldsContainer.classList.add("d-none");
    subFieldsContainer.classList.add("row");

    if (field.toggleFields) {
      field.toggleFields.forEach(subField => {
        let subFieldDiv = document.createElement("div");
        if (subField.class) {
          subFieldDiv.classList.add(subField.class);
        } else {
          subFieldDiv.classList.add("mb-2", "col-12");
        }

        if (subField.type === "select") {
          let select = document.createElement("select");
          select.classList.add("form-select", "mb-3");
          select.setAttribute("id", subField.id);
          select.setAttribute("name", subField.name);

          let defaultOptionSub = document.createElement("option");
          defaultOptionSub.selected = true;
          defaultOptionSub.disabled = true;
          defaultOptionSub.value = "";
          defaultOptionSub.textContent = "Seleccione";
          select.appendChild(defaultOptionSub);

          // Agregar opciones al select
          subField.options.forEach(optionText => {
            let option = document.createElement("option");
            option.value = optionText.value;
            option.textContent = optionText.text;
            select.appendChild(option);
          });

          let selectLabel = document.createElement("label");
          selectLabel.setAttribute("for", subField.id);
          selectLabel.textContent = subField.label;
          selectLabel.classList.add("form-label", "mt-4");

          subFieldDiv.appendChild(selectLabel);
          subFieldDiv.appendChild(select);
        } else if (subField.type === "textarea") {
          let textarea = document.createElement("textarea");
          textarea.classList.add("rich-text");
          textarea.setAttribute("id", subField.id);
          textarea.setAttribute("name", subField.name);
          textarea.setAttribute("style", "height: 50px");

          if (subField.placeholder) {
            textarea.setAttribute("placeholder", subField.placeholder);
          }

          let textareaLabel = document.createElement("label");
          textareaLabel.setAttribute("for", subField.id);
          textareaLabel.textContent = subField.label;
          textareaLabel.classList.add("form-label");

          subFieldDiv.appendChild(textareaLabel);
          subFieldDiv.appendChild(textarea);
        } else {
          // Aquí es donde agregamos el input, tal como lo solicitaste
          let inputFieldDiv = document.createElement("div");
          if (subField.class) {
            inputFieldDiv.classList.add("mb-2", subField.class);
          } else {
            inputFieldDiv.classList.add("mb-2");
          }

          const input = document.createElement("input");
          input.type = subField.type;
          input.id = subField.id;
          input.name = subField.id;
          input.className = "form-control";
          if (subField.readonly) input.readOnly = true;

          const inputLabel = document.createElement("label");
          inputLabel.htmlFor = subField.id;
          inputLabel.innerText = subField.label;
          inputLabel.className = "form-label";
          if (subField.class) {
            inputLabel.style.marginLeft = "20px";
          } else {
            inputLabel.style.marginLeft = "0px";
          }

          inputFieldDiv.appendChild(inputLabel);
          inputFieldDiv.appendChild(input);
          subFieldsContainer.appendChild(inputFieldDiv);
        }

        subFieldsContainer.appendChild(subFieldDiv);
      });
    }

    fieldDiv.appendChild(subFieldsContainer);

    checkbox.addEventListener("change", function() {
      if (checkbox.checked) {
        subFieldsContainer.classList.remove("d-none");
      } else {
        subFieldsContainer.classList.add("d-none");
      }
    });

    return fieldDiv;
  }





  function createTextareaField(field) {
    // Crear el contenedor principal para el textarea
    let fieldDiv = document.createElement("div");
    // fieldDiv.classList.add("form-floating", "mb-3");
    if (field.class) {
      fieldDiv.classList.add(field.class);
    } else {
      fieldDiv.classList.add("col-12", "mb-3");
    }
    // Crear el textarea
    let textarea = document.createElement("textarea");
    textarea.classList.add("form-control");
    textarea.setAttribute("id", field.id);
    textarea.setAttribute("name", field.name);
    textarea.setAttribute("style", "height: 100px");


    if (field.placeholder) {
      textarea.setAttribute("placeholder", field.placeholder);
    }

    // Crear la etiqueta para el textarea
    let label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;
    label.style.marginTop = "25px";
    label.style.fontWeight = "20px";
    label.classList.add("form-label");
    // if(field.class){
    // }
    // label.style.paddingBottom = "20px";


    // Agregar el textarea y la etiqueta al contenedor
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(textarea);

    return fieldDiv;
  }

  function generateForm(formData) {
    const tabsContainer = document.getElementById("tabsContainer");
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = "";
    tabsContainer.innerHTML = "";
    formContainer.className = "";

    const navTabs = document.createElement("ul");
    navTabs.className = "nav nav-underline fs-9";
    navTabs.id = "customTabs";

    const tabContent = document.createElement("div");
    tabContent.className = "tab-content mt-4 w-100";
    tabContent.style.fontSize = "500px";

    formData.tabs.forEach((tab, index) => {
      const tabId = `tab-${tab.tab.replace(/\s+/g, "-")}`;
      const tabLink = document.createElement("li");
      tabLink.className = "nav-item";

      const link = document.createElement("a");
      link.className = `nav-link ${index === 0 ? "active" : ""}`;
      link.id = `${tabId}-tab`;
      link.dataset.bsToggle = "tab";
      link.href = `#${tabId}`;
      link.setAttribute("role", "tab");
      link.setAttribute("aria-controls", tabId);
      link.setAttribute("aria-selected", index === 0 ? "true" : "false");
      link.textContent = tab.tab;

      tabLink.appendChild(link);
      navTabs.appendChild(tabLink);

      const tabPane = document.createElement("div");
      tabPane.className = `tab-pane fade ${index === 0 ? "show active" : ""}`;
      tabPane.id = tabId;
      tabPane.setAttribute("role", "tabpanel");
      tabPane.setAttribute("aria-labelledby", `${tabId}-tab`);

      const cardRow = document.createElement("div");
      cardRow.className = "row";
      Object.keys(tab).forEach((key) => {
        if (key.startsWith("card")) {
          tab[key].forEach((card) => {
            const cardDiv = document.createElement("div");
            if (!card.class) {
              cardDiv.className = "col-12 col-md-6 col-lg-6 mb-3";
            } else {
              cardDiv.className = card.class + " mb-3";
            }

            const cardElement = document.createElement("div");
            cardElement.className = "card";

            const cardBody = document.createElement("div");
            cardBody.className = "card-body row";

            const cardTitle = document.createElement("h5");
            cardTitle.className = "card-title";
            cardTitle.innerText = card.title;
            cardBody.appendChild(cardTitle);

            card.fields.forEach((field) => {
              let fieldDiv;

              if (field.type === "select") {
                fieldDiv = createSelect(field);
              } else if (field.type === "checkbox") {
                fieldDiv = createCheckboxWithSubfields(field);
              } else if (field.type === "textarea") {
                fieldDiv = createTextareaField(field);
                fieldDiv.querySelector('textarea').classList.add('rich-text');
              } else if (field.type === "image") {
                fieldDiv = createImageField(field);
              } else if (field.type === "file") {
                fieldDiv = createDropzone(field);
              } else if (field.type === "fileS") {
                fieldDiv = createSingleFileDropzone(field);
              } else if (field.type === "label") {
                fieldDiv = document.createElement("div");
                if (field.class) {
                  fieldDiv.classList.add("mb-2", field.class, "mt-4");
                } else {
                  fieldDiv.classList.add("mb-2");
                }
                const label = document.createElement("label");
                label.htmlFor = field.id;
                label.innerText = field.label;
                label.className = "form-label";
                if (field.class) {
                  label.style.marginLeft = "20px";
                } else {
                  label.style.marginLeft = "0px";
                }

                fieldDiv.appendChild(label);
              } else {
                fieldDiv = document.createElement("div");
                if (field.class) {
                  fieldDiv.classList.add("mb-2", field.class);
                } else {
                  fieldDiv.classList.add("mb-2");
                }
                const input = document.createElement("input");
                input.type = field.type;
                input.id = field.id;
                input.name = field.id;
                input.className = "form-control";
                if (field.readonly) input.readOnly = true;

                const label = document.createElement("label");
                label.htmlFor = field.id;
                label.innerText = field.label;
                label.className = "form-label";
                if (field.class) {
                  label.style.marginLeft = "20px";
                } else {
                  label.style.marginLeft = "0px";
                }

                fieldDiv.appendChild(label);
                fieldDiv.appendChild(input);
              }

              cardBody.appendChild(fieldDiv);
            });

            cardElement.appendChild(cardBody);
            cardDiv.appendChild(cardElement);
            cardRow.appendChild(cardDiv);
          });
        }
      });

      tabPane.appendChild(cardRow);
      tabContent.appendChild(tabPane);
    });

    formContainer.appendChild(navTabs);
    formContainer.appendChild(tabContent);

    // Agregar botones de navegación
    const navigationButtons = document.createElement("div");
    navigationButtons.className = "d-flex justify-content-end mt-4 mb-3";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "btn btn-secondary me-2";
    prevButton.id = "prevTabButton";

    // Agregar icono al botón Anterior
    const prevIcon = document.createElement("i");
    prevIcon.className = "fas fa-arrow-left";
    prevButton.appendChild(prevIcon);
    prevButton.innerHTML += "";

    // Deshabilitar el botón anterior en el primer tab
    prevButton.disabled = true;

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "btn btn-primary";
    nextButton.id = "nextTabButton";

    // Agregar icono al botón Siguiente
    nextButton.innerHTML = "";
    const nextIcon = document.createElement("i");
    nextIcon.className = "fas fa-arrow-right";
    nextButton.appendChild(nextIcon);

    // Deshabilitar el botón siguiente en el último tab si sólo hay un tab
    nextButton.disabled = formData.tabs.length <= 1;

    navigationButtons.appendChild(prevButton);
    navigationButtons.appendChild(nextButton);

    formContainer.appendChild(navigationButtons);

    // Inicializar eventos para los botones
    initTabNavigation(formData.tabs.length);

    initTinyMCE();
  }

  // Función para inicializar la navegación entre tabs
  function initTabNavigation(totalTabs) {
    const prevButton = document.getElementById("prevTabButton");
    const nextButton = document.getElementById("nextTabButton");

    prevButton.addEventListener("click", () => {
      navigateTab(-1, totalTabs);
    });

    nextButton.addEventListener("click", () => {
      navigateTab(1, totalTabs);
    });

    // Actualizar estado de los botones cuando cambie el tab manualmente
    const tabLinks = document.querySelectorAll('#customTabs .nav-link');
    tabLinks.forEach(link => {
      link.addEventListener('shown.bs.tab', () => {
        updateButtonsState(totalTabs);
      });
    });
  }

  // Función para navegar entre tabs
  function navigateTab(direction, totalTabs) {
    const activeTab = document.querySelector('#customTabs .nav-link.active');
    const tabs = Array.from(document.querySelectorAll('#customTabs .nav-link'));
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < totalTabs) {
      // Usar Bootstrap para activar el tab
      const nextTabElement = tabs[newIndex];
      const nextTab = new bootstrap.Tab(nextTabElement);
      nextTab.show();

      // Actualizar estado de los botones
      updateButtonsState(totalTabs);
    }
  }

  // Función para actualizar el estado de los botones
  function updateButtonsState(totalTabs) {
    const activeTab = document.querySelector('#customTabs .nav-link.active');
    const tabs = Array.from(document.querySelectorAll('#customTabs .nav-link'));
    const currentIndex = tabs.indexOf(activeTab);

    const prevButton = document.getElementById("prevTabButton");
    const nextButton = document.getElementById("nextTabButton");

    // Deshabilitar botón anterior en el primer tab
    prevButton.disabled = currentIndex === 0;

    // Deshabilitar botón siguiente en el último tab
    nextButton.disabled = currentIndex === totalTabs - 1;
  }

  function initTinyMCE() {
    tinymce.init({
      selector: '.rich-text',
      height: 200,
      menubar: false,
      toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist',
      plugins: 'lists link image',
      branding: false,
    });
  }

  function captureFormValues(formData) {
    formData.tabs.forEach(tab => {
      Object.keys(tab).forEach(card => {
        if (typeof tab[card] === "object") {
          tab[card].forEach(card => {
            card.fields.forEach(field => {
              if (field.type === "checkbox" && document.getElementById(field.id).checked) {
                field.toggleFields.forEach(toggleField => {
                  if (toggleField.type === "select") {
                    formValues[toggleField.name] = document.getElementById(toggleField.id).value;
                  } else if (toggleField.type === "textarea") {
                    formValues[toggleField.name] = document.getElementById(toggleField.id).value;
                  }
                });
              } else if (field.type !== "checkbox") {
                formValues[field.name] = document.getElementById(field.id).value;

                const editor = tinymce.get(field.id);
                if (editor) {
                  formValues[field.name] = editor.getContent();
                }
              }
            });
          });
        }
      });
    });
    console.log("funcion" + formValues);
    return formValues;
  }
</script>
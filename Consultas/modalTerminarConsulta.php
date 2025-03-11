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
    packagesService,
    clinicalRecordService
  } from "./services/api/index.js";
  import {
    AlertManager
  } from "./services/alertManager.js";

  const prescriptionFormRef = React.createRef();
  const remissionFormRef = React.createRef();
  const examFormRef = React.createRef();

  ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React.createElement(PrescriptionForm, {
    ref: prescriptionFormRef,
    formId: 'createPrescription',
    handleSubmit: (medicines) => {
      console.log(medicines);
    }
  }));
  ReactDOMClient.createRoot(document.getElementById('remisionFormReact')).render(React.createElement(remissionsForm, {
    ref: remissionFormRef,
  }));
  ReactDOMClient.createRoot(document.getElementById('examsFormReact')).render(React.createElement(ExamForm, {
    ref: examFormRef
  }));

  function obtenerEstadoRecetas() {
    if (prescriptionFormRef.current) {
      const estado = prescriptionFormRef.current.getFormData();
      console.log("Estado de recetas:", estado);
      return estado;
    }
  }

  function obtenerEstadoRemisiones() {
    if (remissionFormRef.current) {
      const estado = remissionFormRef.current.getFormData();
      console.log("Estado de remisiones:", estado);
      return estado;
    }
  }

  function obtenerEstadoExamenes() {
    if (examFormRef.current) {
      const estado = examFormRef.current.getFormData();
      console.log("Estado de examenes:", estado);
      return estado;
    }
  }

  let dataIncapacidad = {}

  const packages = await packagesService.getAllPackages();

  const formIncapacidad = document.getElementById('formCrearIncapacidad');
  const getDataFromFormIncapacidad = () => {
    const formData = new FormData(formIncapacidad);
    dataIncapacidad = {};
    for (const pair of formData.entries()) {
      dataIncapacidad[pair[0]] = pair[1];
    }
    return dataIncapacidad;
  }

  const params = new URLSearchParams(window.location.search);
  const jsonPath = `../../ConsultasJson/${params.get("tipo_historia")}.json`;

  const response = await fetch(jsonPath);
  const formData = await response.json();

  let formValues = {}

  document.getElementById("finalizarConsulta").addEventListener("click", function() {
    captureFormValues(formData.form1);
    //console.log("Valores capturados:", formValues);
    console.log(getDataFromFormIncapacidad());
    const dataIncapacidad = getDataFromFormIncapacidad();
    const dataRecetas = obtenerEstadoRecetas();
    const dataRemisiones = obtenerEstadoRemisiones();
    const dataExamenes = obtenerEstadoExamenes();
    let data = {
      "clinical_record_type_id": 1,
      "created_by_user_id": 1,
      "branch_id": 1,
      "data": captureFormValues(formData.form1)
    }

    const hasDisplayNone = (id) => {
      const element = document.getElementById(id);
      return window.getComputedStyle(element).display === 'none';
    }

    if (!hasDisplayNone('contenidoIncapacidad')) {
      data['patient_disability'] = dataIncapacidad;
    }

    if (!hasDisplayNone('examsFormReact')) {
      data['exam_order'] = {
        "patient_id": new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || 0,
        "exam_order_state_id": 1,
        "exam_order_item_id": dataExamenes[0]?.id,
        "exam_order_item_type": "exam_type"
      };
    }

    if (!hasDisplayNone('prescriptionFormReact')) {
      data['recipe'] = {
        user_id: 1,
        patient_id: new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || 0,
        medicines: dataRecetas,
        is_active: true
      };
    }

    if (!hasDisplayNone('remisionFormReact')) {
      data['remission'] = dataRemisiones;
    }

    console.log(data);
    clinicalRecordService.clinicalRecordsParamsStore(1, data)
      .then(() => {
        AlertManager.success({
          text: 'Se ha creado el registro exitosamente'
        })
        $("#finishModal").modal('hide');
        setTimeout(() => {
          const patientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || 0;
          const especialidad = new URLSearchParams(window.location.search).get('especialidad') || 'medicina_general';
          window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${especialidad}`;
        }, 1000);
      }).catch(err => {
        if (err.data?.errors) {
          AlertManager.formErrors(err.data.errors);
        } else {
          AlertManager.error({
            text: err.message || 'Ocurrió un error inesperado'
          });
        }
      });
  });

  console.log('Paquetes', packages);

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
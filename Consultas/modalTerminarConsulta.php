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
                    <select class="form-select" id="diagnosticoPrincipal">
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <select class="form-select" id="tipoDiagnostico">
                    </select>
                  </div>
                </div>
              </div>

              <!-- Diagnósticos relacionados -->
              <div class="row g-3 mb-3">
                <div class="col-md-4">
                  <div class="form-floating">
                    <select class="form-select" id="diagnosticoRel1">
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <select class="form-select" id="diagnosticoRel2">
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <select class="form-select" id="diagnosticoRel3">
                    </select>
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

<script type="module">
  import {
    getUserLogged
  } from './services/utilidades.js';

  document.addEventListener('DOMContentLoaded', function() {

    let userLogged = getUserLogged();
    const cie11 = userLogged.specialty.specializables.filter(item => item.specializable_type == "CIE-11")
    cargarCie11(cie11)
    cargarTipoDiagnostico();
  })

  function cargarTipoDiagnostico() {
    const tipoDiagnostico = document.getElementById('tipoDiagnostico');

    const options = [{
        value: '',
        text: 'Seleccione',
        disabled: true,
        selected: true
      },
      {
        value: 'definitivo',
        text: 'Definitivo'
      },
      {
        value: 'presuntivo',
        text: 'Presuntivo'
      },
      {
        value: 'diferencial',
        text: 'Diferencial'
      }
    ];

    options.forEach(optionData => {
      const option = document.createElement('option');
      option.value = optionData.value;
      option.text = optionData.text;
      if (optionData.disabled) option.disabled = true;
      if (optionData.selected) option.selected = true;
      tipoDiagnostico.appendChild(option);
    });
    configurarSelectCie11();
  }

  function cargarCie11(cie11) {

    // Obtenemos referencias a todos los selects
    const selects = [
      document.getElementById('diagnosticoPrincipal'),
      document.getElementById('diagnosticoRel1'),
      document.getElementById('diagnosticoRel2'),
      document.getElementById('diagnosticoRel3'),
    ];

    // Limpiamos y configuramos cada select
    selects.forEach(select => {
      // Limpiar el select
      select.innerHTML = '';

      if (cie11.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.text = 'Esta especialidad no tiene CIE-11';
        select.appendChild(option);
      } else {
        // Opción por defecto (placeholder)
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Seleccione CIE-11';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        // Agregar opciones de CIE-11
        cie11.forEach(item => {
          const option = document.createElement('option');
          option.value = item.specializable_id;
          option.text = item.description || item.specializable_id;
          select.appendChild(option);
        });
      }
    });
    configurarSelectCie11();
  }

  function configurarSelectCie11() {
    // Obtenemos todas las referencias a selects
    const selects = [
      document.getElementById('diagnosticoPrincipal'),
      document.getElementById('diagnosticoRel1'),
      document.getElementById('diagnosticoRel2'),
      document.getElementById('diagnosticoRel3'),
      document.getElementById('tipoDiagnostico')
    ];

    // Verificamos una sola vez si Choices está definido
    if (typeof Choices === 'undefined') return;

    // Configuramos cada select con Choices
    selects.forEach(select => {
      new Choices(select, {
        removeItemButton: true,
        placeholder: true
      });
    });
  }
</script>

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
    clinicalRecordService,
    clinicalRecordTypeService,
    appointmentService
  } from "./services/api/index.js";
  import {
    AlertManager
  } from "./services/alertManager.js";
  import UserManager from "./services/userManager.js";

  const prescriptionFormRef = React.createRef();
  const remissionFormRef = React.createRef();
  const examFormRef = React.createRef();

  ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React.createElement(PrescriptionForm, {
    ref: prescriptionFormRef,
    formId: 'createPrescription',
    handleSubmit: (medicines) => {}
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
      return estado;
    }
  }

  function obtenerEstadoRemisiones() {
    if (remissionFormRef.current) {
      const estado = remissionFormRef.current.getFormData();
      return estado;
    }
  }

  function obtenerEstadoExamenes() {
    if (examFormRef.current) {
      const estado = examFormRef.current.getFormData();
      return estado;
    }
  }

  let dataIncapacidad = {}

  const [packages, clinicalRecordTypes] = await Promise.all([
    packagesService.getPackagesByExams(),
    clinicalRecordTypeService.getAll()
  ]);
  const urlClinicalRecordType = new URLSearchParams(window.location.search).get("tipo_historia");
  const currentClinicalRecordType = clinicalRecordTypes.find((type) => type.key_ === urlClinicalRecordType);

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
    const dataIncapacidad = getDataFromFormIncapacidad();
    const dataRecetas = obtenerEstadoRecetas();
    const dataRemisiones = obtenerEstadoRemisiones();
    const dataExamenes = obtenerEstadoExamenes();
    let data = {
      "clinical_record_type_id": currentClinicalRecordType.id,
      "created_by_user_id": UserManager.getUser().id,
      "description": document.getElementById("motivo").value,
      "branch_id": 1,
      "data": captureFormValues(formData.form1)
    }
    const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');
    const patientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || 0

    const hasDisplayNone = (id) => {
      const element = document.getElementById(id);
      return window.getComputedStyle(element).display === 'none';
    }

    if (!hasDisplayNone('contenidoIncapacidad')) {
      data['patient_disability'] = dataIncapacidad;
    }

    if (!hasDisplayNone('examsFormReact')) {
      data['exam_order'] = dataExamenes.map(examen => ({
        "patient_id": patientId,
        "exam_order_state_id": 1,
        "exam_order_item_id": examen.id,
        "exam_order_item_type": "exam_type"
      }));
    }

    if (!hasDisplayNone('prescriptionFormReact')) {
      data['recipe'] = {
        user_id: 1,
        patient_id: patientId,
        medicines: dataRecetas,
        is_active: true
      };
    }

    if (!hasDisplayNone('remisionFormReact')) {
      data['remission'] = dataRemisiones;
    }

    clinicalRecordService.clinicalRecordsParamsStore(patientId, data)
      .then(async () => {
        await appointmentService.changeStatus(appointmentId, 'consultation_completed')
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
                if (field.id === "peso") {
                  formValues[field.name] = document.getElementById('peso').value + " Lbs";
                }
                if (field.id === "altura") {
                  formValues[field.name] = document.getElementById('altura').value + " cm";
                }
                if (field.id === "imc") {
                  formValues[field.name] = document.getElementById('imc').value + " kg/m²";
                }
                if (field.id === "porcentajeGrasaCorporal") {
                  formValues[field.name] = document.getElementById('porcentajeGrasaCorporal').value + " %";
                }
                if (field.id === "presionArterialDiastolica") {
                  formValues[field.name] = document.getElementById('presionArterialDiastolica').value + " mmHg";
                }
                if (field.id === "presionArterialSistolica") {
                  formValues[field.name] = document.getElementById('presionArterialSistolica').value + " mmHg";
                }
                if (field.id === "tensionArterialMedia") {
                  formValues[field.name] = document.getElementById('tensionArterialMedia').value + " mmHg";
                }
                if (field.id === "saturacion") {
                  formValues[field.name] = document.getElementById('saturacion').value + " %";
                }
                if (field.id === "circunferenciaAbdominal") {
                  formValues[field.name] = document.getElementById('circunferenciaAbdominal').value + " cm";
                }
                if (field.id === "circunferenciaCintura") {
                  formValues[field.name] = document.getElementById('circunferenciaCintura').value + " cm";
                }
                if (field.id === "perimetroCefalico") {
                  formValues[field.name] = document.getElementById('perimetroCefalico').value + " cm";
                }
                if (field.id === "frecuenciaRespiratoria") {
                  formValues[field.name] = document.getElementById('frecuenciaRespiratoria').value + " rpm";
                }
                if (field.id === "frecuenciaCardiaca") {
                  formValues[field.name] = document.getElementById('frecuenciaCardiaca').value + " lpm";
                }
                if (field.id === "temperatura") {
                  formValues[field.name] = document.getElementById('temperatura').value + " °Celsius";
                }
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
    return formValues;
  }

  document.getElementById('diagnosticoPrincipal').addEventListener('change', async function() {
    let packageByCie11 = await packagesService.getPackageByCie11(this.value);
    console.log("cie11: ", packageByCie11);

    if (packageByCie11.data.length) {

      document.getElementById("btnAgregarReceta").click();
      document.getElementById("btnAgregarIncapacidad").click();
      document.getElementById("btnAgregarRemision").click();

      const incapacidad = packageByCie11.data[0].package_items.filter(item => item.item_type == 'Incapacidad')[0];
      const remision = packageByCie11.data[0].package_items.filter(item => item.item_type == "Remision")[0];

      console.log(remision);

      document.getElementById('dias').value = incapacidad.prescription.days_incapacity;
      document.getElementById('reason').value = incapacidad.prescription.reason;
      const today = new Date();
      const daysIncapacity = incapacidad.prescription.days_incapacity;
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + daysIncapacity);
      const formattedEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      document.getElementById('hasta').value = formattedEndDate;

      const mappedData = packageByCie11.data[0].package_items.filter(item => item.item_type == 'medicamento' || item.item_type == 'Vacunas').map(item => item.prescription);

      ReactDOMClient.createRoot(document.getElementById('prescriptionFormReact')).render(React.createElement(PrescriptionForm, {
        ref: prescriptionFormRef,
        initialData: {
          medicines: mappedData
        },
        formId: 'createPrescription',
        handleSubmit: () => {}
      }));
    }

  });
</script>
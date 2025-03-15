<?php
include "../menu.php";
include "../header.php";
include "./includes/modals/FacturaElectronica.php";
include "./includes/modals/modalNotaCredito.php";
include "./includes/modals/NoteCreditModal.php";
include "./includes/modals/NoteDebitModal.php";
include "./includes/modals/EntidadModal.php";
include "./includes/modals/DocumentoSoporteModal.php";
include "./includes/modals/CustomerModal.php";
?>

<link rel="stylesheet" href="./assets/css/styles.css">
<style>
  .board {
    display: flex;
    gap: 20px;
    overflow-x: auto;
  }

  .column-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .column-title {
    font-size: 18px;
    margin-bottom: 10px;
    text-align: center;
  }

  .column {
    width: 250px;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 20em;
  }

  .task {
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    cursor: grab;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  .task strong {
    display: block;
  }

  .task p {
    margin: 5px 0;
  }

  .view-patient-btn {
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    text-align: center;
    display: block;
  }

  .view-patient-btn:hover {
    background-color: #0056b3;
  }

  /* Estilos por estado */
  .column[data-status="Pendientes"] .task {
    background-color: #d3d3d3;
  }

  .column[data-status="En espera de consulta"] .task {
    background-color: #add8e6;
  }

  .column[data-status="En consulta"] .task {
    background-color: #90ee90;
  }

  .column[data-status="Consulta finalizada"] .task {
    background-color: #32cd32;
  }

  .column[data-status="Pre admisión"] .task {
    background-color: rgb(220, 94, 153);
  }

  /* Tema oscuro */
  html[data-bs-theme="dark"] .task {
    color: #000;
  }
</style>

<div class="componente">
  <div class="content">
    <div class="container-small">
      <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
          <li class="breadcrumb-item active" onclick="location.reload()">Facturación</li>
        </ol>
      </nav>
      <div class="row mt-4">
        <div class="row">
          <div class="col-12">
            <div class="col-10">
              <div class="col-12 row col-md-auto">
                <div class="col-6">
                  <h2 class="mb-0">Facturación</h2>
                </div>
                <div class="col-6 text-end" style="z-index: 999999999999999999999999999999999999999999999999999999999">

                </div>
              </div>
              <div class="col-12 col-md-auto">
                <div class="d-flex">
                  <div class="flex-1 d-md-none">
                    <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2" data-phoenix-toggle="offcanvas"
                      data-phoenix-target="#productFilterColumn"><span class="fa-solid fa-bars"></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Pestañas -->
        <ul class="nav nav-underline fs-9 p-3" id="antecedentesTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="personales-tab" data-bs-toggle="tab" href="#personales" role="tab">
              <i class="fas fa-file-invoice-dollar"></i> Facturación Ventas
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="citas-tab" data-bs-toggle="tab" href="#citas" role="tab">
              <i class="fas fa-file-alt"></i> Nota débito
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="salaDeEspera-tab" data-bs-toggle="tab" href="#salaDeEspera" role="tab">
              <i class="fas fa-file-invoice"></i> Nota crédito
            </a>
          </li>
        </ul>

        <div class="tab-content mt-3" id="antecedentesTabsContent">
          <!-- Tab de Facturacion Ventas -->
          <div class="tab-pane fade show active" id="personales" role="tabpanel">

            <div class="tab-pane fade show active" id="personales" role="tabpanel">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Facturacion Ventas</h4>
                  </div>
                  <div class="col-6 text-end">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-plus"></i> &nbsp; Nuevo
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalCustomerModal">Facturacion Cliente</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEntity">Facturacion Entidad</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNewNoteCredit">Nota Crédito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNewNoteDebit">Nota Débito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoDocumentoSoporte">Documento soporte</a></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="w-50 me-3">
                  <label class="form-label" for="datepicker1">Fecha de inicio</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker1" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
                <div class="w-50">
                  <label class="form-label" for="datepicker2">Fecha de fin</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker2" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
              </div>
            </div>

            <table id="admissionsTable" class="table table-sm fs-9 mb-0 tableDataTableSearch">
              <thead>
                <tr>
                  <th class="align-middle custom-td">N° de Factura</th>
                  <th class="align-middle custom-td">Fecha</th>
                  <th class="align-middle custom-td">Encargado</th>
                  <th class="align-middle custom-td">Cliente</th>
                  <th class="align-middle custom-td">Identificacion</th>
                  <th class="align-middle custom-td">Tipo</th>
                  <th class="align-middle white-space-nowrap pe-0 p-3"></th>
                </tr>
              </thead>
              <tbody class="list">
                <tr>
                  <td>564</td>
                  <td>2022-01-01</td>
                  <td>Maria Cruz</td>
                  <td>Luis Perez</td>
                  <td>12345678</td>
                  <td>Factura</td>
                  <td class="align-middle white-space-nowrap pe-0 p-3">
                    <div class="btn-group me-1">
                      <button class="btn dropdown-toggle mb-1 btn-info" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Acciones</button>
                      <div class="dropdown-menu">

                        <a class="dropdown-item" href="#"><i class="fas fa-eye"></i> Ver</a>
                        <a class="dropdown-item" href="#"><i class="fas fa-download"></i> Descargar</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNotaCredito">Nota crédito</a>
                        <a class="dropdown-item" href="#">Nota débito</a>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tab de Nota de debito -->

          <div class="tab-pane fade" id="citas" role="tabpanel">
            <div class="tab-pane fade show active" id="personales" role="tabpanel">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Nota de debito</h4>
                  </div>
                  <div class="col-6 text-end">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-plus"></i> &nbsp; Nuevo
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalTipoFactura">Facturacion Cliente</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaFacturaEmpresa">Facturacion Entidad</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(1, true)">Nota Crédito</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(2, true)">Nota Débito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoDocumentoSoporte">Documento soporte</a></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="w-50 me-3">
                  <label class="form-label" for="datepicker1">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker1" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
                <div class="w-50">
                  <label class="form-label" for="datepicker2">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker2" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
              </div>
            </div>

            <table id="admissionsTable" class="table table-sm fs-9 mb-0 tableDataTableSearch">
              <thead>
                <tr>
                  <th class="align-middle custom-td">N° de Nota</th>
                  <th class="align-middle custom-td">N° de Factura</th>
                  <th class="align-middle custom-td">Fecha</th>
                  <th class="align-middle custom-td">Encargado</th>
                  <th class="align-middle custom-td">Cliente/Proveedor</th>
                  <th class="align-middle custom-td">NIT/CC</th>
                  <th class="align-middle custom-td">Tipo</th>
                  <th class="align-middle white-space-nowrap pe-0 p-3">Acciones</th>
                </tr>
              </thead>
              <tbody class="list">
                <tr>
                  <td>22276742</td>
                  <td>49895</td>
                  <td>2025-02-18</td>
                  <td>Vendedor #10</td>
                  <td>Importaciones Internacionales SA </td>
                  <td>22921810</td>
                  <td>Nota de crédito</td>
                  <td class="align-middle white-space-nowrap pe-0 p-3">
                    <button class="btn btn-success me-1 mb-1" type="button">
                      <i class="fas fa-eye"></i> &nbsp; Previsualizar
                    </button>
                    <i class="fas fa-down-long"></i>
                    <i class="fas fa-bars"></i>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          <!-- Tab de Nota de crédito -->
          <div class="tab-pane fade" id="salaDeEspera" role="tabpanel">

            <div class="tab-pane fade show active" id="salaDeEspera" role="tabpanel">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Nota de crédito</h4>
                  </div>
                  <div class="col-6 text-end">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-plus"></i> &nbsp; Nuevo
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalTipoFactura">Facturacion Cliente</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaFacturaEmpresa">Facturacion Entidad</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(1, true)">Nota Crédito</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(2, true)">Nota Débito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoDocumentoSoporte">Documento soporte</a></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="w-50 me-3">
                  <label class="form-label" for="datepicker1">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker1" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
                <div class="w-50">
                  <label class="form-label" for="datepicker2">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker2" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
              </div>
            </div>

            <table id="admissionsTable" class="table table-sm fs-9 mb-0 tableDataTableSearch">
              <thead>
                <tr>
                  <th class="align-middle custom-td">N° de Nota</th>
                  <th class="align-middle custom-td">N° de Factura</th>
                  <th class="align-middle custom-td">Fecha</th>
                  <th class="align-middle custom-td">Encargado</th>
                  <th class="align-middle custom-td">Cliente/Proveedor</th>
                  <th class="align-middle custom-td">NIT/CC</th>
                  <th class="align-middle custom-td">Tipo</th>
                  <th class="align-middle white-space-nowrap pe-0 p-3">Acciones</th>
                </tr>
              </thead>
              <tbody class="list">
                <tr>
                  <td>22276742</td>
                  <td>49895</td>
                  <td>2025-02-18</td>
                  <td>Vendedor #10</td>
                  <td>Importaciones Internacionales SA </td>
                  <td>22921810</td>
                  <td>Nota de crédito</td>
                  <td class="align-middle white-space-nowrap pe-0 p-3">
                    <button class="btn btn-success me-1 mb-1" type="button">
                      <i class="fas fa-eye"></i> &nbsp; Previsualizar
                    </button>
                    <i class="fas fa-down-long"></i>
                    <i class="fas fa-bars"></i>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          
        </div>
      </div>
    </div>
  </div>
</div>

<template id="template-consulta">
  <tr>
    <td id="nombre" class="align-middle custom-td"></td>
    <td id="documento" class="align-middle custom-td"></td>
    <td id="fecha-consulta" class="align-middle custom-td"></td>
    <td id="hora-consulta" class="align-middle custom-td"></td>
    <td id="profesional" class="align-middle custom-td"></td>
    <td id="entidad" class="align-middle custom-td"></td>
    <td id="estado" class="align-middle custom-td"></td>
    <td class="align-middle white-space-nowrap pe-0 p-3">

      <div class="btn-group me-1">
        <button class="btn dropdown-toggle mb-1 btn-primary" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Acciones</button>
        <div class="dropdown-menu">

          <a href="#" class="dropdown-item" id="generar-admision"> Generar admisión
          </a>
          <a class="dropdown-item" href="#"> Generar link de pago</a>

        </div>
      </div>
    </td>
  </tr>
</template>

<template id="template-all-citas">
  <tr>
    <td class="fs-9 align-middle">
      <div class="form-check mb-0 fs-8">
        <input class="form-check-input" type="checkbox">
      </div>
    </td>
    <td id="nombre" class="align-middle custom-td"></td>
    <td id="documento" class="align-middle custom-td"></td>
    <td id="fecha-consulta" class="align-middle custom-td"></td>
    <td id="hora-consulta" class="align-middle custom-td"></td>
    <td id="profesional" class="align-middle custom-td"></td>
    <td id="entidad" class="align-middle custom-td"></td>
    <td id="estado" class="align-middle custom-td"></td>
    <td class="align-middle white-space-nowrap pe-0 p-3">
    </td>
  </tr>
</template>

<script type="module">
  import {
    appointmentService,
    userService,
    patientService,
    admissionService,
  } from './services/api/index.js';

  document.addEventListener("DOMContentLoaded", async function() {

    const bulkSelectEl = document.getElementById('bulk-select-example');
    const bulkActionsEl = document.getElementById('bulk-select-actions');

    bulkSelectEl.addEventListener('change', function() {
      if (this.checked) {
        bulkActionsEl.classList.remove('d-node')
      } else {
        bulkActionsEl.classList.add('d-none')
      }
    })

    function generarDetalleCitas(appointments) {
      console.log(appointments);
    }

    // Inicializar columnas como áreas de arrastre
    const columns = document.querySelectorAll(".column");
    columns.forEach(column => {
      new Sortable(column, {
        group: "shared", // Permite mover tareas entre columnas
        animation: 150,
        onAdd: function(evt) {
          const task = evt.item;
          const newColumn = evt.to;
          const status = newColumn.getAttribute("data-status");
          const taskId = task.getAttribute("data-id");

          Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres mover la tarea a '${status}'?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, mover',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

              console.log(`Tarea con ID '${taskId}' movida a '${status}'`);
              // Llamada AJAX para guardar el cambio en el servidor (preparado para implementación futura)
            } else {

              evt.from.appendChild(task);
            }
          });
        }
      });
    });

    function updateTableAdmissions(list, template, admissiones) {
      list.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

      admissiones.forEach(consulta => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('#nombre').textContent = `${consulta.patient.first_name} ${consulta.patient.last_name}`;
        clone.querySelector('#documento').textContent = consulta.patient.document_number;
        clone.querySelector('#fecha-consulta').textContent = consulta.appointment_date;
        clone.querySelector('#hora-consulta').textContent = consulta.appointment_time;
        clone.querySelector('#profesional').textContent = `${consulta.user_availability.user} ${consulta.user_availability.user.last_name}`;
        clone.querySelector('#entidad').textContent = consulta.patient.social_security.eps;
        // Verifica el estado de `is_active` y asigna el contenido de `#estado`
        if (consulta.patient.is_active) {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-primary">Activo</span>';
        } else {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-secondary">Inactivo</span>';
        }

        clone.querySelector('#generar-admision').href = `generar_admision?id_cita=${consulta.id}`;
        list.appendChild(clone);
      });
    }

    function updateTableAppointments(list, template, appointments) {
      list.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

      appointments.forEach(consulta => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.form-check-input').setAttribute('data-bulk-select-row', JSON.stringify(consulta));
        clone.querySelector('#nombre').textContent = `${consulta.patient.first_name} ${consulta.patient.last_name}`;
        clone.querySelector('#documento').textContent = consulta.patient.document_number;
        clone.querySelector('#fecha-consulta').textContent = consulta.appointment_date;
        clone.querySelector('#hora-consulta').textContent = consulta.appointment_time;
        clone.querySelector('#profesional').textContent = `${consulta.user_availability.user.first_name} ${consulta.user_availability.user.last_name}`;
        clone.querySelector('#entidad').textContent = consulta.patient.social_security.eps;
        // Verifica el estado de `is_active` y asigna el contenido de `#estado`
        if (consulta.patient.is_active) {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-primary">Activo</span>';
        } else {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-secondary">Inactivo</span>';
        }
        list.appendChild(clone);
      });
    }



    const appointments = await appointmentService.getAll();
    const admissiones = await admissionService.getAdmisionsAll();

    console.log(admissiones.pati);


    const admissionsTable = document.getElementById('admissionsTableBody');
    const appointmentsTable = document.getElementById('allAppointments');
    const templateAdmissions = document.getElementById('template-consulta');
    const templateAppointments = document.getElementById('template-all-citas');

    console.log(appointmentsTable);


    updateTableAdmissions(admissionsTable, templateAdmissions, admissiones);
    //updateTableAppointments(appointmentsTable, templateAppointments, appointments);

    const selectMedico = document.getElementById("selectMedico");
    const selectPaciente = document.getElementById("selectPaciente");
    const selectMedicoCitas = document.getElementById("selectMedicoCitas");
    const selectPacienteCitas = document.getElementById("selectPacienteCitas");
    const rangoFechasCitas = document.getElementById("rangoFechasCitas");

    selectMedico.addEventListener("change", function() {
      filterAdmissions(admissionsTable, selectMedico, selectPaciente);
    });
    selectPaciente.addEventListener("change", function() {
      filterAdmissions(admissionsTable, selectMedico, selectPaciente);
    });
    selectMedicoCitas.addEventListener("change", function() {
      filterAppointments(appointmentsTable, selectMedicoCitas, selectPacienteCitas);
    });
    selectPacienteCitas.addEventListener("change", function() {
      filterAppointments(appointmentsTable, selectMedicoCitas, selectPacienteCitas);
    });
    rangoFechasCitas.addEventListener("change", function() {
      filterAppointments(appointmentsTable, selectMedicoCitas, selectPacienteCitas, rangoFechasCitas);
    });

    async function cargarMedicos(select) {
      const medicos = await userService.getAll();
      console.log(medicos);

      const options = medicos.map((medico) => {
        return `<option value="${medico.id}">${medico.first_name} ${medico.last_name}</option>`;
      });
      select.innerHTML += options.join("");
    }

    async function cargarPacientes(select) {
      const pacientes = await patientService.getAll();
      const options = pacientes.map((paciente) => {
        return `<option value="${paciente.id}">${paciente.first_name} ${paciente.last_name}</option>`;
      });
      select.innerHTML += options.join("");
    }

    cargarMedicos(selectMedico);
    cargarPacientes(selectPaciente);
    cargarMedicos(selectMedicoCitas);
    cargarPacientes(selectPacienteCitas);

    function parseDate(input) {
      const [day, month, year] = input.split('/');
      // Convertir año a 4 dígitos (asumiendo siglo XXI)
      const fullYear = parseInt(year) + 2000;
      // Mes en JavaScript es 0-based (0 = Enero)
      const date = new Date(fullYear, parseInt(month) - 1, parseInt(day));

      // Validar que la fecha sea correcta
      if (
        date.getFullYear() !== fullYear ||
        date.getMonth() + 1 !== parseInt(month) ||
        date.getDate() !== parseInt(day)
      ) {
        return null;
      }
      return date;
    }

    function filterAdmissions(list, selectMedico, selectPaciente) {
      const selectedDoctor = selectMedico.value;
      const selectedPatient = selectPaciente.value;

      const filteredAppointments = admissiones.filter((appointment) => {
        return appointment.is_active &&
          (
            (selectedDoctor ? appointment.user_availability.user.id == selectedDoctor : true) &&
            (selectedPatient ? appointment.patient_id == selectedPatient : true)
          )
      });

      console.log(selectedDoctor, selectedPatient, appointments, filteredAppointments);

      updateTableAdmissions(list, templateAdmissions, filteredAppointments);
    }

    function filterAppointments(list, selectMedico, selectPaciente, rangoFechas = null) {
      const selectedDoctor = selectMedico.value;
      const selectedPatient = selectPaciente.value;
      const selectedDate = rangoFechas?.value;
      let startDate = null
      let endDate = null

      if (rangoFechas) {
        const [startStr, endStr] = selectedDate?.split(' to ');

        startDate = parseDate(startStr);
        if (endStr) {
          endDate = parseDate(endStr);
        }
      }

      const filteredAppointments = appointments.filter((appointment) => {
        return appointment.is_active &&
          (
            (selectedDoctor ? appointment.user_availability.user.id == selectedDoctor : true) &&
            (selectedPatient ? appointment.patient_id == selectedPatient : true) &&
            (startDate && endDate ?
              Date.parse(appointment.appointment_date) >= startDate.getTime() &&
              Date.parse(appointment.appointment_date) <= endDate.getTime() :
              true)
          )
      });

      console.log(selectedDoctor, selectedPatient, appointments, filteredAppointments);


      updateTableAppointments(list, templateAppointments, filteredAppointments);
    }
  });

  function generarTurno() {
    const identificacion = document.getElementById('identificacion').value;
    const motivo = document.getElementById('motivo').value;
    const asistenciaPreferencial = document.getElementById('asistenciaPreferencial').value;
    const turno = 'G' + Math.floor(Math.random() * 100);
    const fecha = new Date().toLocaleDateString();

    // Verificar si se ingresó asistencia preferencial
    const asistenciaHtml = asistenciaPreferencial ? `<p><strong>Preferencial:</strong> ${asistenciaPreferencial}</p>` : '';

    const ticketHtml = `
        <div class="card ticket">
            <div class="card-body">
                <h4 class="text-center mb-2">Turno: ${turno}</h4>
                <p><strong>ID:</strong> ${identificacion}</p>
                <p><strong>Motivo:</strong> ${motivo}</p>
                ${asistenciaHtml} <!-- Se agrega solo si tiene valor -->
                <h6 class="w-100 text-end">${fecha}</h6>
            </div>
        </div>
    `;

    document.getElementById('ticket-container').innerHTML = ticketHtml;
  }
</script>

<?php
include "../footer.php";
?>

<script src="./assets/js/main.js"></script>
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
        <li class="breadcrumb-item active" onclick="location.reload()">Citas</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-0">Citas</h2>
            <small class="patientName">Cargando...</small>
          </div>
          <div id="appointmentCreateFormModalButtonReact"></div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="d-flex align-items-center justify-content-end my-3">
        <div class="d-none ms-3" id="bulk-select-actions">
          <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#reagendarModal"><i
              class="fas fa-calendar"></i> Reagendar</button>
        </div>
      </div>
      <div id="citas" class="table-responsive">
        <div id="appointmentsTableReact"></div>
        <!-- <table class="table table-sm">
          <thead>
            <tr>
              <th style="display: none;"></th>
              <th>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="selectAllCheckboxes"
                    onclick="toggleCheckboxes(this)">
                </div>
              </th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Doctor(a)</th>
              <th>Tipo de cita</th>
              <th>Tipo de atención</th>
              <th>Finalidad de la consulta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="list" id="appointmentTableBody"></tbody>
        </table> -->

      </div>
    </div>
  </div>

  <?php include "../footer.php"; ?>
  <?php include "./modalCitas.php"; ?>
</div>

<template id="appointment-template">
  <tr>
    <td style="display: none;">
      <input type="hidden" class="appointment-data">
    </td>
    <td class="checkbox align-middle">
      <div class="form-check">
        <input class="form-check-input appointment-checkbox" type="checkbox" id="checkbox-cita"
          data-bs-toggle="checkbox" onclick="checkCheckboxes()">
      </div>
    </td>
    <td class="fecha align-middle"></td>
    <td class="hora align-middle"></td>
    <td class="doctor align-middle"></td>
    <td class="tipo-cita align-middle"></td>
    <td class="tipo-atencion align-middle"></td>
    <td class="finalidad-consulta align-middle"></td>
    <td class="estado align-middle"></td>
    <td class="text-end align-middle">
      <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"
          data-bs-title="Opciones">
          <i data-feather="settings"></i> Acciones
        </button>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item editar-cita" href="#">
              <div class="d-flex gap-2 align-items-center">
                <i class="fa-solid fa-pen" style="width: 20px;"></i>
                <span>Reagendar cita</span>
              </div>
            </a>
          </li>
          <li>
            <a class="dropdown-item eliminar-cita" href="#">
              <div class="d-flex gap-2 align-items-center">
                <i class="fa-solid fa-trash" style="width: 20px;"></i>
                <span>Cancelar cita</span>
              </div>
            </a>
          </li>
          <li>
            <a class="dropdown-item imprimir-cita" href="#" id="btnImprimirCita" onclick="imprimirCita()">
              <div class="d-flex gap-2 align-items-center">
                <i class="fa-solid fa-print" style="width: 20px;"></i>
                <span>Imprimir</span>
              </div>
            </a>
          </li>
          <li>
            <a class="dropdown-item descargar-cita" href="#" id="btnDescargarCita" onclick="descargarCita()">
              <div class="d-flex gap-2 align-items-center">
                <i class="fa-solid fa-download" style="width: 20px;"></i>
                <span>Descargar</span>
              </div>
            </a>
          </li>
          <li>
            <hr class="dropdown-divider">
          </li>
          <li class="dropdown-header">Compartir</li>
          <li>
            <a class="dropdown-item compartir-whatsapp" href="#">
              <div class="d-flex gap-2 align-items-center">
                <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                <span>Compartir por Whatsapp</span>
              </div>
            </a>
          </li>
          <li>
            <a class="dropdown-item compartir-correo" href="#">
              <div class="d-flex gap-2 align-items-center">
                <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                <span>Compartir por Correo</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    AppointmentsTable
  } from './react-dist/appointments/AppointmentsTable.js';
  import {
    AppointmentCreateFormModalButton
  } from './react-dist/appointments/AppointmentCreateFormModalButton.js';

  ReactDOMClient.createRoot(document.getElementById('appointmentsTableReact')).render(React.createElement(AppointmentsTable));
  ReactDOMClient.createRoot(document.getElementById('appointmentCreateFormModalButtonReact')).render(React.createElement(AppointmentCreateFormModalButton));
</script>

<script>
  function checkCheckboxes() {
    const bulkActions = document.getElementById('bulk-select-actions');
    const checkedCheckboxes = document.querySelectorAll('.appointment-checkbox:checked')

    if (checkedCheckboxes.length > 0) {
      bulkActions.classList.remove('d-none');
    } else {
      bulkActions.classList.add('d-none');
    }
  }

  function toggleCheckboxes(selectAllCheckboxes) {
    document.querySelectorAll('.appointment-checkbox').forEach(checkbox => {
      checkbox.checked = selectAllCheckboxes.checked;
    });
    checkCheckboxes();
  }
</script>

<script type="module">
  import {
    appointmentService,
    patientService
  } from "../../services/api/index.js";
  import {
    formatDate
  } from "../../services/utilidades.js";

  const tooltips = document.querySelectorAll('[data-bs-title]');
  tooltips.forEach(t => new bootstrap.Tooltip(t));

  const patientId = new URLSearchParams(window.location.search).get('patient_id');
  const patientPromise = patientService.get(patientId);
  const appointmentPromise = appointmentService.ofParent(patientId);

  const [patient, appointments] = await Promise.all([patientPromise, appointmentPromise]);

  document.querySelectorAll('.patientName').forEach(element => {
    element.textContent = `${patient.first_name} ${patient.last_name}`;
    if (element.tagName === 'A') {
      element.href = `verPaciente?id=${patient.id}`
    }
  })

  const appointmentTableBody = document.getElementById('appointmentTableBody');
  const appointmentTemplate = document.getElementById('appointment-template');

  // console.log(appointments);

  // Ordenar citas por fecha y hora
  appointments.sort((a, b) => {
    return new Date(`${a.appointment_date}T${a.appointment_time}`) -
      new Date(`${b.appointment_date}T${b.appointment_time}`);
  });

  appointments.forEach(appointment => {
    const templateInstance = appointmentTemplate.content.cloneNode(true);
    const row = templateInstance.querySelector('tr');

    row.dataset.appointment = JSON.stringify(appointment);

    const doctor = appointment.user_availability.user;
    const estado = appointment.appointment_state.name;

    // console.log(appointment);

    row.querySelector('.fecha').textContent = formatDate(appointment.appointment_date).split(',')[0];
    row.querySelector('.hora').textContent = appointment.appointment_time;
    row.querySelector('.doctor').textContent = `${doctor.first_name} ${doctor.last_name}`;
    row.querySelector('.tipo-cita').textContent = appointment.user_availability.appointment_type_id;
    row.querySelector('.tipo-atencion').textContent = appointment.attention_type;
    row.querySelector('.finalidad-consulta').textContent = appointment.consultation_type;
    const statusBadge = document.createElement('span');
    statusBadge.classList.add('badge', 'badge-phoenix');

    switch (appointment.appointment_state.name.toLowerCase()) {
      case 'pendiente':
        statusBadge.classList.add('badge-phoenix-warning');
        break;
      case 'confirmada':
        statusBadge.classList.add('badge-phoenix-success');
        break;
      case 'cancelada':
        statusBadge.classList.add('badge-phoenix-danger');
        break;
    }

    statusBadge.textContent = appointment.appointment_state.name;
    row.querySelector('.estado').appendChild(statusBadge);

    row.querySelector('.editar-cita').onclick = () => editarCita(appointment.id);
    row.querySelector('.eliminar-cita').onclick = () => eliminarCita(appointment.id);

    row.querySelector('.btnImprimirCita').onclick = () => imprimirCita(appointment);
    row.querySelector('.btnDescargarCita').onclick = () => descargarCita(appointment);

    appointmentTableBody.appendChild(row);
  });

  new DataTable('.table');
</script>


<script>
  async function imprimirCita(cita) {
    // console.log(cita);
  }

  async function descargarCita(cita) {
    // console.log(cita);
  }

  function eliminarCita(id) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('Cita eliminada con ID:', id);
        Swal.fire(
          '¡Eliminado!',
          'La cita ha sido eliminada.',
          'success'
        );
      }
    });
  }
</script>

<?php
include "./modalReagendar.php";
include "./modalPreadmission.php";
?>
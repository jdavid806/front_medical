<?php
include "../menu.php";
include "../header.php";
$arraytest = [
    [
        "Nombre" => "Juan Pérez",
        "Numero de documento" => "108574152",
        "Fecha Consulta" => "2025-10-18",
        "Hora Consulta" => "08:00 AM",
        "Profesional asignado" => "Camilo Villacorte",
        "Entidad" => "Entidad 1",
        "Estado" => "Pendiente"
    ],

];

// Datos de ejemplo
$consultas = [
    ['id' => 1, 'fecha' => '2024-11-20', 'descripcion' => 'Consulta sobre productos', 'estado' => 'Pendientes'],
    ['id' => 2, 'fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos', 'estado' => 'En espera de consulta'],
    ['id' => 3, 'fecha' => '2024-11-26', 'descripcion' => 'Consulta médica', 'estado' => 'En consulta'],
    ['id' => 4, 'fecha' => '2024-11-27', 'descripcion' => 'Seguimiento', 'estado' => 'Consulta finalizada'],
];

$recetas = [
    ['id' => 1, 'nombre' => 'Ibuprofeno', 'presentacion' => 'Tabletas 200mg', 'dosis' => '2 veces al día', 'fecha' => '2024-11-20', 'descripcion' => 'Receta para dolor de cabeza'],
    ['id' => 2, 'nombre' => 'Paracetamol', 'presentacion' => 'Tabletas 500mg', 'dosis' => 'Cada 8 horas', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para fiebre'],
    ['id' => 3, 'nombre' => 'Amoxicilina', 'presentacion' => 'Cápsulas 500mg', 'dosis' => '3 veces al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para infección respiratoria'],
    ['id' => 4, 'nombre' => 'Metformina', 'presentacion' => 'Tabletas 850mg', 'dosis' => '1 vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para diabetes tipo 2'],
    ['id' => 5, 'nombre' => 'Loratadina', 'presentacion' => 'Tabletas 10mg', 'dosis' => 'Una vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para alergias'],
    ['id' => 6, 'nombre' => 'Omeprazol', 'presentacion' => 'Tabletas 20mg', 'dosis' => '1 vez al día antes de las comidas', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para acidez estomacal'],
    ['id' => 7, 'nombre' => 'Fluconazol', 'presentacion' => 'Cápsulas 150mg', 'dosis' => 'Una sola dosis', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para infección vaginal'],
];

// Agrupar consultas por estado
$estados = ['Pendientes', 'En espera de consulta', 'En consulta', 'Consulta finalizada'];
$consultasPorEstado = [];
foreach ($estados as $estado) {
    $consultasPorEstado[$estado] = array_filter($consultas, fn($consulta) => $consulta['estado'] === $estado);
}
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
    /* cursor: grab; */
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
.column[data-status="1"] .task {
    background-color: #d3d3d3;
}

.column[data-status="2"] .task {
    background-color: #add8e6;
}

.column[data-status="3"] .task {
    background-color: #90ee90;
}

.column[data-status="4"] .task {
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
                    <li class="breadcrumb-item active" onclick="location.reload()">Control de citas</li>
                </ol>
            </nav>
            <div class="row mt-4">
                <!-- Pestañas -->
                <ul class="nav nav-underline fs-9 p-3" id="antecedentesTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" id="personales-tab" data-bs-toggle="tab" href="#personales"
                            role="tab">
                            <i class="fas fa-hospital-user"></i> Admisiones
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link" id="citas-tab" data-bs-toggle="tab" href="#citas" role="tab">
                            <i class="fas fa-hospital"></i> Citas
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link" id="salaDeEspera-tab" data-bs-toggle="tab" href="#salaDeEspera" role="tab">
                            <i class="fas fa-chair"></i> Sala de espera
                        </a>
                    </li>
                    <!-- <li class="nav-item" role="presentation">
            <a class="nav-link" id="turnos-tab" data-bs-toggle="tab" href="#turnos" role="tab">
              <i class="fas fa-random"></i> Generar turno
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="turnosGestion-tab" data-bs-toggle="tab" href="#turnosGestion" role="tab">
              <i class="fas fa-ticket-alt"></i> Turnos
            </a>
          </li> -->
                    <!-- <li class="nav-item" role="presentation">
            <a class="nav-link" id="entidades-tab" data-bs-toggle="tab" href="#entidades" role="tab">
              <i class="fas fa-ticket-alt"></i> Entidades
            </a>
          </li> -->
                </ul>

                <div class="tab-content mt-3" id="antecedentesTabsContent">
                    <!-- Tab de antecedentes personales -->
                    <div class="tab-pane fade show active" id="personales" role="tabpanel">
                        <div id="admissionsTableReact"></div>
                    </div>

                    <!-- Tab de antecedentes ginecoobstétricos -->
                    <div class="tab-pane fade" id="salaDeEspera" role="tabpanel">
                        <div class="pb-9">
                            <!-- <div class="board" id="board2"></div> -->
                            <div id="LobbyAppointments"></div>

                            <!-- <div class="board" id="board">
                <?php foreach ($consultasPorEstado as $estado => $consultas): ?>
                  <div class="column-wrapper">
                    <div class="column-title">
                      <h3><?= $estado ?></h3>
                    </div>
                    <div class="column" data-status="<?= $estado ?>">
                      <?php foreach ($consultas as $consulta): ?>
                        <div class="task" data-id="<?= $consulta['id'] ?>">
                          <strong><?= $consulta['fecha'] ?></strong>
                          <p><?= $consulta['descripcion'] ?></p>
                          <?php if ($estado === 'En consulta'): ?>
                            <a href="verPaciente?1" class="btn btn-primary flex-shrink-0" target="_blank">Ver paciente <span
                                class="fa-solid fa-chevron-right"></span></a>
                          <?php endif; ?>


                        </div>
                      <?php endforeach; ?>
                    </div>
                  </div>
                <?php endforeach; ?>
              </div> -->

                        </div>
                    </div>

                    <!-- Tab de antecedentes familiares -->
                    <div class="tab-pane fade" id="familiares" role="tabpanel">
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th class="sort" data-sort="fecha">Fecha</th>
                                        <th class="sort" data-sort="doctor">Doctor(a)</th>
                                        <th class="sort" data-sort="motivo">Motivo</th>
                                        <th class="sort" data-sort="detalles">Detalles</th>
                                        <th class="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody class="list">
                                    <?php foreach ($antecedentesFamiliares as $antecedente) { ?>
                                    <tr>
                                        <td class="fecha align-middle"><?= $antecedente['fecha'] ?></td>
                                        <td class="doctor align-middle"><?= $antecedente['doctor'] ?></td>
                                        <td class="motivo align-middle"><?= $antecedente['motivo'] ?></td>
                                        <td class="detalles align-middle"><?= $antecedente['detalles'] ?></td>
                                        <td class="text-end align-middle">
                                            <div class="d-flex justify-content-end gap-2">
                                                <button class="btn text-primary p-0" title="Editar antecedente"
                                                    onclick="editarAntecedente(<?= $receta['recetaId'] ?>)">
                                                    <i class="fa-solid fa-pencil"></i>
                                                </button>
                                                <button class="btn text-primary p-0" title="Eliminar antecedente"
                                                    onclick="eliminarAntecedente(<?= $receta['recetaId'] ?>)">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php } ?>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="citas" role="tabpanel">

                        <div id="appointmentsTableReact"></div>

                    </div>

                    <!-- Tab de turnos -->
                    <div class="tab-pane fade" id="turnos" role="tabpanel">

                        <div id="generateTicketReact"></div>

                    </div>

                    <div class="tab-pane fade" id="turnosGestion" role="tabpanel">

                        <div id="gestionarTicketsReact"></div>

                    </div>

                    <!-- Tab entidades -->
                    <!-- <div class="tab-pane fade" id="entidades" role="tabpanel">

          <div class="tab-pane fade show active" id="personales" role="tabpanel">
            
            <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cédula</th>
                  <th>Fecha Consulta</th>
                  <th>Hora Consulta</th>
                  <th>Profesional asignado</th>
                  <th>Entidad</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody class="list">
                <?php foreach ($arraytest as $value) { ?>
                  <tr>
                    <td class="align-middle custom-td"><?= $value["Nombre"] ?></td>
                    <td class="align-middle custom-td"><?= $value["Cédula"] ?></td>
                    <td class="align-middle custom-td"><?= $value["Fecha Consulta"] ?></td>
                    <td class="align-middle custom-td"><?= $value["Hora Consulta"] ?></td>
                    <td class="align-middle custom-td"><?= $value["Profesional asignado"] ?></td>
                    <td class="align-middle custom-td"><?= $value["Entidad"] ?></td>
                    <td class="align-middle custom-td"><?= $value["Estado"] ?></td>
                    <td class="align-middle white-space-nowrap pe-0 p-3">

                      <a href="Factura_entidad" class="btn btn-primary">
                        <i class="fas fa-file-invoice success"></i> Facturar por entidad
                      </a>
                    </td>
                  </tr>
                <?php } ?>
              </tbody>
            </table>
          </div>
          </div> -->
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
                <button class="btn dropdown-toggle mb-1 btn-primary" type="button" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">Acciones</button>
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

<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
<script type="module">
import {
    admissionService,
    appointmentService
} from './services/api/index.js';
import {
    appointmentStatesColors
} from "./services/commons.js";

// Variables globales
let admissions = [];
let sortableInstances = [];
const admissionsGroupedLabels = {
    1: 'Pendientes',
    2: 'En espera de consulta',
    3: 'En consulta',
    4: 'Consulta finalizada'
};

// Configuración de Pusher
const pusher = new Pusher('5e57937071269859a439', {
    cluster: 'us2'
});
const channel = pusher.subscribe('waiting-room.consultorio2.3');

// Función principal de renderizado
async function renderBoard() {
    const appointmentsStatusBoard = document.getElementById('board2');

    // Limpiar instancias anteriores
    sortableInstances.forEach(instance => instance.destroy());
    sortableInstances = [];
    appointmentsStatusBoard.innerHTML = '';

    // Agrupar admisiones por estado
    const groupedAdmissions = groupAdmissionsByStatus(admissions);

    // Crear columnas
    Object.keys(groupedAdmissions).forEach(statusKey => {
        const columnWrapper = document.createElement('div');
        columnWrapper.classList.add('column-wrapper');

        // Titulo de columna
        const columnTitle = document.createElement('div');
        columnTitle.classList.add('column-title');
        const title = document.createElement('h3');
        title.textContent = admissionsGroupedLabels[statusKey];
        columnTitle.appendChild(title);
        columnWrapper.appendChild(columnTitle);

        // Contenedor de tareas
        const column = document.createElement('div');
        column.classList.add('column');
        column.setAttribute('data-status', statusKey);

        // Crear elementos de tarea
        groupedAdmissions[statusKey].forEach(admission => {
            const task = document.createElement('div');
            task.classList.add('task', `bg-${appointmentStatesColors[statusKey]}-subtle`);
            task.setAttribute('data-id', admission.id);

            // Contenido de la tarea
            const timeElement = document.createElement('strong');
            timeElement.textContent =
                `${admission.appointment_date} ${moment(admission.appointment_time, 'HH:mm:ss').format('HH:mm')}`;

            const patientInfo = document.createElement('p');
            patientInfo.textContent =
                `Paciente: ${admission.patient.first_name} ${admission.patient.last_name}, ${admission.patient.document_type} ${admission.patient.document_number}`;

            const link = document.createElement('a');
            link.href = `verPaciente?id=${admission.patient.id}`;
            link.classList.add('btn', 'btn-primary', 'flex-shrink-0', 'd-none');
            link.setAttribute('target', '_blank');
            link.setAttribute('data-toggle-link', '');
            link.innerHTML = 'Ver paciente <span class="fa-solid fa-chevron-right"></span>';

            // Estado inicial del enlace
            if (statusKey === '3') link.classList.remove('d-none');

            // Ensamblar elementos
            task.appendChild(timeElement);
            task.appendChild(patientInfo);
            task.appendChild(link);
            column.appendChild(task);
        });

        columnWrapper.appendChild(column);
        appointmentsStatusBoard.appendChild(columnWrapper);
    });

    // Inicializar Sortable en nuevas columnas
    // initializeSortable();
}

// Función para agrupar admisiones
function groupAdmissionsByStatus(admissionsList) {
    const grouped = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    admissionsList.forEach(admission => {
        if (admission.is_active && grouped[admission.appointment_state_id]) {
            grouped[admission.appointment_state_id].push(admission);
        }
    });

    // Ordenar por hora de cita
    Object.keys(grouped).forEach(status => {
        grouped[status].sort((a, b) =>
            a.appointment_time.localeCompare(b.appointment_time)
        );
    });

    return grouped;
}

// Inicializar funcionalidad de arrastre
function initializeSortable() {
    document.querySelectorAll('.column').forEach(column => {
        const sortable = new Sortable(column, {
            group: 'shared',
            animation: 150,
            onAdd: async (evt) => {
                const task = evt.item;
                const newStatus = evt.to.dataset.status;
                const taskId = task.dataset.id;

                // Actualizar estilos
                updateTaskStyles(task, newStatus);

                // Confirmar movimiento
                const confirmation = await Swal.fire({
                    title: '¿Confirmar cambio?',
                    text: `Mover cita a: ${admissionsGroupedLabels[newStatus]}`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar'
                });

                if (confirmation.isConfirmed) {
                    try {
                        await appointmentService.updateAppointmentStatus(taskId, newStatus);
                        await refreshAdmissionsData();
                    } catch (error) {
                        console.error('Error updating appointment:', error);
                        evt.from.appendChild(task);
                        updateTaskStyles(task, evt.from.dataset.status);
                    }
                } else {
                    evt.from.appendChild(task);
                    updateTaskStyles(task, evt.from.dataset.status);
                }
            }
        });
        sortableInstances.push(sortable);
    });
}

// Actualizar estilos de la tarea
function updateTaskStyles(taskElement, newStatus) {
    // Limpiar clases de color anteriores
    Object.values(appointmentStatesColors).forEach(color => {
        taskElement.classList.remove(`bg-${color}-subtle`);
    });

    // Añadir nueva clase
    taskElement.classList.add(`bg-${appointmentStatesColors[newStatus]}-subtle`);

    // Manejar visibilidad del enlace
    const link = taskElement.querySelector('[data-toggle-link]');
    link.classList.toggle('d-none', newStatus !== '3');
}

// Actualizar datos desde el servidor
async function refreshAdmissionsData() {
    const response = await admissionService.getAdmisionsAll();
    admissions = response.filter(a =>
        a.user_availability?.appointment_type_id === 1
    );
    console.log("renderizando data");

    await renderBoard();
}

// Configurar eventos de Pusher con debounce
const debouncedRefresh = debounce(refreshAdmissionsData, 300);

channel.bind('appointment.created', debouncedRefresh);
channel.bind('appointment.state.updated', debouncedRefresh);
channel.bind('appointment.inactivated', debouncedRefresh);

// Función debounce
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await refreshAdmissionsData();
    // document.getElementById('generarTurnoBtn').addEventListener('click', generarTurno);
});

// Función de ejemplo para generar turno (mantener tu implementación)
function generarTurno() {
    // Tu implementación existente
}
</script>
<script>
function generarTurno() {
    const identificacion = document.getElementById('identificacion').value;
    const motivo = document.getElementById('motivo').value;
    const asistenciaPreferencial = document.getElementById('asistenciaPreferencial').value;
    const turno = 'G' + Math.floor(Math.random() * 100);
    const fecha = new Date().toLocaleDateString();

    // Verificar si se ingresó asistencia preferencial
    const asistenciaHtml = asistenciaPreferencial ? `<p><strong>Preferencial:</strong> ${asistenciaPreferencial}</p>` :
        '';

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
include "./modalReagendar.php";
include "../footer.php";
?>

<script src="./assets/js/main.js"></script>

<script type="module">
import React from "react"
import ReactDOMClient from "react-dom/client"
import {
    TodayAppointmentsTable
} from './react-dist/appointments/TodayAppointmentsTable.js';
import {
    AppointmentsTable
} from './react-dist/appointments/AppointmentsTable.js';
import {
    GenerateTicket
} from './react-dist/tickets/GenerateTicket.js';
import {
    TicketApp
} from './react-dist/tickets/TicketApp.js';
import {
    LobbyAppointments
} from './react-dist/appointments/LobbyAppointments.js';




ReactDOMClient.createRoot(document.getElementById('LobbyAppointments')).render(React.createElement(
    LobbyAppointments));
ReactDOMClient.createRoot(document.getElementById('admissionsTableReact')).render(React.createElement(
    TodayAppointmentsTable));
ReactDOMClient.createRoot(document.getElementById('appointmentsTableReact')).render(React.createElement(
    AppointmentsTable));
ReactDOMClient.createRoot(document.getElementById('generateTicketReact')).render(React.createElement(GenerateTicket));
ReactDOMClient.createRoot(document.getElementById('gestionarTicketsReact')).render(React.createElement(TicketApp));
</script>
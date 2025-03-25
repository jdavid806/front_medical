<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-fluid p-3">
        <div class="row">
            <div class="row">
                <div class="col-md-12 text-center">
                    <div class="d-flex justify-content-between">
                        <img src="../logo_monaros_sinbg_light.png" alt="medical" style="width: 150px; height: auto" class="align-self-start">
                        <div id="clock" class="text-end mb-5">
                            <div class="d-flex gap-2 align-items-center justify-content-end">
                                <i class="fas fa-clock"></i>
                                <span id="time"></span>
                            </div>
                            <div class="text-end">
                                <strong id="date"></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <table class="table text-center">
                        <thead class="thead-dark">
                            <tr>
                                <th>Turno</th>
                                <th>Paciente</th>
                                <th>Modulo</th>
                            </tr>
                        </thead>
                        <tbody id="pending-body"><!-- Tabla vacía -->
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6 text-center">
                    <table class="table text-center">
                        <thead class="thead-dark">
                            <tr>
                                <th>Paciente</th>
                                <th>Consultorio #</th>
                            </tr>
                        </thead>
                        <tbody id="waiting-body"><!-- Única tabla con datos -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
<script type="module">
    import {
        admissionService,
        moduleService,
        ticketService,
        appointmentStateService
    } from "./services/api/index.js";
    // Datos de ejemplo

    let [appointmentStates, appointments, modules, tickets] = await Promise.all([
        appointmentStateService.getAll(),
        admissionService.getAdmisionsAll(),
        moduleService.active(),
        ticketService.getAll()
    ]);
    appointments = appointments.filter(appointment => {
        return appointment.user_availability.appointment_type_id === 1 && appointment.appointment_date == new Date().toISOString().split('T')[0];
    });

    console.log(appointments);

    let filteredAppointments = appointments;


    // Función para actualizar solo la tabla de pacientes/consultorios
    function updateTables() {
        const waitingBody = document.getElementById("waiting-body");
        waitingBody.innerHTML = "";

        filteredAppointments.forEach(appointment => {
            if (['called'].includes(appointment.appointment_state.name)) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${appointment.patient.first_name || ''} ${appointment.patient.middle_name || ''} ${appointment.patient.last_name || ''} ${appointment.patient.second_last_name || ''}</td>
                    <td>${appointment.user_availability.office || '--'}</td>
                `;
                waitingBody.appendChild(row);
            }
        });
    }

    function updateTicketTable() {
        const pendingBody = document.getElementById("pending-body");
        pendingBody.innerHTML = "";

        modules.forEach(module_ => {
            const row = document.createElement("tr");
            const calledTicket = tickets.find(ticket => ticket.module_id == module_.id && ticket.status == "CALLED");
            row.innerHTML = `
                <td>${calledTicket?.ticket_number || "..."}</td>
                <td>${calledTicket?.patient_name || "..."}</td>
                <td>${module_.name}</td>
            `;
            pendingBody.appendChild(row);
        });
    }

    // Configurar Pusher
    var pusher = new Pusher('5e57937071269859a439', {
        cluster: 'us2'
    });

    var hostname = window.location.hostname.split('.')[0];

    var channel = pusher.subscribe(`waiting-room.${hostname}`);
    var channelTickets = pusher.subscribe(`tickets.${hostname}`);

    channel.bind('appointment.created', function(data) {
        const appointment = {
            id: data.appointment.id,
            consultorio: data.appointment.user_availability.office,
            paciente: data.appointment.patient_id,
            status: data.appointment.appointment_state_id
        }

        filteredAppointments.unshift(appointment);
        updateTables();
    });

    channel.bind('appointment.state.updated', function(data) {
        const appointment = appointments.find(app => app.id == data.appointmentId);
        const newState = appointmentStates.find(state => state.id == data.newState);

        if (['pending', 'called'].includes(newState.name)) {
            filteredAppointments.unshift(appointment);
        } else {
            filteredAppointments = appointments.filter(app => app.id != data.appointmentId);
        }

        updateTables();
    });

    channel.bind('appointment.inactivated', function(data) {
        filteredAppointments = appointments.filter(app => app.id != parseInt(data.appointmentId));
        updateTables();
    });

    channelTickets.bind('ticket.generated', function(data) {
        console.log(data, tickets);

        tickets.push(data.ticket);
    });

    channelTickets.bind('ticket.state.updated', function(data) {
        console.log(data, tickets);

        const ticket = tickets.find(t => t.id == data.ticketId);
        ticket.status = data.newState;
        ticket.module_id = data.moduleId;
        tickets = tickets.filter(t => t.id != data.ticketId);
        tickets.push(ticket);
        updateTicketTable();
    });

    // Función para actualizar hora y fecha
    function updateTime() {
        var now = new Date();
        var timeString = now.toLocaleTimeString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        document.getElementById('time').textContent = timeString;

        var dateString = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('date').textContent = dateString;
    }

    // Inicializar
    updateTables();
    updateTicketTable();
    setInterval(updateTime, 1000);
    updateTime();
</script>

<?php
include "../footer.php";
?>
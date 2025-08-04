<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sala de Espera - Monaros</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Open Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Custom styles */
        body {
            font-family: 'Open Sans', sans-serif;
            /* Font updated */
            background-color: #f0f4f8;
            color: #333;
        }

        .brand-bg {
            background-color: #132030;
            /* Main color updated */
        }

        .card-shadow {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Animation for the main call display */
        @keyframes highlight {
            0% {
                transform: scale(1);
                background-color: #ffffff;
            }

            50% {
                transform: scale(1.02);
                background-color: #eef2ff;
            }

            100% {
                transform: scale(1);
                background-color: #ffffff;
            }
        }

        .highlight-call {
            animation: highlight 1.5s ease-out forwards;
        }

        tbody tr {
            animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }
    </style>
</head>

<body class="antialiased">

    <div class="container mx-auto p-4 lg:p-8">

        <!-- Header: Logo and Clock -->
        <header class="flex justify-between items-center mb-6">
            <!-- User's specific logo tag -->
            <img src="../logo_monaros_sinbg_light.png" alt="medical" style="width: 150px; height: auto" class="align-self-start" onerror="this.onerror=null;this.src='https://placehold.co/150x50/132030/ffffff?text=Monaros';">

            <div id="clock" class="text-right">
                <div class="flex gap-2 items-center justify-end text-xl md:text-2xl font-semibold text-gray-700">
                    <i class="far fa-clock"></i>
                    <span id="time"></span>
                </div>
                <div class="text-sm md:text-base text-gray-500 font-medium">
                    <strong id="date"></strong>
                </div>
            </div>
        </header>

        <main>
            <!-- Main Display: Currently Calling -->
            <div id="currently-calling-container" class="bg-white rounded-xl card-shadow mb-8">
                <!-- Content will be injected here by JavaScript -->
            </div>

            <!-- Two Tables Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <!-- Column 1: Called Turns -->
                <div class="bg-white rounded-xl card-shadow h-full flex flex-col">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-xl lg:text-2xl font-bold text-white text-center">Turnos en Módulo</h2>
                    </div>
                    <div class="p-4 flex-grow">
                        <table class="w-full text-left">
                            <thead class="border-b-2 border-gray-200">
                                <tr>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Turno</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Paciente</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Módulo</th>
                                </tr>
                            </thead>
                            <tbody id="pending-body">
                                <!-- Data will be injected here by your script -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Column 2: Called Patients -->
                <div class="bg-white rounded-xl card-shadow h-full flex flex-col">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-xl lg:text-2xl font-bold text-white text-center">Pacientes en Consultorio</h2>
                    </div>
                    <div class="p-4 flex-grow">
                        <table class="w-full text-left">
                            <thead class="border-b-2 border-gray-200">
                                <tr>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Paciente</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Consultorio #</th>
                                </tr>
                            </thead>
                            <tbody id="waiting-body">
                                <!-- Data will be injected here by your script -->
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <script type="module">
        // Your full JavaScript logic is now integrated here.
        import {
            admissionService,
            moduleService,
            ticketService,
            appointmentStateService
        } from "./services/api/index.js";
        import {
            callTicket,
            callPatientToOffice,
            speak
        } from './services/voiceAnnouncer.js';

        // --- DOM Elements ---
        const waitingBody = document.getElementById("waiting-body");
        const pendingBody = document.getElementById("pending-body");
        const timeEl = document.getElementById('time');
        const dateEl = document.getElementById('date');
        const currentlyCallingContainer = document.getElementById('currently-calling-container');

        // --- Data Fetching and Initialization ---
        let [appointmentStates, appointments, modules, tickets] = await Promise.all([
            appointmentStateService.getAll(),
            admissionService.getAdmisionsAll(),
            moduleService.active(),
            ticketService.getAll()
        ]);

        appointments = appointments.filter(appointment => {
            return appointment.user_availability.appointment_type_id === 1 && appointment.appointment_date == new Date().toISOString().split('T')[0];
        });

        let calledAppointments = appointments.filter(appointment => ['called'].includes(appointment.appointment_state.name));

        // --- Display Update Functions ---

        function updateCurrentlyCallingDisplay(data) {
            let content = '';
            if (data.type === 'ticket') {
                content = `
                    <div class="text-center p-6 md:p-10">
                        <p class="text-5xl md:text-7xl font-black text-indigo-600">${data.ticket.ticket_number}</p>
                        <p class="text-2xl md:text-4xl text-gray-600 mt-4">${data.ticket.patient_name}</p>
                        <p class="text-3xl md:text-5xl font-bold text-gray-800 mt-2">
                            <i class="fas fa-door-open mr-2"></i> Módulo ${data.moduleName}
                        </p>
                    </div>
                `;
            } else if (data.type === 'appointment') {
                content = `
                     <div class="text-center p-6 md:p-10">
                        <p class="text-4xl md:text-6xl font-black text-indigo-600">${data.appointment.patient.first_name || ''} ${data.appointment.patient.last_name || ''}</p>
                        <p class="text-3xl md:text-5xl text-gray-600 mt-4">Pase al consultorio</p>
                        <p class="text-5xl md:text-7xl font-bold text-gray-800 mt-2">
                            <i class="fas fa-clinic-medical mr-2"></i> ${data.appointment.user_availability.office || '--'}
                        </p>
                    </div>
                `;
            } else {
                content = `
                    <div class="text-center p-10 text-gray-400">
                        <i class="fas fa-user-clock fa-3x mb-4"></i>
                        <p class="text-2xl">Esperando llamado...</p>
                    </div>
                `;
            }
            currentlyCallingContainer.innerHTML = content;
            currentlyCallingContainer.classList.add('highlight-call');
            // Remove animation class after it finishes to allow re-triggering
            setTimeout(() => currentlyCallingContainer.classList.remove('highlight-call'), 1500);
        }

        function updateTables() {
            waitingBody.innerHTML = "";
            if (calledAppointments.length === 0) {
                waitingBody.innerHTML = `<tr><td colspan="2" class="text-center text-gray-500 py-4">No hay pacientes llamados a consultorio.</td></tr>`;
                return;
            }
            calledAppointments.forEach(appointment => {
                const row = document.createElement("tr");
                row.className = 'border-b border-gray-100 text-2xl';
                row.innerHTML = `
                    <td class="py-4 px-4 text-gray-700">${appointment.patient.first_name || ''} ${appointment.patient.middle_name || ''} ${appointment.patient.last_name || ''} ${appointment.patient.second_last_name || ''}</td>
                    <td class="py-4 px-4 font-bold text-indigo-600 text-center">${appointment.user_availability.office || '--'}</td>
                `;
                waitingBody.appendChild(row);
            });
        }

        function updateTicketTable() {
            pendingBody.innerHTML = "";
            const calledTickets = tickets.filter(ticket => ticket.status === "CALLED");
            if (calledTickets.length === 0) {
                pendingBody.innerHTML = `<tr><td colspan="3" class="text-center text-gray-500 py-4">No hay turnos activos.</td></tr>`;
                return;
            }
            modules.forEach(module_ => {
                const calledTicket = tickets.find(ticket => ticket.module_id == module_.id && ticket.status == "CALLED");
                const row = document.createElement("tr");
                row.className = 'border-b border-gray-100 text-2xl';
                row.innerHTML = `
                    <td class="py-4 px-4 font-bold text-indigo-600">${calledTicket?.ticket_number || "..."}</td>
                    <td class="py-4 px-4 text-gray-700">${calledTicket?.patient_name || "..."}</td>
                    <td class="py-4 px-4 font-semibold text-gray-800">${module_.name}</td>
                `;
                pendingBody.appendChild(row);
            });
        }

        // --- Pusher Configuration ---
        var pusher = new Pusher('5e57937071269859a439', {
            cluster: 'us2'
        });
        var hostname = window.location.hostname.split('.')[0];
        var channel = pusher.subscribe(`waiting-room.${hostname}`);
        var channelTickets = pusher.subscribe(`tickets.${hostname}`);

        // --- Pusher Event Bindings ---
        channel.bind('appointment.state.updated', function(data) {

            console.log(data);


            const appointment = appointments.find(app => app.id == data.appointmentId);
            const newState = appointmentStates.find(state => state.id == data.newState);
            if (appointment) appointment.appointment_state = newState;

            if (newState && ['called'].includes(newState.name)) {
                const patientFullName = `${appointment.patient.first_name || ''} ${appointment.patient.middle_name || ''} ${appointment.patient.last_name || ''} ${appointment.patient.second_last_name || ''}`;
                callPatientToOffice({
                    nombre: patientFullName,
                    office: appointment.user_availability.office || '--',
                });
                if (!calledAppointments.some(app => app.id === appointment.id)) {
                    calledAppointments.unshift(appointment);
                }
                updateCurrentlyCallingDisplay({
                    type: 'appointment',
                    appointment
                });
            } else {
                calledAppointments = calledAppointments.filter(app => app.id != data.appointmentId);
            }
            updateTables();
        });

        channelTickets.bind('ticket.state.updated', function(data) {
            let ticket = tickets.find(t => t.id == data.ticketId);
            if (ticket) {
                ticket.status = data.newState;
                ticket.module_id = data.moduleId;
            } else {
                ticket = data.ticket;
                tickets.push(ticket);
            }

            if (ticket.status == "CALLED") {
                const moduleInfo = modules.find(module => module.id == ticket.module_id);
                const moduleName = moduleInfo ? moduleInfo.name : 'Desconocido';
                callTicket({
                    nombre: ticket.patient_name,
                    turno: ticket.ticket_number,
                    modulo: moduleName
                });
                updateCurrentlyCallingDisplay({
                    type: 'ticket',
                    ticket,
                    moduleName
                });
            }
            updateTicketTable();
        });

        // Other bindings...
        channel.bind('appointment.created', (data) => appointments.push(data.appointment));
        channel.bind('appointment.inactivated', (data) => {
            calledAppointments = calledAppointments.filter(app => app.id != parseInt(data.appointmentId));
            updateTables();
        });
        channelTickets.bind('ticket.generated', (data) => tickets.push(data.ticket));

        // --- Clock and Date Function ---
        function updateTime() {
            var now = new Date();
            var timeString = now.toLocaleTimeString('es-ES', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            var dateString = now.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (timeEl) timeEl.textContent = timeString;
            if (dateEl) dateEl.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        }

        // --- Initializer ---
        function initialize() {
            updateTables();
            updateTicketTable();
            updateCurrentlyCallingDisplay({
                type: 'none'
            }); // Initial empty state
            setInterval(updateTime, 1000);
            updateTime();
        }

        initialize();
    </script>
</body>

</html>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sala de Espera - Monaros</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #f0f4f8;
            color: #333;
        }

        .brand-bg {
            background-color: #132030;
        }

        .card-shadow {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

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
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .custom-btn {
            width: 150px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 5px;
        }

        .container-small {
            max-width: 100% !important;
            width: 100%;
            padding: 0;
            margin: 0;
        }

        .custom-btn i {
            margin-right: 5px;
        }

        .animate-pulse-once {
            animation: pulse-once 2s ease-in-out;
        }
        
        @keyframes pulse-once {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .highlight-call {
            animation: highlight 10s ease-in-out;
        }
        
        @keyframes highlight {
            0% { background-color: rgba(99, 102, 241, 0.1); }
            100% { background-color: transparent; }
        }

        .status-badge {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .status-called { background-color: #d1fae5; color: #065f46; }
        .status-waiting { background-color: #fef3c7; color: #92400e; }
        .status-missed { background-color: #fee2e2; color: #991b1b; }
        .status-completed { background-color: #dbeafe; color: #1e40af; }
        
        .blink {
            animation: blink-animation 1s steps(2, start) infinite;
        }
        
        @keyframes blink-animation {
            to { visibility: hidden; }
        }
    </style>
</head>

<body class="antialiased">
    <div class="container mx-auto p-4 lg:p-8">

        <header class="flex justify-between items-center mb-6">
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
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                <div class="lg:col-span-2 bg-white rounded-xl card-shadow">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-xl lg:text-2xl font-bold text-white text-center">LLAMANDO ACTUALMENTE</h2>
                    </div>
                    <div id="currently-calling-container" class="text-center p-6 md:p-8 min-h-[300px] flex items-center justify-center">
                        <div class="text-gray-400">
                            <i class="fas fa-user-clock fa-4x mb-4"></i>
                            <p class="text-2xl">Esperando próximo turno</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl card-shadow">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-lg lg:text-xl font-bold text-white text-center">PRÓXIMOS TURNOS</h2>
                    </div>
                    <div id="queue-container" class="p-4 space-y-3">
                        <div class="text-center text-gray-500 py-8">
                            <i class="fas fa-list-ol fa-2x mb-2"></i>
                            <p>No hay turnos en espera</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl card-shadow mb-8">
                <div class="brand-bg p-4 rounded-t-xl">
                    <h2 class="text-xl lg:text-2xl font-bold text-white text-center">TURNOS PERDIDOS</h2>
                </div>
                <div id="recent-calls-container" class="p-4">
                    <div class="text-center text-gray-500 py-6">
                        <i class="fas fa-history fa-2x mb-2"></i>
                        <p>No hay historial reciente</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody id="pending-body">
                                <tr>
                                    <td colspan="4" class="text-center text-gray-500 py-4">Cargando...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

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
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody id="waiting-body">
                                <tr>
                                    <td colspan="3" class="text-center text-gray-500 py-4">Cargando...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <script type="module">
    import { 
        admissionService, 
        moduleService, 
        ticketService, 
        appointmentStateService 
    } from "./services/api/index.js";
    import { 
        callTicket, 
        callPatientToOffice 
    } from './services/voiceAnnouncer.js';

    const waitingBody = document.getElementById("waiting-body");
    const pendingBody = document.getElementById("pending-body");
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    const currentlyCallingContainer = document.getElementById('currently-calling-container');
    const queueContainer = document.getElementById('queue-container');
    const recentCallsContainer = document.getElementById('recent-calls-container');

    let currentCall = null;
    let callQueue = [];
    let recentCalls = [];
    let missedTickets = [];
    let callTimer = null;
    let missedTicketsTimer = null;
    let currentMissedTicketsPage = 0;
    let isCalling = false;
    
    let appointments = [];
    let tickets = [];
    let modules = [];
    let appointmentStates = [];

    let processedTickets = new Set();
    let processedAppointments = new Set();

    // Variables para el refresco automático
    let lastActivityTime = Date.now();
    let autoRefreshInterval = null;
    const INACTIVITY_TIME = 30000; // 30 segundos de inactividad
    const REFRESH_INTERVAL = 10000; // Refrescar cada 10 segundos después de inactividad

    class WaitingRoomManager {
        constructor() {
            this.isInitialized = false;
        }

        async initialize() {
            try {
                    
                [appointmentStates, modules, tickets] = await Promise.all([
                    appointmentStateService.getAll().catch(e => { 
                        console.error("Error loading states:", e); 
                        return []; 
                    }),
                    moduleService.active().catch(e => { 
                        console.error("Error loading modules:", e); 
                        return []; 
                    }),
                    ticketService.getTicketsToday().catch(e => { 
                        console.error("Error loading tickets:", e); 
                        return []; 
                    })
                ]);

                try {
                    const appointmentsData = await admissionService.getAdmisionsAll();
                    appointments = appointmentsData.filter(appointment => {
                        const today = new Date().toISOString().split('T')[0];
                        return appointment.user_availability?.appointment_type_id === 1 && 
                               appointment.appointment_date === today;
                    });
                } catch (error) {
                    console.error("Error loading appointments:", error);
                    appointments = [];
                }

                this.isInitialized = true;
                this.updateAllDisplays();
                this.initializePusher();
                this.startAutoRefresh(); // Iniciar el refresco automático
                    
            } catch (error) {
                console.error("❌ Error crítico inicializando datos:", error);
                this.showErrorState();
            }
        }

        // Nueva función para refresco automático
        startAutoRefresh() {
            // Detectar actividad del usuario
            const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
            activityEvents.forEach(event => {
                document.addEventListener(event, () => {
                    lastActivityTime = Date.now();
                    this.stopAutoRefresh();
                });
            });

            // Verificar inactividad cada 5 segundos
            setInterval(() => {
                const timeSinceLastActivity = Date.now() - lastActivityTime;
                if (timeSinceLastActivity > INACTIVITY_TIME && !autoRefreshInterval) {
                    console.log("🔄 Inactividad detectada, iniciando refresco automático...");
                    this.startRefreshCycle();
                }
            }, 5000);
        }

        startRefreshCycle() {
            if (autoRefreshInterval) return;
            
            autoRefreshInterval = setInterval(async () => {
                // Verificar si hay actividad reciente
                const timeSinceLastActivity = Date.now() - lastActivityTime;
                if (timeSinceLastActivity < INACTIVITY_TIME) {
                    console.log("🔄 Actividad detectada, deteniendo refresco automático");
                    this.stopAutoRefresh();
                    return;
                }

                console.log("🔄 Refrescando datos automáticamente...");
                await this.refreshData();
            }, REFRESH_INTERVAL);
        }

        stopAutoRefresh() {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
                console.log("⏹️ Refresco automático detenido");
            }
        }

        async refreshData() {
            try {
                // Refrescar tickets
                const newTickets = await ticketService.getTicketsToday();
                tickets = newTickets;
                
                // Refrescar citas
                const appointmentsData = await admissionService.getAdmisionsAll();
                appointments = appointmentsData.filter(appointment => {
                    const today = new Date().toISOString().split('T')[0];
                    return appointment.user_availability?.appointment_type_id === 1 && 
                           appointment.appointment_date === today;
                });

                // Actualizar todas las pantallas
                this.updateAllDisplays();
                this.processExistingCalls();
                
                console.log("✅ Datos refrescados exitosamente");
                
            } catch (error) {
                console.error("❌ Error refrescando datos:", error);
            }
        }

        showErrorState() {
            pendingBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-500 py-4">Error cargando datos</td></tr>`;
            waitingBody.innerHTML = `<tr><td colspan="3" class="text-center text-red-500 py-4">Error cargando datos</td></tr>`;
        }

        updateAllDisplays() {
            this.updateTicketTable();
            this.updateAppointmentTable();
            this.updateQueueDisplay();
            this.updateMissedTicketsDisplay();
            this.processExistingCalls();
        }

        updateTicketTable() {
            const activeTickets = tickets.filter(ticket => 
                ["CALLED", "WAITING", "IN_PROGRESS"].includes(ticket.status)
            );

            if (activeTickets.length === 0) {
                pendingBody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-500 py-4">No hay turnos activos</td></tr>`;
                return;
            }

            let html = '';
            activeTickets.forEach(ticket => {
                const moduleInfo = modules.find(module => module.id == ticket.module_id);
                const statusClass = this.getStatusClass(ticket.status);
                const statusText = this.getStatusText(ticket.status);
                
                html += `
                    <tr class="border-b border-gray-100 text-lg">
                        <td class="py-3 px-4 font-bold text-indigo-600">${ticket.ticket_number || 'N/A'}</td>
                        <td class="py-3 px-4 text-gray-700">${ticket.patient_name || 'Paciente no especificado'}</td>
                        <td class="py-3 px-4 font-semibold text-gray-800">${moduleInfo?.name || 'Módulo desconocido'}</td>
                        <td class="py-3 px-4"><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
            });

            pendingBody.innerHTML = html;
        }

        updateAppointmentTable() {
            const activeAppointments = appointments.filter(appointment => 
                ['called', 'waiting', 'in_progress'].includes(appointment.appointment_state?.name)
            );

            if (activeAppointments.length === 0) {
                waitingBody.innerHTML = `<tr><td colspan="3" class="text-center text-gray-500 py-4">No hay pacientes en consultorio</td></tr>`;
                return;
            }

            waitingBody.innerHTML = activeAppointments.map(appointment => {
                const statusClass = this.getStatusClass(appointment.appointment_state?.name);
                const statusText = this.getStatusText(appointment.appointment_state?.name);
                
                return `
                    <tr class="border-b border-gray-100 text-lg">
                        <td class="py-3 px-4 text-gray-700">
                            ${appointment.patient?.first_name || ''} 
                            ${appointment.patient?.middle_name || ''} 
                            ${appointment.patient?.last_name || ''} 
                            ${appointment.patient?.second_last_name || ''}
                        </td>
                        <td class="py-3 px-4 font-bold text-indigo-600 text-center">
                            ${appointment.user_availability?.office || '--'}
                        </td>
                        <td class="py-3 px-4"><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
            }).join('');
        }

        getStatusClass(status) {
            const statusMap = {
                'CALLED': 'status-called',
                'called': 'status-called',
                'WAITING': 'status-waiting',
                'waiting': 'status-waiting',
                'MISSED': 'status-missed',
                'EXPIRED': 'status-missed',
                'LOST': 'status-missed',
                'COMPLETED': 'status-completed',
                'completed': 'status-completed',
                'IN_PROGRESS': 'status-waiting',
                'in_progress': 'status-waiting'
            };
            return statusMap[status] || 'status-waiting';
        }

        getStatusText(status) {
            const textMap = {
                'CALLED': 'Llamando',
                'called': 'Llamando',
                'WAITING': 'En espera',
                'waiting': 'En espera',
                'MISSED': 'Perdido',
                'EXPIRED': 'Expirado',
                'LOST': 'Perdido',
                'COMPLETED': 'Completado',
                'completed': 'Completado',
                'IN_PROGRESS': 'En progreso',
                'in_progress': 'En progreso'
            };
            return textMap[status] || status;
        }

        updateQueueDisplay() {
            if (callQueue.length === 0) {
                queueContainer.innerHTML = `
                    <div class="text-center text-gray-500 py-8">
                        <i class="fas fa-list-ol fa-2x mb-2"></i>
                        <p>No hay turnos en espera</p>
                    </div>
                `;
                return;
            }

            queueContainer.innerHTML = callQueue.map((item, index) => `
                <div class="bg-gray-50 rounded-lg p-3 border-l-4 ${index === 0 ? 'border-yellow-400' : 'border-gray-300'}">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-lg text-gray-700">${item.type === 'ticket' ? item.ticket.ticket_number : 'Cita'}</span>
                        <span class="text-sm text-gray-500">#${index + 1}</span>
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        ${item.type === 'ticket' ? 
                          (item.ticket.patient_name || 'Paciente') : 
                          `${item.appointment.patient?.first_name || ''} ${item.appointment.patient?.last_name || ''}`
                        }
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                        ${item.type === 'ticket' ? 
                          `Módulo ${item.moduleName}` : 
                          `Consultorio ${item.appointment.user_availability?.office || '--'}`
                        }
                    </div>
                    <div class="text-xs text-blue-400 mt-1">
                        Estado: ${item.type === 'ticket' ? item.ticket.status : item.appointment.appointment_state?.name}
                    </div>
                </div>
            `).join('');
        }

        updateCurrentlyCallingDisplay(callData) {
            if (!callData) {
                currentlyCallingContainer.innerHTML = `
                    <div class="text-center text-gray-400">
                        <i class="fas fa-user-clock fa-4x mb-4"></i>
                        <p class="text-2xl">Esperando próximo turno</p>
                    </div>
                `;
                return;
            }

            let content = '';
            if (callData.type === 'ticket') {
                content = `
                    <div class="animate-pulse-once">
                        <div class="blink text-yellow-500 mb-2">
                            <i class="fas fa-bell fa-lg"></i> LLAMANDO
                        </div>
                        <p class="text-5xl md:text-7xl font-black text-indigo-600 mb-2">${callData.ticket.ticket_number}</p>
                        <p class="text-2xl md:text-4xl text-gray-600 mb-4">${callData.ticket.patient_name || 'Paciente'}</p>
                        <p class="text-3xl md:text-5xl font-bold text-gray-800">
                            <i class="fas fa-door-open mr-2"></i> Módulo ${callData.moduleName}
                        </p>
                        <div class="mt-6 text-lg text-gray-500">
                            <i class="fas fa-volume-up mr-2"></i>Diríjase al módulo indicado
                        </div>
                    </div>
                `;
            } else {
                content = `
                    <div class="animate-pulse-once">
                        <div class="blink text-yellow-500 mb-2">
                            <i class="fas fa-bell fa-lg"></i> LLAMANDO
                        </div>
                        <p class="text-4xl md:text-6xl font-black text-indigo-600 mb-2">
                            ${callData.appointment.patient?.first_name || ''} ${callData.appointment.patient?.last_name || 'Paciente'}
                        </p>
                        <p class="text-2xl md:text-4xl text-gray-600 mb-4">Pase al consultorio</p>
                        <p class="text-5xl md:text-7xl font-bold text-gray-800">
                            <i class="fas fa-clinic-medical mr-2"></i> ${callData.appointment.user_availability?.office || '--'}
                        </p>
                        <div class="mt-6 text-lg text-gray-500">
                            <i class="fas fa-volume-up mr-2"></i>Su médico lo está esperando
                        </div>
                    </div>
                `;
            }

            currentlyCallingContainer.innerHTML = content;
        }

        updateMissedTicketsDisplay() {
            const missedTicketsList = tickets.filter(ticket => 
                ["MISSED", "EXPIRED", "LOST"].includes(ticket.status)
            );

            missedTickets = missedTicketsList;
            this.startMissedTicketsRotation();
        }

        startMissedTicketsRotation() {
            if (missedTicketsTimer) {
                clearInterval(missedTicketsTimer);
            }

            if (missedTickets.length === 0) {
                recentCallsContainer.innerHTML = `
                    <div class="text-center text-gray-500 py-6">
                        <i class="fas fa-history fa-2x mb-2"></i>
                        <p>No hay turnos perdidos</p>
                    </div>
                `;
                return;
            }

            this.showMissedTicketsPage(0);

            missedTicketsTimer = setInterval(() => {
                currentMissedTicketsPage++;
                const totalPages = Math.ceil(missedTickets.length / 3);
                
                if (currentMissedTicketsPage >= totalPages) {
                    currentMissedTicketsPage = 0;
                }
                
                this.showMissedTicketsPage(currentMissedTicketsPage);
            }, 5000);
        }

        showMissedTicketsPage(page) {
            const startIndex = page * 3;
            const endIndex = startIndex + 3;
            const currentPageTickets = missedTickets.slice(startIndex, endIndex);
            const totalPages = Math.ceil(missedTickets.length / 3);

            if (currentPageTickets.length === 0) {
                recentCallsContainer.innerHTML = `
                    <div class="text-center text-gray-500 py-6">
                        <i class="fas fa-history fa-2x mb-2"></i>
                        <p>No hay turnos perdidos</p>
                    </div>
                `;
                return;
            }

            recentCallsContainer.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${currentPageTickets.map(ticket => `
                        <div class="bg-red-50 rounded-lg p-3 border border-red-200 animate-fade-in">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-bold text-red-700">${ticket.ticket_number || 'N/A'}</span>
                                <span class="text-xs text-red-500">
                                    <i class="fas fa-exclamation-triangle mr-1"></i>Perdido
                                </span>
                            </div>
                            <div class="text-sm text-red-600">
                                ${ticket.patient_name || 'Paciente no especificado'}
                            </div>
                            <div class="text-xs text-red-400 mt-1">
                                Módulo ${modules.find(m => m.id == ticket.module_id)?.name || 'Desconocido'}
                            </div>
                            <div class="text-xs text-red-300 mt-1">
                                ${this.formatTime(ticket.updated_at || ticket.created_at)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${totalPages > 1 ? `
                    <div class="mt-4 text-center">
                        <div class="flex justify-center space-x-2">
                            ${Array.from({length: totalPages}, (_, i) => `
                                <span class="w-2 h-2 rounded-full ${i === page ? 'bg-red-500' : 'bg-red-200'}"></span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            `;
        }

        processExistingCalls() {
            tickets.forEach(ticket => {
                if (!processedTickets.has(ticket.id)) {
                    this.handleTicketUpdate(ticket);
                    processedTickets.add(ticket.id);
                }
            });
            appointments.forEach(appointment => {
                if (!processedAppointments.has(appointment.id)) {
                    this.handleAppointmentUpdate(appointment);
                    processedAppointments.add(appointment.id);
                }
            });
            if (!isCalling) {
                this.processCallQueue();
            }
        }

        handleTicketUpdate(ticket) {                
            const moduleInfo = modules.find(module => module.id == ticket.module_id);
            if (ticket.status === "called" || ticket.status === "CALLED") {
                if (!isCalling) {
                    this.setCurrentCall({
                        type: 'ticket',
                        ticket,
                        moduleName: moduleInfo?.name || 'Desconocido',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    this.addToQueue({
                        type: 'ticket',
                        ticket,
                        moduleName: moduleInfo?.name || 'Desconocido',
                        timestamp: new Date().toISOString()
                    });
                }
            }
            
            this.updateTicketTable();
            this.updateMissedTicketsDisplay();
        }

        handleAppointmentUpdate(appointment) {                
            if (appointment.appointment_state?.name === 'called') {
                if (!isCalling) {
                    this.setCurrentCall({
                        type: 'appointment',
                        appointment,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    this.addToQueue({
                        type: 'appointment',
                        appointment,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            
            this.updateAppointmentTable();
        }

        addToQueue(callData) {
            const existingIndex = callQueue.findIndex(item => {
                if (item.type === 'ticket' && callData.type === 'ticket') {
                    return item.ticket.id === callData.ticket.id;
                }
                if (item.type === 'appointment' && callData.type === 'appointment') {
                    return item.appointment.id === callData.appointment.id;
                }
                return false;
            });

            if (existingIndex !== -1) {
                callQueue.splice(existingIndex, 1);
            }

            callQueue.push({
                ...callData,
                timestamp: new Date().toISOString()
            });
            
            callQueue.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            this.updateQueueDisplay();
            
        }

        processCallQueue() {
            if (isCalling) {
                console.log("⏳ Ya se está realizando una llamada, esperando...");
                return;
            }

            if (callQueue.length === 0) {
                console.log("📭 Cola vacía, no hay llamadas pendientes");
                return;
            }

            const nextCall = callQueue[0];
            
            const isValidState = nextCall.type === 'ticket' ? 
                (nextCall.ticket.status === "called" || nextCall.ticket.status === "CALLED") :
                (nextCall.appointment.appointment_state?.name === "called");
            
            if (!isValidState) {
                callQueue.shift();
                this.updateQueueDisplay();
                setTimeout(() => this.processCallQueue(), 500);
                return;
            }

            const calledItem = callQueue.shift();
            this.setCurrentCall(calledItem);
            this.updateQueueDisplay();
        }

        setCurrentCall(callData) {
            isCalling = true;
            currentCall = callData;
            this.updateCurrentlyCallingDisplay(currentCall);

            if (callData.type === 'ticket') {
                callTicket({
                    nombre: callData.ticket.patient_name || 'Paciente',
                    turno: callData.ticket.ticket_number,
                    modulo: callData.moduleName
                });
            } else {
                callPatientToOffice({
                    nombre: `${callData.appointment.patient?.first_name || ''} ${callData.appointment.patient?.last_name || ''}`,
                    office: callData.appointment.user_availability?.office || 'Consultorio'
                });
            }

            if (callTimer) clearTimeout(callTimer);
            callTimer = setTimeout(() => this.verifyCallStatus(), 5000);
        }

        async verifyCallStatus() {
            if (!currentCall) {
                isCalling = false;
                this.processCallQueue();
                return;
            }

            try {
                let currentStatus;
                let itemId;

                if (currentCall.type === 'ticket') {
                    const updatedTicket = tickets.find(t => t.id === currentCall.ticket.id);
                    currentStatus = updatedTicket ? updatedTicket.status : currentCall.ticket.status;
                    itemId = currentCall.ticket.id;
                } else {
                    const updatedAppointment = appointments.find(a => a.id === currentCall.appointment.id);
                    currentStatus = updatedAppointment ? updatedAppointment.appointment_state?.name : currentCall.appointment.appointment_state?.name;
                    itemId = currentCall.appointment.id;
                }

                if (currentStatus === "called" || currentStatus === "CALLED") {
                    this.addToQueue({
                        ...currentCall,
                        timestamp: new Date().toISOString()
                    });
                    
                } else if (currentStatus === "missed" || currentStatus === "MISSED") {                        
                    if (!missedTickets.some(item => 
                        (item.type === 'ticket' && item.ticket.id === itemId) ||
                        (item.type === 'appointment' && item.appointment.id === itemId)
                    )) {
                        missedTickets.push({
                            ...currentCall,
                            finalStatus: "MISSED",
                            timestamp: new Date().toISOString()
                        });
                        this.updateMissedTicketsDisplay();
                    }
                    
                } else if (currentStatus === "completed" || currentStatus === "COMPLETED") {                        
                    if (!recentCalls.some(item => 
                        (item.type === 'ticket' && item.ticket.id === itemId) ||
                        (item.type === 'appointment' && item.appointment.id === itemId)
                    )) {
                        recentCalls.unshift({
                            ...currentCall,
                            timestamp: new Date().toISOString(),
                            finalStatus: "COMPLETED"
                        });
                        if (recentCalls.length > 10) recentCalls.pop();
                    }
                }

            } catch (error) {
                console.error("❌ Error en verifyCallStatus:", error);
            } finally {
                currentCall = null;
                isCalling = false;
                this.updateCurrentlyCallingDisplay(null);
                
                setTimeout(() => this.processCallQueue(), 1000);
            }
        }

        formatTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }

        initializePusher() {
            try {
                const pusher = new Pusher('5e57937071269859a439', {
                    cluster: 'us2'
                });
                
                const hostname = window.location.hostname.split('.')[0];
                const channel = pusher.subscribe(`waiting-room.${hostname}`);
                const channelTickets = pusher.subscribe(`tickets.${hostname}`);

                channel.bind('appointment.state.updated', (data) => {
                    this.handleAppointmentEvent(data);
                });

                channelTickets.bind('ticket.state.updated', (data) => {
                    this.handleTicketEvent(data);
                });

            } catch (error) {
                console.error("❌ Error inicializando Pusher:", error);
            }
        }

        handleAppointmentEvent(data) {
            let appointment = appointments.find(app => app.id == data.appointmentId);
            
            if (appointment) {
                const newState = appointmentStates.find(state => state.id == data.newState);
                if (newState) {
                    appointment.appointment_state = newState;
                }

                this.handleAppointmentUpdate(appointment);
                this.updateAppointmentTable();
                this.updateQueueDisplay();
                
                if (currentCall && currentCall.type === 'appointment' && currentCall.appointment.id === appointment.id) {
                    this.updateCurrentlyCallingDisplay(currentCall);
                }
            }
        }

        handleTicketEvent(data) {
            let ticket = tickets.find(t => t.id == data.ticketId);
            
            if (ticket) {
                ticket.status = data.newState;
                ticket.module_id = data.moduleId;
                
                if (data.ticket) {
                    Object.assign(ticket, data.ticket);
                }
            } else if (data.ticket) {
                ticket = data.ticket;
                tickets.push(ticket);
            } else {
                console.warn('⚠️ Evento de ticket sin datos suficientes:', data);
                return;
            }

            this.handleTicketUpdate(ticket);
            this.updateTicketTable();
            this.updateQueueDisplay();
            this.updateMissedTicketsDisplay();

            if (currentCall && currentCall.type === 'ticket' && currentCall.ticket.id === ticket.id) {
                this.updateCurrentlyCallingDisplay(currentCall);
            }

            processedTickets.add(ticket.id);
        }
    }

    const waitingRoom = new WaitingRoomManager();

    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        const dateString = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (timeEl) timeEl.textContent = timeString;
        if (dateEl) dateEl.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    }

    document.addEventListener('DOMContentLoaded', function() {
        updateTime();
        setInterval(updateTime, 1000);
        waitingRoom.initialize();
    });

</script>
</body>
</html>
<form id="disponibilityForm" class="needs-validation" novalidate>
    <div id="assigned_user_specialty_error_container" class="alert alert-danger d-none" role="alert">
        No hay especialistas de: <span id="assigned_user_specialty_error"></span> disponibles en este momento
    </div>
    <div class="row g-3">
        <div class="col-6 mb-2">
            <label class="form-label" for="fechaCita">Fecha de la consulta</label>
            <input
                class="form-control datetimepicker flatpickr-input"
                id="fechaCita"
                name="appointment_date"
                type="text"
                placeholder="dd/mm/yyyy"
                data-options="{'disableMobile':true,'dateFormat':'d/m/Y','defaultDate':'<?= date('d/m/Y') ?>'}"
                required>
            <div class="invalid-feedback">Por favor selecciona la fecha de la consulta.</div>
        </div>
        <div class="col-6 mb-2">
            <label class="form-label" for="appointment_time">Hora de la consulta</label>
            <select id="appointment_time" class="form-control" required>
                <option value="">Seleccione la hora</option>
            </select>
            <div class="invalid-feedback">Por favor selecciona la hora de la consulta.</div>
        </div>
    </div>
    <div class="mb-2">
        <label class="form-label" for="assigned_user_availability_id">Doctor(a) *</label>

        <select class="form-select" id="assigned_user_availability_id" required name="assigned_user_availability_id">
            <option value="0" disabled="">Seleccione</option>
        </select>
        <div class="invalid-feedback">Por favor seleccione a quien sera asignada.</div>
    </div>
</form>

<div class="d-flex justify-content-end">
    <button id="btnImprimirCita" class="btn btn-secondary" type="button">
        <span class="fa fa-print me-2"></span> Imprimir Cita
    </button>
</div>

<script type="module">
    import {
        generarFormato
    } from "./funciones/funcionesJS/generarPDF.js";

    document.addEventListener('DOMContentLoaded', () => {

        const btnImprimirCita = document.getElementById('btnImprimirCita')

        btnImprimirCita.addEventListener('click', () => {
            console.log("Imprimiendo cita");

            generarFormato(
                "Cita", {
                    fechaConsulta: document.getElementById('fechaCita').value,
                    horaConsulta: document.getElementById('appointment_time').value,
                    patientId: new URLSearchParams(window.location.search).get('patient_id'),
                },
                "Impresion"
            )
        })
    })
</script>

<script type="module">
    import {
        userService,
        userAvailabilityService,
        productService,
        appointmentService
    } from "../../services/api/index.js";
    import {
        usersSelect,
        usersSelectWithData,
        userSpecialtiesSelect
    } from "./services/selects.js";

    const userSpecialtiesSelectEl = document.getElementById('assigned_user_specialty_id')
    const assignedUserSpecialtyErrorContainer = document.getElementById('assigned_user_specialty_error_container')
    const assignedUserSpecialtyError = document.getElementById('assigned_user_specialty_error')
    const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');
    let usersSelectChoices = null;
    let currentAppointment = null;

    document.addEventListener('DOMContentLoaded', async function() {
        const loggedUser = await userService.getLoggedUser();
        currentAppointment = await appointmentService.get(appointmentId);
        const fechaInput = document.getElementById("fechaCita");
        const horaSelect = document.getElementById("appointment_time");
        assignedUserSpecialtyErrorContainer.classList.add('d-none')

        // console.log("cita", currentAppointment);


        fechaInput.value = "";
        horaSelect.innerHTML = '<option value="">Seleccione la hora</option>';

        if (fechaInput._flatpickr) {
            fechaInput._flatpickr.destroy();
        }

        // console.log("input de fecha: ", fechaInput);

        const availableBlocks = await userAvailabilityService.availableBlocks({
            user_specialty_id: loggedUser.user_specialty_id,
        });

        window.availableBlocksGlobal = availableBlocks;

        if (availableBlocks.length > 0) {
            console.log("bloques disponibles: ", availableBlocks);
            fechaInput.disabled = false;
            horaSelect.disabled = false;
            document.getElementById("assigned_user_availability_id").disabled = false;
        } else {
            assignedUserSpecialtyErrorContainer.classList.remove('d-none')
            assignedUserSpecialtyError.textContent = userSpecialtiesSelectEl.options[userSpecialtiesSelectEl.selectedIndex].text
        }

        let availableDates = [];
        availableBlocks.forEach(item => {
            item.days.forEach(day => {
                if (!availableDates.includes(day.date)) {
                    availableDates.push(day.date);
                }
            });
        });
        availableDates.sort();

        flatpickr(fechaInput, {
            dateFormat: "Y-m-d",
            enable: availableDates,
            defaultDate: availableDates[0],
            onChange: function(selectedDates, dateStr) {
                actualizarHorarios(availableBlocks, dateStr);
            }
        });

        actualizarHorarios(availableBlocks, availableDates[0]);
    })

    function computeTimeSlots(start, end, duration) {
        const slots = [];
        let current = new Date(`1970-01-01T${start}`);
        const endTime = new Date(`1970-01-01T${end}`);

        while (current.getTime() + duration * 60000 <= endTime.getTime()) {
            const hours = current.getHours().toString().padStart(2, '0');
            const minutes = current.getMinutes().toString().padStart(2, '0');
            slots.push(`${hours}:${minutes}`);
            current = new Date(current.getTime() + duration * 60000);
        }

        return slots;
    }

    function actualizarHorarios(availableBlocks, fechaSeleccionada) {
        const fechaInput = document.getElementById("fechaCita");
        const horaSelect = document.getElementById("appointment_time");
        horaSelect.innerHTML = '<option value="">Seleccione la hora</option>';

        // Recolectar todos los bloques de tiempo para la fecha seleccionada
        let bloques = [];
        availableBlocks.forEach((item) => {
            item.days.forEach((day) => {
                if (day.date === fechaSeleccionada) {
                    day.blocks.forEach((block) => {
                        bloques.push({
                            start: block.start_time,
                            end: block.end_time,
                            duration: item.appointment_duration,
                            user: item.user,
                            availability_id: item.availability_id, // Incluir availability_id
                        });
                    });
                }
            });
        });

        // Generar todas las horas disponibles para todos los bloques
        let opciones = [];
        bloques.forEach((bloque) => {
            const slots = computeTimeSlots(bloque.start, bloque.end, bloque.duration);
            opciones = opciones.concat(
                slots.map((slot) => ({
                    time: slot,
                    availability_id: bloque.availability_id,
                    user: bloque.user,
                }))
            );
        });

        // Eliminar horas duplicadas
        let uniqueOpciones = [];
        const seenTimes = new Set();
        opciones.forEach((opcion) => {
            if (!seenTimes.has(opcion.time)) {
                seenTimes.add(opcion.time);
                uniqueOpciones.push(opcion);
            }
        });

        // Ordenar las horas
        uniqueOpciones.sort((a, b) => a.time.localeCompare(b.time));

        // Obtener fecha local (sin UTC)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses son 0-based
        const day = String(now.getDate()).padStart(2, '0');
        const todayDate = `${year}-${month}-${day}`;

        // Obtener hora local
        const currentTime = String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');

        if (fechaInput.value === todayDate) {
            uniqueOpciones = uniqueOpciones.filter(opcion => opcion.time >= currentTime);
        }

        // Llenar el select de horas
        uniqueOpciones.forEach((opcion) => {
            const option = document.createElement("option");
            option.value = opcion.time;
            option.textContent = opcion.time;
            horaSelect.appendChild(option);
        });

        // Actualizar los médicos disponibles para la primera hora seleccionada
        const selectedTime = uniqueOpciones.length > 0 ? uniqueOpciones[0].time : "";
        horaSelect.value = selectedTime;

        filtrarDoctores(availableBlocks, fechaSeleccionada, selectedTime);
    }

    document.getElementById("appointment_time").addEventListener("change", () => {
        const fechaSeleccionada = document.getElementById("fechaCita").value;
        const selectedTime = document.getElementById("appointment_time").value;
        filtrarDoctores(window.availableBlocksGlobal, fechaSeleccionada, selectedTime);
    });

    function filtrarDoctores(availableBlocks, selectedDate, selectedTime) {
        console.log(availableBlocks, selectedDate, selectedTime);

        let availableAvailabilities = [];

        // Convertir la hora seleccionada a un objeto Date para facilitar la comparación
        const selectedTimeDate = new Date(`1970-01-01T${selectedTime}:00`);

        availableBlocks.forEach((item) => {
            item.days.forEach((day) => {
                if (day.date === selectedDate) {
                    day.blocks.forEach((block) => {
                        const blockStart = new Date(`1970-01-01T${block.start_time}`);
                        const blockEnd = new Date(`1970-01-01T${block.end_time}`);

                        // Verificar si la hora seleccionada está dentro del bloque de tiempo
                        if (selectedTimeDate >= blockStart && selectedTimeDate < blockEnd) {
                            availableAvailabilities.push(item);
                        }
                    });
                }
            });
        });

        // Eliminar duplicados por availability_id
        const uniqueAvailabilities = [];
        const seenIds = new Set();
        availableAvailabilities.forEach((avail) => {
            if (!seenIds.has(avail.availability_id)) {
                seenIds.add(avail.availability_id);
                uniqueAvailabilities.push(avail);
            }
        });

        // Mapear a opciones para el select
        const doctorOptions = uniqueAvailabilities.map((avail) => ({
            ...avail.user, // Mantener datos del usuario para mostrar nombre
            id: avail.availability_id, // Usar availability_id como valor
            full_name: `${avail.user.first_name} ${avail.user.last_name}`, // Nombre completo
        }));

        // Actualizar el select de doctores
        if (usersSelectChoices) {
            usersSelectChoices.clearStore();
            usersSelectChoices.destroy();
            usersSelectChoices = null;
        }

        usersSelectChoices = usersSelectWithData(
            doctorOptions,
            document.getElementById("assigned_user_availability_id")
        );

        console.log(usersSelectChoices, doctorOptions);
    }
</script>
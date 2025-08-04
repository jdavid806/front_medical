<?php
$rips = array(
  'CONSULTATION' => 'Consulta',
  'PROCEDURE' => 'Procedimiento',
);

$purposeConsultation = [
  'PROMOTION' => 'Promoción',
  'PREVENTION' => 'Prevención',
  'TREATMENT' => 'Tratamiento',
  'REHABILITATION' => 'Rehabilitación',
];

$typeConsults = array(
  "CONTROL" => "Control",
  "EMERGENCY" => "Urgencia",
  "FIRST_TIME" => "Primera vez",
  "FOLLOW_UP" => "Seguimiento"
);

$externalCause = array(
  'ACCIDENT' => 'Accidente',
  'OTHER' => 'Otra',
  'NOT_APPLICABLE' => 'No aplica',
);
?>

<script type="module">
import {
    patientService
} from "../../services/api/index.js";

document.addEventListener('DOMContentLoaded', async () => {
    const patientsData = await patientService.getAll();
    const selectPatients = document.getElementById("selectPatients");

    if (patientsData.length > 0) {
        let label = document.createElement("label");
        label.setAttribute("for", "selectPaciente");
        label.classList.add("form-label");
        label.textContent = "Seleccione un paciente *";
        selectPatients.appendChild(label);

        let selectPatient = document.createElement("select");
        selectPatient.classList.add("form-select");
        selectPatient.id = "selectPatient";
        selectPatient.name = "selectPaciente";
        selectPatient.required = true;
        selectPatients.appendChild(selectPatient);

        let invalidFeedback = document.createElement("div");
        invalidFeedback.classList.add("invalid-feedback");
        invalidFeedback.textContent = "Por favor seleccione un paciente.";
        selectPatients.appendChild(invalidFeedback);

        patientsData.forEach((patient) => {
            let option = document.createElement("option");
            option.value = patient.id;
            option.textContent = patient.first_name + " " + patient.last_name;
            selectPatient.appendChild(option);
        });

        const choices = new Choices(selectPatient, {
            removeItemButton: true,
            placeholder: true,
            searchEnabled: true,
            searchPlaceholderValue: "Buscar paciente...",
            itemSelectText: "",
        });

        // Event listener para actualizar los campos de Whatsapp y Correo Electrónico
        selectPatient.addEventListener("change", () => {
            // console.log("Event listener triggered");

            const selectedPatientId = selectPatient.value;
            // console.log("Select Patient ID:", selectPatient.value);

            const selectedPatient = patientsData.find(patient => patient.id == selectedPatientId);
            // console.log("Selected Patient Data:", selectedPatient);

            if (selectedPatient) {
                document.getElementById("telefonoPaciente").value = selectedPatient.whatsapp ||
                    "";
                document.getElementById("correoPaciente").value = selectedPatient.email || "";
            }
        });
    }
});
</script>

<div class="modal fade" id="modalCrearCita" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nueva Cita</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <!-- Indicadores de progreso -->
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active cursor-pointer" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Doctor (a)</span>
                        </li>
                        <li class="step cursor-pointer" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Cita</span>
                        </li>
                        <li id="stepPaciente" class="step cursor-pointer" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Paciente</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevaCita" class="needs-validation" novalidate>
                    <div class="wizard-content">
                        <!-- Paso 1: Cita -->
                        <div class="wizard-step active" data-step="1">
                            <div class="mt-1">
                                <label class="form-label" for="assigned_user_specialty_id">Especialidad médica *</label>
                                <select class="form-select" id="assigned_user_specialty_id"
                                    name="assigned_user_specialty_id" required>
                                    <option selected value="">Seleccione</option>
                                </select>
                                <div class="invalid-feedback">Por favor seleccione una especialidad.</div>
                            </div>
                            <div id="assigned_user_specialty_error_container" class="alert alert-danger d-none"
                                role="alert">
                                No hay especialistas de: <span id="assigned_user_specialty_error"></span> disponibles en
                                este momento
                            </div>
                            <div class="row g-3">
                                <div class="col-6 mb-2">
                                    <label class="form-label" for="fechaCita">Fecha de la consulta</label>
                                    <input class="form-control datetimepicker flatpickr-input" id="fechaCita"
                                        name="appointment_date" type="text" placeholder="dd/mm/yyyy"
                                        data-options="{'disableMobile':true,'dateFormat':'d/m/Y','defaultDate':'<?= date('d/m/Y') ?>'}"
                                        required disabled>
                                    <div class="invalid-feedback">Por favor selecciona la fecha de la consulta.</div>
                                </div>
                                <div class="col-6 mb-2">
                                    <label class="form-label" for="appointment_time">Hora de la consulta</label>
                                    <select id="appointment_time" class="form-control" required disabled>
                                        <option value="">Seleccione la hora</option>
                                    </select>
                                    <div class="invalid-feedback">Por favor selecciona la hora de la consulta.</div>
                                </div>
                            </div>
                            <div class="mb-2">
                                <label class="form-label" for="assigned_user_availability_id">Doctor(a) *</label>

                                <select class="form-select" id="assigned_user_availability_id" required
                                    name="assigned_user_availability_id" disabled>
                                    <option value="0" disabled="">Seleccione</option>
                                </select>
                                <div class="invalid-feedback">Por favor seleccione a quien sera asignada.</div>
                            </div>


                        </div>

                        <!-- Paso 2: Paciente -->
                        <div class="wizard-step" data-step="2">
                            <div class="mb-2 d-flex flex-column gap-3">
                                <label class="form-label">Tipo de cita *</label>
                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="appointment_type_id"
                                            id="tipoCitaPresencial" value="1" required>
                                        <label class="form-check-label" for="tipoCitaPresencial">Presencial</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="appointment_type_id"
                                            id="tipoCitaDomiciliaria" value="2" required>
                                        <label class="form-check-label" for="tipoCitaDomiciliaria">Domiciliaria</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="appointment_type_id"
                                            id="tipoCitaVirtual" value="3" required>
                                        <label class="form-check-label" for="tipoCitaVirtual">Virtual</label>
                                    </div>
                                </div>
                                <div class="invalid-feedback">Por favor seleccione un tipo de cita.</div>
                            </div>

                            <input type="hidden" name="attention_type" value="PROCEDURE">

                            <div class="row g-3">
                                <div class="col-sm-6">
                                    <div class="mb-2 mb-sm-0">
                                        <label class="form-label" for="product_id">Procedimiento *</label>

                                        <select class="form-select" name="product_id" id="product_id"
                                            required="required">
                                            <option value="">Seleccionar</option>
                                        </select>
                                        <div class="invalid-feedback">Por favor seleccione el tipo de atención.</div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="mb-2 mb-sm-0">
                                        <label class="form-label" for="consultation_purpose">Finalidad de la consulta
                                            *</label>
                                        <select class="form-select" name="consultation_purpose"
                                            id="consultation_purpose" required>
                                            <option value="">Seleccionar</option>
                                            <?php foreach ($purposeConsultation as $key => $value) { ?>
                                            <option value="<?= $key ?>"><?= $value ?></option>
                                            <?php } ?>
                                        </select>
                                        <div class="invalid-feedback">Por favor seleccione la finalidad de la consulta.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-3 mb-3">
                                <div class="col-sm-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="consultation_type">Tipo de consulta *</label>
                                        <select class="form-select" name="consultation_type" id="consultation_type"
                                            required>
                                            <option value="">Seleccionar</option>
                                            <?php foreach ($typeConsults as $key => $value) { ?>
                                            <option value="<?= $key ?>"><?= $value ?></option>
                                            <?php } ?>
                                        </select>
                                        <div class="invalid-feedback">Por favor seleccione un tipo de consulta.</div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="external_cause">Causa externa</label>
                                        <select class="form-select" name="external_cause" id="external_cause">
                                            <option value="">Seleccionar</option>
                                            <?php foreach ($externalCause as $key => $value) { ?>
                                            <option value="<?= $key ?>"><?= $value ?></option>
                                            <?php } ?>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="citaRecurrente"
                                        name="citaRecurrente">
                                    <label class="form-check-label text-uppercase" for="citaRecurrente">Cita
                                        recurrente</label>
                                </div>
                            </div>

                            <!-- Contenedor oculto que se mostrará si se marca la cita recurrente -->
                            <div id="recurrenteOptions" style="display: none;">
                                <div class="mb-2">
                                    <label class="form-label" for="frecuenciaCita">Frecuencia de la cita</label>
                                    <select class="form-select" id="frecuenciaCita" name="frecuenciaCita">
                                        <option selected disabled value="">Seleccione la frecuencia</option>
                                        <option value="diario">Diario</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="mensual">Mensual</option>
                                        <option value="bimestral">Bimestral</option>
                                        <option value="semestral">Semestral</option>
                                    </select>
                                </div>

                                <div class="mb-2">
                                    <label class="form-label" for="numRepeticiones">Número de repeticiones</label>
                                    <input class="form-control" type="number" id="numRepeticiones"
                                        name="numRepeticiones" min="1">
                                </div>
                            </div>

                        </div>

                        <!-- Paso 3: Doctor -->
                        <div class="wizard-step" data-step="3">
                            <div id="selectPatients" class="mb-2">
                            </div>
                            <div class="mb-2">
                                <label for="telefonoPaciente" class="form-label">Whatsapp</label>
                                <input type="tel" class="form-control" id="telefonoPaciente" name="telefonoPaciente">
                            </div>
                            <div class="mb-2">
                                <label for="correoPaciente" class="form-label">Correo Electrónico</label>
                                <input type="email" class="form-control" id="correoPaciente" name="correoPaciente">
                            </div>
                        </div>
                    </div>
                    <input type="hidden" name="patient_id" value="<?= $_GET['patient_id'] ?>">
                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStep" type="submit"
                    form="wizardForm">Finalizar</button>
            </div>
        </div>
    </div>
</div>

<style>
.steps-container {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
}

.steps {
    list-style: none;
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin: 0;
}

.step {
    text-align: center;
    position: relative;
    flex: 1;
}

.step-number {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    background-color: #e9ecef;
    color: #0d6efd;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.step.active .step-number {
    background-color: #0d6efd;
    color: #fff;
}

.wizard-step {
    display: none;
}

.wizard-step.active {
    display: block;
}
</style>

<script type="module">
import {
    userService,
    userAvailabilityService,
    productService,
} from "../../services/api/index.js";
import {
    usersSelect,
    usersSelectWithData,
    userSpecialtiesSelect
} from "./services/selects.js";

const userSpecialtiesSelectEl = document.getElementById('assigned_user_specialty_id')
const assignedUserSpecialtyErrorContainer = document.getElementById('assigned_user_specialty_error_container')
const assignedUserSpecialtyError = document.getElementById('assigned_user_specialty_error')
let usersSelectChoices = null


async function getProducts() {
    try {
        const response = await productService.getAllProducts(); // ya retorna JSON
        // console.log("Respuesta completa: ", response); // Log adicional para verificar la respuesta completa

        let products;
        if (response.data && Array.isArray(response.data)) {
            products = response.data; // Estructura correcta
        } else if (Array.isArray(response)) {
            products = response; // Caso en que los productos están directamente en la respuesta
        } else {
            console.error("Estructura de respuesta desconocida");
        }

        if (Array.isArray(products)) {
            // console.log("Es un array de productos"); // Confirma que es un array
        } else {
            console.error("No es un array de productos");
        }
        populateProductSelect(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

function populateProductSelect(products) {

    const productSelect = document.getElementById('product_id');
    if (Array.isArray(products)) { // Verifica si products es un array
        products.forEach(product => {
            const attributes = product.attributes;
            if (attributes && attributes.name) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = attributes.name; // Accede al nombre del producto desde attributes
                option.setAttribute('data-price', attributes
                .sale_price); // Accede al precio del producto desde attributes
                productSelect.appendChild(option);

            } else {
                console.error('El producto o sus atributos son undefined:', product);
            }
        });
    } else {
        console.error('No se encontró un array de productos');
    }
}



document.addEventListener('DOMContentLoaded', function() {

    userSpecialtiesSelect(userSpecialtiesSelectEl);

    getProducts();

    userSpecialtiesSelectEl.addEventListener('change', async () => {
        const fechaInput = document.getElementById("fechaCita");
        const horaSelect = document.getElementById("appointment_time");
        assignedUserSpecialtyErrorContainer.classList.add('d-none')

        fechaInput.value = "";
        horaSelect.innerHTML = '<option value="">Seleccione la hora</option>';

        if (fechaInput._flatpickr) {
            fechaInput._flatpickr.destroy();
        }

        const availableBlocks = await userAvailabilityService.availableBlocks({
            user_specialty_id: userSpecialtiesSelectEl.value,
        });
        window.availableBlocksGlobal = availableBlocks;

        if (availableBlocks.length > 0) {
            fechaInput.disabled = false;
            horaSelect.disabled = false;
            document.getElementById("assigned_user_availability_id").disabled = false;
        } else {
            assignedUserSpecialtyErrorContainer.classList.remove('d-none')
            assignedUserSpecialtyError.textContent = userSpecialtiesSelectEl.options[
                userSpecialtiesSelectEl.selectedIndex].text
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
    });
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
                        availability_id: item
                        .availability_id, // Incluir availability_id
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
    // console.log(availableBlocks, selectedDate, selectedTime);

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

    // console.log(usersSelectChoices, doctorOptions);
}

function editarCita(id) {

    const data = JSON.parse(
        document.getElementById("data_appointment_" + id).value
    );


    $("#tipoCita").val(data.tipoCita);
    $("#motivoConsulta").val(data.motivoId);
    $("#fechaCita").val(data.fecha);
    $("#appointment_time").val(data.horaConsulta);
    $("#selectPaciente").val(data.pacienteId);
    $("#telefonoPaciente").val(data.paciente.telefono);
    $("#correoPaciente").val(data.paciente.correo);
    $("#doctor").val(data.doctorId);
    $("#modalCrearCita").modal('show');
}

let currentStep = 1;
let maxSteps = 3;

if (new URLSearchParams(window.location.search).get('patient_id')) {
    maxSteps = 2
    document.getElementById('stepPaciente').classList.add('d-none');
}

const updateWizard = () => {
    // Actualizar los pasos visuales
    document.querySelectorAll('.step').forEach(step => {
        step.classList.toggle('active', step.dataset.step == currentStep);
    });

    // Mostrar el contenido correspondiente
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.toggle('active', step.dataset.step == currentStep);
    });

    // Controlar los botones
    document.getElementById('prevStep').disabled = currentStep === 1;
    document.getElementById('nextStep').classList.toggle('d-none', currentStep === maxSteps);
    document.getElementById('finishStep').classList.toggle('d-none', currentStep !== maxSteps);
};

document.getElementById('nextStep').addEventListener('click', () => {
    const currentForm = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
    if (currentForm.querySelector(':invalid')) {
        currentForm.querySelector(':invalid').focus();
        currentForm.classList.add('was-validated');
    } else {
        currentStep++;
        updateWizard();
    }
});

document.getElementById('prevStep').addEventListener('click', () => {
    currentStep--;
    updateWizard();
});

document.getElementById('modalCrearCita').addEventListener('submit', function(event) {
    if (!this.checkValidity()) {
        event.preventDefault();
        this.classList.add('was-validated');
    }
});

updateWizard();

document.getElementById('citaRecurrente').addEventListener('change', function() {
    let recurrenteOptions = document.getElementById('recurrenteOptions');
    let frecuenciaCita = document.getElementById('frecuenciaCita');
    let numRepeticiones = document.getElementById('numRepeticiones');

    if (this.checked) {
        recurrenteOptions.style.display = 'block';
    } else {
        recurrenteOptions.style.display = 'none';
        // Limpiar valores de los campos
        frecuenciaCita.value = "";
        numRepeticiones.value = "";
    }
});
</script>

<script type="module" src="./Citas/assets/js/modalCitas.js"></script>
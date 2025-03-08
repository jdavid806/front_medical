<?php
include '../data/mocks.php';
include '../data/consts.php';
?>

<div class="modal fade" id="modalCreateUserOpeningHour" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="header-modal-user-opening-hour">Nuevo Horario de Atención</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Datos Generales</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Horario</span>
                        </li>
                    </ul>
                </div>
                <form class="needs-validation" novalidate="novalidate">
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="col-md-12 mb-1">
                                <label class="form-label">Usuario</label>
                                <select required class="form-select" id="user_id">
                                    <?php foreach ($userOptions as $user): ?>
                                        <option value="<?= $user['id'] ?>"><?= $user['name'] ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <div class="invalid-feedback">Por favor seleccione un usuario.</div>
                            </div>

                            <div class="col-md-12 mb-1">
                                <label class="form-label">Tipo de Cita</label>
                                <select required class="form-select" id="appointment_type_id">
                                    <?php foreach ($appointmentTypeOptions as $type): ?>
                                        <option value="<?= $type['id'] ?>"><?= $type['name'] ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <div class="invalid-feedback">Por favor seleccione un tipo de cita.</div>
                            </div>

                            <!-- Campo de duración -->
                            <div class="col-md-12 mb-1">
                                <label class="form-label">Duración de la cita (minutos)</label>
                                <input required class="form-control" type="number" id="duration" min="1" placeholder="Ingrese la duración" />
                                <div class="invalid-feedback">Por favor ingrese una duración válida.</div>
                            </div>

                            <div class="col-md-12 mb-1">
                                <label class="form-label">Sucursal</label>
                                <select class="form-control" id="branch_id">
                                    <?php foreach ($branchOptions as $branch): ?>
                                        <option value="<?= $branch['id'] ?>"><?= $branch['address'] ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <div class="invalid-feedback">Por favor seleccione una sucursal.</div>
                            </div>

                            <div class="col-md-12 mb-1">
                                <label class="form-label">Consultorio</label>
                                <input class="form-control" type="text" id="office" placeholder="Ingrese el consultorio" />
                            </div>

                            <div class="col-md-12 mb-1">
                                <label class="form-label">Día de la Semana</label>
                                <select required class="form-select" multiple="multiple" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}' id="day_of_week">
                                    <option value="">Seleccione uno o más días de la semana</option>
                                    <?php foreach ($DAYS_OF_WEEK as $key => $day): ?>
                                        <option value="<?= strtolower($key) ?>"><?= $day ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <div class="invalid-feedback">Por favor seleccione un día de la semana.</div>
                            </div>
                        </div>

                        <div class="wizard-step" data-step="2">
                            <div class="row">
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Hora de Inicio</label>
                                    <input class="form-control datetimepicker" id="start_time" type="text" placeholder="hour : minute" data-options='{"enableTime":true,"noCalendar":true,"dateFormat":"H:i","disableMobile":true}' />
                                    <div class="invalid-feedback">Por favor seleccione una hora de inicio.</div>
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Hora de Fin</label>
                                    <input class="form-control datetimepicker" id="end_time" type="text" placeholder="hour : minute" data-options='{"enableTime":true,"noCalendar":true,"dateFormat":"H:i","disableMobile":true}' />
                                    <div class="invalid-feedback">Por favor seleccione una hora de fin.</div>
                                </div>
                            </div>

                            <!-- Sección para agregar espacios libres -->
                            <div class="card mt-3">
                                <div class="card-header">
                                    <h6 class="mb-0">Espacios Libres</h6>
                                </div>
                                <div class="card-body">
                                    <div id="freeSpacesContainer"></div>
                                    <button type="button" class="btn btn-secondary mt-2" onclick="addFreeSpace()">Agregar Espacio Libre</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?= $_SESSION['ID'] ?>">

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStep" type="submit" form="wizardForm">Finalizar</button>
            </div>
        </div>
    </div>
</div>

<script>
    function onSubmitUserOpeningHour() {
        let freeSpaces = [];
        document.querySelectorAll('.free-space').forEach(space => {
            freeSpaces.push({
                start: space.querySelector('.free-space-start').value,
                end: space.querySelector('.free-space-end').value
            });
        });

        let data = {
            id: $("#modalCreateUserOpeningHour #id").val(),
            appointment_type_id: $("#appointment_type_id").val(),
            branch_id: $("#branch_id").val(),
            day_of_week: $("#day_of_week").val(),
            start_time: $("#start_time").val(),
            end_time: $("#end_time").val(),
            duration: $("#duration").val(),
            free_spaces: freeSpaces
        };

        console.log(data);
    }

    function addFreeSpace() {
        const container = document.getElementById('freeSpacesContainer');
        const index = container.children.length;
        const div = document.createElement('div');
        div.classList.add('row', 'free-space', 'mb-2');
        div.innerHTML = `
            <div class="d-flex gap-2">
                <div class="row flex-grow-1">
                    <div class="col-md-5">
                        <input class="form-control free-space-start" type="time" placeholder="Hora de inicio">
                    </div>
                    <div class="col-md-5">
                        <input class="form-control free-space-end" type="time" placeholder="Hora de fin">
                    </div>
                </div>
                <div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger" onclick="this.parentElement.parentElement.parentElement.remove()">✖</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }

    function resetModalNewUserOpeningHour() {
        $("#modalCreateUserOpeningHour #id").val("0");
        $("#user_id").val("");
        $("#appointment_type_id").val("");
        $("#branch_id").val("");
        $("#day_of_week").val("");
        $("#start_time").val("");
        $("#end_time").val("");
        $("#duration").val("");
        $("#freeSpacesContainer").innerHTML = "";
    }

    $('#modalCreateUserOpeningHour').on('hidden.bs.modal', function() {
        resetModalNewUserOpeningHour();
    });

    // Declaración de funciones
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
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === 2);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 2);
    };

    // Inicialización de variables
    let currentStep = 1;

    // Eventos
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

    document.getElementById('modalCreateUserOpeningHour').addEventListener('submit', function(event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            this.classList.add('was-validated');
        }
    });

    // Llamadas a funciones dentro de DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        updateWizard();
    });
</script>

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
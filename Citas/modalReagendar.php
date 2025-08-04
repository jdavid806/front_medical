<div class="modal fade" id="reagendarModal" tabindex="-1" aria-labelledby="reagendarModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="reagendarModalLabel">Reagendar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="razonReagendamiento" class="form-label">Razón de reagendamiento</label>
                    <textarea class="form-control" id="razonReagendamiento" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="autoReagendar" name="autoReagendar" checked>
                        <label class="form-check-label" for="autoReagendar">Reagendar automáticamente</label>
                    </div>
                </div>

                <div class="d-none" id="manualReagendarOptions">
                    <div class="mb-3">
                        <label for="especialidadReagendar" class="form-label">Especialidad</label>
                        <select class="form-select" id="especialidadReagendar" aria-label="Especialidad">
                            <option value="">Seleccione una especialidad</option>
                        </select>
                    </div>
                    <div class="row g-2 mb-3">
                        <div class="col">
                            <label for="fechaReagendar" class="form-label">Fecha</label>
                            <input class="form-control datetimepicker flatpickr-input" id="fechaReagendar" name="fechaReagendar" type="text" placeholder="dd/mm/yyyy" data-options='{"dateFormat":"d/m/y","disableMobile":true}' />
                        </div>
                        <div class="col">
                            <label for="horaReagendar" class="form-label">Hora</label>
                            <input class="form-control datetimepicker flatpickr-input" id="horaReagendar" name="horaReagendar" type="text" placeholder="HH:MM" data-options='{"enableTime":true,"noCalendar":true,"dateFormat":"H:i","disableMobile":true,"allowInput":true}' />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="doctorReagendar" class="form-label">Doctor(a)</label>
                        <select class="form-select" id="doctorReagendar" required="required" name="assigned_user_id">
                            <option value="" selected>Seleccione a quien sera asignada</option>
                        </select>
                        <div class="invalid-feedback">Por favor seleccione a quien sera asignada.</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="d-flex justify-content-between gap-2 w-100">
                    <button type="button" class="btn btn-link text-danger" data-bs-dismiss="modal"><i class="fas fa-arrow-left"></i> Cerrar</button>
                    <div class="ms-auto">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar cita</button>
                        <button type="button" class="btn btn-primary" id="btnReagendar" onclick="handleSubmit()">Reagendar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function handleSubmit() {
        const selectedValues = getSelectedValues();
        // console.log(selectedValues);
    }

    function getSelectedValues() {
        const selectedValues = [];
        document.querySelectorAll('.appointment-checkbox:checked').forEach(checkbox => {
            const row = checkbox.closest('tr');
            if (row) {
                selectedValues.push(JSON.parse(row.getAttribute('data-appointment')));
            }
        });
        return selectedValues;
    }
</script>

<script type="module">
    import {
        usersSelect
    } from "./services/selects.js";

    document.addEventListener('DOMContentLoaded', function() {
        usersSelect(document.getElementById('doctorReagendar'))
    })
</script>

<script>
    document.getElementById('autoReagendar').addEventListener('change', function() {
        const manualOptions = document.getElementById('manualReagendarOptions');
        if (this.checked) {
            manualOptions.classList.add('d-none');
        } else {
            manualOptions.classList.remove('d-none');
        }
    });

    document.getElementById('manualReagendarOptions').style.display = document.getElementById('autoReagendar').checked ? 'block' : 'none';
</script>
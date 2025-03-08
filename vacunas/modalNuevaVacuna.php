<?


$arrayDoctores = [
    "1" => "Dr. Juan Pérez",
    "2" => "Dr. Maria Gomez",
    "3" => "Dr. Carlos Rodriguez"
];


$arrayVacunas = [
    "1" => "Vacuna 1",
    "2" => "Vacuna 2",
    "3" => "Vacuna 3"
]
?>


<div class="modal fade" id="modalNuevaVacuna" tabindex="-1" role="dialog" aria-labelledby="modalNuevaVacunaLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalNuevaVacunaLabel">Nueva Vacuna</h5>
            </div>
            <div class="modal-body">
                <form id="formNuevaVacuna">
                    <div class="input-group mt-3">
                        <div class="form-floating">
                            <select class="form-select" name="tipoVacuna" id="tipoVacuna" required>
                                <option value="">Seleccione un tipo de vacuna</option>
                                <?php foreach ($arrayVacunas as $key => $vacuna) { ?>
                                    <option value="<?php echo $key; ?>"><?php echo $vacuna; ?></option>
                                <?php } ?>
                            </select>
                            <label for="tipoVacuna" class="form-label">Tipo de Vacuna</label>
                            <div class="invalid-feedback">Por favor seleccione un tipo de vacuna.</div>
                        </div>
                    </div>
                    <div class="form-group mt-3">
                        <label for="descripcionVacuna">Descripción</label>
                        <textarea class="form-control" id="descripcionVacuna" name="descripcionVacuna" rows="3" required></textarea>
                    </div>
                    <div class="form-group mt-3">
                        <label for="fechaVacuna">Fecha de Aplicación</label>
                        <input class="form-control datetimepicker" id="fechaVacuna" type="text" placeholder="dd/mm/yyyy" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' required />
                    </div>
                    <div class="form-group mt-3">
                        <label for="fechaVacunaProxima">Fecha de proxima aplicación</label>
                        <input class="form-control datetimepicker" id="fechaVacunaProxima" type="text" placeholder="dd/mm/yyyy" data-options='{"disableMobile":true,"dateFormat":"d/m/Y"}' />
                    </div>
                    <div class="form-group mt-3">
                        <label for="dosisVacuna">Dosis</label>
                        <input type="number" class="form-control" id="dosisVacuna" name="dosisVacuna" required>
                    </div>
                    <div class="form-floating mt-3">
                        <select class="form-select" name="tipoVacuna" id="tipoVacuna" required>
                            <option value="">Doctor que aplica</option>
                            <?php foreach ($arrayDoctores as $key => $doctores) { ?>
                                <option value="<?php echo $key; ?>"><?php echo $doctores; ?></option>
                            <?php } ?>
                        </select>
                        <label for="tipoVacuna" class="form-label">Doctor que aplica</label>
                        <div class="invalid-feedback">Por favor seleccione el doctor que aplica.</div>
                    </div>
                    <button type="submit" class="btn btn-primary mt-3">Guardar</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('formNuevaVacuna');
        const fechaVacunaInput = document.getElementById('fechaVacuna');
        const fechaProximaVacunaInput = document.getElementById('fechaProximaVacuna');
        const today = new Date(); // Fecha actual

        form.addEventListener('submit', function(event) {
            // Validar fecha de aplicación
            const fechaVacuna = new Date(fechaVacunaInput.value.split('/').reverse().join('-'));
            if (fechaVacuna < today) {
                event.preventDefault();
                alert('La fecha de aplicación no puede ser inferior a la fecha actual.');
                return;
            }

            if (fechaProximaVacunaInput) {
                const fechaProximaVacuna = new Date(fechaProximaVacunaInput.value.split('/').reverse().join('-'));
                if (fechaProximaVacuna < fechaVacuna) {
                    event.preventDefault();
                    alert('La fecha de próxima aplicación no puede ser inferior a la fecha de aplicación.');
                    return;
                }
            }

        });
    });
</script>
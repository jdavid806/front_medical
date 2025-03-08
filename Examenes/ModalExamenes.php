<div class="modal fade" id="modalExamen" tabindex="-1" aria-labelledby="modalExamenLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalExamenLabel">Examen</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="formCrearIncapacidad" class="was-validated">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="fecha" class="form-label">Fecha</label>
                        <input type="date" class="form-control" id="fecha" name="fecha" value="<?= $examen['fecha'] ?>" readonly>
                    </div>
                    <div class="mb-3">
                        <label for="tipo" class="form-label">Tipo de Examen</label>
                        <input type="text" class="form-control" id="tipo" name="tipo" value="<?= $examen['tipo'] ?>" readonly>
                    </div>
                    <div class="mb-3">
                        <label for="doctor" class="form-label">Doctor</label>
                        <input type="text" class="form-control" id="doctor" name="doctor" value="<?= $examen['doctor'] ?>" readonly>
                    </div>
                    <div class="mb-3">
                        <label for="motivo" class="form-label">Motivo</label>
                        <input type="text" class="form-control" id="motivo" name="motivo" value="<?= $examen['motivo'] ?>" readonly>
                    </div>
                    <div class="mb-3">
                        <label for="comentarios" class="form-label">Comentarios</label>
                        <textarea class="form-control" id="comentarios" name="comentarios" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function editarExamen(id) {

        $("#modalExamenLabel").html(`Editar Examen`);

        const data = JSON.parse(
            document.getElementById("data_laboratorio_" + id).value
        );

        // Asignar valores a los campos del formulario
        $("#fecha").val(data.fecha);
        $("#tipo").val(data.tipo);
        $("#doctor").val(data.doctor);
        $("#motivo").val(data.motivo);
        $("#comentarios").val(data.comentarios);

        $("#modalExamen").modal('show');
    }
</script>
<div class="modal fade" id="modalCrearIncapacidad" tabindex="-1" aria-labelledby="modalCrearIncapacidadLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCrearIncapacidadLabel">Nueva incapacidad</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <?php include "./formIncapacidad.php" ?>
        <!-- <form id="formCrearIncapacidad" class="was-validated">
          <div class="mb-3">
            <div class="row">
              <div class="col-6">
                <label for="desde" class="form-label">Desde</label>
                <input type="date" class="form-control" id="desde" name="start_date">
              </div>
              <div class="col-6">
                <label for="dias" class="form-label">Días de Incapacidad</label>
                <input type="number" class="form-control" id="dias" name="dias" min="1" required>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="hasta" class="form-label">Hasta</label>
            <input type="date" class="form-control" id="hasta" name="end_date" readonly>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="recurrencia">
            <label class="form-check-label" for="recurrencia">Recurrencia</label>
          </div>
          <div id="contenedorRecurrencia" class="d-none card">
            <div class="card-body">
              <div class="mb-3">
                <select class="form-select" name="tipoRecurrencia" id="tipoRecurrencia" required>
                  <option value="dias">Días</option>
                  <option value="semanas">Semanas</option>
                  <option value="meses">Meses</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="cantidadRecurrencia" class="form-label">Cantidad</label>
                <input type="text" class="form-control" id="cantidadRecurrencia" name="cantidadRecurrencia" min="1" value="1">
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="reason" class="form-label">Motivo</label>
            <textarea class="form-control" id="reason" name="reason" rows="3"></textarea>
          </div>

          <input type="hidden" id="accionModalCrearIncapacidad">
          <input type="hidden" name="id">
          <input type="hidden" name="user_id" value="<?php echo $_SESSION['user_id'] ?? 1; ?>">
        </form> -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="btnGuardarIncapacidad">Guardar</button>
      </div>
    </div>
  </div>
</div>
<script type="module" src="./Incapacidades/js/modalIncapacidad.js"></script>
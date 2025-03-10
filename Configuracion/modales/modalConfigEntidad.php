<div class="modal fade modal-xl" id="vincularEspecialidades" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Vincular Especialidades</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formVincularEspecialidades" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-6">
              <label class="form-label" for="especialidad">Especialidad</label>
              <select class="form-select" id="especialidad" required>
                <option value="" disabled selected>Seleccione una especialidad</option>
                <!-- Opciones dinámicas -->
              </select>
              <div class="invalid-feedback">Debe seleccionar una especialidad</div>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label" for="tipo-listado">Tipo de Listado</label>
              <select class="form-select" id="tipo-listado" required>
                <option value="" disabled selected>Seleccione un tipo</option>
                <option value="historias">Listado de Historias</option>
                <option value="cie11">Listado de CIE-11</option>
              </select>
              <div class="invalid-feedback">Debe seleccionar un tipo de listado</div>
            </div>
            <div class="mb-3 col-md-12">
              <label class="form-label" for="listado">Listado</label>
              <select class="form-select" id="listado" multiple required>
                <!-- Opciones dinámicas cargadas según el tipo seleccionado -->
              </select>
              <div class="invalid-feedback">Debe seleccionar al menos un elemento</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="submit">Guardar</button>
          <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</div>
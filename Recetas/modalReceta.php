<div class="modal fade" id="modalCrearReceta" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCrearRecetaLabel">Nueva receta médica</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formCrearReceta" class="overflow-auto">
        <div class="modal-body">
          <div class="mb-3">
            <label for="nombreMedicamento" class="form-label">Nombre del medicamento</label>
            <input type="text" class="form-control" id="nombreMedicamento"
              placeholder="Ingrese el nombre del medicamento">
          </div>
          <div class="mb-3">
            <label for="cantidad" class="form-label">Cantidad</label>
            <input type="number" class="form-control" id="cantidad" placeholder="Ingrese la cantidad" min="1">
          </div>
          <div class="mb-3">
            <label for="presentacion" class="form-label">Presentación (Opcional)</label>
            <select class="form-select" id="presentacion">
              <option value="">Seleccione una presentación</option>
              <option value="crema">Crema</option>
              <option value="jarabe">Jarabe</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="viaAdministracion" class="form-label">Vía de administración (Opcional)</label>
            <select class="form-select" id="viaAdministracion">
              <option value="">Seleccione una vía de administración</option>
              <option value="respiratorio">Respiratorio</option>
              <option value="oral">Oral</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="composicion" class="form-label">Composición (Opcional)</label>
            <textarea class="form-control" id="composicion" rows="3" placeholder="Ingrese la composición"></textarea>
          </div>
          <div class="mb-3">
            <label for="dosis" class="form-label">Dosis (Opcional)</label>
            <textarea class="form-control" id="dosis" rows="3" placeholder="Ingrese la dosis"></textarea>
          </div>
          <div class="mb-3">
            <label for="indicaciones" class="form-label">Indicaciones (Opcional)</label>
            <textarea class="form-control" id="indicaciones" rows="3" placeholder="Ingrese las indicaciones"></textarea>
          </div>
          <div class="mb-3">
            <label for="indicacionesGenerales" class="form-label">Indicaciones generales de la receta (Opcional)</label>
            <textarea class="form-control" id="indicacionesGenerales" rows="3"
              placeholder="Ingrese las indicaciones generales"></textarea>
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


<!-- ver datalles -->
<div class="modal fade" id="modalDetalleReceta" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalDetalleRecetaLabel">Detalle de la receta</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <strong>Nombre del medicamento:</strong>
          <p>Ibuprofeno</p>
        </div>
        <div class="mb-3">
          <strong>Cantidad:</strong>
          <p>30 tabletas</p>
        </div>
        <div class="mb-3">
          <strong>Presentación:</strong>
          <p>Tabletas 200mg</p>
        </div>
        <div class="mb-3">
          <strong>Vía de administración:</strong>
          <p>Oral</p>
        </div>
        <div class="mb-3">
          <strong>Composición:</strong>
          <p>Ibuprofeno 200mg por tableta</p>
        </div>
        <div class="mb-3">
          <strong>Dosis:</strong>
          <p>Tomar 1 tableta cada 8 horas con alimentos.</p>
        </div>
        <div class="mb-3">
          <strong>Indicaciones:</strong>
          <p>No consumir en caso de alergia a los antiinflamatorios. Mantener fuera del alcance de los niños.</p>
        </div>
        <div class="mb-3">
          <strong>Indicaciones generales:</strong>
          <p>Si los síntomas persisten después de 5 días, consulte a su médico.</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
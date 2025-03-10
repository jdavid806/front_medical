<div class="modal fade" id="modalCrearDocumento" tabindex="-1" aria-labelledby="modalCrearDocumentoLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCrearDocumentoLabel">Nueva Documento Informado</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formCrearIncapacidad">
        <div class="modal-body">
          <div class="mb-3">
            <label for="template-plantilla" class="form-label">Plantilla</label>
            <select class="form-select" onclick="" id="template-plantilla">
              <option value="" onlyread>Seleccione una plantilla</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="texto" class="form-label">Documento informado</label>
            <div class="rich-text-react" id="info-plantilla"></div>
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

  document.addEventListener("DOMContentLoaded", function () {
    cargarPConsentimientos();
    cargarPlantillas();
    handleGenerarConsentimientosForm();
  });

</script>
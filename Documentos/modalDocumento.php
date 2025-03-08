<?php
include "../data/mocks.php";
?>
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
            <label for="template" class="form-label">Plantilla</label>
            <select class="form-select" id="template">
              <option value="">Seleccione un Nombre</option>
              <option value="Consentimiento_Informado">Consentimiento Informado</option>
              <option value="Acta_de_salida">Acta de salida</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="texto" class="form-label">Documento informado</label>
            <textarea class="form-control" id="texto" name="texto" rows="8"></textarea>
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
  const templates = <?php echo $jsonTemplates; ?>;
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("template").addEventListener("change", function() {
      let seleccion = this.value;
      document.getElementById("texto").value = templates[seleccion] || "";
    });
  });

  function editarConsentimiento(id) {
    $("#modalCrearDocumentoLabel").html(`Editar Consentimiento`);
    console.log('Editar consentimiento con ID:', id, "data_consentimiento_" + id);

    const data = JSON.parse(
      document.getElementById("data_consentimiento_" + id).value
    );

    console.log(data);
    $("#template").val(data.plantilla);
    $("#texto").val(templates[data.plantilla]);

    $("#modalCrearDocumento").modal('show');
  }
</script>
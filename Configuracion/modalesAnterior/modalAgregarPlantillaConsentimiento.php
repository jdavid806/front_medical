<!-- Modal para agregar plantilla -->
<div class="modal fade modal-xl" id="crearPlantilla" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Plantilla de Consentimiento</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarPlantilla" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label" for="titulo-plantilla">Título</label>
            <input class="form-control" id="titulo-plantilla" type="text" required>
            <div class="invalid-feedback">Debe ingresar un título</div>
          </div>
          <div class="mb-3">
            <?php include "./botonesDinamicos/Consentimeintos.php" ?>
          </div>
          <div class="mb-3">
            <label class="form-label" for="contenido-plantilla">Contenido</label>
            <div class="rich-text-react" id="contenido-plantilla"></div>
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

<script>

  function handleConsentimientosForm() {

    const form = document.getElementById('formAgregarPlantilla');

    if (!form) {
      console.warn('El formulario de creación no existe en el DOM');
      return;
    }

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      const editorContainer = document.querySelector(
        `#contenido-plantilla .ql-editor`
      );

      let template = editorContainer.innerHTML;

      const productId = document.getElementById('consent_id')?.value;
      const productData = {
        tenant_id: "1",
        title: document.getElementById("titulo-plantilla").value,
        template,
      };

      // Validación básica
      /* if (!productData.name || !productData.product_type_id) {
          alert('Nombre y tipo son campos obligatorios');
          return;
      } */

      try {
        if (productId) {
          updateConsentimiento(productId, productData);
        } else {
          createConsentimiento(productData);
        }

        // Limpiar formulario y cerrar modal
        form.reset();
        $('#crearPlantilla').modal('hide');
        cargarConsentimientos();
      } catch (error) {
        alert('Error al crear el producto: ' + error.message);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    handleConsentimientosForm();
  });


</script>
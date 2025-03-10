<!-- Modal para agregar centro de costos -->
<div class="modal fade modal-xl" id="crearCentroCostos" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Centro de Costos</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarCentroCostos" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-6">
              <label class="form-label" for="nombre-centro">Nombre del Centro</label>
              <input class="form-control" id="nombre-centro" type="text" required>
              <div class="invalid-feedback">Debe ingresar un nombre</div>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label" for="codigo-centro">Código</label>
              <input class="form-control" id="codigo-centro" type="text" required>
              <div class="invalid-feedback">Debe ingresar un código</div>
            </div>
            <div class="mb-3 col-md-12">
              <label class="form-label" for="descripcion-centro">Descripción</label>
              <textarea class="form-control" id="descripcion-centro" rows="2"></textarea>
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

<script>
  function handleCentrosCostoForm() {

    const form = document.getElementById('formAgregarCentroCostos');

    if (!form) {
      console.warn('El formulario de creación no existe en el DOM');
      return;
    }

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      const productId = document.getElementById('centro_id')?.value;

      const nombre = document.getElementById("nombre-centro").value;
      const codigo = document.getElementById("codigo-centro").value;
      const descripcion = document.getElementById("descripcion-centro").value || "N/A";

      const productData = {
        name: nombre,
        code: codigo,
        description: descripcion,
      };

      // Validación básica
      /* if (!productData.name || !productData.product_type_id) {
          alert('Nombre y tipo son campos obligatorios');
          return;
      } */

      try {
        if (productId) {
          updateCentroCosto(productId, productData);
        } else {
          createCentroCosto(productData);
        }

        // Limpiar formulario y cerrar modal
        form.reset();
        $('#crearCentroCostos').modal('hide');
        cargarCentrosCosto();
      } catch (error) {
        alert('Error al crear el producto: ' + error.message);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    handleCentrosCostoForm();
  });
</script>
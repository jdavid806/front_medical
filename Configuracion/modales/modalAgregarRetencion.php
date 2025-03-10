<div class="modal fade modal-xl" id="crearImpuestoRetencion" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Impuesto de Retención</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarRetencion" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-12">
              <label class="form-label" for="nombre-retencion">Nombre de la Retención</label>
              <input class="form-control" id="nombre-retencion" type="text" required>
              <div class="invalid-feedback">Debe ingresar un nombre</div>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label" for="porcentaje-retencion">Porcentaje (%)</label>
              <input class="form-control" id="porcentaje-retencion" type="number" min="0" step="0.01" required>
              <div class="invalid-feedback">Debe ingresar un porcentaje válido</div>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label" for="cuenta-contable-retencion">Cuenta Contable</label>
              <input class="form-control" id="cuenta-contable-retencion" type="text" min="0" step="1" required>
              <div class="invalid-feedback">Debe ingresar una Cuenta Contable</div>
            </div>
            <div class="mb-3 col-md-12">
              <label class="form-label" for="descripcion-retencion">Descripción</label>
              <textarea class="form-control" id="descripcion-retencion" rows="2"></textarea>
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
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("porcentaje-retencion");

    input.addEventListener("input", function () {
      if (this.value > 100) {
        this.value = 100;
      } else if (this.value < 0) {
        this.value = 0;
      }

      if (this.value === "" || this.value > 100 || this.value < 0) {
        this.classList.add("is-invalid");
      } else {
        this.classList.remove("is-invalid");
      }
    });
  });
</script>

<script>

  function handleRetencionForm() {

    const form = document.getElementById('formAgregarRetencion');

    if (!form) {
      console.warn('El formulario de creación no existe en el DOM');
      return;
    }

    form.addEventListener('submit', async (e) => {

      e.preventDefault();


      const productId = document.getElementById('retencion_id')?.value;
      const productData = {
        name: document.getElementById('nombre-retencion').value,
        percentage: document.getElementById('porcentaje-retencion').value,
        accountin_account: document.getElementById('cuenta-contable-retencion').value,
        description: document.getElementById('descripcion-retencion').value,
      };

      // Validación básica
      /* if (!productData.name || !productData.product_type_id) {
          alert('Nombre y tipo son campos obligatorios');
          return;
      } */

      try {
        if (productId) {
          updateRetencion(productId, productData);
        } else {
          createRetencion(productData);
        }

        form.reset();
        $('#crearImpuestoRetencion').modal('hide');
      } catch (error) {
        alert('Error al crear el producto: ' + error.message);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    handleRetencionForm();
  });

</script>
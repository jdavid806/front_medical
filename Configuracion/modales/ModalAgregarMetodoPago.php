<div class="modal fade modal-xl" id="crearMetodoPago" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Método de Pago</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarMetodoPago" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-6">
              <label class="form-label" for="nombre-metodo">Nombre del Método</label>
              <input class="form-control" id="nombre-metodo" type="text" required>
              <div class="invalid-feedback">Debe ingresar un nombre</div>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label" for="numero-cuenta">Número de Cuenta (si aplica)</label>
              <input class="form-control" id="numero-cuenta" type="text">
            </div>
            <!-- <div class="mb-3 col-md-6">
              <label class="form-label" for="banco-metodo">Banco o Entidad</label>
              <input class="form-control" id="banco-metodo" type="text">
            </div> -->
            <div class="mb-3 col-md-12">
              <label class="form-label" for="descripcion-metodo">Detalles Adicionales</label>
              <textarea class="form-control" id="descripcion-metodo" rows="2"></textarea>
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

  function handleMetodsPagoForm() {

    const form = document.getElementById('formAgregarMetodoPago');

    if (!form) {
      console.warn('El formulario de creación no existe en el DOM');
      return;
    }

    form.addEventListener('submit', async (e) => {

      e.preventDefault();


      const productId = document.getElementById('method_id')?.value;
      const productData = {
        method: document.getElementById('nombre-metodo').value,
        description: document.getElementById('descripcion-metodo').value,
        accounting_account: document.getElementById('numero-cuenta').value,
      };

      // Validación básica
      /* if (!productData.name || !productData.product_type_id) {
          alert('Nombre y tipo son campos obligatorios');
          return;
      } */
      
      try {
        if (productId) {
          updateMetodoPago(productId, productData);
        } else {
          createMetodoPago(productData);
        }

        // Limpiar formulario y cerrar modal
        form.reset();
        $('#crearMetodoPago').modal('hide');
        cargarMetodosPago();
      } catch (error) {
        alert('Error al crear el producto: ' + error.message);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    handleMetodsPagoForm();
  });

</script>
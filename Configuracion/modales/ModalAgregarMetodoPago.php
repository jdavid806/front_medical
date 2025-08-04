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
              <label class="form-label" for="accounting_account">Cuenta contable</label>
              <select class="form-select" id="accounting_account">
                <option selected="selected">Seleccionar</option>

              </select>
            </div>
            <div class="mb-3 col-md-12">
              <label class="form-label" for="category">Categoría</label>
              <select class="form-select" id="category">
                <option selected="selected">Seleccionar</option>
                <option value="transactional">Transaccional</option>
                <option value="supplier_expiration">Vencimiento Proveedores</option>
                <option value="customer_expiration">Vencimiento Clientes</option>
                <option value="customer_advance">Anticipo Clientes</option>
                <option value="supplier_advance">Anticipo Proveedores</option>
              </select>
            </div>
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
        accounting_account_id: document.getElementById('accounting_account').value,
        category: document.getElementById('category').value || null
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

  document.addEventListener("DOMContentLoaded", function() {
    handleMetodsPagoForm();
  });
</script>

<script type="module">
  import {
    accountingAccountsService
  } from './services/api/index.js';

  document.addEventListener('DOMContentLoaded', function() {
    getAccountingAcounts();
  })

  async function getAccountingAcounts() {

    const accountingAcounts = await accountingAccountsService.getAllAccounts();

    const accountingCountsSelect = document.getElementById('accounting_account');
    if (accountingAcounts.data.length) {
      accountingAcounts.data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.account_name;
        accountingCountsSelect.appendChild(option);
      });
    } else {
      console.error('No se encontró un array');
    }
  }
</script>
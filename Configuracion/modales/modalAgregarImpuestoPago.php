<div class="modal fade modal-xl" id="crearImpuesto" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Impuesto de Cargo</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarImpuesto" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-12">
              <label class="form-label" for="nombre-impuesto">Nombre del Impuesto</label>
              <input class="form-control" id="nombre-impuesto" type="text" required>
              <div class="invalid-feedback">Debe ingresar un nombre</div>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label" for="porcentaje-impuesto">Porcentaje (%)</label>
              <input class="form-control" id="porcentaje-impuesto" type="number" min="0" step="0.01" required>
              <div class="invalid-feedback">Debe ingresar un porcentaje válido</div>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label" for="cuenta-contable-impuesto">Cuenta Contable</label>
              <input class="form-control" id="cuenta-contable-impuesto" type="text" min="0" step="1" required>
              <div class="invalid-feedback">Debe ingresar una Cuenta Contable</div>
            </div>
            <div class="mb-3 col-md-12">
              <label class="form-label" for="descripcion-impuesto">Descripción</label>
              <textarea class="form-control" id="descripcion-impuesto" rows="2"></textarea>
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
  document.getElementById("formAgregarImpuesto").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre-impuesto").value;
    const porcentaje = document.getElementById("porcentaje-impuesto").value;
    const descripcion = document.getElementById("descripcion-impuesto").value || "N/A";

    const tablaImpuestos = document.getElementById("tablaImpuestos");
    const rowCount = tablaImpuestos.rows.length + 1;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>${nombre}</td>
        <td>${porcentaje}%</td>
        <td>${descripcion}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tablaImpuestos.appendChild(row);
    event.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("crearImpuesto"));
    modal.hide();
  });

  function eliminarFila(button) {
    button.closest("tr").remove();
  }
</script>
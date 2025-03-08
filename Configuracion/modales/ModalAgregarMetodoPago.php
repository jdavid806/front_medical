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
            <div class="mb-3 col-md-6">
              <label class="form-label" for="banco-metodo">Banco o Entidad</label>
              <input class="form-control" id="banco-metodo" type="text">
            </div>
            <div class="mb-3 col-md-6">
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
  document.getElementById("formAgregarMetodoPago").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre-metodo").value;
    const cuenta = document.getElementById("numero-cuenta").value || "N/A";
    const banco = document.getElementById("banco-metodo").value || "N/A";
    const descripcion = document.getElementById("descripcion-metodo").value || "N/A";

    const tablaMetodos = document.getElementById("tablaMetodosPago");
    const rowCount = tablaMetodos.rows.length + 1;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>${nombre}</td>
        <td>${cuenta}</td>
        <td>${banco}</td>
        <td>${descripcion}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tablaMetodos.appendChild(row);
    event.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("crearMetodoPago"));
    modal.hide();
  });

  function eliminarFila(button) {
    button.closest("tr").remove();
  }
</script>
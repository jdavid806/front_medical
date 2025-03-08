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
  document.getElementById("formAgregarCentroCostos").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre-centro").value;
    const codigo = document.getElementById("codigo-centro").value;
    const descripcion = document.getElementById("descripcion-centro").value || "N/A";

    const tablaCentros = document.getElementById("tablaCentrosCostos");
    const rowCount = tablaCentros.rows.length + 1;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>${nombre}</td>
        <td>${codigo}</td>
        <td>${descripcion}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tablaCentros.appendChild(row);
    event.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("crearCentroCostos"));
    modal.hide();
  });

  function eliminarFila(button) {
    button.closest("tr").remove();
  }
</script>
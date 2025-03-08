<!-- Modal para agregar plantilla de texto -->
<div class="modal fade" id="crearPlantillaTexto" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Plantilla de Texto</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarPlantillaTexto" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label" for="titulo-plantilla-texto">Título</label>
            <input class="form-control" id="titulo-plantilla-texto" type="text" required>
            <div class="invalid-feedback">Debe ingresar un título</div>
          </div>
          <div class="mb-3">
            <label class="form-label" for="contenido-plantilla-texto">Contenido</label>
            <textarea class="form-control" id="contenido-plantilla-texto" rows="4" required></textarea>
            <div class="invalid-feedback">Debe ingresar el contenido</div>
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
  document.getElementById("formAgregarPlantillaTexto").addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo-plantilla-texto").value;
    const contenido = document.getElementById("contenido-plantilla-texto").value;

    const tablaPlantillasTexto = document.getElementById("tablaPlantillasTexto");
    const rowCount = tablaPlantillasTexto.rows.length + 1;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>${titulo}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tablaPlantillasTexto.appendChild(row);
    event.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("crearPlantillaTexto"));
    modal.hide();
  });

  function eliminarFila(button) {
    button.closest("tr").remove();
  }
</script>
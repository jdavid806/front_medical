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
  document.getElementById("formAgregarPlantilla").addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo-plantilla").value;
    const contenido = document.getElementById("contenido-plantilla").value;

    const tablaPlantillas = document.getElementById("tablaPlantillas");
    const rowCount = tablaPlantillas.rows.length + 1;
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

    tablaPlantillas.appendChild(row);
    event.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("crearPlantilla"));
    modal.hide();
  });

  function eliminarFila(button) {
    button.closest("tr").remove();
  }
</script>
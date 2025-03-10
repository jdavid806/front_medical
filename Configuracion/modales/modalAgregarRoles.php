<div class="modal fade" id="crearRol" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Rol</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarRol" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-12">
              <label class="form-label" for="nombre-rol">Nombre del Rol</label>
              <input class="form-control" id="nombre-rol" type="text" required>
              <div class="invalid-feedback">Debe ingresar un nombre</div>
            </div>
            <div class="mb-3 col-md-12">
              <label class="form-label">Permisos</label>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Crear" id="permiso-crear">
                <label class="form-check-label" for="permiso-crear">Crear</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Editar" id="permiso-editar">
                <label class="form-check-label" for="permiso-editar">Editar</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Eliminar" id="permiso-eliminar">
                <label class="form-check-label" for="permiso-eliminar">Eliminar</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Ver" id="permiso-ver">
                <label class="form-check-label" for="permiso-ver">Ver</label>
              </div>
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
  document.getElementById("formAgregarRol").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombreRol = document.getElementById("nombre-rol").value;
    const permisos = [];
    document.querySelectorAll("#crearRol input[type=checkbox]:checked").forEach(checkbox => {
      permisos.push(checkbox.value);
    });

    const tablaRoles = document.getElementById("tablaRoles");
    const rowCount = tablaRoles.rows.length + 1;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>${nombreRol}</td>
        <td>${permisos.join(", ")}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tablaRoles.appendChild(row);
    event.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("crearRol"));
    modal.hide();
  });

  function eliminarFila(button) {
    button.closest("tr").remove();
  }
</script>
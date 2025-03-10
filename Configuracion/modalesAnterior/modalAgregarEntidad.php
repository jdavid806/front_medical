<div class="modal fade modal-xl" id="crearEntidad" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Nueva Entidad</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarEntidad" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-4">
              <label class="form-label" for="nombre-entidad">Nombre</label>
              <input class="form-control" id="nombre-entidad" type="text" required>
              <div class="invalid-feedback">Debe llenar el nombre de la Entidad</div>
            </div>
            <?php if ($pais == "CO"): ?>
              <div class="mb-3 col-md-4">
                <label class="form-label" for="nit-entidad">NIT</label>
                <input class="form-control" id="nit-entidad" type="number" required>
                <div class="invalid-feedback">Debe ingresar un NIT válido</div>
              </div>
              <div class="mb-3 col-md-4">
                <label class="form-label" for="dv-entidad">DV</label>
                <input class="form-control" id="dv-entidad" type="number" required>
                <div class="invalid-feedback">Debe ingresar el DV</div>
              </div>
            <?php else: ?>
              <div class="mb-3 col-md-4">
                <label class="form-label" for="numeroIdentificacion-entidad">Número de Identificación</label>
                <input class="form-control" id="numeroIdentificacion-entidad" type="number" required>
                <div class="invalid-feedback">Debe ingresar un número de identificación válido</div>
              </div>
              <div class="mb-3 col-md-4">
                <label class="form-label" for="tipoIdentificacion-entidad">Tipo de Identificación</label>
                <select class="form-control" id="tipoIdentificacion-entidad" required>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="NIT">NIT</option>
                </select>
                <div class="invalid-feedback">Debe seleccionar un tipo de identificación</div>
              </div>
            <?php endif; ?>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="email-entidad">Email</label>
              <input class="form-control" id="email-entidad" type="email" required>
              <div class="invalid-feedback">Debe ingresar un correo válido</div>
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="direccion-entidad">Dirección</label>
              <input class="form-control" id="direccion-entidad" type="text">
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="telefono-entidad">Teléfono</label>
              <input class="form-control" id="telefono-entidad" type="number">
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="ciudad-entidad">Ciudad</label>
              <select class="form-control" id="ciudad-entidad">
                <option value="Republica Dominicana">Republica Dominicana</option>
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
              </select>
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
  document.getElementById("formAgregarEntidad").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById("nombre-entidad").value;
    const email = document.getElementById("email-entidad").value;
    const telefono = document.getElementById("telefono-entidad").value || "N/A";
    const ciudad = document.getElementById("ciudad-entidad").value;

    let identificacion = "N/A";
    if (document.getElementById("nit-entidad")) {
      identificacion = document.getElementById("nit-entidad").value + "-" + document.getElementById("dv-entidad").value;
    } else if (document.getElementById("numeroIdentificacion-entidad")) {
      identificacion = document.getElementById("numeroIdentificacion-entidad").value;
    }

    // Generar ID único
    const id = entidadesArray.length > 0 ? entidadesArray[entidadesArray.length - 1].id + 1 : 1;

    // Crear entidad y guardarla en el array
    const entidad = { id, nombre, identificacion, email, telefono, ciudad };
    entidadesArray.push(entidad);
    guardarEntidades(); // Guardar en localStorage

    // Agregar a la tabla
    agregarFilaTabla(entidad);
  
    // Resetear formulario y cerrar modal
    event.target.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("crearEntidad"));
    modal.hide();
  });

  // Agregar fila a la tabla
  function agregarFilaTabla(entidad) {
    const tablaEntidades = document.getElementById("tablaEntidades");
    const row = document.createElement("tr");
    row.setAttribute("data-id", entidad.id);
    row.innerHTML = `
    <td>${entidad.id}</td>
    <td>${entidad.nombre}</td>
    <td>${entidad.identificacion}</td>
    <td>${entidad.email}</td>
    <td>${entidad.telefono}</td>
    <td>${entidad.ciudad}</td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="eliminarFila(${entidad.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
    tablaEntidades.appendChild(row);
  }

  // Cargar datos en la tabla al iniciar
  window.addEventListener("load", () => {
    entidadesArray.forEach(agregarFilaTabla);
  });

  // Eliminar entidad
  function eliminarFila(id) {
    entidadesArray = entidadesArray.filter(entidad => entidad.id !== id);
    guardarEntidades();
    document.querySelector(`tr[data-id="${id}"]`).remove();
  }

</script>
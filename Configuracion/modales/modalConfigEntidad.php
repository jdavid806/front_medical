<div class="modal fade modal-xl" id="vincularEspecialidades" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Vincular Especialidades y CIE-11</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formVincularEspecialidades" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <!-- Columna Izquierda - Especialidades -->
            <div class="col-md-6">
              <h6>Especialidades</h6>
              <div class="mb-3">
                <label class="form-label" for="especialidad">Seleccione Especialidad</label>
                <select class="form-select" id="especialidad">
                  <option value="" disabled selected>Seleccione una especialidad</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Pediatría">Pediatría</option>
                  <option value="Dermatología">Dermatología</option>
                </select>
              </div>
              <button class="btn btn-primary w-100" type="button" id="agregarEspecialidad">Agregar Especialidad</button>
            </div>

            <!-- Columna Derecha - CIE-11 -->
            <div class="col-md-6">
              <h6>Listado de CIE-11</h6>
              <div class="mb-3">
                <label class="form-label" for="cie11">Seleccione CIE-11</label>
                <select class="form-select" id="cie11">
                  <option value="" disabled selected>Seleccione un diagnóstico</option>
                  <option value="A00">Cólera (A00)</option>
                  <option value="B01">Varicela (B01)</option>
                  <option value="C34">Cáncer de pulmón (C34)</option>
                </select>
              </div>
              <button class="btn btn-primary w-100" type="button" id="agregarCie11">Agregar CIE-11</button>
            </div>
          </div>

          <!-- Tabla de elementos agregados -->
          <div class="mt-4">
            <h6>Elementos Agregados</h6>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nombre</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody id="tablaElementos">
                <!-- Los elementos agregados se insertarán aquí dinámicamente -->
              </tbody>
            </table>
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
    const tablaElementos = document.getElementById("tablaElementos");

    // Agregar especialidad
    document.getElementById("agregarEspecialidad").addEventListener("click", function () {
      const select = document.getElementById("especialidad");
      const valor = select.value;
      const texto = select.options[select.selectedIndex]?.text;

      if (valor) {
        agregarFila("Especialidad", texto);
        select.value = ""; // Reiniciar selección
      }
    });

    // Agregar CIE-11
    document.getElementById("agregarCie11").addEventListener("click", function () {
      const select = document.getElementById("cie11");
      const valor = select.value;
      const texto = select.options[select.selectedIndex]?.text;

      if (valor) {
        agregarFila("CIE-11", texto);
        select.value = ""; // Reiniciar selección
      }
    });

    // Función para agregar filas a la tabla
    function agregarFila(tipo, nombre) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${tipo}</td>
        <td>${nombre}</td>
        <td><button class="btn btn-danger btn-sm eliminar">Eliminar</button></td>
      `;
      tablaElementos.appendChild(fila);

      // Agregar evento de eliminación
      fila.querySelector(".eliminar").addEventListener("click", function () {
        fila.remove();
      });
    }
  });
</script>
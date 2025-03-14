<div class="modal fade modal-xl" id="vincularHistoriasClinicas" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Vincular Historias Clínicas y CIE-11</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formVincularHistoriasClinicas" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <!-- Columna Izquierda - Historias Clínicas -->
            <div class="col-md-6">
              <h6>Historias Clínicas</h6>
              <div class="mb-3">
                <label class="form-label" for="historiaClinica">Seleccione Historia Clínica</label>
                <select class="form-select" id="historiaClinica">
                </select>
              </div>
              <button class="btn btn-primary w-100" type="button" id="agregarHistoriaClinica">Agregar Historia
                Clínica</button>
            </div>

            <!-- Columna Derecha - CIE-11 -->
            <div class="col-md-6">
              <h6>Listado de CIE-11</h6>
              <div class="mb-3">
                <label class="form-label" for="cie11">Excriba un Código CIE-11</label>
                <input type="text" class="form-control" id="cie11" placeholder="Código CIE-11">
                <!-- <select class="form-select" >
                  <option value="" disabled selected>Seleccione un diagnóstico</option>
                  <option value="A00">Cólera (A00)</option>
                  <option value="B01">Varicela (B01)</option>
                  <option value="C34">Cáncer de pulmón (C34)</option>
                </select> -->
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
    cargarSelectsEspecilidad();
    cargarSelectsFuncionesEspecialidades();
  });

</script>
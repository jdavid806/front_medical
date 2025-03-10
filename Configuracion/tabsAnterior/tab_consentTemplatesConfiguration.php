<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Plantillas de Consentimientos</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearPlantilla">
      <i class="fa-solid fa-plus"></i> Agregar Plantilla</button>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaPlantillas">
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    cargarConsentimientos();
  });

</script>
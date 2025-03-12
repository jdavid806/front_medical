<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Centros de Costos</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearCentroCostos">
      <i class="fa-solid fa-plus"></i> Agregar Centro de Costos
    </button>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaCentrosCostos">
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    cargarCentrosCosto();
  });

</script>
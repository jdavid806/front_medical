<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Especialdiades</h4>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="tablaEspecialidades">
          <!-- <th>Especialidad Prueba</th>
          <th><button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#vincularEspecialidades">
              <i class="fa-solid fa-gears"></i>
            </button></th> -->
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    cargarEspecilialidades();
  });

</script>
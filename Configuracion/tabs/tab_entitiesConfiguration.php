<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Entidades</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearEntidad">
      <i class="fa-solid fa-plus"></i> Agregar Entidad
    </button>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>NIT / ID</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaEntidades">
          <script>
            console.log(entidadesArray);
          </script>
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>
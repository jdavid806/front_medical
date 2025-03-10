<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Roles y Permisos</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalUserRole">
      <i class="fa-solid fa-plus"></i> Agregar Rol</button>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre del Rol</th>
            <th>Permisos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaRoles">
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>
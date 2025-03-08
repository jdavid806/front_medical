<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Impuestos de Retención</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearImpuestoRetencion">
      <i class="fa-solid fa-plus"></i> Agregar Retención
    </button>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Porcentaje (%)</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaRetenciones">
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>
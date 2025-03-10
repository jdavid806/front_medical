<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Impuestos de Cargo</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearImpuesto">
      <i class="fa-solid fa-plus"></i> Agregar Impuesto
    </button>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Porcentaje (%)</th>
            <th>Cuenta Contable</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaImpuestos">
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    cargarImpuestos();
  });

</script>
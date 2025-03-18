<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Listado de Métodos de Pago</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearMetodoPago">
      <i class="fa-solid fa-plus"></i> Agregar Método de Pago
    </button>
  </div>

  <div class="card">
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Número de Cuenta</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaMetodosPago">
          <!-- Filas dinámicas -->
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    cargarMetodosPago();
  });

</script>
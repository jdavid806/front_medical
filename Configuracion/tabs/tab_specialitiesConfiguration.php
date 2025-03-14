<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Listado de Especialidades</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body>

  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Listado de Especialidades</h4>
    </div>

    <div id="especialidadesTable" class="card" data-list='{"valueNames":["name"],"page":5,"pagination":true}'>
      <div class="card-body">
        <!-- Buscador -->
        <div class="search-box mb-3">
          <input class="form-control search" type="search" placeholder="Buscar especialidad..." aria-label="Buscar">
        </div>

        <!-- Tabla -->
        <div class="card">
          <div class="card-body">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th class="sort" data-sort="name" width="70%">Nombre</th>
                  <th width="30%">Acciones</th>
                </tr>
              </thead>
              <tbody class="list" id="tablaEspecialidades">
                <!-- Filas dinámicas -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Paginación -->
        <div class="d-flex justify-content-between mt-3">
          <span class="d-none d-sm-inline-block" data-list-info></span>
          <div class="d-flex">
            <ul class="pagination mb-0"></ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- JS -->
  <script>
    document.addEventListener("DOMContentLoaded", async function() {
      await cargarEspecialidades();
      new List("especialidadesTable", {
        valueNames: ["name"],
        page: 5,
        pagination: true
      });
    });
  </script>

</body>

</html>
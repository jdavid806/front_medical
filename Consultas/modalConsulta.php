<div class="modal fade modal-xl" id="modalVerConsulta" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-xl">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title fw-bold" id="exampleModalLabel">Detalle de consulta</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <h3 class="fw-bold mb-3"><i class="fa-solid fa-bed-pulse fa-lg"></i> Diagnóstico</h3>
        <div class="row">
          <div class="col-md-6 mb-4">
            <div>
              <div>
                <span class="fw-bold">Diagnóstico principal:</span>
              </div>
              <p class="mb-1">C475 - TUMOR MALIGNO DE LOS NERVIOS PERIFERICOS DE LA PELVIS</p>
            </div>
            <p class="mb-1 fw-bold">Diagnóstico relacionado:</p>
            <ul class="mb-0 ps-4">
              <li>C475 - TUMOR MALIGNO DE LOS NERVIOS PERIFERICOS DE LA PELVIS</li>
              <li>C474 - TUMOR MALIGNO DE LOS NERVIOS PERIFERICOS DEL ABDOMEN</li>
              <li>C478 - LESION DE SITIOS CONTIGUOS DE LOS NERVIOS PERIFERICOS Y DEL SISTEMA NERVIOSO AUTONOMO</li>
            </ul>
          </div>

          <div class="col-md-1 d-flex justify-content-center align-items-start">
            <div style="border-left: 2px solid #000; height: 100%;"></div>
          </div>

          <div class="col-md-5 mb-4">
            <div>
              <div>
                <span class="fw-bold">Motivo de la consulta</span>
              </div>
              <p class="mb-1">Control de rutina</p>
            </div>
            <div>
              <div>
                <span class="fw-bold">Observaciones</span>
              </div>
              <p class="mb-1">Sin observaciones adicionales.</p>
            </div>
          </div>
        </div>

        <hr class="my-4">

        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="fw-bold mb-0"><i class="fa-solid fa-chart-line fa-lg"></i> Evolución</h3>
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
              data-bs-target="#modalAgregarEvolucion">Agregar evolución</button>
          </div>
          <table class="table table-borderless table-striped small">
            <thead class="border-bottom">
              <tr class="text-muted">
                <th class="fw-normal">Fecha y hora</th>
                <th class="fw-normal">Nota de evolución</th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <td class="align-middle">2024-12-07 10:30</td>
                <td class="align-middle">El paciente se encuentra estable, sin cambios significativos.</td>
              </tr>
              <tr>
                <td class="align-middle">2024-12-06 09:15</td>
                <td class="align-middle">Se revisan informes previos. Continúa en seguimiento.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer del modal -->
      <div class="modal-footer d-flex justify-content-end">
        <div class="btn-group me-3">
          <a href="#<?php echo $consulta['historiaId']; ?>" title="Imprimir consulta" class="btn text-primary p-0">
            <i class="fa-solid fa-print"></i>
          </a>
          <a href="#<?php echo $consulta['historiaId']; ?>" title="Descargar consulta"
            class="btn text-primary p-0 ms-3">
            <i class="fa-solid fa-download"></i>
          </a>
          <div class="dropdown ms-3">
            <a class="btn text-primary p-0" href="#" role="button" title="Compartir" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="fa-solid fa-share-nodes"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#"><i class="fa-brands fa-whatsapp"></i> Compartir por Whatsapp</a>
              </li>
              <li><a class="dropdown-item" href="#"><i class="fa-solid fa-envelope"></i> Compartir por Correo</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .logo {
  font-size: 24px; /* Tamaño del ícono */
  border: 2px solid #000; /* Borde cuadrado */
  background-color: #d3d3d3; /* Fondo gris */
  padding: 5px; /* Espacio interno para el ícono */
  border-radius: 4px; /* Opcional: hace que los bordes sean ligeramente redondeados */
}
</style>
<?php
include "../menu.php";
include "../header.php";
?>

<style>
  .tox .tox-notification,
  .tox-promotion {
    display: none;
  }

  .hidden {
    display: none;
  }
</style>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Panel de Encuestas</li>
      </ol>
    </nav>
    <div class="pb-9">
      <div class="row">
        <div class="col-12">
          <div class="col-10">
            <div class="d-flex justify-content-between col-12 row col-md-auto" id="scrollspyFacturacionVentas">
              <div class="col-6">
                <h2 class="mb-4">Panel de Encuestas</h2>
              </div>
              <div class="col-6">
                <button class="btn btn-primary"
                  onclick='createOrdenMessage(2, 9)'>
                  <i class="fa-solid fa-plus"></i> Testing</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0 g-md-4 g-xl-6">
        <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="citas-pendientes-tab" data-bs-toggle="tab" href="#tab-citas-pendientes"
              role="tab" aria-controls="tab-citas-pendientes" aria-selected="true">
              <i class="fas fa-calendar-alt"></i> Citas sin Encuesta
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="encuestas-tab" data-bs-toggle="tab" href="#tab-encuestas" role="tab"
              aria-controls="tab-encuestas" aria-selected="false">
              <i class="fas fa-list"></i> Listado de Encuestas
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="estadistica-encuesta-tab" data-bs-toggle="tab" href="#tab-estadistica-encuesta"
              role="tab" aria-controls="tab-estadistica-encuesta" aria-selected="false">
              <i class="fas fa-chart-bar"></i> Estadística de Encuestas
            </a>
          </li>
        </ul>

        <div class="tab-content mt-3" id="myTabContent">
          <div class="tab-pane fade show active" id="tab-citas-pendientes" role="tabpanel"
            aria-labelledby="citas-pendientes-tab">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Juan Pérez</td>
                  <td>10:00 AM</td>
                  <td>Pendiente</td>
                </tr>
                <tr>
                  <td>Ana Gómez</td>
                  <td>11:30 AM</td>
                  <td>Pendiente</td>
                </tr>
                <tr>
                  <td>Carlos López</td>
                  <td>1:00 PM</td>
                  <td>Pendiente</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tab-pane fade" id="tab-encuestas" role="tabpanel" aria-labelledby="encuestas-tab">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Encuesta</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Encuesta de Satisfacción</td>
                  <td>Completada</td>
                </tr>
                <tr>
                  <td>Encuesta de Servicio</td>
                  <td>Pendiente</td>
                </tr>
                <tr>
                  <td>Encuesta de Calidad</td>
                  <td>Completada</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tab-pane fade" id="tab-estadistica-encuesta" role="tabpanel"
            aria-labelledby="estadistica-encuesta-tab">
            <p>Pronto podrás ver estadísticas detalladas aquí.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</div>
<?php include "../footer.php"; ?>
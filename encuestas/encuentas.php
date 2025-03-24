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
        <li class="breadcrumb-item"><a href="homeMarketing">Marketing</a></li>
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
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="configuracion-tab" data-bs-toggle="tab" href="#tab-configuracion" role="tab"
              aria-controls="tab-configuracion" aria-selected="false">
              <i class="fas fa-cog"></i> Configuración
            </a>
          </li>
        </ul>

        <div class="tab-content mt-3" id="myTabContent">
          <!-- Tab Citas sin Encuesta -->
          <div class="tab-pane fade show active" id="tab-citas-pendientes" role="tabpanel"
            aria-labelledby="citas-pendientes-tab">
            <?php include './tabs/tab_pendingSurveys.php'; ?>
          </div>

          <!-- Tab Listado de Encuestas -->
          <div class="tab-pane fade" id="tab-encuestas" role="tabpanel" aria-labelledby="encuestas-tab">
            <?php include './tabs/tab_listSurveys.php'; ?>
          </div>

          <!-- Tab Estadísticas -->
          <div class="tab-pane fade" id="tab-estadistica-encuesta" role="tabpanel"
            aria-labelledby="estadistica-encuesta-tab">
            <?php include './tabs/tab_stadisticSurveys.php'; ?>
            <!-- Aquí puedes agregar un gráfico con Chart.js o cualquier otra librería -->
          </div>

          <!-- Tab Configuración -->
          <div class="tab-pane fade" id="tab-configuracion" role="tabpanel" aria-labelledby="configuracion-tab">
            <?php include './tabs/tab_configSurvey.php'; ?>
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

<!-- JS -->
<script>
  document.addEventListener("DOMContentLoaded", function () {
    new List("citasTable", {
      valueNames: ["paciente", "hora", "estado"],
      page: 5,
      pagination: true
    });

    new List("encuestasTable", {
      valueNames: ["paciente", "fecha", "motivo", "calificacion", "comentario"],
      page: 5,
      pagination: true
    });
  });
</script>
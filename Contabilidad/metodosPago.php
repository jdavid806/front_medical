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
        <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
        <li class="breadcrumb-item"><a href="configContabilidad">Configuración Contable</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Métodos de Pago</li>
      </ol>
    </nav>
    <div class="pb-9">
      <div class="row">
        <div class="col-12">
          <div class="col-10">
            <div class="d-flex justify-content-between col-12 row col-md-auto"
              id="scrollspyFacturacionVentas">
              <div class="col-6">
                <h2 class="mb-4">Configuración</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0 g-md-4 g-xl-6">

        <div class="tab-content mt-3" id="myTabContent">
          <div class="tab-pane fade show active" id="tab-metodos-pago" role="tabpanel" aria-labelledby="metodos-pago-tab">
          <?php 
          include "../Configuracion/tabs/tab_paymentMethodsConfiguration.php";
          ?>
          </div>
          <div class="tab-pane fade" id="tab-impuesto-cargo" role="tabpanel"
            aria-labelledby="impuesto-cargo-tab"></div>
          <div class="tab-pane fade" id="tab-impuesto-retencion" role="tabpanel"
            aria-labelledby="impuesto-retencion-tab"></div>
          <div class="tab-pane fade" id="tab-centro-costos" role="tabpanel"
            aria-labelledby="centro-costos-tab"></div>
          <div class="tab-pane fade" id="tab-dgii" role="tabpanel" aria-labelledby="dgii-tab">
            <?php //include "./tabs/tab_dgii.php"; 
            ?>
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

<style>
  .custom-th {
    padding: 0.25rem;
    height: 40px;
    font-size: 16px;
  }
  .custom-td {
    padding: 0.25rem;
    height: 40px;
    font-size: 16px;
  }
</style>

<?php
include "../Configuracion/modales/ModalAgregarMetodoPago.php";
include "../Configuracion/modales/modalAgregarImpuestoPago.php";
include "../Configuracion/modales/modalAgregarRetencion.php";
include "../Configuracion/modales/modalAgregarCentroCosto.php";
?>
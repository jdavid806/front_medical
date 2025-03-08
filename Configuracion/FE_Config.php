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
        <li class="breadcrumb-item active" onclick="location.reload()">Configuración</li>
      </ol>
    </nav>
    <div class="pb-9">
      <div class="row">
        <div class="col-12">
          <div class="col-10">
            <div class="d-flex justify-content-between col-12 row col-md-auto" id="scrollspyFacturacionVentas">
              <div class="col-6">
                <h2 class="mb-4">Configuración</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0 g-md-4 g-xl-6">
        <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="info-facturacion-tab" data-bs-toggle="tab" href="#tab-config-empresa"
              role="tab" aria-controls="tab-info-facturacion" aria-selected="false">
              <i class="fas fa-building"></i> Configuración Empresa
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="entidades-tab" data-bs-toggle="tab" href="#tab-entidades" role="tab"
              aria-controls="tab-entidades" aria-selected="true">
              <i class="fas fa-sitemap"></i> Entidades
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="metodos-pago-tab" data-bs-toggle="tab" href="#tab-metodos-pago" role="tab"
              aria-controls="tab-metodos-pago" aria-selected="false">
              <i class="fas fa-credit-card"></i> Métodos de Pago
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="impuesto-cargo-tab" data-bs-toggle="tab" href="#tab-impuesto-cargo" role="tab"
              aria-controls="tab-impuesto-cargo" aria-selected="false">
              <i class="fas fa-percentage"></i> Impuesto Cargo
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="impuesto-retencion-tab" data-bs-toggle="tab" href="#tab-impuesto-retencion"
              role="tab" aria-controls="tab-impuesto-retencion" aria-selected="false">
              <i class="fas fa-hand-holding-usd"></i> Impuesto Retención
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="centro-costos-tab" data-bs-toggle="tab" href="#tab-centro-costos" role="tab"
              aria-controls="tab-centro-costos" aria-selected="false">
              <i class="fas fa-chart-pie"></i> Centro de Costos
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="usuarios-tab" data-bs-toggle="tab" href="#tab-usuarios" role="tab"
              aria-controls="tab-usuarios" aria-selected="false">
              <i class="fas fa-users"></i> Usuarios
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="especialidades-tab" data-bs-toggle="tab" href="#tab-especialidades" role="tab"
              aria-controls="tab-especialidades" aria-selected="false">
              <i class="fas fa-stethoscope"></i> Especialidades Médicas
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="roles-tab" data-bs-toggle="tab" href="#tab-roles" role="tab"
              aria-controls="tab-roles" aria-selected="false">
              <i class="fas fa-user-tag"></i> Roles de Usuario
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="horarios-tab" data-bs-toggle="tab" href="#tab-horarios" role="tab"
              aria-controls="tab-horarios" aria-selected="false">
              <i class="fas fa-calendar-alt"></i> Horarios de Atención
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="precios-tab" data-bs-toggle="tab" href="#tab-precios" role="tab"
              aria-controls="tab-precios" aria-selected="false">
              <i class="fas fa-dollar-sign"></i> Precios
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="consentimientos-tab" data-bs-toggle="tab" href="#tab-consentimientos" role="tab"
              aria-controls="tab-consentimientos" aria-selected="false">
              <i class="fas fa-file-contract"></i> Consentimientos
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="importar-datos-tab" data-bs-toggle="tab" href="#tab-importar-datos" role="tab"
              aria-controls="tab-importar-datos" aria-selected="false">
              <i class="fas fa-file-import"></i> Importar Datos
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="plantillas-mensajes-tab" data-bs-toggle="tab" href="#tab-plantillas-mensajes"
              role="tab" aria-controls="tab-plantillas-mensajes" aria-selected="false">
              <i class="fas fa-envelope"></i> Plantillas Mensajes
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="examenes-tab" data-bs-toggle="tab" href="#tab-examenes" role="tab"
              aria-controls="tab-examenes" aria-selected="false">
              <i class="fas fa-microscope"></i> Exámenes
            </a>
          </li>
        </ul>

        <div class="tab-content mt-3" id="myTabContent">
          <div class="tab-pane fade show active" id="tab-config-empresa" role="tabpanel"
            aria-labelledby="info-facturacion-tab">
            <?php include "./tabs/tab_tenantConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-entidades" role="tabpanel" aria-labelledby="entidades-tab">
            <?php include "./tabs/tab_entitiesConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-metodos-pago" role="tabpanel" aria-labelledby="metodos-pago-tab">
            <?php include "./tabs/tab_paymentMethodsConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-impuesto-cargo" role="tabpanel" aria-labelledby="impuesto-cargo-tab">
            <?php include "./tabs/tab_taxesConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-impuesto-retencion" role="tabpanel"
            aria-labelledby="impuesto-retencion-tab">
            <?php include "./tabs/tab_retentiosConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-centro-costos" role="tabpanel" aria-labelledby="centro-costos-tab">
            <?php include "./tabs/tab_costCentersConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-usuarios" role="tabpanel" aria-labelledby="usuarios-tab">
            <?php include "./includes/usuarios.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-especialidades" role="tabpanel" aria-labelledby="especialidades-tab">
            <?php include "./tabs/tab_specialitiesConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-roles" role="tabpanel" aria-labelledby="roles-tab">
            <?php include "./tabs/tab_rolesConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-horarios" role="tabpanel" aria-labelledby="horarios-tab">
            <?php //esto esta generando error en consola
            include "./includes/userAvailabilities.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-precios" role="tabpanel" aria-labelledby="precios-tab">
            <?php include "./tabs/tab_pricesConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-consentimientos" role="tabpanel" aria-labelledby="consentimientos-tab">
            <?php include "./tabs/tab_consentTemplatesConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-importar-datos" role="tabpanel" aria-labelledby="importar-datos-tab">
            <?php include "./tabs/tab_importDataConfigruation.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-plantillas-mensajes" role="tabpanel"
            aria-labelledby="plantillas-mensajes-tab">
            <?php include "./tabs/tab_templatesMessagesConfiguration.php"; ?>
          </div>
          <div class="tab-pane fade" id="tab-examenes" role="tabpanel" aria-labelledby="examenes-tab">
            <?php include "./tabs/tab_examsConfiguration.php"; ?>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>

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
include "./modales/modalAgregarSede.php";
include "./modales/modalAgregarEntidad.php";
include "./modales/ModalAgregarMetodoPago.php";
include "./modales/modalAgregarImpuestoPago.php";
include "./modales/modalAgregarRetencion.php";
include "./modales/modalAgregarCentroCosto.php";
include "./modales/modalAgregarRoles.php";
include "./ModalUserRole.php";
include "./modales/modalAgregarPlantillaConsentimiento.php";
include "./ModalPrice.php";
?>
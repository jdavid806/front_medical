<?php


include "../menu.php";
include "../header.php";
include "../data/mocks.php";
include "../data/consts.php";
include "../Consultas/modals/ModalEditBranch.php";
include "../Consultas/modals/ModalNewBranch.php";
include "./includes/modals/ModalEditConsent.php";
$dropdownNew = '<div class="dropdown">
                  <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-plus"></i> &nbsp; Nuevo
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEntidad">Entidad</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoProcedimiento">Procedimiento</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoVendedor">Vendedor</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoImpuesto">Impuesto Cargo</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoMetodoPago">Metodo de Pago</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoImpuestoRetencion">Impuesto Retencion</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addCostsCenter">Centro de Costo</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createDoctor">Usuario</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalUserSpecialty">Especialidad médica</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalUserRole">Rol de usuario</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalCreateUserOpeningHour">Horario de atención</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalPrice">Precio</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalConsent">Consentimientos</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#newMessage">Mensajería masiva</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalBasicTemplate">Plantilla</a></li>
                  </ul>
                </div>';

//<li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoCentroCosto">Centro de costo</a></li>

// include "./IncludeDatosTarifas.php";
// include "./IncludeDatosProcedimientos.php";
include "./funcionesJsGenerales.php";


include "./datosFEConfig.php";


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
<style>
  .overflow-scroll-container {
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }

  /* Opcional: Esconder la barra de scroll en algunos navegadores */
  .overflow-scroll-container::-webkit-scrollbar {
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
            <div class="col-12 row col-md-auto">
              <div class="col-6">
                <h2 class="mb-4">Configuración</h2>
              </div>
              <div class="col-6 text-end" style="z-index: 999999999999999999999999999999999999999999999999999999999">

              </div>
            </div>
            <div class="col-12 col-md-auto">
              <div class="d-flex">
                <div class="flex-1 d-md-none">
                  <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2" data-phoenix-toggle="offcanvas"
                    data-phoenix-target="#productFilterColumn"><span class="fa-solid fa-bars"></span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0 g-md-4 g-xl-6">

        <div class="col-md-12 col-lg-12 col-xl-12">
          <div class="lead-details-container">
            <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy" id="navbar-deals-detail">
              <ul class="nav nav-underline fs-9">
                <li class="cursor-pointer nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab"
                    aria-selected="true" onclick="showSections('content-facturas-entidades')"><i
                      class="fas fa-building"></i> Entidades</a></li>
                <!-- <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-facturas-procedimientos')"><i class="fas fa-procedures"></i> Procedimientos</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-facturas-vendedores')"><i class="fas fa-user-tie"></i> Vendedores</a></li> -->
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('content-info-metodospago')"><i
                      class="fas fa-credit-card"></i> Métodos de Pago</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('content-facturas-impuestoc')"><i
                      class="fas fa-coins"></i> Impuesto Cargo</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('content-facturas-impuesto_r')"><i
                      class="fas fa-receipt"></i> Impuesto Retención</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('content-centro-costos')"><i
                      class="fas fa-chart-pie"></i> Centro de Costos</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('content-info-facturacion')"><i
                      class="fas fa-file-invoice-dollar"></i> Información de Facturación</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('content-info-doctores')"><i class="fas fa-user"></i>
                    Usuarios</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('user-specialties')"><i class="fas fa-stethoscope"></i>
                    Especialidades Médicas</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('user-roles')"><i class="fas fa-users-cog"></i> Roles de
                    Usuario</a></li>
                <!-- <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('access-permissions-roles')"><i class="fas fa-lock"></i> Menús | Roles</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('access-permissions-specialties')"><i class="fas fa-user-shield"></i> Menús | Especialidades</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('user-permissions')"><i class="fas fa-key"></i> Permisos</a></li> -->
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('user-service-hours')"><i class="fas fa-clock"></i>
                    Horarios de Atención</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('prices')"><i class="fas fa-tag"></i> Precios</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('consents')"><i class="fas fa-file-signature"></i>
                    Consentimientos</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('basic-templates')"><i
                      class="fas fa-file-signature"></i> Plantillas</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('import-data')"><i class="fas fa-file-signature"></i>
                    Importar datos</a></li>
                <li class="cursor-pointer nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab"
                    aria-selected="false" onclick="showSections('import-message')"><i
                      class="fas fa-envelope-open-text"></i> Plantillas Mensajes</a></li>
              </ul>
            </nav>
            <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0"
              data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true"
              tabindex="0">

              <div class="mb-8" id="content-facturas-entidades">
                <!-- Facturacion Ventas -->
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Entidades</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <!-- =========== TABLE ========== -->
                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">



                      <!-- <h4 class="card-title mb-4"></h4> -->
                      <div class="row gx-3">
                        <div class="col-12">
                          <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                              <tr>
                                <th>NIT</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Actividad Economica</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <?php
                              foreach ($dataEmpresas as $index => $empresa) {
                                $procedimientosEmpresa = $ControllerProcedimientosEntidad->obtenerPorEntidad($empresa['id']);
                                // var_dump($procedimientosEmpresa);
                                $datosTarifas = [];
                                foreach ($procedimientosEmpresa as $procedimiento) {
                                  $add = [
                                    "id" => $procedimiento["idProcedimiento"],
                                    "precio" => $procedimiento["precio"],
                                    "valorEntidad" => $procedimiento["valorEntidad"],
                                    "porcentajeCopago" => $procedimiento["porcentajeCopago"],
                                    "aplicaCopago" => $procedimiento["aplicaCopago"],
                                    "copagoDescuenta" => $procedimiento["copagoDescuenta"],
                                    "codigo_cups" => $ControllerProcedimientos->obtenerPorId($procedimiento["idProcedimiento"])["codigo_cups"],
                                    "nombreProcedimiento" => $ControllerProcedimientos->obtenerPorId($procedimiento["idProcedimiento"])["nombreProcedimiento"],
                                  ];

                                  array_push($datosTarifas, $add);
                                }

                                // $datosTarifas = $empresa['dataProcedimientos'];
                                $datosJson = [
                                  'procedimientosData' => $datosTarifas,
                                  "nit" => $empresa['nit'],
                                  "nombreEntidad" => reem_alreves($empresa['nombreEntidad']),
                                  "dv" => $empresa["dv"],
                                  "emailFE" => $empresa["emailFE"],
                                  "direccion" => reem_alreves($empresa["direccion"]),
                                  "telefono" => $empresa["telefono"],
                                  "celular" => $empresa["celular"],
                                  "actividadEconomica" => $empresa["actividadEconomica"],
                                  "tipoPersona" => $empresa["tipoPersona"],
                                  "ciudad" => reem_alreves($empresa["ciudad"])
                                ];

                                $datosJson = json_encode($datosJson);

                                ?>
                                <tr id="row-<?= $empresa['id'] ?>">
                                  <input type="hidden" id="data_empresa_<?= $empresa['id'] ?>"
                                    value="<?= htmlspecialchars($datosJson, ENT_QUOTES) ?>">
                                  <td class="align-middle ps-3 number"><?= htmlspecialchars($empresa['nit']) ?></td>
                                  <td class="align-middle ps-3 number"><?= $empresa['nombreEntidad'] ?></td>
                                  <td class="align-middle user"><?= $empresa['emailFE'] ?></td>
                                  <td class="align-middle user">
                                    <?= $ControllerActividadesE->obtenerPorId($empresa['actividadEconomica'])["descripcion"] ?>
                                  </td>
                                  <td class="text-end align-middle">
                                    <div class="dropdown">
                                      <button class="btn btn-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                      </button>
                                      <ul class="dropdown-menu" style="z-index: 10000">
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="editarEntidad( '<?= htmlspecialchars($empresa['nit']) ?>' , '<?= $empresa['id'] ?>')">
                                            <div class=" d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                              <span>Editar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="eliminarEntidad('<?= $empresa['id'] ?>')">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                              <span>Eliminar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $empresa['id']; ?>">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-print" style="width: 20px;"></i>
                                              <span>Imprimir</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $empresa['id']; ?>"
                                            id="generate_consent_pdf">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-download" style="width: 20px;"></i>
                                              <span>Descargar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <hr class="dropdown-divider">
                                        </li>
                                        <li class="dropdown-header">Compartir</li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                              <span>Compartir por Whatsapp</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                              <span>Compartir por Correo</span>
                                            </div>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              <?php } ?>
                            </tbody>
                          </table>



                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <!-- ========= TABLE =========== -->
              </div>


              <div class="mb-8" id="content-facturas-procedimientos">
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyNotaDebito">
                  <div class="col-12 row">
                    <div class="col-6">
                      <h4 class="mb-2" id="scrollspyNotaDebito">Procedimientos</h4>
                    </div>
                    <div class="col-6 text-end">
                      <?= $dropdownNew ?>
                    </div>
                  </div>
                </div>

                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="row gx-3">
                        <div class="col-12">
                          <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                              <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Valor inicial</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <?php
                              foreach ($dataProcedimientos as $dataProcedimiento) {
                                $dataJson = [
                                  "id" => $dataProcedimiento["id"],
                                  "codigo_cups" => $dataProcedimiento["codigo_cups"],
                                  "nombreProcedimiento" => $dataProcedimiento["nombreProcedimiento"],
                                  "precio" => $dataProcedimiento["precio"],
                                ];
                                $dataJson = json_encode($dataJson);

                                ?>
                                <tr id="filaProc<?= intval($dataProcedimiento["id"]) ?>">
                                  <input type="hidden" id="data_procedimiento_<?= intval($dataProcedimiento["id"]) ?>"
                                    value="<?= htmlspecialchars($dataJson, ENT_QUOTES) ?>">
                                  <td class="align-middle ps-3 number"><?= $dataProcedimiento["codigo_cups"] ?></td>
                                  <td class="align-middle ps-3 number"><?= $dataProcedimiento["nombreProcedimiento"] ?>
                                  </td>
                                  <td class="align-middle user"><?= $dataProcedimiento["precio"] ?></td>
                                  <td class="text-end align-middle">
                                    <div class="dropdown">
                                      <button class="btn btn-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                      </button>
                                      <ul class="dropdown-menu" style="z-index: 10000">
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="editarProcedimiento(<?= intval($dataProcedimiento['id']) ?>, <?= intval($dataProcedimiento['id']) ?>)">
                                            <div class=" d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                              <span>Editar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="eliminarProcedimiento(<?= intval($dataProcedimiento['id']) ?>)">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                              <span>Eliminar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $dataProcedimiento['id']; ?>">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-print" style="width: 20px;"></i>
                                              <span>Imprimir</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $dataProcedimiento['id']; ?>"
                                            id="generate_consent_pdf">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-download" style="width: 20px;"></i>
                                              <span>Descargar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <hr class="dropdown-divider">
                                        </li>
                                        <li class="dropdown-header">Compartir</li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                              <span>Compartir por Whatsapp</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                              <span>Compartir por Correo</span>
                                            </div>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              <?php } ?>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div class="mb-8" id="content-info-metodospago">
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyNotaDebito">
                  <div class="col-12 row">
                    <div class="col-6">
                      <h4 class="mb-2" id="scrollspyNotaDebito">Metodos de Pago</h4>
                    </div>
                    <div class="col-6 text-end">
                      <?= $dropdownNew ?>
                    </div>
                  </div>
                </div>

                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="row gx-3">
                        <div class="col-12">
                          <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Cuenta Contable</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <?php
                              foreach ($metodosPago as $metodo) {
                                $dataJson = [
                                  "id" => $metodo["id"],
                                  "codigo_cups" => $metodo["codigo"],
                                  "nombreProcedimiento" => $metodo["nombre"],
                                  "precio" => $metodo["precio"],
                                ];
                                $dataJson = json_encode($metodo);

                                ?>
                                <tr id="rowmp-<?= intval($metodo["id"]) ?>">
                                  <input type="hidden" id="data_metodopago_<?= intval($metodo["id"]) ?>"
                                    value="<?= htmlspecialchars($dataJson, ENT_QUOTES) ?>">
                                  <td class="align-middle ps-3 number"><?= $metodo["id"] ?></td>
                                  <td class="align-middle ps-3 number"><?= $metodo["nombre"] ?></td>
                                  <td class="align-middle user">
                                    <?= $cuentasContables[$metodo["cuentaContable"]]["nombre"] ?>
                                  </td>
                                  <td class="text-end align-middle">
                                    <div class="dropdown">
                                      <button class="btn btn-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                      </button>
                                      <ul class="dropdown-menu" style="z-index: 10000">
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="editarMetodoPago(<?= intval($metodo['id']) ?>, <?= intval($metodo['id']) ?>)">
                                            <div class=" d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                              <span>Editar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="eliminarMetodoPago(<?= intval($metodo['id']) ?>)">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                              <span>Eliminar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $metodo['id']; ?>">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-print" style="width: 20px;"></i>
                                              <span>Imprimir</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $metodo['id']; ?>"
                                            id="generate_consent_pdf">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-download" style="width: 20px;"></i>
                                              <span>Descargar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <hr class="dropdown-divider">
                                        </li>
                                        <li class="dropdown-header">Compartir</li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                              <span>Compartir por Whatsapp</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                              <span>Compartir por Correo</span>
                                            </div>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              <?php } ?>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div class="mb-8" id="content-facturas-centroscosto">
                <!-- Facturacion Ventas -->
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Centros de Costo</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <!-- =========== TABLE ========== -->
                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="row gx-3">
                        <div class="col-12">

                          <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                              <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <?php
                              foreach ($centrosCostos as $index => $centroCosto) {
                                $datosJson = [
                                  "codigo" => $centroCosto['codigo'],
                                  "nombre" => $centroCosto['nombre'],
                                  // Puedes agregar más datos si es necesario
                                ];

                                $datosJson = json_encode($datosJson);
                                ?>
                                <tr id="rowcc-<?= $index ?>">
                                  <input type="hidden" id="data_centro_costo_<?= $index ?>"
                                    value="<?= htmlspecialchars($datosJson, ENT_QUOTES) ?>">
                                  <td class="align-middle ps-3 number"><?= htmlspecialchars($centroCosto['codigo']) ?>
                                  </td>
                                  <td class="align-middle ps-3"><?= htmlspecialchars($centroCosto['nombre']) ?></td>
                                  <td class="text-end align-middle">
                                    <div class="dropdown">
                                      <button class="btn btn-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                      </button>
                                      <ul class="dropdown-menu" style="z-index: 10000">
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="editarCentroCosto('<?= htmlspecialchars($centroCosto['codigo']) ?>', '<?= $index ?>')">
                                            <div class=" d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                              <span>Editar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="eliminarCentroCosto('<?= $index ?>')">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                              <span>Eliminar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $centroCosto['id']; ?>">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-print" style="width: 20px;"></i>
                                              <span>Imprimir</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $centroCosto['id']; ?>"
                                            id="generate_consent_pdf">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-download" style="width: 20px;"></i>
                                              <span>Descargar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <hr class="dropdown-divider">
                                        </li>
                                        <li class="dropdown-header">Compartir</li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                              <span>Compartir por Whatsapp</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                              <span>Compartir por Correo</span>
                                            </div>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              <?php } ?>
                            </tbody>
                          </table>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-8" id="content-facturas-vendedores">
                <!-- Facturacion Ventas -->
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Vendedores</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <!-- =========== TABLE ========== -->
                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="row gx-3">
                        <div class="col-12">

                          <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <?php foreach ($dataVendedores as $index => $vendedor) { ?>
                                <tr id="rowvendedor-<?= $vendedor["id"] ?>">
                                  <input type="hidden" id="data_vendedor_<?= $vendedor["id"] ?>"
                                    value='<?= htmlspecialchars(json_encode($vendedor), ENT_QUOTES) ?>'>
                                  <td class="align-middle"><?= htmlspecialchars($vendedor['id']) ?></td>
                                  <td class="align-middle"><?= htmlspecialchars($vendedor['nombre']) ?></td>
                                  <td class="text-end align-middle">
                                    <div class="dropdown">
                                      <button class="btn btn-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                      </button>
                                      <ul class="dropdown-menu" style="z-index: 10000">
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="editarVendedor('<?= htmlspecialchars($vendedor['id']) ?>', '<?= $vendedor['id'] ?>')">
                                            <div class=" d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                              <span>Editar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="eliminarVendedor('<?= $vendedor['id'] ?>')">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                              <span>Eliminar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $vendedor['id']; ?>">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-print" style="width: 20px;"></i>
                                              <span>Imprimir</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $vendedor['id']; ?>"
                                            id="generate_consent_pdf">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-download" style="width: 20px;"></i>
                                              <span>Descargar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <hr class="dropdown-divider">
                                        </li>
                                        <li class="dropdown-header">Compartir</li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                              <span>Compartir por Whatsapp</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                              <span>Compartir por Correo</span>
                                            </div>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              <?php } ?>
                            </tbody>
                          </table>


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-8" id="content-facturas-impuestoc">
                <!-- Facturacion Ventas -->
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Impuestos Cargo</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <!-- =========== TABLE ========== -->
                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="row gx-3">
                        <div class="col-12">

                          <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Tasa Impuesto</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <?php foreach ($dataJsonImpuestoCargo as $index => $impuesto) { ?>
                                <tr id="rowic-<?= $impuesto['id'] ?>">
                                  <input type="hidden" id="data_impuesto_<?= $impuesto['id'] ?>"
                                    value='<?= htmlspecialchars(json_encode($impuesto), ENT_QUOTES) ?>'>
                                  <td class="align-middle"><?= $impuesto['id'] ?></td>
                                  <td class="align-middle"><?= $impuesto['nombre'] ?></td>
                                  <td class="align-middle"><?= $impuesto['tasaImpuesto'] . "%" ?></td>
                                  <td class="text-end align-middle">
                                    <div class="dropdown">
                                      <button class="btn btn-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                      </button>
                                      <ul class="dropdown-menu" style="z-index: 10000">
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="editarImpuesto('<?= htmlspecialchars($impuesto['id']) ?>', '<?= $impuesto['id'] ?>')">
                                            <div class=" d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                              <span>Editar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="eliminarImpuesto('<?= $impuesto['id'] ?>')">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                              <span>Eliminar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $impuesto['id']; ?>">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-print" style="width: 20px;"></i>
                                              <span>Imprimir</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $impuesto['id']; ?>"
                                            id="generate_consent_pdf">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-download" style="width: 20px;"></i>
                                              <span>Descargar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <hr class="dropdown-divider">
                                        </li>
                                        <li class="dropdown-header">Compartir</li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                              <span>Compartir por Whatsapp</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                              <span>Compartir por Correo</span>
                                            </div>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              <?php } ?>
                            </tbody>
                          </table>



                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-8" id="content-facturas-impuesto_r">
                <!-- Facturacion Ventas -->
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Impuestos Retencion</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <!-- =========== TABLE ========== -->
                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="row gx-3">
                        <div class="col-12">

                          <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Porcentaje</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              <?php foreach ($dataJsonImpuestoRetencion as $index => $impuesto) { ?>
                                <tr id="rowret-<?= $impuesto['id'] ?>">
                                  <input type="hidden" id="data_impuesto_retencion_<?= $impuesto['id'] ?>"
                                    value='<?= htmlspecialchars(json_encode($impuesto), ENT_QUOTES) ?>'>
                                  <td class="align-middle"><?= htmlspecialchars($impuesto['id']) ?></td>
                                  <td class="align-middle"><?= htmlspecialchars($impuesto['nombre']) ?></td>
                                  <td class="align-middle"><?= htmlspecialchars($impuesto['tasaRetencion']) . "%" ?></td>
                                  <td class="text-end align-middle">
                                    <div class="dropdown">
                                      <button class="btn btn-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                      </button>
                                      <ul class="dropdown-menu" style="z-index: 10000">
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="editarImpuestoRetencion('<?= htmlspecialchars($impuesto['id']) ?>', '<?= $impuesto['id'] ?>')">
                                            <div class=" d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                              <span>Editar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#"
                                            onclick="eliminarImpuestoRetencion('<?= $impuesto['id'] ?>')">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                              <span>Eliminar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $impuesto['id']; ?>">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-print" style="width: 20px;"></i>
                                              <span>Imprimir</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#<?= $impuesto['id']; ?>"
                                            id="generate_consent_pdf">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-download" style="width: 20px;"></i>
                                              <span>Descargar</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <hr class="dropdown-divider">
                                        </li>
                                        <li class="dropdown-header">Compartir</li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                              <span>Compartir por Whatsapp</span>
                                            </div>
                                          </a>
                                        </li>
                                        <li>
                                          <a class="dropdown-item" href="#">
                                            <div class="d-flex gap-2 align-items-center">
                                              <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                              <span>Compartir por Correo</span>
                                            </div>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              <?php } ?>
                            </tbody>
                          </table>




                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-8" id="content-centro-costos">
                <!-- Centro de costos -->
                <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Centro de costos</h4>
                  </div>
                  <div class="col-6 text-end mb-2">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <div class="card mb-3">
                  <div class="card-body">
                    <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                      <thead>
                        <tr>
                          <th class="sort border-top custom-th" data-sort="codigo">Código</th>
                          <th class="sort border-top custom-th" data-sort="descripcion">Descripción</th>
                          <th class="sort border-top custom-th" data-sort="subcentro">Subcentro de costos</th>
                          <th class="sort border-top custom-th" data-sort="maneja-presupuesto">Maneja Presupuesto</th>
                          <th class="sort border-top custom-th" data-sort="centro-movimieto">Centro de movimiento</th>
                          <th class="sort border-top custom-th" data-sort="estado">Estado</th>
                          <th class="sort text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                        </tr>
                      </thead>
                      <tbody class="list">
                        <?php
                        $arraytest = [
                          [
                            "Código" => "110505",
                            "Subcentro de costos" => "Si",
                            "Descripción" => "Cuenta Activa",
                            "Maneja Presupuesto" => "No",
                            "Centro de movimiento" => "No",
                            "Estado" => "Activo",
                          ],
                          [
                            "Código" => "2105",
                            "Subcentro de costos" => "No",
                            "Descripción" => "Pasivos",
                            "Maneja Presupuesto" => "Si",
                            "Centro de movimiento" => "No",
                            "Estado" => "Activo",
                          ],
                          [
                            "Código" => "410506",
                            "Subcentro de costos" => "Si",
                            "Descripción" => "Cuenta Corriente",
                            "Maneja Presupuesto" => "No",
                            "Centro de movimiento" => "Si",
                            "Estado" => "Inactivo",
                          ],
                        ];

                        foreach ($datosCentroCosto as $centrocosto) { ?>
                          <tr id="filaCentroCosto<?= $centrocosto["id"] ?>">
                            <input type="hidden" id="data_CentroCosto<?= $centrocosto["id"] ?>"
                              value="<?= htmlspecialchars(json_encode($centrocosto), ENT_QUOTES) ?>">
                            <td class="align-middle custom-td"><?= $centrocosto["codigo"] ?></td>
                            <td class="align-middle custom-td"><?= $centrocosto["descripcion"] ?></td>
                            <td class="align-middle custom-td"><?= $centrocosto["esSubsubcentro"] ?></td>
                            <td class="align-middle custom-td"><?= $centrocosto["manejaPresupuesto"] ?></td>
                            <td class="align-middle custom-td"><?= $centrocosto["centroMovimiento"] ?></td>
                            <td class="align-middle custom-td"><?= $centrocosto["estado"] ?></td>
                            <td class="text-end align-middle">
                              <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i data-feather="settings"></i> Acciones
                                </button>
                                <ul class="dropdown-menu" style="z-index: 10000">
                                  <li>
                                    <a class="dropdown-item" href="#"
                                      onclick="editarCentroCosto('<?= $centrocosto['id'] ?>')">
                                      <div class=" d-flex gap-2 align-items-center">
                                        <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                        <span>Editar</span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#"
                                      onclick="borrarCentroCosto('<?= $centrocosto['id'] ?>')">
                                      <div class="d-flex gap-2 align-items-center">
                                        <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                        <span>Eliminar</span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#<?= $centrocosto['id']; ?>">
                                      <div class="d-flex gap-2 align-items-center">
                                        <i class="fa-solid fa-print" style="width: 20px;"></i>
                                        <span>Imprimir</span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#<?= $centrocosto['id']; ?>" id="generate_consent_pdf">
                                      <div class="d-flex gap-2 align-items-center">
                                        <i class="fa-solid fa-download" style="width: 20px;"></i>
                                        <span>Descargar</span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <hr class="dropdown-divider">
                                  </li>
                                  <li class="dropdown-header">Compartir</li>
                                  <li>
                                    <a class="dropdown-item" href="#">
                                      <div class="d-flex gap-2 align-items-center">
                                        <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                        <span>Compartir por Whatsapp</span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#">
                                      <div class="d-flex gap-2 align-items-center">
                                        <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                        <span>Compartir por Correo</span>
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        <?php } ?>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-8" id="content-info-facturacion">

              <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                <li class="nav-item" role="presentation"><a class="nav-link active" id="home-tab" data-bs-toggle="tab"
                    href="#tab-home" role="tab" aria-controls="tab-home" aria-selected="true">Información Legal</a></li>
                <li class="nav-item" role="presentation"><a class="nav-link" id="profile-tab" data-bs-toggle="tab"
                    href="#tab-profile" role="tab" aria-controls="tab-profile" aria-selected="false"
                    tabindex="-1">Profile</a></li>
                <li class="nav-item" role="presentation"><a class="nav-link" id="contact-tab" data-bs-toggle="tab"
                    href="#tab-contact" role="tab" aria-controls="tab-contact" aria-selected="false"
                    tabindex="-1">Contact</a></li>
              </ul>
              <div class="tab-content mt-3" id="myTabContent">
                <div class="tab-pane fade show active" id="tab-home" role="tabpanel" aria-labelledby="home-tab">

                  <div class="card mb-3">
                    <div class="card-body">
                      <label for="" class="form-label">Tipo de persona</label>
                      <select class="form-select" aria-label="Default select example" id="typePersonSelect">
                        <option selected="">Seleccionar</option>
                        <option value="1">Natural </option>
                        <option value="2">Empresa</option>
                      </select>
                    </div>
                  </div>

                  <div class="card">
                    <div class="card-body">

                      <!-- Información Personal -->

                      <div class="row hidden" id="div-info-personal">
                        <div class="col-12">
                          <form class="row g-3" method="POST" action="{{ route('natural-persons.store') }}"
                            enctype="multipart/form-data">
                            <!-- Sección Información Personal -->
                            <div class="col-12 d-flex justify-content-between align-items-center mb-4">
                              <h5 class="card-title mb-0">Información Personal</h5>
                              <button class="btn btn-primary" type="button" data-bs-toggle="modal"
                                data-bs-target="#newBranchModal">Agregar Sucursal</button>
                            </div>

                            <div class="col-md-6">
                              <label for="document_type" class="form-label">Tipo de Documento</label>
                              <select class="form-select" id="document_type" name="document_type" required>
                                <option value="" disabled selected>Seleccionar</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="DNI">Documento Nacional de Identidad</option>
                              </select>
                            </div>

                            <div class="col-md-6">
                              <label for="document_number" class="form-label">Número de Documento</label>
                              <input type="text" class="form-control" id="document_number" name="document_number"
                                placeholder="Ej: 123456789" required>
                            </div>

                            <div class="col-md-6">
                              <label for="first_name" class="form-label">Nombre</label>
                              <input type="text" class="form-control" id="first_name" name="first_name"
                                placeholder="Ej: Juan" required>
                            </div>

                            <div class="col-md-6">
                              <label for="last_name" class="form-label">Apellido</label>
                              <input type="text" class="form-control" id="last_name" name="last_name"
                                placeholder="Ej: Pérez" required>
                            </div>

                            <!-- Sección Datos del Consultorio -->
                            <div class="col-12 mt-4">
                              <h5 class="card-title mb-3">Datos del Consultorio</h5>
                            </div>

                            <div class="col-md-12">
                              <label for="commercial_name" class="form-label">Nombre Comercial</label>
                              <input type="text" class="form-control" id="commercial_name" name="commercial_name"
                                placeholder="Ej: Consultorio Médico J&P" required>
                            </div>

                            <div class="col-md-4">
                              <label for="email" class="form-label">Correo Electrónico</label>
                              <input type="email" class="form-control" id="email" name="email"
                                placeholder="Ej: contacto@consultorio.com" required>
                            </div>

                            <div class="col-md-4">
                              <label for="whatsapp" class="form-label">WhatsApp</label>
                              <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                                <input type="tel" class="form-control" id="whatsapp" name="whatsapp"
                                  placeholder="Ej: +573001234567" required>
                              </div>
                            </div>

                            <div class="col-md-4">
                              <label for="logo" class="form-label">Logo del Consultorio</label>
                              <input class="form-control" type="file" id="logo" name="logo" accept="image/*">
                            </div>

                            <!-- Sección Ubicación -->
                            <div class="col-12 mt-4">
                              <h5 class="card-title mb-3">Ubicación</h5>
                            </div>

                            <div class="col-md-4">
                              <label for="country_id" class="form-label">País</label>
                              <select class="form-select" id="country_id" name="country_id" required>
                                <option value="" disabled selected>Seleccionar País</option>
                                @foreach($countries as $country)
                                <option value="{{ $country->id }}">{{ $country->name }}</option>
                                @endforeach
                              </select>
                            </div>

                            <div class="col-md-4">
                              <label for="department_id" class="form-label">Departamento</label>
                              <select class="form-select" id="department_id" name="department_id" required>
                                <option value="" disabled selected>Seleccionar Departamento</option>
                              </select>
                            </div>

                            <div class="col-md-4">
                              <label for="city_id" class="form-label">Ciudad</label>
                              <select class="form-select" id="city_id" name="city_id" required>
                                <option value="" disabled selected>Seleccionar Ciudad</option>
                              </select>
                            </div>

                            <div class="col-12">
                              <label for="address" class="form-label">Dirección Completa</label>
                              <input type="text" class="form-control" id="address" name="address"
                                placeholder="Ej: Calle 123 #45-67" required>
                            </div>

                            <!-- Botón de envío -->
                            <div class="col-12 d-flex justify-content-end mt-4">
                              <button type="submit" class="btn btn-primary px-5">
                                <i class="bi bi-save me-2"></i>Guardar Registro
                              </button>
                            </div>
                          </form>
                        </div>


                        <div class="col-12 mt-3">
                          <h5 class="card-title">Sucursales</h5>
                          <table class="table">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Correo electronico</th>
                                <th scope="col">WhatsApp</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th scope="row">1</th>
                                <td>Sucursal 1</td>
                                <td>sucrusal1@test.com</td>
                                <td>312741852</td>
                                <td>
                                  <button class="btn btn-success me-1 mb-1 btn-sm" type="button" data-bs-toggle="modal"
                                    data-bs-target="#editBranchModal"><i class="fas fa-edit"></i></button>
                                  <button class="btn btn-danger  me-1 mb-1 btn-sm" type="button"><i
                                      class="fas fa-trash"></i></button>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                        </div>
                      </div>

                      <!-- Empresa -->

                      <div class="row hidden" id="div-info-empresa">
                        <div class="col-12">
                          <form class="row g-3" method="POST" action="{{ route('companies.store') }}"
                            enctype="multipart/form-data">

                            <!-- Sección Información Empresa -->
                            <div class="col-12 d-flex justify-content-between align-items-center mb-4">
                              <h5 class="card-title mb-0">Información de la Empresa</h5>
                              <button class="btn btn-primary" type="button" data-bs-toggle="modal"
                                data-bs-target="#newBranchModal">Agregar Sucursal</button>
                            </div>

                            <div class="col-md-6">
                              <label for="legal_name" class="form-label">Nombre Legal</label>
                              <input type="text" class="form-control" id="legal_name" name="legal_name"
                                placeholder="Ej: Consultorios Médicos S.A.S." required>
                            </div>

                            <div class="col-md-6">
                              <label for="commercial_name" class="form-label">Nombre Comercial</label>
                              <input type="text" class="form-control" id="commercial_name" name="commercial_name"
                                placeholder="Ej: Centro Médico Integral" required>
                            </div>

                            <div class="col-md-6">
                              <label for="nit" class="form-label">NIT</label>
                              <input type="text" class="form-control" id="nit" name="nit" placeholder="Ej: 901234567-8"
                                required>
                            </div>

                            <!-- Sección Representante Legal -->
                            <div class="col-12 mt-4">
                              <h5 class="card-title mb-3">Representante Legal</h5>
                            </div>

                            <div class="col-md-6">
                              <label for="legal_representative_document_type" class="form-label">Tipo de
                                Documento</label>
                              <select class="form-select" id="legal_representative_document_type"
                                name="legal_representative[document_type]" required>
                                <option value="" disabled selected>Seleccionar</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="DNI">Documento Nacional de Identidad</option>
                              </select>
                            </div>

                            <div class="col-md-6">
                              <label for="legal_representative_document_number" class="form-label">Número de
                                Documento</label>
                              <input type="text" class="form-control" id="legal_representative_document_number"
                                name="legal_representative[document_number]" placeholder="Ej: 123456789" required>
                            </div>

                            <div class="col-md-6">
                              <label for="legal_representative_first_name" class="form-label">Nombre</label>
                              <input type="text" class="form-control" id="legal_representative_first_name"
                                name="legal_representative[first_name]" placeholder="Ej: Carlos" required>
                            </div>

                            <div class="col-md-6">
                              <label for="legal_representative_last_name" class="form-label">Apellido</label>
                              <input type="text" class="form-control" id="legal_representative_last_name"
                                name="legal_representative[last_name]" placeholder="Ej: Martínez" required>
                            </div>

                            <!-- Sección Datos del Consultorio -->
                            <div class="col-12 mt-4">
                              <h5 class="card-title mb-3">Datos del Consultorio</h5>
                            </div>

                            <div class="col-md-4">
                              <label for="email" class="form-label">Correo Electrónico</label>
                              <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                <input type="email" class="form-control" id="email" name="email"
                                  placeholder="Ej: info@empresa.com" required>
                              </div>
                            </div>

                            <div class="col-md-4">
                              <label for="whatsapp" class="form-label">WhatsApp</label>
                              <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                                <input type="tel" class="form-control" id="whatsapp" name="whatsapp"
                                  placeholder="Ej: +573001234567" required>
                              </div>
                            </div>

                            <div class="col-md-4">
                              <label for="logo" class="form-label">Logo de la Empresa</label>
                              <input class="form-control" type="file" id="logo" name="logo" accept="image/*">
                            </div>

                            <!-- Sección Ubicación -->
                            <div class="col-12 mt-4">
                              <h5 class="card-title mb-3">Ubicación</h5>
                            </div>

                            <div class="col-md-4">
                              <label for="country_id" class="form-label">País</label>
                              <select class="form-select" id="country_id" name="country_id" required>
                                <option value="" disabled selected>Seleccionar País</option>
                                @foreach($countries as $country)
                                <option value="{{ $country->id }}">{{ $country->name }}</option>
                                @endforeach
                              </select>
                            </div>

                            <div class="col-md-4">
                              <label for="department_id" class="form-label">Departamento</label>
                              <select class="form-select" id="department_id" name="department_id" required>
                                <option value="" disabled selected>Seleccionar Departamento</option>
                              </select>
                            </div>

                            <div class="col-md-4">
                              <label for="city_id" class="form-label">Ciudad</label>
                              <select class="form-select" id="city_id" name="city_id" required>
                                <option value="" disabled selected>Seleccionar Ciudad</option>
                              </select>
                            </div>

                            <div class="col-12">
                              <label for="address" class="form-label">Dirección Completa</label>
                              <input type="text" class="form-control" id="address" name="address"
                                placeholder="Ej: Avenida Principal #78-90" required>
                            </div>

                            <!-- Botón de envío -->
                            <div class="col-12 d-flex justify-content-end mt-4">
                              <button type="submit" class="btn btn-primary px-5">
                                <i class="bi bi-save me-2"></i>Guardar Empresa
                              </button>
                            </div>
                          </form>
                        </div>

                        <div class="col-12 mt-3">
                          <h5 class="card-title">Sucursales</h5>
                          <table class="table">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Correo electronico</th>
                                <th scope="col">WhatsApp</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th scope="row">1</th>
                                <td>Sucursal 1</td>
                                <td>sucrusal1@test.com</td>
                                <td>312741852</td>
                                <td>
                                  <button class="btn btn-success me-1 mb-1 btn-sm" type="button" data-bs-toggle="modal"
                                    data-bs-target="#editBranchModal"><i class="fas fa-edit"></i></button>
                                  <button class="btn btn-danger  me-1 mb-1 btn-sm" type="button"><i
                                      class="fas fa-trash"></i></button>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                        </div>
                      </div>


                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="tab-profile" role="tabpanel" aria-labelledby="profile-tab">

                  <form class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label" for="inputEmail4">Email</label>
                      <input class="form-control" id="inputEmail4" type="email">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label" for="inputPassword4">Password</label>
                      <input class="form-control" id="inputPassword4" type="password">
                    </div>
                    <div class="col-12">
                      <label class="form-label" for="inputAddress">Address</label>
                      <input class="form-control" id="inputAddress" type="text" placeholder="1234 Main St">
                    </div>
                    <div class="col-12">
                      <label class="form-label" for="inputAddress2">Address 2</label>
                      <input class="form-control" id="inputAddress2" type="text"
                        placeholder="Apartment, studio, or floor">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label" for="inputCity">City</label>
                      <input class="form-control" id="inputCity" type="text">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label" for="inputState">State</label>
                      <select class="form-select" id="inputState">
                        <option>Seleccionar</option>
                        <option>...</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label" for="inputZip">Zip</label>
                      <input class="form-control" id="inputZip" type="text">
                    </div>
                    <div class="col-12">
                      <div class="form-check">
                        <input class="form-check-input" id="gridCheck" type="checkbox">
                        <label class="form-check-label" for="gridCheck">Check me out</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary" type="submit">Sign in</button>
                    </div>
                  </form>

                </div>
                <div class="tab-pane fade" id="tab-contact" role="tabpanel" aria-labelledby="contact-tab">
                  <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                    id="scrollspyFacturacionVentas">
                    <div class="col-6">
                      <h4 class="mb-1" id="scrollspyFacturacionVentas">Información de Facturación</h4>
                    </div>
                  </div>
                  <div class="row gx-3 gy-4 mb-5">
                    <div class="col-12 col-lg-6">
                      <label class="form-label text-body-highlight fs-8 ps-0 text-capitalize lh-sm"
                        for="prefix-dian">Prefijo DIAN</label>
                      <input class="form-control" id="prefix-dian" type="text" placeholder="FEAD" />
                    </div>
                    <div class="col-12 col-lg-6">
                      <label class="form-label text-body-highlight fs-8 ps-0 text-capitalize lh-sm"
                        for="num-desde">Número desde</label>
                      <input class="form-control" id="num-desde" type="text" placeholder="1001" />
                    </div>
                    <div class="col-12 col-lg-6">
                      <label class="form-label text-body-highlight fs-8 ps-0 text-capitalize lh-sm"
                        for="num-hasta">Número hasta</label>
                      <input class="form-control" id="num-hasta" type="text" placeholder="10000" />
                    </div>
                    <div class="col-12 col-lg-6">
                      <div class="row g-2 gy-lg-0">
                        <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Fecha de
                          Resolución</label>
                        <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                      </div>
                    </div>
                    <div class="col-12 col-lg-6">
                      <div class="row g-2 gy-lg-0">
                        <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Resolución
                          expira</label>
                        <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                      </div>
                    </div>
                    <div class="col-12 col-lg-6">
                      <label class="form-label text-body-highlight fs-8 ps-0 text-capitalize lh-sm"
                        for="num-hasta">Resolución de factua Dian número</label>
                      <input class="form-control" id="num-hasta" type="text" placeholder="" />
                    </div>
                  </div>
                  <button class="btn btn-primary me-4" type="button" data-bs-toggle="modal" aria-haspopup="true"
                    aria-expanded="false" data-bs-reference="parent">
                    <i class="fas fa-save me-2"></i> Guardar Cambios
                  </button>
                </div>
              </div>

            </div>



            <div class="mb-8" id="content-info-doctores">
              <?php
              include "./includes/usuarios.php";
              ?>
            </div>

            <div class="mb-8" id="access-permissions-roles">
              <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                id="scrollspyFacturacionVentas">
                <div class="col-6">
                  <h4 class="mb-1" id="scrollspyFacturacionVentas">Menús | Roles</h4>
                </div>
                <div class="col-6 text-end mb-2">
                  <button class="btn btn-primary" type="button">
                    <i class="fas fa-save"></i> &nbsp; Guardar
                  </button>
                </div>
              </div>
              <div class="row gx-3 gy-4 mb-5">
                <div class="card mb-3">
                  <div class="card-body">
                    <div class="d-flex gap-3">
                      <div class="flex-1">
                        <?php
                        $menus = [
                          [
                            "id" => 1,
                            "key" => "dashboard"
                          ],
                          [
                            "id" => 2,
                            "key" => "pacientes"
                          ]
                        ];

                        foreach ($menus as $menu) {
                          ?>
                          <div class="d-flex justify-content-between align-items-center mb-3">
                            <span><?php echo htmlspecialchars($menu['key']) ?></span>
                            <button id="btn-menu-role-<?php echo $menu['id'] ?>" class="btn btn-sm btn-outline-secondary"
                              data-menu-id="<?php echo $menu['id'] ?>" data-label="<?php echo $menu['key'] ?>"
                              onclick="openMenuSettings(`<?php echo htmlspecialchars($menu['id']) ?>`, 'role')">
                              <i class="fas fa-cog"></i>
                            </button>
                          </div>
                          <?php
                        }
                        ?>
                      </div>
                      <div id="role-checkboxes-message" class="flex-1 text-center">
                        Por favor selecciona un menú para configurar los roles permitidos
                      </div>
                      <div id="role-checkboxes-container" class="flex-1 d-none">
                        <h5 class="mb-1"><span id="roleMenuSubtitle"></span> | Roles permitidos</h5>
                        <hr>
                        <?php
                        $roles = [
                          [
                            "id" => 1,
                            "name" => "Administrador",
                          ],
                          [
                            "id" => 2,
                            "name" => "Médico General",
                          ],
                          [
                            "id" => 3,
                            "name" => "Especialista",
                          ],
                          [
                            "id" => 4,
                            "name" => "Recepcionista",
                          ],
                          [
                            "id" => 5,
                            "name" => "Asistente Médico",
                          ],
                          [
                            "id" => 6,
                            "name" => "Enfermero",
                          ],
                          [
                            "id" => 7,
                            "name" => "Técnico de Laboratorio",
                          ],
                          [
                            "id" => 8,
                            "name" => "Farmacéutico",
                          ],
                          [
                            "id" => 9,
                            "name" => "Gerente de Clínica",
                          ],
                          [
                            "id" => 10,
                            "name" => "Personal de Limpieza",
                          ]
                        ];

                        foreach ($roles as $role) {
                          ?>
                          <div class="form-check">
                            <input class="form-check-input role-checkbox" data-role-id="<?php echo $role['id'] ?>"
                              type="checkbox" value="" id="role-checkbox-<?php echo $role['id'] ?>">
                            <label class="form-check-label" for="role-checkbox-<?php echo $role['id'] ?>">
                              <?php echo $role['name'] ?>
                            </label>
                          </div>
                          <?php
                        }
                        ?>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-8" id="access-permissions-specialties">
            <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
              id="scrollspyFacturacionVentas">
              <div class="col-6">
                <h4 class="mb-1" id="scrollspyFacturacionVentas">Menús | Especialidades</h4>
              </div>
              <div class="col-6 text-end mb-2">
                <button class="btn btn-primary" type="button">
                  <i class="fas fa-save"></i> &nbsp; Guardar
                </button>
              </div>
            </div>
            <div class="row gx-3 gy-4 mb-5">
              <div class="card mb-3">
                <div class="card-body">
                  <div class="d-flex gap-3">
                    <div class="flex-1">
                      <?php
                      $menus = [
                        [
                          "id" => 1,
                          "key" => "dashboard"
                        ],
                        [
                          "id" => 2,
                          "key" => "pacientes"
                        ]
                      ];

                      foreach ($menus as $menu) {
                        ?>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <span><?php echo htmlspecialchars($menu['key']) ?></span>
                          <button id="btn-menu-specialty-<?php echo $menu['id'] ?>"
                            class="btn btn-sm btn-outline-secondary" data-menu-id="<?php echo $menu['id'] ?>"
                            data-label="<?php echo $menu['key'] ?>"
                            onclick="openMenuSettings(`<?php echo htmlspecialchars($menu['id']) ?>`, 'specialty')">
                            <i class="fas fa-cog"></i>
                          </button>
                        </div>
                        <?php
                      }
                      ?>
                    </div>
                    <div id="specialty-checkboxes-message" class="flex-1 text-center">
                      Por favor selecciona un menú para configurar las especialidades permitidas
                    </div>
                    <div id="specialty-checkboxes-container" class="flex-1 d-none">
                      <h5 class="mb-1"><span id="specialtyMenuSubtitle"></span> | Especialidades permitidas</h5>
                      <hr>
                      <?php
                      $specialties = [
                        [
                          "id" => 1,
                          "name" => "Cardiología",
                        ],
                        [
                          "id" => 2,
                          "name" => "Dermatología",
                        ],
                        [
                          "id" => 3,
                          "name" => "Pediatría",
                        ],
                        [
                          "id" => 4,
                          "name" => "Ginecología",
                        ],
                        [
                          "id" => 5,
                          "name" => "Neurología",
                        ],
                        [
                          "id" => 6,
                          "name" => "Oftalmología",
                        ],
                        [
                          "id" => 7,
                          "name" => "Oncología",
                        ],
                        [
                          "id" => 8,
                          "name" => "Psiquiatría",
                        ],
                        [
                          "id" => 9,
                          "name" => "Urología",
                        ],
                        [
                          "id" => 10,
                          "name" => "Ortopedia",
                        ]
                      ];

                      foreach ($specialties as $specialty) {
                        ?>
                        <div class="form-check">
                          <input class="form-check-input specialty-checkbox"
                            data-specialty-id="<?php echo $specialty['id'] ?>" type="checkbox" value=""
                            id="specialty-checkbox-<?php echo $specialty['id'] ?>">
                          <label class="form-check-label" for="specialty-checkbox-<?php echo $specialty['id'] ?>">
                            <?php echo $specialty['name'] ?>
                          </label>
                        </div>
                        <?php
                      }
                      ?>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="mb-8" id="user-service-hours">
          <?php
          include "./includes/userAvailabilities.php";
          ?>
        </div>

        <div class="mb-8" id="user-roles">
          <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
            id="scrollspyFacturacionVentas">
            <div class="col-6">
              <h4 class="mb-1" id="scrollspyFacturacionVentas">Roles de usuario</h4>
            </div>
            <div class="col-6 text-end mb-2">
              <?= $dropdownNew ?>
            </div>
          </div>
          <div class="row gx-3 gy-4 mb-5">
            <div class="card mb-3">
              <div class="card-body">
                <table class="table table-hover table-sm fs-9 mb-0 tableDataTableSearch">
                  <thead>
                    <tr>
                      <th>Rol</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php
                    foreach ($userRoles as $userRole) {

                      $jsonUserRole = json_encode($userRole);
                      ?>
                      <tr>
                        <input type="hidden" id="data_user_role_<?= intval($userRole["id"]) ?>"
                          value="<?= htmlspecialchars($jsonUserRole, ENT_QUOTES) ?>">
                        <td><?= htmlspecialchars($userRole['name']) ?></td>
                        <td class="text-end align-middle">
                          <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                              aria-expanded="false">
                              <i data-feather="settings"></i> Acciones
                            </button>
                            <ul class="dropdown-menu" style="z-index: 10000">
                              <li>
                                <a class="dropdown-item" href="#"
                                  onclick="editUserRole('<?= htmlspecialchars($userRole['id']) ?>', '<?= $userRole['id'] ?>')">
                                  <div class=" d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                    <span>Editar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#" onclick="deleteUserRole('<?= $userRole['id'] ?>')">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                    <span>Eliminar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $userRole['id']; ?>">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-print" style="width: 20px;"></i>
                                    <span>Imprimir</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $userRole['id']; ?>" id="generate_consent_pdf">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-download" style="width: 20px;"></i>
                                    <span>Descargar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <hr class="dropdown-divider">
                              </li>
                              <li class="dropdown-header">Compartir</li>
                              <li>
                                <a class="dropdown-item" href="#">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                    <span>Compartir por Whatsapp</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                    <span>Compartir por Correo</span>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8" id="user-specialties">
          <?php
          include "./includes/userSpecialties.php";
          ?>
          <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
            id="scrollspyFacturacionVentas">
            <div class="col-6">
              <h4 class="mb-1" id="scrollspyFacturacionVentas">Especialidades médicas</h4>
            </div>
            <div class="col-6 text-end mb-2">
              <?= $dropdownNew ?>
            </div>
          </div>
          <div class="row gx-3 gy-4 mb-5">
            <div class="card mb-3">
              <div class="card-body">
                <table class="table table-hover table-sm fs-9 mb-0 tableDataTableSearch">
                  <thead>
                    <tr>
                      <th>Especialidad</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php
                    foreach ($specialties as $specialty) {

                      $jsonSpecialty = json_encode($specialty);
                      ?>
                      <tr>
                        <input type="hidden" id="data_user_specialty_<?= intval($specialty["id"]) ?>"
                          value="<?= htmlspecialchars($jsonSpecialty, ENT_QUOTES) ?>">
                        <td><?= htmlspecialchars($specialty['name']) ?></td>
                        <td class="text-end align-middle">
                          <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                              aria-expanded="false">
                              <i data-feather="settings"></i> Acciones
                            </button>
                            <ul class="dropdown-menu" style="z-index: 10000">
                              <li>
                                <a class="dropdown-item" href="#"
                                  onclick="editUserSpecialty('<?= htmlspecialchars($specialty['id']) ?>', '<?= $specialty['id'] ?>')">
                                  <div class=" d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                    <span>Editar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#"
                                  onclick="deleteUserSpecialty('<?= $specialty['id'] ?>')">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                    <span>Eliminar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $specialty['id']; ?>">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-print" style="width: 20px;"></i>
                                    <span>Imprimir</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $specialty['id']; ?>" id="generate_consent_pdf">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-download" style="width: 20px;"></i>
                                    <span>Descargar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <hr class="dropdown-divider">
                              </li>
                              <li class="dropdown-header">Compartir</li>
                              <li>
                                <a class="dropdown-item" href="#">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                    <span>Compartir por Whatsapp</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                    <span>Compartir por Correo</span>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8" id="user-permissions">
          <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
            id="scrollspyFacturacionVentas">
            <div class="col-6">
              <h4 class="mb-1" id="scrollspyFacturacionVentas">Permisos</h4>
            </div>
            <div class="col-6 text-end mb-2">
              <button class="btn btn-primary" type="button">
                <i class="fas fa-save"></i> &nbsp; Guardar
              </button>
            </div>
          </div>
          <div class="row gx-3 gy-4 mb-5">
            <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex gap-3">
                  <div class="flex-1">
                    <?php
                    foreach ($permissions as $permission) {
                      ?>
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <span><?php echo htmlspecialchars($permission['description']) ?></span>
                        <button id="btn-menu-permissionRole-<?php echo $permission['id'] ?>"
                          class="btn btn-sm btn-outline-secondary" data-menu-id="<?php echo $permission['id'] ?>"
                          data-label="<?php echo $permission['description'] ?>"
                          onclick="openMenuSettings(`<?php echo htmlspecialchars($permission['id']) ?>`, 'permissionRole')">
                          <i class="fas fa-cog"></i>
                        </button>
                      </div>
                      <?php
                    }
                    ?>
                  </div>
                  <div id="permissionRole-checkboxes-message" class="flex-1 text-center">
                    Por favor selecciona un permiso para configurar los roles permitidos
                  </div>
                  <div id="permissionRole-checkboxes-container" class="flex-1 d-none">
                    <h5 class="mb-1"><span id="permissionRoleMenuSubtitle"></span></h5>
                    <hr>
                    <?php
                    foreach ($userRoles as $userRole) {
                      ?>
                      <div class="form-check">
                        <input class="form-check-input permissionRole-checkbox"
                          data-permissionRole-id="<?php echo $userRole['id'] ?>" type="checkbox" value=""
                          id="permissionRole-checkbox-<?php echo $userRole['id'] ?>">
                        <label class="form-check-label" for="permissionRole-checkbox-<?php echo $userRole['id'] ?>">
                          <?php echo $userRole['name'] ?>
                        </label>
                      </div>
                      <?php
                    }
                    ?>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8" id="prices">

          <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
            <li class="nav-item" role="presentation"><a class="nav-link active" id="home-tab" data-bs-toggle="tab"
                href="#tab-home" role="tab" aria-controls="tab-home" aria-selected="true">Precios</a></li>
            <li class="nav-item" role="presentation"><a class="nav-link" id="profile-tab" data-bs-toggle="tab"
                href="#tab-profile" role="tab" aria-controls="tab-profile" aria-selected="false"
                tabindex="-1">Configuración de precios</a></li>
          </ul>
          <div class="tab-content mt-3" id="myTabContent">
            <div class="tab-pane fade active show" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
              <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
                id="scrollspyFacturacionVentas">
                <div class="col-6">
                  <h4 class="mb-1" id="scrollspyFacturacionVentas">Precios</h4>
                </div>
                <div class="col-6 text-end mb-2">
                  <?= $dropdownNew ?>
                </div>
              </div>
              <div class="row gx-3 gy-4 mb-5">
                <div class="card mb-3">
                  <div class="card-body">
                    <table class="table table-hover table-sm fs-9 mb-0 tableDataTableSearch">
                      <thead>
                        <tr>
                          <th>Tipo de ítem</th>
                          <th width="150">Ítem</th>
                          <th width="200">Precio</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="tab-profile" role="tabpanel" aria-labelledby="profile-tab">

              <div class="container text-center">
                <div class="row row-cols-2 bg-body-highlight">

                  <!-- Contributivo -->
                  <div class="col p-2 border">
                    <div class="card">

                      <div class="card-body">
                        <h5 class="card-title">Contributivo</h5>
                        <!-- Header -->
                        <div class="d-flex align-items-center p-2 bg-light border-bottom">
                          <div class="flex-grow-1 text-start fw-bold" style="width: 100px;">
                            Categoría
                          </div>
                          <div class="flex-grow-1 text-start fw-bold" style="width: 100px;">
                            Cuota Moderadora
                          </div>
                          <div class="flex-grow-1 text-start fw-bold" style="width: 120px;">
                            Copago
                          </div>
                        </div>

                        <!-- Categoría A -->
                        <div class="d-flex align-items-center p-2 border-bottom">
                          <div class="flex-grow-1 text-start" style="width: 100px;">
                            <span class="fw-bold">Categoría A</span>
                          </div>
                          <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 150px;">
                              <span class="input-group-text">$</span>
                              <input type="number" class="form-control" id="moderator_fee1" name="moderator_fee1"
                                value="4500">
                            </div>
                          </div>
                          <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 120px;">
                              <input type="number" class="form-control" value="11">
                              <span class="input-group-text">%</span>
                            </div>
                          </div>
                        </div>

                        <!-- Categoría B -->
                        <div class="d-flex align-items-center p-2 border-bottom">
                          <div class="flex-grow-1 text-start" style="width: 100px;">
                            <span class="fw-bold">Categoría B</span>
                          </div>
                          <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 150px;">
                              <span class="input-group-text">$</span>
                              <input type="number" class="form-control" id="moderator_fee1" name="moderator_fee2"
                                value="11300">
                            </div>
                          </div>
                          <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 120px;">
                              <input type="number" class="form-control" value="17">
                              <span class="input-group-text">%</span>
                            </div>
                          </div>
                        </div>

                        <!-- Categoría C -->
                        <div class="d-flex align-items-center p-2 border-bottom">
                          <div class="flex-grow-1 text-start" style="width: 100px;">
                            <span class="fw-bold">Categoría C</span>
                          </div>
                          <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 150px;">
                              <span class="input-group-text">$</span>
                              <input type="number" class="form-control" id="moderator_fee1" name="moderator_fee3"
                                value="41000">
                            </div>
                          </div>
                          <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 120px;">
                              <input type="number" class="form-control" value="21">
                              <span class="input-group-text">%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card-footer">
                        <!-- Botón de guardado general -->
                        <div class="d-flex justify-content-end mt-3">
                          <button class="btn btn-primary px-4">
                            Guardar Cambios
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>


                  <!-- Subsidiary -->

                  <div class="col p-2 border">
                    <div class="card">

                      <div class="card-body">
                        <h5 class="card-title">Subsidiario</h5>
                        <!-- Header -->
                        <div class="d-flex align-items-center p-2 bg-light border-bottom">
                          <div class="flex-grow-1 text-start fw-bold" style="width: 250px;">
                            Niveles
                          </div>
                          <div class="flex-grow-1 text-start fw-bold" style="width: 150px;">
                            Copago
                          </div>
                        </div>

                        <!-- Nivel 1 -->
                        <div class="d-flex align-items-center p-2 border-bottom">
                          <div class="flex-grow-1 text-start" style="width: 250px;">
                            <span class="fw-bold">Nivel 1</span>
                          </div>
                          <!-- <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 150px;">
                              <input type="number" class="form-control" name="copaymentNivel1" id="copaymentNivel1" value="11">
                              <span class="input-group-text">%</span>
                            </div>
                          </div> -->
                        </div>

                        <!-- Categoría B -->
                        <div class="d-flex align-items-center p-2 border-bottom">
                          <div class="flex-grow-1 text-start" style="width: 250px;">
                            <span class="fw-bold">Nivel 2</span>
                          </div>
                          <div class="flex-grow-1 text-start">
                            <div class="input-group" style="width: 150px;">
                              <input type="number" class="form-control" value="17" name="copaymentNivel2"
                                id="copaymentNivel2">
                              <span class="input-group-text">%</span>
                            </div>
                          </div>
                        </div>



                        <div class="card-footer">
                          <!-- Botón de guardado general -->
                          <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-primary px-4">
                              Guardar Cambios
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div class="mb-8" id="consents">
          <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
            id="scrollspyFacturacionVentas">
            <div class="col-6">
              <h4 class="mb-1" id="scrollspyFacturacionVentas">Consentimientos</h4>
            </div>
            <div class="col-6 text-end mb-2">
              <?= $dropdownNew ?>
            </div>
          </div>
          <div class="row gx-3 gy-4 mb-5">
            <div class="card mb-3">
              <div class="card-body">
                <table class="table table-hover table-sm fs-9 mb-0 tableDataTableSearch">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th width="150">Descripción</th>
                      <th width="15"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php
                    foreach ($consents as $consent) {

                      $jsonConsent = json_encode($consent);
                      ?>
                      <tr>
                        <input type="hidden" id="data_consent_<?= intval($consent["id"]) ?>"
                          value="<?= htmlspecialchars($jsonConsent, ENT_QUOTES) ?>">
                        <td><?= htmlspecialchars($consent['name_']) ?></td>
                        <td><?= htmlspecialchars($consent['description']) ?></td>
                        <td class="text-end align-middle">
                          <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                              aria-expanded="false">
                              <i data-feather="settings"></i> Acciones
                            </button>
                            <ul class="dropdown-menu" style="z-index: 10000">
                              <li>
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#editConsentModal">
                                  <div class=" d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                    <span>Editar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#" data-bs-toggle="modal"
                                  data-bs-target="#modalTemplateConsent">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-newspaper" style="width: 20px;"></i>
                                    <span>Configurar plantilla</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-eye" style="width: 20px;"></i>
                                    <span>Previsualizar plantilla</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#" onclick="deleteConsent('<?= $consent['id'] ?>')">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                    <span>Eliminar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $consent['id']; ?>">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-print" style="width: 20px;"></i>
                                    <span>Imprimir</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $consent['id']; ?>" id="generate_consent_pdf">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-download" style="width: 20px;"></i>
                                    <span>Descargar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <hr class="dropdown-divider">
                              </li>
                              <li class="dropdown-header">Compartir</li>
                              <li>
                                <a class="dropdown-item" href="#">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                    <span>Compartir por Whatsapp</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                    <span>Compartir por Correo</span>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8" id="basic-templates">
          <div class="d-flex justify-content-between align-items-center col-12 row mb-4"
            id="scrollspyFacturacionVentas">
            <div class="col-6">
              <h4 class="mb-1" id="scrollspyFacturacionVentas">Plantillas</h4>
            </div>
            <div class="col-6 text-end mb-2">
              <?= $dropdownNew ?>
            </div>
          </div>
          <div class="row gx-3 gy-4 mb-5">
            <div class="card mb-3">
              <div class="card-body">
                <table class="table table-hover table-sm fs-9 mb-0 tableDataTableSearch">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Contenido</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php
                    foreach ($basicTemplates as $template) {

                      $jsonData = json_encode($template);
                      ?>
                      <tr>
                        <input type="hidden" id="data_basic_template_<?= intval($template["id"]) ?>"
                          value="<?= htmlspecialchars($jsonData, ENT_QUOTES) ?>">
                        <td><?= htmlspecialchars($template['name']) ?></td>
                        <td><?= htmlspecialchars_decode($template['content']) ?></td>
                        <td class="text-end align-middle">
                          <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                              aria-expanded="false">
                              <i data-feather="settings"></i> Acciones
                            </button>
                            <ul class="dropdown-menu" style="z-index: 10000">
                              <li>
                                <a class="dropdown-item" href="#"
                                  onclick="editTemplate('<?= htmlspecialchars($template['id']) ?>', '<?= $template['id'] ?>')">
                                  <div class=" d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                    <span>Editar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#" onclick="deleteTemplate('<?= $template['id'] ?>')">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                    <span>Eliminar</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $template['id']; ?>">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-print" style="width: 20px;"></i>
                                    <span>Imprimir</span>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="#<?= $template['id']; ?>" id="generate_consent_pdf">
                                  <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-download" style="width: 20px;"></i>
                                    <span>Descargar</span>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8" id="import-data">
          <div class="row gx-3 gy-4 mb-5">
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="mb-3">Importar datos</h5>
                <form>
                  <div class="row">
                    <div class="col-12 mb-2">
                      <div class="form-floating">
                        <select class="form-select" id="type" name="type" required>
                          <option value="" disabled selected>Seleccione una opción</option>
                          <option value="pacientes">Pacientes</option>
                        </select>
                        <label for="type">Importar para:</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="mb-3">
                        <label for="formFile" class="form-label">Default file input example</label>
                        <input class="form-control" type="file" id="excelFile" accept=".xlsx, .xls">
                      </div>
                    </div>
                    <div class="col-12">
                      <button type="submit" class="btn btn-primary" onclick="processExcel()">Importar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <?php
        // el content de tiny es asi c:
        // 'content' => '<textarea class="rich-text-editor" id="compartir-content"></textarea>'
        $tabs = [
          'compartir' => [
            'title' => 'Compartir Archivos',
            'content' => '<div class="rich-text-react" id="compartir-content"></div>'
          ],
          'mensaje' => [
            'title' => 'Mensaje',
            'content' => '<div class="rich-text-editor" id="mensaje-content"></div>'
          ],
          'notificacion' => [
            'title' => 'Notificación',
            'content' => '<div class="rich-text-editor" id="notificacion-content"></div>'
          ]
        ];
        ?>

        <div class="mb-8" id="import-message">
          <div class="row gx-3 gy-4 mb-5">
            <div class="card mb-3">
              <div class="d-flex">
                <ul class="nav nav-underline fs-9 flex-column me-3" id="tabs-typeMessages" role="tablist">
                  <?php foreach ($tabs as $key => $tab): ?>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link <?= $key === 'compartir' ? 'active' : '' ?>" id="<?= $key ?>-tab"
                        data-bs-toggle="tab" data-bs-target="#<?= $key ?>-tab-pane" type="button" role="tab"
                        aria-controls="<?= $key ?>-tab-pane"
                        aria-selected="<?= $key === 'compartir' ? 'true' : 'false' ?>">
                        <?= $tab['title'] ?>
                      </button>
                    </li>
                  <?php endforeach; ?>
                </ul>

                <div class="tab-content" id="typeMessages-tabContent">
                  <?php include "./BotonesCopia.php" ?>

                  <?php foreach ($tabs as $key => $tab): ?>
                    <div class="tab-pane fade <?= $key === 'compartir' ? 'show active' : '' ?>" id="<?= $key ?>-tab-pane"
                      role="tabpanel" aria-labelledby="<?= $key ?>-tab" tabindex="1">
                      <div class="card">
                        <div class="row g-0">
                          <div class="col-md-8">
                            <div class="card-body">
                              <h4 class="card-title"><?= $tab['title'] ?></h4>
                              <?= $tab['content'] ?>
                            </div>
                          </div>
                          <div class="col-md-4 pe-3 gap-3 d-flex flex-column align-items-start mt-3">
                            <div class="mb-2">
                              <label class="form-label" for="exampleFormControlInput">Tipo Plantilla </label>
                              <select id="opciones-desplegable-<?= $key ?>" class="form-select"
                                onchange="cambiarContenidoEditor('<?= $key ?>')">
                                <option value="correo">Correo</option>
                                <option value="whatsapp">WhatsApp</option>
                              </select>
                            </div>
                            <div class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" id="adjunto-switch-<?= $key ?>">
                              <label class="form-check-label" for="adjunto-switch-<?= $key ?>">Adjuntar
                                documento</label>
                            </div>

                            <button id="guardar-btn-<?= $key ?>" class="btn btn-success mt-3"
                              onclick="guardarDataPlantilla('<?= $key ?>')">Guardar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>
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
<script>
  function processExcel() {
    const fileInput = document.getElementById('excelFile');

    const outputDiv = document.getElementById('jsonOutput');

    if (!fileInput.files.length) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {
        type: 'array'
      });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
    };

    reader.onerror = function () {
      alert('Error al leer el archivo');
    };

    reader.readAsArrayBuffer(file);
  }
</script>

<script type="module">
  import {
    productService,
  } from './services/api/index.js';

  async function getProducts() {
    try {
      const response = await productService.getAllProducts(); // ya retorna JSON

      let products;
      if (response.data && Array.isArray(response.data)) {
        products = response.data; // Estructura correcta
      } else if (Array.isArray(response)) {
        products = response; // Caso en que los productos están directamente en la respuesta
      } else {
        console.error("Estructura de respuesta desconocida");
      }
      if (Array.isArray(products)) {
        console.log("Es un array de productos"); // Confirma que es un array
        populateProductTable(products);
      } else {
        console.error("No es un array de productos");
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  }

  function populateProductTable(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${product.itemType}</td>
                <td>${product.name}</td>
                <td>${product.sale_price}</td>
                <td></td>
            `;
      tableBody.appendChild(row);
    });
  }

  // Llama a la función para obtener y mostrar los productos al cargar la página
  getProducts();
</script>



<script>
  let menuSelected = {
    role: null,
    specialty: null,
    permissionRole: null
  };
  let formData = {
    role: {},
    specialty: {},
    permissionRole: {}
  };

  function openMenuSettings(menuId, type) {
    const checkboxesMessage = document.getElementById(`${type}-checkboxes-message`);
    const checkboxesContainer = document.getElementById(`${type}-checkboxes-container`);
    const subtitleElement = document.getElementById(`${type}MenuSubtitle`);
    const buttonPrefix = `btn-menu-${type}-`;

    checkboxesMessage.classList.add('d-none');
    checkboxesContainer.classList.remove('d-none');

    if (menuSelected[type]) {
      menuSelected[type].classList.replace('btn-secondary', 'btn-outline-secondary');
    }

    const menuBtn = document.getElementById(`${buttonPrefix}${menuId}`);
    menuBtn.classList.replace('btn-outline-secondary', 'btn-secondary');

    menuSelected[type] = menuBtn;
    subtitleElement.innerHTML = menuBtn.getAttribute('data-label');

    const menuFormData = formData[type][menuId] || [];
    const checkboxes = document.querySelectorAll(`.${type}-checkbox`);

    checkboxes.forEach(checkbox => {
      checkbox.checked = menuFormData.includes(checkbox.getAttribute(`data-${type}-id`));
    });
  }

  function handleCheckboxChange(type, checkbox) {
    if (menuSelected[type]) {
      const menuId = menuSelected[type].getAttribute('data-menu-id');
      if (!formData[type][menuId]) {
        formData[type][menuId] = [];
      }

      const id = checkbox.getAttribute(`data-${type}-id`);
      if (checkbox.checked) {
        if (!formData[type][menuId].includes(id)) {
          formData[type][menuId].push(id);
        }
      } else {
        formData[type][menuId] = formData[type][menuId].filter(item => item !== id);
      }
    }
  }

  function initializeCheckboxListeners(type) {
    document.querySelectorAll(`.${type}-checkbox`).forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        handleCheckboxChange(type, this);
      });
    });
  }

  initializeCheckboxListeners('role');
  initializeCheckboxListeners('specialty');
  initializeCheckboxListeners('permissionRole');

  function showSections(idVisible) {
    let todos = [
      "content-facturas-entidades",
      "content-facturas-procedimientos",
      "content-facturas-centroscosto",
      "content-facturas-vendedores",
      "content-facturas-impuestoc",
      "content-facturas-impuesto_r",
      "content-centro-costos",
      "content-info-facturacion",
      "content-info-doctores",
      "content-info-metodospago",
      "access-permissions-roles",
      "access-permissions-specialties",
      "user-service-hours",
      "user-roles",
      "user-specialties",
      "user-permissions",
      "prices",
      "consents",
      "basic-templates",
      "import-data",
      "import-message"
    ];
    todos.forEach(element => {
      if (element == idVisible) {
        document.getElementById(element).style.display = "block";
      } else {
        document.getElementById(element).style.display = "none";
      }
    });
  }

  showSections("content-facturas-entidades");

  function handleEditModal() {
    // Select all edit buttons with the class 'edit-button'
    const editButtons = document.querySelectorAll('.edit-button');

    // Loop through each button and attach a click event listener
    editButtons.forEach(button => {
      button.addEventListener('click', function () {
        // Retrieve the data attributes from the clicked button
        const codigo = this.getAttribute('data-codigo');
        const descripcion = this.getAttribute('data-descripcion');
        const subcentro = this.getAttribute('data-subcentro');
        const presupuesto = this.getAttribute('data-presupuesto');
        const movimiento = this.getAttribute('data-movimiento');
        const estado = this.getAttribute('data-estado');

        // Populate the modal input fields with the retrieved data
        document.getElementById('descripcion-edit').value = descripcion;
        document.getElementById('subcentro-edit').value = subcentro;
        document.getElementById('presupuesto-edit').value = presupuesto;
        document.getElementById('movimiento-edit').value = movimiento;
        document.getElementById('estado-edit').value = estado;

        // Update the <h3> tag with the código value
        document.getElementById('codigo-header').textContent = `Centro de Costos: ${codigo}`;
      });
    });
  }

  function handleDeleteModal() {
    // Select all delete buttons with the class 'delete-button'
    const deleteButtons = document.querySelectorAll('.delete-button');

    // Loop through each button and attach a click event listener
    deleteButtons.forEach(button => {
      button.addEventListener('click', function () {
        // Retrieve the 'codigo' data attribute from the clicked button
        const codigo = this.getAttribute('data-codigo');

        // Insert the 'codigo' into the modal
        const codigoSpan = document.getElementById('codigo-to-delete');
        codigoSpan.textContent = codigo;

        // Show the delete confirmation modal
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
      });
    });
  }

  // Call the function to initialize the delete modal handling
  document.addEventListener('DOMContentLoaded', handleDeleteModal);

  // Call the function to initialize the modal handling
  document.addEventListener('DOMContentLoaded', handleEditModal);


  document.getElementById('typePersonSelect').addEventListener('change', function () {
    const selectedValue = this.value;
    const divPersonal = document.getElementById('div-info-personal');
    const divEmpresa = document.getElementById('div-info-empresa');

    // Oculta ambos divs
    divPersonal.classList.add('hidden');
    divEmpresa.classList.add('hidden');

    // Muestra el div correspondiente
    if (selectedValue === '1') {
      divPersonal.classList.remove('hidden'); // Muestra el div de persona natural
    } else if (selectedValue === '2') {
      divEmpresa.classList.remove('hidden'); // Muestra el div de empresa
    }
  });

  function updateCities(countryId, cityId) {
    const country = document.getElementById(countryId).value;
    const citySelect = document.getElementById(cityId);

    // Clear previous city options
    citySelect.innerHTML = '<option value="" disabled selected>Selecciona una ciudad</option>';

    const citiesByCountry = {
      argentina: ["Buenos Aires", "Córdoba", "Rosario"],
      bolivia: ["La Paz", "Cochabamba", "Santa Cruz"],
      brazil: ["São Paulo", "Rio de Janeiro", "Brasília"],
      chile: ["Santiago", "Valparaíso", "Concepción"],
      colombia: ["Bogotá", "Medellín", "Cali"],
      "costa-rica": ["San José", "Alajuela", "Cartago"],
      cuba: ["La Habana", "Santiago de Cuba", "Camagüey"],
      "dominican-republic": ["Santo Domingo", "Santiago", "San Pedro de Macorís"],
      ecuador: ["Quito", "Guayaquil", "Cuenca"],
      "el-salvador": ["San Salvador", "Santa Ana", "San Miguel"],
      guatemala: ["Ciudad de Guatemala", "Quetzaltenango", "Escuintla"],
      honduras: ["Tegucigalpa", "San Pedro Sula", "La Ceiba"],
      mexico: ["Ciudad de México", "Guadalajara", "Monterrey"],
      nicaragua: ["Managua", "León", "Granada"],
      panama: ["Ciudad de Panamá", "Colón", "David"],
      paraguay: ["Asunción", "Ciudad del Este", "Encarnación"],
      peru: ["Lima", "Arequipa", "Trujillo"],
      uruguay: ["Montevideo", "Salto", "Paysandú"],
      venezuela: ["Caracas", "Maracaibo", "Valencia"],
      usa: ["New York", "Los Angeles", "Chicago"],
      canada: ["Toronto", "Vancouver", "Montreal"],
    };

    if (country && citiesByCountry[country]) {
      citiesByCountry[country].forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase();
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  }

  function handleEditDoctor() {
    // Select all edit buttons with the class 'edit-button'
    const editButtons = document.querySelectorAll('.edit-button');

    // Loop through each button and attach a click event listener
    editButtons.forEach(button => {
      button.addEventListener('click', function () {
        // Declare variables for data attributes
        const nombre = this.getAttribute('data-nombre');
        const especialidad = this.getAttribute('data-especialidad');
        const genero = this.getAttribute('data-genero');
        const contacto = this.getAttribute('data-contacto');
        const correo = this.getAttribute('data-correo');
        const pais = this.getAttribute('data-pais');
        const ciudad = this.getAttribute('data-ciudad');
        const direccion = this.getAttribute('data-direccion');
        const titulo = this.getAttribute('data-titulo');
        const idiomas = this.getAttribute('data-idiomas');
        const servicios = this.getAttribute('data-servicios');
        const anosExperiencia = this.getAttribute('data-anos-experiencia');
        const numeroLicencia = this.getAttribute('data-numero-licencia');
        const areasLicencia = this.getAttribute('data-areas-licencia');

        // Populate the modal input fields with the retrieved data
        document.getElementById('nombre-edit').value = nombre;
        document.getElementById('especialidad-edit').value = especialidad;
        document.getElementById('genero-edit').value = genero;
        document.getElementById('contacto-edit').value = contacto;
        document.getElementById('correo-edit').value = correo;
        document.getElementById('pais-edit').value = pais;
        document.getElementById('ciudad-edit').value = ciudad;
        document.getElementById('direccion-edit').value = direccion;
        document.getElementById('titulo-edit').value = titulo;
        document.getElementById('idiomas-edit').value = idiomas;
        document.getElementById('servicios-edit').value = servicios;
        document.getElementById('anos-experiencia-edit').value = anosExperiencia;
        document.getElementById('numero-licencia-edit').value = numeroLicencia;
        document.getElementById('areas-licencia-edit').value = areasLicencia;

        // You can update any other elements as needed
        // For example:
        document.getElementById('header-title').textContent = `Editing: ${nombre}`;
      });
    });
  }


  function addToTable(countryId, cityId) {
    const countrySelect = document.getElementById(countryId);
    const citySelect = document.getElementById(cityId);
    const tableBody = document.getElementById('tableBody');

    // Get selected options
    const selectedCountryIndex = countrySelect.selectedIndex;
    const selectedCityIndex = citySelect.selectedIndex;

    // Check if the selections are valid
    if (selectedCountryIndex > 0 && selectedCityIndex > 0) {
      const selectedCountry = countrySelect.options[selectedCountryIndex].text;
      const selectedCity = citySelect.options[selectedCityIndex].text;

      // Check if there are existing rows
      if (tableBody.querySelectorAll('tr').length === 0) {
        // Remove "No hay datos disponibles en la tabla" message
        const noDataMessage = tableBody.querySelector('.no-data-message');
        if (noDataMessage) {
          noDataMessage.remove();
        }
      }

      // Create a new row and add it to the table
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
            <td class="border-top ps-3">${selectedCountry}</td>
            <td class="border-top">${selectedCity}</td>
            <td class="border-top">
                <button class="btn btn-danger btn-sm" onclick="removeRow(this)">Eliminar</button>
            </td>
        `;
      tableBody.appendChild(newRow);

    } else {
      alert('Por favor, selecciona un país y una ciudad antes de agregar.');
    }
  }



  function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
  }
</script>

<script>
  $(document).ready(function () {
    selectToModal("modalEntidad", "select2ModalConfig");
  });

  $(document).ready(function () {
    selectToModal("createDoctor", "selectModalNuevo");
  });
</script>

<script>
  document.getElementById("generate_consent_pdf").addEventListener("click", function () {
    fetch('Configuracion/GeneratePDFConsent.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al generar el PDF');
        }
        return response.blob(); // Convertir la respuesta en un blob
      })
      .then((blob) => {
        // Crear una URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace temporal para descargar el PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Consentimiento.pdf'; // Nombre del archivo para descargar
        document.body.appendChild(link);
        link.click();

        // Eliminar el enlace temporal
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Liberar memoria
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
</script>

<style>
  .custom-th {
    padding: 0.25rem;
    /* Adjust as needed */
    height: 40px;
    /* Set a fixed height if needed */
    font-size: 16px;
  }

  .custom-td {
    padding: 0.25rem;
    /* Adjust as needed */
    height: 40px;
    /* Set a fixed height if needed */
    font-size: 16px;
    /* Change this value to your desired font size */
  }
</style>

<?php
include "./ModalEntidad.php";
include "./ModalProcedimientos.php";
include "./ModalCentrosCosto.php";
include "./ModalVendedores.php";
include "./ModalImpuestoCargo.php";
include "./ModalImpuestoRetencion.php";
include "./ModalMetodoPago.php";
// include "./ModalDoctor.php";
// include "./ModalCreateUserOpeningHour.php";
include "./ModalUserRole.php";
include "./ModalUserSpecialty.php";
include "./ModalPrice.php";
include "./ModalConsent.php";
include "./ModalTemplateConsent.php";
include "./ModalSignature.php";
include "./ModalBasicTemplate.php";
?>
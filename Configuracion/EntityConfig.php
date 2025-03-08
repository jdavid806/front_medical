<div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0" data-bs-target="#navbar-deals-detail"
  data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" tabindex="0">

  <div class="mb-8" id="content-facturas-entidades">
    <!-- Facturacion Ventas -->
    <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
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
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
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
                              <a class="dropdown-item" href="#" onclick="eliminarEntidad('<?= $empresa['id'] ?>')">
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
                              <a class="dropdown-item" href="#<?= $empresa['id']; ?>" id="generate_consent_pdf">
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
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
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
                              <a class="dropdown-item" href="#<?= $dataProcedimiento['id']; ?>" id="generate_consent_pdf">
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
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
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
                              <a class="dropdown-item" href="#<?= $metodo['id']; ?>" id="generate_consent_pdf">
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
    <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
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
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
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
                              <a class="dropdown-item" href="#" onclick="eliminarCentroCosto('<?= $index ?>')">
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
                              <a class="dropdown-item" href="#<?= $centroCosto['id']; ?>" id="generate_consent_pdf">
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
    <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
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
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
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
                              <a class="dropdown-item" href="#" onclick="eliminarVendedor('<?= $vendedor['id'] ?>')">
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
                              <a class="dropdown-item" href="#<?= $vendedor['id']; ?>" id="generate_consent_pdf">
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
    <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
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
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
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
                              <a class="dropdown-item" href="#" onclick="eliminarImpuesto('<?= $impuesto['id'] ?>')">
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
                              <a class="dropdown-item" href="#<?= $impuesto['id']; ?>" id="generate_consent_pdf">
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
    <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
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
                          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
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
                              <a class="dropdown-item" href="#<?= $impuesto['id']; ?>" id="generate_consent_pdf">
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
    <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
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
                        <a class="dropdown-item" href="#" onclick="editarCentroCosto('<?= $centrocosto['id'] ?>')">
                          <div class=" d-flex gap-2 align-items-center">
                            <i class="fa-solid fa-pen" style="width: 20px;"></i>
                            <span>Editar</span>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#" onclick="borrarCentroCosto('<?= $centrocosto['id'] ?>')">
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
<?php
include "../menu.php";
include "../header.php";
?>

<header>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</header>

<div class="content">
  <nav class="mb-3" aria-label="breadcrumb">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item"><a href="#!">Inicio</a></li>
      <!-- <li class="breadcrumb-item"><a href="#!">Facturacion Cliente</a></li> -->
      <li class="breadcrumb-item active">Facturacion Empresa</li>
    </ol>
  </nav>
  <div class="pb-9">
    <div class="row">
      <div class="col-12">
        <div class="row align-items-center justify-content-between g-3 mb-3">
          <div class="col-12 col-md-auto">
            <h2 class="mb-0">Facturacion Empresa</h2>
          </div>
          <div class="col-12 col-md-auto">
            <div class="d-flex">
              <div class="flex-1 d-md-none">
                <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2" data-phoenix-toggle="offcanvas" data-phoenix-target="#productFilterColumn"><span class="fa-solid fa-bars"></span></button>
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
              <li class="nav-item"><a class="nav-link" onclick="showSections('content-facturas-facturas')">Facturacion Ventas</a></li>
              <li class="nav-item"><a class="nav-link" onclick="showSections('content-facturas-compras')">Facturacion Compras</a></li>
              <li class="nav-item"><a class="nav-link" onclick="showSections('content-facturas-ndebito')">Nota débito</a></li>
              <li class="nav-item"><a class="nav-link" onclick="showSections('content-facturas-ncredito')">Nota crédito</a></li>
            </ul>
          </nav>

          <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0" data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" tabindex="0">
            <div class="mb-8" id="content-facturas-facturas">
              <!-- =========== TABLE ========== -->

              <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="section-heading">
                <div class="col-6">
                  <!-- Heading on the left -->
                  <h4 class="mb-0" id="section-heading">Facturacion Ventas</h4>
                  <!-- Button on the right -->
                </div>
                <div class="col-6 text-end">
                  <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-plus"></i> &nbsp; Nuevo
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addDealModal" href="#">Factura</a></li>
                    <li><a class="dropdown-item" href="#">Compra</a></li>
                    <li><a class="dropdown-item" href="#">Documento soporte</a></li>
                  </ul>
                </div>
                <div class="col-3">
                  <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-striped table-sm fs-9 mb-0  tableDataTableSearch">
                  <thead>
                    <tr>
                      <th class="sort border-top border-translucent ps-3" data-sort="number">N° de Factura</th>
                      <th class="sort border-top" data-sort="date">Fecha</th>
                      <th class="sort border-top" data-sort="user">Encargado</th>
                      <th class="sort border-top" data-sort="customer">Cliente</th>
                      <th class="sort border-top" data-sort="id">Identificacion</th>
                      <th class="sort border-top" data-sort="type">Tipo</th>
                      <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody class="list">
                    <?php
                    $arraytest = [
                      [
                        "Nombre" => "Juan Perez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Jhon Gutierrez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Laura Cortes",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                    ];

                    foreach ($arraytest as $value) { ?>
                      <tr>
                        <td class="align-middle ps-3 number"><?= $value["Factura"] ?></td>
                        <td class="align-middle date"><?= date("Y-m-d") ?></td>
                        <td class="align-middle user"><?= $value["Encargado"] ?></td>
                        <td class="align-middle customer"><?= $value["Cliente"] ?></td>
                        <td class="align-middle id"><?= $value["Identificacion"] ?></td>
                        <td class="align-middle type"><?= $value["Tipo"] ?></td>
                        <td class="align-middle white-space-nowrap pe-0 p-3">
                          <button style="margin-right:10px" class="btn btn-sm btn-outline-secondary" type="button">
                            <i class="fas fa-eye"></i> &nbsp; Previsualizar
                          </button>

                          <i style="margin-right:10px; cursor: pointer;" class="fas fa-down-long dropdownIcon" aria-expanded="false"></i>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#">PDF</a></li>
                            <li><a class="dropdown-item" href="#">XML</a></li>
                          </ul>

                          <i class="fas fa-bars"></i>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="mb-8" id="content-facturas-compras">
              <!-- =========== TABLE ========== -->

              <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="section-heading">
                <div class="col-6">
                  <!-- Heading on the left -->
                  <h4 class="mb-0" id="section-heading">Facturacion Compras</h4>
                  <!-- Button on the right -->
                </div>
                <div class="col-6 text-end">
                  <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-plus"></i> &nbsp; Nuevo
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addDealModal" href="#">Factura</a></li>
                    <li><a class="dropdown-item" href="#">Compra</a></li>
                    <li><a class="dropdown-item" href="#">Documento soporte</a></li>
                  </ul>
                </div>
                <div class="col-3">
                  <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-striped table-sm fs-9 mb-0  tableDataTableSearch">
                  <thead>
                    <tr>
                      <th class="sort border-top border-translucent ps-3" data-sort="number">N° de Factura</th>
                      <th class="sort border-top" data-sort="date">Fecha</th>
                      <th class="sort border-top" data-sort="user">Encargado</th>
                      <th class="sort border-top" data-sort="customer">Cliente</th>
                      <th class="sort border-top" data-sort="id">Identificacion</th>
                      <th class="sort border-top" data-sort="type">Tipo</th>
                      <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody class="list">
                    <?php
                    $arraytest = [
                      [
                        "Nombre" => "Juan Perez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Jhon Gutierrez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Laura Cortes",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                    ];

                    foreach ($arraytest as $value) { ?>
                      <tr>
                        <td class="align-middle ps-3 number"><?= $value["Factura"] ?></td>
                        <td class="align-middle date"><?= date("Y-m-d") ?></td>
                        <td class="align-middle user"><?= $value["Encargado"] ?></td>
                        <td class="align-middle customer"><?= $value["Cliente"] ?></td>
                        <td class="align-middle id"><?= $value["Identificacion"] ?></td>
                        <td class="align-middle type"><?= $value["Tipo"] ?></td>
                        <td class="align-middle white-space-nowrap pe-0 p-3">
                          <button style="margin-right:10px" class="btn btn-sm btn-outline-secondary" type="button"> <i class="fas fa-eye"></i> &nbsp; Previsualizar</button>
                          <i style="margin-right:10px" class="fas fa-down-long"></i>
                          <i class="fas fa-bars"></i>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="mb-8" id="content-facturas-ndebito">
              <!-- =========== TABLE ========== -->

              <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="section-heading">
                <div class="col-6">
                  <!-- Heading on the left -->
                  <h4 class="mb-0" id="section-heading">Nota débito</h4>
                  <!-- Button on the right -->
                </div>
                <div class="col-6 text-end">
                  <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#addDealModal" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-plus me-2"></span>Nuevo</button>
                </div>
                <div class="col-3">
                  <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-striped table-sm fs-9 mb-0  tableDataTableSearch">
                  <thead>
                    <tr>
                      <th class="sort border-top border-translucent ps-3" data-sort="number">N° de Factura</th>
                      <th class="sort border-top" data-sort="date">Fecha</th>
                      <th class="sort border-top" data-sort="user">Encargado</th>
                      <th class="sort border-top" data-sort="customer">Cliente</th>
                      <th class="sort border-top" data-sort="id">Identificacion</th>
                      <th class="sort border-top" data-sort="type">Tipo</th>
                      <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody class="list">
                    <?php
                    $arraytest = [
                      [
                        "Nombre" => "Juan Perez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Jhon Gutierrez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Laura Cortes",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                    ];

                    foreach ($arraytest as $value) { ?>
                      <tr>
                        <td class="align-middle ps-3 number"><?= $value["Factura"] ?></td>
                        <td class="align-middle date"><?= date("Y-m-d") ?></td>
                        <td class="align-middle user"><?= $value["Encargado"] ?></td>
                        <td class="align-middle customer"><?= $value["Cliente"] ?></td>
                        <td class="align-middle id"><?= $value["Identificacion"] ?></td>
                        <td class="align-middle type"><?= $value["Tipo"] ?></td>
                        <td class="align-middle white-space-nowrap pe-0 p-3">
                          <button style="margin-right:10px" class="btn btn-sm btn-outline-secondary" type="button"> <i class="fas fa-eye"></i> &nbsp; Previsualizar</button>
                          <i style="margin-right:10px" class="fas fa-down-long"></i>
                          <i class="fas fa-bars"></i>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="mb-8" id="content-facturas-ncredito">
              <!-- =========== TABLE ========== -->

              <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="section-heading">
                <div class="col-6">
                  <!-- Heading on the left -->
                  <h4 class="mb-0" id="section-heading">Nota crédito</h4>
                  <!-- Button on the right -->
                </div>
                <div class="col-6 text-end">
                  <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#addDealModal" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-plus me-2"></span>Nuevo</button>
                </div>
                <div class="col-3">
                  <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-striped table-sm fs-9 mb-0  tableDataTableSearch">
                  <thead>
                    <tr>
                      <th class="sort border-top border-translucent ps-3" data-sort="number">N° de Factura</th>
                      <th class="sort border-top" data-sort="date">Fecha</th>
                      <th class="sort border-top" data-sort="user">Encargado</th>
                      <th class="sort border-top" data-sort="customer">Cliente</th>
                      <th class="sort border-top" data-sort="id">Identificacion</th>
                      <th class="sort border-top" data-sort="type">Tipo</th>
                      <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody class="list">
                    <?php
                    $arraytest = [
                      [
                        "Nombre" => "Juan Perez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Jhon Gutierrez",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                      [
                        "Nombre" => "Laura Cortes",
                        "Factura" => rand(10000, 100000),
                        "Encargado" => "Vendedor #" .  rand(1, 10),
                        "Cliente" => "Comprador #" .  rand(1000, 10000),
                        "Identificacion" => rand(4517000, 45170000),
                        "Tipo" => "Factura",
                      ],
                    ];

                    foreach ($arraytest as $value) { ?>
                      <tr>
                        <td class="align-middle ps-3 number"><?= $value["Factura"] ?></td>
                        <td class="align-middle date"><?= date("Y-m-d") ?></td>
                        <td class="align-middle user"><?= $value["Encargado"] ?></td>
                        <td class="align-middle customer"><?= $value["Cliente"] ?></td>
                        <td class="align-middle id"><?= $value["Identificacion"] ?></td>
                        <td class="align-middle type"><?= $value["Tipo"] ?></td>
                        <td class="align-middle white-space-nowrap pe-0 p-3">
                          <button style="margin-right:10px" class="btn btn-sm btn-outline-secondary" type="button"> <i class="fas fa-eye"></i> &nbsp; Previsualizar</button>
                          <i style="margin-right:10px" class="fas fa-down-long"></i>
                          <i class="fas fa-bars"></i>
                        </td>
                      </tr>
                    <?php } ?>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--Nueva Factura-->
        <div class="modal fade" id="addDealModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-hidden="true">
          <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content bg-body-highlight p-6">
              <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0">Factura No. 0192347</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times text-danger"></span></button>
              </div>
              <div class="modal-body px-0">
                <h4 class="mb-0 border-0 p-0 mb-2">Información básica</h3>
                  <div class="row g-4">
                    <div class="col-lg-6">
                      <div class="mb-4">
                        <label class="text-body-highlight fw-bold mb-2">Tipo de comprobante</label>
                        <select class="form-select">
                          <option>Seleccionar</option>
                          <option>Ally Aagaard</option>
                          <option>Aida Moen</option>
                          <option>Niko Koss</option>
                          <option>Alec Haag</option>
                          <option>Lonnie Kub</option>
                          <option>Ola Smith</option>
                        </select>
                      </div>
                      <div class="mb-4">
                        <label class="text-body-highlight fw-bold mb-2">Cliente</label>
                        <select class="form-select">
                          <option>Selecciona a tu cliente</option>
                          <option>Ally Aagaard</option>
                          <option>Aida Moen</option>
                          <option>Niko Koss</option>
                          <option>Alec Haag</option>
                          <option>Lonnie Kub</option>
                          <option>Ola Smith</option>
                        </select>
                      </div>
                      <div class="mb-4">
                        <label class="text-body-highlight fw-bold mb-2">Vendedor</label>
                        <select class="form-select">
                          <option>Seleccionar al vendedor</option>
                          <option>Ally Aagaard</option>
                          <option>Aida Moen</option>
                          <option>Niko Koss</option>
                          <option>Alec Haag</option>
                          <option>Lonnie Kub</option>
                          <option>Ola Smith</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-4">
                        <label class="text-body-highlight fw-bold mb-2">Número de factura</label>
                        <input class="form-control" type="text" placeholder="No factura" />
                      </div>
                      <div class="mb-4">
                        <label class="text-body-highlight fw-bold mb-2">Destinatario (contacto)</label>
                        <select class="form-select">
                          <option>Selecciona al destinatario</option>
                          <option>Ally Aagaard</option>
                          <option>Aida Moen</option>
                          <option>Niko Koss</option>
                          <option>Alec Haag</option>
                          <option>Lonnie Kub</option>
                          <option>Ola Smith</option>
                        </select>
                      </div>
                      <div class="mb-4">
                        <label class="text-body-highlight fw-bold mb-2">Fecha de elaboración (fecha de venta)</label>
                        <input class="form-control datetimepicker" type="text" placeholder="dd / mm / yyyy" data-options='{"disableMobile":true}' />
                      </div>
                    </div>
                  </div>
              </div>
              <div class="modal-body px-0">
                <h4 class="mb-0 border-0 p-0 mb-2">Información de facturación</h3>
              </div>
              <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                <button class="btn btn-primary my-0">Crear factura</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <?php include "../footer.php"; ?>

  <script>
    function showSections(idVisible) {
      let sections = ["content-facturas-facturas", "content-facturas-compras", "content-facturas-ndebito", "content-facturas-ncredito"];
      sections.forEach(section => {
        document.getElementById(section).style.display = (section === idVisible) ? "block" : "none";
        document.getElementById(section).style.marginBottom = "0"; // Asegurar que no haya margen residual
      });
    }

    function initializeDropdownToggle() {
      // Add event listener to all dropdown icons
      document.querySelectorAll('.dropdownIcon').forEach(icon => {
        icon.addEventListener('click', function(event) {
          // Prevent default behavior and stop propagation
          event.stopPropagation();

          // Close any other open dropdowns
          document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
            dropdown.classList.remove('show');
          });

          // Get the corresponding dropdown for the clicked icon
          const dropdown = this.nextElementSibling;

          // Toggle the dropdown for the clicked icon
          dropdown.classList.toggle('show');
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdownIcon')) {
          document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
            dropdown.classList.remove('show');
          });
        }
      });
    }


    initializeDropdownToggle();


    // Mostrar la sección inicial
    showSections("content-facturas-facturas");
  </script>
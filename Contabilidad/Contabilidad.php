<?php
include "../menu.php";
include "../header.php";
include "./IncludeDatosPrueba.php";

?>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#!">Inicio</a></li>
                <li class="breadcrumb-item active">Contabilidad General</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="col-10">
                        <div class="col-12 row col-md-auto">
                            <div class="col-6">
                                <h2 class="mb-0">Contabilidad General</h2>
                            </div>
                            <div class="col-6 text-end" style="z-index: 999999999999999999999999999999999999999999999999999999999">

                            </div>
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
                            <ul class="nav nav-underline fs-9" role="tablist">
                                <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-plan-cuentas')">Plan de cuentas</a></li>
                                <!--<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-centro-costos')">Centro de costos</a></li>-->
                                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-documentos-contables')">Documentos contables</a></li>
                                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-reportes-contables')">Reportes contables</a></li>
                            </ul>
                        </nav>
                        <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0" data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" tabindex="0">
                            <div class="mb-8" id="content-plan-cuentas">
                                <!-- Plan de Cuentas -->
                                <div class="d-flex justify-content-between align-items-center col-12 row mb-2" id="scrollspyFacturacionVentas">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Plan de cuentas</h4>
                                    </div>
                                </div>

                                <div class="card mb-3 p-3">
                                    <div class="card-body">
                                        <div class="row gx-6">
                                            <div class="col-12 col-md-6 col-lg-12 col-xl-6 mb-5 mb-md-3 mb-lg-5 mb-xl-2 mb-xxl-3">
                                                <?php
                                                $array_test = [
                                                    [
                                                        "Clase" => ["1"],
                                                        "content" => [
                                                            "Grupo" => ["11"],
                                                            "content" => [
                                                                "Cuenta" => ["1105"],
                                                                "content" => [
                                                                    "SubCuenta" => ["110505", "110506"],
                                                                    "content" => [
                                                                        "Auxiliar" => ["110501"],
                                                                        "content" => [
                                                                            "SubAuxiliar" => ["11050101"],
                                                                            "content" => null
                                                                        ]
                                                                    ]
                                                                ]
                                                            ]
                                                        ]
                                                    ],
                                                    [
                                                        "Clase" => "2",
                                                        "content" => [
                                                            "Grupo" => "21",
                                                            "content" => [
                                                                "Cuenta" => "2105",
                                                                "content" => [
                                                                    "SubCuenta" => "210505",
                                                                    "content" => [
                                                                        "Auxiliar" => "210501"
                                                                    ]
                                                                ]
                                                            ]
                                                        ]
                                                    ],
                                                    [
                                                        "Clase" => "3"
                                                    ],
                                                    [
                                                        "Clase" => "4",
                                                        "content" => [
                                                            "Grupo" => "41",
                                                        ]
                                                    ],
                                                    [
                                                        "Clase" => "5",
                                                        "content" => [
                                                            "Grupo" => "51",
                                                            "content" => [
                                                                "Cuenta" => "5105",
                                                            ]
                                                        ]
                                                    ],
                                                    [
                                                        "Clase" => "6"
                                                    ],
                                                    [
                                                        "Clase" => "7",
                                                        "content" => [
                                                            "Grupo" => "71",
                                                            "content" => [
                                                                "Cuenta" => "7105",
                                                                "content" => [
                                                                    "SubCuenta" => "710505"
                                                                ]
                                                            ]
                                                        ]
                                                    ],
                                                    [
                                                        "Clase" => "8",
                                                        "content" => [
                                                            "Grupo" => "81"
                                                        ]
                                                    ],
                                                    [
                                                        "Clase" => "9",
                                                        "content" => [
                                                            "Grupo" => "91"
                                                        ]
                                                    ]
                                                ];

                                                function renderAccordion($data, $level = 1, $parentId = "accordionExample")
                                                {
                                                    static $index = 0;

                                                    foreach ($data as $item) {
                                                        $key = array_key_first($item);

                                                        if (is_array($item[$key])) {
                                                            foreach ($item[$key] as $value) {
                                                                $index++;
                                                                $itemId = "collapse" . $index;
                                                                $headingId = "heading" . $index;

                                                                echo '<div class="accordion-item border-top">';
                                                                echo '<h2 class="accordion-header" id="' . $headingId . '">';

                                                                echo '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' . $itemId . '" aria-expanded="false" aria-controls="' . $itemId . '">';
                                                                echo htmlspecialchars($key) . ': ' . htmlspecialchars($value);
                                                                echo '</button>';
                                                                echo '</h2>';
                                                                echo '<div class="accordion-collapse collapse" id="' . $itemId . '" aria-labelledby="' . $headingId . '" data-bs-parent="#' . $parentId . '">';
                                                                echo '<div class="accordion-body">';

                                                                if (isset($item['content']) && is_array($item['content'])) {
                                                                    renderAccordion([$item['content']], $level + 1, $itemId);
                                                                }

                                                                echo '</div>';
                                                                echo '</div>';
                                                                echo '</div>';
                                                            }
                                                        } else {
                                                            $index++;
                                                            $itemId = "collapse" . $index;
                                                            $headingId = "heading" . $index;

                                                            echo '<div class="accordion-item border-top">';
                                                            echo '<h2 class="accordion-header" id="' . $headingId . '">';

                                                            echo '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' . $itemId . '" aria-expanded="false" aria-controls="' . $itemId . '">';
                                                            echo htmlspecialchars($key) . ': ' . htmlspecialchars($item[$key]);
                                                            echo '</button>';
                                                            echo '</h2>';
                                                            echo '<div class="accordion-collapse collapse" id="' . $itemId . '" aria-labelledby="' . $headingId . '" data-bs-parent="#' . $parentId . '">';
                                                            echo '<div class="accordion-body">';

                                                            foreach ($item as $k => $v) {
                                                                if ($k === 'content' && is_array($v)) {
                                                                    renderAccordion([$v], $level + 1, $itemId);
                                                                }
                                                            }

                                                            echo '</div>';
                                                            echo '</div>';
                                                            echo '</div>';
                                                        }
                                                    }
                                                }

                                                ?>
                                                <div class="accordion" id="accordionExample">
                                                    <?php renderAccordion($array_test); ?>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 col-lg-12 col-xl-6 mb-1 mb-sm-0">
                                                <table class="table table-striped table-sm fs-9" id="dataTable">
                                                    <thead>
                                                        <tr>
                                                            <th class="sort border-top border-translucent ps-3" data-sort="number">Tipo</th>
                                                            <th class="sort border-top" data-sort="date">Codigo</th>
                                                            <th class="sort border-top" data-sort="user">Nombre</th>
                                                            <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="list" id="tableBody">
                                                    </tbody>
                                                </table>
                                                <button class="btn btn-primary me-4" id="addInputsButton" type="button">
                                                    <span class="fas fa-plus me-2"></span>Agregar
                                                </button>
                                                <div class="modal-body px-0">
                                                    <div class="row gx-6" id="inputFieldsContainer" style="display:none; margin-top: 20px;">
                                                        <table id="inputFieldsTable" style="width: 100%;">
                                                            <tbody>
                                                            </tbody>
                                                        </table>
                                                        <div style="text-align: right; margin-top: 10px;">
                                                            <button class="btn btn-link p-0 ms-3"><span class="fa-solid fa-plus me-1"></span><span>Crear</span></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="modal-header justify-content-between border-0 p-0 mb-2 mt-3">
                                                    <h4 class="mb-0">Característica transaccional</h4>
                                                </div>
                                                <div class="modal-body px-0">
                                                    <div class="row g-4">
                                                        <div class="col-lg-6">
                                                            <div class="mb-4">
                                                                <label class="text-body-highlight fw-bold mb-2">Categoria</label>
                                                                <select class="select2 form-select">
                                                                    <option>Seleccionar</option>
                                                                    <option>Caja - Bancos</option>
                                                                    <option>Cuentas por cobrar</option>
                                                                    <option>Otros activos corrientes</option>
                                                                    <option>Inventarios</option>
                                                                    <option>Activos fijos</option>
                                                                    <option>Otros activos</option>
                                                                    <option>Cuentas por pagar</option>
                                                                    <option>Otros pasivos corrientes</option>
                                                                    <option>Pasivo corto plazo</option>
                                                                    <option>Pasivos largos plazos</option>
                                                                    <option>Otros pasivos</option>
                                                                    <option>Patrimonio</option>
                                                                    <option>Ingresos</option>
                                                                    <option>Otros ingresos</option>
                                                                    <option>Costo de ventas</option>
                                                                    <option>Gastos</option>
                                                                    <option>Otros gastos</option>
                                                                    <option>Orden</option>
                                                                    <option>Gasto - Nómina</option>
                                                                </select>
                                                            </div>
                                                            <div class="mb-4">
                                                                <label class="text-body-highlight fw-bold mb-2">Detallar saldos de cartera o proveedores</label>
                                                                <select class="select2 form-select">
                                                                    <option>Seleccionar</option>
                                                                    <option>Sin detalle de movimientos</option>
                                                                    <option>Clientes, controla venciminetos y estados de cuenta</option>
                                                                    <option>Proveedores, controla venciminetos y estados de cuenta</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <div class="mb-4">
                                                                <label class="text-body-highlight fw-bold mb-2">Cuenta de diferencia fiscal o ajustes NIIF</label>
                                                                <input class="form-check-input" id="flexCheckDefault" type="checkbox" value="" />
                                                                <label class="form-check-label" for="flexCheckDefault">Si</label>
                                                            </div>
                                                            <div class="mb-4">
                                                                <label class="text-body-highlight fw-bold mb-2">Activa</label>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" id="flexCheckDefault" type="checkbox" value="" />
                                                                    <label class="form-check-label" for="flexCheckDefault">Si</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button class="btn btn-primary me-4" id="addInputsButton" type="button">
                                                        <i class="fas fa-save me-2"></i>Guardar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <!--<div class="mb-8" id="content-centro-costos">
                                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Centro de costos</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <button class="btn btn-primary me-4" type="button" data-bs-toggle="modal" data-bs-target="#addCostsCenter" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-plus me-2">
                                                <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div class="table-responsive mb-4 mt-4">
                                        <table class="table table-striped table-sm fs-9 mb-0  tableDataTableSearch">
                                            <thead>
                                                <tr>
                                                    <th class="sort border-top border-translucent ps-3" data-sort="codigo">Código</th>
                                                    <th class="sort border-top" data-sort="descripcion">Descripción</th>
                                                    <th class="sort border-top" data-sort="subcentro">Subcentro de costos</th>
                                                    <th class="sort border-top" data-sort="maneja-presupuesto">Maneja Presupuesto</th>
                                                    <th class="sort border-top" data-sort="centro-movimieto">Centro de movimiento</th>
                                                    <th class="sort border-top" data-sort="estado">Estado</th>
                                                    <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
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


                                                foreach ($arraytest as $value) { ?>
                                                    <tr>
                                                        <td class="align-middle ps-3 number"><?= $value["Código"] ?></td>
                                                        <td class="align-middle user"><?= $value["Descripción"] ?></td>
                                                        <td class="align-middle user"><?= $value["Subcentro de costos"] ?></td>
                                                        <td class="align-middle customer"><?= $value["Maneja Presupuesto"] ?></td>
                                                        <td class="align-middle id"><?= $value["Centro de movimiento"] ?></td>
                                                        <td class="align-middle type"><?= $value["Estado"] ?></td>
                                                        <td class="align-middle white-space-nowrap pe-0 p-3">
                                                            <button
                                                                style="margin-right:10px"
                                                                class="btn btn-sm btn-outline-primary edit-button"
                                                                type="button"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#editModal"
                                                                data-codigo="<?= $value["Código"] ?>"
                                                                data-descripcion="<?= $value["Descripción"] ?>"
                                                                data-subcentro="<?= $value["Subcentro de costos"] ?>"
                                                                data-presupuesto="<?= $value["Maneja Presupuesto"] ?>"
                                                                data-movimiento="<?= $value["Centro de movimiento"] ?>"
                                                                data-estado="<?= $value["Estado"] ?>">
                                                                <i class="fas fa-pencil-alt"></i> Editar
                                                            </button>
                                                            <button
                                                                style="margin-right:10px"
                                                                class="btn btn-sm btn-outline-danger delete-button"
                                                                type="button"
                                                                data-bs-target="#deleteModal"
                                                                data-codigo="<?= $value["Código"] ?>">
                                                                <i class="fas fa-trash-alt"></i> Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                <?php } ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>-->
                            <div class="mb-8" id="content-documentos-contables">
                                <!-- Documentos contable -->
                                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Documentos contables</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <button class="btn btn-primary me-4 mb-4" type="button" data-bs-toggle="modal" data-bs-target="#addDocument" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent">
                                                <i class="fas fa-plus"></i> Nuevo
                                        </button>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <div class="table-responsive mb-4 mt-4">
                                                <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                    <thead>
                                                        <tr>
                                                            <th class="sort border-top border-translucent ps-3 " data-sort="number">Id</th>
                                                            <th class="sort border-top" data-sort="date">Número</th>
                                                            <th class="sort border-top" data-sort="user">Fecha</th>
                                                            <th class="sort border-top" data-sort="customer">Descripción</th>
                                                            <th class="sort border-top" data-sort="id">Movimientos</th>
                                                            <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="list">
                                                        <?php
                                                        $arraytest = [
                                                            [
                                                                "Id" => "1",
                                                                "Número" => "BCMV-000001",
                                                                "Fecha" => "2023-10-19",
                                                                "Descripción" => "Movimiento Banco - Apertura #1",
                                                                "Movimientos" => [
                                                                    [
                                                                        "Referencia" => "Reference 1",
                                                                        "Debe" => "200",
                                                                        "Haber" => "0",
                                                                        "Cuenta" => "5105",
                                                                        "Descripción Movimiento" => "Apertura para Clientes",
                                                                    ],
                                                                    [
                                                                        "Referencia" => "Reference 2",
                                                                        "Debe" => "0",
                                                                        "Haber" => "200",
                                                                        "Cuenta" => "2105",
                                                                        "Descripción Movimiento" => "Administracion para Clientes",
                                                                    ],
                                                                ],
                                                                "tipoTercero" => "Clientes",
                                                                "tercero" => "Si",
                                                                "centroCostos" => "Administración",
                                                            ],
                                                            [
                                                                "Id" => "3",
                                                                "Número" => "BCMV-000002",
                                                                "Fecha" => "2023-10-19",
                                                                "Descripción" => "Movimiento Banco #1 - Cheque | detalle",
                                                                "Movimientos" => [
                                                                    [
                                                                        "Referencia" => "Reference 1",
                                                                        "Debe" => "500",
                                                                        "Haber" => "0",
                                                                        "Cuenta" => "1105",
                                                                        "Descripción Movimiento" => "Cheque para Proveedores",
                                                                    ],
                                                                    [
                                                                        "Referencia" => "Reference 2",
                                                                        "Debe" => "0",
                                                                        "Haber" => "400",
                                                                        "Cuenta" => "2105",
                                                                        "Descripción Movimiento" => "Descuento 1",
                                                                    ],
                                                                    [
                                                                        "Referencia" => "Reference 3",
                                                                        "Debe" => "0",
                                                                        "Haber" => "100",
                                                                        "Cuenta" => "5105",
                                                                        "Descripción Movimiento" => "Descuento 2",
                                                                    ],
                                                                ],
                                                                "tipoTercero" => "Proveedores",
                                                                "tercero" => "Si",
                                                                "centroCostos" => "Marketing y Ventas",
                                                            ],
                                                            [
                                                                "Id" => "3",
                                                                "Número" => "BCMV-000003",
                                                                "Fecha" => "2023-10-19",
                                                                "Descripción" => "Movimiento Banco #1 - Nota Debito | detalle",
                                                                "Movimientos" => [
                                                                    [
                                                                        "Referencia" => "Reference 3",
                                                                        "Debe" => "300",
                                                                        "Haber" => "0",
                                                                        "Cuenta" => "1105",
                                                                        "Descripción Movimiento" => "Nota debito suma detalle",
                                                                    ],
                                                                    [
                                                                        "Referencia" => "Reference 3",
                                                                        "Debe" => "0",
                                                                        "Haber" => "300",
                                                                        "Cuenta" => "5105",
                                                                        "Descripción Movimiento" => "Nota debito resta detalle",
                                                                    ],
                                                                ],
                                                                "tipoTercero" => "",
                                                                "tercero" => "No",
                                                                "centroCostos" => "Servicios Generales",
                                                            ],
                                                        ];


                                                        foreach ($arraytest as $value) { ?>
                                                            <tr>
                                                                <td class="align-middle ps-3 number"><?= $value["Id"] ?></td>
                                                                <td class="align-middle user"><?= $value["Número"] ?></td>
                                                                <td class="align-middle customer"><?= $value["Fecha"] ?></td>
                                                                <td class="align-middle id"><?= $value["Descripción"] ?></td>
                                                                <td class="align-middle type"><?= count($value["Movimientos"]) ?></td>
                                                                <td class="align-middle white-space-nowrap pe-0 p-3">
                                                                    <!-- <button style="margin-right:10px" class="btn btn-sm btn-outline-primary" type="button"></button> -->
                                                                    <i class="fas fa-pencil-alt"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#editDocument"
                                                                        data-id="<?= $value['Id'] ?>"
                                                                        data-number="<?= $value['Número'] ?>"
                                                                        data-date="<?= $value['Fecha'] ?>"
                                                                        data-descripcion="<?= $value['Descripción'] ?>"
                                                                        data-tipo-tercero="<?= $value['tipoTercero'] ?>"
                                                                        data-tercero="<?= $value['tercero'] ?>"
                                                                        data-centro-costos="<?= $value['centroCostos'] ?>"
                                                                        data-movimientos='<?= json_encode($value['Movimientos']) ?>'></i>
                                                                    <!-- <button style="margin-right:10px" class="btn btn-sm btn-outline-success"></button> -->
                                                                    <i data-bs-toggle="modal"
                                                                        data-bs-target="#viewDocument"
                                                                        data-id="<?= $value['Id'] ?>"
                                                                        data-number="<?= $value['Número'] ?>"
                                                                        data-date="<?= $value['Fecha'] ?>"
                                                                        data-descripcion="<?= $value['Descripción'] ?>"
                                                                        data-tipo-tercero="<?= $value['tipoTercero'] ?>"
                                                                        data-tercero="<?= $value['tercero'] ?>"
                                                                        data-centro-costos="<?= $value['centroCostos'] ?>"
                                                                        data-movimientos='<?= json_encode($value['Movimientos']) ?>'
                                                                        type="button" class="fas fa-eye"></i>
                                                                    <!-- <button style="margin-right:10px" class="btn btn-sm btn-outline-danger"></button> -->
                                                                    <i class="fas fa-trash-alt" data-bs-toggle="modal"
                                                                        data-bs-target="#deleteDocument"
                                                                        data-number="<?= $value['Número'] ?>"></i>
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
                            <div class="mb-8" id="content-reportes-contables">
                                <!-- Reportes contables -->
                                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Reportes contables</h4>
                                    </div>
                                    <div class="d-xl-flex justify-content-between  mt-4">
                                    </div>
                                    <div id="reports" data-list='{"valueNames":["title","text","priority","reportsby","reports","date"],"page":10,"pagination":true}'>
                                        <div class="row g-3 justify-content-between mb-2">
                                            <div class="col-12">
                                                <div class="d-md-flex justify-content-between">
                                                    <div class="d-flex mb-3">
                                                        <div class="search-box me-2">
                                                            <form class="position-relative">
                                                                <input class="form-control search-input search" type="search" placeholder="Search by name" aria-label="Search" />
                                                                <span class="fas fa-search search-box-icon"></span>

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card mb-3 p-3">
                                            <div class="card-body">
                                                <div class="row g-3 list" id="reportsList">
                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Mayores Contables</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Mayores Contables con Centro de Costos</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Reporte de Clientes con Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Reporte de Clientes con Centro de Costos</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Balance de Comprobación</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Estado de Ganancias y Perdidas</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Reporte de Balance Prueba</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Reporte de Estado Resultado Integral</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Reporte de Comprobantes Detallados</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Reporte de Libro Diario Resumido</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Reporte de Estado De Situacion Financiera</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Libro Oficial De Compras</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Consecutivo De Comprobantes</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento Auxiliar De Centro De Costo Por Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento Auxiliar De Proveedores Por Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento Nota Debito y Credito [Venta y Compras]</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Ventas Por Centro De Costo</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Libro Oficial de Ventas</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento Auxiliar Por Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Auxiliar Cuenta Contable Por Tercero</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento Auxiliar De Tercero Por Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento Auxiliar De Gastos Por Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Libro Diario</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Libro Mayor y Balance</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Cuentas Por Pagar Por Centro De Costo</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Auxiliar Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Auxiliar Cuenta Contable Por Centro De Costo</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Comprobante Informe Diario</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Libro de Inventario y Balance</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Resumen Forma de Pago</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento auxiliar de Activos Fijos</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Estado de resultado integral por naturaleza de gasto</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Movimiento Auxiliar de Cartera por Cuenta Contable</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Cartera por Centro de Costo</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Balance de prueba por Tercero</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12 col-xl-6">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <div class="d-flex align-items-start mb-1">
                                                                    <div class="d-sm-flex align-items-center ps-2">
                                                                        <a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="#">Balance de prueba por Centro de Costo</a>
                                                                    </div>
                                                                </div>
                                                                <p class="fs-9 fw-semibold text-body text mb-4 ps-2">Reporte</p>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                                <div class="row align-items-center justify-content-between py-2 pe-0 fs-9 mt-2">
                                                    <div class="col-auto d-flex">
                                                        <p class="mb-0 d-none d-sm-block me-3 fw-semibold text-body" data-list-info="data-list-info"></p><a class="fw-semibold" href="#!" data-list-view="*">Ver todos<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a class="fw-semibold d-none" href="#!" data-list-view="less">Ver menos<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                                                    </div>
                                                    <div class="col-auto d-flex">
                                                        <button class="page-link" data-list-pagination="prev"><span class="fas fa-chevron-left"></span></button>
                                                        <ul class="mb-0 pagination"></ul>
                                                        <button class="page-link pe-0" data-list-pagination="next"><span class="fas fa-chevron-right"></span></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--<div class="modal fade" id="addCostsCenter" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addCostsCenter" aria-hidden="true">
                                <div class="modal-dialog modal-xl modal-dialog-centered">
                                    <div class="modal-content bg-body-highlight p-6">
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <h3 class="mb-0">Centro de costos</h3>
                                            <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times text-danger"></span></button>
                                        </div>
                                        <div class="modal-body px-0">
                                            <div class="row g-4">
                                                <div class="col-lg-6">
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Subcentro de costos
                                                        </label>
                                                        <select class="select2 form-select">
                                                            <option>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Maneja presupuesto
                                                        </label>
                                                        <select class="select2 form-select">
                                                            <option>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Estado
                                                        </label>
                                                        <select class="select2 form-select">
                                                            <option>N/A</option>
                                                            <option>Activo</option>
                                                            <option>Inactivo</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Descripción</label>
                                                        <input class="form-control" type="text" placeholder="Descripción" />
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Centro de movimiento
                                                        </label>
                                                        <select class="select2 form-select">
                                                            <option>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer border-0 pt-6 px-0 pb-0">
                                            <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                                            <button class="btn btn-primary my-0">Crear Costos</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
                                <div class="modal-dialog modal-xl modal-dialog-centered">
                                    <div class="modal-content bg-body-highlight p-6">
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <h3 class="mb-0" id="codigo-header">Centro de Costos</h3>
                                            <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times text-danger"></span></button>
                                        </div>
                                        <div class="modal-body px-0">
                                            <div class="row g-4">
                                                <div class="col-lg-6">
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Subcentro de costos</label>
                                                        <select class="select2 form-select" id="subcentro-edit">
                                                            <option selected>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>

                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Maneja presupuesto</label>
                                                        <select class="select2 form-select" id="presupuesto-edit">
                                                            <option>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Estado</label>
                                                        <select class="select2 form-select" id="estado-edit">
                                                            <option>N/A</option>
                                                            <option>Activo</option>
                                                            <option>Inactivo</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Descripción</label>
                                                        <input class="form-control" type="text" id="descripcion-edit" placeholder="Descripción" />
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Centro de movimiento</label>
                                                        <select class="select2 form-select" id="movimiento-edit">
                                                            <option>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer border-0 pt-6 px-0 pb-0">
                                            <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                                            <button class="btn btn-primary my-0" id="save-edit">Guardar Cambios</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             Delete Confirmation Modal
                            <div class="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteModal" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content bg-body-highlight p-6">
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <h3 class="mb-0">Confirmar Eliminación</h3>
                                            <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                                                <span class="fas fa-times text-danger"></span>
                                            </button>
                                        </div>
                                        <div class="modal-body px-0">
                                            <p>¿Está seguro de que desea eliminar este elemento <span id="codigo-to-delete"></span>?</p>
                                        </div>
                                        <div class="modal-footer border-0 pt-3 px-0 pb-0">
                                            <button class="btn btn-link text-primary px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                                            <button class="btn btn-danger my-0" id="confirm-delete">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div> -->

                            <div class="modal fade" id="addDocument" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDocument" aria-hidden="true">
                                <div class="modal-dialog modal-xl modal-dialog-centered">
                                    <div class="modal-content bg-body-highlight p-6">
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <h3 class="mb-0">Documentos contables</h3>
                                            <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times text-danger"></span></button>
                                        </div>
                                        <div class="modal-body px-0">
                                            <div class="row g-4">
                                                <div class="col-lg-4">
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Número</label>
                                                        <input class="form-control" type="text" value="BCMV-000004" disabled /> <!-- Initially empty, will be set by JavaScript -->
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Descripción</label>
                                                        <input class="form-control" type="text" /> <!-- Set ID for input -->
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Tipo tercero</label>
                                                        <select style="width:100%" class="select2 form-select">
                                                            <option>Seleccionar</option>
                                                            <option>Clientes</option>
                                                            <option>Proveedores</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4">
                                                    <div class="mb-4">
                                                        <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Fecha</label>
                                                        <input type="date" class="form-control col-md-6" />
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Centro de costos</label>
                                                        <select style="width:100%" class="select2 form-select">
                                                            <option>Seleccionar</option>
                                                            <option>Administración</option>
                                                            <option>Operaciones</option>
                                                            <option>Investigación y Desarrollo</option>
                                                            <option>Marketing y Ventas</option>
                                                            <option>Servicios Generales</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Tercero</label>
                                                        <select style="width:100%" class="select2 form-select">
                                                            <option>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4">
                                                    <div class="card mb-3">
                                                        <div class="card-body">
                                                            <div class="row align-items-center g-3 text-center text-xxl-start">
                                                                <div class="col-12 col-xxl-auto">
                                                                    <h5 class="fw-bolder mb-2">Debe</h5>
                                                                    <p class="mb-0" id="debe-total-1"></p>
                                                                </div>
                                                                <div class="col-12 col-sm-auto flex-1">
                                                                    <h5 class="fw-bolder mb-2">Haber</h5>
                                                                    <p class="mb-0" id="haber-total-1"></p>
                                                                </div>
                                                                <div style="border-bottom: 1px solid #ccc; margin-bottom: 10px;"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="card mb-3">
                                                        <div class="card-body">
                                                            <div class="row align-items-center g-3 text-center text-xxl-start">
                                                                <div class="col-12 col-xxl-auto">
                                                                    <h5 class="fw-bolder mb-2">Saldo</h5>
                                                                    <p class="mb-0" id="saldo-1"></p>
                                                                    <span id="saldo-message-1" class="text-success"></span> <!-- Element for displaying the message -->
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                                    <h3 class="mb-0">Movimientos</h3>
                                                </div>
                                                <div class="modal-body px-0 overflow-auto">
                                                    <div class="row g-4">
                                                        <div class="col-lg-12">
                                                            <button id="add-movimiento-2" class="btn btn-primary mb-2">+</button> <!-- Plus button -->
                                                            <div id="no-data-message" class="text-center" style="display:none;">No hay datos disponibles en la tabla</div>
                                                            <table class="table table-striped table-sm fs-9 mb-0 tableDataTableSearch">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="sort border-top border-translucent ps-3" data-sort="number">Cuenta</th>
                                                                        <th class="sort border-top" data-sort="date">Descripción</th>
                                                                        <th class="sort border-top" data-sort="customer">Referencia</th>
                                                                        <th class="sort border-top" data-sort="id">Debe</th>
                                                                        <th class="sort border-top" data-sort="id">Haber</th>
                                                                        <th class="sort text-end align-middle pe-0 border-top" scope="col">Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="list" id="movimientos-list-2">
                                                                    <!-- Default Row -->
                                                                    <tr>
                                                                        <td>
                                                                            <select class="select2 form-select">
                                                                                <option value="" disabled selected>Seleccionar</option>
                                                                                <option value="1105">1105</option>
                                                                                <option value="2105">2105</option>
                                                                                <option value="5105">5105</option>
                                                                                <option value="7105">7105</option>
                                                                            </select>
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" class="form-control" value="" placeholder="Descripción" /> <!-- Input for Descripción Movimiento -->
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" class="form-control" value="" placeholder="Referencia" /> <!-- Input for Referencia -->
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" class="form-control debe-input-1" value="" placeholder="Debe" /> <!-- Input for Debe -->
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" class="form-control haber-input-1" value="" placeholder="Haber" /> <!-- Input for Haber -->
                                                                        </td>
                                                                        <td class="text-end">
                                                                            <button class="btn btn-sm btn-danger" onclick="deleteEmptyMovimiento(this)">Eliminar</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>



                                                    </div>
                                                </div>
                                                <div class="modal-footer border-0 pt-6 px-0 pb-0">
                                                    <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                                                    <button class="btn btn-primary my-0">Totalizar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="editDocument" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editDocument" aria-hidden="true">
                                <div class="modal-dialog modal-xl modal-dialog-centered">
                                    <div class="modal-content bg-body-highlight p-6">
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <h3 class="mb-0">Documentos contables</h3>
                                            <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times text-danger"></span></button>
                                        </div>
                                        <div class="modal-body px-0">
                                            <div class="row g-4">
                                                <div class="col-lg-4">
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Número</label>
                                                        <input id="data-number-edit" class="form-control" type="text" disabled /> <!-- Initially empty, will be set by JavaScript -->
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Descripción</label>
                                                        <input id="data-descripcion-edit" class="form-control" type="text" /> <!-- Set ID for input -->
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Tipo tercero</label>
                                                        <select id="data-tipo-tercero-edit" class="select2 form-select">
                                                            <option>Seleccionar</option>
                                                            <option>Clientes</option>
                                                            <option>Proveedores</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4">
                                                    <div class="mb-4">
                                                        <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Fecha</label>
                                                        <input id="data-date-edit" type="date" class="form-control col-md-6" />
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Centro de costos</label>
                                                        <select id="data-centro-costos-edit" class="select2 form-select">
                                                            <option>Seleccionar</option>
                                                            <option>Administración</option>
                                                            <option>Operaciones</option>
                                                            <option>Investigación y Desarrollo</option>
                                                            <option>Marketing y Ventas</option>
                                                            <option>Servicios Generales</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="text-body-highlight fw-bold mb-2">Tercero</label>
                                                        <select id="data-tercero-edit" class="select2 form-select">
                                                            <option>Si</option>
                                                            <option>No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4">
                                                    <div class="card mb-3">
                                                        <div class="card-body">
                                                            <div class="row align-items-center g-3 text-center text-xxl-start">
                                                                <div class="col-12 col-xxl-auto">
                                                                    <h5 class="fw-bolder mb-2">Debe</h5>
                                                                    <p class="mb-0" id="debe-total">0.00</p> <!-- Total for Debe -->
                                                                </div>
                                                                <div class="col-12 col-sm-auto flex-1">
                                                                    <h5 class="fw-bolder mb-2">Haber</h5>
                                                                    <p class="mb-0" id="haber-total">0.00</p> <!-- Total for Haber -->
                                                                </div>
                                                                <div style="border-bottom: 1px solid #ccc; margin-bottom: 10px;"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="card mb-3">
                                                        <div class="card-body">
                                                            <div class="row align-items-center g-3 text-center text-xxl-start">
                                                                <div class="col-12 col-xxl-auto">
                                                                    <h5 class="fw-bolder mb-2">Saldo</h5>
                                                                    <p class="mb-0" id="saldo-total">0.00</p>
                                                                    <span id="saldo-message" class="text-success"></span> <!-- Element for displaying the message -->
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                                    <h3 class="mb-0">Movimientos</h3>
                                                </div>
                                                <div class="modal-body px-0 overflow-auto">
                                                    <div class="row g-4">
                                                        <div class="col-lg-12">
                                                            <button id="add-movimiento" class="btn btn-primary mb-2">+</button> <!-- Plus button -->

                                                            <table class="table table-striped table-sm fs-9 mb-0 tableDataTableSearch">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="sort border-top border-translucent ps-3" data-sort="number">Cuenta</th>
                                                                        <th class="sort border-top" data-sort="date">Descripción</th>
                                                                        <th class="sort border-top" data-sort="customer">Referencia</th>
                                                                        <th class="sort border-top" data-sort="id">Debe</th>
                                                                        <th class="sort border-top" data-sort="id">Haber</th>
                                                                        <th class="sort text-end align-middle pe-0 border-top" scope="col">Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="list" id="movimientos-list">
                                                                    <!-- Rows will be dynamically populated here -->
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div class="modal-footer border-0 pt-6 px-0 pb-0">
                                                    <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                                                    <button class="btn btn-primary my-0">Totalizar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="viewDocument" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="viewDocument" aria-hidden="true">
                                <div class="modal-dialog modal-xl modal-dialog-centered">
                                    <div class="modal-content bg-body-highlight p-6">
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <div class="col-12 text-end">
                                                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times text-danger"></span></button>
                                            </div>
                                        </div>
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <div class="modal-body px-0 overflow-auto">
                                                <div class="row g-4">
                                                    <div class="col-lg-12">
                                                        <div class="modal-body" id="billContent">
                                                            <!-- Bill content will be dynamically inserted here -->
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                                                <button class="btn btn-link text-primary px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Volver</button>
                                                <button class="btn btn-primary my-0">Imprimir</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Modal Structure -->
                            <div class="modal fade" id="deleteDocument" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteDocument" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content bg-body-highlight p-6">
                                        <div class="modal-header justify-content-between border-0 p-0 mb-2">
                                            <h3 class="mb-0">Confirmar Eliminación</h3>
                                            <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                                                <span class="fas fa-times text-danger"></span>
                                            </button>
                                        </div>
                                        <div class="modal-body px-0">
                                            <p>¿Está seguro de que desea eliminar este elemento <span id="data-number"></span>?</p>
                                        </div>
                                        <div class="modal-footer border-0 pt-3 px-0 pb-0">
                                            <button class="btn btn-link text-primary px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                                            <button class="btn btn-danger my-0" id="confirm-delete">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <style>
                            select {
                                width: 100%;
                            }
                        </style>



                        <?php include "../footer.php"; ?>
                        <script>
                            function showSections(idVisible) {
                                let todos = ["content-plan-cuentas", "content-documentos-contables", "content-reportes-contables"];
                                todos.forEach(element => {
                                    if (element == idVisible) {
                                        document.getElementById(element).style.display = "block";
                                    } else {
                                        document.getElementById(element).style.display = "none";
                                    }
                                });
                            }

                            function updateTableOnAccordionClick() {
                                const accordionButtons = document.querySelectorAll('.accordion-button');
                                const tableBody = document.getElementById('tableBody');

                                accordionButtons.forEach(button => {
                                    button.addEventListener('click', () => {
                                        const parentId = button.getAttribute('data-bs-target');
                                        const parent = document.querySelector(parentId);
                                        const data = parent.querySelector('.accordion-body');
                                        const buttonText = button.textContent.trim().split(':')[0];
                                        const buttonValue = button.textContent.trim().split(':')[1].trim();

                                        // Clear existing table data
                                        tableBody.innerHTML = '';

                                        // Check if accordion item has children
                                        if (data.children.length > 0) {
                                            // Add parent level to table
                                            const parentRow = document.createElement('tr');
                                            parentRow.innerHTML = `
                        <td class="align-middle ps-3 number">${buttonText}</td>
                        <td class="align-middle date">${buttonValue}</td>
                        <td class="align-middle user"></td>
                    `;
                                            tableBody.appendChild(parentRow);

                                            // Extract data from accordion body
                                            const dataArray = [];
                                            const children = data.children;
                                            for (let i = 0; i < children.length; i++) {
                                                const child = children[i];
                                                const key = child.querySelector('.accordion-header').textContent.trim().split(':')[0];
                                                const value = child.querySelector('.accordion-header').textContent.trim().split(':')[1].trim();

                                                dataArray.push({
                                                    [key]: value
                                                });
                                            }

                                            // Render table data
                                            dataArray.forEach(item => {
                                                const key = Object.keys(item)[0];
                                                const value = Object.values(item)[0];

                                                const row = document.createElement('tr');
                                                row.innerHTML = `
                            <td class="align-middle ps-3 number">${key}</td>
                            <td class="align-middle date">${value}</td>
                            <td class="align-middle user"></td>
                        `;
                                                tableBody.appendChild(row);
                                            });
                                        } else {
                                            // Add parent level to table if no children
                                            const parentRow = document.createElement('tr');
                                            parentRow.innerHTML = `
                        <td class="align-middle ps-3 number">${buttonText}</td>
                        <td class="align-middle date">${buttonValue}</td>
                        <td class="align-middle user"></td>
                    `;
                                            tableBody.appendChild(parentRow);
                                        }
                                    });
                                });

                                accordionButtons[0].click();
                            }

                            function createInputFields() {
                                const addInputsButton = document.getElementById('addInputsButton');
                                const inputFieldsContainer = document.getElementById('inputFieldsContainer');
                                const inputFieldsTableBody = document.getElementById('inputFieldsTable').querySelector('tbody');

                                addInputsButton.addEventListener('click', () => {
                                    // Toggle input fields container visibility
                                    inputFieldsContainer.style.display = inputFieldsContainer.style.display === 'none' ? 'block' : 'none';

                                    // Clear existing input fields
                                    inputFieldsTableBody.innerHTML = '';

                                    // Create input fields
                                    const inputRow = document.createElement('tr');
                                    inputFieldsTableBody.appendChild(inputRow);

                                    // Codigo input
                                    const codigoCell = document.createElement('td');
                                    codigoCell.style.width = '50%';
                                    inputRow.appendChild(codigoCell);

                                    const codigoLabel = document.createElement('label');
                                    codigoLabel.className = 'text-body-highlight fw-bold mb-2';
                                    codigoLabel.textContent = 'Codigo:';
                                    codigoCell.appendChild(codigoLabel);

                                    const codigoInput = document.createElement('input');
                                    codigoInput.className = 'form-control';
                                    codigoInput.type = 'text';
                                    codigoInput.placeholder = 'Codigo';
                                    codigoCell.appendChild(codigoInput);

                                    // Spacer cell
                                    const spacerCell = document.createElement('td');
                                    spacerCell.style.width = '10px';
                                    inputRow.appendChild(spacerCell);

                                    // Nombre input
                                    const nombreCell = document.createElement('td');
                                    nombreCell.style.width = '50%';
                                    inputRow.appendChild(nombreCell);

                                    const nombreLabel = document.createElement('label');
                                    nombreLabel.className = 'text-body-highlight fw-bold mb-2';
                                    nombreLabel.textContent = 'Nombre:';
                                    nombreCell.appendChild(nombreLabel);

                                    const nombreInput = document.createElement('input');
                                    nombreInput.className = 'form-control';
                                    nombreInput.type = 'text';
                                    nombreInput.placeholder = 'Nombre';
                                    nombreCell.appendChild(nombreInput);
                                });
                            }

                            function addNewRow() {
                                var template = document.getElementById("newRowTemplate");
                                var clone = template.cloneNode(true);
                                clone.style.display = "";
                                document.querySelector(".list").appendChild(clone);
                            }

                            // function handleEditModal() {
                            //     // Select all edit buttons with the class 'edit-button'
                            //     const editButtons = document.querySelectorAll('.edit-button');

                            //     // Loop through each button and attach a click event listener
                            //     editButtons.forEach(button => {
                            //         button.addEventListener('click', function() {
                            //             // Retrieve the data attributes from the clicked button
                            //             const codigo = this.getAttribute('data-codigo');
                            //             const descripcion = this.getAttribute('data-descripcion');
                            //             const subcentro = this.getAttribute('data-subcentro');
                            //             const presupuesto = this.getAttribute('data-presupuesto');
                            //             const movimiento = this.getAttribute('data-movimiento');
                            //             const estado = this.getAttribute('data-estado');

                            //             // Populate the modal input fields with the retrieved data
                            //             document.getElementById('descripcion-edit').value = descripcion;
                            //             document.getElementById('subcentro-edit').value = subcentro;
                            //             document.getElementById('presupuesto-edit').value = presupuesto;
                            //             document.getElementById('movimiento-edit').value = movimiento;
                            //             document.getElementById('estado-edit').value = estado;

                            //             // Update the <h3> tag with the código value
                            //             document.getElementById('codigo-header').textContent = `Centro de Costos: ${codigo}`;
                            //         });
                            //     });
                            // }

                            // function handleDeleteModal() {
                            //     // Select all delete buttons with the class 'delete-button'
                            //     const deleteButtons = document.querySelectorAll('.delete-button');

                            //     // Loop through each button and attach a click event listener
                            //     deleteButtons.forEach(button => {
                            //         button.addEventListener('click', function() {
                            //             // Retrieve the 'codigo' data attribute from the clicked button
                            //             const codigo = this.getAttribute('data-codigo');

                            //             // Insert the 'codigo' into the modal
                            //             const codigoSpan = document.getElementById('codigo-to-delete');
                            //             codigoSpan.textContent = codigo;

                            //             // Show the delete confirmation modal
                            //             const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                            //             deleteModal.show();
                            //         });
                            //     });
                            // }


                            // Function to calculate and display totals and difference
                            function calculateTotals() {
                                // Get all Debe and Haber input values
                                const debeInputs = document.querySelectorAll('.debe-input-1');
                                const haberInputs = document.querySelectorAll('.haber-input-1');

                                // Initialize sum variables
                                let debeTotal = 0;
                                let haberTotal = 0;

                                // Calculate sum of Debe values
                                debeInputs.forEach(input => {
                                    const value = parseFloat(input.value);
                                    if (!isNaN(value)) {
                                        debeTotal += value;
                                    }
                                });

                                // Calculate sum of Haber values
                                haberInputs.forEach(input => {
                                    const value = parseFloat(input.value);
                                    if (!isNaN(value)) {
                                        haberTotal += value;
                                    }
                                });

                                // Calculate difference (Saldo)
                                const saldo = debeTotal - haberTotal;

                                // Display totals and difference
                                document.getElementById('debe-total-1').innerText = debeTotal.toFixed(2);
                                document.getElementById('haber-total-1').innerText = haberTotal.toFixed(2);
                                document.getElementById('saldo-1').innerText = saldo.toFixed(2);

                                // Display Cuadrado/No Cuadrado message
                                const saldoMessage = document.getElementById('saldo-message-1');
                                if (saldo === 0) {
                                    saldoMessage.innerText = 'Cuadrado';
                                    saldoMessage.classList.remove('text-danger');
                                    saldoMessage.classList.add('text-success');
                                } else {
                                    saldoMessage.innerText = 'No Cuadrado';
                                    saldoMessage.classList.remove('text-success');
                                    saldoMessage.classList.add('text-danger');
                                }
                            }

                            // Initial calculation
                            calculateTotals();

                            function updateTotals() {
                                // Get all Debe and Haber input elements
                                const debeInputs = document.querySelectorAll('.debe-input');
                                const haberInputs = document.querySelectorAll('.haber-input');

                                let debeTotal = 0;
                                let haberTotal = 0;

                                // Sum up all Debe inputs
                                debeInputs.forEach(input => {
                                    const value = parseFloat(input.value) || 0; // Handle empty values
                                    debeTotal += value;
                                });

                                // Sum up all Haber inputs
                                haberInputs.forEach(input => {
                                    const value = parseFloat(input.value) || 0; // Handle empty values
                                    haberTotal += value;
                                });

                                // Update the totals displayed in the card
                                document.getElementById('debe-total').textContent = debeTotal.toFixed(2);
                                document.getElementById('haber-total').textContent = haberTotal.toFixed(2);

                                // Calculate saldo
                                const saldo = debeTotal - haberTotal;
                                document.getElementById('saldo-total').textContent = saldo.toFixed(2); // Update saldo display

                                const saldoMessage = document.getElementById('saldo-message');
                                if (saldo === 0) {
                                    saldoMessage.innerText = 'Cuadrado';
                                    saldoMessage.classList.remove('text-danger');
                                    saldoMessage.classList.add('text-success');
                                } else {
                                    saldoMessage.innerText = 'No Cuadrado';
                                    saldoMessage.classList.remove('text-success');
                                    saldoMessage.classList.add('text-danger');
                                }
                            }

                            function handleDeleteDocumentModal() {
                                // Select all delete buttons that target the 'deleteDocument' modal
                                const deleteDocumentButtons = document.querySelectorAll('button[data-bs-target="#deleteDocument"]');

                                // Loop through each button and attach a click event listener
                                deleteDocumentButtons.forEach(button => {
                                    button.addEventListener('click', function() {
                                        // Retrieve the 'number' data attribute from the clicked button
                                        const number = this.getAttribute('data-number');

                                        // Insert the 'number' into the modal
                                        const numberSpan = document.getElementById('data-number');
                                        numberSpan.textContent = number;

                                        // Show the delete confirmation modal for the document
                                        const deleteDocumentModal = new bootstrap.Modal(document.getElementById('deleteDocument'));
                                        deleteDocumentModal.show();
                                    });
                                });
                            }

                            // Call the function to attach event listeners for the deleteDocument modal
                            handleDeleteDocumentModal();


                            function populateModalFields(editButton) {
                                // Get the document's information from the edit button's data attributes
                                var id = editButton.data('id');
                                var number = editButton.data('number');
                                var date = editButton.data('date');
                                var descripcion = editButton.data('descripcion');
                                var tipo_tercero = editButton.data('tipo-tercero');
                                var es_tercero = editButton.data('tercero');
                                var costos_centro = editButton.data('centro-costos');
                                var movimientos = editButton.data('movimientos');

                                $('#movimientos-list').empty();

                                // Populate the modal fields with the document's information
                                $('#data-number-edit').val(number);
                                $('#data-descripcion-edit').val(descripcion);
                                $('#data-date-edit').val(date);
                                $('#data-tipo-tercero-edit').val(tipo_tercero);
                                $('#data-tercero-edit').val(es_tercero);
                                $('#data-centro-costos-edit').val(costos_centro);

                                // Parse Movimientos and append them to the modal
                                if (movimientos && movimientos.length > 0) {
                                    // Create a table body variable to hold the rows
                                    let movimientosRows = '';

                                    movimientos.forEach(function(movimiento) {
                                        // Create a new row for each movimiento
                                        const movimientoRow = `
<tr>
    <td>
        <select class="select2 form-select">
            <option value="" disabled ${movimiento.Cuenta ? '' : 'selected'}>Seleccionar</option>
            <option value="1105" ${movimiento.Cuenta === '1105' ? 'selected' : ''}>1105</option>
            <option value="2105" ${movimiento.Cuenta === '2105' ? 'selected' : ''}>2105</option>
            <option value="5105" ${movimiento.Cuenta === '5105' ? 'selected' : ''}>5105</option>
            <option value="7105" ${movimiento.Cuenta === '7105' ? 'selected' : ''}>7105</option>
        </select> <!-- Selector for Cuenta -->
    </td>
    <td>
        <input type="text" class="form-control" value="${movimiento["Descripción Movimiento"] || ''}" /> <!-- Input for Descripción Movimiento -->
    </td>
    <td>
        <input type="text" class="form-control" value="${movimiento.Referencia || ''}" /> <!-- Input for Referencia -->
    </td>
    <td>
        <input type="text" class="form-control debe-input" value="${movimiento.Debe}" oninput="updateTotals()" /> <!-- Input for Debe -->
    </td>
    <td>
        <input type="text" class="form-control haber-input" value="${movimiento.Haber}" oninput="updateTotals()" /> <!-- Input for Haber -->
    </td>
    <td class="text-end">
        <button class="btn btn-sm btn-danger" onclick="deleteMovimiento(${movimiento.id})">Eliminar</button>
    </td>
</tr>

            `;
                                        // Append the row to the movimientosRows string
                                        movimientosRows += movimientoRow;
                                    });

                                    // Clear previous Movimientos entries (if any)
                                    $('#movimientos-list').empty(); // Assuming you have a container to list Movimientos

                                    // Append the new rows to the table body
                                    $('#movimientos-list').append(movimientosRows);
                                } else {
                                    // Optionally, you can show a message if there are no movimientos
                                    $('#movimientos-list').append('<tr><td colspan="6" class="text-center">No hay movimientos disponibles</td></tr>');
                                }
                                updateTotals();
                            }




                            $('#editDocument').on('shown.bs.modal', function(e) {
                                // Get the edit button that triggered the modal
                                var editButton = $(e.relatedTarget);

                                // Populate the modal fields with the document's information
                                populateModalFields(editButton);
                            });




                            // Function to add a new row
                            function addNewMovimiento() {
                                const newMovimientoRow = `
<tr>
    <td>
        <select class="form-select select2">
            <option value="" disabled selected>Seleccionar</option>
            <option value="1105">1105</option>
            <option value="2105">2105</option>
            <option value="5105">5105</option>
            <option value="7105">7105</option>
        </select> <!-- Selector for Cuenta -->
    </td>
    <td>
        <input type="text" class="form-control" placeholder="Descripción" /> <!-- Input for Descripción Movimiento -->
    </td>
    <td>
        <input type="text" class="form-control" placeholder="Referencia" /> <!-- Input for Referencia -->
    </td>
    <td>
        <input type="text" class="form-control debe-input" placeholder="Debe" oninput="updateTotals()" /> <!-- Input for Debe -->
    </td>
    <td>
        <input type="text" class="form-control haber-input" placeholder="Haber" oninput="updateTotals()" /> <!-- Input for Haber -->
    </td>
    <td class="text-end">
        <button class="btn btn-sm btn-danger" onclick="deleteMovimiento2(this)">Eliminar</button>
    </td>
</tr>
    `;
                                $('#movimientos-list').append(newMovimientoRow);
                            }

                            // Attach click event to the add button
                            $('#add-movimiento').on('click', function() {
                                addNewMovimiento();
                            });

                            // Function to add a new row
                            function addNewMovimiento2() {
                                const newMovimientoRow = `
<tr>
    <td>
        <select class="form-select select2">
            <option value="" disabled selected>Seleccionar</option>
            <option value="1105">1105</option>
            <option value="2105">2105</option>
            <option value="5105">5105</option>
            <option value="7105">7105</option>
        </select> <!-- Selector for Cuenta -->
    </td>
    <td>
        <input type="text" class="form-control" placeholder="Descripción" /> <!-- Input for Descripción Movimiento -->
    </td>
    <td>
        <input type="text" class="form-control" placeholder="Referencia" /> <!-- Input for Referencia -->
    </td>
    <td>
        <input type="text" class="form-control debe-input-1" placeholder="Debe" oninput="calculateTotals()" /> <!-- Input for Debe -->
    </td>
    <td>
        <input type="text" class="form-control haber-input-1" placeholder="Haber" oninput="calculateTotals()" /> <!-- Input for Haber -->
    </td>
    <td class="text-end">
        <button class="btn btn-sm btn-danger" onclick="deleteMovimiento(this)">Eliminar</button>
    </td>
</tr>
    `;
                                $('#movimientos-list-2').append(newMovimientoRow);
                            }

                            // Attach click event to the add button
                            $('#add-movimiento-2').on('click', function() {
                                addNewMovimiento2();
                            });

                            $(document).ready(function() {
                                // Function to populate a new empty movimiento row
                                function populateEmptyMovimientos() {
                                    const emptyRow = `
            <tr>
                <td>
                    <select class="form-select select2">
                        <option value="" disabled selected>Seleccionar</option>
                        <option value="1105">1105</option>
                        <option value="2105">2105</option>
                        <option value="5105">5105</option>
                        <option value="7105">7105</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="form-control" value="" placeholder="Descripción" /> <!-- Input for Descripción Movimiento -->
                </td>
                <td>
                    <input type="text" class="form-control" value="" placeholder="Referencia" /> <!-- Input for Referencia -->
                </td>
                <td>
                    <input type="text" class="form-control debe-input" value="" placeholder="Debe" oninput="updateMovementTotals()" /> <!-- Input for Debe -->
                </td>
                <td>
                    <input type="text" class="form-control haber-input" value="" placeholder="Haber" oninput="updateMovementTotals()" /> <!-- Input for Haber -->
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-danger" onclick="deleteEmptyMovimiento(this)">Eliminar</button>
                </td>
            </tr>
        `;

                                    // Append the empty row to movimientos-list-2
                                    $('#movimientos-list-2').append(emptyRow);
                                }

                                // Bind click event to the button
                                $('#add-movimiento').on('click', function() {
                                    populateEmptyMovimientos();
                                });

                                // Function to delete a movimiento row (you may want to keep this for dynamically added rows)
                                window.deleteEmptyMovimiento = function(button) {
                                    $(button).closest('tr').remove();
                                }

                                // Initial check to hide the no-data message on page load
                                // Assuming you want to show it if there are no rows at some point
                                function checkTableData() {
                                    const rows = $('#movimientos-list-2 tr');
                                    if (rows.length > 1) { // Adjusting for the default row
                                        $('#no-data-message').hide();
                                    } else {
                                        $('#no-data-message').show();
                                    }
                                }

                                checkTableData(); // Call on load to set initial visibility
                            });

                            function deleteMovimiento(button) {
                                // Remove the row containing the button
                                $(button).closest('tr').remove();
                                // Update totals if necessary
                                updateTotals();
                            }

                            function deleteMovimiento2(button) {
                                // Remove the row containing the button
                                $(button).closest('tr').remove();

                                // Update totals
                                calculateTotals();

                                // Reattach input event listeners after deleting a row
                                attachInputListeners();
                            }

                            function attachInputListeners() {
                                // Clear existing listeners
                                document.querySelectorAll('.debe-input-1, .haber-input-1').forEach(input => {
                                    input.removeEventListener('input', calculateTotals);
                                });

                                // Add new input listeners
                                document.querySelectorAll('.debe-input-1, .haber-input-1').forEach(input => {
                                    input.addEventListener('input', calculateTotals);
                                });
                            }

                            attachInputListeners();

                            $(document).ready(function() {
                                // Existing code for opening the modal and populating bill content
                                $('[data-bs-toggle="modal"]').on('click', function() {
                                    const number = $(this).data('number');
                                    const date = $(this).data('date');
                                    const description = $(this).data('descripcion');
                                    const tipoTercero = $(this).data('tipo-tercero');
                                    const tercero = $(this).data('tercero');
                                    const centroCostos = $(this).data('centro-costos');
                                    const movimientos = $(this).data('movimientos');

                                    let billHTML = `
            <h4>Documento #${number}</h4>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Descripción:</strong> ${description}</p>
            <p><strong>Tipo Tercera Persona:</strong> ${tipoTercero}</p>
            <p><strong>Tercera Persona:</strong> ${tercero}</p>
            <p><strong>Centro de Costos:</strong> ${centroCostos}</p>
            <h5>Movimientos:</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Referencia</th>
                        <th>Debe</th>
                        <th>Haber</th>
                        <th>Cuenta</th>
                        <th>Descripción Movimiento</th>
                    </tr>
                </thead>
                <tbody>`;

                                    movimientos.forEach((movimiento, index) => {
                                        billHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${movimiento.Referencia}</td>
                    <td>${movimiento.Debe}</td>
                    <td>${movimiento.Haber}</td>
                    <td>${movimiento.Cuenta}</td>
                    <td>${movimiento['Descripción Movimiento']}</td>
                </tr>`;
                                    });

                                    billHTML += `
                </tbody>
            </table>
        `;

                                    $('#billContent').html(billHTML);
                                });

                                // Event listener for the print button
                                $('.btn.btn-primary.my-0').on('click', function() {
                                    // Get the content of the bill
                                    const billContent = document.getElementById('billContent').innerHTML;

                                    // Open a new window
                                    const printWindow = window.open('', '', 'height=600,width=800');

                                    // Write the content into the new window
                                    printWindow.document.write(`
            <html>
            <head>
                <title>Print Bill</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    ${billContent}
                </div>
            </body>
            </html>
        `);

                                    // Close the document to ensure all elements are rendered
                                    printWindow.document.close();

                                    // Wait for the content to load before calling print
                                    printWindow.onload = function() {
                                        printWindow.print();
                                        printWindow.close();
                                    };
                                });
                            });



                            // Function to print the bill
                            function printBill() {
                                const printContent = document.getElementById('billContent').innerHTML;
                                const printWindow = window.open('', '', 'height=600,width=800');
                                printWindow.document.write('<html><head><title>Bill</title></head><body>');
                                printWindow.document.write(printContent);
                                printWindow.document.write('</body></html>');
                                printWindow.document.close();
                                printWindow.print();
                            }


                            // Call the function to initialize the delete modal handling
                            //document.addEventListener('DOMContentLoaded', handleDeleteModal);

                            // Call the function to initialize the modal handling
                            //document.addEventListener('DOMContentLoaded', handleEditModal);

                            // Call the function on page load
                            document.addEventListener('DOMContentLoaded', createInputFields);

                            // Call the function on page load
                            document.addEventListener('DOMContentLoaded', updateTableOnAccordionClick);


                            showSections("content-plan-cuentas");
                        </script>
<?php
include "../menu.php";
include "../header.php";
include "./includes/modals/NuevaFacturaCompraModal.php";
?>

<link href="./assets/css/styles.css" rel="stylesheet">
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Registrar Facturas de Compra</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="col-10">
                        <div class="col-12 row col-md-auto">
                            <div class="col-9">
                                <h2 class="mb-0">Factura de compra</h2>
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
                        <div class="mb-8" id="content-info-doctores">

                            <div class="container mt-2">
                                <div class="col-12">
                                    <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy" id="navbar-deals-detail">
                                        <ul class="nav nav-underline fs-9" role="tablist">
                                            <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-facturas-facturas')">Facturacion
                                                    Compras</a></li>
                                            <!-- <li class="nav-item"><a class="nav-link" onclick="showSections('content-facturas-compras')">Facturacion Compras</a></li> -->
                                            <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-facturas-ndebito')">Persona Natural</a></li>
                                            <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-facturas-ncredito')">Persona Jurídica</a></li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            <div class="row gx-3 gy-4 mb-5">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="table-responsive mb-4 mt-4">
                                            <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                                                <thead>
                                                    <tr>
                                                        <th class="sort border-top custom-th" data-sort="nombre">Nombre</th>
                                                        <th class="sort border-top custom-th" data-sort="cedula">Cédula</th>
                                                        <th class="sort border-top custom-th" data-sort="direccion">Dirección</th>
                                                        <th class="sort border-top custom-th" data-sort="telefono">Teléfono</th>
                                                        <th class="sort border-top custom-th" data-sort="whatsApp">WhatsApp</th>
                                                        <th class="sort border-top custom-th" data-sort="correo">Correo</th>
                                                        <th class="sort text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody class="list">
                                                    <?php
                                                    $arraytest = [
                                                        [
                                                            "Nombre" => "Juan Pérez",
                                                            "Cédula" => "2025-10-18",
                                                            "Dirección" => "Camilo Cruz",
                                                            "Teléfono" => "555-1234",
                                                            "WhatsApp" => "3128527452",
                                                            "Correo" => "juan.perez@example.com"
                                                        ],

                                                    ];

                                                    foreach ($arraytest as $value) { ?>
                                                        <tr>
                                                            <td class="align-middle custom-td"><?= $value["Nombre"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Cédula"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Dirección"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Teléfono"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["WhatsApp"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Correo"] ?></td>
                                                            <td class="align-middle white-space-nowrap pe-0 p-3">
                                                                <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                                                                    <button class="btn btn-outline-primary me-1 mb-1 rounded-pill" type="button" id="modalNewInvoicePurchaseButton"><i class="fas fa-file-invoice success"></i> Generar compra
                                                                    </button>
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
                </div>
            </div>
        </div>
    </div>
</div>
<?php include "../footer.php"; ?>
<script>
    document.getElementById('modalNewInvoicePurchaseButton').addEventListener('click', function() {

        var myModal = new bootstrap.Modal(document.getElementById('modalNewInvoicePurchase'));
        myModal.show();
    });
</script>



<script src="./assets/js/main.js"></script>
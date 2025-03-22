<?php
include "../../menu.php";
include '../../header.php';

$patients = [
    [
        "nombre" => "Juan Pérez",
        "telefono" => "+57 321 456 7890",
        "pais" => "Colombia",
        "correo" => "juan.perez@example.com",
        "fecha_registro" => "2024-01-15",
        "genero" => "Masculino",
        "direccion" => "Cra 45 #23-10, Bogotá",
        "telefono_alt" => "+57 311 789 4561",
        "profesion" => "Médico"
    ],
    [
        "nombre" => "María Gómez",
        "telefono" => "+52 555 678 9012",
        "pais" => "México",
        "correo" => "maria.gomez@example.com",
        "fecha_registro" => "2024-02-20",
        "genero" => "Femenino",
        "direccion" => "Av. Reforma 123, CDMX",
        "telefono_alt" => "+52 554 123 6789",
        "profesion" => "Ingeniera"
    ],
    [
        "nombre" => "Carlos Rodríguez",
        "telefono" => "+1 305 123 4567",
        "pais" => "Estados Unidos",
        "correo" => "carlos.rod@example.com",
        "fecha_registro" => "2024-03-05",
        "genero" => "Masculino",
        "direccion" => "742 Evergreen Terrace, Springfield",
        "telefono_alt" => "+1 786 654 3210",
        "profesion" => "Abogado"
    ],
    [
        "nombre" => "Ana Martínez",
        "telefono" => "+34 678 987 654",
        "pais" => "España",
        "correo" => "ana.martinez@example.com",
        "fecha_registro" => "2024-04-10",
        "genero" => "Femenino",
        "direccion" => "Calle Gran Vía 20, Madrid",
        "telefono_alt" => "+34 679 321 876",
        "profesion" => "Diseñadora"
    ]
];
$patientsJson = json_encode($patients);
?>

<!DOCTYPE html>
<html lang="en-US" dir="ltr" data-navigation-type="default" data-navbar-horizontal-shape="default">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <!-- ===============================================-->
    <!--    Document Title-->
    <!-- ===============================================-->
    <title>Phoenix</title>


    <!-- ===============================================-->
    <!--    Favicons-->
    <!-- ===============================================-->
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/img/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/img/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../assets/img/favicons/favicon-16x16.png">
    <link rel="shortcut icon" type="image/x-icon" href="../assets/img/favicons/favicon.ico">
    <link rel="manifest" href="../assets/img/favicons/manifest.json">
    <meta name="msapplication-TileImage" content="../assets/img/favicons/mstile-150x150.png">
    <meta name="theme-color" content="#ffffff">
    <script src="../vendors/simplebar/simplebar.min.js"></script>
    <script src="../assets/js/config.js"></script>


    <!-- ===============================================-->
    <!--    Stylesheets-->
    <!-- ===============================================-->
    <link href="../vendors/dropzone/dropzone.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&amp;display=swap" rel="stylesheet">
    <link href="../vendors/simplebar/simplebar.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
    <link href="../assets/css/theme-rtl.css" type="text/css" rel="stylesheet" id="style-rtl">
    <link href="../assets/css/theme.min.css" type="text/css" rel="stylesheet" id="style-default">
    <link href="../assets/css/user-rtl.min.css" type="text/css" rel="stylesheet" id="user-style-rtl">
    <link href="../assets/css/user.min.css" type="text/css" rel="stylesheet" id="user-style-default">
    <script>
        var phoenixIsRTL = window.config.config.phoenixIsRTL;
        if (phoenixIsRTL) {
            var linkDefault = document.getElementById('style-default');
            var userLinkDefault = document.getElementById('user-style-default');
            linkDefault.setAttribute('disabled', true);
            userLinkDefault.setAttribute('disabled', true);
            document.querySelector('html').setAttribute('dir', 'rtl');
        } else {
            var linkRTL = document.getElementById('style-rtl');
            var userLinkRTL = document.getElementById('user-style-rtl');
            linkRTL.setAttribute('disabled', true);
            userLinkRTL.setAttribute('disabled', true);
        }
    </script>
</head>


<body>

    <!-- ===============================================-->
    <!--    Main Content-->
    <!-- ===============================================-->
    <main class="main" id="top">

        <div class="content">
            <div class="pb-9">
                <h2 class="mb-4">Facturas</h2>
                <div class="row g-3 justify-content-between align-items-start mb-4">
                    <!-- <div class="col-auto">
                        <div class="d-flex flex-wrap gap-2">
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-phoenix-secondary text-body dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Exportar
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" id="exportExcel">Excel</a></li>
                                    <li><a class="dropdown-item" href="#" id="exportPDF">PDF</a></li>
                                    <li><a class="dropdown-item" href="#" id="exportXML">XML</a></li>
                                </ul>
                            </div>
                        </div>
                    </div> -->
                    <div class="col-12">
                        <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                            <!-- <li class="nav-item"><a class="nav-link active" id="search-tab" data-bs-toggle="tab" href="#tab-search" role="tab" aria-controls="tab-search" aria-selected="true">Buscador</a></li> -->
                            <li class="nav-item"><a class="nav-link" id="range-dates-tab" data-bs-toggle="tab" href="#tab-range-dates" role="tab" aria-controls="tab-range-dates" aria-selected="false">Filtros</a></li>
                        </ul>
                        <div class="tab-content mt-3" id="myTabContent">
                            <!-- <div class="tab-pane fade show active" id="tab-search" role="tabpanel" aria-labelledby="search-tab">
                                <div class="d-flex">
                                    <div class="search-box me-2 d-none d-xl-block">
                                        <form class="position-relative">
                                            <input class="form-control search-input search" type="search" placeholder="Search by name" aria-label="Search" />
                                            <span class="fas fa-search search-box-icon"></span>

                                        </form>
                                    </div>
                                    <button class="btn px-3 btn-phoenix-secondary me-2 d-xl-none"><span class="fa-solid fa-search"></span></button>
                                </div>
                            </div> -->
                            <div class="tab-pane fade show active" id="tab-range-dates" role="tabpanel" aria-labelledby="range-dates-tab">
                                <div class="d-flex">
                                    <div style="width: 100%;">
                                        <div class="row">
                                            <div class="col-12 mb-3">
                                                <div class="card border border-light">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-6">
                                                                <label class="form-label" for="patients">procedimientos</label>
                                                                <select class="form-select" id="procedure">
                                                                </select>
                                                            </div>
                                                            <div class="col-6">
                                                                <label class="form-label" for="especialistas">Especialistas</label>
                                                                <select class="form-select" id="especialistas">
                                                                </select>
                                                            </div>
                                                            <div class="col-6">
                                                                <label class="form-label" for="patients">Pacientes</label>
                                                                <select class="form-select" id="patients">
                                                                </select>
                                                            </div>
                                                            <div class="col-6">
                                                                <label class="form-label" for="fechasProcedimiento">Fecha incio - fin Procedimiento</label>
                                                                <input class="form-control datetimepicker flatpickr-input" id="fechasProcedimiento" type="text" placeholder="dd/mm/yyyy - dd/mm/yyyy" data-options="{&quot;mode&quot;:&quot;range&quot;,&quot;dateFormat&quot;:&quot;d/m/y&quot;,&quot;disableMobile&quot;:true}" readonly="readonly">
                                                            </div>
                                                            <div class="col-6">
                                                                <label class="form-label" for="entity">Entidad</label>
                                                                <select class="form-select" id="entity">
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="d-flex justify-content-end m-2">
                                                            <button type="button" class="btn btn-primary" id="filterButton">Filtrar</button>
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
                <div class="row gy-5">

                    <!-- <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                        <li class="nav-item"><a class="nav-link active" id="income-tab" data-bs-toggle="tab" href="#tab-income" role="tab" aria-controls="tab-income" aria-selected="true">Ingresos</a></li>
                        <li class="nav-item"><a class="nav-link" id="age-tab" data-bs-toggle="tab" href="#tab-age" role="tab" aria-controls="tab-age" aria-selected="false">Edades</a></li>
                    </ul> -->
                    <!-- <div class="col-xl-5 col-xxl-4 tab-content mt-3" id="myTabContent">
                        <div class="tab-pane fade show active" id="tab-income" role="tabpanel" aria-labelledby="income-tab">
                            <div class="col-fixed">
                                <div class="card">
                                    <div class="card-body">
                                        <canvas id="echartIncome" class="echart-income mb-5" style="height:358px; width:100%"></canvas>
                                        <div class="table-responsive scrollbar">
                                            <table class="reports-details-chart-table table table-sm fs-9 mb-0">
                                                <thead>
                                                    <tr>
                                                        <th class="align-middle pe- text-body-tertiary fw-bold fs-10 text-uppercase text-nowrap ps-0" scope="col" style="width:35%;">Mes</th>
                                                        <th class="align-middle text-end ps-4 text-body-tertiary fw-bold fs-10 text-uppercase text-nowrap" scope="col" style="width:35%;">Conteo</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="list" id="report-data-body">
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">Enero</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">12</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">Febrero</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">80</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">Marzo</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">3</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">Abril</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">5</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">Mayo</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">30</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">Junio</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">40</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="tab-age" role="tabpanel" aria-labelledby="age-tab">
                            <div class="col-fixed">
                                <div class="card">
                                    <div class="card-body">
                                        <canvas id="echartAge" class="echart-age mb-5" style="height:358px; width:100%"></canvas>
                                        <div class="table-responsive scrollbar">
                                            <table class="reports-details-chart-table table table-sm fs-9 mb-0">
                                                <thead>
                                                    <tr>
                                                        <th class="align-middle pe- text-body-tertiary fw-bold fs-10 text-uppercase text-nowrap ps-0" scope="col" style="width:35%;">Edad</th>
                                                        <th class="align-middle text-end ps-4 text-body-tertiary fw-bold fs-10 text-uppercase text-nowrap" scope="col" style="width:35%;">Conteo</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="list" id="report-data-body">
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">18-25</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">12</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">25-30</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">80</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">30-45</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">3</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">45-55</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">5</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">55-70</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">2</td>
                                                    </tr>
                                                    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                                                        <td class="align-middle white-space-nowrap fw-semibold text-body-highlight py-2">70^</td>
                                                        <td class="align-middle text-end white-space-nowrap fw-semibold text-body-highlight ps-4 py-2">3</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <div class="col-12 col-xxl-8">
                        <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                            <li class="nav-item"><a class="nav-link active" id="procedures-tab" data-bs-toggle="tab" href="#tab-procedures" role="tab" aria-controls="tab-procedures" aria-selected="true">Procedimientos</a></li>
                            <li class="nav-item"><a class="nav-link" id="entities-tab" data-bs-toggle="tab" href="#tab-entities" role="tab" aria-controls="tab-entities" aria-selected="false">Entidades</a></li>
                            <li class="nav-item"><a class="nav-link" id="paymentsMethods-tab" data-bs-toggle="tab" href="#tab-paymentsMethods" role="tab" aria-controls="tab-paymentsMethods" aria-selected="false">Metodos de pago</a></li>
                        </ul>

                        <div class="col-12 col-xxl-4 tab-content mt-3" id="myTabContent">
                            <div class="tab-pane fade show active" id="tab-procedures" role="tabpanel" aria-labelledby="procedures-tab">
                                <div class="border-top border-translucent">
                                    <div id="purchasersSellersTable" data-list='{"valueNames":["deals_name","deal_owner","account_name","stage","amount"],"page":10,"pagination":true}'>
                                        <div class="table-responsive scrollbar mx-n1 px-1">
                                            <table class="table table-sm fs-9 leads-table">
                                                <thead>

                                                </thead>
                                                <tbody id="list-billing">
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="row align-items-center justify-content-between pe-0 fs-9">
                                            <div class="col-auto d-flex">
                                                <p class="mb-0 d-none d-sm-block me-3 fw-semibold text-body" data-list-info="data-list-info"></p><a class="fw-semibold" href="#!" data-list-view="*">View all<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a class="fw-semibold d-none" href="#!" data-list-view="less">View Less<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
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
                            <div class="tab-pane fade" id="tab-entities" role="tabpanel" aria-labelledby="entities-tab">
                                <div class="border-top border-translucent">
                                    <div id="purchasersSellersTable" data-list='{"valueNames":["deals_name","deal_owner","account_name","stage","amount"],"page":10,"pagination":true}'>
                                        <div class="table-responsive scrollbar mx-n1 px-1">
                                            <table class="table table-sm fs-9 leads-table">
                                                <thead>

                                                </thead>
                                                <tbody id="list-entities" class="row">
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="row align-items-center justify-content-between pe-0 fs-9">
                                            <div class="col-auto d-flex">
                                                <p class="mb-0 d-none d-sm-block me-3 fw-semibold text-body" data-list-info="data-list-info"></p><a class="fw-semibold" href="#!" data-list-view="*">View all<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a class="fw-semibold d-none" href="#!" data-list-view="less">View Less<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
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

                            <div class="tab-pane fade" id="tab-paymentsMethods" role="tabpanel" aria-labelledby="paymentsMethods-tab">
                                <div class="border-top border-translucent">
                                    <div id="purchasersSellersTable" data-list='{"valueNames":["deals_name","deal_owner","account_name","stage","amount"],"page":10,"pagination":true}'>
                                        <div class="table-responsive scrollbar mx-n1 px-1">
                                            <table class="table table-sm fs-9 leads-table">
                                                <thead>

                                                </thead>
                                                <tbody id="list-payments-methods" class="row">
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="row align-items-center justify-content-between pe-0 fs-9">
                                            <div class="col-auto d-flex">
                                                <p class="mb-0 d-none d-sm-block me-3 fw-semibold text-body" data-list-info="data-list-info"></p><a class="fw-semibold" href="#!" data-list-view="*">View all<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a class="fw-semibold d-none" href="#!" data-list-view="less">View Less<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
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
                </div>
            </div>
            <div class="modal fade" id="searchBoxModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="true" data-phoenix-modal="data-phoenix-modal" style="--phoenix-backdrop-opacity: 1;">
                <div class="modal-dialog">
                    <div class="modal-content mt-15 rounded-pill">
                        <div class="modal-body p-0">
                            <div class="search-box navbar-top-search-box" data-list='{"valueNames":["title"]}' style="width: auto;">
                                <form class="position-relative" data-bs-toggle="search" data-bs-display="static">
                                    <input class="form-control search-input fuzzy-search rounded-pill form-control-lg" type="search" placeholder="Search..." aria-label="Search" />
                                    <span class="fas fa-search search-box-icon"></span>

                                </form>
                                <div class="btn-close position-absolute end-0 top-50 translate-middle cursor-pointer shadow-none" data-bs-dismiss="search">
                                    <button class="btn btn-link p-0" aria-label="Close"></button>
                                </div>
                                <div class="dropdown-menu border start-0 py-0 overflow-hidden w-100">
                                    <div class="scrollbar-overlay" style="max-height: 30rem;">
                                        <div class="list pb-3">
                                            <h6 class="dropdown-header text-body-highlight fs-10 py-2">24 <span class="text-body-quaternary">results</span></h6>
                                            <hr class="my-0" />
                                            <h6 class="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Recently Searched </h6>
                                            <div class="py-2"><a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"><span class="fa-solid fa-clock-rotate-left" data-fa-transform="shrink-2"></span> Store Macbook</div>
                                                    </div>
                                                </a>
                                                <a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"> <span class="fa-solid fa-clock-rotate-left" data-fa-transform="shrink-2"></span> MacBook Air - 13″</div>
                                                    </div>
                                                </a>

                                            </div>
                                            <hr class="my-0" />
                                            <h6 class="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Products</h6>
                                            <div class="py-2"><a class="dropdown-item py-2 d-flex align-items-center" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="file-thumbnail me-2"><img class="h-100 w-100 object-fit-cover rounded-3" src="../assets/img/products/60x60/3.png" alt="" /></div>
                                                    <div class="flex-1">
                                                        <h6 class="mb-0 text-body-highlight title">MacBook Air - 13″</h6>
                                                        <p class="fs-10 mb-0 d-flex text-body-tertiary"><span class="fw-medium text-body-tertiary text-opactity-85">8GB Memory - 1.6GHz - 128GB Storage</span></p>
                                                    </div>
                                                </a>
                                                <a class="dropdown-item py-2 d-flex align-items-center" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="file-thumbnail me-2"><img class="img-fluid" src="../assets/img/products/60x60/3.png" alt="" /></div>
                                                    <div class="flex-1">
                                                        <h6 class="mb-0 text-body-highlight title">MacBook Pro - 13″</h6>
                                                        <p class="fs-10 mb-0 d-flex text-body-tertiary"><span class="fw-medium text-body-tertiary text-opactity-85">30 Sep at 12:30 PM</span></p>
                                                    </div>
                                                </a>

                                            </div>
                                            <hr class="my-0" />
                                            <h6 class="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Quick Links</h6>
                                            <div class="py-2"><a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"><span class="fa-solid fa-link text-body" data-fa-transform="shrink-2"></span> Support MacBook House</div>
                                                    </div>
                                                </a>
                                                <a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"> <span class="fa-solid fa-link text-body" data-fa-transform="shrink-2"></span> Store MacBook″</div>
                                                    </div>
                                                </a>

                                            </div>
                                            <hr class="my-0" />
                                            <h6 class="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Files</h6>
                                            <div class="py-2"><a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"><span class="fa-solid fa-file-zipper text-body" data-fa-transform="shrink-2"></span> Library MacBook folder.rar</div>
                                                    </div>
                                                </a>
                                                <a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"> <span class="fa-solid fa-file-lines text-body" data-fa-transform="shrink-2"></span> Feature MacBook extensions.txt</div>
                                                    </div>
                                                </a>
                                                <a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"> <span class="fa-solid fa-image text-body" data-fa-transform="shrink-2"></span> MacBook Pro_13.jpg</div>
                                                    </div>
                                                </a>

                                            </div>
                                            <hr class="my-0" />
                                            <h6 class="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Members</h6>
                                            <div class="py-2"><a class="dropdown-item py-2 d-flex align-items-center" href="../pages/members.html">
                                                    <div class="avatar avatar-l status-online  me-2 text-body">
                                                        <img class="rounded-circle " src="../assets/img/team/40x40/10.webp" alt="" />

                                                    </div>
                                                    <div class="flex-1">
                                                        <h6 class="mb-0 text-body-highlight title">Carry Anna</h6>
                                                        <p class="fs-10 mb-0 d-flex text-body-tertiary">anna@technext.it</p>
                                                    </div>
                                                </a>
                                                <a class="dropdown-item py-2 d-flex align-items-center" href="../pages/members.html">
                                                    <div class="avatar avatar-l  me-2 text-body">
                                                        <img class="rounded-circle " src="../assets/img/team/40x40/12.webp" alt="" />

                                                    </div>
                                                    <div class="flex-1">
                                                        <h6 class="mb-0 text-body-highlight title">John Smith</h6>
                                                        <p class="fs-10 mb-0 d-flex text-body-tertiary">smith@technext.it</p>
                                                    </div>
                                                </a>

                                            </div>
                                            <hr class="my-0" />
                                            <h6 class="dropdown-header text-body-highlight fs-9 border-bottom border-translucent py-2 lh-sm">Related Searches</h6>
                                            <div class="py-2"><a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"><span class="fa-brands fa-firefox-browser text-body" data-fa-transform="shrink-2"></span> Search in the Web MacBook</div>
                                                    </div>
                                                </a>
                                                <a class="dropdown-item" href="../apps/e-commerce/landing/product-details.html">
                                                    <div class="d-flex align-items-center">

                                                        <div class="fw-normal text-body-highlight title"> <span class="fa-brands fa-chrome text-body" data-fa-transform="shrink-2"></span> Store MacBook″</div>
                                                    </div>
                                                </a>

                                            </div>
                                        </div>
                                        <div class="text-center">
                                            <p class="fallback fw-bold fs-7 d-none">No Result Found.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                var navbarTopStyle = window.config.config.phoenixNavbarTopStyle;
                var navbarTop = document.querySelector('.navbar-top');
                if (navbarTopStyle === 'darker') {
                    navbarTop.setAttribute('data-navbar-appearance', 'darker');
                }

                var navbarVerticalStyle = window.config.config.phoenixNavbarVerticalStyle;
                var navbarVertical = document.querySelector('.navbar-vertical');
                if (navbarVertical && navbarVerticalStyle === 'darker') {
                    navbarVertical.setAttribute('data-navbar-appearance', 'darker');
                }
            </script>
            <div class="support-chat-container">
                <div class="container-fluid support-chat">
                    <div class="card bg-body-emphasis">
                        <div class="card-header d-flex flex-between-center px-4 py-3 border-bottom border-translucent">
                            <h5 class="mb-0 d-flex align-items-center gap-2">Demo widget<span class="fa-solid fa-circle text-success fs-11"></span></h5>
                            <div class="btn-reveal-trigger">
                                <button class="btn btn-link p-0 dropdown-toggle dropdown-caret-none transition-none d-flex" type="button" id="support-chat-dropdown" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h text-body"></span></button>
                                <div class="dropdown-menu dropdown-menu-end py-2" aria-labelledby="support-chat-dropdown"><a class="dropdown-item" href="#!">Request a callback</a><a class="dropdown-item" href="#!">Search in chat</a><a class="dropdown-item" href="#!">Show history</a><a class="dropdown-item" href="#!">Report to Admin</a><a class="dropdown-item btn-support-chat" href="#!">Close Support</a></div>
                            </div>
                        </div>
                        <div class="card-body chat p-0">
                            <div class="d-flex flex-column-reverse scrollbar h-100 p-3">
                                <div class="text-end mt-6"><a class="mb-2 d-inline-flex align-items-center text-decoration-none text-body-emphasis bg-body-hover rounded-pill border border-primary py-2 ps-4 pe-3" href="#!">
                                        <p class="mb-0 fw-semibold fs-9">I need help with something</p><span class="fa-solid fa-paper-plane text-primary fs-9 ms-3"></span>
                                    </a><a class="mb-2 d-inline-flex align-items-center text-decoration-none text-body-emphasis bg-body-hover rounded-pill border border-primary py-2 ps-4 pe-3" href="#!">
                                        <p class="mb-0 fw-semibold fs-9">I can’t reorder a product I previously ordered</p><span class="fa-solid fa-paper-plane text-primary fs-9 ms-3"></span>
                                    </a><a class="mb-2 d-inline-flex align-items-center text-decoration-none text-body-emphasis bg-body-hover rounded-pill border border-primary py-2 ps-4 pe-3" href="#!">
                                        <p class="mb-0 fw-semibold fs-9">How do I place an order?</p><span class="fa-solid fa-paper-plane text-primary fs-9 ms-3"></span>
                                    </a><a class="false d-inline-flex align-items-center text-decoration-none text-body-emphasis bg-body-hover rounded-pill border border-primary py-2 ps-4 pe-3" href="#!">
                                        <p class="mb-0 fw-semibold fs-9">My payment method not working</p><span class="fa-solid fa-paper-plane text-primary fs-9 ms-3"></span>
                                    </a>
                                </div>
                                <div class="text-center mt-auto">
                                    <div class="avatar avatar-3xl status-online"><img class="rounded-circle border border-3 border-light-subtle" src="../assets/img/team/30.webp" alt="" /></div>
                                    <h5 class="mt-2 mb-3">Eric</h5>
                                    <p class="text-center text-body-emphasis mb-0">Ask us anything – we’ll get back to you here or by email within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer d-flex align-items-center gap-2 border-top border-translucent ps-3 pe-4 py-3">
                            <div class="d-flex align-items-center flex-1 gap-3 border border-translucent rounded-pill px-4">
                                <input class="form-control outline-none border-0 flex-1 fs-9 px-0" type="text" placeholder="Write message" />
                                <label class="btn btn-link d-flex p-0 text-body-quaternary fs-9 border-0" for="supportChatPhotos"><span class="fa-solid fa-image"></span></label>
                                <input class="d-none" type="file" accept="image/*" id="supportChatPhotos" />
                                <label class="btn btn-link d-flex p-0 text-body-quaternary fs-9 border-0" for="supportChatAttachment"> <span class="fa-solid fa-paperclip"></span></label>
                                <input class="d-none" type="file" id="supportChatAttachment" />
                            </div>
                            <button class="btn p-0 border-0 send-btn"><span class="fa-solid fa-paper-plane fs-9"></span></button>
                        </div>
                    </div>
                </div>
                <button class="btn btn-support-chat p-0 border border-translucent"><span class="fs-8 btn-text text-primary text-nowrap">Chat demo</span><span class="ping-icon-wrapper mt-n4 ms-n6 mt-sm-0 ms-sm-2 position-absolute position-sm-relative"><span class="ping-icon-bg"></span><span class="fa-solid fa-circle ping-icon"></span></span><span class="fa-solid fa-headset text-primary fs-8 d-sm-none"></span><span class="fa-solid fa-chevron-down text-primary fs-7"></span></button>
            </div>
    </main>
    <!-- ===============================================-->
    <!--    End of Main Content-->
    <!-- ===============================================-->


    <div class="offcanvas offcanvas-end settings-panel border-0" id="settings-offcanvas" tabindex="-1" aria-labelledby="settings-offcanvas">
        <div class="offcanvas-header align-items-start border-bottom flex-column border-translucent">
            <div class="pt-1 w-100 mb-6 d-flex justify-content-between align-items-start">
                <div>
                    <h5 class="mb-2 me-2 lh-sm"><span class="fas fa-palette me-2 fs-8"></span>Theme Customizer</h5>
                    <p class="mb-0 fs-9">Explore different styles according to your preferences</p>
                </div>
                <button class="btn p-1 fw-bolder" type="button" data-bs-dismiss="offcanvas" aria-label="Close"><span class="fas fa-times fs-8"> </span></button>
            </div>
            <button class="btn btn-phoenix-secondary w-100" data-theme-control="reset"><span class="fas fa-arrows-rotate me-2 fs-10"></span>Reset to default</button>
        </div>
        <div class="offcanvas-body scrollbar px-card" id="themeController">
            <div class="setting-panel-item mt-0">
                <h5 class="setting-panel-item-title">Color Scheme</h5>
                <div class="row gx-2">
                    <div class="col-4">
                        <input class="btn-check" id="themeSwitcherLight" name="theme-color" type="radio" value="light" data-theme-control="phoenixTheme" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="themeSwitcherLight"> <span class="mb-2 rounded d-block"><img class="img-fluid img-prototype mb-0" src="../assets/img/generic/default-light.png" alt="" /></span><span class="label-text">Light</span></label>
                    </div>
                    <div class="col-4">
                        <input class="btn-check" id="themeSwitcherDark" name="theme-color" type="radio" value="dark" data-theme-control="phoenixTheme" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="themeSwitcherDark"> <span class="mb-2 rounded d-block"><img class="img-fluid img-prototype mb-0" src="../assets/img/generic/default-dark.png" alt="" /></span><span class="label-text"> Dark</span></label>
                    </div>
                    <div class="col-4">
                        <input class="btn-check" id="themeSwitcherAuto" name="theme-color" type="radio" value="auto" data-theme-control="phoenixTheme" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="themeSwitcherAuto"> <span class="mb-2 rounded d-block"><img class="img-fluid img-prototype mb-0" src="../assets/img/generic/auto.png" alt="" /></span><span class="label-text"> Auto</span></label>
                    </div>
                </div>
            </div>
            <div class="border border-translucent rounded-3 p-4 setting-panel-item bg-body-emphasis">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="setting-panel-item-title mb-1">RTL </h5>
                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input ms-auto" type="checkbox" data-theme-control="phoenixIsRTL" />
                    </div>
                </div>
                <p class="mb-0 text-body-tertiary">Change text direction</p>
            </div>
            <div class="border border-translucent rounded-3 p-4 setting-panel-item bg-body-emphasis">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="setting-panel-item-title mb-1">Support Chat </h5>
                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input ms-auto" type="checkbox" data-theme-control="phoenixSupportChat" />
                    </div>
                </div>
                <p class="mb-0 text-body-tertiary">Toggle support chat</p>
            </div>
            <div class="setting-panel-item">
                <h5 class="setting-panel-item-title">Navigation Type</h5>
                <div class="row gx-2">
                    <div class="col-6">
                        <input class="btn-check" id="navbarPositionVertical" name="navigation-type" type="radio" value="vertical" data-theme-control="phoenixNavbarPosition" data-page-url="../documentation/layouts/vertical-navbar.html" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarPositionVertical"> <span class="rounded d-block"><img class="img-fluid img-prototype d-dark-none" src="../assets/img/generic/default-light.png" alt="" /><img class="img-fluid img-prototype d-light-none" src="../assets/img/generic/default-dark.png" alt="" /></span><span class="label-text">Vertical</span></label>
                    </div>
                    <div class="col-6">
                        <input class="btn-check" id="navbarPositionHorizontal" name="navigation-type" type="radio" value="horizontal" data-theme-control="phoenixNavbarPosition" data-page-url="../documentation/layouts/horizontal-navbar.html" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarPositionHorizontal"> <span class="rounded d-block"><img class="img-fluid img-prototype d-dark-none" src="../assets/img/generic/top-default.png" alt="" /><img class="img-fluid img-prototype d-light-none" src="../assets/img/generic/top-default-dark.png" alt="" /></span><span class="label-text"> Horizontal</span></label>
                    </div>
                    <div class="col-6">
                        <input class="btn-check" id="navbarPositionCombo" name="navigation-type" type="radio" value="combo" data-theme-control="phoenixNavbarPosition" data-page-url="../documentation/layouts/combo-navbar.html" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarPositionCombo"> <span class="rounded d-block"><img class="img-fluid img-prototype d-dark-none" src="../assets/img/generic/nav-combo-light.png" alt="" /><img class="img-fluid img-prototype d-light-none" src="../assets/img/generic/nav-combo-dark.png" alt="" /></span><span class="label-text"> Combo</span></label>
                    </div>
                    <div class="col-6">
                        <input class="btn-check" id="navbarPositionTopDouble" name="navigation-type" type="radio" value="dual-nav" data-theme-control="phoenixNavbarPosition" data-page-url="../documentation/layouts/dual-nav.html" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarPositionTopDouble"> <span class="rounded d-block"><img class="img-fluid img-prototype d-dark-none" src="../assets/img/generic/dual-light.png" alt="" /><img class="img-fluid img-prototype d-light-none" src="../assets/img/generic/dual-dark.png" alt="" /></span><span class="label-text"> Dual nav</span></label>
                    </div>
                </div>
            </div>
            <div class="setting-panel-item">
                <h5 class="setting-panel-item-title">Vertical Navbar Appearance</h5>
                <div class="row gx-2">
                    <div class="col-6">
                        <input class="btn-check" id="navbar-style-default" type="radio" name="config.name" value="default" data-theme-control="phoenixNavbarVerticalStyle" />
                        <label class="btn d-block w-100 btn-navbar-style fs-9" for="navbar-style-default"> <img class="img-fluid img-prototype d-dark-none" src="../assets/img/generic/default-light.png" alt="" /><img class="img-fluid img-prototype d-light-none" src="../assets/img/generic/default-dark.png" alt="" /><span class="label-text d-dark-none"> Default</span><span class="label-text d-light-none">Default</span></label>
                    </div>
                    <div class="col-6">
                        <input class="btn-check" id="navbar-style-dark" type="radio" name="config.name" value="darker" data-theme-control="phoenixNavbarVerticalStyle" />
                        <label class="btn d-block w-100 btn-navbar-style fs-9" for="navbar-style-dark"> <img class="img-fluid img-prototype d-dark-none" src="../assets/img/generic/vertical-darker.png" alt="" /><img class="img-fluid img-prototype d-light-none" src="../assets/img/generic/vertical-lighter.png" alt="" /><span class="label-text d-dark-none"> Darker</span><span class="label-text d-light-none">Lighter</span></label>
                    </div>
                </div>
            </div>
            <div class="setting-panel-item">
                <h5 class="setting-panel-item-title">Horizontal Navbar Shape</h5>
                <div class="row gx-2">
                    <div class="col-6">
                        <input class="btn-check" id="navbarShapeDefault" name="navbar-shape" type="radio" value="default" data-theme-control="phoenixNavbarTopShape" data-page-url="../documentation/layouts/horizontal-navbar.html" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarShapeDefault"> <span class="mb-2 rounded d-block"><img class="img-fluid img-prototype d-dark-none mb-0" src="../assets/img/generic/top-default.png" alt="" /><img class="img-fluid img-prototype d-light-none mb-0" src="../assets/img/generic/top-default-dark.png" alt="" /></span><span class="label-text">Default</span></label>
                    </div>
                    <div class="col-6">
                        <input class="btn-check" id="navbarShapeSlim" name="navbar-shape" type="radio" value="slim" data-theme-control="phoenixNavbarTopShape" data-page-url="../documentation/layouts/horizontal-navbar.html#horizontal-navbar-slim" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarShapeSlim"> <span class="mb-2 rounded d-block"><img class="img-fluid img-prototype d-dark-none mb-0" src="../assets/img/generic/top-slim.png" alt="" /><img class="img-fluid img-prototype d-light-none mb-0" src="../assets/img/generic/top-slim-dark.png" alt="" /></span><span class="label-text"> Slim</span></label>
                    </div>
                </div>
            </div>
            <div class="setting-panel-item">
                <h5 class="setting-panel-item-title">Horizontal Navbar Appearance</h5>
                <div class="row gx-2">
                    <div class="col-6">
                        <input class="btn-check" id="navbarTopDefault" name="navbar-top-style" type="radio" value="default" data-theme-control="phoenixNavbarTopStyle" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarTopDefault"> <span class="mb-2 rounded d-block"><img class="img-fluid img-prototype d-dark-none mb-0" src="../assets/img/generic/top-default.png" alt="" /><img class="img-fluid img-prototype d-light-none mb-0" src="../assets/img/generic/top-style-darker.png" alt="" /></span><span class="label-text">Default</span></label>
                    </div>
                    <div class="col-6">
                        <input class="btn-check" id="navbarTopDarker" name="navbar-top-style" type="radio" value="darker" data-theme-control="phoenixNavbarTopStyle" />
                        <label class="btn d-inline-block btn-navbar-style fs-9" for="navbarTopDarker"> <span class="mb-2 rounded d-block"><img class="img-fluid img-prototype d-dark-none mb-0" src="../assets/img/generic/navbar-top-style-light.png" alt="" /><img class="img-fluid img-prototype d-light-none mb-0" src="../assets/img/generic/top-style-lighter.png" alt="" /></span><span class="label-text d-dark-none">Darker</span><span class="label-text d-light-none">Lighter</span></label>
                    </div>
                </div>
            </div><a class="bun btn-primary d-grid mb-3 text-white mt-5 btn btn-primary" href="https://themes.getbootstrap.com/product/phoenix-admin-dashboard-webapp-template/" target="_blank">Purchase template</a>
        </div>
    </div>


    <!-- ===============================================-->
    <!--    JavaScripts-->
    <!-- ===============================================-->
    <script src="../vendors/popper/popper.min.js"></script>
    <script src="../vendors/bootstrap/bootstrap.min.js"></script>
    <script src="../vendors/anchorjs/anchor.min.js"></script>
    <script src="../vendors/is/is.min.js"></script>
    <script src="../vendors/fontawesome/all.min.js"></script>
    <script src="../vendors/lodash/lodash.min.js"></script>
    <script src="../vendors/list.js/list.min.js"></script>
    <script src="../vendors/feather-icons/feather.min.js"></script>
    <script src="../vendors/dayjs/dayjs.min.js"></script>
    <script src="../vendors/dropzone/dropzone-min.js"></script>
    <script src="../vendors/echarts/echarts.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"></script>

    <script>
        const charts = {};

        function renderBarChart(elementId, labels, data, label) {

            const ctx = document.getElementById(elementId);
            if (charts[elementId]) {
                charts[elementId].destroy();
            }
            charts[elementId] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        renderBarChart('echartIncome', ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], [12, 80, 3, 5, 30, 40], '# Ingreso por mes');

        document.addEventListener("DOMContentLoaded", function() {
            // Escuchar el evento "shown.bs.tab" de Bootstrap cuando se cambia de pestaña
            document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
                tab.addEventListener("shown.bs.tab", function(event) {
                    // Obtener el ID del tab activo
                    let targetTab = event.target.getAttribute("href").substring(1);

                    // Dependiendo del tab activo, renderizar una gráfica diferente
                    if (targetTab === "tab-income") {
                        renderBarChart('echartIncome', ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], [12, 80, 3, 5, 30, 40], '# Ingreso por mes');
                    } else if (targetTab === "tab-age") {
                        renderBarChart('echartAge', ['18-25', '25-30', '30-45', '45-55', '55-70', '70^'], [12, 80, 3, 5, 2, 3], '# Intervalos de edades');
                    }
                });
            });
        });

        document.getElementById("exportExcel").addEventListener('click', function() {
            /* Create worksheet from HTML DOM TABLE */
            const worksheet = XLSX.utils.json_to_sheet(<?= $patientsJson ?>);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
            /* Export to file (start a download) */

            XLSX.writeFile(workbook, "reporteFacturas.xlsx");
        });


        document.getElementById("exportXML").addEventListener("click", function() {
            // Convertir JSON a XML
            let xmlString = jsonToXml(<?= $patientsJson ?>);

            // Crear y descargar el archivo XML
            let blob = new Blob([xmlString], {
                type: "application/xml"
            });
            let url = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = "reporteFacturas.xml";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

        function jsonToXml(jsonData) {
            let xmlDeclaration = '<xml version="1.0" encoding="UTF-8">\n'; // Declaración separada
            let xmlContent = "<invoices>\n";

            jsonData.forEach(invoice => {
                xmlContent += "  <invoice>\n";
                for (let key in invoice) {
                    xmlContent += `    <${key}>${invoice[key]}</${key}>\n`;
                }
                xmlContent += "  </invoice>\n";
            });

            xmlContent += "</invoices>";
            return xmlDeclaration + xmlContent; // Concatenación final
        }

        document.getElementById("exportPDF").addEventListener("click", function(e) {

            const jsonData = JSON.stringify({
                data: <?= $patientsJson ?>, // Se envía la variable PHP convertida a JSON
                title: "Reporte de facturas"
            });

            fetch('Reportes/generate_pdf.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonData,
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Error al generar el PDF');
                    }
                    return response.blob(); // Convertir la respuesta en un blob
                })
                .then((blob) => {
                    // Crear una URL para el blob
                    const url = window.URL.createObjectURL(blob);

                    // Crear un enlace para descargar el PDF
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'reporteFacturas.pdf'; // Nombre del archivo
                    link.target = '_blank'; // Abre en una nueva pestaña
                    link.click();

                    // Liberar la URL del blob
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    </script>

</body>

</html>

<?php
include '../../footer.php';
?>

<script type="module">
    import {
        productService,
        userService,
        patientService,
        billingService,
        entityService
    } from "../../services/api/index.js";

    let rangeDates;

    document.addEventListener('DOMContentLoaded', async function() {
        const today = new Date();
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(today.getDate() - 5);
        const formattedToday = today.toLocaleDateString('en-GB').split('/').map((part, index) => index === 2 ? part.slice(-2) : part).join('/');
        const formattedFiveDaysAgo = fiveDaysAgo.toLocaleDateString('en-GB').split('/').map((part, index) => index === 2 ? part.slice(-2) : part).join('/');
        document.getElementById('fechasProcedimiento').value = `${formattedFiveDaysAgo} to ${formattedToday}`;
        await cargarProcedimientos();
        await cargarEspecialistas();
        await cargarPacientes();
        await createSelectEntities();
        await obtenerDatos();
    })

    async function createSelectEntities() {
        const entities = await entityService.getAll();

        const select = document.getElementById("entity");
        select.innerHTML = '<option selected disabled value="0">Seleccione</option>';

        if (entities.data.length) {

            entities.data.forEach(entity => {
                const option = document.createElement("option");
                option.value = entity.id;
                option.textContent = entity.name;
                select.appendChild(option);
            });

        }
        configurarSelectEntites();
    }

    function configurarSelectEntites() {
        // Obtenemos la referencia al select
        const select = document.getElementById('entity');

        if (typeof Choices !== 'undefined') {
            const choices = new Choices(select, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    async function cargarProcedimientos() {
        const selectProcedimientos = document.getElementById('procedure');
        let procedimientos = await productService.getAllProducts();

        selectProcedimientos.innerHTML = '';

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Seleccione procedimientos...';
        placeholderOption.setAttribute('placeholder', ''); // Atributo especial para Choices
        selectProcedimientos.appendChild(placeholderOption);


        if (procedimientos.length) {

            procedimientos.forEach(procedure => {
                const option = document.createElement("option");
                option.value = procedure.id;
                option.textContent = procedure.attributes.name;
                selectProcedimientos.appendChild(option);
            });

        }
        configurarSelectProcedimientosMultiple();
    }

    function configurarSelectProcedimientosMultiple() {
        const procedure = document.getElementById('procedure');

        procedure.setAttribute('multiple', 'multiple');

        // Choices.js
        if (typeof Choices !== 'undefined') {
            const choices = new Choices(procedure, {
                removeItemButton: true,
                placeholder: true,
            });
        }
    }

    async function cargarEspecialistas() {
        const selectEspecialistas = document.getElementById('especialistas');
        const especialistas = await userService.getAllUsers();

        selectEspecialistas.innerHTML = '';

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Seleccione especialistas...';
        placeholderOption.setAttribute('placeholder', '');
        selectEspecialistas.appendChild(placeholderOption);

        especialistas.forEach(especialista => {
            const optionEsp = document.createElement('option');

            optionEsp.value = especialista.id;
            optionEsp.textContent = especialista.first_name + " " + especialista.last_name + " - " + especialista.specialty.name;

            selectEspecialistas.appendChild(optionEsp);
        });
        configurarSelectEspecialistasMultiple();
    }

    async function cargarPacientes() {
        const selectPacientes = document.getElementById('patients');
        const pacientes = await patientService.getAll();

        selectPacientes.innerHTML = '';

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Seleccione pacientes...';
        placeholderOption.setAttribute('placeholder', '');
        selectPacientes.appendChild(placeholderOption);

        pacientes.forEach(paciente => {
            const optionPac = document.createElement('option');

            optionPac.value = paciente.id;
            optionPac.textContent = paciente.first_name + " " + paciente.last_name;

            selectPacientes.appendChild(optionPac);
        });
        configurarSelectPacientesMultiple();
    }



    function configurarSelectEspecialistasMultiple() {
        const especialistas = document.getElementById('especialistas');

        especialistas.setAttribute('multiple', 'multiple');

        // Choices.js
        if (typeof Choices !== 'undefined') {
            const choices = new Choices(especialistas, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    function configurarSelectPacientesMultiple() {
        const patients = document.getElementById('patients');

        patients.setAttribute('multiple', 'multiple');

        // Choices.js
        if (typeof Choices !== 'undefined') {
            const choices = new Choices(patients, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    async function obtenerDatos(filterParams = {}) {

        let data = await billingService.getBillingReport(filterParams);
        generarTablaProcedimientos(data);
        generateEntitiesTable(data);
        generatePaymentsTable(data);

    }

    function generarTablaProcedimientos(data) {
        const tbody = document.getElementById('list-billing');
        const thead = document.querySelector('.table thead');

        // Limpiar tabla
        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Obtener datos únicos
        const usuariosUnicos = [...new Set(data.map(item => item.billing_user))];
        const procedimientosUnicos = [...new Set(data.flatMap(item =>
            item.billed_procedure?.map(p => p.product.name) || []
        ))];

        // Crear estructura de datos para la tabla
        const datosTabla = procedimientosUnicos.map(proc => {
            const fila = {
                procedimiento: proc
            };
            usuariosUnicos.forEach(usuario => {
                fila[usuario] = data
                    .filter(item => item.billing_user === usuario)
                    .flatMap(item => item.billed_procedure)
                    .filter(p => p?.product.name === proc)
                    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
            });
            return fila;
        });

        // Crear cabecera de la tabla
        const trHead = document.createElement('tr');
        trHead.innerHTML = `
        <th class="text-start">Procedimiento</th>
        ${usuariosUnicos.map(usuario => `<th>${usuario}</th>`).join('')}
    `;
        thead.appendChild(trHead);

        // Crear cuerpo de la tabla
        datosTabla.forEach(fila => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td class="align-middle ps-3 name">${fila.procedimiento}</td>
            ${usuariosUnicos.map(usuario => `
                <td class="align-middle text-center">
                    ${fila[usuario] ? `$${fila[usuario].toFixed(2)}` : '-'}
                </td>
            `).join('')}
        `;
            tbody.appendChild(tr);
        });

        // Añadir fila de totales
        const trTotal = document.createElement('tr');
        trTotal.classList.add('fw-bold'); // Añadir estilo para resaltar
        trTotal.innerHTML = `
        <td class="align-middle ps-3">Total</td>
        ${usuariosUnicos.map(usuario => {
            const total = datosTabla.reduce((sum, fila) => sum + fila[usuario], 0);
            return `
                <td class="align-middle text-center">
                    $${total.toFixed(2)}
                </td>
            `;
        }).join('')}
    `;

        tbody.appendChild(trTotal);
    }

    function generateEntitiesTable(data) {

        data = data.filter(item => item.insurance);

        const entities = new Set();
        const billingUsers = new Set();
        const groupedData = {};
        const totals = {};

        data.forEach(entry => {
            const {
                billing_user,
                insurance,
                billed_procedure
            } = entry;
            const insuranceName = insurance?.name;

            entities.add(insuranceName);
            billingUsers.add(billing_user);

            if (!groupedData[insuranceName]) {
                groupedData[insuranceName] = {};
            }

            if (!groupedData[insuranceName][billing_user]) {
                groupedData[insuranceName][billing_user] = 0;
            }

            if (!totals[billing_user]) {
                totals[billing_user] = 0;
            }

            billed_procedure.forEach(proc => {
                const amount = parseFloat(proc.amount);
                groupedData[insuranceName][billing_user] += amount;
                totals[billing_user] += amount;
            });
        });

        const table = document.getElementById("list-entities");
        table.innerHTML = "";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.classList.add("row", "col-12");
        headerRow.innerHTML = `<th class="col">Entidad</th>` + [...billingUsers].map(user => `<th class="col">${user}</th>`).join("");
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        entities.forEach(entity => {
            const row = document.createElement("tr");
            row.classList.add("row");
            row.innerHTML = `<td class="col">${entity}</td>` + [...billingUsers].map(user => `<td class="col">${groupedData[entity][user] ? groupedData[entity][user].toFixed(2) : "0.00"}</td>`).join("");
            tbody.appendChild(row);
        });

        // Add total row
        const totalRow = document.createElement("tr");
        totalRow.classList.add("row");
        totalRow.innerHTML = `<td class="col"><strong>Total</strong></td>` + [...billingUsers].map(user => `<td class="col"><strong>${totals[user].toFixed(2)}</strong></td>`).join("");
        tbody.appendChild(totalRow);

        table.appendChild(tbody);
    }

    function generatePaymentsTable(data) {
        const paymentMethods = new Set();
        const billingUsers = new Set();
        const groupedData = {};
        const totals = {};

        // Procesar datos
        data.forEach(entry => {
            const {
                billing_user,
                payment_methods
            } = entry;

            billingUsers.add(billing_user);

            payment_methods.forEach(pm => {
                const method = pm.payment_method.method;
                const amount = parseFloat(pm.amount);

                paymentMethods.add(method);

                // Inicializar estructura
                if (!groupedData[method]) {
                    groupedData[method] = {};
                }

                if (!groupedData[method][billing_user]) {
                    groupedData[method][billing_user] = 0;
                }

                if (!totals[billing_user]) {
                    totals[billing_user] = 0;
                }

                // Acumular montos
                groupedData[method][billing_user] += amount;
                totals[billing_user] += amount;
            });
        });

        // Generar tabla
        const table = document.getElementById('list-payments-methods');
        table.innerHTML = '';

        // Crear headers
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.classList.add("row", "col-12");
        headerRow.innerHTML = `<th class="col">Método de Pago</th>` + [...billingUsers].map(user => `<th class="col">${user}</th>`).join("");
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crear body
        const tbody = document.createElement("tbody");
        [...paymentMethods].forEach(method => {
            const row = document.createElement("tr");
            row.classList.add("row");
            row.innerHTML = `<td class="col">${method}</td>` + [...billingUsers].map(user =>
                `<td class="col">${groupedData[method][user]?.toFixed(2) || "0.00"}</td>`
            ).join("");
            tbody.appendChild(row);
        });

        // Fila de totales
        const totalRow = document.createElement("tr");
        totalRow.classList.add("row");
        totalRow.innerHTML = `<td class="col"><strong>Total</strong></td>` + [...billingUsers].map(user =>
            `<td class="col"><strong>${totals[user]?.toFixed(2) || "0.00"}</strong></td>`
        ).join("");
        tbody.appendChild(totalRow);

        table.appendChild(tbody);
    }

    function obtenerFiltros() {
        const entity = document.getElementById('entity').value;
        const procedureSelect = document.getElementById('procedure');
        const selectedProcedures = Array.from(procedureSelect.selectedOptions).map(option => option.value);
        const especialistasSelect = document.getElementById('especialistas');
        const selectedEspecialistas = Array.from(especialistasSelect.selectedOptions).map(option => option.value);
        const pacientesSelect = document.getElementById('patients');
        const selectedPacientes = Array.from(pacientesSelect.selectedOptions).map(option => option.value);
        const fechasProcedimientos = document.getElementById('fechasProcedimiento').value;
        const [fechaInicio, fechaFin] = fechasProcedimientos.split(' to ').map(fecha => {
            const [dia, mes, año] = fecha.split('/');
            return `20${año}-${mes}-${dia}`;
        });

        const paramsFilter = {
            end_date: fechaFin,
            start_date: fechaInicio,
            patient_ids: selectedPacientes.filter(item => item != ''),
            product_ids: selectedProcedures.filter(item => item != ''),
            user_ids: selectedEspecialistas.filter(item => item != ''),
            entity_id: entity === "0" ? "" : entity
        }

        return paramsFilter;
    }

    document.getElementById('filterButton').addEventListener('click', async () => {
        const paramsFilter = await obtenerFiltros();
        await obtenerDatos(paramsFilter);
    });
</script>
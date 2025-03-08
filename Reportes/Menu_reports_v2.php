<?php
include "../menu.php";
include '../header.php';
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
    <link href="../vendors/choices/choices.min.css" rel="stylesheet">
    <link href="../vendors/flatpickr/flatpickr.min.css" rel="stylesheet">
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
            <div class="pb-8">
                <h2 class="mb-4">Reportes</h2>
                <div id="reports" data-list='{"valueNames":["title","text","priority","reportsby","reports","date"],"page":10,"pagination":true}'>
                    <div class="row g-3 justify-content-between mb-2">
                        <div class="col-12">
                            <div class="d-md-flex justify-content-between">
                                <div class="mb-3">
                                    <button class="btn btn-link text-body px-0"><span class="fa-solid fa-file-export fs-9 me-2"></span>Export </button>
                                </div>
                                <div class="d-flex mb-3">
                                    <div class="search-box me-2">
                                        <form class="position-relative">
                                            <input class="form-control search-input search" type="search" placeholder="Search by name" aria-label="Search" />
                                            <span class="fas fa-search search-box-icon"></span>

                                        </form>
                                    </div>
                                    <button class="btn px-3 btn-phoenix-secondary" type="button" data-bs-toggle="modal" data-bs-target="#reportsFilterModal" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fa-solid fa-filter text-primary" data-fa-transform="down-3"></span></button>
                                    <div class="modal fade" id="reportsFilterModal" tabindex="-1">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content border border-translucent">
                                                <form id="addEventForm" autocomplete="off">
                                                    <div class="modal-header justify-content-between border-translucent p-4">
                                                        <h5 class="modal-title text-body-highlight fs-6 lh-sm">Filter</h5>
                                                        <button class="btn p-1 text-danger" type="button" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times fs-9"> </span></button>
                                                    </div>
                                                    <div class="modal-body pt-4 pb-2 px-4">
                                                        <div class="mb-3">
                                                            <label class="fw-bold mb-2 text-body-highlight" for="priority">Priority</label>
                                                            <select class="form-select" id="priority">
                                                                <option value="urgent" selected="selected">Urgent</option>
                                                                <option value="medium">Medium </option>
                                                                <option value="high">High</option>
                                                                <option value="low">Low</option>
                                                            </select>
                                                        </div>
                                                        <div class="mb-3">
                                                            <label class="fw-bold mb-2 text-body-highlight" for="createDate">Create Date</label>
                                                            <select class="form-select" id="createDate">
                                                                <option value="today" selected="selected">Today</option>
                                                                <option value="last7Days">Last 7 Days</option>
                                                                <option value="last30Days">Last 30 Days</option>
                                                                <option value="chooseATimePeriod">Choose a time period</option>
                                                            </select>
                                                        </div>
                                                        <div class="mb-3">
                                                            <label class="fw-bold mb-2 text-body-highlight" for="category">Category</label>
                                                            <select class="form-select" id="category">
                                                                <option value="salesReports" selected="selected">Sales Reports</option>
                                                                <option value="hrReports">HR Reports</option>
                                                                <option value="marketingReports">Marketing Reports</option>
                                                                <option value="administrativeReports">Administrative Reports</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer d-flex justify-content-end align-items-center px-4 pb-4 border-0 pt-3">
                                                        <button class="btn btn-sm btn-phoenix-primary px-4 fs-10 my-0" type="submit"> <span class="fas fa-arrows-rotate me-2 fs-10"></span>Reset</button>
                                                        <button class="btn btn-sm btn-primary px-9 fs-10 my-0" type="submit">Done</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 list" id="reportsList">

                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="RIPS_Report">RIPS</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">RIPS</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>RIPS por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">RIPS</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Registered_patients">Pacientes registrados</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Pacientes registrados - datos personales</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Pacientes registrados</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Clinical_histories_general">Historias clinicas</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Pacientes - historias clínicas</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Historias clínicas</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Clinical_histories_by_patient">Historias clinicas</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">General por paciente - historias clínicas</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Historias clínicas</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Clients">Clientes</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Clientes</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Clientes</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Schedule">Agenda</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Agenda</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Agenda</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Dates_by_status">Citas</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Citas por estado</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Citas</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Invoices">Facturas</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">General de facturas</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Facturas</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Estimates">Presupuestos</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">General de presupuestos</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Presupuestos</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Accounts_receivable">Cuentas a cobrar</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Cuentas a cobrar</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Cuentas a cobrar</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="Sales_commission_by_user">Ventas</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Ventas - comisión por usuario</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Ventas</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <div class="border-bottom border-translucent">
                                        <div class="d-flex align-items-start mb-1">
                                            <div class="form-check mb-0">
                                                <input class="form-check-input" type="checkbox" />
                                            </div>
                                            <div class="d-sm-flex align-items-center ps-2"><a class="fw-bold fs-7 lh-sm title line-clamp-1 me-sm-4" href="../apps/crm/report-details.html">Inventario</a>
                                                <div class="d-flex align-items-center"><span class="fa-solid fa-circle me-1 text-danger" data-fa-transform="shrink-6 up-1"></span><span class="fw-bold fs-9 text-body lh-2">Urgent</span></div>
                                            </div>
                                        </div>
                                        <p class="fs-9 fw-semibold text-body ms-4 text mb-4 ps-2">Inventario - existencia por tipo</p>
                                    </div>
                                    <div class="row g-1 g-sm-3 mt-2 lh-1">
                                        <div class="col-12 col-sm-auto flex-1 text-truncate"><a class="fw-semibold fs-9" href="#!"><span class="fa-regular fa-folder me-2 reportsby"></span>Reportes por email</a></div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="grid" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary reports">Inventario</p>
                                            </div>
                                        </div>
                                        <div class="col-12 col-sm-auto">
                                            <div class="d-flex align-items-center"><span class="me-2" data-feather="clock" style="stroke-width:2;"></span>
                                                <p class="mb-0 fs-9 fw-semibold text-body-tertiary date">Jan 15, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row align-items-center justify-content-between py-2 pe-0 fs-9 mt-2">
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
    <script src="../vendors/choices/choices.min.js"></script>
    <script src="../vendors/flatpickr/flatpickr.min.js"></script>
    <script src="../assets/js/phoenix.js"></script>

</body>

</html>

<?php
include '../footer.php';
?>
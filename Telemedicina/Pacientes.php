<?php
include "../menu.php";
include "../header.php";

?>

<link href="./assets/css/styles.css" rel="stylesheet">
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="col-10">
                        <div class="col-12 row col-md-auto">
                            <div class="col-6">
                                <h2 class="mb-0">Citas telemedicina</h2>
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
                            <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
                                <div class="col-6">
                                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Información de citas</h4>
                                </div>
                            </div>
                            <div class="container">
                                <div class="col-12">
                                    <button class="btn btn-outline-info w-100 rounded-pill" type="button" data-bs-toggle="modal" data-bs-target="#modalReporteVideoConsulta">
                                        <i class="far fa-file-alt"></i> Reporte de video consultas
                                    </button>
                                </div>
                            </div>
                            <div class="row gx-3 gy-4 mb-5">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="table-responsive mb-4 mt-4">
                                            <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                                                <thead>
                                                    <tr>
                                                        <th class="sort border-top custom-th" data-sort="doctor">Doctor</th>
                                                        <th class="sort border-top custom-th" data-sort="fecha">Fecha</th>
                                                        <th class="sort border-top custom-th" data-sort="paciente">Paciente</th>
                                                        <th class="sort border-top custom-th" data-sort="telefono">Teléfono</th>
                                                        <th class="sort border-top custom-th" data-sort="correo">Correo</th>
                                                        <th class="sort border-top custom-th" data-sort="motivo">Motivo</th>
                                                        <th class="sort text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody class="list">
                                                    <?php
                                                    $arraytest = [
                                                        [
                                                            "Doctor" => "Juan Pérez",
                                                            "Fecha" => "2025-10-18",
                                                            "Paciente" => "Camilo Cruz",
                                                            "Teléfono" => "555-1234",
                                                            "Correo" => "juan.perez@example.com",
                                                            "Motivo" => "sin motivo"
                                                        ],

                                                    ];

                                                    foreach ($arraytest as $value) { ?>
                                                        <tr>
                                                            <td class="align-middle custom-td"><?= $value["Doctor"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Fecha"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Paciente"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Teléfono"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Correo"] ?></td>
                                                            <td class="align-middle custom-td"><?= $value["Motivo"] ?></td>
                                                            <td class="align-middle white-space-nowrap pe-0 p-3">
                                                                <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                                                                    <button class="btn btn-outline-success me-1 mb-1 rounded-pill" type="button" data-bs-toggle="modal" data-bs-target="#modalVideoConsulta"><i class="far fa-play-circle success"></i> Iniciar video llamada</button>

                                                                    <button class="btn btn-outline-danger me-1 mb-1 rounded-pill" type="button"><i class="fas fa-user-times"></i> No asistió</button>

                                                                    <button class="btn btn-outline-info me-1 mb-1 rounded-pill" type="button" data-bs-toggle="modal" data-bs-target="#modalGrabacion">
                                                                        <i class="fas fa-video"></i> Ver / Subir grabación
                                                                    </button>

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
<?php
include "./includes/modals/ModalGrabacion.php";
include "./includes/modals/VideoConsultaModal.php";
include "./includes/modals/ReporteVideoConsultasModal.php";

include "../footer.php"; ?>

<script src="./assets/js/main.js"></script>
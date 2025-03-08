<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1">Miguel Angel Castro Franco</a></li>
                <li class="breadcrumb-item"><a href="consultas?1">Consultas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Consulta Primera vez</li>
            </ol>
        </nav>
        <div class="row">
            <div class="col-12">
                <div class="row align-items-center justify-content-between">
                    <div class="col-md-6">
                        <h2 class="mb-0">Nueva Consulta</h2>
                        <small>
                            Miguel Angel Castro Franco
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-0 g-md-4 g-xl-6 p-3">
            <div class="col-md-7 col-lg-7 col-xl-8">
                <div class="steps-container mb-4">
                    <ul class="steps" id="steps">
                        <li class="step active" data-step="1">
                        <li class="step" data-step="2">
                        <li class="step" data-step="3">    
                        
                    </ul>
                </div>  

                <div id="form-container" class="form-container">
                    
                </div>

                <button class="btn btn-primary mt-4" id="mostrarFormulario">Generar con IA</button>

                <div class="modal-footer">
                    <button class="btn btn-secondary me-2" id="prevStep" type="button" disabled>Anterior</button>
                    <button class="btn btn-primary me-2" id="nextStep" type="button">Siguiente</button>
                    <button class="btn btn-secondary d-none" id="finishStep" type="submit"
                        form="wizardForm">Finalizar</button>
                </div>               
            </div>



            <div class="col-md-5 col-lg-5 col-xl-4">
                <div class="sticky-leads-sidebar">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
                        id="productFilterColumn">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center g-3 text-center text-xxl-start">
                                    <div class="col-12 col-xxl-auto">
                                        <div class="avatar avatar-5xl"><img class="rounded-circle"
                                                src="<?= $ConfigNominaUser['logoBase64'] ?>" alt="" /></div>
                                    </div>
                                    <div class="col-12 col-sm-auto flex-1">
                                        <h3 class="fw-bold mb-2">Miguel Angel Castro Franco</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Genero
                                    </div>
                                    <div>
                                        Masculino
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Edad
                                    </div>
                                    <div>
                                        21 Años
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Tipo de Sangre
                                    </div>
                                    <div>
                                        A Positivo
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Condicion Especial
                                    </div>
                                    <div>
                                        TDHA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Antecedentes
                                    </div>
                                    <div>
                                        TDHA, ASMA, HTA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Whatsapp
                                    </div>
                                    <div>
                                        +57350........
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-12 col-lg-12 col-xl-12">
                <div>
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <div class="timer">
                                    Tiempo en consulta: <span id="timer">00:00:00</span>
                                </div>
                            </div>
                            <div class="col-3">
                                <a href="consultas?1" class="btn btn-danger" id="cancelBtn">Cancelar consulta</a>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-primary" id="finishBtn" type="button" data-bs-toggle="modal"
                                    data-bs-target="#finishModal">Terminar consulta</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</div>



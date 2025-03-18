<?php
include "../menu.php";
include "../header.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PreadmissionTable
    } from './react-dist/appointments/PreadmissionTable.js';

    ReactDOMClient.createRoot(document.getElementById('history-preadmission-data-content')).render(React.createElement(PreadmissionTable));
</script>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Historial de preadmisiones</li>
            </ol>
        </nav>

        <div class="pb-9">

            <div class="row g-0 g-md-4 g-xl-6 p-5">

                <h2 class="mb-0 patientName">Cargando...</h2>
                <div class="col-4">
                    <?php include "../Pacientes/infoPaciente.php"; ?>
                </div>

                <div class="col-8">
                    <h3>Historial de preadmisiones</h3>
                    <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="history-preadmission-tab" data-bs-toggle="tab" href="#tab-history-preadmission"
                                role="tab" aria-controls="tab-history-preadmission" aria-selected="true">
                                <i class="fas fa-chart-line"></i> Historial de preadmisiones
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content mt-3" id="myTabContent">
                        <div class="tab-pane fade show active" id="tab-history-preadmission" role="tabpanel" aria-labelledby="history-preadmission-tab">
                            <div id="history-preadmission-data-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>
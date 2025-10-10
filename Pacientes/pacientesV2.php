<?php
include "../menu.php";
include "../header.php";
?>

<style type="text/css">
        .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
    }

    /* Estilos para las tarjetas */
    .card-paciente {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .card-paciente:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .card-paciente .card-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
    }

    .card-paciente .avatar {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
    }

    .card-paciente .badge {
        font-size: 12px;
        margin-bottom: 10px;
    }

    .card-paciente .info-paciente {
        width: 100%;
        text-align: left;
    }

    .card-paciente .info-paciente p {
        margin-bottom: 8px;
        font-size: 14px;
        white-space: normal;
        overflow: visible;

    }

    .card-paciente .btn-ver {
        width: 100%;
        margin-top: auto;
        font-size: 14px;
    }

    /* Estilos para las columnas */
    .info-paciente .row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .info-paciente .col-6 {
        flex: 1 1 45%;
        min-width: 45%;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .card-paciente .avatar {
            width: 60px;
            height: 60px;
        }

        .card-paciente .info-paciente p {
            font-size: 12px;
        }

        .card-paciente .btn-ver {
            font-size: 12px;
        }

        .info-paciente .col-6 {
            flex: 1 1 100%;
            /* En móviles, una columna por fila */
            min-width: 100%;
        }
    }
</style>



<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Consultas</li>
                </ol>
            </nav>

            <div class="row align-items-center justify-content-between mb-4">
                <div class="col-md-6">
                    <h2 class="mb-0">Consultas</h2>
                </div>
            </div>

            <div id="patientConsultationListReact"></div>
        </div>
    </div>
</div>

<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        PatientConsultationList
    } from './react-dist/patients/PatientConsultationList.js';

    const rootElement = document.getElementById('patientConsultationListReact');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(PatientConsultationList));
</script>

<?php

include "../footer.php";
?>
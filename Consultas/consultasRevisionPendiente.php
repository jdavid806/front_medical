<?php
include "../menu.php";
include "../header.php";
?>
<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Consultas - Solicitudes de revisión pendientes</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-0">Consultas - Solicitudes de revisión pendientes</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div id="clinicalRecordsPendingReviewReact"></div>
        </div>
    </div>

    <script type="module">
        import React from "react";
        import ReactDOMClient from "react-dom/client";
        import {
            ClinicalRecordsPendingReview
        } from './react-dist/clinical-records/ClinicalRecordsPendingReview.js';

        const rootElement = document.getElementById('clinicalRecordsPendingReviewReact');
        ReactDOMClient.createRoot(rootElement).render(React.createElement(ClinicalRecordsPendingReview));
    </script>

    <?php include "../footer.php"; ?>
</div>
<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mt-5">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeInventario">Inventarios</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Paquetes</li>
            </ol>
        </nav>
        <div id="prescriptionPackagesAppRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        PrescriptionPackagesApp
    } from './react-dist/pckges/PrescriptionPackagesApp.js';

    const rootElement = document.getElementById('prescriptionPackagesAppRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(PrescriptionPackagesApp));
</script>

<?php include "../footer.php"; ?>
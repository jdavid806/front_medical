<?php
include "../menu.php";
include "../header.php";

?>

<style>
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
    }

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
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active"><a href="pacientes">Pacientes</a></li>
                    <li class="breadcrumb-item active"><a id="nombre-paciente" href="verPaciente?id=<?php echo $_GET['patient_id']; ?>">cargando...</a></li>
                    <li class="breadcrumb-item active">Incapacidades</li>
                </ol>
            </nav>
           <div class="main-content">
            <div class="component-container">
                <div id="main"></div>
            </div>
        </div>
    </div>
</div>

<?php
include './modalIncapacidad.php'
?>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import DisabilityApp from './react-dist/disabilities/DisabilityApp.js';

    const rootElement = document.getElementById('main');
    if (rootElement) {
        // Get patient ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const patientId = urlParams.get('patient_id');

        console.log('Patient ID from URL:', patientId);

        ReactDOMClient.createRoot(rootElement).render(
            React.createElement(DisabilityApp, {
                patientId: patientId
            })
        );
    }
</script>

<?php include "../footer.php"; ?>
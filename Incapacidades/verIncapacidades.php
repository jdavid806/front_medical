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
</style>

<div class="content">
    <div id="main">
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
                React.createElement(DisabilityApp, { patientId: patientId })
            );
        }
    </script>

    <?php include "../footer.php"; ?>
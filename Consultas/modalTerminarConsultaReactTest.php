<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        FinishClinicalRecordModal
    } from './react-dist/clinical-records/FinishClinicalRecordModal.js';

    const rootElement = document.getElementById('appointmentModalRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(FinishClinicalRecordModal, {
        appointmentId: "1",
        clinicalRecordType: "historiaEndocrinologia",
        externalDynamicData: {},
        patientId: "1",
        visible: true,
        onClose: () => {
            ReactDOMClient.createRoot(rootElement).unmount();
        }
    }));
</script>

<?php include "../footer.php"; ?>
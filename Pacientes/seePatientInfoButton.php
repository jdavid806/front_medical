<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="patientInfoButtonRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        SeePatientInfoButton
    } from './react-dist/patients/SeePatientInfoButton.js';

    const rootElement = document.getElementById('patientInfoButtonRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(SeePatientInfoButton));
</script>

<?php include "../footer.php"; ?>
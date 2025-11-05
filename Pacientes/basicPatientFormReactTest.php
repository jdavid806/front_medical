<?php
include "../menu.php";
include "../header.php";
?>

<div class="content mt-3">
    <div class="container-small mt-3">
        <div id="basicPatientFormRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        BasicPatientForm
    } from './react-dist/patients/BasicPatientForm.js';

    const rootElement = document.getElementById('basicPatientFormRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(BasicPatientForm));
</script>

<?php include "../footer.php"; ?>
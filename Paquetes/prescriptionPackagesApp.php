<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
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
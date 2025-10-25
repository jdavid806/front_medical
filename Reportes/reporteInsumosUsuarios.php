<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="medicalSuppliesModalRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        UserSupplyStockReport
    } from './react-dist/medical-supplies/UserMedicalSuppliesReport.js';

    const rootElement = document.getElementById('medicalSuppliesModalRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(UserSupplyStockReport));
</script>

<?php include "../footer.php"; ?>
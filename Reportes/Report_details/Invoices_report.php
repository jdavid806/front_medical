<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Reportes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Reporte Facturas</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="report-invoices"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { InvoicesReport } from './react-dist/reports/Invoices.js';

    ReactDOMClient.createRoot(document.getElementById('report-invoices')).render(
        React.createElement(InvoicesReport)
    );
</script>

<?php
include "../../footer.php";
?>
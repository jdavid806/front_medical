<?php
include "../../menu.php";
include "../../header.php";
?>


<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Reportes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Reporte Facturas Entidad</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
    <div id="report-invoices-entity"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        InvoicesByEntity
    } from './react-dist/reports/InvoicesByEntity.js';

    ReactDOMClient.createRoot(document.getElementById('report-invoices-entity')).render(React.createElement(InvoicesByEntity));
</script>

<?php
include "../../footer.php";
?>
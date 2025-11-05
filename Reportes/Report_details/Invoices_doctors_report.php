<?php
include "../../menu.php";
include "../../header.php";
?>


<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Reportes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Reportes Especialista</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
        <div id="report-invoices-doctors"></div>
            </div>
        </div>
    </div>
</div>


<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        SpecialistsReport
    } from './react-dist/reports/InvoicesDoctors.js';

    ReactDOMClient.createRoot(document.getElementById('report-invoices-doctors')).render(React.createElement(SpecialistsReport));
</script>

<?php
include "../../footer.php";
?>
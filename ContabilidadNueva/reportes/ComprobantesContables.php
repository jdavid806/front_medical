<?php
include "../../menu.php";
include "../../header.php";
?>



<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Comprobantes Contables</li>
            </ol>
        </nav>
        <div class="container">
            <div id="ComprobantesContables"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        AccountingVouchers
    } from './react-dist/billing/reports/AccountingVouchers.js';

    ReactDOMClient.createRoot(document.getElementById('ComprobantesContables')).render(React.createElement(
        AccountingVouchers));
</script>




<?php
include "../../footer.php";
?>
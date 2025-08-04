<?php
include "../../../menu.php";
include "../../../header.php";


?>
<style>
    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 0.5rem;
    }
</style>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Balance de Prueba X Tercero</li>
            </ol>
        </nav>
        <div class="container">
            <h1 class="section-title">Balance de Prueba X Tercero</h1>

            <div id="balancePruebaTercero"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        BalanceThirdParty
    } from './react-dist/billing/reports/BalanceThirdParty.js';

    ReactDOMClient.createRoot(document.getElementById('balancePruebaTercero')).render(React.createElement(BalanceThirdParty));
</script>



<?php include "../../../footer.php"; ?>
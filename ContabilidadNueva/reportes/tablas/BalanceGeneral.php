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
                <li class="breadcrumb-item active" onclick="location.reload()">Balance General</li>
            </ol>
        </nav>
        <div class="container">
            <h1 class="section-title">Balance General</h1>

            <div id="balanceGeneral"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        BalanceSheet
    } from './react-dist/billing/reports/BalanceSheet.js';

    ReactDOMClient.createRoot(document.getElementById('balanceGeneral')).render(React.createElement(BalanceSheet));
</script>



<?php include "../../../footer.php"; ?>
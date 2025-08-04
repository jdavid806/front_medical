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
                <li class="breadcrumb-item active" onclick="location.reload()">Balance de prueba x Cuenta Contable</li>
            </ol>
        </nav>
        <div class="container">
            <h1 class="section-title">Balance de prueba x Cuenta Contable</h1>
            <div id="balanceCuentaContable"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        BalanceAccountingAccount
    } from './react-dist/billing/reports/BalanceAccountingAccount.js';

    ReactDOMClient.createRoot(document.getElementById('balanceCuentaContable')).render(React.createElement(BalanceAccountingAccount));
</script>



<?php include "../../../footer.php"; ?>
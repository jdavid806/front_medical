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
                <li class="breadcrumb-item active" onclick="location.reload()">Libro mayor de balance
                </li>
            </ol>
        </nav>
        <div class="container">
            <h1 class="section-title">Libro mayor de balance</h1>

            <div id="generalLedgerBalanceReport"></div>
        </div>
    </div>
</div>

<?php
include "../../../footer.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        GeneralLedgerBalance
    } from './react-dist/billing/reports/GeneralLedgerBalance.js';

    ReactDOMClient.createRoot(document.getElementById('generalLedgerBalanceReport')).render(React.createElement(GeneralLedgerBalance));
</script>
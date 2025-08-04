<?php
include "../menu.php";
include "../header.php";
?>
<div class="content">
    <div class="">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Cuentas por Cobrar/Pagar</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <h2>Contable</h2>
                <div id="accountscollectPay"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { AccountsCollectPay } from './react-dist/accounting/accountsCollectPay/AccountsCollectPay.js';

    ReactDOMClient.createRoot(document.getElementById('accountscollectPay')).render(
        React.createElement(AccountsCollectPay)
    );
</script>

<?php
include "../footer.php";
?>
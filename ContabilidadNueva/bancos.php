<?php
include "../menu.php";
include "../header.php";
?>

<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeContabilidad">Contablidad</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Bancos</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <div id="bancosCuentas"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        BanksAccounting
    } from './react-dist/accounting/BanksAccounting.js';

    ReactDOMClient.createRoot(document.getElementById('bancosCuentas')).render(
        React.createElement(BanksAccounting)
    );
</script>
<?php
include "../footer.php";
?>
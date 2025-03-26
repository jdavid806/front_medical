<?php
include "../menu.php";
include "../header.php";
?>

<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Cierre de caja</li>
                </ol>
            </nav>
            <div class="row mt-4">
                <div id="cashControlReact"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        CashControlApp
    } from './react-dist/cash-control/CashControlApp.js';

    ReactDOMClient.createRoot(document.getElementById('cashControlReact')).render(React.createElement(CashControlApp));
</script>

<?php
include "../footer.php";
?>

<script src="./assets/js/main.js"></script>
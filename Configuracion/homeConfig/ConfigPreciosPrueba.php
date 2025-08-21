<?php
include "../../menu.php";
include "../../header.php";
?>

<style>
    /* Asegurar que el contenedor principal no cause overflow */
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
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeContabilidad">Configuracion</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Precios</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <div id="preciosConfiguracion"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PricesConfig
    } from './react-dist/config/prices/PricesConfig.js';

    ReactDOMClient.createRoot(document.getElementById('preciosConfiguracion')).render(
        React.createElement(PricesConfig)
    );
</script>
<?php
include "../../footer.php";
?>
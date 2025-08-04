<?php
include "../menu.php";
include "../header.php";
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
                <li class="breadcrumb-item"><a href="homeInventario">Inventario</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Depositos</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <div id="DepositsTablet"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { DepositsTablet } from './react-dist/inventory/deposits/DepositsTablet.js';

    ReactDOMClient.createRoot(document.getElementById('DepositsTablet')).render(
        React.createElement(DepositsTablet)
    );
</script>
<?php
include "../footer.php";
?>
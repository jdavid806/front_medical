<?php
include "../menu.php";
include "../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="homeInventario">Inventario</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Medicamentos</li>
                </ol>
            </nav>
            <div id="productInventoryAppReact"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        ProductInventoryApp
    } from './react-dist/inventory/ProductInventoryApp.js';

    // ReactDOMClient.createRoot(document.getElementById('productInventoryAppReact')).render(React.createElement(ProductInventoryApp));

    ReactDOMClient.createRoot(document.getElementById('productInventoryAppReact')).render(React
                .createElement(ProductInventoryApp, {
                    type: 'medications'
                }));
</script>

<?php
include "../footer.php";
?>
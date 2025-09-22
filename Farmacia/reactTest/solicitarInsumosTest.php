<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="homeFarmacia">Inventario</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Solicitud de insumos</li>
                </ol>
            </nav>

            <div class="pb-9">
                <div class="row mt-5">
                    <div class="col-md-12">
                        <h2 class="mb-3">Solicitud de insumos</h2>

                        <div id="suppliesDeliveriesReact"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        SuppliesDeliveries
    } from './react-dist/pharmacy/supplies/SuppliesDeliveries.js';

    const rootElement = document.getElementById('suppliesDeliveriesReact');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(SuppliesDeliveries));
</script>

<?php include "../../footer.php";
?>
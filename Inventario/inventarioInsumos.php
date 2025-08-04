<?php
include "../menu.php";
include "../header.php";
?>

<style>
    .selectable-row {
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
    }

    .selectable-row:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .selected {
        background-color: rgba(0, 0, 0, 0.1) !important;
    }
</style>

<div class="componete">
    <div class="content">
        <div class="container">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Inventario</li>
                </ol>
            </nav>
            <div class="pb-9">
                <div class="row mt-5">
                    <div class="col-md-12">
                        <h2 class="mb-3">Inventario Insumos</h2>
                        <button class="btn btn-primary mb-4" type="button" data-bs-toggle="modal"
                            data-bs-target="#modalNuevoInsumo">
                            <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar nuevo insumo
                        </button>
                    </div>
                </div>

                <div id="productInventoryAppReact"></div>

            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        ProductInventoryApp
    } from './react-dist/inventory/ProductInventoryApp.js';

    ReactDOMClient.createRoot(document.getElementById('productInventoryAppReact')).render(React
                .createElement(ProductInventoryApp, {
                    type: 'supplies'
                }));
</script>

<?php include "../footer.php";
include "./modal/modalNuevoInsumo.php";
?>
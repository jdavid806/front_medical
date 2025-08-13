<?php
include "../menu.php";
include "../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="homeInventario">Inventario</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Vacunas</li>
                </ol>
            </nav>
            <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                <li class="nav-item"><a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#tab-home"
                        role="tab" aria-controls="tab-home" aria-selected="true">Vacunas</a></li>
                <li class="nav-item"><a class="nav-link" id="profile-tab" data-bs-toggle="tab" href="#tab-profile"
                        role="tab" aria-controls="tab-profile" aria-selected="false">Grupo de Vacunas</a></li>
            </ul>
            <div class="tab-content mt-3" id="myTabContent">
                <!-- Tab Vacunas -->
                <div class="tab-pane fade show active" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="pb-9">
                        <div class="row mt-5 mb-3">
                            <div class="col-md-12">
                                <h2 class="mb-3">Vacunas</h2>
                            </div>
                        </div>
                        <div id="productInventoryAppReact">

                        </div>
                    </div>
                </div>
                <!-- Tab Grupo de Vacunas -->
                <div class="tab-pane fade" id="tab-profile" role="tabpanel" aria-labelledby="profile-tab">
                    <div class="pb-9">
                        <div class="row mt-5">
                            <div class="col-md-12">
                                <h2 class="mb-3">Grupo de Vacunas</h2>
                                <button class="btn btn-primary mb-4" type="button" data-bs-toggle="modal"
                                    data-bs-target="#modalGrupoVacuna">
                                    <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo Grupo de Vacunas
                                </button>
                            </div>
                        </div>
                        <div class="row">
                            <!-- Tabla de Vacunas -->
                            <div class="col-lg-12">
                                <div id="tableExample4"
                                    data-list="{&quot;valueNames&quot;:[&quot;vacuna&quot;,&quot;tipo&quot;,&quot;stock&quot;,&quot;caducidad&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr class="bg-body-highlight">
                                                    <th class="ps-3">Nombre</th>
                                                    <th>Tipo de producto</th>
                                                    <th class="text-end">Stock</th>
                                                    <th class="text-end">Rango Stock</th>
                                                    <th class="text-end">Precio de Compra</th>
                                                    <th class="text-end">Precio de Venta</th>
                                                    <th class="text-end pe-3">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody class="list"></tbody>
                                        </table>



                                    </div>
                                </div>
                            </div>
                            <!-- Información del Paciente -->



                        </div>
                    </div>
                </div>

            </div>

            <!-- <div class="row">
                <div class="col-lg-12">
                    <div class="card h-100 animated-card">
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <h4>Los siguientes productos se encuentran próximos a caducar o se encuentran caducados
                                </h4>
                            </div>
                            <ul id="alertaProductos" class="list-group">
                            </ul>
                        </div>
                    </div>
                </div>
            </div> -->

        </div>
    </div>
</div>

<script type="module" src="Inventario/js/inventarioVacunas.js"></script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const tableRows = document.querySelectorAll(".table-row");
        const cardTitle = document.querySelector(".card .card-title");
        const cardContent = document.querySelector(".card .card-content");

        tableRows.forEach(row => {
            row.addEventListener("click", () => {
                const vacuna = row.querySelector(".vacuna").textContent;
                const tipo = row.querySelector(".tipo").textContent;
                const stock = row.querySelector(".stock").textContent;
                const caducidad = row.querySelector(".caducidad").textContent;

                cardTitle.textContent = vacuna;


                cardContent.innerHTML = `
                    <p><strong>Tipo:</strong> ${tipo}</p>
                    <p><strong>Stock:</strong> ${stock}</p>
                    <p><strong>Fecha de Caducidad:</strong> ${caducidad}</p>
                `;
            });
        });
    },);
</script>

<script type="module" src="Inventario/js/inventarioVacunas.js"></script>





<?php include "../footer.php";
include "./modal/modalNuevaVacuna.php";
include "./modal/modalGrupoVacunas.php";
?>


<style>
    .animated-card {
        transition: opacity 0.4s ease, transform 0.4s ease;
    }

    .card-fade-out {
        opacity: 0;
        transform: scale(0.95);
    }

    .card-fade-in {
        opacity: 1;
        transform: scale(1);
    }

    .fila-seleccionada {
        background-color: #e9ecef;
        /* Color gris claro */
    }
</style>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        ProductWithLotInventoryApp
    } from './react-dist/inventory/ProductWithLotInventoryApp.js';

    ReactDOMClient.createRoot(document.getElementById('productInventoryAppReact')).render(React
                .createElement(ProductWithLotInventoryApp, {
                    type: 'vaccines'
                }));
</script>
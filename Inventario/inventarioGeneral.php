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
                        <h2 class="mb-3">Inventario General</h2>
                        <!-- <button class="btn btn-primary mb-4" type="button" data-bs-toggle="modal"
                            data-bs-target="#modalNuevoProducto">
                            <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar nuevo producto
                        </button> -->
                        <!-- <button class="btn dropdown-toggle mb-4 btn-primary" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar nuevo producto
                        </button>

                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#modalNuevoMedicamento">Medicamento</a>

                            <a class="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#modalNuevaVacuna">Vacuna</a>

                            <a class="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#modalNuevoInsumo">Insumo</a>
                        </div> -->
                    </div>
                </div>
                <div class="row">
                    <!-- Tabla de productos -->
                    <div class="col-lg-8">
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

                            <!-- 🔹 Controles de paginación -->
                            <div class="pagination d-flex justify-content-end mt-3">
                                <button id="prevPage" class="btn btn-sm btn-outline-primary mx-1">Anterior</button>
                                <span class="mx-2">Página <span id="currentPage">1</span> de <span
                                        id="totalPages">1</span></span>
                                <button id="nextPage" class="btn btn-sm btn-outline-primary mx-1">Siguiente</button>
                            </div>
                        </div>

                    </div>
                    <div class="col-lg-4">
                        <div class="card animated-card">
                            <div class="card-body">
                                <div class="text-center mb-3">
                                    <img id="vacunaImage" src="https://via.placeholder.com/200x150"
                                        alt="Imagen de Vacuna" class="img-fluid rounded"
                                        style="width: 100%; max-width: 200px; height: auto;">
                                </div>
                                <h4 class="card-title">Selecciona un producto</h4>
                                <div class="card-content">
                                    <p><strong>Tipo:</strong> <span id="tipoProducto">-</span></p>
                                    <p><strong>Stock:</strong> <span id="stockProducto">-</span></p>
                                    <p><strong>Precio:</strong> <span id="precioProducto">-</span></p>
                                </div>
                                <button class="btn btn-sm btn-primary ver-detalle" type="button"
                                    data-bs-toggle="modal" data-bs-target="#infoModal" data-id="${product.id}">
                                    Ver más
                                </button>

                            </div>
                        </div>
                    </div>


                </div>

            </div>

            <div class="row">
                <div class="col-lg-12">
                    <div class="card h-100 animated-card">
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <h4>Los siguientes productos se encuentran próximos a caducar o se encuentran caducados
                                </h4>
                            </div>
                            <ul id="alertaProductos" class="list-group">
                                <!-- Aquí se agregarán los productos dinámicamente -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<?php 
// include "./modal/modalNuevoMedicamento.php";
// include "./modal/modalNuevaVacuna.php";
// include "./modal/modalNuevoInsumo.php";
?>

<script type="module" src="Inventario/js/inventarioGeneral.js"></script>



<?php include "../footer.php";
include "./modal/modalNuevoProducto.php";
// include "./modal/modalNuevoMedicamentoInv.php";
include "./modal/modalInformaciónProducto.php";
?>
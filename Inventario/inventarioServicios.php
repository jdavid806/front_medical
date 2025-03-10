<?php
include "../menu.php";
include "../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container-small">
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
                        <button class="btn btn-primary mb-4" type="button" data-bs-toggle="modal"
                            data-bs-target="#modalNuevoProducto">
                            <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar nuevo producto
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <table class="table table-sm fs-9 mb-0">
                            <thead>
                                <tr class="bg-body-highlight">
                                    <th class="sort border-top border-translucent ps-3" data-sort="nombre">Nombre</th>
                                    <th class="sort border-top border-translucent" data-sort="tipo">Tipo de Servicio
                                    </th>
                                    <th class="sort border-top border-translucent text-end pe-3"
                                        data-sort="precioVenta">Precio</th>
                                    <th class="sort border-top border-translucent text-end pe-3"
                                        data-sort="precioVenta">Código CUP</th>
                                    <th class="sort border-top border-translucent text-end pe-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="list">
                                <tr class="table-row">
                                    <td class="align-middle ps-3">BCG</td>
                                    <td class="align-middle">Inactivada</td>
                                    <td class="align-middle text-end">120</td>
                                    <td class="align-middle text-end pe-3">150.00</td>
                                    <td class="align-middle text-end pe-3">180.00</td>
                                    <td class="text-end align-middle pe-3">
                                        <div class="dropdown">
                                            <button class="btn btn-primary dropdown-toggle" type="button"
                                                data-bs-toggle="dropdown" aria-label="Acciones">
                                                <i data-feather="settings"></i> Acciones
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item editar" href="#" data-producto="BCG">
                                                        <div class="d-flex gap-2 align-items-center">
                                                            <i class="fa-solid fa-edit" style="width: 20px;"></i>
                                                            <span>Editar</span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item eliminar text-danger" href="#"
                                                        data-producto="BCG">
                                                        <div class="d-flex gap-2 align-items-center">
                                                            <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                                            <span>Eliminar</span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <hr class="dropdown-divider">
                                                </li>
                                                <li class="dropdown-header">Compartir</li>
                                                <li>
                                                    <a class="dropdown-item" href="#">
                                                        <div class="d-flex gap-2 align-items-center">
                                                            <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                                            <span>Compartir por Whatsapp</span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="#">
                                                        <div class="d-flex gap-2 align-items-center">
                                                            <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                                            <span>Compartir por Correo</span>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

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

<?php include "../footer.php";
include "./modal/modalNuevoProducto.php";
?>
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
                    <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
                </ol>
            </nav>
            <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                <li class="nav-item"><a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#tab-home" role="tab" aria-controls="tab-home" aria-selected="true">Vacunas</a></li>
                <li class="nav-item"><a class="nav-link" id="profile-tab" data-bs-toggle="tab" href="#tab-profile" role="tab" aria-controls="tab-profile" aria-selected="false">Grupo de Vacunas</a></li>
            </ul>
            <div class="tab-content mt-3" id="myTabContent">
                <!-- Tab Vacunas -->
                <div class="tab-pane fade show active" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="pb-9">
                        <div class="row mt-5">
                            <div class="col-md-12">
                                <h2 class="mb-3">Vacunas</h2>
                                <button class="btn btn-primary mb-4" type="button" data-bs-toggle="modal"
                                    data-bs-target="#modalVacuna">
                                    <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar Vacuna
                                </button>
                            </div>
                        </div>
                        <div class="row">
                            <!-- Tabla de Vacunas -->
                            <div class="col-lg-8">
                                <div id="tableExample4" data-list="{&quot;valueNames&quot;:[&quot;vacuna&quot;,&quot;tipo&quot;,&quot;stock&quot;,&quot;caducidad&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                                    <div class="table-responsive">
                                        <table class="table table-sm fs-9 mb-0">
                                            <thead>
                                                <tr class="bg-body-highlight">
                                                    <th class="sort border-top border-translucent ps-3" data-sort="vacuna">Vacuna</th>
                                                    <th class="sort border-top border-translucent" data-sort="tipo">Tipo</th>
                                                    <th class="sort border-top border-translucent text-end" data-sort="stock">Stock</th>
                                                    <th class="sort border-top border-translucent text-end pe-3" data-sort="caducidad">Fecha de Caducidad</th>
                                                </tr>
                                            </thead>
                                            <tbody class="list">
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 vacuna">BCG</td>
                                                    <td class="align-middle tipo">Inactivada</td>
                                                    <td class="align-middle text-end stock">120</td>
                                                    <td class="align-middle text-end pe-3 caducidad">2024-08-15</td>
                                                </tr>
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 vacuna">Hepatitis B</td>
                                                    <td class="align-middle tipo">ARNm</td>
                                                    <td class="align-middle text-end stock">80</td>
                                                    <td class="align-middle text-end pe-3 caducidad">2025-03-10</td>
                                                </tr>
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 vacuna">Triple Viral</td>
                                                    <td class="align-middle tipo">Combinada</td>
                                                    <td class="align-middle text-end stock">50</td>
                                                    <td class="align-middle text-end pe-3 caducidad">2024-12-05</td>
                                                </tr>
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 vacuna">Polio</td>
                                                    <td class="align-middle tipo">Oral</td>
                                                    <td class="align-middle text-end stock">30</td>
                                                    <td class="align-middle text-end pe-3 caducidad">2023-11-20</td>
                                                </tr>
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 vacuna">COVID-19</td>
                                                    <td class="align-middle tipo">Vector Viral</td>
                                                    <td class="align-middle text-end stock">200</td>
                                                    <td class="align-middle text-end pe-3 caducidad">2026-05-15</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <!-- Información del Paciente -->
                            <div class="col-lg-4">
                                <div class="card h-100 animated-card">
                                    <div class="card-body">
                                        <div class="text-center mb-3">
                                            <img id="vacunaImage" src="./Smallpox_vaccine.jpg" alt="Imagen de Vacuna" class="img-fluid rounded" style="max-height: 200px;">
                                        </div>
                                        <h4 class="card-title">Selecciona una Vacuna</h4>
                                        <div class="card-content">
                                            <p><strong>Tipo:</strong> -</p>
                                            <p><strong>Stock:</strong> -</p>
                                            <p><strong>Fecha de Caducidad:</strong> -</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


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
                                <div id="tableExample4" data-list="{&quot;valueNames&quot;:[&quot;vacuna&quot;,&quot;tipo&quot;,&quot;stock&quot;,&quot;caducidad&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                                    <div class="table-responsive">
                                        <table class="table table-sm fs-9 mb-0">
                                            <thead>
                                                <tr class="bg-body-highlight">
                                                    <th class="sort border-top border-translucent ps-3" data-sort="vacuna">Nombre de grupo</th>
                                                    <th class="sort border-top border-translucent" data-sort="tipo">Tipo</th>
                                                    <th class="sort border-top border-translucent text-end" data-sort="stock">Tipo de Dosis</th>
                                                    <th class="sort border-top border-translucent text-end pe-3" data-sort="caducidad">Vacunas</th>
                                                    <th class="sort border-top border-translucent text-end pe-3" data-sort="acciones">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody class="list">
                                                <!-- Fila 1 -->
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3">Grupo Neumococo</td>
                                                    <td class="align-middle">Monovalente</td>
                                                    <td class="align-middle text-end">Oral</td>
                                                    <td class="align-middle text-end pe-3">vacuna 1, vacuna 2</td>
                                                    <td class="align-middle text-end pe-3">
                                                        <button class="btn btn-sm btn-warning">Editar</button>
                                                        <button class="btn btn-sm btn-danger">Eliminar</button>
                                                    </td>
                                                </tr>
                                                <!-- Fila 2 -->
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3">Grupo Hepatitis A</td>
                                                    <td class="align-middle">Inactivada</td>
                                                    <td class="align-middle text-end ">Oral</td>
                                                    <td class="align-middle text-end pe-3">vacuna 3, vacuna 4</td>
                                                    <td class="align-middle text-end pe-3">
                                                        <button class="btn btn-sm btn-warning">Editar</button>
                                                        <button class="btn btn-sm btn-danger">Eliminar</button>
                                                    </td>
                                                </tr>
                                                <!-- Fila 3 -->
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 ">Grupo Tétanos</td>
                                                    <td class="align-middle ">Inactivada</td>
                                                    <td class="align-middle text-end ">Inyectable</td>
                                                    <td class="align-middle text-end pe-3 ">vacuna 5</td>
                                                    <td class="align-middle text-end pe-3">
                                                        <button class="btn btn-sm btn-warning">Editar</button>
                                                        <button class="btn btn-sm btn-danger">Eliminar</button>
                                                    </td>
                                                </tr>
                                                <!-- Fila 4 -->
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 ">Grupo Varicela</td>
                                                    <td class="align-middle ">Viral</td>
                                                    <td class="align-middle text-end ">Inyectable</td>
                                                    <td class="align-middle text-end pe-3 ">vacuna 6</td>
                                                    <td class="align-middle text-end pe-3">
                                                        <button class="btn btn-sm btn-warning">Editar</button>
                                                        <button class="btn btn-sm btn-danger">Eliminar</button>
                                                    </td>
                                                </tr>
                                                <!-- Fila 5 -->
                                                <tr class="table-row">
                                                    <td class="align-middle ps-3 ">Grupo DTP</td>
                                                    <td class="align-middle ">Combinada</td>
                                                    <td class="align-middle text-end ">Inyectable</td>
                                                    <td class="align-middle text-end pe-3 caducidad">vacuna 7, vacuna 8</td>
                                                    <td class="align-middle text-end pe-3">
                                                        <button class="btn btn-sm btn-warning">Editar</button>
                                                        <button class="btn btn-sm btn-danger">Eliminar</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                </div>
                            </div>
                            <!-- Información del Paciente -->



                        </div>
                    </div>
                </div>

            </div>

            <div class="row">
                <div class="col-lg-12">
                    <div class="card h-100 animated-card">
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <h4>Los siguientes productos se encuentran próximos a caducar o se encuentran caducados</h4>
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


<script>
    document.addEventListener("DOMContentLoaded", function() {
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
    }, );
</script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const tableRows = document.querySelectorAll(".table-row");

        tableRows.forEach(row => {
            const fechaCaducidad = row.querySelector(".caducidad");
            if (fechaCaducidad) {
                const fechaActual = new Date();
                const fechaCaducidadDate = new Date(fechaCaducidad.textContent);
                const diferenciaDias = (fechaCaducidadDate - fechaActual) / (1000 * 60 * 60 * 24);
                if (diferenciaDias < 0) {
                    fechaCaducidad.classList.add("text-danger");
                    fechaCaducidad.classList.remove("text-warning", "text-success");
                } else if (diferenciaDias <= 30) {
                    fechaCaducidad.classList.add("text-warning");
                    fechaCaducidad.classList.remove("text-danger", "text-success");
                } else {

                    fechaCaducidad.classList.add("text-success");
                    fechaCaducidad.classList.remove("text-danger", "text-warning");
                }
            }
        });
    });
</script>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const tableRows = document.querySelectorAll(".list tr");
        const alertaProductos = document.getElementById("alertaProductos");

        tableRows.forEach(row => {
            const vacuna = row.querySelector(".vacuna").textContent;
            const fechaCaducidad = row.querySelector(".caducidad").textContent;
            const fechaActual = new Date();
            const fechaCaducidadDate = new Date(fechaCaducidad);

            // Calcula la diferencia en días entre las fechas
            const diferenciaDias = (fechaCaducidadDate - fechaActual) / (1000 * 60 * 60 * 24);

            if (diferenciaDias < 0) {
                // Producto caducado
                const item = document.createElement("li");
                item.className = "list-group-item list-group-item-danger";
                item.textContent = `${vacuna} - Caducado (${fechaCaducidad})`;
                alertaProductos.appendChild(item);
            } else if (diferenciaDias <= 30) {
                // Producto próximo a caducar
                const item = document.createElement("li");
                item.className = "list-group-item list-group-item-warning";
                item.textContent = `${vacuna} - Próximo a caducar (${fechaCaducidad})`;
                alertaProductos.appendChild(item);
            }
        });
    });
</script>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const tableRows = document.querySelectorAll(".list tr");

        tableRows.forEach(row => {
            row.addEventListener("click", () => {
                // Elimina la clase de todas las filas
                tableRows.forEach(r => r.classList.remove("fila-seleccionada"));

                // Agrega la clase a la fila seleccionada
                row.classList.add("fila-seleccionada");
            });
        });
    });
</script>






<?php include "../footer.php";
include "./modalVacuna.php";
include "./modalGrupoVacunas.php";
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
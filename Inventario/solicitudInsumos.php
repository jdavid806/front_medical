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
                        <h2 class="mb-3">Solicitud de insumos</h2>

                        <button class="btn dropdown-toggle mb-4 btn-primary" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="fa-solid fa-plus me-2 fs-9"></span> Solicitar insumo
                        </button>

                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#solicitudInsumoAdmin">Administrativo</a>

                            <a class="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#solicitudInsumoProcedimiento">Procedimiento</a>

                        </div>
                    </div>
                </div>
                <div class="row">
                    <!-- Tabla de insumos -->
                    <div class="col-lg-12">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr class="bg-body-highlight">
                                        <th class="text-center">Tipo</th>
                                        <th class="text-center" style="width: 35%;">Insumos</th>
                                        <th class="text-center" style="width: 35%;">Observaciones</th>
                                        <th class="text-center" style="width: 10%;">Estado</th>
                                    </tr>
                                </thead>
                                <tbody class="list"></tbody>
                            </table>

                            <!-- 🔹 Controles de paginación -->
                            <div class="pagination d-flex justify-content-end mt-3">
                                <button id="prevPage" class="btn btn-sm btn-outline-primary mx-1">Anterior</button>
                                <span class="mx-2">Página <span id="currentPage">1</span> de <span id="totalPages">1</span></span>
                                <button id="nextPage" class="btn btn-sm btn-outline-primary mx-1">Siguiente</button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </div>
</div>


<script>
    const insumos = [{
            tipo: "Administrativo",
            insumos: ["Papelería", "Carpetas", "Bolígrafo"],
            observaciones: "Material de oficina para el departamento administrativo",
            estado: "enviada"
        },
        {
            tipo: "Procedimiento",
            insumos: ["Guantes", "Mascarillas", "Alcohol"],
            observaciones: "Insumos para realizar procedimientos médicos",
            estado: "aceptada"
        },
        {
            tipo: "Administrativo",
            insumos: ["Toner", "Papel", "Carpetas"],
            observaciones: "Suministros de oficina para el departamento de contabilidad",
            estado: "rechazada"
        },
        {
            tipo: "Procedimiento",
            insumos: ["Jeringas", "Medicamentos", "Agujas"],
            observaciones: "Material para procedimientos quirúrgicos",
            estado: "enviada"
        }
    ];


    // Llenar la tabla con los datos del objeto
    const tbody = document.querySelector('.list');

    insumos.forEach(insumo => {
        const tr = document.createElement('tr');

        // Crear una lista de insumos
        const insumosList = insumo.insumos.map(item => `<li>${item}</li>`).join("");

        // Definir el badge según el estado
        let badgeClass = "";
        let badgeText = "";

        switch (insumo.estado) {
            case "enviada":
                badgeClass = "badge-phoenix-primary";
                badgeText = "Enviada";
                break;
            case "aceptada":
                badgeClass = "badge-phoenix-success";
                badgeText = "Aceptada";
                break;
            case "rechazada":
                badgeClass = "badge-phoenix-danger";
                badgeText = "Rechazada";
                break;
            default:
                badgeClass = "badge-phoenix-secondary";
                badgeText = insumo.estado.charAt(0).toUpperCase() + insumo.estado.slice(1);
        }

        tr.innerHTML = `
        <td class="text-start">${insumo.tipo}</td>
        <td class="text-start" style="min-width: 35%;"> 
            <ul style="list-style-type: none; padding-left: 0;">
                ${insumosList}
            </ul>
        </td>
        <td class="text-start" style="min-width: 35%;">${insumo.observaciones}</td>
        <td class="text-center" style="min-width: 10%;">
            <span class="badge badge-phoenix ${badgeClass}">${badgeText}</span>
        </td>
    `;

        tbody.appendChild(tr);
    });
</script>


<?php include "../footer.php";
include "./modal/modalSolicitudAdmin.php";
include "./modal/modalSolicitudProcedimiento.php";
?>
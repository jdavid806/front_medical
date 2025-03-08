<?php
include "../menu.php";
include "../header.php";

$presupuestos = [
    [
        'numero' => 53,
        'fecha_presupuesto' => '2025-01-16',
        'fecha_vencimiento' => '2025-01-16',
        'total' => '4,988,420.00 $ COP',
        'monto_pagado' => '0.00 $ COP',
        'monto_faltante' => '4,988,420.00 $ COP',
        'cantidad' => 185
    ],
    [
        'numero' => 54,
        'fecha_presupuesto' => '2025-01-16',
        'fecha_vencimiento' => '2025-01-16',
        'total' => '5,140,000.00 $ COP',
        'monto_pagado' => '0.00 $ COP',
        'monto_faltante' => '5,140,000.00 $ COP',
        'cantidad' => 108
    ]
];
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        EstimatesTable
    } from './react-dist/estimates/EstimatesTable.js';

    ReactDOMClient.createRoot(document.getElementById('estimate-table-content')).render(React.createElement(EstimatesTable));
</script>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Presupuestos</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-0">Presupuestos</h2>
                        <small class="patientName">Cargando...</small>
                    </div>
                    <div>
                        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalCrearPresupuesto" data-bs-presupuesto-id="1">
                            <i class="fa-solid fa-plus me-2"></i> Nuevo presupuesto
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div id="estimate-table-content"></div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>

<script type="module">
    import {
        patientService
    } from "../../services/api/index.js";

    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const patientPromise = patientService.get(patientId);

    const [patient] = await Promise.all([patientPromise]);

    document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`
        }
    })
</script>

<?php
include "./generar_presupuesto.php";
?>
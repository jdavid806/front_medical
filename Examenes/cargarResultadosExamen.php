<?php
include "../menu.php";
include "../header.php";
include "./ModalNuevoExamen.php";
include './modalCargarResultados.php';


$examenes = [
    'laboratorio' => [
        ['examenId' => 1, 'fecha' => '2024-11-20', 'tipo' => 'Hemograma', 'doctor' => 'Manuel Antonio Rosales', 'motivo' => 'Control General'],
        ['examenId' => 2, 'fecha' => '2024-11-21', 'tipo' => 'Química Sanguínea', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Chequeo'],
        ['examenId' => 3, 'fecha' => '2024-11-22', 'tipo' => 'Prueba de Función Hepática', 'doctor' => 'Carlos Ruiz', 'motivo' => 'Control Post-Operatorio'],
    ],
    'imagenologia' => [
        ['examenId' => 4, 'fecha' => '2024-11-29', 'tipo' => 'Radiografía de Tórax', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Diagnóstico de Dolor Torácico'],
        ['examenId' => 5, 'fecha' => '2024-12-10', 'tipo' => 'Resonancia Magnética', 'doctor' => 'Carlos Ruiz', 'motivo' => 'Control Neurológico'],
    ],
];
?>

<style>
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
    }
</style>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item"><a href="citasControl">Citas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Cargar resultados de examen</li>
            </ol>
        </nav>

        <h2 id="productName"></h2>
        <div id="examsAppReact"></div>

    </div>
    <?php include "../footer.php"; ?>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        ExamResultsForm
    } from './react-dist/exams/components/ExamResultsForm.js';
    import {
        inventoryService,
        examResultService,
        examOrderService,
        examOrderStateService,
        patientService,
        appointmentService
    } from "./services/api/index.js";
    import AlertManager from "./services/alertManager.js";
    import UserManager from "./services/userManager.js";

    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const examId = new URLSearchParams(window.location.search).get('exam_id');
    const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');
    const productId = new URLSearchParams(window.location.search).get('product_id');

    const patientPromise = patientService.get(patientId);
    const examOrdersPromise = examOrderService.getAll();
    const examOrderStatesPromise = examOrderStateService.getAll();

    const [
        patient,
        examOrders,
        examOrderStates
    ] = await Promise.all([
        patientPromise,
        examOrdersPromise,
        examOrderStatesPromise
    ]);

    await appointmentService.changeStatus(appointmentId, 'in_consultation')

    document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`
        }
    })

    let examOrder = null

    if (examId) {
        examOrder = examOrders.find(e => e.id == examId)
    } else {
        const product = await inventoryService.getById(productId);
        examOrder = examOrders.find(e => {
            return e.patient_id == patientId &&
                e.exam_type_id == product.exam_type_id &&
                examOrderStates.find(es => es.name.toLowerCase() == 'generated').id == e.exam_order_state_id &&
                e.created_at.slice(0, 10) == new Date().toISOString().slice(0, 10)
        });
    }

    document.getElementById('productName').textContent = examOrder?.exam_type?.name || 'Cargar Resultados de Examen';

    ReactDOMClient.createRoot(document.getElementById('examsAppReact')).render(React.createElement(ExamResultsForm, {
        examId: examOrder.id,
        handleSave: (data) => {
            examResultService.create({
                    "exam_order_id": examOrder.id,
                    "created_by_user_id": UserManager.getUser().id,
                    "results": data
                })
                .then(async () => {
                    await appointmentService.changeStatus(appointmentId, 'consultation_completed')
                    AlertManager.success({
                        text: 'Se ha creado el registro exitosamente'
                    })
                    setTimeout(() => {
                        history.back()
                    }, 1000);
                })
                .catch(err => {
                    if (err.data?.errors) {
                        AlertManager.formErrors(err.data.errors);
                    } else {
                        AlertManager.error({
                            text: err.data.error || err.message || 'Ocurrió un error inesperado'
                        });
                    }
                });
        }
    }));
</script>
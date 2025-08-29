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
       .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
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
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Exámenes</li>
            </ol>
        </nav>

        <div id="examsAppReact"></div>

    </div>
    <?php include "../footer.php"; ?>
</div>

<script>
    function eliminarExamen(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('Examen eliminado con ID:', id);
                Swal.fire(
                    '¡Eliminado!',
                    'El examen ha sido eliminado.',
                    'success'
                );
            }
        });
    }

    function descargarExamen(id) {
        console.log('Descargando examen con ID:', id);
        Swal.fire('¡Descargando!', 'El examen está siendo descargado.', 'info');
        // Lógica para descargar el archivo
    }

    function compartirExamen(id) {
        console.log('Compartiendo examen con ID:', id);
        Swal.fire('¡Compartido!', 'El examen ha sido compartido.', 'success');
        // Lógica para compartir el examen (enviar por correo, generar enlace, etc.)
    }
</script>

<?php
include './ModalExamenes.php';
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

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import ExamApp from './react-dist/exams/ExamApp.js';

    ReactDOMClient.createRoot(document.getElementById('examsAppReact')).render(React.createElement(ExamApp));
</script>
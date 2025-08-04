<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="citasControl">Control citas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h2>Pacientes</h2>
                    <!-- <button class="btn btn-primary" type="button" data-bs-toggle="modal"
                        data-bs-target="#modalCrearPaciente">
                        <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo Paciente
                    </button> -->
                </div>
                <div id="patientsTableReact"></div>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
include "../Pacientes/modalPacientes.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PatientAsyncTable
    } from './react-dist/patients/PatientAsyncTable.js';

    ReactDOMClient.createRoot(document.getElementById('patientsTableReact')).render(React.createElement(
        PatientAsyncTable));
</script>
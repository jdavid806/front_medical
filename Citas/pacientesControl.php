<?php
include "../menu.php";
include "../header.php";
?>
<style>
.container-small {
   max-width: 100% !important;
   width: 100%;
        padding: 0 15px;
   margin: 0;
  }
 .breadcrumb {
        font-size: 0.9rem;
        padding: 1rem 1.5rem;
        margin: 1rem 0 2rem 0;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }
 
 .content {
        padding: calc(var(--phoenix-navbar-top-height) + 0.2rem) 1.5rem 6.375rem 1.5rem; 
   }

    html[data-bs-theme="dark"] .breadcrumb {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-6" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="citasControl">Control citas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div class="d-flex align-items-center justify-content-between">
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
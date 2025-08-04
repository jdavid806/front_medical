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
                <li class="breadcrumb-item active" onclick="location.reload()">Post Consulta</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div class="d-flex align-items-center justify-content-between mb-3"> 
                    <h2>Post Consulta</h2>
                </div>        
                <div id="citasFinalizadasReact"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        AppointmentsFinishedTable
    } from './react-dist/appointments/AppointmentsFinishedTable.js';

    ReactDOMClient.createRoot(document.getElementById('citasFinalizadasReact')).render(React.createElement(AppointmentsFinishedTable));
</script>

<?php
include "../footer.php";
?>
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
                <li class="breadcrumb-item active" onclick="location.reload()">Facturación</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <h2 class="mb-3">Facturación</h2>
                <div id="admissionsTableReact"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        TodayAppointmentsTable
    } from './react-dist/appointments/TodayAppointmentsTable.js';

    ReactDOMClient.createRoot(document.getElementById('admissionsTableReact')).render(
        React.createElement(TodayAppointmentsTable)
    );
</script>

<?php
include "../footer.php";
?>
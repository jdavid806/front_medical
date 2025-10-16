<?php
include "../menu.php";
include "../header.php";
?>
<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="citasControl">Control citas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Citas</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">   
                <div id="appointmentsTableReact"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        AppointmentCreateFormModalButton
    } from './react-dist/appointments/AppointmentCreateFormModalButton.js';
    import {
        AppointmentsTable
    } from './react-dist/appointments/AppointmentsTable.js';

    ReactDOMClient.createRoot(document.getElementById('appointmentsTableReact')).render(React.createElement(
        AppointmentsTable));
    ReactDOMClient.createRoot(document.getElementById('appointmentCreateFormModalButtonReact')).render(React.createElement(AppointmentCreateFormModalButton));
</script>

<?php
include "../footer.php";
?>
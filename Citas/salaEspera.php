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
                <li class="breadcrumb-item active" onclick="location.reload()">Sala de Espera</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div class="d-flex align-items-center justify-content-between"> 
                    <h2>Sala de Espera</h2>
                    <div id="appointmentCreateFormModalButtonReact"></div>
                </div>    
                <div id="LobbyAppointments"></div>
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
        LobbyAppointments
    } from './react-dist/appointments/LobbyAppointments.js';

    ReactDOMClient.createRoot(document.getElementById('LobbyAppointments')).render(React.createElement(
        LobbyAppointments));
    ReactDOMClient.createRoot(document.getElementById('appointmentCreateFormModalButtonReact')).render(React.createElement(AppointmentCreateFormModalButton));
</script>

<?php
include "../footer.php";
?>
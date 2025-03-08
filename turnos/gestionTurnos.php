<?php
include "../menu.php";
include "../header.php";
?>

<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Control de turnos</li>
                </ol>
            </nav>
            <div class="row mt-4">
                <ul class="nav nav-underline fs-9 p-3" id="turnosTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" id="turnos-tab" data-bs-toggle="tab" href="#turnos" role="tab">
                            <i class="fas fa-random"></i> Generar turno
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link" id="turnosGestion-tab" data-bs-toggle="tab" href="#turnosGestion" role="tab">
                            <i class="fas fa-ticket-alt"></i> Turnos
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link" id="turnosConfiguracion-tab" data-bs-toggle="tab" href="#turnosConfiguracion" role="tab">
                            <i class="fas fa-cog"></i> Configuración
                        </a>
                    </li>
                </ul>
                <div class="tab-content mt-3" id="turnosTabsContent">
                    <div class="tab-pane fade show active" id="turnos" role="tabpanel">
                        <div id="generateTicketReact"></div>
                    </div>
                    <div class="tab-pane fade" id="turnosGestion" role="tabpanel">
                        <div id="gestionarTicketsReact"></div>
                    </div>
                    <div class="tab-pane fade" id="turnosConfiguracion" role="tabpanel">
                        <div id="gestionarModulosReact"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        GenerateTicket
    } from './react-dist/tickets/GenerateTicket.js';
    import {
        TicketApp
    } from './react-dist/tickets/TicketApp.js';
    import {
        ModuleApp
    } from './react-dist/modules/ModuleApp.js';

    ReactDOMClient.createRoot(document.getElementById('generateTicketReact')).render(React.createElement(GenerateTicket));
    ReactDOMClient.createRoot(document.getElementById('gestionarTicketsReact')).render(React.createElement(TicketApp));
    ReactDOMClient.createRoot(document.getElementById('gestionarModulosReact')).render(React.createElement(ModuleApp));
</script>

<?php
include "../footer.php";
?>

<script src="./assets/js/main.js"></script>
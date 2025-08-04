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
                    <li class="breadcrumb-item"><a href="homeTurnos">Turnos</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Control de turnos</li>
                </ol>
            </nav>
            <div id="gestionarTicketsReact"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        TicketApp
    } from './react-dist/tickets/TicketApp.js';
    ReactDOMClient.createRoot(document.getElementById('gestionarTicketsReact')).render(React.createElement(TicketApp));
</script>

<?php
include "../footer.php";
?>

<script src="./assets/js/main.js"></script>
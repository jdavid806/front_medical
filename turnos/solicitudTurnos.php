<?php
include "../menu.php";
include "../header.php";
?>

<div class="componente">
    <div class="content">
    <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeTurnos">Turnos</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Solicitud de turnos</li>
            </ol>
        </nav>
        <div class="container-small">
        <div id="generateTicketReact"></div>   
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        GenerateTicket
    } from './react-dist/tickets/GenerateTicket.js';

    ReactDOMClient.createRoot(document.getElementById('generateTicketReact')).render(React.createElement(GenerateTicket));
</script>

<?php
include "../footer.php";
?>

<script src="./assets/js/main.js"></script>
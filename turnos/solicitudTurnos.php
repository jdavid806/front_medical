<?php
include "../menu.php";
include "../header.php";
?>
<style>
  .custom-btn {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }
   .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }

  .custom-btn i {
    margin-right: 5px;
  }
</style>
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
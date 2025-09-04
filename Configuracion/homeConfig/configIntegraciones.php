<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeConfiguracion">Configuración</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Configuración de Integraciones</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h2>Configuración de Integraciones</h2>
                </div>
                <div id="integracionesReactRoot"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        IntegrationsApp
    } from './react-dist/integrations/IntegrationsApp.js';

    const rootElement = document.getElementById('integracionesReactRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(IntegrationsApp));
</script>

<?php
include "../../footer.php";
?>
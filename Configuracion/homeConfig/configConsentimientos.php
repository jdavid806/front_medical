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
                <li class="breadcrumb-item active" onclick="location.reload()">Consentimientos</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="consentimiento">

                </div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import ConsentimientoApp from './react-dist/config/consentimiento/ConsentimientoApp.js';

    const rootElement = document.getElementById('consentimiento');
    if (rootElement) {

        ReactDOMClient.createRoot(rootElement).render(
            React.createElement(ConsentimientoApp)
        );
    }
</script>
<?php
include "../modales/modalAgregarPlantillaConsentimiento.php";
include "../../footer.php";
?>
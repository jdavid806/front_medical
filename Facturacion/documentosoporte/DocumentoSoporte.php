<?php
include "../../menu.php";
include "../../header.php";
?>

<style>
    /* Estilos generales para el contenedor principal */
    .componente .content {
        max-width: 100%;
        width: 100%;
        margin: 0 auto;
    }

    /* Ajustes para el breadcrumb */
    .breadcrumb {
        max-width: 100%;
        overflow-x: hidden;
    }

    /* Ajustes para el título y botones */
    .row.mt-4 {
        max-width: 100%;
        width: 100%;
    }

    /* Asegurar que el contenedor principal no cause overflow */
    .container-small {
        max-width: 100%;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="FE_FCE">Facturacion</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Documento Soportes</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <h2>Documento Soportes</h2>
                <div id="FormDocumentSupport"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { FormDocumentSupport } from './react-dist/invoices/form/FormDocumentSupport.js';

    ReactDOMClient.createRoot(document.getElementById('FormDocumentSupport')).render(
        React.createElement(FormDocumentSupport)
    );
</script>
<?php
include "../../footer.php";
?>
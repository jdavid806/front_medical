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
                <li class="breadcrumb-item"><a href="configContabilidad">Configuración Contable
                    </a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Impuestos</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <div id="TaxesConfig"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { TaxesConfig } from './react-dist/config-accounting/taxes/TaxesConfig.js';

    ReactDOMClient.createRoot(document.getElementById('TaxesConfig')).render(
        React.createElement(TaxesConfig)
    );
</script>
<?php
include "../../footer.php";
?>
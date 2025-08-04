<?php
include "../../menu.php";
include "../../header.php";
?>

<style>
    /* Asegurar que el contenedor principal no cause overflow */
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
                <li class="breadcrumb-item"><a href="homeContabilidad">Contablidad</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Gestionar Terceros</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <h2>Gestionar Terceros</h2>
                <div id="tablaTerceros"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { ThridPartiesTable } from './react-dist/billing/third-parties/table/ThridPartiesTable.js';

    ReactDOMClient.createRoot(document.getElementById('tablaTerceros')).render(
        React.createElement(ThridPartiesTable)
    );
</script>
<?php
include "../../footer.php";
?>
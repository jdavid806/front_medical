<?php
include "../../../menu.php";
include "../../../header.php";


?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Estado De Resultados</li>
            </ol>
        </nav>
        <div class="container">
            <div id="estadoResultados"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        StatusResult
    } from './react-dist/billing/reports/StatusResult.js';

    ReactDOMClient.createRoot(document.getElementById('estadoResultados')).render(React.createElement(StatusResult));
</script>



<?php include "../../../footer.php"; ?>
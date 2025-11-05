<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">

        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Reportes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Bonificaciones</li>
            </ol>
        </nav>
        <div id="report-commissions"></div>

    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        Commissions
    } from './react-dist/reports/Commissions.js';

    ReactDOMClient.createRoot(document.getElementById('report-commissions')).render(React.createElement(Commissions));
</script>

<?php
include "../../footer.php";
?>
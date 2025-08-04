<?php
include "../menu.php";
include "../header.php";

?>
<div class="componete">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeAuditoria">Auditoria</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Logs</li>
            </ol>
        </nav>
        <div class="row g-0 g-md-4 g-xl-6 p-5 justify-content-center">
            <div class="col-md-12 col-lg-12 col-xl-12">
                <div class="container mt-4 w-100 mw-100">
                    <div id="logsAuditoriaAppReact"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        AuditLogsApp
    } from './react-dist/audit/AuditLogsApp.js';

    ReactDOMClient.createRoot(document.getElementById('logsAuditoriaAppReact')).render(React.createElement(AuditLogsApp));
</script>

<?php
include "../footer.php";
?>
<?php
include "../menu.php";
include "../header.php";
?>

<style>
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
                <li class="breadcrumb-item"><a href="homeContabilidad">Configuracion Empresa</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Empresa</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <h2>Configuracion Sistema</h2>
                <div id="CompanyConfiguration"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { CompanyConfiguration } from './react-dist/config/company-configuration/CompanyConfiguration.js';

    ReactDOMClient.createRoot(document.getElementById('CompanyConfiguration')).render(
        React.createElement(CompanyConfiguration)
    );
</script>
<?php
include "../footer.php";
?>
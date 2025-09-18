<?php
include "../../menu.php";
include "../../header.php";
?>

<style>
.componente .content {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
}

.breadcrumb {
    max-width: 100%;
    overflow-x: hidden;
}

.row.mt-4 {
    max-width: 100%;
    width: 100%;
}

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
                <li class="breadcrumb-item active" onclick="location.reload()">Retenciones</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <div id="RetentionConfig"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
import React from "react"
import ReactDOMClient from "react-dom/client"
import {
    RetentionConfig
} from './react-dist/config-accounting/retention/RetentionConfig.js';

ReactDOMClient.createRoot(document.getElementById('RetentionConfig')).render(
    React.createElement(RetentionConfig)
);
</script>
<?php
include "../../footer.php";
?>
<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="configContabilidad">Configuración Contable
                    </a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Métodos de Pago</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <div id="PaymentMethodsConfig"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { PaymentMethodsConfig } from './react-dist/config-accounting/paymentmethods/PaymentMethodsConfig.js';

    ReactDOMClient.createRoot(document.getElementById('PaymentMethodsConfig')).render(
        React.createElement(PaymentMethodsConfig)
    );
</script>
<?php
include "../../footer.php";
?>
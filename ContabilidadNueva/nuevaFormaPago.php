<?php
include "../menu.php";
include "../header.php";
?>




<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Nueva Forma De Pago</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <h2>Contable</h2>
                <div id="newpaymentMethod"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import { NewPaymentMethod } from './react-dist/accounting/paymentReceipt/NewPaymentMethod.js';

    ReactDOMClient.createRoot(document.getElementById('newpaymentMethod')).render(
        React.createElement(NewPaymentMethod)
    );
</script>

<?php
include "../footer.php";
?>
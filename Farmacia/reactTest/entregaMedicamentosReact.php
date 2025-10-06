<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div id="entregaMedicamentosRoot"></div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        ProductsDelivery
    } from './react-dist/pharmacy/medication-delivery/MedicationsDelivery.js';

    const rootElement = document.getElementById('entregaMedicamentosRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(ProductsDelivery));
</script>

<?php include "../../footer.php"; ?>
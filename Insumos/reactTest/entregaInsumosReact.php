<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div id="entregaInsumosRoot"></div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        ProductsDelivery
    } from './react-dist/pharmacy/delivery/ProductsDelivery.js';

    const rootElement = document.getElementById('entregaInsumosRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(ProductsDelivery));
</script>

<?php include "../../footer.php"; ?>
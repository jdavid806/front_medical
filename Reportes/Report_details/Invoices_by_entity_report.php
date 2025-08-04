<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">

    <div id="report-invoices-entity"></div>

</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        InvoicesByEntity
    } from './react-dist/reports/InvoicesByEntity.js';

    ReactDOMClient.createRoot(document.getElementById('report-invoices-entity')).render(React.createElement(InvoicesByEntity));
</script>

<?php
include "../../footer.php";
?>
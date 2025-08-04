<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">

    <div id="report-invoices-doctors"></div>

</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        SpecialistsReport
    } from './react-dist/reports/InvoicesDoctors.js';

    ReactDOMClient.createRoot(document.getElementById('report-invoices-doctors')).render(React.createElement(SpecialistsReport));
</script>

<?php
include "../../footer.php";
?>
<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">

    <div id="report-invoices"></div>

</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        InvoicesReport
    } from './react-dist/reports/Invoices.js';

    ReactDOMClient.createRoot(document.getElementById('report-invoices')).render(React.createElement(InvoicesReport));
</script>

<?php
include "../../footer.php";
?>
<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">

        <div id="report-clinical-record"></div>

    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        ClinicalRecord
    } from './react-dist/reports/ClinicalRecord.js';

    ReactDOMClient.createRoot(document.getElementById('report-clinical-record')).render(React.createElement(ClinicalRecord));
</script>

<?php
include "../../footer.php";
?>
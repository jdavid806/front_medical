<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">

        <div id="report-appointments"></div>

    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        Appointments
    } from './react-dist/reports/Appointments.js';

    ReactDOMClient.createRoot(document.getElementById('report-appointments')).render(React.createElement(Appointments));
</script>

<?php
include "../../footer.php";
?>